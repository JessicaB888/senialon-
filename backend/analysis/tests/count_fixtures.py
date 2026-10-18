"""Entradas SINTÉTICAS derivadas de ejemplos canónicos, nunca datos de demo."""

from copy import deepcopy
from datetime import datetime
import json
from pathlib import Path

from analysis import AnalysisContext

CONTRACT = json.loads(
    (Path(__file__).resolve().parents[3] / "docs/contracts/openapi.json").read_text()
)


def example(name):
    return deepcopy(CONTRACT["components"]["examples"][name]["value"])


def count_fixture():
    run = example("CreatedRun")["data"]
    groups = example("ConfirmedGroups")["data"]["proposal"]
    coverage = example("CompleteCoverage")["data"]
    context = AnalysisContext(
        run_id=run["run_id"], run_revision=coverage["run_revision"],
        windows=run["windows"], versions=run["versions"],
        source_ids=tuple(source["source_id"] for source in run["corpus"]),
        input_version="fixture-input-v1",
        processed_at=datetime.fromisoformat("2026-10-17T12:00:00-05:00"),
    )
    publications = []
    for assignment in groups["assignments"]:
        video_id = assignment["video_id"]
        publication = example("PublicVideo180")["data"]
        publication["video_id"] = video_id
        publication["capture_id"] = "fixture-capture-" + video_id
        publication["url"] = "https://example.invalid/watch/" + video_id
        publication["window"] = "previous" if video_id.startswith("demoA") else "recent"
        publication["published_at"] = "2026-10-05T10:00:00-05:00" if publication["window"] == "previous" else "2026-10-14T10:00:00-05:00"
        publication["ai_relevance"]["evidence_ids"] = deepcopy(assignment["evidence_ids"])
        publication["ai_relevance"]["trace"]["provider_request_id"] = "fixture-jev-" + video_id
        publication["main_topic_id"] = assignment["main_topic_id"]
        publication["secondary_topic_ids"] = deepcopy(assignment["secondary_topic_ids"])
        publication["evidence"] = [deepcopy(item) for item in groups["evidence"] if item["video_id"] == video_id]
        publications.append(publication)
    return context, groups, publications, coverage


def remove_from_topic(groups, publication, *, unresolved=False):
    video_id = publication["video_id"]
    groups["assignments"] = [item for item in groups["assignments"] if item["video_id"] != video_id]
    if unresolved:
        groups["unresolved_video_ids"].append(video_id)


def exclude(publication):
    publication["eligibility"] = "excluded"
    publication["eligibility_reason"] = "Fixture: exclusión técnica conocida de 181 segundos."
    publication["duration"]["seconds"] = 181
    publication["main_topic_id"] = None


def comparison_fixture(previous=2, recent=4):
    """Ajusta únicamente escenarios numéricos sintéticos y sus asignaciones."""
    context, groups, publications, coverage = count_fixture()
    limits = {"previous": previous, "recent": recent}
    kept = {"previous": 0, "recent": 0}
    for publication in publications:
        period = publication["window"]
        kept[period] += 1
        if kept[period] > limits[period]:
            exclude(publication)
            remove_from_topic(groups, publication)
    return context, groups, publications, coverage
