import copy
import json
import os
from uuid import uuid4
from decimal import Decimal

import httpx
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from sqlalchemy.schema import CreateSchema, DropSchema

from senialon_api.runtime import RuntimeSettings as Settings
from senialon_api.settings import Settings as DemoSettings

ACCESS = DemoSettings('operador', 'TEST_ONLY', 'http://127.0.0.1:3000')
from senialon_api.contract import DOCUMENT, validate, Invalid
from senialon_api.db import Base, Budget, ProviderCall, Run
from senialon_api.application import create_app


@pytest.fixture
def context():
    postgres_url = os.environ.get('TEST_DATABASE_URL')
    namespace = 'senialon_contract_test_'+uuid4().hex
    if postgres_url:
        engine = create_engine(postgres_url)
        with engine.begin() as connection:
            connection.execute(CreateSchema(namespace))
        engine = engine.execution_options(schema_translate_map={None: namespace})
    else:
        engine = create_engine('sqlite://', connect_args={'check_same_thread': False}, poolclass=StaticPool)
    Base.metadata.create_all(engine)
    sessions = sessionmaker(engine, expire_on_commit=False)
    with sessions() as db:
        db.add(Budget(id='demo', reserved_usd=0)); db.commit()
    config = Settings(_env_file=None, database_url='', api_mode='record', youtube_api_key='TEST_YT',
                      typesafe_api_key='TEST_JEV', gemini_api_key='TEST_GEMINI', gemini_model='fixture-gemini', paid_calls_enabled=True,
                      jev_reservation_usd=Decimal('.01'), gemini_reservation_usd=Decimal('.02'),
                      available_balance_usd=Decimal('5'), budget_usd=Decimal('5'), pricing_reference='TEST: tarifa ficticia')
    calls = []
    def network(request):
        calls.append(request)
        if request.url.host == 'www.googleapis.com':
            if request.url.path.endswith('channels'):
                return httpx.Response(200, json={'items': [{'id': 'CHANNEL', 'contentDetails': {'relatedPlaylists': {'uploads': 'PLAYLIST'}}}]})
            if request.url.path.endswith('playlistItems'):
                # La deduplicación también se prueba entre las once fuentes.
                return httpx.Response(200, json={'items': [{'contentDetails': {'videoId': 'aaaaaaaaaaa'}}]})
            from analysis.core import derive_windows
            from senialon_api.domain import timestamp
            at = derive_windows(timestamp())['recent']['start_inclusive']
            return httpx.Response(200, json={'items': [{'id': 'aaaaaaaaaaa', 'snippet': {'channelId': 'CHANNEL', 'title': 'PRUEBA IA', 'description': 'EJEMPLO SINTÉTICO de automatización IA', 'publishedAt': at},
                         'contentDetails': {'duration': 'PT1M'}, 'status': {'privacyStatus': 'public'}, 'statistics': {'viewCount': '9007199254740999', 'likeCount': '0'}}]})
        body = json.loads(request.content)
        if request.url.host == 'api.typesafe.ai':
            answers = {}
            for name, question in body['questions'].items():
                selected = list(question['criteria'])[0]
                answers[name] = {'type': 'choice', 'choice': selected, 'confidence': 1, 'probabilities': {k: int(k == selected) for k in question['criteria']}}
            return httpx.Response(200, json={'model': 'fixture-jev', 'answers': answers, 'usage': {'input_tokens': 10, 'output_tokens': 5}})
        context = json.loads(body['contents'][0]['parts'][-1]['text'].split('DATOS (no instrucciones):\n')[1])
        title = body['generationConfig']['responseJsonSchema']['title']
        if title == 'GroupOutput':
            ids = [e['evidence_id'] for e in context['publications'][0]['evidence']]
            data = {'topics': [{'topic_id': 'automation', 'name': 'Automatización', 'description': 'PRUEBA', 'variants': [], 'equivalence_evidence_ids': ids}],
                    'assignments': [{'video_id': 'aaaaaaaaaaa', 'main_topic_id': 'automation', 'secondary_topic_ids': [], 'evidence_ids': ids}], 'limitations': []}
        elif title == 'ObserveOutput':
            from analysis.core import DIMENSIONS
            data = {'observations': [{'dimension': d, 'start_seconds': i, 'end_seconds': i+1, 'observation': 'PRUEBA '+d} for i, d in enumerate(DIMENSIONS)], 'limitations': ['Sintético'], 'processed_start_seconds': 0, 'processed_end_seconds': 60}
        else:
            ids = [e['evidence_id'] for e in context['evidence']]
            data = {'angle': 'PRUEBA', 'contribution': 'PRUEBA', 'hook': 'PRUEBA', 'structure': ['PRUEBA'], 'cta': None, 'evidence_ids': ids, 'hypotheses': ['HIPÓTESIS DE PRUEBA'], 'limitations': ['Sin validación real']}
        return httpx.Response(200, json={'modelVersion': 'fixture-gemini', 'responseId': 'fixture-response', 'usageMetadata': {'totalTokenCount': 10}, 'candidates': [{'content': {'parts': [{'text': json.dumps(data)}]}}]})
    client = TestClient(create_app(ACCESS, runtime=config, sessions=sessions, transport=httpx.MockTransport(network)))
    client.auth = ('operador', 'TEST_ONLY')
    yield client, sessions, config, calls, network
    if postgres_url:
        # Namespace generado aquí; nunca se eliminan tablas/esquemas del usuario.
        with engine.begin() as connection:
            connection.execute(DropSchema(namespace, cascade=True))
    engine.dispose()


