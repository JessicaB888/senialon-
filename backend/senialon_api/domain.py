"""Persistencia y orquestación BE para el contrato 1.0.0."""
import base64
import copy
import json
from decimal import Decimal
from uuid import uuid4

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from analysis.core import (VERSIONS, DIMENSIONS, stage, unavailable, derive_windows, period,
                           coverage, compare_topics, signal_reference)
from analysis.criteria import CORPUS
from analysis.criteria import RULES_VERSION
from .contract import validate
from .db import Run, Step, Budget, Operation, Delivery, ProviderCall, now
from .gateway import digest, DomainError
from .providers.adapters import duration_seconds


def timestamp():
    return now().isoformat()


class Fault(Exception):
    def __init__(self, code, message, status=409, operation=None, revision=None):
        self.code, self.message, self.status, self.operation, self.revision = code, message, status, operation, revision


def require(ok, message='La versión cambió. Recupera el recurso antes de continuar.', code='VERSION_CONFLICT', status=409, revision=None):
    if not ok:
        raise Fault(code, message, status, revision=revision)


class BoundPort:
    """Adaptador inyectado: identidad de subpaso independiente de la entrega HTTP."""
    def __init__(self, providers, mode, unit):
        self.providers, self.mode, self.unit, self.attempt = providers, mode, unit, None

    def jev(self, state, questions):
        self.attempt = {'provider': 'jev', 'submission_state': 'not_sent', 'attempted_at': timestamp(),
                        'model': None, 'provider_request_id': None, 'question': json.dumps(questions, ensure_ascii=False),
                        'input_text': json.dumps(state, ensure_ascii=False), 'raw_response_text': None,
                        'criteria_version': RULES_VERSION, 'question_version': RULES_VERSION+':'+next(iter(questions))}
        return self.providers.jev(state, questions, self.mode, self.unit)

    def gemini(self, prompt, context, schema, purpose, video_url=None):
        return self.providers.gemini(prompt, context, schema, self.mode, self.unit+':'+purpose, video_url=video_url)


