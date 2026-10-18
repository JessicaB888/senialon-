"""Contexto persistido suministrado por BE, sin leer reloj o almacenamiento."""

from collections.abc import Mapping
from dataclasses import dataclass
from datetime import datetime

from .windows import Windows


@dataclass(frozen=True)
class AnalysisContext:
    run_id: str
    run_revision: int
    windows: Windows
    versions: Mapping[str, str]
    source_ids: tuple[str, ...]
    input_version: str
    processed_at: datetime


class AnalysisInputError(ValueError):
    """Entradas de snapshots incompatibles; BE decide la respuesta HTTP."""


class GroupsNotConfirmedError(AnalysisInputError):
    """No se autoriza el cálculo antes de confirmar la versión exacta."""