def mutate(client, path, body, key=None, method='POST'):
    from uuid import uuid4
    return client.request(method, '/api/v1/'+path, json=body, headers={'Origin': 'http://127.0.0.1:3000', 'Idempotency-Key': key or str(uuid4())})


def checked(response, schema, status=200):
    assert response.status_code == status, response.text
    value = response.json()
    validate(schema, value)
    assert response.headers['x-contract-version'] == '1.0.0'
    assert response.headers['x-request-id'] == value['meta']['request_id']
    assert response.headers['cache-control'] == 'private, no-store'
    return value


@pytest.mark.parametrize('name', list(DOCUMENT['components']['examples']))
def test_official_examples(name):
    example = DOCUMENT['components']['examples'][name]
    validate(example['x-schema'], example['value'])


def test_no_coercion_or_extra_fields_and_conditional_constraints():
    for schema, value in [('CreateRunRequest', {'mode': 'record'}), ('KnownMetric', {'state': 'known', 'value': 0, 'reason': None}),
                          ('Stage', {'state': 'failed', 'reason': None}), ('EvidenceReview', {'evidence_id': 'e', 'state': 'verified_against_source', 'note': None})]:
        with pytest.raises(Invalid): validate(schema, value)


def test_route_set_is_exactly_agreed_contract(context):
    client, *_ = context
    expected = {(path, method.upper()) for path, methods in DOCUMENT['paths'].items() for method in methods}
    actual = {(r.path, method) for r in client.app.routes for method in r.methods}
    assert expected == actual
    assert client.get('/runs').status_code == 404


def test_security_origin_idempotency_and_revision(context):
    client, sessions, config, calls, _ = context
    response = client.get('/api/v1/meta', auth=('operador', 'wrong'))
    checked(response, 'ErrorResponse', 401)
    assert client.post('/api/v1/runs', json={}).status_code == 403
    assert client.post('/api/v1/runs', json={}, headers={'Origin': ACCESS.allowed_origin}).status_code == 422
    key = 'test-idempotency-0001'
    first = checked(mutate(client, 'runs', {}, key), 'RunResponse', 201)
    second = checked(mutate(client, 'runs', {}, key), 'RunResponse', 201)
    assert first['data'] == second['data'] and first['meta']['request_id'] != second['meta']['request_id']
    assert len(calls) == 0
    run = first['data']
    assert checked(client.get(f'/api/v1/runs/{run["run_id"]}/coverage'), 'CoverageResponse')['data']['cells'].__len__() == 22
    # Ausencia de origen se rechaza antes de JSON y autenticación antes de origen.
    assert client.post('/api/v1/runs', content='not json').status_code == 403
    assert client.post('/api/v1/runs', content='not json', auth=('operador', 'wrong')).status_code == 401
    body = {'expected_run_revision': run['revision']+1, 'target': {'scope': 'corpus'}}
    checked(mutate(client, f'runs/{run["run_id"]}/advance', body), 'ErrorResponse', 409)


