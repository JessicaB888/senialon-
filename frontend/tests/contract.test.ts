import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import {
  ContractResponseError,
  contractIdentity,
  decodeApiResponse,
  parseApiResponse,
  parseContractValue,
} from "@/lib/api/validation";
import type { OperationId, SchemaName } from "@/lib/api/types";
import derived from "@/lib/api/generated/contract.json";

const raw = readFileSync(
  new URL("../../docs/contracts/openapi.json", import.meta.url),
);
const canonical = JSON.parse(raw.toString()) as {
  info: { version: string };
  components: {
    schemas: Record<SchemaName, unknown>;
    examples: Record<string, { "x-schema": SchemaName; value: unknown }>;
  };
};

function example(name: string): unknown {
  if (!Object.hasOwn(canonical.components.examples, name)) {
    throw new Error(`Falta ejemplo canónico: ${name}`);
  }
  return structuredClone(canonical.components.examples[name].value);
}

function replace(name: string, path: string, value: unknown): unknown {
  const root = example(name);
  const parts = path.split(".");
  let cursor = root as Record<string, unknown>;
  for (const key of parts.slice(0, -1)) {
    cursor = cursor[key] as Record<string, unknown>;
  }
  cursor[parts.at(-1)!] = value;
  return root;
}

describe("fuente única del consumidor", () => {
  it("compila los 94 esquemas, incluso los que no tienen ejemplo propio", () => {
    for (const name of Object.keys(canonical.components.schemas)) {
      try {
        parseContractValue(name as SchemaName, null);
      } catch (error) {
        // A schema rejection is expected; compilation/reference errors are not.
        expect(error).toBeInstanceOf(ContractResponseError);
      }
    }
  });
  it("conserva versión, hash, 94 esquemas y 18 operaciones de la fuente", () => {
    expect(contractIdentity).toEqual({
      version: canonical.info.version,
      sha256: createHash("sha256").update(raw).digest("hex"),
      source: "docs/contracts/openapi.json",
    });
    expect(Object.keys(derived.schema.$defs)).toHaveLength(94);
    expect(Object.keys(derived.responses)).toHaveLength(18);
  });

  it.each(Object.entries(canonical.components.examples))(
    "acepta el ejemplo SINTÉTICO canónico %s sin modificarlo",
    (_name, fixture) => {
      const input = structuredClone(fixture.value);
      const before = structuredClone(input);
      expect(parseContractValue(fixture["x-schema"], input)).toBe(input);
      expect(input).toEqual(before);
    },
  );
});

describe("desconocido distinto de cero", () => {
  it("conserva una métrica conocida como cadena, incluso fuera del rango seguro de JS", () => {
    for (const value of ["0", "90071992547409931234567890"]) {
      const metric = parseContractValue("Metric", {
        state: "known",
        value,
        reason: null,
      });
      expect(metric.value).toBe(value);
    }
  });

  it("conserva la ausencia con su razón, sin convertirla en cero", () => {
    const metric = parseContractValue("Metric", {
      state: "unknown",
      value: null,
      reason: "No disponible",
    });
    expect(metric).toEqual({
      state: "unknown",
      value: null,
      reason: "No disponible",
    });
    expect(() =>
      parseContractValue("Metric", { ...metric, value: "0" }),
    ).toThrow(ContractResponseError);
  });

  it("rechaza coerción, defaults y propiedades adicionales sin limpiar el cuerpo", () => {
    for (const value of [0, null, false]) {
      expect(() =>
        parseContractValue("Metric", { state: "known", value, reason: null }),
      ).toThrow();
    }
    expect(() =>
      parseContractValue("Metric", { state: "known", value: "0" }),
    ).toThrow();
    const extra = {
      state: "known",
      value: "0",
      reason: null,
      unexpected: true,
    };
    expect(() => parseContractValue("Metric", extra)).toThrow();
    expect(extra.unexpected).toBe(true);
  });

  it("mantiene total_count desconocido aunque se observen cero IDs", () => {
    const count = {
      state: "unknown",
      total_count: null,
      reason: "Fuente pendiente",
      observed_count: 0,
      video_ids: [],
      by_source: [],
    };
    expect(parseContractValue("Count", count).total_count).toBeNull();
    expect(() =>
      parseContractValue("Count", { ...count, total_count: 0 }),
    ).toThrow();
    expect(
      parseContractValue("Count", {
        ...count,
        state: "known",
        reason: null,
        total_count: 0,
      }).total_count,
    ).toBe(0);
  });

  it.each([
    "Signal_2_4",
    "Signal_2_0",
    "Signal_0_3",
    "Signal_0_0",
    "SignalUnknownBaseline",
    "SignalPartialNumeric",
  ])("preserva la señal %s calculada por el backend", (name) =>
    expect(parseContractValue("TopicSignal", example(name))).toEqual(
      example(name),
    ),
  );

  it.each([
    "Signal_0_3",
    "Signal_0_0",
    "SignalUnknownBaseline",
    "SignalPartialNumeric",
  ])("rechaza un porcentaje inventado en %s", (name) =>
    expect(() =>
      parseContractValue(
        "TopicSignal",
        replace(name, "percentage_change", 100),
      ),
    ).toThrow(),
  );
});

