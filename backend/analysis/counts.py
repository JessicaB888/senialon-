"""ALG 2.5: IDs distintos por principal confirmado y ventana persistida.

BE valida antes las formas canónicas. ALG comprueba aquí sus relaciones y
emite Count; no reclasifica contenido ni cambia confirmaciones/cobertura.
"""

from collections.abc import Mapping, Sequence
from copy import deepcopy
from datetime import UTC, datetime, time
from typing import Any, Literal, TypedDict
from zoneinfo import ZoneInfo

from .context import AnalysisContext, AnalysisInputError, GroupsNotConfirmedError

Record = Mapping[str, Any]
Period = Literal["previous", "recent"]
PERIODS: tuple[Period, ...] = ("previous", "recent")


class ChannelContribution(TypedDict):
    source_id: str
    video_ids: list[str]
    observed_count: int


class Count(TypedDict):
    state: Literal["known", "unknown"]
    total_count: int | None
    reason: str | None
    observed_count: int
    video_ids: list[str]
    by_source: list[ChannelContribution]


class TopicCounts(TypedDict):
    topic_id: str
    previous: Count
    recent: Count


class CountSnapshot(TypedDict):
    """Transferencia interna hacia compare_topics; no es una respuesta HTTP."""

    run_id: str
    run_revision: int
    input_version: str
    processed_at: str
    windows: dict
    versions: dict[str, str]
    groups_id: str
    groups_version: int
    confirmation_id: str
    topics: list[TopicCounts]


def require(condition: bool, message: str) -> None:
    if not condition:
        raise AnalysisInputError(message)


def aware_instant(value: str) -> datetime:
    require(isinstance(value, str), "Falta una fecha explícita del snapshot.")
    try:
        result = datetime.fromisoformat(value)
        require(result.tzinfo is not None and result.utcoffset() is not None,
                "Las fechas del snapshot requieren zona conocida.")
        return result.astimezone(UTC)
    except (ValueError, OverflowError) as error:
        raise AnalysisInputError("La fecha del snapshot no es válida.") from error


def window_instants(windows: Record) -> dict[Period, tuple[datetime, datetime]]:
    """Valida fronteras recibidas; no deriva otras desde el reloj o inicio."""
    require(windows["timezone"] == "America/Bogota", "Zona de corte incompatible.")
    bogota = ZoneInfo("America/Bogota")
    result = {}
    for period in PERIODS:
        value = windows[period]
        require(type(value["days"]) is int and value["days"] == 7,
                "Cada ventana requiere siete días completos.")
        start = aware_instant(value["start_inclusive"])
        end = aware_instant(value["end_exclusive"])
        local_start, local_end = start.astimezone(bogota), end.astimezone(bogota)
        require(local_start.time() == local_end.time() == time.min,
                "Las fronteras no son medianoches de Bogotá.")
        require((local_end.date() - local_start.date()).days == 7,
                "Las ventanas no abarcan siete fechas completas.")
        result[period] = (start, end)
    require(result["previous"][1] == result["recent"][0],
            "Las ventanas deben ser consecutivas, sin solapamiento.")
    return result


def validate_context(context: AnalysisContext) -> dict[Period, tuple[datetime, datetime]]:
    require(isinstance(context, AnalysisContext), "Falta el contexto de la ejecución.")
    require(isinstance(context.run_id, str) and bool(context.run_id), "Falta el ID de ejecución.")
    require(type(context.run_revision) is int and context.run_revision > 0, "Revisión inválida.")
    require(isinstance(context.input_version, str) and bool(context.input_version),
            "Falta la versión exacta de entradas.")
    require(isinstance(context.processed_at, datetime) and context.processed_at.tzinfo is not None
            and context.processed_at.utcoffset() is not None, "El instante de procesamiento requiere zona explícita.")
    require(len(context.source_ids) == len(set(context.source_ids)) == 11
            and all(isinstance(source, str) and source for source in context.source_ids),
            "El contexto debe conservar las once fuentes distintas.")
    require(set(context.versions) == {"rules_version", "classification_version", "criteria_version"}
            and all(isinstance(value, str) and value for value in context.versions.values()),
            "Faltan versiones comunes de reglas, clasificación o criterios.")
    return window_instants(context.windows)


