"""Synthetic HTTP transport tests; MockTransport prevents external requests."""

import asyncio
import json
from dataclasses import dataclass, field
from typing import Literal

import httpx
import pytest

from senialon_api.providers.http import (
    JsonValue,
    JsonHttpTransport,
    ProviderCall,
    ProviderCallBlocked,
    ProviderCallIdentity,
    ProviderTransportError,
)


@dataclass
class RecordingGate:
    calls: list[ProviderCallIdentity] = field(default_factory=list)
    blocked: bool = False

    async def claim_and_reserve(self, identity: ProviderCallIdentity) -> None:
        self.calls.append(identity)
        if self.blocked:
            raise ProviderCallBlocked("synthetic budget block")


def sample_body() -> JsonValue:
    return {
        "question": "Synthetic question unchanged",
        "question_version": "question-v3",
        "criteria_version": "criteria-v2",
        "evidence_ids": ["evidence-1"],
        "input_text": "Synthetic input",
    }


def call(
    *,
    provider: Literal["youtube", "jev", "gemini"] = "jev",
    purpose: str = "classify_ai",
    operation_id: str = "synthetic-operation",
    substep_id: str = "synthetic-substep",
    input_version: str = "synthetic-input-v1",
    method: Literal["GET", "POST"] = "POST",
    url: str = "https://provider.synthetic.test/infer",
    headers: tuple[tuple[str, str], ...] = (("Authorization", "Bearer synthetic-secret"),),
    params: tuple[tuple[str, str], ...] = (),
    json_body: JsonValue = None,
    request_id_header: str | None = "x-provider-request-id",
) -> ProviderCall:
    return ProviderCall(
        provider=provider,
        purpose=purpose,
        operation_id=operation_id,
        substep_id=substep_id,
        input_version=input_version,
        method=method,
        url=url,
        headers=headers,
        params=params,
        json_body=json_body,
        request_id_header=request_id_header,
    )


def run(coro):
    return asyncio.run(coro)


def test_posts_opaque_json_only_after_gate_and_preserves_context():
    sent: list[httpx.Request] = []
    gate = RecordingGate()
    expected = call(json_body=sample_body())

    def handler(request: httpx.Request) -> httpx.Response:
        sent.append(request)
        return httpx.Response(
            200,
            headers={"x-provider-request-id": "synthetic-provider-request"},
            json={"decision": "synthetic-choice", "usage": {"input_tokens": 8}},
        )

    async def scenario():
        async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as client:
            response = await JsonHttpTransport(client, gate, timeout_seconds=2.0).send(expected)
            return response

    response = run(scenario())
    assert gate.calls == [expected.identity]
    assert "synthetic-secret" not in repr(gate.calls)
    assert len(sent) == 1
    assert sent[0].method == "POST"
    assert json.loads(sent[0].content) == expected.json_body
    assert sent[0].headers["authorization"] == "Bearer synthetic-secret"
    assert response.provider == "jev"
    assert response.purpose == expected.purpose
    assert response.operation_id == expected.operation_id
    assert response.substep_id == expected.substep_id
    assert response.input_version == expected.input_version
    assert response.provider_request_id == "synthetic-provider-request"
    assert response.raw_response_text == '{"decision":"synthetic-choice","usage":{"input_tokens":8}}'
    assert response.json_body == {"decision": "synthetic-choice", "usage": {"input_tokens": 8}}
    assert response.received_at.utcoffset() is not None


def test_gate_block_prevents_any_network_request():
    sent: list[httpx.Request] = []
    gate = RecordingGate(blocked=True)

    def handler(request: httpx.Request) -> httpx.Response:
        sent.append(request)
        return httpx.Response(200, json={})

    async def scenario():
        async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as client:
            await             JsonHttpTransport(client, gate, timeout_seconds=2.0).send(call(json_body=sample_body()))

    with pytest.raises(ProviderCallBlocked):
        run(scenario())
    assert len(gate.calls) == 1
    assert isinstance(gate.calls[0], ProviderCallIdentity)
    assert sent == []


def test_get_serializes_query_and_never_sends_a_body():
    sent: list[httpx.Request] = []
    expected = call(
        provider="youtube",
        purpose="list_publications",
        method="GET",
        url="https://provider.synthetic.test/videos",
        headers=(),
        params=(("publishedAfter", "2026-10-01T05:00:00Z"), ("key", "synthetic-key")),
        json_body=None,
        request_id_header=None,
    )

    def handler(request: httpx.Request) -> httpx.Response:
        sent.append(request)
        return httpx.Response(200, json={"items": []})

    async def scenario():
        async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as client:
            return await JsonHttpTransport(client, RecordingGate(), timeout_seconds=2.0).send(expected)

    response = run(scenario())
    assert len(sent) == 1
    assert sent[0].method == "GET"
    assert sent[0].content == b""
    assert dict(sent[0].url.params) == {
        "publishedAfter": "2026-10-01T05:00:00Z",
        "key": "synthetic-key",
    }
    assert response.json_body == {"items": []}


@pytest.mark.parametrize(
    ("response", "kind", "delivery_state", "status_code"),
    [
        (httpx.Response(429, text="provider detail"), "http_status", "sent", 429),
        (httpx.Response(200, text="not-json"), "invalid_json", "sent", 200),
        (httpx.Response(302, headers={"location": "https://elsewhere.synthetic.test"}), "http_status", "sent", 302),
        (httpx.Response(200, text='{"value": NaN}'), "invalid_json", "sent", 200),
    ],
)
def test_provider_failures_are_typed_and_sanitized(response, kind, delivery_state, status_code):
    sent: list[httpx.Request] = []

    def handler(request: httpx.Request) -> httpx.Response:
        sent.append(request)
        return response

    async def scenario():
        async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as client:
            return await JsonHttpTransport(client, RecordingGate(), timeout_seconds=2.0).send(call())

    with pytest.raises(ProviderTransportError) as raised:
        run(scenario())
    assert raised.value.kind == kind
    assert raised.value.delivery_state == delivery_state
    assert raised.value.status_code == status_code
    assert "provider detail" not in str(raised.value)
    if kind == "invalid_json":
        assert raised.value.raw_response_text == response.text
    assert len(sent) == 1


def test_timeout_is_uncertain_and_does_not_retry():
    sent: list[httpx.Request] = []

    def handler(request: httpx.Request) -> httpx.Response:
        sent.append(request)
        raise httpx.ReadTimeout("synthetic timeout")

    async def scenario():
        async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as client:
            await JsonHttpTransport(client, RecordingGate(), timeout_seconds=0.01).send(call(json_body=sample_body()))

    with pytest.raises(ProviderTransportError) as raised:
        run(scenario())
    assert raised.value.kind == "timeout"
    assert raised.value.delivery_state == "unknown"
    assert len(sent) == 1


@pytest.mark.parametrize(
    "url",
    [
        "http://provider.synthetic.test/infer",
        "https://user:password@provider.synthetic.test/infer",
        "https://provider.synthetic.test/infer#fragment",
    ],
)
def test_provider_endpoint_must_be_https_without_userinfo_or_fragment(url):
    with pytest.raises(ValueError):
        call(url=url)


def test_rejects_invalid_timeout_and_get_json_body():
    gate = RecordingGate()

    async def scenario():
        async with httpx.AsyncClient(
            transport=httpx.MockTransport(lambda request: httpx.Response(200, json={}))
        ) as client:
            with pytest.raises(ValueError):
                JsonHttpTransport(client, gate, timeout_seconds=0)

    run(scenario())
    with pytest.raises(ValueError):
        call(method="GET", json_body={"unexpected": "body"})
