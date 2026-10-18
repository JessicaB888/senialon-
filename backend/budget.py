"""Offline preflight for BE 3.2; no provider calls or reservation writes.

BE 3.10 must apply this policy using durable, atomically claimed state before
each paid call. A passing snapshot is not an execution permit or a hard spend cap.
"""
from __future__ import annotations

import argparse
import json
import re
from datetime import datetime
from decimal import Decimal, ROUND_CEILING
from pathlib import Path
from typing import Any

LIMIT = Decimal("20.00")
UNIT = Decimal("0.000001")
FUNDING = {"prepaid", "postpaid", "free"}


def money(value: Any) -> Decimal:
    """Amounts are exact nonnegative decimal strings, never floats or NaN."""
    if not isinstance(value, str) or not re.fullmatch(r"\d{1,9}(?:\.\d{1,9})?", value):
        raise ValueError("El importe debe ser una cadena decimal USD no negativa.")
    return Decimal(value)


def amount(value: Decimal) -> str:
    return format(value.quantize(UNIT, rounding=ROUND_CEILING), "f")


def has_evidence(record: dict[str, Any]) -> bool:
    source = record.get("evidence")
    instant = record.get("verified_at")
    if not isinstance(source, str) or not source.strip() or not isinstance(instant, str):
        return False
    try:
        return datetime.fromisoformat(instant.replace("Z", "+00:00")).utcoffset() is not None
    except ValueError:
        return False