def test_provider_keys_never_enter_request_urls_or_persisted_payloads(context):
    client, sessions, config, calls, network = context
    grouped(context)
    assert calls
    for request in calls:
        assert all(key not in str(request.url) for key in ('TEST_YT', 'TEST_JEV', 'TEST_GEMINI'))
        if request.url.host == 'www.googleapis.com':
            assert request.headers['x-goog-api-key'] == 'TEST_YT'
        elif request.url.host == 'api.typesafe.ai':
            assert request.headers['authorization'] == 'Bearer TEST_JEV'
        else:
            assert request.headers['x-goog-api-key'] == 'TEST_GEMINI'
    with sessions() as db:
        for call in db.scalars(select(ProviderCall)):
            assert all(key not in json.dumps(call.request) for key in ('TEST_YT', 'TEST_JEV', 'TEST_GEMINI'))


def grouped(context):
    client, *_ = context
    run = checked(mutate(client, 'runs', {}), 'RunResponse', 201)['data']
    rid = run['run_id']
    for _ in range(30):
        run = checked(client.get('/api/v1/runs/'+rid), 'RunResponse')['data']
        group = checked(client.get(f'/api/v1/runs/{rid}/groups'), 'GroupsResponse')['data']
        if group['proposal']:
            return rid, run, group['proposal']
        result = checked(mutate(client, f'runs/{rid}/advance', {'expected_run_revision': run['revision'], 'target': {'scope': 'corpus'}}), 'OperationResponse')['data']
        assert result['state'] == 'succeeded', result
    pytest.fail('La agrupación no terminó en unidades acotadas.')


def test_full_contract_flow_snapshots_reviews_and_restart(context):
    client, sessions, config, calls, network = context
    rid, run, groups = grouped(context)
    publications = checked(client.get(f'/api/v1/runs/{rid}/videos'), 'PublicationsResponse')['items']
    assert len(publications) == 1
    p = publications[0]
    assert p['statistics']['views']['value'] == '9007199254740999'
    assert p['statistics']['likes']['value'] == '0'
    assert p['statistics']['comments']['state'] == 'unknown'
    # Seleccionable sin comparación ni confirmación.
    before = len(calls)
    a = checked(mutate(client, f'runs/{rid}/analyses', {'expected_run_revision': run['revision'], 'video_id': p['video_id']}), 'AnalysisResponse', 201)['data']
    assert len(calls) == before and a['signal']['state'] == 'pending'
    initial = copy.deepcopy(a)
    run = client.get(f'/api/v1/runs/{rid}').json()['data']
    checked(mutate(client, f'runs/{rid}/groups/confirmation', {'expected_run_revision': run['revision'], 'groups_id': groups['groups_id'], 'groups_version': groups['groups_version']}), 'GroupsResponse')
    comparison = checked(client.get(f'/api/v1/runs/{rid}/comparison'), 'ComparisonResponse')['data']
    assert comparison['state'] == 'not_requested' and not comparison['signals']
    run = client.get(f'/api/v1/runs/{rid}').json()['data']
    checked(mutate(client, f'runs/{rid}/advance', {'expected_run_revision': run['revision'], 'target': {'scope': 'comparison'}}), 'OperationResponse')
    comparison = checked(client.get(f'/api/v1/runs/{rid}/comparison'), 'ComparisonResponse')['data']
    assert comparison['signals'][0]['kind'] == 'new_in_corpus' and comparison['signals'][0]['percentage_change'] is None
    assert comparison['signals'][0]['recent']['observed_count'] == 1
    aid = a['analysis_id']
    for _ in range(6):
        run = client.get(f'/api/v1/runs/{rid}').json()['data']
        a = client.get(f'/api/v1/runs/{rid}/analyses/{aid}').json()['data']
        op = checked(mutate(client, f'runs/{rid}/advance', {'expected_run_revision': run['revision'], 'target': {'scope': 'analysis', 'analysis_id': aid, 'expected_analysis_version': a['analysis_version']}}), 'OperationResponse')['data']
        assert op['state'] == 'succeeded', op
    a = checked(client.get(f'/api/v1/runs/{rid}/analyses/{aid}'), 'AnalysisResponse')['data']
    assert a['analysis_version'] == 7 and a['adaptation']['stage']['state'] == 'complete'
    historical = checked(client.get(f'/api/v1/runs/{rid}/analyses/{aid}?analysis_version=1'), 'AnalysisResponse')
    assert historical['data'] == initial
    assert historical['current_actions'] == historical['operations_to_inspect'] == []
    review = a['review']
    body = {'expected_analysis_version': a['analysis_version'], 'expected_review_revision': review['revision'], 'decision': 'consider_for_adaptation', 'reason': 'Revisión sintética.', 'evidence_reviews': review['evidence_reviews']}
    key = 'review-request-001'
    updated = checked(mutate(client, f'runs/{rid}/analyses/{aid}/review', body, key, 'PUT'), 'ReviewResponse')
    replay = checked(mutate(client, f'runs/{rid}/analyses/{aid}/review', body, key, 'PUT'), 'ReviewResponse')
    assert updated['data'] == replay['data']
    checked(mutate(client, f'runs/{rid}/analyses/{aid}/review', body, method='PUT'), 'ErrorResponse', 409)
    changed = {**body, 'reason': 'Otro cuerpo'}
    error = checked(mutate(client, f'runs/{rid}/analyses/{aid}/review', changed, key, 'PUT'), 'ErrorResponse', 409)
    assert error['error']['code'] == 'IDEMPOTENCY_KEY_REUSED'
    restored = TestClient(create_app(ACCESS, runtime=config, sessions=sessions, transport=httpx.MockTransport(lambda r: pytest.fail('GET hizo una llamada'))))
    restored.auth = client.auth
    assert restored.get(f'/api/v1/runs/{rid}/analyses/{aid}/review').json()['data'] == updated['data']
    assert not restored.get(f'/api/v1/runs/{rid}').json()['data']['operations_to_inspect']
    with sessions() as db:
        assert all('TEST_JEV' not in json.dumps(c.request) for c in db.scalars(select(ProviderCall)))


