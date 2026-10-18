"""ALG 2.6: comparación descriptiva por tema, sin inferencia o predicción."""

from copy import deepcopy
from datetime import UTC

from .context import AnalysisContext, AnalysisInputError
from .counts import (
    PERIODS, CountSnapshot, Record, aware_instant, coverage_cells, coverage_gaps,
    require, validate_confirmed_groups, validate_context, window_instants,
)


def _validate_count(count: Record, context: AnalysisContext, cells, period) -> set[str]:
    ids = count["video_ids"]
    require(isinstance(ids, list) and len(ids) == len(set(ids)), "El conteo repite IDs.")
    require(type(count["observed_count"]) is int and count["observed_count"] == len(ids),
            "El observado no coincide con sus IDs distintos.")
    require(count["state"] in ("known", "unknown"), "Estado de conteo no válido.")
    if count["state"] == "known":
        require(type(count["total_count"]) is int and count["total_count"] == len(ids)
                and count["reason"] is None, "El total conocido no coincide con la evidencia.")
    else:
        require(count["total_count"] is None and isinstance(count["reason"], str) and bool(count["reason"]),
                "Un conteo desconocido no puede inventar un total o perder el motivo.")
    sources = set()
    contributed = set()
    for contribution in count["by_source"]:
        source = contribution["source_id"]
        members = contribution["video_ids"]
        require(source in context.source_ids and source not in sources,
                "Las contribuciones repiten fuentes o usan otro corpus.")
        require(isinstance(members, list) and len(members) == len(set(members))
                and not (set(members) & contributed), "Las contribuciones repiten IDs.")
        require(type(contribution["observed_count"]) is int
                and contribution["observed_count"] == len(members),
                "La contribución no coincide con sus IDs.")
        require(set(members) <= set(cells[(source, period)]["discovered_video_ids"]),
                "Una contribución no pertenece a su fuente y ventana.")
        sources.add(source)
        contributed.update(members)
    require(contributed == set(ids), "Las fuentes no particionan los IDs observados.")
    return set(ids)


def compare_topics(
    context: AnalysisContext,
    *,
    counts: CountSnapshot,
    groups: Record,
    coverage: Record,
    comparison_revision: int,
) -> dict:
    """Devuelve Comparison canónica desde el snapshot de conteo de ALG 2.5.

    BE reserva comparación/revisión e instante. No llamar desde GET ni antes
    de confirmar grupos; BE sirve metadatos pendientes sin ejecutar cálculo.
    """
    try:
        return _compare_topics(context, counts, groups, coverage, comparison_revision)
    except (KeyError, TypeError, AttributeError) as error:
        raise AnalysisInputError("Faltan campos de la unidad de comparación.") from error


def _compare_topics(context, counts, groups, coverage, comparison_revision):
    validate_context(context)
    validate_confirmed_groups(context, groups)
    cells = coverage_cells(context, coverage)
    require(type(comparison_revision) is int and comparison_revision > 0,
            "BE debe reservar una revisión de comparación válida.")
    require(counts["run_id"] == context.run_id and counts["run_revision"] == context.run_revision,
            "El conteo corresponde a otra ejecución o revisión.")
    require(counts["input_version"] == context.input_version
            and counts["versions"] == dict(context.versions), "El conteo usa otras entradas o criterios.")
    require(window_instants(counts["windows"]) == window_instants(context.windows),
            "El conteo usa ventanas diferentes.")
    require(counts["groups_id"] == groups["groups_id"]
            and counts["groups_version"] == groups["groups_version"]
            and counts["confirmation_id"] == groups["confirmation"]["confirmation_id"],
            "El conteo no corresponde a la versión confirmada.")
    require(context.processed_at >= aware_instant(counts["processed_at"])
            and context.processed_at >= aware_instant(groups["confirmation"]["confirmed_at"]),
            "El instante de comparación es anterior al conteo o confirmación.")

    topic_ids = [topic["topic_id"] for topic in groups["topics"]]
    by_topic = {item["topic_id"]: item for item in counts["topics"]}
    require(len(topic_ids) == len(set(topic_ids)) and len(by_topic) == len(counts["topics"])
            and set(by_topic) == set(topic_ids), "El conteo mezcla, omite o repite temas.")
    assignments = {item["video_id"]: item["main_topic_id"] for item in groups["assignments"]}
    require(len(assignments) == len(groups["assignments"]), "La propuesta repite asignaciones.")
    seen_ids = set()
    all_known = True
    for topic_id in topic_ids:
        for period in PERIODS:
            count = by_topic[topic_id][period]
            ids = _validate_count(count, context, cells, period)
            require(not (seen_ids & ids), "Un ID se cuenta en varios temas o ventanas.")
            require(all(assignments.get(video_id) == topic_id for video_id in ids),
                    "Un ID se atribuye a otro principal o no pertenece a la propuesta.")
            seen_ids.update(ids)
            all_known = all_known and count["state"] == "known"
    require(seen_ids == set(assignments), "El conteo no conserva todas las asignaciones resueltas.")

    coverage_state = coverage["thematic_state"]
    require(coverage_state in ("pending", "partial", "complete"), "Estado de cobertura no válido.")
    if coverage_state == "complete":
        require(all_known and not any(coverage_gaps(cells).values())
                and not groups["unresolved_video_ids"],
                "La cobertura completa no está respaldada por todos los conteos y etapas.")
    complete = coverage_state == "complete"
    signals = []
    for topic_id in topic_ids:
        previous = deepcopy(by_topic[topic_id]["previous"])
        recent = deepcopy(by_topic[topic_id]["recent"])
        signal = {
            "kind": "comparison_pending", "direction": "not_evaluable",
            "topic_id": topic_id, "groups_id": groups["groups_id"],
            "groups_version": groups["groups_version"], "previous": previous,
            "recent": recent, "delta": None, "percentage_change": None,
            "percentage_reason": "Cobertura parcial: comparación completa pendiente.",
        }
        if complete:
            before, after = previous["total_count"], recent["total_count"]
            delta = after - before
            signal["delta"] = delta
            signal["direction"] = "increase" if delta > 0 else "decrease" if delta < 0 else "unchanged"
            if before > 0:
                signal["kind"] = "comparable"
                signal["percentage_change"] = 100 * delta / before
                signal["percentage_reason"] = None
            else:
                signal["kind"] = "new_in_corpus" if after > 0 else "no_observed_publications"
                signal["percentage_reason"] = "zero_baseline"
        signals.append(signal)
    limitations = list(dict.fromkeys([*coverage["limitations"], *groups["limitations"]]))
    if not complete:
        limitations.append("Comparación completa del corpus pendiente; sin delta, porcentaje o novedad del corpus completo.")
    return {
        "run_id": context.run_id, "comparison_revision": comparison_revision,
        "state": "complete" if complete else "partial",
        "computed_at": context.processed_at.astimezone(UTC).isoformat().replace("+00:00", "Z"),
        "windows": deepcopy(context.windows), "groups_id": groups["groups_id"],
        "groups_version": groups["groups_version"],
        "confirmation_id": groups["confirmation"]["confirmation_id"],
        "coverage_state": coverage_state, "limitations": limitations, "signals": signals,
    }
