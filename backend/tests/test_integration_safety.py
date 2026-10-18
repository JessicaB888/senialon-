"""Regresiones de seguridad y empaquetado de la integración; sin proveedores."""

import json
import os
from pathlib import Path
import shutil
import subprocess
import sys

from fastapi.testclient import TestClient
import pytest

from senialon_api.application import create_app
from senialon_api.contract import DOCUMENT, SOURCE_SHA256
from senialon_api.runtime import RuntimeSettings
from senialon_api.settings import Settings

ACCESS = Settings("synthetic", "synthetic-password", "http://127.0.0.1:3000")
BACKEND = Path(__file__).resolve().parents[1]


@pytest.mark.parametrize("path,method", [
    (path.replace("{run_id}", "synthetic-run").replace("{video_id}", "aaaaaaaaaaa")
         .replace("{analysis_id}", "synthetic-analysis").replace("{operation_id}", "synthetic-operation"), method)
    for path, methods in DOCUMENT["paths"].items() for method in methods
])
def test_every_contract_operation_keeps_original_access_guard(path, method):
    app = create_app(ACCESS, runtime=RuntimeSettings(database_url=""))
    with TestClient(app) as client:
        response = client.request(method.upper(), path, json={})
        assert response.status_code == 401
        assert response.json()["error"]["code"] == "AUTH_REQUIRED"
        assert response.headers["cache-control"] == "private, no-store"


def test_runtime_does_not_implicitly_read_env_files_or_enable_payment(tmp_path, monkeypatch):
    monkeypatch.chdir(tmp_path)
    for name in ("PAID_CALLS_ENABLED", "TYPESAFE_API_KEY", "DATABASE_URL"):
        monkeypatch.delenv(name, raising=False)
    (tmp_path / ".env").write_text("PAID_CALLS_ENABLED=true\nTYPESAFE_API_KEY=SYNTHETIC_FILE_KEY\n")
    runtime = RuntimeSettings()
    assert not runtime.paid_calls_enabled and not runtime.typesafe_api_key.get_secret_value()
    assert not runtime.database_url.get_secret_value()


def test_backend_projection_is_current():
    result = subprocess.run([sys.executable, "-B", "scripts/generate_contract.py", "--check"],
                            cwd=BACKEND, capture_output=True, text=True)
    assert result.returncode == 0, result.stdout + result.stderr
    assert SOURCE_SHA256 == "d7e0b018263658e686da00997ddffbd19ba96e6e73de5b08e3f8917b95375956"


def test_backend_boots_from_its_bundle_without_docs_or_frontend(tmp_path):
    # Copiar únicamente módulos y el contrato derivado; nunca .env, claves o datos.
    for package in ("senialon_api", "analysis"):
        for source in (BACKEND / package).rglob("*"):
            if "tests" in source.parts or source.suffix not in (".py", ".json"):
                continue
            destination = tmp_path / source.relative_to(BACKEND)
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(source, destination)
    shutil.copyfile(BACKEND / "main.py", tmp_path / "main.py")
    code = "from main import app; from senialon_api.contract import DOCUMENT; assert len(app.routes) == 18; assert len(DOCUMENT['paths']) == 15"
    # No usar DATABASE_URL ni credenciales del operador al comprobar el bundle.
    environment = {key: value for key, value in os.environ.items()
                   if key not in {"DATABASE_URL", "DEMO_USERNAME", "DEMO_PASSWORD", "DEMO_ALLOWED_ORIGIN",
                                  "YOUTUBE_API_KEY", "TYPESAFE_API_KEY", "GEMINI_API_KEY", "PYTHONPATH"}}
    result = subprocess.run([sys.executable, "-B", "-c", code], cwd=tmp_path,
                            env=environment, capture_output=True, text=True)
    assert result.returncode == 0, result.stdout + result.stderr
    assert "examples" not in json.loads((tmp_path / "senialon_api/generated/contract.json").read_text())["document"]["components"]