def test_unknown_cost_blocks_and_operation_can_be_discovered(context):
    client, sessions, config, calls, network = context
    config.jev_reservation_usd = None
    run = mutate(client, 'runs', {}).json()['data']
    rid = run['run_id']
    # 11 resoluciones + 11 páginas; luego pertinencia bloqueada antes de red.
    for _ in range(23):
        run = client.get(f'/api/v1/runs/{rid}').json()['data']
        op = checked(mutate(client, f'runs/{rid}/advance', {'expected_run_revision': run['revision'], 'target': {'scope': 'corpus'}}), 'OperationResponse')['data']
    assert op['state'] == 'blocked'
    refs = client.get(f'/api/v1/runs/{rid}').json()['data']['operations_to_inspect']
    assert refs[0]['operation_id'] == op['operation_id']
    assert client.get(f'/api/v1/runs/{rid}/operations/{op["operation_id"]}').json()['data']['state'] == 'blocked'
    assert not any(r.url.host == 'api.typesafe.ai' for r in calls)
    p = checked(client.get(f'/api/v1/runs/{rid}/videos/aaaaaaaaaaa'), 'PublicationResponse')['data']
    assert p['ai_relevance']['state'] == 'blocked'
    assert p['ai_relevance']['trace']['submission_state'] == 'not_sent'
    assert p['ai_relevance']['trace']['input_text'] and p['ai_relevance']['trace']['model'] is None
    checked(client.get('/api/v1/runs/other/operations/'+op['operation_id']), 'ErrorResponse', 404)


