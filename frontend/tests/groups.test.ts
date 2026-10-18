import { readFileSync } from "node:fs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { confirmGroupsAction, readGroupsAction } from "@/app/group-actions";
import { parseContractValue } from "@/lib/api/validation";
import type { Schema } from "@/lib/api/types";
import { matchesRun, sourceLink } from "@/lib/groups/presentation";
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
const identity = "fe15:synthetic:request";
const authorization = `Basic ${Buffer.from("synthetic-fe15:synthetic-password").toString("base64")}`;
const fetchMock = vi.fn<typeof fetch>();
const key = "synthetic-confirmation-0001";
const body: Schema<"ConfirmGroupsRequest"> = {
  expected_run_revision: 10,
  groups_id: "fixture-groups-001",
  groups_version: 1,
};
function groups(name = "ProposedGroups") {
  return parseContractValue("GroupsResponse", fixture(name));
}
function reply(value: Schema<"GroupsResponse">) {
  return Response.json(
    {
      ...value,
      meta: { ...value.meta, request_id: identity },
    },
    {
      headers: {
        "Cache-Control": "private, no-store",
        "X-Contract-Version": "1.0.0",
        "X-Request-Id": identity,
      },
    },
  );
}
beforeEach(() => {
  vi.stubEnv("DEMO_USERNAME", "synthetic-fe15");
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

describe("consulta y confirmación independientes de la página", () => {
  it.each(["read", "confirm"])("rechaza %s sin credencial", async (kind) => {
    incoming.headers.delete("authorization");
    const result =
      kind === "read"
        ? await readGroupsAction("fixture-run-001")
        : await confirmGroupsAction("fixture-run-001", body, key);
    expect(result).toMatchObject({
      ok: false,
      error: { code: "AUTH_REQUIRED" },
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("rechaza confirmación con origen ajeno antes de Python", async () => {
    incoming.headers.set("origin", "https://another.example");
    expect(
      await confirmGroupsAction("fixture-run-001", body, key),
    ).toMatchObject({
      ok: false,
      error: { code: "ORIGIN_FORBIDDEN" },
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it.each([0, -1, 1.5])(
    "rechaza versión %s antes de enviar",
    async (version) => {
      expect(
        await confirmGroupsAction(
          "fixture-run-001",
          { ...body, groups_version: version },
          key,
        ),
      ).toMatchObject({ ok: false, error: { code: "VALIDATION_ERROR" } });
      expect(fetchMock).not.toHaveBeenCalled();
    },
  );
  it("consultar usa GET sin cuerpo y no confirma ni calcula", async () => {
    fetchMock.mockResolvedValue(reply(groups()));
    expect((await readGroupsAction("fixture-run-001")).ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(
      String(fetchMock.mock.calls[0][0]).endsWith(
        "/api/v1/runs/fixture-run-001/groups",
      ),
    ).toBe(true);
    expect(fetchMock.mock.calls[0][1]).toMatchObject({
      method: "GET",
      body: undefined,
      cache: "no-store",
    });
  });
  it("envía exactamente versión, revisión y misma clave, sin mutaciones adicionales", async () => {
    fetchMock.mockImplementation(async () => reply(groups("ConfirmedGroups")));
    expect((await confirmGroupsAction("fixture-run-001", body, key)).ok).toBe(
      true,
    );
    expect((await confirmGroupsAction("fixture-run-001", body, key)).ok).toBe(
      true,
    );
    for (const [url, init] of fetchMock.mock.calls) {
      expect(
        String(url).endsWith(
          "/api/v1/runs/fixture-run-001/groups/confirmation",
        ),
      ).toBe(true);
      expect(JSON.parse(String(init?.body))).toEqual(body);
      expect(new Headers(init?.headers).get("Idempotency-Key")).toBe(key);
    }
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
  it.each(["proposed", "another_version", "another_group"])(
    "HTTP 200 con %s no acredita confirmación de la versión solicitada",
    async (failure) => {
      const value = groups(
        failure === "proposed" ? "ProposedGroups" : "ConfirmedGroups",
      );
      if (failure === "another_version") {
        value.data.proposal!.groups_version = 2;
        value.data.proposal!.confirmation!.groups_version = 2;
      }
      if (failure === "another_group") {
        value.data.proposal!.groups_id = "other-groups";
        value.data.proposal!.confirmation!.groups_id = "other-groups";
      }
      fetchMock.mockResolvedValue(reply(value));
      expect(
        await confirmGroupsAction("fixture-run-001", body, key),
      ).toMatchObject({
        ok: false,
        error: { code: "STALE_DATA" },
      });
    },
  );
  it.each([
    "foreign_run",
    "duplicate_topic",
    "unknown_topic",
    "foreign_evidence",
    "confirmation_version",
  ])(
    "una relación %s no se publica aunque la forma JSON sea válida",
    async (failure) => {
      const value = groups(
        failure === "confirmation_version"
          ? "ConfirmedGroups"
          : "ProposedGroups",
      );
      const group = value.data.proposal!;
      if (failure === "foreign_run") group.run_id = "other-run";
      if (failure === "duplicate_topic")
        group.topics.push(structuredClone(group.topics[0]));
      if (failure === "unknown_topic")
        group.assignments[0].main_topic_id = "unknown";
      if (failure === "foreign_evidence")
        group.evidence[0].video_id = "demoZ000001";
      if (failure === "confirmation_version")
        group.confirmation!.groups_version = 2;
      fetchMock.mockResolvedValue(reply(value));
      expect(await readGroupsAction("fixture-run-001")).toMatchObject({
        ok: false,
        error: { code: "STALE_DATA" },
      });
    },
  );
  it("sin propuesta conserva etapa y motivo, sin simular grupos vacíos", async () => {
    const value = groups();
    value.data.proposal = null;
    value.data.stage = {
      state: "pending",
      reason: "Material sintético aún pendiente.",
    };
    fetchMock.mockResolvedValue(reply(value));
    expect(await readGroupsAction("fixture-run-001")).toMatchObject({
      ok: true,
      value: { data: { proposal: null, stage: { state: "pending" } } },
    });
  });
  it("fallo de transporte no repite ni expone detalle privado", async () => {
    fetchMock.mockRejectedValue(new Error("SYNTHETIC_PRIVATE_FAILURE"));
    const result = await confirmGroupsAction("fixture-run-001", body, key);
    expect(result.ok).toBe(false);
    expect(JSON.stringify(result)).not.toContain("SYNTHETIC_PRIVATE_FAILURE");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe("contexto de presentación y recibo de confirmación", () => {
  it("acepta fronteras del mismo instante serializadas con Z y Bogotá", () => {
    const run = parseContractValue("RunResponse", fixture("CreatedRun")).data;
    const group = groups().data.proposal!;
    group.input_windows.previous.start_inclusive = "2026-10-03T05:00:00Z";
    expect(matchesRun(group, run)).toBe(true);
    group.versions.criteria_version = "different-criteria";
    expect(matchesRun(group, run)).toBe(false);
  });
  it.each([
    "javascript:alert(1)",
    "data:text/html,test",
    "https://user:password@example.com",
    "http://example.com",
    "invalid",
  ])("no convierte %s en un enlace de evidencia", (url) =>
    expect(sourceLink(url)).toBeNull(),
  );
  it("conserva HTTPS sin credenciales en evidencia", () => {
    expect(sourceLink("https://www.youtube.com/watch?v=demoA000001&t=3")).toBe(
      "https://www.youtube.com/watch?v=demoA000001&t=3",
    );
  });
  const receipt = {
    version: 1,
    kind: "confirm_groups",
    key,
    createdAt: "2026-10-17T12:00:00-05:00",
    operationId: null,
    runId: "fixture-run-001",
    revision: 10,
    groupsId: body.groups_id,
    groupsVersion: 1,
  };
  it("recupera cuerpo y clave de la versión exacta", () => {
    expect(parseReceipt(JSON.stringify(receipt))).toEqual(receipt);
  });
  it.each([
    { ...receipt, groupsVersion: 0 },
    { ...receipt, groupsVersion: 1.5 },
    { ...receipt, groupsId: "" },
    { ...receipt, result: "not-delivery-metadata" },
  ])("rechaza recibo de confirmación inválido", (value) => {
    expect(() => parseReceipt(JSON.stringify(value))).toThrow();
  });
});
