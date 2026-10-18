"""FastAPI privado: guardas originales y operaciones explícitas de dominio."""

import base64
import binascii
import re
import secrets
from datetime import UTC, datetime
from uuid import uuid4

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException

from .models import CONTRACT_VERSION, CapabilitiesResponse, ErrorDetail, ErrorResponse, Meta
from .settings import Settings

CHALLENGE = 'Basic realm="SENIALON", charset="UTF-8"'
SAFE_REQUEST_ID = re.compile(r"[A-Za-z0-9][A-Za-z0-9._:-]{0,127}", re.ASCII)


def authenticated(value: str, settings: Settings) -> bool:
    if len(value) > 4096:
        return False
    scheme, separator, token = value.partition(" ")
    if not separator or scheme.lower() != "basic":
        return False
    try:
        decoded = base64.b64decode(token, validate=True).decode("utf-8")
        username, separator, password = decoded.partition(":")
    except (ValueError, UnicodeError, binascii.Error):
        return False
    user_matches = secrets.compare_digest(username.encode("utf-8"), settings.username.encode("utf-8"))
    password_matches = secrets.compare_digest(password.encode("utf-8"), settings.password.encode("utf-8"))
    return bool(separator and user_matches and password_matches)


def meta(request: Request) -> Meta:
    return Meta(request_id=request.state.request_id, served_at=datetime.now(UTC))


def error_response(request: Request, status: int, code: str, message: str) -> JSONResponse:
    body = ErrorResponse(meta=meta(request), error=ErrorDetail(code=code, message=message))
    return JSONResponse(
        body.model_dump(mode="json"),
        status_code=status,
        headers={"WWW-Authenticate": CHALLENGE} if status == 401 else {},
    )


def create_app(settings: Settings | None = None, *, runtime=None, sessions=None, transport=None) -> FastAPI:
    settings = settings if settings is not None else Settings.from_environment()
    app = FastAPI(
        title="SENIALON interno",
        version=CONTRACT_VERSION,
        docs_url=None,
        redoc_url=None,
        openapi_url=None,
        redirect_slashes=False,
    )

    @app.middleware("http")
    async def private_transport(request: Request, call_next):
        supplied = request.headers.get("x-request-id", "")
        request.state.request_id = supplied if SAFE_REQUEST_ID.fullmatch(supplied) else str(uuid4())
        if not settings.ready:
            response = error_response(request, 500, "INTERNAL_ERROR", "Servicio no disponible.")
        elif not authenticated(request.headers.get("authorization", ""), settings):
            response = error_response(request, 401, "AUTH_REQUIRED", "Se requiere la credencial de demo.")
        elif request.method not in {"GET", "HEAD", "OPTIONS"} and request.headers.get("origin") != settings.allowed_origin:
            response = error_response(request, 403, "ORIGIN_FORBIDDEN", "Origen no permitido.")
        else:
            try:
                response = await call_next(request)
            except Exception:
                # Nunca incluir excepciones, entradas o credenciales en la respuesta/log.
                response = error_response(request, 500, "INTERNAL_ERROR", "No se pudo completar la solicitud.")
        response.headers["Cache-Control"] = "private, no-store"
        response.headers["X-Contract-Version"] = CONTRACT_VERSION
        response.headers["X-Request-Id"] = request.state.request_id
        response.headers["X-Content-Type-Options"] = "nosniff"
        return response

    @app.exception_handler(HTTPException)
    async def http_error(request: Request, exc: HTTPException):
        if exc.status_code == 404:
            return error_response(request, 404, "NOT_FOUND", "Recurso no disponible.")
        if exc.status_code in {400, 405, 422}:
            return error_response(request, 422, "VALIDATION_ERROR", "Solicitud no válida para esta operación.")
        return error_response(request, 500, "INTERNAL_ERROR", "No se pudo completar la solicitud.")

    @app.exception_handler(RequestValidationError)
    async def validation_error(request: Request, _exc: RequestValidationError):
        return error_response(request, 422, "VALIDATION_ERROR", "La solicitud no cumple el contrato.")

    @app.get("/api/v1/meta", response_model=CapabilitiesResponse, operation_id="getCapabilities")
    async def capabilities(request: Request) -> CapabilitiesResponse:
        # Hechos del acuerdo documental; no acredita integraciones o análisis operativos.
        return CapabilitiesResponse(meta=meta(request))

    from .routes import install_domain_routes
    from .runtime import RuntimeSettings

    install_domain_routes(app, runtime if runtime is not None else RuntimeSettings(), sessions, transport)
    return app
