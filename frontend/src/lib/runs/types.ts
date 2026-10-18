import type { Schema } from "@/lib/api/types";

export type Notice = {
  code: Schema<"ErrorDetail">["code"] | "CONNECTION_ERROR" | "STALE_DATA";
  message: string;
  requestId: string | null;
  stage: string | null;
  operationId: string | null;
  retryPolicy: Schema<"ErrorDetail">["retry_policy"];
};

export type Result<T> = { ok: true; value: T } | { ok: false; error: Notice };
export type RunSnapshot = {
  run: Result<Schema<"RunResponse">>;
  coverage: Result<Schema<"CoverageResponse">>;
};

export const connectionNotice: Notice = {
  code: "CONNECTION_ERROR",
  message:
    "No se pudo confirmar la respuesta. Consulta el estado antes de continuar.",
  requestId: null,
  stage: null,
  operationId: null,
  retryPolicy: "none",
};
