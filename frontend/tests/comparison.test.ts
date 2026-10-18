import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  advanceComparisonAction,
  readComparisonAction,
} from "@/app/comparison-actions";
import { ComparisonView } from "@/components/comparison/comparison-view";
import type { Schema } from "@/lib/api/types";
import { parseContractValue } from "@/lib/api/validation";
import {
  canCompare,
  countLabel,
  signalLabels,
} from "@/lib/comparison/presentation";
import type { ComparisonSnapshot } from "@/lib/comparison/types";
import { consistentComparison } from "@/lib/comparison/validation";
import { parseReceipt } from "@/lib/runs/command";

const incoming = vi.hoisted(() => ({ headers: new Headers() }));
vi.mock("next/headers", () => ({ headers: async () => incoming.headers }));
const canonical = JSON.parse(
  readFileSync(
    new URL("../../docs/contracts/openapi.json", import.meta.url),
    "utf8",
  ),
);
function example(name: string): unknown {
  return structuredClone(canonical.components.examples[name].value);
}
const origin = "https://senialon.example";
const identity = "synthetic:comparison:request";
const authorization = `Basic ${Buffer.from("synthetic-fe16:synthetic-password").toString("base64")}`;
const fetchMock = vi.fn<typeof fetch>();
const key = "synthetic-comparison-key-0001";