class Domain:
    def __init__(self, sessions, providers, config):
        self.sessions, self.providers, self.config = sessions, providers, config

    @staticmethod
    def load(db, run_id, lock=False):
        query = select(Run).where(Run.id == run_id)
        row = db.scalar(query.with_for_update() if lock else query)
        if row is None:
            raise Fault('NOT_FOUND', 'Ejecución no encontrada.', 404)
        return row, copy.deepcopy(row.data)

    def budget(self, db):
        b = db.get(Budget, 'demo')
        reserved = b.reserved_usd if b else Decimal('0')
        c = self.config
        limit = min(c.budget_usd, c.available_balance_usd or c.budget_usd)
        configured = c.paid_calls_enabled and c.available_balance_usd is not None and bool(c.pricing_reference)
        uncertain = db.scalar(select(ProviderCall.id).where(ProviderCall.status.in_(['uncertain', 'running'])).limit(1)) is not None
        return {'currency': 'USD', 'incremental_limit': '20.00', 'state': 'uncertain' if uncertain else 'allowed' if configured and reserved+c.confirmed_external_spend_usd < limit else 'check_required' if not configured else 'blocked',
                'reason': 'Reserva conservadora; no equivale a facturación verificada.' if configured else 'Verificar tarifa, saldo y reserva por proveedor.',
                'confirmed_new_charges': f'{c.confirmed_external_spend_usd:.6f}', 'reserved': f'{reserved:.6f}',
                'available_for_new_calls': f'{max(Decimal(0), limit-reserved-c.confirmed_external_spend_usd):.6f}' if configured else None}

    def references(self, db, run_id, analysis_id=None):
        ops = [o.data for o in db.scalars(select(Operation).where(Operation.run_id == run_id))]
        return [{k: o[k] for k in ('operation_id', 'run_id', 'analysis_id', 'state', 'stage', 'updated_at')}
                for o in sorted(ops, key=lambda x: (x['updated_at'], x['operation_id']), reverse=True)
                if o['state'] != 'succeeded' and (analysis_id is None or o['analysis_id'] == analysis_id)]

    def view_run(self, db, data):
        r = copy.deepcopy(data['run'])
        r['budget'], r['operations_to_inspect'] = self.budget(db), self.references(db, r['run_id'])
        r['allowed_actions'] = self.run_actions(data, r['operations_to_inspect'])
        return validate('Run', r)

    @staticmethod
    def run_actions(data, refs):
        if refs:
            return []
        groups = data['groups']['proposal']
        actions = ['select_analysis'] if any(v['eligibility'] == 'eligible' for v in data['publications'].values()) else []
        if groups is None:
            actions.append('advance_corpus')
        elif groups['confirmation'] is None:
            actions.append('confirm_groups')
        elif data['comparison']['computed_at'] is None:
            actions.append('advance_comparison')
        return actions

    def mutate(self, scope, key, body, action, status=200):
        """Replay de solicitud antes de comprobar revisiones. Reclamo atómico duradero."""
        identity, fingerprint = digest([scope, key]), digest(body)
        def recovered(previous):
            if '_fault' in previous.response:
                f = previous.response['_fault']
                raise Fault(f['code'], f['message'], previous.status_code, operation=f['operation'], revision=f['revision'])
            return copy.deepcopy(previous.response), previous.status_code
        try:
            with self.sessions() as db:
                previous = db.get(Delivery, identity)
                if previous:
                    require(previous.fingerprint == fingerprint, 'La misma clave ya se usó con otro cuerpo.', 'IDEMPOTENCY_KEY_REUSED')
                    require(previous.response is not None, 'La solicitud sigue en curso; consulta la ejecución.', 'OPERATION_IN_PROGRESS')
                    return recovered(previous)
                db.add(Delivery(id=identity, fingerprint=fingerprint))
                try:
                    result, code = action(db)
                except Fault as exc:
                    db.rollback()
                    with self.sessions() as failure_db:
                        failure_db.add(Delivery(id=identity, fingerprint=fingerprint, status_code=exc.status,
                            response={'_fault': {'code': exc.code, 'message': exc.message, 'operation': exc.operation, 'revision': exc.revision}}))
                        failure_db.commit()
                    raise
                delivery = db.get(Delivery, identity)
                delivery.response, delivery.status_code = result, code or status
                db.commit()
                return result, code or status
        except IntegrityError:
            # Otro proceso reclamó el mismo alcance/clave. No se repite el efecto.
            with self.sessions() as db:
                previous = db.get(Delivery, identity)
                require(previous is not None and previous.fingerprint == fingerprint, 'Clave concurrente incompatible.', 'IDEMPOTENCY_KEY_REUSED')
                require(previous.response is not None, 'Solicitud en curso. Consulta la ejecución.', 'OPERATION_IN_PROGRESS')
                return recovered(previous)

    def create(self, key, body):
        def action(db):
            require(self.config.api_mode != 'replay', 'Una nueva ejecución usa sus fechas reales. Replay requiere registros compatibles ya identificados; no se crean datos nuevos desde registros anteriores.', 'FEATURE_UNAVAILABLE', 503)
            at, run_id = timestamp(), str(uuid4())
            r = {'run_id': run_id, 'revision': 1, 'started_at': at, 'updated_at': at,
                 'windows': derive_windows(at), 'corpus': [{'source_id': f'source-{i+1}', 'original_url': url,
                 'resolved_channel_id': None, 'resolution': stage('pending', 'Canal por resolver.')} for i, url in enumerate(CORPUS)],
                 'versions': VERSIONS.copy(), 'workflow': stage('pending', 'Adquisición no iniciada.'), 'current_stage': 'acquisition',
                 'last_checkpoint': None, 'allowed_actions': [], 'budget': self.budget(db), 'operations_to_inspect': []}
            data = {'run': r, 'publications': {}, 'analyses': {}, 'channels': {s['source_id']: {'complete': False, 'pages': 0, 'cursor': None, 'playlist': None, 'error': None} for s in r['corpus']},
                    'groups': {'run_id': run_id, 'stage': stage(), 'proposal': None}}
            data['comparison'] = compare_topics(data, None, None)
            db.add(Run(id=run_id, mode=self.config.api_mode, data=data))
            db.flush()
            return {'data': self.view_run(db, data)}, 201
        return self.mutate('createRun', key, body, action)

    def read(self, run_id):
        with self.sessions() as db:
            _, data = self.load(db, run_id)
            return self.view_run(db, data)

    def data(self, run_id):
        with self.sessions() as db:
            return self.load(db, run_id)[1]

    @staticmethod
    def page(items, cursor, limit, revision=None, list_runs=False):
        position = 0
        anchor = None
        if cursor:
            try:
                token = json.loads(base64.urlsafe_b64decode(cursor+'='*(-len(cursor)%4)))
                require(isinstance(token, list) and len(token) == 2,
                        'Cursor inválido.', 'VALIDATION_ERROR', 422)
                if list_runs:
                    anchor = token[1]
                    require(isinstance(anchor, list) and len(anchor) == 2
                            and all(isinstance(item, str) for item in anchor),
                            'Cursor inválido.', 'VALIDATION_ERROR', 422)
                    items = [i for i in items if (i['started_at'], i['run_id']) <= tuple(anchor)]
                else:
                    require(token[1] == revision)
                position = token[0]
                require(type(position) is int and position >= 0, 'Cursor inválido.', 'VALIDATION_ERROR', 422)
            except (ValueError, KeyError, TypeError, IndexError):
                raise Fault('VALIDATION_ERROR', 'Cursor inválido.', 422) from None
        if list_runs and items and anchor is None:
            anchor = [items[0]['started_at'], items[0]['run_id']]
        end = position+limit
        token = [end, anchor if list_runs else revision]
        next_cursor = base64.urlsafe_b64encode(json.dumps(token, separators=(',', ':')).encode()).decode().rstrip('=') if end < len(items) else None
        return {'items': items[position:end], 'next_cursor': next_cursor, 'snapshot_revision': revision}

    def listing(self, run_id, kind, cursor, limit):
        with self.sessions() as db:
            if run_id is None:
                rows = list(db.scalars(select(Run).order_by(Run.created_at.desc(), Run.id.desc())))
                items = [self.view_run(db, row.data) for row in rows]
                return self.page(items, cursor, limit, list_runs=True)
            _, data = self.load(db, run_id)
            if kind == 'videos':
                items = sorted((v for v in data['publications'].values() if v['eligibility'] == 'eligible'), key=lambda v: v['video_id'])
            else:
                items = []
                for versions in data['analyses'].values():
                    a = versions[-1]
                    items.append({'analysis_id': a['analysis_id'], 'analysis_version': a['analysis_version'], 'video_id': a['publication']['video_id'], 'created_at': a['created_at'], 'audiovisual': a['audiovisual']})
                items.sort(key=lambda a: a['analysis_id'])
            return self.page(items, cursor, limit, data['run']['revision'])

    @staticmethod
    def bump(data):
        data['run']['revision'] += 1
        data['run']['updated_at'] = timestamp()

    def confirm(self, run_id, key, body):
        def action(db):
            row, data = self.load(db, run_id, True)
            require(body['expected_run_revision'] == data['run']['revision'], revision=data['run']['revision'])
            require(not self.references(db, run_id), 'Hay una operación pendiente de conciliación.', 'OPERATION_IN_PROGRESS')
            g = data['groups']['proposal']
            require(g and g['groups_id'] == body['groups_id'] and g['groups_version'] == body['groups_version'])
            if g['confirmation'] is None:
                g.update(state='confirmed', confirmation={'confirmation_id': str(uuid4()), 'groups_id': g['groups_id'], 'groups_version': g['groups_version'], 'confirmed_at': timestamp(), 'actor': 'shared_demo_operator'})
                self.bump(data)
                data['run'].update(current_stage='comparison', workflow=stage('pending', 'Comparación por solicitar.'))
                data['comparison'] = compare_topics(data, None, None)
                row.data = data
            return {'data': data['groups']}, 200
        return self.mutate('confirmGroups:'+run_id, key, body, action)

    def select(self, run_id, key, body):
        def action(db):
            row, data = self.load(db, run_id, True)
            # Selección repetida con otra clave recupera la misma identidad sin procesar.
            existing = next((a[-1] for a in data['analyses'].values() if a[-1]['publication']['video_id'] == body['video_id']), None)
            if existing:
                return self.analysis_envelope(db, data, existing['analysis_id']), 200
            require(not any(o['state'] == 'running' for o in self.references(db, run_id)), 'Hay una unidad en curso; consulta su estado antes de seleccionar.')
            require(body['expected_run_revision'] == data['run']['revision'], revision=data['run']['revision'])
            publication = data['publications'].get(body['video_id'])
            require(publication and publication['eligibility'] == 'eligible', 'Publicación no elegible.', 'NOT_ELIGIBLE', 422)
            a = self.initial_analysis(data, publication)
            data['analyses'][a['analysis_id']] = [a]
            self.bump(data)
            row.data = data
            return self.analysis_envelope(db, data, a['analysis_id']), 201
        return self.mutate('selectAnalysis:'+run_id, key, body, action)

    @staticmethod
    def initial_analysis(data, publication):
        at, identity = timestamp(), str(uuid4())
        groups = data['groups']['proposal']
        a = {'analysis_id': identity, 'analysis_version': 1, 'run_id': data['run']['run_id'], 'created_at': at, 'version_created_at': at,
             'publication': copy.deepcopy(publication), 'windows': data['run']['windows'], 'versions': data['run']['versions'],
             'groups_id': groups['groups_id'] if groups else None, 'groups_version': groups['groups_version'] if groups else None,
             'signal': signal_reference(publication, data['comparison']),
             'performance': {'state': 'not_evaluable', 'reason': 'Una captura de métricas no acredita desempeño.', 'capture_id': publication['capture_id']},
             'material': [], 'audiovisual': stage(), 'dimensions': [{'dimension': d, 'stage': stage(), 'description': None, 'evidence_ids': []} for d in DIMENSIONS],
             'evidence': copy.deepcopy(publication['evidence']), 'problem_or_learning': None,
             'value': unavailable(), 'affinity': {k: unavailable() for k in ('persona', 'company_context', 'pillar')},
             'hypotheses': [], 'adaptation': {'stage': stage(), 'angle': None, 'expected_contribution': None,
             'proposed_hook': None, 'proposed_structure': [], 'proposed_cta': None, 'limitations': []}, 'model_uses': [], 'allowed_actions': ['advance_analysis', 'record_review']}
        a['review'] = Domain.initial_review(a)
        return validate('Analysis', a)

    @staticmethod
    def initial_review(a):
        return {'review_id': str(uuid4()), 'run_id': a['run_id'], 'analysis_id': a['analysis_id'], 'analysis_version': a['analysis_version'],
                'revision': 1, 'decision': 'pending_review', 'reason': None, 'updated_at': timestamp(), 'actor': 'shared_demo_operator',
                'evidence_reviews': [{'evidence_id': e['evidence_id'], 'state': 'pending_review', 'note': None} for e in a['evidence']]}

    def analysis_envelope(self, db, data, analysis_id, version=None):
        versions = data['analyses'].get(analysis_id)
        require(versions is not None, 'Análisis no encontrado.', 'NOT_FOUND', 404)
        a = next((a for a in versions if a['analysis_version'] == version), None) if version else versions[-1]
        require(a is not None, 'Versión no encontrada.', 'NOT_FOUND', 404)
        historical = a['analysis_version'] != versions[-1]['analysis_version']
        refs = [] if historical else self.references(db, data['run']['run_id'], analysis_id)
        done = a['adaptation']['stage']['state'] in ('complete', 'insufficient')
        return {'data': copy.deepcopy(a), 'operations_to_inspect': refs,
                'current_actions': [] if historical or any(o['state'] == 'running' for o in refs) else ['record_review'] if refs or done else ['advance_analysis', 'record_review']}

    def analysis(self, run_id, analysis_id, version=None):
        with self.sessions() as db:
            _, data = self.load(db, run_id)
            return self.analysis_envelope(db, data, analysis_id, version)

    def review(self, run_id, analysis_id, key, body):
        def action(db):
            row, data = self.load(db, run_id, True)
            envelope = self.analysis_envelope(db, data, analysis_id)
            a = data['analyses'][analysis_id][-1]
            require(not any(o['state'] == 'running' for o in self.references(db, run_id)), 'Hay una unidad en curso; consulta su estado antes de revisar.')
            require(body['expected_analysis_version'] == a['analysis_version'] and body['expected_review_revision'] == a['review']['revision'], revision=a['review']['revision'])
            require(bool(body['reason'].strip()), 'Escribe un motivo de revisión.', 'VALIDATION_ERROR', 422)
            ids = [e['evidence_id'] for e in body['evidence_reviews']]
            require(len(ids) == len(set(ids)) and set(ids) == {e['evidence_id'] for e in a['evidence']}, 'Debe revisar cada evidencia exactamente una vez.', 'VALIDATION_ERROR', 422)
            a['review'] = {**a['review'], 'revision': a['review']['revision']+1, 'decision': body['decision'], 'reason': body['reason'],
                           'evidence_reviews': body['evidence_reviews'], 'updated_at': timestamp()}
            self.bump(data)
            row.data = data
            return {'data': a['review']}, 200
        return self.mutate('recordReview:'+run_id+':'+analysis_id, key, body, action)

    def operation(self, run_id, operation_id):
        with self.sessions() as db:
            row = db.get(Operation, operation_id)
            require(row is not None and row.run_id == run_id, 'Operación no encontrada.', 'NOT_FOUND', 404)
            result = copy.deepcopy(row.data)
            result['budget'] = self.budget(db)
            return result

    def advance(self, run_id, key, body):
        from .work import advance
        return advance(self, run_id, key, body)
