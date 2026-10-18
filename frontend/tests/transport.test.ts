import { readFileSync } from "node:fs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET, POST } from "@/app/api/v1/[[...path]]/route";
import { handleApiRequest } from "@/lib/api/handler";
import { resolveOperation } from "@/lib/api/routing";
import { maxJsonBytes } from "@/lib/api/transport";
import { parseContractValue } from "@/lib/api/validation";
import type { Schema } from "@/lib/api/types";

const canonical = JSON.parse(
  readFileSync(
    new URL("../../docs/contracts/openapi.json", import.meta.url),
    "utf8",
  ),
) as {
  components: { examples: Record<string, { value: unknown }> };
};
const fixture = (name: string) =>
  structuredClone(canonical.components.examples[name].value);
const origin = "https://senialon.example";
const identity = "fe13:http:001";
const authorization = `Basic ${Buffer.from("synthetic-fe-operator:synthetic-fe-password").toString("base64")}`;
const fetchMock = vi.fn<typeof fetch>();

function request(path = "/api/v1/meta", init: RequestInit = {}) {
  return new Request(new URL(path, origin), {
    ...init,
    headers: {
      authorization,
      "X-Request-Id": identity,
      ...Object.fromEntries(new Headers(init.headers)),
    },
  });
}

function reply(
  status = 200,
  value = fixture("Capabilities"),
  overrides: HeadersInit = {},
) {
  const body = value as { meta: { request_id: string } };
  body.meta.request_id = identity;
  return Response.json(value, {
    status,
    headers: {
      "Cache-Control": "private, no-store",
      "X-Contract-Version": "1.0.0",
      "X-Request-Id": identity,
      ...Object.fromEntries(new Headers(overrides)),
    },
  });
}

