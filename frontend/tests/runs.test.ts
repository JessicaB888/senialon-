import { readFileSync } from "node:fs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  advanceRunAction,
  createRunAction,
  listRunsAction,
  readOperationAction,
  readRunAction,
} from "@/app/run-actions";
import { parseContractValue } from "@/lib/api/validation";
import { canAdvance, dateLabel, discoveryLabel } from "@/lib/runs/presentation";
import { parseReceipt } from "@/lib/runs/command";

const incoming = vi.hoisted(() => ({ headers: new Headers() }));
vi.mock("next/headers", () => ({ headers: async () => incoming.headers }));
const canonical = JSON.parse(
  readFileSync(
    new URL("../../docs/contracts/openapi.json", import.meta.url),
    "utf8",
  ),
);
const fixture = (name: string): unknown =>
  structuredClone(canonical.components.examples[name].value);
const origin = "https://senialon.example";
const identity = "fe14:synthetic:request";
const authorization = `Basic ${Buffer.from("synthetic-fe14:synthetic-password").toString("base64")}`;
const fetchMock = vi.fn<typeof fetch>();
const key = "synthetic-command-0001";

function reply(name: string, status = 200) {
  const value = parseContractValue("Meta", {
    contract_version: "1.0.0",
    request_id: identity,
    served_at: "2026-10-17T12:00:00-05:00",
  });
  const body = fixture(name) as { meta: typeof value };
  body.meta = value;
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "private, no-store",
      "X-Contract-Version": "1.0.0",
      "X-Request-Id": identity,
    },
  });
}
function serveSnapshot() {
  fetchMock.mockImplementation(async (url) => {
    const path = String(url);
    if (path.endsWith("/coverage")) return reply("PartialCoverage");
    const response = reply("CreatedRun");
    const body = await response.json();
    body.data.revision = 10;
    return Response.json(body, { headers: response.headers });
  });
}
beforeEach(() => {
  vi.stubEnv("DEMO_USERNAME", "synthetic-fe14");
  vi.stubEnv("DEMO_PASSWORD", "synthetic-password");
  vi.stubEnv("DEMO_ALLOWED_ORIGIN", origin);
  vi.stubEnv("SENIALON_BACKEND_URL", "http://binding.internal/backend/");
  vi.stubEnv("VERCEL", "");
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockReset();
  incoming.headers = new Headers({
    authorization,
    origin,
    "X-Request-Id": identity,
  });
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("acciones de ejecuciones con guardas independientes", () => {
  it.each(["read", "create", "advance", "operation"])(
    "rechaza %s sin credencial aunque se invoque sin página ni proxy",
    async (action) => {
      incoming.headers.delete("authorization");
      const result =
        action === "read"
          ? await listRunsAction()
          : action === "create"
            ? await createRunAction(key)
            : action === "advance"
              ? await advanceRunAction("fixture-run-001", 1, key)
              : await readOperationAction(
                  "fixture-run-001",
                  "fixture-operation-001",
                );
      expect(result).toMatchObject({
        ok: false,
        error: { code: "AUTH_REQUIRED" },
      });
      expect(fetchMock).not.toHaveBeenCalled();
    },
  );
  it.each([null, "https://other.example"])(
    "mutaciones rechazan origen %s sin confiar en Host",
    async (value) => {
      if (value) incoming.headers.set("origin", value);
      else incoming.headers.delete("origin");
      incoming.headers.set("host", "senialon.example");
      expect(await createRunAction(key)).toMatchObject({
        ok: false,
        error: { code: "ORIGIN_FORBIDDEN" },
      });
      expect(await advanceRunAction("fixture-run-001", 1, key)).toMatchObject({
        ok: false,
        error: { code: "ORIGIN_FORBIDDEN" },
      });
      expect(fetchMock).not.toHaveBeenCalled();
    },
  );
  it("listado es GET sin cuerpo, usa cursor opaco y nunca avanza", async () => {
    fetchMock.mockResolvedValue(reply("RunList"));
    expect((await listRunsAction("opaque:+/second")).ok).toBe(true);
    const [url, init] = fetchMock.mock.calls[0];
    expect(new URL(String(url)).searchParams.get("cursor")).toBe(
      "opaque:+/second",
    );
    expect(init).toMatchObject({
      method: "GET",
      cache: "no-store",
      body: undefined,
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
  it("creación transmite solo {} y conserva la clave recibida", async () => {
    fetchMock.mockImplementation(async () => reply("CreatedRun", 201));
    expect((await createRunAction(key)).ok).toBe(true);
    expect((await createRunAction(key)).ok).toBe(true);
    for (const [, init] of fetchMock.mock.calls) {
      expect(init?.body).toBe("{}");
      expect(new Headers(init?.headers).get("idempotency-key")).toBe(key);
    }
  });
  it("avance conserva revisión, scope corpus y clave, sin otro POST implícito", async () => {
    fetchMock.mockResolvedValue(reply("CompletedOperation"));
    const result = await advanceRunAction("fixture-run-001", 1, key);
    expect(result.ok).toBe(true);
    expect(JSON.parse(String(fetchMock.mock.calls[0][1]?.body))).toEqual({
      expected_run_revision: 1,
      target: { scope: "corpus" },
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
  it.each([0, -1, 1.2])("revisión %s no llega a Python", async (revision) => {
    expect(
      await advanceRunAction("fixture-run-001", revision, key),
    ).toMatchObject({ ok: false, error: { code: "VALIDATION_ERROR" } });
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("HTML o fallo de transporte no se publica ni repite", async () => {
    fetchMock.mockRejectedValue(new Error("SYNTHETIC_PRIVATE_EXCEPTION"));
    const result = await createRunAction(key);
    expect(result.ok).toBe(false);
    expect(JSON.stringify(result)).not.toContain("SYNTHETIC_PRIVATE_EXCEPTION");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe("identidades, versiones y cobertura", () => {
  it("recupera dos lecturas independientes de la misma revisión, sin mutar", async () => {
    serveSnapshot();
    const result = await readRunAction("fixture-run-001");
    expect(result.run.ok).toBe(true);
    expect(result.coverage.ok).toBe(true);
    expect(
      fetchMock.mock.calls.every(([, init]) => init?.method === "GET"),
    ).toBe(true);
  });
  it("rechaza cobertura de otra revisión conservando la ejecución", async () => {
    fetchMock.mockImplementation(async (url) =>
      String(url).endsWith("/coverage")
        ? reply("PartialCoverage")
        : reply("CreatedRun"),
    );
    const result = await readRunAction("fixture-run-001");
    expect(result.run.ok).toBe(true);
    expect(result.coverage).toMatchObject({
      ok: false,
      error: { code: "STALE_DATA" },
    });
  });
  it.each([
    "duplicate_cell",
    "foreign_source",
    "foreign_run",
    "foreign_corpus",
  ])("no presenta %s como datos del corpus acordado", async (failure) => {
    serveSnapshot();
    const base = fetchMock.getMockImplementation()!;
    fetchMock.mockImplementation(async (...args) => {
      const response = await base(...args);
      const body = await response.json();
      if (String(args[0]).endsWith("/coverage")) {
        if (failure === "duplicate_cell")
          body.data.cells[1] = body.data.cells[0];
        if (failure === "foreign_source")
          body.data.cells[0].source_id = "another-source";
        if (failure === "foreign_run") body.data.run_id = "another-run";
      } else if (failure === "foreign_corpus")
        body.data.corpus[0].original_url = "https://other.example/channel";
      return Response.json(body, { headers: response.headers });
    });
    const result = await readRunAction("fixture-run-001");
    expect(result.coverage.ok).toBe(false);
    if (failure === "foreign_corpus") expect(result.run.ok).toBe(false);
  });
  it("operación recuperada debe corresponder a ambos IDs", async () => {
    fetchMock.mockResolvedValue(reply("Operation_uncertain"));
    expect(
      await readOperationAction("another-run", "fixture-operation-001"),
    ).toMatchObject({ ok: false, error: { code: "STALE_DATA" } });
  });
  it("operación incierta conserva su política y presupuesto", async () => {
    fetchMock.mockResolvedValue(reply("Operation_uncertain"));
    const result = await readOperationAction(
      "fixture-run-001",
      "fixture-operation-001",
    );
    expect(result).toMatchObject({
      ok: true,
      value: {
        data: {
          state: "uncertain",
          retry_policy: "manual_reconciliation_required",
        },
      },
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe("presentación sin cálculos analíticos", () => {
  const coverage = parseContractValue(
    "CoverageResponse",
    fixture("PartialCoverage"),
  ).data;
  it("distingue cero observado de canal fallido sin publicaciones", () => {
    expect(
      discoveryLabel(coverage.cells.find((cell) => cell.source_id === "c03")),
    ).toBe("0 publicaciones observadas");
    expect(
      discoveryLabel(
        coverage.cells.find(
          (cell) => cell.source_id === "c02" && cell.window === "previous",
        ),
      ),
    ).toBe("Desconocido · consulta incompleta");
    expect(discoveryLabel(undefined)).toBe("Desconocido");
  });
  it("fecha se muestra en Bogotá independientemente de la zona del navegador", () => {
    expect(dateLabel("2026-10-18T03:00:00Z")).toContain("17");
    expect(dateLabel("2026-10-18T03:00:00Z")).toContain("22:00:00");
  });
  it("un permiso no habilita avance con una operación del corpus pendiente", () => {
    const run = parseContractValue(
      "RunResponse",
      fixture("RunAfterLostResponse"),
    ).data;
    run.allowed_actions = ["advance_corpus"];
    expect(canAdvance(run)).toBe(false);
    run.operations_to_inspect = [];
    expect(canAdvance(run)).toBe(true);
  });
});

describe("recibo local versionado, sin resultados ni secretos", () => {
  const receipt = {
    version: 1,
    kind: "advance",
    key,
    createdAt: "2026-10-17T12:00:00-05:00",
    operationId: null,
    runId: "fixture-run-001",
    revision: 10,
  };
  it("recupera exactamente la identidad y revisión, sin generar otra clave", () => {
    expect(parseReceipt(JSON.stringify(receipt))).toEqual(receipt);
    expect(parseReceipt(null)).toBeNull();
  });
  it.each([
    "broken",
    JSON.stringify({ ...receipt, version: 2 }),
    JSON.stringify({ ...receipt, revision: 0 }),
    JSON.stringify({ ...receipt, key: "short" }),
    JSON.stringify({ ...receipt, password: "unwanted" }),
  ])("rechaza registro inválido %s", (text) => {
    expect(() => parseReceipt(text)).toThrow();
  });
});
