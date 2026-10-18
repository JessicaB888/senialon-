import "server-only";
import { randomUUID } from "node:crypto";
import { basicChallenge } from "@/lib/auth/access";
import contract from "./generated/contract.json";
import type { Schema } from "./types";

const safeRequestId = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;

export function requestId(headers: Headers): string {
  const value = headers.get("x-request-id") ?? "";
  return safeRequestId.test(value) ? value : randomUUID();
}

export function privateHeaders(identity: string, status?: number): Headers {
  const headers = new Headers({
    "Cache-Control": "private, no-store",
    "X-Contract-Version": contract.version,
    "X-Request-Id": identity,
    "X-Content-Type-Options": "nosniff",
  });
  if (status === 401) headers.set("WWW-Authenticate", basicChallenge);
  return headers;
}

export function apiError(
  identity: string,
  status: number,
  code: Schema<"ErrorDetail">["code"],
  message: string,
): Response {
  const body: Schema<"ErrorResponse"> = {
    meta: {
      contract_version: "1.0.0",
      request_id: identity,
      served_at: new Date().toISOString(),
    },
    error: {
      code,
      message,
      stage: null,
      operation_id: null,
      current_revision: null,
      issues: [],
      retry_policy: "none",
    },
  };
  return Response.json(body, {
    status,
    headers: privateHeaders(identity, status),
  });
}