def validate_confirmed_groups(context: AnalysisContext, groups: Record) -> None:
    if groups["state"] != "confirmed" or groups["confirmation"] is None:
        raise GroupsNotConfirmedError("La propuesta debe confirmarse antes del conteo.")
    require(groups["run_id"] == context.run_id, "Grupos de otra ejecución.")
    require(dict(groups["versions"]) == dict(context.versions), "Versiones de grupos incompatibles.")
    require(window_instants(groups["input_windows"]) == window_instants(context.windows),
            "Los grupos no utilizaron las mismas ventanas.")
    confirmation = groups["confirmation"]
    require(confirmation["groups_id"] == groups["groups_id"]
            and confirmation["groups_version"] == groups["groups_version"]
            and confirmation["actor"] == "shared_demo_operator",
            "La confirmación no corresponde a la versión de grupos.")
    require(aware_instant(confirmation["confirmed_at"]) >= aware_instant(groups["created_at"]),
            "La confirmación es anterior a la propuesta.")
    for trace in groups["generation_trace"]:
        require(trace["criteria_version"] == context.versions["criteria_version"],
                "La propuesta mezcla versiones de criterios.")


def coverage_cells(context: AnalysisContext, coverage: Record) -> dict[tuple[str, Period], Record]:
    require(coverage["run_id"] == context.run_id
            and coverage["run_revision"] == context.run_revision,
            "La cobertura no corresponde a la ejecución y revisión.")
    require(coverage["expected_source_count"] == 11, "Cobertura con otro corpus previsto.")
    cells = {}
    for cell in coverage["cells"]:
        pair = (cell["source_id"], cell["window"])
        require(pair not in cells, "La cobertura repite una fuente y ventana.")
        cells[pair] = cell
    require(set(cells) == {(source, period) for source in context.source_ids for period in PERIODS},
            "La cobertura debe conservar los 22 pares del corpus.")
    return cells


def _resolved(stage: Record) -> bool:
    return stage["state"] == "complete" or (
        stage["state"] == "not_applicable" and bool(stage["reason"])
    )


def coverage_gaps(cells: Mapping[tuple[str, Period], Record]) -> dict[Period, set[str]]:
    """Regla común de cobertura por ventana, usada en conteo y comparación."""
    missing: dict[Period, set[str]] = {period: set() for period in PERIODS}
    for (source, period), cell in cells.items():
        if not (cell["acquisition"]["state"] == "complete"
                and cell["pagination_complete"]
                and all(_resolved(cell[stage]) for stage in ("eligibility", "ia_relevance", "main_topic"))
                and not cell["unresolved_video_ids"]):
            missing[period].add(source)
    return missing


def count_publications(
    context: AnalysisContext,
    *,
    groups: Record,
    publications: Sequence[Record],
    coverage: Record,
) -> CountSnapshot:
    """Cuenta el principal confirmado; los pendientes conservan total desconocido.

    Entradas: registros canónicos prevalidados de la misma unidad inmutable.
    Repeticiones idénticas de una publicación cuentan una vez; copias en
    conflicto, referencias ajenas o versiones mezcladas se rechazan.
    """
    try:
        return _count_publications(context, groups, publications, coverage)
    except (KeyError, TypeError, AttributeError) as error:
        raise AnalysisInputError("Faltan campos canónicos de la unidad de conteo.") from error


