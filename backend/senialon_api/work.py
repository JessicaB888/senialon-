"""Una unidad explícita por POST. GET no realiza llamadas ni mutaciones."""
import copy
import json
from uuid import uuid4
from sqlalchemy import select

from analysis.core import (DIMENSIONS, RULES_VERSION, coverage, compare_topics, stage, unavailable, period)
from analysis.inference import classify_ai, propose, observe, synthesize, model_use
from analysis.context import AnalysisInputError
from .contract import validate
from .domain import BoundPort, Fault, require, timestamp
from .db import Operation, Step, ProviderCall
from .gateway import digest, DomainError
from .providers.adapters import duration_seconds


def next_unit(data, target):
    if target['scope'] == 'comparison':
        require(data['groups']['proposal'] and data['groups']['proposal']['confirmation'], 'Confirma los grupos antes de calcular.', 'GROUPS_NOT_CONFIRMED')
        return 'comparison', data['groups']['proposal']['groups_id'], None, data['groups']['proposal']['groups_version']
    if target['scope'] == 'analysis':
        versions = data['analyses'].get(target['analysis_id'])
        require(versions is not None, 'Análisis no encontrado.', 'NOT_FOUND', 404)
        a = versions[-1]
        require(target['expected_analysis_version'] == a['analysis_version'])
        if a['audiovisual']['state'] == 'not_requested':
            purpose = 'audiovisual'
        elif a['value']['state'] == 'not_requested':
            purpose = 'value'
        else:
            purpose = next((k for k in ('persona', 'company_context', 'pillar') if a['affinity'][k]['state'] == 'not_requested'), 'synthesis')
        require(a['adaptation']['stage']['state'] == 'not_requested', 'Análisis finalizado; no se repite el consumo.', 'VERSION_CONFLICT')
        return purpose, a['publication']['video_id'], a['analysis_id'], a['analysis_version']
    for source in data['run']['corpus']:
        c = data['channels'][source['source_id']]
        if not c['complete']:
            return ('resolve' if not c['playlist'] else 'acquisition'), source['source_id'], None, c['pages']
    for p in data['publications'].values():
        if p['eligibility'] == 'pending' and p['duration']['state'] == 'known' and p['published_at'] and p['public_state'] == 'confirmed_public' and p['ai_relevance']['state'] == 'not_requested':
            return 'ia_relevance', p['video_id'], None, p['capture_id']
    require(data['groups']['proposal'] is None, 'La propuesta ya está disponible; confirma su versión.')
    return 'grouping', None, None, digest(data['publications'])


