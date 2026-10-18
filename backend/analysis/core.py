"""Funciones de ALG: reciben contexto persistido y no acceden a HTTP, secretos o BD."""
from datetime import datetime
from .windows import derive_windows as canonical_windows
from .context import AnalysisContext
from .counts import count_publications
from .comparison import compare_topics as compare_confirmed_topics
from .criteria import RULES_VERSION

VERSIONS = dict.fromkeys(('rules_version', 'classification_version', 'criteria_version'), RULES_VERSION)
DIMENSIONS = ('format', 'verbal_hook', 'visual_hook', 'audio_hook', 'structure', 'problem')


def stage(state='not_requested', reason=None):
    return {'state': state, 'reason': reason}


def unavailable(state='not_requested', reason='Evaluación no solicitada.', trace=None):
    return {'state': state, 'reason': reason, 'decision': None, 'trace': trace, 'evidence_ids': []}


def derive_windows(started_at):
    # Adaptación de la entrada persistida; el cálculo pertenece únicamente a ALG 2.2.
    return canonical_windows(datetime.fromisoformat(started_at.replace('Z', '+00:00')))


def period(date, w):
    if not date:
        return None
    at = datetime.fromisoformat(date.replace('Z', '+00:00'))
    for name in ('previous', 'recent'):
        if datetime.fromisoformat(w[name]['start_inclusive']) <= at < datetime.fromisoformat(w[name]['end_exclusive']):
            return name
    return None


def coverage(data):
    run, publications = data['run'], list(data['publications'].values())
    cells = []
    for source in run['corpus']:
        channel = data['channels'][source['source_id']]
        for window in ('previous', 'recent'):
            videos = [v for v in publications if v['source_id'] == source['source_id'] and v['window'] in (window, None)]
            unresolved = [v['video_id'] for v in videos if v['eligibility'] == 'pending']
            pending_tech = any(v['duration']['state'] != 'known' or v['published_at'] is None or v['public_state'] == 'unknown' for v in videos)
            relevant = [v for v in videos if v['eligibility'] == 'eligible']
            complete = channel['complete']
            acq = stage('failed', channel['error']) if channel['error'] else stage('complete') if complete else stage('pending', 'Paginación pendiente.')
            eligibility = stage('pending', 'Falta duración, fecha o condición pública.') if pending_tech else stage('complete') if complete else stage('pending', 'Adquisición pendiente.')
            ai = stage('pending', 'Pertinencia pendiente o insuficiente.') if unresolved or not complete else stage('complete')
            theme = stage('pending', 'Asignación principal pendiente.') if any(v['main_topic_id'] is None for v in relevant) or not complete else stage('complete')
            cells.append({'source_id': source['source_id'], 'window': window, 'acquisition': acq,
                          'eligibility': eligibility, 'ia_relevance': ai, 'main_topic': theme,
                          'pages_read': channel['pages'], 'pagination_complete': complete,
                          'discovered_video_ids': [v['video_id'] for v in videos],
                          'unresolved_video_ids': unresolved, 'failures': [channel['error']] if channel['error'] else []})
    complete = all(all(c[k]['state'] == 'complete' for k in ('acquisition', 'eligibility', 'ia_relevance', 'main_topic')) for c in cells)
    return {'run_id': run['run_id'], 'run_revision': run['revision'], 'expected_source_count': 11,
            'thematic_state': 'complete' if complete else 'partial' if publications else 'pending', 'cells': cells,
            'limitations': [] if complete else ['Cobertura temática incompleta; desconocido no equivale a cero.'],
            'historical_scope': 'public_recoverable_at_capture'}


def compare_topics(data, at, revision):
    run, groups, cov = data['run'], data['groups']['proposal'], coverage(data)
    confirmed = groups and groups['confirmation']
    result = {'run_id': run['run_id'], 'comparison_revision': None,
              'state': 'not_requested' if confirmed else 'groups_unconfirmed', 'computed_at': None,
              'windows': run['windows'], 'groups_id': groups['groups_id'] if groups else None,
              'groups_version': groups['groups_version'] if groups else None,
              'confirmation_id': confirmed['confirmation_id'] if confirmed else None,
              'coverage_state': cov['thematic_state'], 'limitations': cov['limitations'], 'signals': []}
    if not confirmed or at is None:
        return result
    context = AnalysisContext(
        run_id=run['run_id'], run_revision=run['revision'], windows=run['windows'],
        versions=run['versions'], source_ids=tuple(source['source_id'] for source in run['corpus']),
        input_version=f"{run['run_id']}:{run['revision']}:{groups['groups_id']}:{groups['groups_version']}",
        processed_at=datetime.fromisoformat(at.replace('Z', '+00:00')),
    )
    counts = count_publications(context, groups=groups,
                                publications=list(data['publications'].values()), coverage=cov)
    result = compare_confirmed_topics(context, counts=counts, groups=groups,
                                      coverage=cov, comparison_revision=revision)
    data['counts'] = counts
    return result


def signal_reference(publication, comparison):
    topic = publication['main_topic_id']
    match = next((s for s in comparison['signals'] if s['topic_id'] == topic), None)
    return {'state': 'available' if match else 'pending' if topic else 'unassigned',
            'comparison_revision': comparison['comparison_revision'] if match else None,
            'topic_id': topic, 'signal': match}
