"""ALG 2.5: reglas deterministas; ninguna inferencia o proveedor real."""

from copy import deepcopy
from dataclasses import replace
from datetime import datetime

import pytest

from analysis import AnalysisInputError, GroupsNotConfirmedError, count_publications
from analysis.tests.count_fixtures import count_fixture, example, exclude, remove_from_topic


def calculate(fixture):
    context, groups, publications, coverage = fixture
    return count_publications(context, groups=groups, publications=publications, coverage=coverage)


def test_counts_match_canonical_two_and_four_with_partitioned_sources():
    result = calculate(count_fixture())
    expected = example("Signal_2_4")
    for period in ("previous", "recent"):
        actual = result["topics"][0][period]
        assert actual == expected[period]
        assert sum(item["observed_count"] for item in actual["by_source"]) == actual["observed_count"]


def test_identical_publication_from_retry_counts_once():
    fixture = count_fixture()
    expected = calculate(fixture)
    fixture[2].extend([deepcopy(fixture[2][0]), deepcopy(fixture[2][0])])
    assert calculate(fixture) == expected


def test_reordering_inputs_does_not_change_counts_or_contributions():
    fixture = count_fixture()
    expected = calculate(fixture)
    fixture[1]["assignments"].reverse()
    fixture[2].reverse()
    fixture[3]["cells"].reverse()
    assert calculate(fixture) == expected


def test_secondary_topic_is_visible_but_receives_no_publications():
    context, groups, publications, coverage = count_fixture()
    topic = deepcopy(groups["topics"][0])
    topic["topic_id"] = "fixture-topic-secondary"
    groups["topics"].append(topic)
    groups["assignments"][0]["secondary_topic_ids"] = [topic["topic_id"]]
    publications[0]["secondary_topic_ids"] = [topic["topic_id"]]
    result = calculate((context, groups, publications, coverage))
    assert result["topics"][0]["previous"]["total_count"] == 2
    for period in ("previous", "recent"):
        assert result["topics"][1][period]["total_count"] == 0
        assert result["topics"][1][period]["video_ids"] == []


def test_metrics_and_short_label_do_not_change_topic_counts_without_deep_analysis():
    fixture = count_fixture()
    expected = calculate(fixture)
    for publication in fixture[2]:
        publication["statistics"]["views"]["value"] = "999999999"
        publication["short_status"] = "confirmed_short"
        publication["short_evidence"] = "Fixture: confirmación independiente de duración."
    assert calculate(fixture) == expected


def test_multiple_channels_partition_distinct_ids():
    fixture = count_fixture()
    moved = fixture[2][-1]
    moved["source_id"] = "c02"
    for cell in fixture[3]["cells"]:
        if cell["window"] == "recent":
            if cell["source_id"] == "c01": cell["discovered_video_ids"].remove(moved["video_id"])
            if cell["source_id"] == "c02": cell["discovered_video_ids"].append(moved["video_id"])
    contributions = calculate(fixture)["topics"][0]["recent"]["by_source"]
    assert [item["observed_count"] for item in contributions] == [3, 1]
    assert len({video_id for item in contributions for video_id in item["video_ids"]}) == 4


def test_shared_boundary_belongs_only_to_recent_window():
    fixture = count_fixture()
    publication = fixture[2][0]
    publication["published_at"] = fixture[0].windows["recent"]["start_inclusive"]
    publication["window"] = "recent"
    for cell in fixture[3]["cells"]:
        if cell["source_id"] == "c01":
            if cell["window"] == "previous": cell["discovered_video_ids"].remove(publication["video_id"])
            else: cell["discovered_video_ids"].append(publication["video_id"])
    result = calculate(fixture)["topics"][0]
    assert result["previous"]["total_count"] == 1
    assert result["recent"]["total_count"] == 5


def test_equivalent_utc_group_boundaries_are_not_another_window_version():
    fixture = count_fixture()
    expected = calculate(fixture)
    for period in ("previous", "recent"):
        for key in ("start_inclusive", "end_exclusive"):
            value = fixture[1]["input_windows"][period][key]
            fixture[1]["input_windows"][period][key] = value.replace("T00:00:00-05:00", "T05:00:00Z")
    assert calculate(fixture) == expected


