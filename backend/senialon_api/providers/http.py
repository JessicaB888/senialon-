"""Generic outbound JSON transport for provider adapters.

Every request requires an injected atomic claim/reservation gate. This module
does not select provider endpoints, models, credentials, or payload schemas.
"""

from __future__ import annotations

import json
import math
from dataclasses import dataclass
from datetime import UTC, datetime
from typing import Literal, Protocol, TypeGuard
from urllib.parse import urlsplit

import httpx

type JsonValue = None | bool | int | float | str | list[JsonValue] | dict[str, JsonValue]


def is_json_value(value: object) -> TypeGuard[JsonValue]:
    if value is None or isinstance(value, (bool, int, str)):
        return True
    if isinstance(value, float):
        return math.isfinite(value)
    if isinstance(value, list):
        return all(is_json_value(item) for item in value)
    if isinstance(value, dict):
        return all(isinstance(key, str) and is_json_value(item) for key, item in value.items())
    return False


@dataclass(frozen=True, slots=True)
class ProviderCall:
    provider: Literal["youtube", "jev", "gemini"]
    purpose: str
    operation_id: str
    substep_id: str
    input_version: str
    method: Literal["GET", "POST"]
    url: str
    headers: tuple[tuple[str, str], ...] = ()
    params: tuple[tuple[str, str], ...] = ()
    json_body: JsonValue = None
    request_id_header: str | None = None

    def __post_init__(self) -> None:
        if any(not value.strip() for value in (self.purpose, self.operation_id, self.substep_id, self.input_version)):
            raise ValueError("Provider call purpose and identity fields must not be empty.")
        parsed = urlsplit(self.url)
        if (
            parsed.scheme != "https"
            or not parsed.hostname
            or parsed.username is not None
            or parsed.password is not None
            or parsed.fragment
        ):
            raise ValueError("Provider endpoints must use an HTTPS URL without user information or fragments.")
        if self.method == "GET" and self.json_body is not None:
            raise ValueError("GET provider calls cannot include a JSON body.")
        if not is_json_value(self.json_body):
            raise ValueError("Provider request body must contain standard JSON values.")
        if self.request_id_header is not None and not self.request_id_header.strip():
            raise ValueError("request_id_header must be nonempty when provided.")

    @property
    def identity(self) -> ProviderCallIdentity:
        return ProviderCallIdentity(
            provider=self.provider,
            purpose=self.purpose,
            operation_id=self.operation_id,
            substep_id=self.substep_id,
            input_version=self.input_version,
        )


@dataclass(frozen=True, slots=True)
class ProviderCallIdentity:
    provider: Literal["youtube", "jev", "gemini"]
    purpose: str
    operation_id: str
    substep_id: str
    input_version: str


class CallGate(Protocol):
    async def claim_and_reserve(self, identity: ProviderCallIdentity) -> None:
        """Atomically authorize the substep and reserve its cost before sending."""


@dataclass(frozen=True, slots=True)
class ProviderResponse:
    provider: Literal["youtube", "jev", "gemini"]
    purpose: str
    operation_id: str
    substep_id: str
    input_version: str
    received_at: datetime
    status_code: int
    provider_request_id: str | None
    raw_response_text: str
    json_body: JsonValue


class ProviderCallBlocked(Exception):
    """The injected gate did not authorize the provider call."""


class ProviderTransportError(Exception):
    def __init__(
        self,
        kind: Literal["timeout", "transport", "http_status", "invalid_json"],
        delivery_state: Literal["sent", "unknown"],
        *,
        status_code: int | None = None,
        raw_response_text: str | None = None,
    ) -> None:
        self.kind = kind
        self.delivery_state = delivery_state
        self.status_code = status_code
        self.raw_response_text = raw_response_text
        super().__init__(f"Provider request {kind}; delivery state is {delivery_state}.")


class JsonHttpTransport:
    def __init__(self, client: httpx.AsyncClient, gate: CallGate, *, timeout_seconds: float) -> None:
        if timeout_seconds <= 0 or not math.isfinite(timeout_seconds):
            raise ValueError("timeout_seconds must be a finite positive value.")
        self._client = client
        self._gate = gate
        self._timeout_seconds = timeout_seconds

    async def send(self, call: ProviderCall) -> ProviderResponse:
        await self._gate.claim_and_reserve(call.identity)
        try:
            response = await self._client.request(
                call.method,
                call.url,
                headers=dict(call.headers),
                params=call.params,
                json=call.json_body if call.method == "POST" else None,
                timeout=self._timeout_seconds,
                follow_redirects=False,
            )
        except httpx.TimeoutException:
            raise ProviderTransportError("timeout", "unknown") from None
        except httpx.RequestError:
            raise ProviderTransportError("transport", "unknown") from None

        if not 200 <= response.status_code < 300:
            raise ProviderTransportError("http_status", "sent", status_code=response.status_code)

        raw_response_text = response.text
        try:
            json_body: object = json.loads(raw_response_text)
        except (json.JSONDecodeError, UnicodeDecodeError):
            raise ProviderTransportError(
                "invalid_json",
                "sent",
                status_code=response.status_code,
                raw_response_text=raw_response_text,
            ) from None
        if not is_json_value(json_body):
            raise ProviderTransportError(
                "invalid_json",
                "sent",
                status_code=response.status_code,
                raw_response_text=raw_response_text,
            )

        request_id = (
            response.headers.get(call.request_id_header)
            if call.request_id_header is not None
            else None
        )
        return ProviderResponse(
            provider=call.provider,
            purpose=call.purpose,
            operation_id=call.operation_id,
            substep_id=call.substep_id,
            input_version=call.input_version,
            received_at=datetime.now(UTC),
            status_code=response.status_code,
            provider_request_id=request_id,
            raw_response_text=raw_response_text,
            json_body=json_body,
        )