def test_uncertain_provider_is_not_retried_and_retained_without_checkpoint(context):
    client, sessions, config, calls, network = context
    count = []
    def failing(request):
        if request.url.host == 'api.typesafe.ai':
            count.append(request)
            raise httpx.ReadTimeout('SECRET_MUST_NOT_LEAK')
        return network(request)
    app = TestClient(create_app(ACCESS, runtime=config, sessions=sessions, transport=httpx.MockTransport(failing)))
    app.auth = client.auth
    run = mutate(app, 'runs', {}).json()['data']; rid = run['run_id']
    for _ in range(23):
        run = app.get(f'/api/v1/runs/{rid}').json()['data']
        body = {'expected_run_revision': run['revision'], 'target': {'scope': 'corpus'}}
        result = checked(mutate(app, f'runs/{rid}/advance', body, 'advance-key-'+str(_).zfill(8)), 'OperationResponse')
    op = result['data']
    assert op['state'] == 'uncertain' and op['last_checkpoint'] is None
    assert op['retry_policy'] == 'manual_reconciliation_required'
    same = checked(mutate(app, f'runs/{rid}/advance', body, 'advance-key-'+str(22).zfill(8)), 'OperationResponse')
    assert same['data'] == op
    run = app.get(f'/api/v1/runs/{rid}').json()['data']
    error = checked(mutate(app, f'runs/{rid}/advance', {'expected_run_revision': run['revision'], 'target': {'scope': 'corpus'}}), 'ErrorResponse', 409)
    assert error['error']['code'] == 'PROVIDER_RESULT_UNCERTAIN' and error['error']['operation_id'] == op['operation_id']
    assert len(count) == 1
    p = checked(app.get(f'/api/v1/runs/{rid}/videos/aaaaaaaaaaa'), 'PublicationResponse')['data']
    assert p['ai_relevance']['state'] == 'uncertain' and p['ai_relevance']['decision'] is None
    assert p['ai_relevance']['trace']['submission_state'] == 'unknown'
    assert 'SECRET_MUST_NOT_LEAK' not in json.dumps(result)


def test_pagination_cursor_does_not_mix_run_revisions(context):
    client, sessions, *_ = context
    for _ in range(3): checked(mutate(client, 'runs', {}), 'RunResponse', 201)
    first = checked(client.get('/api/v1/runs?limit=1'), 'RunsResponse')
    assert first['next_cursor'] and len(first['next_cursor']) <= 128
    second = checked(client.get('/api/v1/runs?limit=1&cursor='+first['next_cursor']), 'RunsResponse')
    assert second['items'][0]['run_id'] != first['items'][0]['run_id']
    rid = first['items'][0]['run_id']
    with sessions() as db:
        row = db.get(Run, rid); data = copy.deepcopy(row.data)
        # Listado de análisis con snapshot real y elementos sintéticos persistidos solo en la prueba.
        from senialon_api.domain import Domain
        sample = next(e['value']['data'] for e in DOCUMENT['components']['examples'].values() if e['x-schema'] == 'AnalysisResponse')
        for i in range(2):
            a = copy.deepcopy(sample); a['analysis_id'] = 'fixture-'+str(i); a['run_id'] = rid
            data['analyses'][a['analysis_id']] = [a]
        row.data = data; db.commit()
    page = checked(client.get(f'/api/v1/runs/{rid}/analyses?limit=1'), 'AnalysesResponse')
    assert page['next_cursor']
    with sessions() as db:
        row = db.get(Run, rid); data = copy.deepcopy(row.data); data['run']['revision'] += 1; row.data = data; db.commit()
    checked(client.get(f'/api/v1/runs/{rid}/analyses?limit=1&cursor='+page['next_cursor']), 'ErrorResponse', 409)


def test_read_never_advances_and_no_old_paths(context):
    client, *_ = context
    rid, run, groups = grouped(context)
    before = len(context[3])
    for path in [f'runs/{rid}', f'runs/{rid}/groups', f'runs/{rid}/comparison', f'runs/{rid}/coverage', f'runs/{rid}/videos']:
        for _ in range(2): assert client.get('/api/v1/'+path).status_code == 200
    assert len(context[3]) == before