beforeEach(() => {
  vi.stubEnv("DEMO_USERNAME", "synthetic-fe-operator");
  vi.stubEnv("DEMO_PASSWORD", "synthetic-fe-password");
  vi.stubEnv("DEMO_ALLOWED_ORIGIN", origin);
  vi.stubEnv(
    "SENIALON_BACKEND_URL",
    "http://backend.internal/service/backend/",
  );
  vi.stubEnv("VERCEL", "");
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

async function expectError(response: Response, status: number, code: string) {
  expect(response.status).toBe(status);
  const value = parseContractValue("ErrorResponse", await response.json());
  expect(value.error.code).toBe(code);
  expect(value.meta.request_id).toBe(response.headers.get("X-Request-Id"));
  expect(response.headers.get("Cache-Control")).toBe("private, no-store");
  expect(JSON.stringify(value)).not.toContain(
    "SYNTHETIC_SECRET_MUST_NOT_ESCAPE",
  );
  return value;
}

describe("Route Handlers sin dependencia del proxy", () => {
  it.each([null, "Basic wrong", "Bearer wrong"])(
    "deniega directamente autorización %s",
    async (value) => {
      const headers = new Headers();
      if (value) headers.set("Authorization", value);
      const response = await GET(
        new Request(`${origin}/api/v1/meta`, { headers }),
        { params: Promise.resolve({ path: ["meta"] }) },
      );
      await expectError(response, 401, "AUTH_REQUIRED");
      expect(fetchMock).not.toHaveBeenCalled();
    },
  );
  it("deniega configuración ausente antes de consultar el binding", async () => {
    vi.stubEnv("DEMO_PASSWORD", "");
    await expectError(
      await handleApiRequest(request(), ["meta"]),
      500,
      "INTERNAL_ERROR",
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it.each([undefined, "null", "https://attacker.example"])(
    "deniega mutación con origen %s antes de leer su JSON",
    async (value) => {
      const headers: Record<string, string> = {};
      if (value) headers.Origin = value;
      const response = await POST(
        request("/api/v1/runs", {
          method: "POST",
          headers,
          body: "broken JSON",
        }),
        { params: Promise.resolve({ path: ["runs"] }) },
      );
      await expectError(response, 403, "ORIGIN_FORBIDDEN");
      expect(fetchMock).not.toHaveBeenCalled();
    },
  );
});

describe("transporte validado al binding", () => {
  it("conserva el prefijo del binding y reenvía solo encabezados permitidos", async () => {
    fetchMock.mockResolvedValue(reply());
    const result = await GET(
      request("/api/v1/meta", {
        headers: {
          cookie: "private=discard",
          "x-forwarded-host": "attacker.example",
          "x-api-key": "discard",
        },
      }),
      { params: Promise.resolve({ path: ["meta"] }) },
    );
    expect(result.status).toBe(200);
    parseContractValue("CapabilitiesResponse", await result.json());
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toBe(
      "http://backend.internal/service/backend/api/v1/meta",
    );
    expect(init?.method).toBe("GET");
    expect(init?.body).toBeUndefined();
    expect(init?.cache).toBe("no-store");
    expect(init?.redirect).toBe("error");
    const headers = new Headers(init?.headers);
    expect(headers.get("Authorization")).toBe(authorization);
    expect(headers.get("X-Request-Id")).toBe(identity);
    expect(headers.get("Cookie")).toBeNull();
    expect(headers.get("X-Forwarded-Host")).toBeNull();
    expect(headers.get("X-Api-Key")).toBeNull();
    expect(result.headers.get("Set-Cookie")).toBeNull();
  });
  it("propaga un error contractual sin convertirlo en éxito", async () => {
    fetchMock.mockResolvedValue(reply(404, fixture("Error_NOT_FOUND")));
    await expectError(
      await handleApiRequest(request("/api/v1/runs"), ["runs"]),
      404,
      "NOT_FOUND",
    );
  });
  it("no repite una mutación con resultado de red incierto", async () => {
    fetchMock.mockRejectedValue(new Error("SYNTHETIC_SECRET_MUST_NOT_ESCAPE"));
    const key = "synthetic-command-0001";
    const result = await handleApiRequest(
      request("/api/v1/runs", {
        method: "POST",
        headers: {
          Origin: origin,
          "Content-Type": "application/json",
          "Idempotency-Key": key,
        },
        body: JSON.stringify(fixture("CreateRun")),
      }),
      ["runs"],
    );
    const error = await expectError(result, 500, "INTERNAL_ERROR");
    expect(error.error.retry_policy).toBe("none");
    expect(fetchMock).toHaveBeenCalledOnce();
    const sent = new Headers(fetchMock.mock.calls[0][1]?.headers);
    expect(sent.get("Origin")).toBe(origin);
    expect(sent.get("Idempotency-Key")).toBe(key);
  });
  it.each([
    "",
    "https://user:pass@backend.internal",
    "https://backend.internal?next=external",
    "file:///private/secret",
  ])("falla cerrado ante binding inválido %s", async (base) => {
    vi.stubEnv("SENIALON_BACKEND_URL", base);
    await expectError(
      await handleApiRequest(request(), ["meta"]),
      500,
      "INTERNAL_ERROR",
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("entradas derivadas del contrato", () => {
  it.each([
    "?limit=0",
    "?limit=101",
    "?limit=2&limit=3",
    "?limit=2e1",
    "?limit=1.5",
    "?url=https://attacker.example",
    "?__proto__=ignored",
    "?cursor=",
  ])("rechaza parámetros %s sin llamar al backend", async (query) => {
    await expectError(
      await handleApiRequest(request(`/api/v1/runs${query}`), ["runs"]),
      422,
      "VALIDATION_ERROR",
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("acepta paginación válida y no introduce defaults en la URL", async () => {
    fetchMock.mockResolvedValue(reply(404, fixture("Error_NOT_FOUND")));
    await handleApiRequest(
      request("/api/v1/runs?limit=20&cursor=opaque%3A001"),
      ["runs"],
    );
    expect(String(fetchMock.mock.calls[0][0])).toBe(
      "http://backend.internal/service/backend/api/v1/runs?limit=20&cursor=opaque%3A001",
    );
  });
  it.each([
    {
      headers: new Headers({ "Idempotency-Key": "too-short" }),
      body: JSON.stringify(fixture("CreateRun")),
    },
    { headers: new Headers(), body: JSON.stringify(fixture("CreateRun")) },
    {
      headers: new Headers({ "Idempotency-Key": "synthetic-command-0001" }),
      body: "not JSON",
    },
    {
      headers: new Headers({ "Idempotency-Key": "synthetic-command-0001" }),
      body: JSON.stringify({ unexpected: true }),
    },
  ])("rechaza comando inválido sin consumo", async ({ headers, body }) => {
    await expectError(
      await handleApiRequest(
        request("/api/v1/runs", {
          method: "POST",
          headers: {
            Origin: origin,
            "Content-Type": "application/json",
            ...Object.fromEntries(headers),
          },
          body,
        }),
        ["runs"],
      ),
      422,
      "VALIDATION_ERROR",
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it.each(
    [
      ["runs", "..", "meta"],
      ["runs", "a/b"],
      ["runs", "a\\b"],
      ["external"],
      ["runs", "r", "analyses", "a", "notion-export"],
    ].map((path) => ({ path })),
  )("no ofrece una ruta arbitraria/opcional %j", async ({ path }) => {
    expect(resolveOperation("GET", path)).toBeNull();
    await expectError(
      await handleApiRequest(request(), path),
      404,
      "NOT_FOUND",
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("Notion no se activa por existir en el contrato", () => {
    expect(
      resolveOperation("POST", ["runs", "r", "analyses", "a", "notion-export"]),
    ).toBeNull();
  });
});

describe("rechazo de respuestas corruptas sin filtrar su contenido", () => {
  it.each([
    new Headers({ "X-Contract-Version": "unexpected" }),
    new Headers({ "X-Request-Id": "different-request" }),
    new Headers({ "Cache-Control": "public, max-age=60" }),
    new Headers({ "Content-Type": "text/html" }),
  ])("rechaza metadatos de transporte incompatibles %j", async (headers) => {
    fetchMock.mockResolvedValue(reply(200, fixture("Capabilities"), headers));
    await expectError(
      await handleApiRequest(request(), ["meta"]),
      500,
      "INTERNAL_ERROR",
    );
    expect(fetchMock).toHaveBeenCalledOnce();
  });
  it("rechaza identidad del body distinta del encabezado", async () => {
    const response = reply();
    const body = (await response.json()) as Schema<"CapabilitiesResponse">;
    body.meta.request_id = "different-body-request";
    fetchMock.mockResolvedValue(
      Response.json(body, { headers: response.headers }),
    );
    await expectError(
      await handleApiRequest(request(), ["meta"]),
      500,
      "INTERNAL_ERROR",
    );
  });
  it("rechaza cuerpo que no corresponde a la operación", async () => {
    fetchMock.mockResolvedValue(reply(200, fixture("Error_INTERNAL_ERROR")));
    await expectError(
      await handleApiRequest(request(), ["meta"]),
      500,
      "INTERNAL_ERROR",
    );
  });
  it.each(["SYNTHETIC_SECRET_MUST_NOT_ESCAPE", "x".repeat(maxJsonBytes + 1)])(
    "rechaza JSON inválido o demasiado grande",
    async (body) => {
      const headers = reply().headers;
      fetchMock.mockResolvedValue(new Response(body, { headers }));
      await expectError(
        await handleApiRequest(request(), ["meta"]),
        500,
        "INTERNAL_ERROR",
      );
    },
  );
});
