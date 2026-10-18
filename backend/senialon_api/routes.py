"""Operaciones de dominio bajo las guardas existentes de application.py."""

import copy
import json

from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.concurrency import run_in_threadpool

from analysis.core import coverage
from .contract import DOCUMENT, Invalid, validate
from .db import make_sessions
from .domain import Domain, Fault, require
from .gateway import Gateway
from .providers.adapters import Providers


def install_domain_routes(app, config, sessions=None, transport=None):
    if sessions is None and config.database_url.get_secret_value():
        engine, sessions = make_sessions(config.database_url.get_secret_value())
        app.state.database_engine = engine
    domain = Domain(sessions, Providers(Gateway(sessions, config, transport), config), config) if sessions else None
    app.state.domain = domain

    def response(request, payload, status, schema):
        from .application import meta
        result = {"meta": meta(request).model_dump(mode="json"), **payload}
        validate(schema, result)
        return JSONResponse(result, status_code=status)

    @app.exception_handler(Fault)
    async def fault_handler(request, exc):
        operation, code = exc.operation, exc.code
        if code in ("OPERATION_IN_PROGRESS", "PROVIDER_RESULT_UNCERTAIN") and operation is None:
            code = "VERSION_CONFLICT"
        return response(request, {"error": {
            "code": code, "message": exc.message,
            "stage": operation["stage"] if operation else None,
            "operation_id": operation["operation_id"] if operation else None,
            "current_revision": exc.revision, "issues": [],
            "retry_policy": "manual_reconciliation_required" if code == "PROVIDER_RESULT_UNCERTAIN" else "none",
        }}, exc.status, "ErrorResponse")

    def perform(request, specification, query, body):
        operation = specification["operationId"]
        require(domain is not None, "Configura PostgreSQL y ejecuta la migración.", "FEATURE_UNAVAILABLE", 503)
        path = request.path_params
        run_id = path.get("run_id")
        identity = request.headers.get("Idempotency-Key")
        status = 200
        if operation == "createRun":
            payload, status = domain.create(identity, body)
        elif operation == "listRuns":
            payload = domain.listing(None, "runs", query.get("cursor"), query.get("limit", 20))
        elif operation == "getRun":
            payload = {"data": domain.read(run_id)}
        elif operation == "advanceRun":
            payload, status = domain.advance(run_id, identity, body)
        elif operation == "getOperation":
            payload = {"data": domain.operation(run_id, path["operation_id"])}
        elif operation == "confirmGroups":
            payload, status = domain.confirm(run_id, identity, body)
        elif operation == "selectAnalysis":
            payload, status = domain.select(run_id, identity, body)
        elif operation == "recordReview":
            payload, status = domain.review(run_id, path["analysis_id"], identity, body)
        elif operation in ("getAnalysis", "getReview"):
            payload = domain.analysis(run_id, path["analysis_id"], query.get("analysis_version"))
            if operation == "getReview":
                payload = {"data": payload["data"]["review"]}
        elif operation in ("listEligibleVideos", "listAnalyses"):
            kind = "videos" if operation == "listEligibleVideos" else "analyses"
            payload = domain.listing(run_id, kind, query.get("cursor"), query.get("limit", 20))
        elif operation == "exportNotion":
            domain.analysis(run_id, path["analysis_id"])
            raise Fault("FEATURE_UNAVAILABLE", "Notion permanece diferido; no se realizó ningún guardado externo.", 501)
        else:
            data = domain.data(run_id)
            if operation == "getCoverage":
                result = coverage(data)
            elif operation == "getGroups":
                result = data["groups"]
            elif operation == "getComparison":
                result = data["comparison"]
            elif operation == "getVideo":
                result = data["publications"].get(path["video_id"])
                require(result is not None, "Publicación no encontrada.", "NOT_FOUND", 404)
            else:
                raise Fault("NOT_FOUND", "Operación no disponible.", 404)
            payload = {"data": result}
        schema = specification["responses"][str(status)]["content"]["application/json"]["schema"]
        return response(request, payload, status, schema)

    def reject_constant(_value):
        raise ValueError("Constante JSON no válida.")

    async def dispatch(request, specification):
        query = dict(request.query_params)
        body = None
        try:
            if len(request.query_params.multi_items()) != len(query):
                raise Invalid("Consulta duplicada.")
            allowed_query = set()
            for parameter in specification.get("parameters", []):
                name = parameter["name"]
                if parameter["in"] == "path":
                    value = request.path_params.get(name)
                elif parameter["in"] == "header":
                    value = request.headers.get(name)
                else:
                    allowed_query.add(name)
                    value = query.get(name)
                    if value is not None and parameter["schema"].get("type") == "integer":
                        value = int(value)
                        query[name] = value
                if value is None:
                    if parameter.get("required"):
                        raise Invalid(name)
                else:
                    validate(parameter["schema"], value)
            if not set(query) <= allowed_query:
                raise Invalid("Parámetro desconocido.")
            if "requestBody" in specification:
                raw = bytearray()
                async for chunk in request.stream():
                    raw.extend(chunk)
                    if len(raw) > 4_000_000:
                        raise Invalid("Cuerpo demasiado grande.")
                body = json.loads(raw, parse_constant=reject_constant)
                validate(specification["requestBody"]["content"]["application/json"]["schema"], body)
        except (Invalid, ValueError, TypeError, RecursionError):
            raise Fault("VALIDATION_ERROR", "La solicitud no cumple el contrato 1.0.0.", 422) from None
        # SQLAlchemy y el dominio síncronos no bloquean el event loop del servicio.
        return await run_in_threadpool(perform, request, specification, query, body)

    for path, methods in DOCUMENT["paths"].items():
        for method, specification in methods.items():
            if specification["operationId"] == "getCapabilities":
                continue  # Conservar endpoint, modelos y texto de SENIALON.

            def factory(spec):
                async def endpoint(request: Request):
                    return await dispatch(request, spec)
                return endpoint

            app.add_api_route(path, factory(copy.deepcopy(specification)),
                              methods=[method.upper()], name=specification["operationId"])