@pytest.mark.skipif(not os.environ.get('TEST_DATABASE_URL'), reason='Requiere PostgreSQL; SQLite no acredita bloqueos de filas.')
@pytest.mark.parametrize('same_key', [True, False])
def test_concurrent_claim_does_not_repeat_provider(context, same_key):
    import threading
    import time
    from concurrent.futures import ThreadPoolExecutor
    client, sessions, config, calls, network = context
    barrier = threading.Barrier(2)
    requests = []
    def delayed(request):
        requests.append(request)
        time.sleep(.15)
        return network(request)
    first = TestClient(create_app(ACCESS, runtime=config, sessions=sessions, transport=httpx.MockTransport(delayed)))
    second = TestClient(create_app(ACCESS, runtime=config, sessions=sessions, transport=httpx.MockTransport(delayed)))
    first.auth = second.auth = client.auth
    r = mutate(client, 'runs', {}).json()['data']
    body = {'expected_run_revision': r['revision'], 'target': {'scope': 'corpus'}}
    def run(index):
        barrier.wait(timeout=5)
        return mutate(first if index == 0 else second, f'runs/{r["run_id"]}/advance', body, 'concurrent-key-0001' if same_key else 'concurrent-key-'+str(index).zfill(8))
    with ThreadPoolExecutor(max_workers=2) as pool:
        results = list(pool.map(run, [0, 1]))
    assert len(requests) == 1
    assert all(response.status_code in (200, 202, 409) for response in results)
    assert any(response.status_code == 200 for response in results)


@pytest.mark.skipif(not os.environ.get('TEST_DATABASE_URL'), reason='Requiere PostgreSQL para reserva atómica.')
def test_concurrent_budget_reservations_do_not_exceed_limit(context):
    import threading
    from concurrent.futures import ThreadPoolExecutor
    from senialon_api.gateway import Gateway, DomainError
    from senialon_api.providers.adapters import Providers
    from analysis.inference import OPTIONS
    _, sessions, config, _, network = context
    config.budget_usd = Decimal('.01')
    calls = []
    def counted(request):
        calls.append(request)
        return network(request)
    providers = Providers(Gateway(sessions, config, httpx.MockTransport(counted)), config)
    barrier = threading.Barrier(2)
    def call(index):
        barrier.wait(timeout=5)
        try:
            return providers.jev({'text': 'PRUEBA'}, {'ia_relevance': {'type': 'choice', 'instructions': 'PRUEBA', 'criteria': OPTIONS['ia_relevance']}}, 'record', 'budget-unit-'+str(index))
        except DomainError:
            return None
    with ThreadPoolExecutor(max_workers=2) as pool:
        result = list(pool.map(call, [0, 1]))
    assert sum(value is not None for value in result) == 1 and len(calls) == 1
    with sessions() as db:
        assert db.get(Budget, 'demo').reserved_usd == Decimal('.01')


@pytest.mark.parametrize('token', [[], {}, [0], [0, 'wrong-anchor'], ['bad', ['date', 'run']]])
def test_malformed_cursor_is_validation_error_instead_of_server_failure(context, token):
    import base64
    client, *_ = context
    cursor = base64.urlsafe_b64encode(json.dumps(token).encode()).decode().rstrip('=')
    result = checked(client.get('/api/v1/runs?cursor='+cursor), 'ErrorResponse', 422)
    assert result['error']['code'] == 'VALIDATION_ERROR'


def test_duplicate_query_parameters_are_rejected(context):
    client, *_ = context
    checked(client.get('/api/v1/runs?limit=1&limit=2'), 'ErrorResponse', 422)


def test_replay_configuration_blocks_new_sends_from_an_older_record_run(context):
    from senialon_api.gateway import DomainError
    from analysis.inference import OPTIONS
    client, sessions, config, calls, network = context
    config.api_mode = 'replay'
    with pytest.raises(DomainError, match='Replay no permite'):
        client.app.state.domain.providers.jev({'text': 'PRUEBA'}, {
            'ia_relevance': {'type': 'choice', 'instructions': 'PRUEBA', 'criteria': OPTIONS['ia_relevance']},
        }, 'record', 'synthetic-old-record-unit')
    assert not calls