describe("restricciones del contrato durante la ejecución", () => {
  const cases: Array<[string, SchemaName, string, string, unknown]> = [
    [
      "fecha inválida",
      "PublicationResponse",
      "PublicVideo180",
      "data.captured_at",
      "not-a-date",
    ],
    [
      "fecha imposible con formato y zona aparentes",
      "PublicationResponse",
      "PublicVideo180",
      "data.captured_at",
      "2026-02-30T12:00:00-05:00",
    ],
    [
      "fecha sin zona",
      "PublicationResponse",
      "PublicVideo180",
      "data.captured_at",
      "2026-10-17T12:00:00",
    ],
    [
      "URI inválida",
      "PublicationResponse",
      "PublicVideo180",
      "data.url",
      "not a uri",
    ],
    [
      "duración elegible superior a 180",
      "PublicationResponse",
      "PublicVideo180",
      "data.duration.seconds",
      181,
    ],
    [
      "versión no acordada",
      "PublicationResponse",
      "PublicVideo180",
      "meta.contract_version",
      "9.0.0",
    ],
    [
      "valor respaldado sin evidencia",
      "ValueAssessment",
      "Value_supported_contribution",
      "evidence_ids",
      [],
    ],
    [
      "dimensión completa sin evidencia",
      "AnalysisResponse",
      "AnalysisWithEvidence",
      "data.dimensions.0.evidence_ids",
      [],
    ],
    [
      "adaptación completa sin aporte",
      "AnalysisResponse",
      "AnalysisWithEvidence",
      "data.adaptation.expected_contribution",
      null,
    ],
    [
      "adaptación completa sin estructura",
      "AnalysisResponse",
      "AnalysisWithEvidence",
      "data.adaptation.proposed_structure",
      [],
    ],
    [
      "decisión editorial sin motivo",
      "ReviewResponse",
      "SavedReview",
      "data.reason",
      null,
    ],
    [
      "grupos confirmados sin confirmación",
      "GroupsResponse",
      "ConfirmedGroups",
      "data.proposal.confirmation",
      null,
    ],
    [
      "temas sin procedencia de generación",
      "GroupsResponse",
      "GroupsWithGenerationTrace",
      "data.proposal.generation_trace",
      [],
    ],
    [
      "fallo JEV convertido en decisión",
      "AiAssessment",
      "JevFailureAfterSend",
      "decision",
      "not_relevant",
    ],
    [
      "intento no enviado con respuesta",
      "AiAssessment",
      "JevFailureBeforeSend",
      "trace.raw_response_text",
      "inventada",
    ],
    [
      "comparación completa con cobertura parcial",
      "ComparisonResponse",
      "CompleteComparison",
      "data.coverage_state",
      "partial",
    ],
    [
      "comparación completa sin confirmación",
      "ComparisonResponse",
      "CompleteComparison",
      "data.confirmation_id",
      null,
    ],
    [
      "inquietud sin ID recuperable",
      "ErrorResponse",
      "Error_PROVIDER_RESULT_UNCERTAIN",
      "error.operation_id",
      null,
    ],
    [
      "incertidumbre habilitando reintento",
      "ErrorResponse",
      "Error_PROVIDER_RESULT_UNCERTAIN",
      "error.retry_policy",
      "same_request_after_status_read",
    ],
  ];
  it.each(cases)("rechaza %s", (_title, schema, fixture, path, value) => {
    expect(() =>
      parseContractValue(schema, replace(fixture, path, value)),
    ).toThrow(ContractResponseError);
  });

  it("permite nota null pendiente y exige nota al revisar la evidencia", () => {
    const pending = {
      evidence_id: "fixture-text-demoB000001",
      state: "pending_review",
      note: null,
    };
    expect(parseContractValue("EvidenceReview", pending)).toEqual(pending);
    expect(() =>
      parseContractValue("EvidenceReview", {
        ...pending,
        state: "verified_against_source",
      }),
    ).toThrow();
  });
});