def _count_publications(context, groups, publications, coverage) -> CountSnapshot:
    intervals = validate_context(context)
    validate_confirmed_groups(context, groups)
    cells = coverage_cells(context, coverage)
    missing = coverage_gaps(cells)

    videos = {}
    for publication in publications:
        require(publication["run_id"] == context.run_id, "Publicación de otra ejecución.")
        require(publication["source_id"] in context.source_ids, "Publicación de otra fuente.")
        video_id = publication["video_id"]
        require(video_id not in videos or publication == videos[video_id],
                "El mismo video tiene capturas o clasificaciones en conflicto.")
        videos[video_id] = publication

    for (source, period), cell in cells.items():
        for video_id in set(cell["discovered_video_ids"]) | set(cell["unresolved_video_ids"]):
            publication = videos.get(video_id)
            if publication is None:
                missing[period].add(source)
            else:
                require(publication["source_id"] == source, "Un ID de cobertura pertenece a otra fuente.")

    topics = {topic["topic_id"]: topic for topic in groups["topics"]}
    require(len(topics) == len(groups["topics"]), "La propuesta repite una identidad temática.")
    evidence = {item["evidence_id"]: item for item in groups["evidence"]}
    require(len(evidence) == len(groups["evidence"]), "La propuesta repite una identidad de evidencia.")
    for topic in topics.values():
        for evidence_id in topic["equivalence_evidence_ids"]:
            require(evidence_id in evidence and evidence[evidence_id]["video_id"] in videos,
                    "La equivalencia referencia evidencia o publicaciones ajenas.")

    assignments = {}
    for assignment in groups["assignments"]:
        video_id = assignment["video_id"]
        require(video_id not in assignments, "Cada video requiere una sola asignación principal.")
        require(video_id in videos, "La asignación referencia una publicación no recibida.")
        require(assignment["main_topic_id"] in topics, "El principal no existe en esta versión.")
        secondary = assignment["secondary_topic_ids"]
        require(len(secondary) == len(set(secondary)) and set(secondary) <= set(topics)
                and assignment["main_topic_id"] not in secondary,
                "Los temas secundarios no son válidos para esta versión.")
        require(bool(assignment["evidence_ids"]), "La asignación requiere evidencia de la pieza.")
        for evidence_id in assignment["evidence_ids"]:
            require(evidence_id in evidence and evidence[evidence_id]["video_id"] == video_id,
                    "La asignación referencia evidencia inexistente o de otra pieza.")
        assignments[video_id] = assignment
    unresolved = set(groups["unresolved_video_ids"])
    require(not (unresolved & set(assignments)), "Asignaciones y pendientes se solapan.")
    require(unresolved <= set(videos), "Los pendientes de grupos referencian publicaciones ajenas.")

    buckets = {topic_id: {period: {} for period in PERIODS} for topic_id in topics}
    for video_id, publication in videos.items():
        source = publication["source_id"]
        published = aware_instant(publication["published_at"]) if publication["published_at"] is not None else None
        matching = [period for period, (start, end) in intervals.items() if published is not None and start <= published < end]
        period = matching[0] if matching else None
        if published is not None and publication["window"] is not None:
            require(publication["window"] == period, "Fecha pública y ventana declarada no coinciden.")

        if publication["eligibility"] == "excluded":
            require(video_id not in assignments and video_id not in unresolved,
                    "Una exclusión resuelta no debe tener asignación o tema pendiente.")
            continue
        if publication["eligibility"] == "pending":
            require(video_id not in assignments, "Una publicación pendiente no puede contarse.")
            for affected in (matching if published is not None else PERIODS):
                missing[affected].add(source)
            continue

        require(publication["eligibility"] == "eligible", "Estado de elegibilidad no válido.")
        decision = publication["ai_relevance"]
        require(publication["public_state"] == "confirmed_public"
                and publication["duration"]["state"] == "known"
                and 0 <= publication["duration"]["seconds"] <= 180
                and period is not None and publication["window"] == period
                and decision["state"] == "decided" and decision["decision"] == "relevant",
                "La publicación no sustenta elegibilidad temática para el conteo.")
        require(decision["trace"]["criteria_version"] == context.versions["criteria_version"],
                "La pertinencia mezcla versiones de criterios.")
        ai_evidence = {item["evidence_id"]: item for item in publication["evidence"]}
        require(bool(decision["evidence_ids"]) and all(
            item in ai_evidence and ai_evidence[item]["video_id"] == video_id
            for item in decision["evidence_ids"]
        ), "La pertinencia no conserva su evidencia de entrada.")
        require(video_id in cells[(source, period)]["discovered_video_ids"],
                "La pieza contada no pertenece a la adquisición de esa ventana.")
        if video_id not in assignments:
            require(video_id in unresolved, "Falta asignación o pendiente explícito de una pieza pertinente.")
            missing[period].add(source)
            continue
        assignment = assignments[video_id]
        require(publication["main_topic_id"] in (None, assignment["main_topic_id"]),
                "La publicación referencia otro principal.")
        require(not publication["secondary_topic_ids"]
                or set(publication["secondary_topic_ids"]) == set(assignment["secondary_topic_ids"]),
                "La publicación mezcla asignaciones secundarias de otra versión.")
        buckets[assignment["main_topic_id"]][period][video_id] = source

    require(coverage["thematic_state"] != "complete" or not any(missing.values()),
            "La cobertura marcada completa contiene material o etapas pendientes.")

    def make_count(topic_id, period) -> Count:
        members = buckets[topic_id][period]
        ids = sorted(members)
        contributions = [
            {"source_id": source, "video_ids": source_ids, "observed_count": len(source_ids)}
            for source in context.source_ids
            if (source_ids := [video_id for video_id in ids if members[video_id] == source])
        ]
        known = not missing[period]
        return {
            "state": "known" if known else "unknown",
            "total_count": len(ids) if known else None,
            "reason": None if known else "Cobertura temática incompleta de la ventana; fuentes pendientes: " + ", ".join(sorted(missing[period])) + ".",
            "observed_count": len(ids), "video_ids": ids, "by_source": contributions,
        }

    return {
        "run_id": context.run_id, "run_revision": context.run_revision,
        "input_version": context.input_version,
        "processed_at": context.processed_at.astimezone(UTC).isoformat().replace("+00:00", "Z"),
        "windows": deepcopy(context.windows), "versions": dict(context.versions),
        "groups_id": groups["groups_id"], "groups_version": groups["groups_version"],
        "confirmation_id": groups["confirmation"]["confirmation_id"],
        "topics": [{"topic_id": topic_id, "previous": make_count(topic_id, "previous"),
                    "recent": make_count(topic_id, "recent")} for topic_id in topics],
    }
