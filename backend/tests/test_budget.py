"""Synthetic budget-policy cases; no calls or actual charges."""
from copy import deepcopy
from pathlib import Path
import importlib.util
import unittest

module_spec = importlib.util.spec_from_file_location("budget", Path(__file__).parents[1] / "budget.py")
budget = importlib.util.module_from_spec(module_spec)
module_spec.loader.exec_module(budget)


def evidence():
    return {"evidence": "SYNTHETIC fixture, not an account verification", "verified_at": "2026-10-17T12:00:00-05:00"}


def fixture(mode="prepaid"):
    return {"currency": "USD", "incremental_limit_usd": "20.00",
            "baseline": {"status": "confirmed", **evidence()},
            "providers": {"jev": {"status": "verified", **evidence(), "funding_mode": mode,
                                  "selected_model": "fixture-model", "available_spend_usd": "10.00",
                                  "auto_recharge": "disabled", "tariff_verified": True,
                                  "tariff_evidence": "SYNTHETIC verified tariff", "minimum_topup_usd": "5.00",
                                  "minimum_topup_evidence": "SYNTHETIC minimum"}},
            "cash_entries": [], "usage_entries": [], "reservations": []}


def entry(identity, value, mode="prepaid", **extra):
    return {"id": identity, "provider": "jev", "amount_usd": value, "funding_mode": mode, **evidence(), **extra}


class BudgetPolicyTests(unittest.TestCase):
    def test_unconfirmed_baseline_is_not_zero(self):
        ledger = fixture(); ledger["baseline"]["status"] = "unconfirmed"
        result = budget.assess(ledger, "jev", "0.01")
        self.assertEqual(result["state"], "blocked")
        self.assertIsNone(result["budget"]["confirmed_new_charges"])

    def test_missing_quote_balance_or_rate_blocks(self):
        for field in ("available_spend_usd", "selected_model", "tariff_evidence"):
            ledger = fixture(); ledger["providers"]["jev"][field] = None
            self.assertEqual(budget.assess(ledger, "jev", "0.01")["state"], "blocked")
        self.assertEqual(budget.assess(fixture(), "jev", None)["state"], "blocked")

    def test_uncertain_reservation_keeps_balance_committed(self):
        ledger = fixture(); ledger["reservations"] = [entry("uncertain", "9.50", state="uncertain")]
        self.assertEqual(budget.assess(ledger, "jev", "0.51")["state"], "blocked")
        self.assertEqual(budget.assess(ledger, "jev", "0.50")["state"], "allowed")
        self.assertEqual(ledger["reservations"][0]["state"], "uncertain")

    def test_prepaid_topup_and_its_usage_are_not_added_twice(self):
        ledger = fixture(); ledger["cash_entries"] = [entry("topup", "15.00", kind="credit_purchase")]
        ledger["usage_entries"] = [entry("used", "12.00")]
        self.assertEqual(budget.assess(ledger, "jev", "3.00")["state"], "allowed")
        self.assertEqual(budget.assess(ledger, "jev", "3.00")["cash_commitment_usd"], "15.000000")

    def test_postpaid_usage_and_pending_charge_share_global_limit(self):
        ledger = fixture("postpaid"); ledger["cash_entries"] = [entry("extra", "10.00", kind="hosting_extra")]
        ledger["usage_entries"] = [entry("used", "9.00", "postpaid")]
        ledger["reservations"] = [entry("reserved", "0.80", "postpaid", state="active")]
        self.assertEqual(budget.assess(ledger, "jev", "0.21")["state"], "blocked")
        self.assertEqual(budget.assess(ledger, "jev", "0.20")["state"], "allowed")

    def test_topup_minimum_and_cash_cap(self):
        ledger = fixture(); ledger["cash_entries"] = [entry("prior", "16.00", kind="credit_purchase")]
        self.assertEqual(budget.assess(ledger, "jev", "4.00", kind="topup")["state"], "blocked")
        self.assertEqual(budget.assess(ledger, "jev", "5.00", kind="topup")["state"], "blocked")
        ledger["cash_entries"] = []
        self.assertEqual(budget.assess(ledger, "jev", "5.00", kind="topup")["state"], "allowed")
        ledger["providers"]["jev"]["minimum_topup_usd"] = None
        self.assertEqual(budget.assess(ledger, "jev", "5.00", kind="topup")["state"], "blocked")

    def test_invalid_money_or_raised_limit_rejected(self):
        for value in (-1, 0.01, "NaN", "-1", "1e3", "Infinity"):
            with self.assertRaises(ValueError):
                budget.assess(fixture(), "jev", value)
        ledger = fixture(); ledger["incremental_limit_usd"] = "21"
        with self.assertRaises(ValueError):
            budget.assess(ledger, "jev", "0.01")

    def test_zero_cost_needs_verified_free_mode(self):
        self.assertEqual(budget.assess(fixture(), "jev", "0")["state"], "blocked")
        ledger = fixture("free"); ledger["providers"]["jev"]["available_spend_usd"] = "0"
        self.assertEqual(budget.assess(ledger, "jev", "0")["state"], "allowed")

    def test_duplicate_entries_are_rejected(self):
        ledger = fixture(); movement = entry("duplicate", "0.10", state="uncertain")
        ledger["reservations"] = [movement, deepcopy(movement)]
        with self.assertRaises(ValueError):
            budget.assess(ledger, "jev", "0.01")

    def test_micro_cost_is_rounded_up_and_check_has_no_effect(self):
        ledger = fixture(); before = deepcopy(ledger)
        result = budget.assess(ledger, "jev", "0.000000042")
        self.assertEqual(result["maximum_usd"], "0.000001")
        self.assertFalse(result["reservation_recorded"])
        self.assertEqual(ledger, before)

    def test_unknown_account_and_automatic_refill_block(self):
        self.assertEqual(budget.assess(fixture(), "unknown", "0.01")["state"], "blocked")
        ledger = fixture(); ledger["providers"]["jev"]["auto_recharge"] = "enabled"
        self.assertEqual(budget.assess(ledger, "jev", "0.01")["state"], "blocked")


if __name__ == "__main__":
    unittest.main()
