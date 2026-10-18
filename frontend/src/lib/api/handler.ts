import "server-only";
import {
  permittedOrigin,
  readDemoSettings,
  requiresOrigin,
  validateAuthorization,
} from "@/lib/auth/access";
import { apiError, privateHeaders, requestId } from "./http";
import { requestParameters, resolveOperation } from "./routing";
import { boundedText, requestBackend } from "./transport";
import { validateTransportRequest } from "./validation";

export async function handleApiRequest(
  request: Request,
  segments: string[],
): Promise<Response> {
  const identity = requestId(request.headers);
  const settings = readDemoSettings();
  if (!settings)
    return apiError(
      identity,
      500,
      "INTERNAL_ERROR",
      "El acceso a SENIALON no está disponible.",
    );
  const authorization = validateAuthorization(
    request.headers.get("authorization"),
    settings,
  );
  if (!authorization)
    return apiError(
      identity,
      401,
      "AUTH_REQUIRED",
      "Se requiere la credencial de demo.",
    );
  const mutation = requiresOrigin(request.method);
  if (mutation && !permittedOrigin(request.headers, settings))
    return apiError(identity, 403, "ORIGIN_FORBIDDEN", "Origen no permitido.");
  const route = resolveOperation(request.method, segments);
  if (!route)
    return apiError(identity, 404, "NOT_FOUND", "Operación no disponible.");

  let body: string | undefined;
  try {
    const parameters = requestParameters(route.operation, request, route.path);
    if (mutation) {
      if (
        request.headers
          .get("content-type")
          ?.split(";")[0]
          .trim()
          .toLowerCase() !== "application/json"
      )
        throw new Error("Se requiere JSON.");
      const value: unknown = JSON.parse(await boundedText(request.body));
      validateTransportRequest(route.operation, { ...parameters, body: value });
      body = JSON.stringify(value);
    } else {
      if (request.body !== null)
        throw new Error("Lectura con cuerpo no permitida.");
      validateTransportRequest(route.operation, parameters);
    }
  } catch {
    return apiError(
      identity,
      422,
      "VALIDATION_ERROR",
      "La solicitud no cumple el contrato.",
    );
  }
  try {
    const result = await requestBackend({
      operation: route.operation,
      pathname: route.pathname,
      search: new URL(request.url).search,
      method: request.method,
      authorization,
      identity,
      origin: mutation ? settings.allowedOrigin : undefined,
      idempotencyKey: mutation
        ? (request.headers.get("idempotency-key") ?? undefined)
        : undefined,
      body,
      signal: request.signal,
    });
    return Response.json(result.body, {
      status: result.status,
      headers: privateHeaders(identity, result.status),
    });
  } catch {
    return apiError(
      identity,
      500,
      "INTERNAL_ERROR",
      "No se pudo obtener una respuesta válida. No se reintentó la operación.",
    );
  }
}