def advance(domain, run_id, key, body):
    def action(db):
        row, data = domain.load(db, run_id, True)
        require(body['expected_run_revision'] == data['run']['revision'], revision=data['run']['revision'])
        refs = domain.references(db, run_id)
        if refs:
            op = domain.operation(run_id, refs[0]['operation_id'])
            raise Fault('PROVIDER_RESULT_UNCERTAIN' if op['state'] == 'uncertain' else 'OPERATION_IN_PROGRESS',
                        'Hay una operación retenida. Consulta su estado; requiere conciliación antes de repetir.', operation=op)
        purpose, item, analysis_id, input_version = next_unit(data, body['target'])
        identity = digest([run_id, purpose, item, input_version, RULES_VERSION])
        previous = db.get(Operation, identity)
        if previous:
            return {'data': previous.data}, 202 if previous.data['state'] == 'running' else 200
        at = timestamp()
        op = {'operation_id': identity, 'run_id': run_id, 'analysis_id': analysis_id, 'stage': purpose, 'item_id': item,
              'input_version': str(input_version), 'state': 'running', 'requested_at': at, 'updated_at': at, 'reason': None,
              'last_checkpoint': None, 'run_revision': data['run']['revision'],
              'analysis_version': input_version if analysis_id else None, 'retry_policy': 'none', 'budget': domain.budget(db)}
        db.add(Operation(id=identity, run_id=run_id, data=op))
        db.add(Step(id=identity, run_id=run_id, stage=purpose, status='running'))
        db.flush()
        # Persistir entrega + operación antes del envío. La ejecución permite descubrirla si se pierde el POST.
        from .db import Delivery
        delivery = db.get(Delivery, digest(['advanceRun:'+run_id, key]))
        delivery.response, delivery.status_code = {'data': copy.deepcopy(op)}, 202
        db.commit()
        port = BoundPort(domain.providers, row.mode, identity)
        error = None
        try:
            execute(domain, data, purpose, item, analysis_id, port, at)
            # Validar todo antes de persistir un checkpoint.
            for p in data['publications'].values():
                validate('Publication', p)
            validate('GroupView', data['groups'])
            validate('Comparison', data['comparison'])
            for versions in data['analyses'].values():
                for a in versions:
                    validate('Analysis', a)
        except Exception as exc:
            error = exc
        with domain.sessions() as final:
            current_row, original = domain.load(final, run_id, True)
            step = final.get(Step, identity)
            if error is not None:
                calls = [c for c in final.scalars(select(ProviderCall)) if c.request.get('operation_id') == identity]
                # El ID estable de unidad queda en request.operation_id, nunca contiene secretos.
                sent = bool(calls)
                state = 'uncertain' if sent else 'blocked' if isinstance(error, DomainError) else 'failed'
                message = error.message if isinstance(error, (DomainError, Fault)) else str(error) if isinstance(error, AnalysisInputError) else 'No se pudo validar la salida de esta unidad; se conserva el resultado anterior.'
                op.update(state=state, reason=message, retry_policy='manual_reconciliation_required' if sent else 'none')
                if purpose in ('resolve', 'acquisition'):
                    original['channels'][item]['error'] = message
                attempt = port.attempt
                if attempt and sent:
                    raw = calls[-1].raw_response
                    model = raw.get('model') if isinstance(raw, dict) else None
                    attempt.update(submission_state='sent' if raw is not None else 'unknown',
                                   model=model if isinstance(model, str) and model else None,
                                   raw_response_text=json.dumps(raw, ensure_ascii=False) if raw is not None else None)
                if purpose == 'ia_relevance':
                    original['publications'][item]['ai_relevance'] = unavailable(state, message, attempt)
                    original['publications'][item].update(eligibility='pending', eligibility_reason=message)
                if analysis_id:
                    a = copy.deepcopy(original['analyses'][analysis_id][-1])
                    a['analysis_version'] += 1
                    a['version_created_at'] = timestamp()
                    if purpose == 'audiovisual':
                        a['audiovisual'] = stage(state, message)
                        for dimension in a['dimensions']:
                            dimension['stage'] = stage(state, message)
                    elif purpose == 'value':
                        a['value'] = unavailable(state, message, attempt)
                    elif purpose in a['affinity']:
                        a['affinity'][purpose] = unavailable(state, message, attempt)
                    else:
                        a['adaptation']['stage'] = stage(state, message)
                    a['review'] = domain.initial_review(a)
                    validate('Analysis', a)
                    original['analyses'][analysis_id].append(a)
                    op['analysis_version'] = a['analysis_version']
                if purpose == 'grouping':
                    original['groups']['stage'] = stage(state, message)
                original['run'].update(workflow=stage(state, message))
                data = original
                step.status, step.error = state, message
            else:
                op.update(state='succeeded', reason=None, last_checkpoint={'operation_id': identity, 'stage': purpose, 'item_id': item, 'committed_at': timestamp()})
                data['run']['last_checkpoint'] = op['last_checkpoint']
                if analysis_id:
                    op['analysis_version'] = data['analyses'][analysis_id][-1]['analysis_version']
                step.status, step.result = 'done', op['last_checkpoint']
            domain.bump(data)
            op.update(updated_at=timestamp(), run_revision=data['run']['revision'], budget=domain.budget(final))
            current_row.data = data
            final.get(Operation, identity).data = op
            final.commit()
        return {'data': op}, 200
    return domain.mutate('advanceRun:'+run_id, key, body, action)


