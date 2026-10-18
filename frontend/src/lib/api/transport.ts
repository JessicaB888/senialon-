import "server-only";
import { basicChallenge } from "@/lib/auth/access";
import { contractIdentity, parseApiResponse } from "./validation";
import type { ApiResponse, OperationId } from "./types";

// Bound JSON in memory below the deployment payload limit; no video uploads.
export const maxJsonBytes = 4_000_000;
export const backendTimeoutMs = 50_000;

export async function boundedText(
  body: ReadableStream<Uint8Array> | null,
): Promise<string> {
  if (!body) return "";
  const reader = body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let size = 0;
  let text = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxJsonBytes) throw new Error("JSON demasiado grande.");
      text += decoder.decode(value, { stream: true });
    }
    return text + decoder.decode();
  } catch {
    await reader.cancel().catch(() => undefined);
    throw new Error("No se pudo leer el JSON.");
  } finally {
    reader.releaseLock();
  }
}

function bindingTarget(pathname: string, search: string): URL {
  const base = new URL(process.env.SENIALON_BACKEND_URL ?? "");
  if (
    !["http:", "https:"].includes(base.protocol) ||
    base.username ||
    base.password ||
    base.search ||
    base.hash
  ) {
    throw new Error("Binding no disponible.");
  }
  // Preserve Vercel's service prefix; a leading / would discard that prefix.
  base.pathname = `${base.pathname.replace(/\/$/, "")}/${pathname}`;
  base.search = search;
  return base;
}

type BackendRequest = {
  operation: OperationId;
  pathname: string;
  search: string;
  method: string;
  authorization: string;
  identity: string;
  origin?: string;
  idempotencyKey?: string;
  body?: string;
  signal: AbortSignal;
};

export async function requestBackend(
  input: BackendRequest,
): Promise<ApiResponse<OperationId>> {
  const target = bindingTarget(input.pathname, input.search);
  const headers = new Headers({
    Accept: "application/json",
    Authorization: input.authorization,
    "X-Request-Id": input.identity,
  });
  if (input.body !== undefined) headers.set("Content-Type", "application/json");
  if (input.origin) headers.set("Origin", input.origin);
  if (input.idempotencyKey)
    headers.set("Idempotency-Key", input.idempotencyKey);
  const signal = AbortSignal.any([
    input.signal,
    AbortSignal.timeout(backendTimeoutMs),
  ]);
  // Exactly one attempt; an uncertain mutation must not be repeated automatically.
  const response = await fetch(target, {
    method: input.method,
    headers,
    body: input.body,
    cache: "no-store",
    redirect: "error",
    signal,
  });
  if (
    response.headers.get("cache-control") !== "private, no-store" ||
    response.headers.get("x-contract-version") !== contractIdentity.version ||
    response.headers.get("x-request-id") !== input.identity ||
    response.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !==
      "application/json" ||
    (response.status === 401 &&
      response.headers.get("www-authenticate") !== basicChallenge)
  ) {
    await response.body?.cancel();
    throw new Error("Respuesta de backend no válida.");
  }
  const result = parseApiResponse(
    input.operation,
    response.status,
    await boundedText(response.body),
  );
  if (result.body.meta.request_id !== input.identity)
    throw new Error("Identidad de respuesta no válida.");
  return result;
}