def assess(ledger: dict[str, Any], provider: str, maximum_usd: str | None,
           *, kind: str = "call") -> dict[str, Any]:
    """Check both new cash commitments and consumption without counting topups twice."""
    if ledger.get("currency") != "USD" or money(ledger.get("incremental_limit_usd")) != LIMIT:
        raise ValueError("La política exige USD y el límite acordado de 20.00.")
    if kind not in {"call", "topup"}:
        raise ValueError("Operación presupuestaria desconocida.")

    seen: set[str] = set()
    cash = Decimal(0)
    usage = Decimal(0)
    postpaid_usage = Decimal(0)
    retained = Decimal(0)
    postpaid_retained = Decimal(0)
    provider_retained = Decimal(0)
    for collection in ("cash_entries", "usage_entries", "reservations"):
        records = ledger.get(collection)
        if not isinstance(records, list):
            raise ValueError(f"Falta el registro {collection}; desconocido no es cero.")
        for record in records:
            identity = record.get("id")
            if not isinstance(identity, str) or not identity.strip() or identity in seen:
                raise ValueError("Cada movimiento necesita un ID único, sin duplicados.")
            seen.add(identity)
            if not has_evidence(record) or record.get("provider") not in ledger["providers"]:
                raise ValueError("Cada movimiento exige fuente, fecha con zona y proveedor conocido.")
            value = money(record.get("amount_usd"))
            if collection == "cash_entries":
                if record.get("kind") not in {"credit_purchase", "hosting_extra", "other_extra"}:
                    raise ValueError("No incluir abonos previos ni facturas de consumo duplicadas.")
                cash += value
                continue
            mode = record.get("funding_mode")
            if mode not in FUNDING or (mode == "free" and value != 0):
                raise ValueError("Modo de financiación inválido o costo positivo declarado gratuito.")
            if collection == "usage_entries":
                usage += value
                if mode == "postpaid":
                    postpaid_usage += value
            else:
                if record.get("state") not in {"active", "uncertain"}:
                    raise ValueError("Las reservas retenidas solo pueden ser activas o inciertas.")
                retained += value
                if mode == "postpaid":
                    postpaid_retained += value
                if record["provider"] == provider:
                    provider_retained += value

    reasons: list[str] = []
    baseline = ledger.get("baseline", {})
    baseline_known = baseline.get("status") == "confirmed" and has_evidence(baseline)
    if not baseline_known:
        reasons.append("Falta confirmar cargos/recargas/consumos y reservas iniciales del equipo.")
    account = ledger.get("providers", {}).get(provider, {})
    mode = account.get("funding_mode")
    if account.get("status") != "verified" or not has_evidence(account):
        reasons.append("Falta verificar la cuenta del proveedor antes de esta prueba.")
    if mode not in FUNDING:
        reasons.append("Modo de facturación del proveedor no confirmado.")
    if account.get("auto_recharge") not in {"disabled", "not_applicable"}:
        reasons.append("Recargas automáticas desactivadas/no aplicables sin verificar.")

    requested = None if maximum_usd is None else money(maximum_usd).quantize(UNIT, rounding=ROUND_CEILING)
    if requested is None:
        reasons.append("Costo máximo de la operación desconocido; no se interpreta como cero.")
    capacity = None if account.get("available_spend_usd") is None else money(account["available_spend_usd"])
    if capacity is None:
        reasons.append("Saldo/crédito o margen de cuenta desconocido.")
    if kind == "call":
        if not isinstance(account.get("selected_model"), str) or not account["selected_model"].strip():
            reasons.append("Modelo o servicio concreto sin confirmar.")
        if account.get("tariff_verified") is not True or not account.get("tariff_evidence"):
            reasons.append("Tarifa aplicable a la cuenta/modelo sin verificar.")
        if requested == 0 and mode != "free":
            reasons.append("Una llamada de pago requiere cota positiva; gratuidad sin verificar.")
        if mode == "free" and requested not in (None, Decimal(0)):
            reasons.append("La cota positiva no corresponde a un modo gratuito verificado.")
    else:
        minimum = account.get("minimum_topup_usd")
        if mode != "prepaid":
            reasons.append("Solo se evalúan recargas en cuentas prepagadas verificadas.")
        if minimum is None or not account.get("minimum_topup_evidence"):
            reasons.append("Mínimo de recarga de la cuenta no verificado.")
        elif requested is not None and requested < money(minimum):
            reasons.append("La recarga propuesta es inferior al mínimo verificado.")
        if requested == 0:
            reasons.append("Una recarga necesita un importe positivo.")

    # Prepaid usage is covered by its funding: do not add it to the purchase again.
    cash_commitment = cash + postpaid_usage + postpaid_retained
    consumption_commitment = usage + retained
    available: Decimal | None = None
    if baseline_known and mode in FUNDING and capacity is not None:
        if cash_commitment > LIMIT or consumption_commitment > LIMIT:
            reasons.append("Los compromisos registrados ya exceden el límite acordado.")
        if kind == "topup":
            available = max(Decimal(0), LIMIT - cash_commitment)
        else:
            limits = [LIMIT - consumption_commitment, capacity - provider_retained]
            if mode == "postpaid":
                limits.append(LIMIT - cash_commitment)
            available = max(Decimal(0), min(limits))
        if requested is not None and requested > available:
            reasons.append("La cota no cabe en el presupuesto o saldo tras retener las reservas.")

    state = "blocked" if reasons else "allowed"
    # A partial ledger has unknown totals, even when its lists are still empty.
    return {
        "state": state,
        "provider": provider,
        "kind": kind,
        "reasons": reasons,
        "maximum_usd": None if requested is None else amount(requested),
        "budget": {
            "currency": "USD",
            "incremental_limit": "20.00",
            "state": state,
            "reason": "; ".join(reasons) if reasons else None,
            "confirmed_new_charges": amount(cash + postpaid_usage) if baseline_known else None,
            "reserved": amount(retained) if baseline_known else None,
            "available_for_new_calls": amount(available) if state == "allowed" and kind == "call" else None,
        },
        "cash_commitment_usd": amount(cash_commitment) if baseline_known else None,
        "consumption_commitment_usd": amount(consumption_commitment) if baseline_known else None,
        "reservation_recorded": False,
        "scope": "Preflight offline. BE 3.10 debe reclamar/reservar atómicamente antes de llamar; este comando no ejecuta ni autoriza pagos.",
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--ledger", type=Path, required=True)
    parser.add_argument("--provider", required=True)
    parser.add_argument("--maximum-usd", default=None)
    parser.add_argument("--kind", choices=["call", "topup"], default="call")
    args = parser.parse_args()
    try:
        ledger = json.loads(args.ledger.read_text())
        report = assess(ledger, args.provider, args.maximum_usd, kind=args.kind)
    except (ValueError, TypeError, KeyError, OSError) as error:
        print(json.dumps({"state": "blocked", "reason": str(error)}, ensure_ascii=False, indent=2))
        return 2
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0 if report["state"] == "allowed" else 2


if __name__ == "__main__":
    raise SystemExit(main())