def test_empty_resolved_input_is_known_zero_not_missing():
    fixture = count_fixture()
    fixture[1]["assignments"] = []
    fixture[1]["evidence"] = []
    fixture[1]["topics"][0]["equivalence_evidence_ids"] = []
    fixture[2].clear()
    for cell in fixture[3]["cells"]: cell["discovered_video_ids"] = []
    for period in ("previous", "recent"):
        actual = calculate(fixture)["topics"][0][period]
        assert actual == {"state": "known", "total_count": 0, "reason": None,
                          "observed_count": 0, "video_ids": [], "by_source": []}


def test_partial_coverage_limits_entire_window_even_with_resolved_topic_ids():
    context, groups, publications, _ = count_fixture()
    result = calculate((context, groups, publications, example("PartialCoverage")["data"]))["topics"][0]
    assert result["previous"]["state"] == "unknown"
    assert result["previous"]["total_count"] is None
    assert result["previous"]["observed_count"] == 2
    assert "c02" in result["previous"]["reason"]
    assert result["recent"]["state"] == "known"


def test_unknown_with_zero_observations_is_not_known_zero():
    context, groups, publications, _ = count_fixture()
    coverage = example("PartialCoverage")["data"]
    for publication in publications[:2]:
        exclude(publication)
        remove_from_topic(groups, publication)
    actual = calculate((context, groups, publications, coverage))["topics"][0]["previous"]
    assert actual["observed_count"] == 0
    assert actual["total_count"] is None
    assert actual["state"] == "unknown"


@pytest.mark.parametrize("state", ["failed", "pending", "insufficient", "blocked", "uncertain"])
def test_unresolved_relevance_stage_does_not_become_complete(state):
    fixture = count_fixture()
    fixture[3]["cells"][0]["ia_relevance"] = {"state": state, "reason": "Fixture: pendiente real de esta etapa."}
    fixture[3]["thematic_state"] = "partial"
    result = calculate(fixture)["topics"][0]
    assert result["previous"]["total_count"] is None
    assert result["recent"]["total_count"] == 4


def test_resolved_empty_channel_can_have_justified_non_applicable_stages():
    fixture = count_fixture()
    for cell in fixture[3]["cells"]:
        if cell["source_id"] == "c03":
            for stage in ("eligibility", "ia_relevance", "main_topic"):
                cell[stage] = {"state": "not_applicable", "reason": "Fixture: canal consultado sin material."}
    assert calculate(fixture)["topics"][0]["previous"]["state"] == "known"


def test_unresolved_main_topic_preserves_other_observations_and_unknown_total():
    fixture = count_fixture()
    publication = fixture[2][-1]
    publication["main_topic_id"] = None
    remove_from_topic(fixture[1], publication, unresolved=True)
    fixture[3]["thematic_state"] = "partial"
    fixture[3]["cells"][1]["main_topic"] = {"state": "pending", "reason": "Fixture: tema no resuelto."}
    result = calculate(fixture)["topics"][0]["recent"]
    assert result["observed_count"] == 3
    assert result["total_count"] is None


def test_pending_without_known_public_date_limits_both_possible_windows():
    fixture = count_fixture()
    publication = fixture[2][-1]
    publication["eligibility"] = "pending"
    publication["published_at"] = publication["window"] = publication["main_topic_id"] = None
    remove_from_topic(fixture[1], publication, unresolved=True)
    fixture[3]["thematic_state"] = "partial"
    result = calculate(fixture)["topics"][0]
    assert result["previous"]["state"] == result["recent"]["state"] == "unknown"
    assert result["recent"]["observed_count"] == 3


def test_missing_discovered_record_limits_window_instead_of_assuming_exclusion():
    fixture = count_fixture()
    fixture[3]["cells"][0]["discovered_video_ids"].append("missing0001")
    fixture[3]["thematic_state"] = "partial"
    actual = calculate(fixture)["topics"][0]["previous"]
    assert actual["total_count"] is None
    assert actual["observed_count"] == 2


def test_known_technical_exclusion_needs_no_theme_or_deep_analysis():
    fixture = count_fixture()
    publication = fixture[2][0]
    exclude(publication)
    remove_from_topic(fixture[1], publication)
    actual = calculate(fixture)["topics"][0]
    assert actual["previous"]["total_count"] == 1
    assert actual["recent"]["total_count"] == 4


@pytest.mark.parametrize("case", ["proposed", "missing_confirmation"])
def test_confirmation_is_mandatory_before_any_count(case):
    fixture = count_fixture()
    if case == "proposed": fixture[1]["state"] = "proposed"
    else: fixture[1]["confirmation"] = None
    with pytest.raises(GroupsNotConfirmedError): calculate(fixture)


