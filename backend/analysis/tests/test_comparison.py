"""ALG 2.6: señales descriptivas comprobadas con entradas sintéticas."""

from copy import deepcopy
from dataclasses import replace
from datetime import datetime
import json

import pytest

from analysis import AnalysisInputError, GroupsNotConfirmedError, compare_topics, count_publications
from analysis.tests.count_fixtures import comparison_fixture, count_fixture, example


def inputs(previous=2, recent=4, *, partial=False):
    context, groups, publications, coverage = comparison_fixture(previous, recent)
    if partial:
        coverage = example("PartialCoverage")["data"]
    counts = count_publications(context, groups=groups, publications=publications, coverage=coverage)
    return context, counts, groups, coverage


def compare(fixture, revision=1):
    context, counts, groups, coverage = fixture
    return compare_topics(context, counts=counts, groups=groups, coverage=coverage, comparison_revision=revision)


@pytest.mark.parametrize(
    ("previous", "recent", "kind", "direction", "delta", "percentage", "example_name"),
    [
        (2, 4, "comparable", "increase", 2, 100, "Signal_2_4"),
        (2, 0, "comparable", "decrease", -2, -100, "Signal_2_0"),
        (0, 3, "new_in_corpus", "increase", 3, None, "Signal_0_3"),
        (0, 0, "no_observed_publications", "unchanged", 0, None, "Signal_0_0"),
        (2, 2, "comparable", "unchanged", 0, 0, "Signal_2_2"),
    ],
)
def test_formula_and_zero_cases_match_canonical_signals(previous, recent, kind, direction, delta, percentage, example_name):
    result = compare(inputs(previous, recent))
    signal = result["signals"][0]
    assert result["state"] == result["coverage_state"] == "complete"
    assert signal == example(example_name)
    assert signal["kind"] == kind and signal["direction"] == direction
    assert signal["delta"] == delta and signal["percentage_change"] == percentage


def test_percentage_is_formula_without_threshold_or_rounding():
    context, groups, publications, coverage = count_fixture()
    clone = json.loads(json.dumps(publications[0]).replace("demoA000001", "demoA000003"))
    publications.append(clone)
    groups["assignments"].append({"video_id": clone["video_id"], "main_topic_id": clone["main_topic_id"], "secondary_topic_ids": [], "evidence_ids": clone["ai_relevance"]["evidence_ids"]})
    groups["evidence"].extend(deepcopy(clone["evidence"]))
    groups["topics"][0]["equivalence_evidence_ids"].extend(clone["ai_relevance"]["evidence_ids"])
    coverage["cells"][0]["discovered_video_ids"].append(clone["video_id"])
    counts = count_publications(context, groups=groups, publications=publications, coverage=coverage)
    signal = compare((context, counts, groups, coverage))["signals"][0]
    assert signal["previous"]["total_count"] == 3
    assert signal["percentage_change"] == pytest.approx(100 / 3)
    assert signal["direction"] == "increase"


def test_partial_coverage_has_no_delta_percentage_or_novelty():
    result = compare(inputs(partial=True))
    signal = result["signals"][0]
    assert result["state"] == result["coverage_state"] == "partial"
    assert signal["kind"] == "comparison_pending"
    assert signal["direction"] == "not_evaluable"
    assert signal["previous"]["total_count"] is None
    assert signal["previous"]["observed_count"] == 2
    assert signal["recent"]["total_count"] == 4
    assert signal["delta"] is signal["percentage_change"] is None


def test_unknown_baseline_with_no_observations_is_not_new_in_corpus():
    signal = compare(inputs(0, 3, partial=True))["signals"][0]
    assert signal["previous"]["observed_count"] == 0
    assert signal["previous"]["total_count"] is None
    assert signal["kind"] == "comparison_pending"
    assert signal["percentage_change"] is None


def test_aggregate_partial_remains_pending_even_with_two_known_numbers():
    fixture = inputs()
    fixture[3]["thematic_state"] = "partial"
    result = compare(fixture)
    signal = result["signals"][0]
    assert signal["previous"]["total_count"] == 2 and signal["recent"]["total_count"] == 4
    assert signal["kind"] == "comparison_pending"
    assert signal["delta"] is signal["percentage_change"] is None


def test_pending_coverage_remains_pending_without_claiming_complete_comparison():
    fixture = inputs(partial=True)
    fixture[3]["thematic_state"] = "pending"
    result = compare(fixture)
    assert result["state"] == "partial" and result["coverage_state"] == "pending"
    assert result["signals"][0]["kind"] == "comparison_pending"


def test_unconfirmed_groups_do_not_calculate_signals():
    fixture = inputs()
    fixture[2]["state"] = "proposed"
    fixture[2]["confirmation"] = None
    with pytest.raises(GroupsNotConfirmedError): compare(fixture)


