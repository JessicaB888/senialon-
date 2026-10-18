"""Modelos del subconjunto implementado; docs/contracts/openapi.json es la autoridad."""

from typing import Literal

from pydantic import AwareDatetime, BaseModel, ConfigDict, Field

CONTRACT_VERSION = "1.0.0"


class TransportModel(BaseModel):
    model_config = ConfigDict(extra="forbid", strict=True)


class Meta(TransportModel):
    contract_version: Literal["1.0.0"] = CONTRACT_VERSION
    request_id: str = Field(min_length=1, max_length=128)
    served_at: AwareDatetime


class Reviews(TransportModel):
    alg_2_1: Literal["reviewed"] = "reviewed"
    fe_1_1_documentary: Literal["reviewed"] = "reviewed"
    g0: Literal["closed"] = "closed"


class NotionAvailability(TransportModel):
    state: Literal["deferred"] = "deferred"
    reason: str = "Extensión pendiente, última prioridad."


class Capabilities(TransportModel):
    contract_status: Literal["agreed"] = "agreed"
    reviews: Reviews = Field(default_factory=Reviews)
    notion: NotionAvailability = Field(default_factory=NotionAvailability)


class CapabilitiesResponse(TransportModel):
    meta: Meta
    data: Capabilities = Field(default_factory=Capabilities)


class ErrorDetail(TransportModel):
    # Solo los errores que esta base puede producir. Ampliar al integrar etapas.
    code: Literal["AUTH_REQUIRED", "ORIGIN_FORBIDDEN", "NOT_FOUND", "VALIDATION_ERROR", "INTERNAL_ERROR"]
    message: str = Field(min_length=1)
    stage: None = None
    operation_id: None = None
    current_revision: None = None
    issues: list[dict[str, str]] = Field(default_factory=list)
    retry_policy: Literal["none"] = "none"


class ErrorResponse(TransportModel):
    meta: Meta
    error: ErrorDetail