@pytest.mark.parametrize("case", [
    "confirmation_version", "confirmation_id", "criteria", "coverage_revision",
    "coverage_run", "duplicate_cell", "missing_cell", "foreign_source", "foreign_run",
    "duplicate_assignment", "unknown_topic", "secondary_principal", "foreign_secondary",
    "missing_evidence", "foreign_evidence", "duplicate_evidence", "duplicate_topic",
    "assignment_pending_overlap", "missing_assignment", "foreign_main_topic",
    "conflicting_capture", "outside_window", "wrong_window", "wrong_ai_criteria",
    "missing_acquisition", "unconfirmed_public", "too_long", "wrong_relevance",
    "missing_input_version", "naive_processing_time",
    "inconsistent_complete_coverage",
])
def test_incompatible_snapshots_are_rejected(case):
    context, groups, publications, coverage = count_fixture()
    if case == "confirmation_version": groups["confirmation"]["groups_version"] += 1
    elif case == "confirmation_id": groups["confirmation"]["groups_id"] = "foreign-groups"
    elif case == "criteria": context = replace(context, versions={**context.versions, "criteria_version": "other"})
    elif case == "coverage_revision": coverage["run_revision"] += 1
    elif case == "coverage_run": coverage["run_id"] = "foreign-run"
    elif case == "duplicate_cell": coverage["cells"][1] = deepcopy(coverage["cells"][0])
    elif case == "missing_cell": coverage["cells"].pop()
    elif case == "foreign_source": publications[0]["source_id"] = "foreign-source"
    elif case == "foreign_run": publications[0]["run_id"] = "foreign-run"
    elif case == "duplicate_assignment": groups["assignments"].append(deepcopy(groups["assignments"][0]))
    elif case == "unknown_topic": groups["assignments"][0]["main_topic_id"] = "foreign-topic"
    elif case == "secondary_principal": groups["assignments"][0]["secondary_topic_ids"] = [groups["topics"][0]["topic_id"]]
    elif case == "foreign_secondary": groups["assignments"][0]["secondary_topic_ids"] = ["foreign-topic"]
    elif case == "missing_evidence": groups["assignments"][0]["evidence_ids"] = ["foreign-evidence"]
    elif case == "foreign_evidence": groups["evidence"][0]["video_id"] = publications[1]["video_id"]
    elif case == "duplicate_evidence": groups["evidence"].append(deepcopy(groups["evidence"][0]))
    elif case == "duplicate_topic": groups["topics"].append(deepcopy(groups["topics"][0]))
    elif case == "assignment_pending_overlap": groups["unresolved_video_ids"].append(publications[0]["video_id"])
    elif case == "missing_assignment": remove_from_topic(groups, publications[0])
    elif case == "foreign_main_topic": publications[0]["main_topic_id"] = "foreign-topic"
    elif case == "conflicting_capture": publications.append({**deepcopy(publications[0]), "capture_id": "another-capture"})
    elif case == "outside_window": publications[0]["published_at"] = context.windows["recent"]["end_exclusive"]
    elif case == "wrong_window": publications[0]["window"] = "recent"
    elif case == "wrong_ai_criteria": publications[0]["ai_relevance"]["trace"]["criteria_version"] = "other"
    elif case == "missing_acquisition": coverage["cells"][0]["discovered_video_ids"].remove(publications[0]["video_id"])
    elif case == "unconfirmed_public": publications[0]["public_state"] = "unknown"
    elif case == "too_long": publications[0]["duration"]["seconds"] = 181
    elif case == "wrong_relevance": publications[0]["ai_relevance"]["decision"] = "not_relevant"
    elif case == "missing_input_version": context = replace(context, input_version="")
    elif case == "naive_processing_time": context = replace(context, processed_at=datetime(2026, 10, 17))
    elif case == "inconsistent_complete_coverage": coverage["cells"][0]["main_topic"] = {"state": "pending", "reason": "Fixture: no puede declararse completo."}
    with pytest.raises(AnalysisInputError): calculate((context, groups, publications, coverage))


def test_count_does_not_mutate_the_context_or_any_input_snapshot():
    fixture = count_fixture()
    before = deepcopy(fixture)
    result = calculate(fixture)
    assert fixture == before
    result["topics"][0]["recent"]["video_ids"].clear()
    result["windows"]["recent"]["start_inclusive"] = "changed output"
    assert fixture == before