function snapshot(name = "CompleteComparison"): ComparisonSnapshot {
  const run = parseContractValue("RunResponse", example("CreatedRun")).data;
  const groups = parseContractValue(
    "GroupsResponse",
    example("ConfirmedGroups"),
  ).data;
  const comparison = parseContractValue(
    "ComparisonResponse",
    example(name),
  ).data;
  run.revision = 10;
  run.current_stage = "comparison";
  run.allowed_actions = ["advance_comparison", "select_analysis"];
  comparison.computed_at = comparison.computed_at
    ? groups.proposal!.confirmation!.confirmed_at
    : null;
  return { run, groups, comparison, servedAt: "2026-10-18T13:00:00Z" };
}
function reply(data: unknown, status = 200) {
  return Response.json(
    {
      meta: {
        contract_version: "1.0.0",
        request_id: identity,
        served_at: "2026-10-18T13:00:00Z",
      },
      data,
    },
    {
      status,
      headers: {
        "Cache-Control": "private, no-store",
        "X-Contract-Version": "1.0.0",
        "X-Request-Id": identity,
      },
    },
  );
}
function serve(value = snapshot()) {
  fetchMock.mockImplementation(async (url) => {
    const path = new URL(String(url)).pathname;
    return reply(
      path.endsWith("/comparison")
        ? value.comparison
        : path.endsWith("/groups")
          ? value.groups
          : value.run,
    );
  });
}
beforeEach(() => {
  vi.stubEnv("DEMO_USERNAME", "synthetic-fe16");
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

describe("acciones protegidas de comparación", () => {
  it.each(["read", "calculate"])(
    "rechaza %s sin credencial antes de Python",
    async (kind) => {
      incoming.headers.delete("authorization");
      const result =
        kind === "read"
          ? await readComparisonAction("fixture-run-001")
          : await advanceComparisonAction("fixture-run-001", 10, key);
      expect(result).toMatchObject({
        ok: false,
        error: { code: "AUTH_REQUIRED" },
      });
      expect(fetchMock).not.toHaveBeenCalled();
    },
  );
  it("rechaza un origen ajeno sin enviar la mutación", async () => {
    incoming.headers.set("origin", "https://foreign.example");
    expect(
      await advanceComparisonAction("fixture-run-001", 10, key),
    ).toMatchObject({ ok: false, error: { code: "ORIGIN_FORBIDDEN" } });
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it.each([0, -1, 1.5])(
    "rechaza revisión %s antes de enviar",
    async (revision) => {
      expect(
        await advanceComparisonAction("fixture-run-001", revision, key),
      ).toMatchObject({ ok: false, error: { code: "VALIDATION_ERROR" } });
      expect(fetchMock).not.toHaveBeenCalled();
    },
  );
  it("consultar solo recupera comparación, grupos y ejecución con GET", async () => {
    serve();
    expect((await readComparisonAction("fixture-run-001")).ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(3);
    for (const [, init] of fetchMock.mock.calls)
      expect(init).toMatchObject({
        method: "GET",
        body: undefined,
        cache: "no-store",
      });
    expect(
      fetchMock.mock.calls.map(([url]) => new URL(String(url)).pathname).sort(),
    ).toEqual([
      "/backend/api/v1/runs/fixture-run-001",
      "/backend/api/v1/runs/fixture-run-001/comparison",
      "/backend/api/v1/runs/fixture-run-001/groups",
    ]);
  });
  it("conserva grupos sin confirmar y no solicita el cálculo", async () => {
    const value = snapshot("UnconfirmedComparison");
    value.groups = parseContractValue(
      "GroupsResponse",
      example("ProposedGroups"),
    ).data;
    serve(value);
    expect((await readComparisonAction("fixture-run-001")).ok).toBe(true);
    expect(
      fetchMock.mock.calls.every(([, init]) => init?.method === "GET"),
    ).toBe(true);
  });
  it("envía solo comparison, revisión y clave originales, sin confirmar grupos", async () => {
    const operation = parseContractValue(
      "OperationResponse",
      example("CompletedOperation"),
    ).data;
    operation.stage = "comparison";
    operation.item_id = "fixture-groups-001";
    fetchMock.mockImplementation(async () => reply(operation));
    for (let i = 0; i < 2; i++)
      expect(
        (await advanceComparisonAction("fixture-run-001", 10, key)).ok,
      ).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    for (const [url, init] of fetchMock.mock.calls) {
      expect(String(url).endsWith("/runs/fixture-run-001/advance")).toBe(true);
      expect(JSON.parse(String(init?.body))).toEqual({
        expected_run_revision: 10,
        target: { scope: "comparison" },
      });
      expect(new Headers(init?.headers).get("Idempotency-Key")).toBe(key);
    }
  });
  it.each(["foreign_run", "foreign_stage", "analysis"])(
    "no acepta una operación %s",
    async (kind) => {
      const operation = parseContractValue(
        "OperationResponse",
        example("CompletedOperation"),
      ).data;
      operation.stage = kind === "foreign_stage" ? "grouping" : "comparison";
      if (kind === "foreign_run") operation.run_id = "another-run";
      if (kind === "analysis") {
        operation.analysis_id = "another-analysis";
        operation.analysis_version = 1;
      }
      fetchMock.mockResolvedValue(reply(operation));
      expect(
        await advanceComparisonAction("fixture-run-001", 10, key),
      ).toMatchObject({ ok: false, error: { code: "STALE_DATA" } });
    },
  );
  it("conserva el rechazo del backend por grupos sin confirmar", async () => {
    const error = parseContractValue(
      "ErrorResponse",
      example("Error_GROUPS_NOT_CONFIRMED"),
    );
    error.meta.request_id = identity;
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify(error), {
        status: 409,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "private, no-store",
          "X-Contract-Version": "1.0.0",
          "X-Request-Id": identity,
        },
      }),
    );
    expect(
      await advanceComparisonAction("fixture-run-001", 10, key),
    ).toMatchObject({ ok: false, error: { code: "GROUPS_NOT_CONFIRMED" } });
  });
  it("un timeout conserva el error sin exponer detalles ni repetir", async () => {
    fetchMock.mockRejectedValue(new Error("SYNTHETIC_PRIVATE_FAILURE"));
    const result = await advanceComparisonAction("fixture-run-001", 10, key);
    expect(result.ok).toBe(false);
    expect(JSON.stringify(result)).not.toContain("SYNTHETIC_PRIVATE_FAILURE");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe("coherencia de snapshots y procedencia", () => {
  it.each(["CompleteComparison", "PartialComparison"])(
    "acepta %s canónica",
    (name) => {
      expect(consistentComparison(snapshot(name))).toBe(true);
    },
  );
  it.each([
    "run",
    "groups",
    "version",
    "confirmation",
    "window",
    "future_revision",
    "topic",
    "duplicate_topic",
    "foreign_source",
    "duplicate_source",
    "missing_video",
    "cross_window_video",
  ])("rechaza relaciones incompatibles: %s", async (kind) => {
    const value = snapshot();
    const data = value.comparison;
    const signal = data.signals[0];
    if (kind === "run") data.run_id = "another-run";
    if (kind === "groups") data.groups_id = "another-group";
    if (kind === "version") data.groups_version = 2;
    if (kind === "confirmation") data.confirmation_id = "another-confirmation";
    if (kind === "window")
      data.windows.recent.start_inclusive = "2026-10-11T00:00:00-05:00";
    if (kind === "future_revision") data.comparison_revision = 100;
    if (kind === "topic") signal.topic_id = "another-topic";
    if (kind === "duplicate_topic") data.signals.push(structuredClone(signal));
    if (kind === "foreign_source")
      signal.previous.by_source[0].source_id = "foreign";
    if (kind === "duplicate_source")
      signal.previous.by_source.push(
        structuredClone(signal.previous.by_source[0]),
      );
    if (kind === "missing_video") signal.previous.by_source[0].video_ids.pop();
    if (kind === "cross_window_video") {
      signal.recent.video_ids[0] = signal.previous.video_ids[0];
      signal.recent.by_source[0].video_ids[0] = signal.previous.video_ids[0];
    }
    serve(value);
    expect(await readComparisonAction("fixture-run-001")).toMatchObject({
      ok: false,
      error: { code: "STALE_DATA" },
    });
  });
  it("acepta el mismo instante de ventana serializado en UTC", () => {
    const value = snapshot();
    value.comparison.windows.previous.start_inclusive = "2026-10-03T05:00:00Z";
    expect(consistentComparison(value)).toBe(true);
  });
  it("no ofrece cálculo mientras falte confirmación o autorización", () => {
    const value = snapshot();
    value.comparison.state = "not_requested";
    value.comparison.computed_at = null;
    value.comparison.comparison_revision = null;
    value.comparison.signals = [];
    expect(canCompare(value)).toBe(true);
    value.run.allowed_actions = [];
    expect(canCompare(value)).toBe(false);
    value.run.allowed_actions = ["advance_comparison"];
    value.groups.proposal!.state = "proposed";
    expect(canCompare(value)).toBe(false);
  });
});

function emptyCount(): Schema<"ZeroCount"> {
  return {
    state: "known",
    total_count: 0,
    observed_count: 0,
    reason: null,
    video_ids: [],
    by_source: [],
  };
}
describe("tabla de comparación: valores del backend y límites", () => {
  it.each(["2/4", "2/0", "0/3", "0/0", "unknown/3"])(
    "presenta %s sin inventar porcentajes",
    (kind) => {
      const value = snapshot(
        kind === "unknown/3" ? "PartialComparison" : "CompleteComparison",
      );
      const base = value.comparison.signals[0];
      if (kind === "2/0")
        value.comparison.signals = [
          {
            ...base,
            kind: "comparable",
            direction: "decrease",
            recent: emptyCount(),
            delta: -2,
            percentage_change: -100,
            percentage_reason: null,
          } as Schema<"ComparableSignal">,
        ];
      if (kind === "0/3") {
        const recent = {
          ...base.recent,
          state: "known" as const,
          total_count: 3,
          reason: null,
          observed_count: 3,
          video_ids: base.recent.video_ids.slice(0, 3),
          by_source: [
            {
              ...base.recent.by_source[0],
              observed_count: 3,
              video_ids: base.recent.video_ids.slice(0, 3),
            },
          ],
        };
        value.comparison.signals = [
          {
            ...base,
            kind: "new_in_corpus",
            direction: "increase",
            previous: emptyCount(),
            recent,
            delta: 3,
            percentage_change: null,
            percentage_reason: "zero_baseline",
          },
        ];
      }
      if (kind === "0/0")
        value.comparison.signals = [
          {
            ...base,
            kind: "no_observed_publications",
            direction: "unchanged",
            previous: emptyCount(),
            recent: emptyCount(),
            delta: 0,
            percentage_change: null,
            percentage_reason: "zero_baseline",
          },
        ];
      parseContractValue("Comparison", value.comparison);
      const html = renderToStaticMarkup(
        createElement(ComparisonView, { snapshot: value }),
      );
      expect(html).toContain("America/Bogota");
      expect(html).toContain("inclusive");
      expect(html).toContain("exclusivo");
      if (kind === "2/4") {
        expect(html).toContain("+2");
        expect(html).toContain("+100 %");
      }
      if (kind === "2/0") {
        expect(html).toContain("-2");
        expect(html).toContain("-100 %");
        expect(html).toContain("Descenso de publicaciones");
      }
      if (kind === "0/3") {
        expect(html).toContain("Nuevo en el corpus");
        expect(html).toContain("No aplicable");
        expect(html).not.toMatch(/\d\s*%/);
      }
      if (kind === "0/0") {
        expect(html).toContain("Sin publicaciones observadas");
        expect(html).not.toContain("Nuevo en el corpus");
      }
      if (kind === "unknown/3") {
        expect(html).toContain("Desconocido");
        expect(html).toContain("Comparación completa pendiente");
        expect(html).not.toContain("Nuevo en el corpus");
        expect(html).not.toMatch(/\d\s*%/);
      }
    },
  );
  it("muestra parciales incluso cuando los IDs observados sean cero", () => {
    const value = snapshot("PartialComparison");
    const previous = value.comparison.signals[0].previous;
    expect(previous.state).toBe("unknown");
    expect(countLabel(previous)).toBe("Desconocido");
  });
  it("no presenta crecimiento si la cobertura del resultado es parcial", () => {
    const signal = snapshot().comparison.signals[0];
    expect(signalLabels(signal, false)).toMatchObject({
      delta: "Pendiente",
      percentage: "Pendiente",
      label: "Comparación completa pendiente",
    });
  });
  it("ofrece enlaces a los IDs y aporte de cada canal, sin sumar secundarios", () => {
    const value = snapshot();
    const html = renderToStaticMarkup(
      createElement(ComparisonView, { snapshot: value }),
    );
    for (const id of value.comparison.signals[0].previous.video_ids)
      expect(html).toContain(`https://www.youtube.com/watch?v=${id}`);
    expect(html).toContain(value.run.corpus[0].original_url);
    expect(html).toContain("Los temas secundarios no suman");
    expect(html).toContain('scope="row"');
    expect(html).toContain('tabindex="0"');
  });
  it("preserva el resultado previo con una advertencia tras fallo de consulta", () => {
    const html = renderToStaticMarkup(
      createElement(ComparisonView, { snapshot: snapshot(), stale: true }),
    );
    expect(html).toContain("Lectura anterior conservada");
    expect(html).toContain("+100 %");
  });
});

describe("identidad duradera de una solicitud de comparación", () => {
  const command = {
    version: 1,
    kind: "compare",
    key,
    createdAt: "2026-10-18T13:00:00Z",
    operationId: null,
    runId: "fixture-run-001",
    revision: 10,
    groupsId: "fixture-groups-001",
    groupsVersion: 1,
    confirmationId: "fixture-confirmation-001",
  };
  it("recupera la misma revisión, confirmación y clave", () =>
    expect(parseReceipt(JSON.stringify(command))).toEqual(command));
  it.each([
    { ...command, confirmationId: "" },
    { ...command, confirmationId: null },
    { ...command, groupsVersion: 0 },
    { ...command, revision: 0 },
    { ...command, result: "not-delivery-metadata" },
  ])("rechaza metadatos incompletos o resultados en el recibo", (value) =>
    expect(() => parseReceipt(JSON.stringify(value))).toThrow(),
  );
});
