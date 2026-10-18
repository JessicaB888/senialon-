"""ALG 2.2: fronteras temporales únicas para adquisición y comparación."""

from datetime import UTC, datetime, time, timedelta
from typing import Literal, TypedDict
from zoneinfo import ZoneInfo


class Window(TypedDict):
    """Tipo interno de la forma Windows de OpenAPI; no es otro esquema API."""

    start_inclusive: str
    end_exclusive: str
    days: Literal[7]


class Windows(TypedDict):
    timezone: Literal["America/Bogota"]
    previous: Window
    recent: Window


def derive_windows(started_at: datetime) -> Windows:
    """Deriva dos semanas completas desde un instante de inicio explícito.

    Las medianoches se calculan en America/Bogota y se serializan como
    instantes UTC (RFC 3339); timezone conserva la zona que define cada día.
    BE debe persistir esta salida una vez, no regenerarla en lecturas/reintentos.
    No lee un reloj global, configuración, HTTP o base de datos.
    """
    if not isinstance(started_at, datetime):
        raise TypeError("started_at debe ser un datetime con zona explícita.")
    if started_at.tzinfo is None or started_at.utcoffset() is None:
        raise ValueError("started_at requiere un desplazamiento horario conocido.")

    bogota = ZoneInfo("America/Bogota")
    try:
        current_day = started_at.astimezone(bogota).date()
        recent_end = datetime.combine(current_day, time.min, tzinfo=bogota)
        recent_start = datetime.combine(
            current_day - timedelta(days=7), time.min, tzinfo=bogota
        )
        previous_start = datetime.combine(
            current_day - timedelta(days=14), time.min, tzinfo=bogota
        )
        return {
            "timezone": "America/Bogota",
            "previous": {
                "start_inclusive": previous_start.astimezone(UTC).isoformat().replace("+00:00", "Z"),
                "end_exclusive": recent_start.astimezone(UTC).isoformat().replace("+00:00", "Z"),
                "days": 7,
            },
            "recent": {
                "start_inclusive": recent_start.astimezone(UTC).isoformat().replace("+00:00", "Z"),
                "end_exclusive": recent_end.astimezone(UTC).isoformat().replace("+00:00", "Z"),
                "days": 7,
            },
        }
    except (OverflowError, ValueError) as error:
        raise ValueError("No se pueden representar ambas ventanas para ese inicio.") from error