def execute(domain, data, purpose, item, analysis_id, port, at):
    run = data['run']
    if purpose == 'resolve':
        source = next(s for s in run['corpus'] if s['source_id'] == item)
        result = domain.providers.channel(source['original_url'], port.mode, port.unit)
        source.update(resolved_channel_id=result['channel_id'], resolution=stage('complete'))
        data['channels'][item].update(playlist=result['playlist'])
        run.update(current_stage='acquisition', workflow=stage('pending', 'Quedan páginas por adquirir.'))
    elif purpose == 'acquisition':
        acquire(domain, data, item, port, at)
        run.update(current_stage='acquisition', workflow=stage('pending', 'Adquisición o clasificación pendiente.'))
    elif purpose == 'ia_relevance':
        p = data['publications'][item]
        result = classify_ai(port, p, p['evidence'], at)
        p['ai_relevance'] = result
        p.update(eligibility='eligible' if result['decision'] == 'relevant' else 'excluded' if result['decision'] == 'not_relevant' else 'pending',
                 eligibility_reason=result['explanation'])
        run.update(current_stage='ia_relevance', workflow=stage('pending', 'Queda clasificación o agrupación.'))
    elif purpose == 'grouping':
        propose(data, port, at, groups_id=str(uuid4()), groups_version=1)
        run.update(current_stage='awaiting_confirmation', workflow=stage('pending', 'Confirma los grupos propuestos.'))
    elif purpose == 'comparison':
        data['comparison'] = compare_topics(data, at, run['revision']+1)
        run.update(current_stage='idle', workflow=stage('complete'))
    else:
        a = copy.deepcopy(data['analyses'][analysis_id][-1])
        a['analysis_version'] += 1
        a['version_created_at'] = at
        if purpose == 'audiovisual':
            observe(a, port, at, identity=lambda kind, index: digest([port.unit, kind, index]))
        elif purpose in ('value', 'persona', 'company_context', 'pillar'):
            result = classify_ai(port, a['publication'], a['evidence'], at, purpose)
            if purpose == 'value':
                a['value'] = result
            else:
                a['affinity'][purpose] = result
            a['model_uses'].append({'provider': 'jev', 'model': result['trace']['model'], 'provider_request_id': result['trace']['provider_request_id'],
                                    'prompt_or_question_version': result['trace']['question_version'], 'criteria_version': RULES_VERSION, 'processed_at': at,
                                    'usage_report': json.dumps(json.loads(result['trace']['raw_response_text'])['usage'])})
        else:
            synthesize(a, port, at, identity=lambda kind, index: digest([port.unit, kind, index]))
        a['review'] = domain.initial_review(a)
        data['analyses'][analysis_id].append(validate('Analysis', a))


def evidence(p, at):
    return [{'evidence_id': digest([p['capture_id'], field]), 'kind': 'text', 'video_id': p['video_id'], 'dimension': 'metadata',
             'source_url': p['url'], 'field': field, 'excerpt': p[field], 'captured_at': at}
            for field in ('title', 'description') if p[field]]


def acquire(domain, data, source_id, port, at):
    c = data['channels'][source_id]
    params = {'part': 'contentDetails', 'playlistId': c['playlist'], 'maxResults': 50}
    if c['cursor']:
        params['pageToken'] = c['cursor']
    page = domain.providers.youtube('playlistItems', params, port.mode, port.unit+':playlist')
    ids = list(dict.fromkeys(i['contentDetails']['videoId'] for i in page['items']))
    items = domain.providers.youtube('videos', {'part': 'snippet,contentDetails,statistics,status', 'id': ','.join(ids)}, port.mode, port.unit+':videos')['items'] if ids else []
    by_id = {v['id']: v for v in items}
    source = next(s for s in data['run']['corpus'] if s['source_id'] == source_id)
    for video_id in ids:
        item = by_id.get(video_id, {})
        snippet = item.get('snippet', {})
        require(not snippet.get('channelId') or snippet['channelId'] == source['resolved_channel_id'], 'La publicación no pertenece al canal consultado.', 'PROVIDER_FAILURE', 503)
        published = snippet.get('publishedAt')
        window = period(published, data['run']['windows'])
        duration = duration_seconds(item.get('contentDetails', {}).get('duration', ''))
        if published and window is None or duration is not None and duration > 180:
            continue
        privacy = item.get('status', {}).get('privacyStatus')
        excluded = privacy is not None and privacy != 'public'
        stats = item.get('statistics', {})
        p = {'run_id': data['run']['run_id'], 'video_id': video_id, 'capture_id': str(uuid4()), 'source_id': source_id,
             'url': 'https://www.youtube.com/watch?v='+video_id, 'title': snippet.get('title') or None, 'description': snippet.get('description'),
             'published_at': published, 'captured_at': at, 'public_state': 'confirmed_public' if privacy == 'public' else 'unavailable' if excluded else 'unknown',
             'duration': {'state': 'known' if duration is not None else 'unknown', 'seconds': duration, 'reason': None if duration is not None else 'Duración no recuperada.'},
             'window': window, 'short_status': 'candidate_short' if duration is not None else 'undetermined', 'short_evidence': None,
             'eligibility': 'excluded' if excluded else 'pending', 'eligibility_reason': 'Contenido no público.' if excluded else 'Falta verificar pertinencia o metadatos.',
             'statistics': {name: {'state': 'known' if stats.get(key) is not None else 'unknown', 'value': stats.get(key), 'reason': None if stats.get(key) is not None else 'Métrica no disponible.'} for name, key in [('views', 'viewCount'), ('likes', 'likeCount'), ('comments', 'commentCount')]},
             'ai_relevance': unavailable(), 'main_topic_id': None, 'secondary_topic_ids': [], 'evidence': []}
        p['evidence'] = evidence(p, at)
        data['publications'].setdefault(video_id, validate('Publication', p))
    c.update(cursor=page.get('nextPageToken'), complete=not page.get('nextPageToken'), pages=c['pages']+1, error=None)