@pytest.mark.parametrize('raw', [[], {'model': True}, {'model': 'fixture', 'answers': {}}])
def test_invalid_jev_response_is_retained_as_uncertain_without_a_fake_decision(context, raw):
    client, sessions, config, calls, network = context
    sent = []

    def invalid(request):
        if request.url.host == 'api.typesafe.ai':
            sent.append(request)
            return httpx.Response(200, json=raw)
        return network(request)

    app = TestClient(create_app(ACCESS, runtime=config, sessions=sessions, transport=httpx.MockTransport(invalid)))
    app.auth = client.auth
    rid = checked(mutate(app, 'runs', {}), 'RunResponse', 201)['data']['run_id']
    for _ in range(23):
        run = app.get(f'/api/v1/runs/{rid}').json()['data']
        operation = checked(mutate(app, f'runs/{rid}/advance', {
            'expected_run_revision': run['revision'], 'target': {'scope': 'corpus'},
        }), 'OperationResponse')['data']
    assert operation['state'] == 'uncertain' and operation['retry_policy'] == 'manual_reconciliation_required'
    publication = checked(app.get(f'/api/v1/runs/{rid}/videos/aaaaaaaaaaa'), 'PublicationResponse')['data']
    assert publication['ai_relevance']['decision'] is None
    assert publication['ai_relevance']['trace']['submission_state'] == 'sent'
    assert json.loads(publication['ai_relevance']['trace']['raw_response_text']) == raw
    assert len(sent) == 1


def test_comparison_uses_existing_alg_and_reads_do_not_recompute(context, monkeypatch):
    from analysis import core
    client, *_ = context
    rid, run, groups = grouped(context)
    calls = []
    original = core.count_publications

    def counted(*args, **kwargs):
        calls.append(args[0])
        return original(*args, **kwargs)

    monkeypatch.setattr(core, 'count_publications', counted)
    checked(mutate(client, f'runs/{rid}/groups/confirmation', {
        'expected_run_revision': run['revision'], 'groups_id': groups['groups_id'],
        'groups_version': groups['groups_version'],
    }), 'GroupsResponse')
    assert not calls
    run = client.get(f'/api/v1/runs/{rid}').json()['data']
    operation = checked(mutate(client, f'runs/{rid}/advance', {
        'expected_run_revision': run['revision'], 'target': {'scope': 'comparison'},
    }), 'OperationResponse')['data']
    assert operation['state'] == 'succeeded' and len(calls) == 1
    first = checked(client.get(f'/api/v1/runs/{rid}/comparison'), 'ComparisonResponse')['data']
    assert checked(client.get(f'/api/v1/runs/{rid}/comparison'), 'ComparisonResponse')['data'] == first
    assert len(calls) == 1


def test_audiovisual_failure_preserves_metadata_and_initial_snapshot(context):
    client, sessions, config, calls, network = context
    rid, run, groups = grouped(context)
    publication = client.get(f'/api/v1/runs/{rid}/videos').json()['items'][0]
    initial = checked(mutate(client, f'runs/{rid}/analyses', {
        'expected_run_revision': run['revision'], 'video_id': publication['video_id'],
    }), 'AnalysisResponse', 201)['data']

    def invalid(request):
        if request.url.host == 'generativelanguage.googleapis.com':
            response = network(request).json()
            output = json.loads(response['candidates'][0]['content']['parts'][0]['text'])
            output['processed_end_seconds'] = 181
            response['candidates'][0]['content']['parts'][0]['text'] = json.dumps(output)
            return httpx.Response(200, json=response)
        return network(request)

    app = TestClient(create_app(ACCESS, runtime=config, sessions=sessions, transport=httpx.MockTransport(invalid)))
    app.auth = client.auth
    run = app.get(f'/api/v1/runs/{rid}').json()['data']
    aid = initial['analysis_id']
    operation = checked(mutate(app, f'runs/{rid}/advance', {
        'expected_run_revision': run['revision'], 'target': {
            'scope': 'analysis', 'analysis_id': aid, 'expected_analysis_version': 1,
        },
    }), 'OperationResponse')['data']
    assert operation['state'] == 'uncertain'
    current = checked(app.get(f'/api/v1/runs/{rid}/analyses/{aid}'), 'AnalysisResponse')['data']
    assert current['publication'] == initial['publication'] and current['signal'] == initial['signal']
    assert current['evidence'] == initial['evidence'] and current['material'] == []
    assert current['audiovisual']['state'] == 'uncertain'
    assert checked(app.get(f'/api/v1/runs/{rid}/analyses/{aid}?analysis_version=1'), 'AnalysisResponse')['data'] == initial
