"""Casos sintéticos de transporte: ninguna cuenta o integración queda acreditada."""

import base64
from dataclasses import replace
from datetime import datetime

import pytest
from fastapi.testclient import TestClient

from senialon_api.application import CHALLENGE, create_app
from senialon_api.settings import Settings

SETTINGS = Settings("synthetic-operator", "synthetic-password", "http://127.0.0.1:3000")


def basic(username=SETTINGS.username, password=SETTINGS.password):
    return "Basic " + base64.b64encode(f"{username}:{password}".encode()).decode()


@pytest.fixture
def client():
    with TestClient(create_app(SETTINGS)) as current:
        yield current


def check_transport(response):
    assert response.headers["cache-control"] == "private, no-store"
    assert response.headers["x-contract-version"] == "1.0.0"
    assert response.headers["x-request-id"] == response.json()["meta"]["request_id"]
    assert datetime.fromisoformat(response.json()["meta"]["served_at"]).utcoffset() is not None


@pytest.mark.parametrize("path", ["/api/v1/meta", "/api/v1/runs", "/docs", "/redoc", "/openapi.json", "/"])
def test_guard_applies_before_routing(client, path):
    response = client.get(path)
    assert response.status_code == 401
    assert response.headers["www-authenticate"] == CHALLENGE
    assert response.json()["error"]["code"] == "AUTH_REQUIRED"
    check_transport(response)


@pytest.mark.parametrize("value", ["", "Bearer invalid", "Basic !!!", "Basic /w==", basic(password="wrong"), basic(username="wrong"), basic("", "")])
def test_invalid_credentials_never_reach_meta(client, value):
    response = client.get("/api/v1/meta", headers={"Authorization": value})
    assert response.status_code == 401
    check_transport(response)
    assert SETTINGS.password not in response.text


def test_metadata_reflects_only_documentary_agreement(client):
    response = client.get("/api/v1/meta", headers={"Authorization": basic(), "X-Request-Id": "fe-test:001"})
    assert response.status_code == 200
    check_transport(response)
    assert response.headers["x-request-id"] == "fe-test:001"
    assert response.json()["data"] == {
        "contract_status": "agreed",
        "reviews": {"alg_2_1": "reviewed", "fe_1_1_documentary": "reviewed", "g0": "closed"},
        "notion": {"state": "deferred", "reason": "Extensión pendiente, última prioridad."},
    }


@pytest.mark.parametrize("identity", ["unsafe space", "x" * 129, ""])
def test_invalid_request_id_is_replaced(client, identity):
    response = client.get("/api/v1/meta", headers={"Authorization": basic(), "X-Request-Id": identity})
    assert response.status_code == 200
    assert response.headers["x-request-id"] != identity
    check_transport(response)


@pytest.mark.parametrize("path", ["/docs", "/redoc", "/openapi.json", "/api/v1/runs", "/api/v1/meta/"])
def test_disabled_docs_and_unimplemented_resources_are_not_fake_success(client, path):
    response = client.get(path, headers={"Authorization": basic()})
    assert response.status_code == 404
    assert response.json()["error"]["code"] == "NOT_FOUND"
    check_transport(response)


@pytest.mark.parametrize("origin", [None, "https://untrusted.example", "null", SETTINGS.allowed_origin + ".example"])
def test_mutations_reject_absent_or_wrong_origin(client, origin):
    headers = {"Authorization": basic()}
    if origin is not None:
        headers["Origin"] = origin
    response = client.post("/api/v1/runs", headers=headers, json={})
    assert response.status_code == 403
    assert response.json()["error"]["code"] == "ORIGIN_FORBIDDEN"
    check_transport(response)


def test_allowed_origin_does_not_create_unimplemented_run(client):
    response = client.post("/api/v1/runs", headers={"Authorization": basic(), "Origin": SETTINGS.allowed_origin}, json={})
    assert response.status_code == 404
    check_transport(response)


@pytest.mark.parametrize("changes", [
    {"username": ""}, {"password": ""}, {"allowed_origin": ""},
    {"allowed_origin": "http://example.com"}, {"allowed_origin": "https://example.com/path"},
    {"allowed_origin": "https://user:pass@example.com"}, {"allowed_origin": "https://example.com:wrong"},
    {"username": "user:name"}, {"password": "bad\npassword"}, {"deployed": True},
])
def test_missing_or_unsafe_configuration_fails_closed(changes):
    with TestClient(create_app(replace(SETTINGS, **changes))) as current:
        response = current.get("/api/v1/meta", headers={"Authorization": basic()})
        assert response.status_code == 500
        assert response.json()["error"]["code"] == "INTERNAL_ERROR"
        check_transport(response)
        assert SETTINGS.password not in response.text


def test_deployed_settings_require_https():
    assert replace(SETTINGS, deployed=True, allowed_origin="https://senialon.example").ready


def test_unicode_credentials_and_colon_in_password():
    settings = replace(SETTINGS, username="operadór", password="sintético:clave")
    with TestClient(create_app(settings)) as current:
        assert current.get("/api/v1/meta", headers={"Authorization": basic(settings.username, settings.password)}).status_code == 200


def test_exception_and_validation_responses_are_sanitized():
    app = create_app(SETTINGS)

    @app.get("/test-failure")
    def failure():
        raise RuntimeError("SYNTHETIC_SECRET_MUST_NOT_ESCAPE")

    @app.get("/test-validation/{value}")
    def validation(value: int):
        return {"value": value}

    with TestClient(app) as current:
        for path, status in [("/test-failure", 500), ("/test-validation/SYNTHETIC_SECRET_MUST_NOT_ESCAPE", 422)]:
            response = current.get(path, headers={"Authorization": basic()})
            assert response.status_code == status
            assert "SYNTHETIC_SECRET_MUST_NOT_ESCAPE" not in response.text
            check_transport(response)


def test_settings_read_only_explicit_server_environment(monkeypatch):
    monkeypatch.setenv("DEMO_USERNAME", SETTINGS.username)
    monkeypatch.setenv("DEMO_PASSWORD", SETTINGS.password)
    monkeypatch.setenv("DEMO_ALLOWED_ORIGIN", SETTINGS.allowed_origin)
    monkeypatch.delenv("VERCEL", raising=False)
    assert Settings.from_environment() == SETTINGS
    assert SETTINGS.password not in repr(SETTINGS)
