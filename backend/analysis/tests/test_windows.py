"""Casos temporales deterministas; no hay consultas o publicaciones reales."""

from datetime import UTC, datetime, timedelta, tzinfo
import json
from pathlib import Path
from zoneinfo import ZoneInfo

import pytest

from analysis import derive_windows


def instant(value: str) -> datetime:
    return datetime.fromisoformat(value)


def test_example_agrees_with_canonical_contract():
    contract = json.loads(
        (Path(__file__).resolve().parents[3] / "docs/contracts/openapi.json").read_text()
    )
    example = contract["components"]["examples"]["CreatedRun"]["value"]["data"]
    actual = derive_windows(instant(example["started_at"]))
    expected = example["windows"]
    assert actual["timezone"] == expected["timezone"]
    for period in ("previous", "recent"):
        assert actual[period]["days"] == expected[period]["days"] == 7
        for boundary in ("start_inclusive", "end_exclusive"):
            assert instant(actual[period][boundary]) == instant(expected[period][boundary])


@pytest.mark.parametrize(
    ("started_at", "previous_start", "recent_start", "recent_end"),
    [
        ("2026-10-18T04:59:59.999999Z", "2026-10-03", "2026-10-10", "2026-10-17"),
        ("2026-10-18T05:00:00Z", "2026-10-04", "2026-10-11", "2026-10-18"),
        ("2026-10-18T05:00:00.000001Z", "2026-10-04", "2026-10-11", "2026-10-18"),
        ("2026-01-01T04:59:59Z", "2025-12-17", "2025-12-24", "2025-12-31"),
        ("2026-01-01T05:00:00Z", "2025-12-18", "2025-12-25", "2026-01-01"),
        ("2024-03-01T12:00:00Z", "2024-02-16", "2024-02-23", "2024-03-01"),
        ("2025-03-01T12:00:00Z", "2025-02-15", "2025-02-22", "2025-03-01"),
        ("2026-05-01T12:00:00-05:00", "2026-04-17", "2026-04-24", "2026-05-01"),
    ],
)
def test_daily_cutoff_month_year_and_leap_boundaries(
    started_at, previous_start, recent_start, recent_end
):
    result = derive_windows(instant(started_at))
    assert result == {
        "timezone": "America/Bogota",
        "previous": {
            "start_inclusive": f"{previous_start}T05:00:00Z",
            "end_exclusive": f"{recent_start}T05:00:00Z",
            "days": 7,
        },
        "recent": {
            "start_inclusive": f"{recent_start}T05:00:00Z",
            "end_exclusive": f"{recent_end}T05:00:00Z",
            "days": 7,
        },
    }


@pytest.mark.parametrize("zone", ["UTC", "America/Bogota", "Asia/Tokyo", "America/New_York"])
def test_same_instant_in_different_zones_has_identical_windows(zone):
    reference = instant("2026-10-18T03:15:00.123456Z")
    assert derive_windows(reference.astimezone(ZoneInfo(zone))) == derive_windows(reference)


@pytest.mark.parametrize("hour", [0, 6, 12, 23])
def test_time_within_same_colombian_day_does_not_move_windows(hour):
    start = datetime(2026, 10, 18, hour, 59, 59, 999999, tzinfo=ZoneInfo("America/Bogota"))
    assert derive_windows(start) == derive_windows(instant("2026-10-18T00:00:00-05:00"))


def test_inclusive_exclusive_boundaries_and_exclusion_of_current_day():
    result = derive_windows(instant("2026-10-18T12:00:00-05:00"))
    start = instant(result["previous"]["start_inclusive"])
    shared = instant(result["recent"]["start_inclusive"])
    end = instant(result["recent"]["end_exclusive"])
    assert instant(result["previous"]["end_exclusive"]) == shared
    assert shared - start == end - shared == timedelta(days=7)
    cases = [
        (start - timedelta(microseconds=1), []),
        (start, ["previous"]),
        (shared - timedelta(microseconds=1), ["previous"]),
        (shared, ["recent"]),
        (end - timedelta(microseconds=1), ["recent"]),
        (end, []),
        (end + timedelta(hours=12), []),
    ]
    for publication_time, expected in cases:
        matching = [
            period for period in ("previous", "recent")
            if instant(result[period]["start_inclusive"]) <= publication_time
            < instant(result[period]["end_exclusive"])
        ]
        assert matching == expected


@pytest.mark.parametrize("value", [None, "2026-10-18T12:00:00Z", "2026-10-18", 1792310400, True])
def test_rejects_implicit_parsing_and_non_datetime_inputs(value):
    with pytest.raises(TypeError, match="datetime"):
        derive_windows(value)


def test_rejects_naive_datetime_instead_of_assuming_host_timezone():
    with pytest.raises(ValueError, match="desplazamiento"):
        derive_windows(datetime(2026, 10, 18, 12))


def test_rejects_tzinfo_without_known_offset():
    class UnknownOffset(tzinfo):
        def utcoffset(self, value):
            return None

    with pytest.raises(ValueError, match="desplazamiento"):
        derive_windows(datetime(2026, 10, 18, tzinfo=UnknownOffset()))


def test_rejects_dates_without_representable_previous_windows():
    with pytest.raises(ValueError, match="representar"):
        derive_windows(datetime.min.replace(tzinfo=UTC))


def test_output_is_json_ready_fresh_and_does_not_mutate_input():
    started_at = instant("2026-10-18T12:34:56.123456+09:00")
    original = started_at.isoformat()
    first = derive_windows(started_at)
    assert json.loads(json.dumps(first)) == first
    first["recent"]["start_inclusive"] = "not a boundary"
    assert derive_windows(started_at)["recent"]["start_inclusive"] != "not a boundary"
    assert started_at.isoformat() == original
