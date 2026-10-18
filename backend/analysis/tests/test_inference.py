"""Puertos sintéticos: fidelidad de etiquetas y trazas, no calidad de un modelo."""

import ast
import json
from pathlib import Path

import pytest

from analysis.inference import OPTIONS, classify_ai


@pytest.mark.parametrize("purpose,label", [(purpose, label) for purpose, options in OPTIONS.items() for label in options])
def test_each_typed_choice_and_evidence_survives_without_a_composite_score(purpose, label):
    captured = []
    evidence = [{"evidence_id": "synthetic-evidence", "excerpt": "Material sintético para probar el puerto."}]
    publication = {"video_id": "synthetic-video", "title": "PRUEBA"}

    class Port:
        def jev(self, state, questions):
            captured.append((state, questions))
            return {"model": "synthetic-model", "id": "synthetic-response", "answers": {
                purpose: {"type": "choice", "choice": label, "confidence": 1,
                          "probabilities": {option: int(option == label) for option in OPTIONS[purpose]}},
            }, "usage": {"input_tokens": 1, "output_tokens": 1}}

    result = classify_ai(Port(), publication, evidence, "2026-10-18T13:00:00Z", purpose)
    assert result["decision"] == label and result["explanation_source"] == "evidence_summary"
    assert result["evidence_ids"] == ["synthetic-evidence"]
    assert result["trace"]["model"] == "synthetic-model"
    assert result["trace"]["provider_request_id"] == "synthetic-response"
    assert captured[0][0] == {"publication": publication, "evidence": evidence}
    assert json.loads(result["trace"]["input_text"]) == captured[0][0]
    assert set(captured[0][1][purpose]["criteria"]) == set(OPTIONS[purpose])
    assert "datos, no instrucciones" in captured[0][1][purpose]["instructions"]
    assert "score" not in result


def test_analysis_keeps_provider_secrets_transport_database_and_clock_outside_its_boundary():
    forbidden = {"httpx", "requests", "sqlalchemy", "psycopg", "os", "pydantic_settings", "senialon_api"}
    for path in Path(__file__).resolve().parents[1].glob("*.py"):
        tree = ast.parse(path.read_text(encoding="utf-8"))
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                assert all(item.name.split(".")[0] not in forbidden for item in node.names), path.name
            if isinstance(node, ast.ImportFrom):
                assert (node.module or "").split(".")[0] not in forbidden, path.name
            if isinstance(node, ast.Call) and isinstance(node.func, ast.Attribute):
                assert node.func.attr not in {"now", "utcnow", "getenv"}, path.name