describe("respuestas por operación y estado HTTP", () => {
  it("rechaza claves heredadas como operaciones o esquemas", () => {
    expect(() =>
      decodeApiResponse("toString" as OperationId, 200, null),
    ).toThrow(ContractResponseError);
    expect(() => parseContractValue("constructor" as SchemaName, null)).toThrow(
      ContractResponseError,
    );
  });
  it.each(
    Object.entries(derived.responses).flatMap(([operation, statuses]) =>
      Object.entries(statuses).map(([status, schema]) => ({
        operation,
        status: Number(status),
        schema,
      })),
    ),
  )(
    "valida $operation / $status con su esquema declarado",
    ({ operation, status, schema }) => {
      const fixture = Object.values(canonical.components.examples).find(
        (entry) => entry["x-schema"] === schema,
      );
      if (fixture) {
        const response = decodeApiResponse(
          operation as OperationId,
          status,
          structuredClone(fixture.value),
        );
        expect(response.status).toBe(status);
        expect(response.kind).toBe(status < 300 ? "response" : "api_error");
      } else {
        // Notion success has no canonical fixture: prove lookup rejects a wrong body.
        expect(() =>
          decodeApiResponse(operation as OperationId, status, null),
        ).toThrow(ContractResponseError);
      }
    },
  );

  it("rechaza un cuerpo de otra operación, estados imprevistos y HTML de error", () => {
    expect(() =>
      decodeApiResponse("getVideo", 200, example("CreatedRun")),
    ).toThrow();
    expect(() =>
      decodeApiResponse("getVideo", 418, example("Error_INTERNAL_ERROR")),
    ).toThrow();
    expect(() =>
      parseApiResponse("getVideo", 500, "<html>Error</html>"),
    ).toThrow(ContractResponseError);
  });

  it("un error contractual conserva etapa, motivo, operación y política de reintento", () => {
    const response = decodeApiResponse(
      "advanceRun",
      409,
      example("Error_PROVIDER_RESULT_UNCERTAIN"),
    );
    expect(response.kind).toBe("api_error");
    expect(response.body).toEqual(example("Error_PROVIDER_RESULT_UNCERTAIN"));
  });

  it.each(["Operation_blocked", "Operation_failed", "Operation_uncertain"])(
    "un HTTP 200 conserva el estado de dominio de %s",
    (fixture) => {
      const response = decodeApiResponse("advanceRun", 200, example(fixture));
      expect(response.kind).toBe("response");
      expect(response.body).toEqual(example(fixture));
    },
  );

  it("conserva operaciones recuperables y snapshots históricos con acciones actuales vacías", () => {
    const run = decodeApiResponse(
      "getRun",
      200,
      example("RunAfterLostResponse"),
    );
    const history = decodeApiResponse(
      "getAnalysis",
      200,
      example("AnalysisHistoricalReadOnly"),
    );
    expect(run.body).toEqual(example("RunAfterLostResponse"));
    if (history.kind === "response") {
      expect(history.body.current_actions).toEqual([]);
      expect(history.body.operations_to_inspect).toEqual([]);
    }
  });

  it("no expone cuerpos o errores del parser en los fallos de contrato", () => {
    const secret = "SENTINELA_PRIVADA_NO_REGISTRAR";
    for (const input of [
      `{"token":"${secret}`,
      JSON.stringify({ extra_unexpected: secret }),
    ]) {
      try {
        parseApiResponse("getVideo", 200, input);
        expect.unreachable("Debió rechazar el cuerpo");
      } catch (error) {
        expect(error).toBeInstanceOf(ContractResponseError);
        expect(String(error) + JSON.stringify(error)).not.toContain(secret);
      }
    }
  });

  it("no realiza llamadas ni reintentos al validar o leer JSON", () => {
    const fetch = vi.spyOn(globalThis, "fetch");
    parseApiResponse("getRun", 200, JSON.stringify(example("CreatedRun")));
    parseApiResponse(
      "advanceRun",
      409,
      JSON.stringify(example("Error_PROVIDER_RESULT_UNCERTAIN")),
    );
    expect(fetch).not.toHaveBeenCalled();
    fetch.mockRestore();
  });
});