@pytest.mark.parametrize("revision", [0, -1, True, None, "1", 1.5])
def test_comparison_revision_must_be_reserved_by_be(revision):
    with pytest.raises(AnalysisInputError): compare(inputs(), revision)


def test_processing_at_later_date_keeps_original_windows_and_versions():
    context, counts, groups, coverage = inputs()
    context = replace(context, processed_at=datetime.fromisoformat("2026-10-18T12:00:00-05:00"))
    result = compare((context, counts, groups, coverage), 17)
    assert result["windows"] == counts["windows"]
    assert result["comparison_revision"] == 17
    assert result["computed_at"] == "2026-10-18T17:00:00Z"


def test_groups_and_coverage_limitations_are_preserved_without_duplicate_text():
    fixture = inputs()
    fixture[2]["limitations"] = ["Fixture: límite de evidencia.", fixture[3]["limitations"][0]]
    result = compare(fixture)
    assert result["limitations"] == [fixture[3]["limitations"][0], "Fixture: límite de evidencia."]


@pytest.mark.parametrize("case", [
    "run", "revision", "input_version", "criteria", "windows", "groups_version", "confirmation",
    "duplicate_topic", "missing_topic", "duplicate_video", "wrong_observed", "wrong_total",
    "missing_contribution", "wrong_contribution", "foreign_source", "double_source", "wrong_window",
    "unknown_with_total", "unknown_without_reason", "complete_with_unknown", "complete_with_failed_stage",
    "future_count", "duplicate_across_windows", "non_principal", "missing_assignment_video",
])
def test_invalid_or_mixed_count_snapshots_do_not_produce_signals(case):
    context, counts, groups, coverage = inputs()
    count = counts["topics"][0]["previous"]
    if case == "run": counts["run_id"] = "other-run"
    elif case == "revision": counts["run_revision"] += 1
    elif case == "input_version": counts["input_version"] = "other-input"
    elif case == "criteria": counts["versions"]["criteria_version"] = "other-criteria"
    elif case == "windows": counts["windows"]["recent"]["end_exclusive"] = "2026-10-18T00:00:00-05:00"
    elif case == "groups_version": groups["groups_version"] = groups["confirmation"]["groups_version"] = 2
    elif case == "confirmation": counts["confirmation_id"] = "other-confirmation"
    elif case == "duplicate_topic": counts["topics"].append(deepcopy(counts["topics"][0]))
    elif case == "missing_topic": counts["topics"] = []
    elif case == "duplicate_video": count["video_ids"].append(count["video_ids"][0])
    elif case == "wrong_observed": count["observed_count"] += 1
    elif case == "wrong_total": count["total_count"] += 1
    elif case == "missing_contribution": count["by_source"] = []
    elif case == "wrong_contribution": count["by_source"][0]["observed_count"] += 1
    elif case == "foreign_source": count["by_source"][0]["source_id"] = "foreign-source"
    elif case == "double_source": count["by_source"].append(deepcopy(count["by_source"][0]))
    elif case == "wrong_window": count["by_source"][0]["source_id"] = "c02"
    elif case == "unknown_with_total": count["state"] = "unknown"; count["reason"] = "Fixture: desconocido."; coverage["thematic_state"] = "partial"
    elif case == "unknown_without_reason": count["state"] = "unknown"; count["total_count"] = None; count["reason"] = ""; coverage["thematic_state"] = "partial"
    elif case == "complete_with_unknown": count["state"] = "unknown"; count["total_count"] = None; count["reason"] = "Fixture: desconocido."
    elif case == "complete_with_failed_stage": coverage["cells"][0]["main_topic"] = {"state": "failed", "reason": "Fixture: fallo aún pendiente."}
    elif case == "future_count": counts["processed_at"] = "2026-10-18T12:00:00-05:00"
    elif case == "duplicate_across_windows":
        counts["topics"][0]["recent"] = deepcopy(count)
        coverage["cells"][1]["discovered_video_ids"] = deepcopy(count["video_ids"])
    elif case == "non_principal": groups["assignments"][0]["main_topic_id"] = "foreign-topic"
    elif case == "missing_assignment_video":
        removed = count["video_ids"].pop()
        count["observed_count"] -= 1; count["total_count"] -= 1
        count["by_source"][0]["video_ids"].remove(removed); count["by_source"][0]["observed_count"] -= 1
    with pytest.raises(AnalysisInputError): compare((context, counts, groups, coverage))


def test_output_is_json_ready_does_not_mutate_inputs_and_adds_no_ranking():
    fixture = inputs()
    before = deepcopy(fixture)
    result = compare(fixture)
    assert fixture == before
    assert json.loads(json.dumps(result)) == result
    assert set(result) == set(example("CompleteComparison")["data"])
    result["signals"][0]["recent"]["video_ids"].clear()
    result["windows"]["recent"]["start_inclusive"] = "changed output"
    assert fixture == before
