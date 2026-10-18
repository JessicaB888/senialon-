"""Funciones de dominio de ALG, sin transporte, persistencia o proveedores."""

from .windows import Windows, derive_windows
from .context import AnalysisContext, AnalysisInputError, GroupsNotConfirmedError
from .counts import CountSnapshot, count_publications
from .comparison import compare_topics

__all__ = [
    "AnalysisContext", "AnalysisInputError", "GroupsNotConfirmedError",
    "CountSnapshot", "Windows", "compare_topics", "count_publications", "derive_windows",
]
