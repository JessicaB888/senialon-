import "server-only";
import Ajv2020 from "ajv/dist/2020";
import addFormats from "ajv-formats";
import contract from "./generated/contract.json";
import type { ApiResponse, OperationId, Schema, SchemaName } from "./types";

// Static schema compilation is cached; response payloads are never cached here.
const ajv = new Ajv2020({
  allErrors: true,
  strict: true,
  strictTypes: false,
  strictRequired: false,
  coerceTypes: false,
  useDefaults: false,
  removeAdditional: false,
  ownProperties: true,
});
addFormats(ajv, { mode: "full" });
// OpenAPI mapping is annotation. oneOf/const enforce the actual branch rules.
ajv.addKeyword({ keyword: "discriminator", schemaType: "object", valid: true });
ajv.addSchema(contract.schema);

export const contractIdentity = Object.freeze({
  version: contract.version,
  sha256: contract.sha256,
  source: contract.source,
});

type FailureReason =
  | "invalid_json"
  | "unexpected_operation"
  | "unexpected_status"
  | "schema_mismatch";

export class ContractResponseError extends Error {
  readonly name = "ContractResponseError";
  constructor(
    readonly reason: FailureReason,
    readonly issues: ReadonlyArray<{ path: string; keyword: string }> = [],
  ) {
    // Never include the raw body, JSON parser error, credentials, or field values.
    super("La respuesta no cumple el contrato de SENIALON.");
  }
}

export function parseContractValue<Name extends SchemaName>(
  name: Name,
  value: unknown,
): Schema<Name> {
  if (!Object.hasOwn(contract.schema.$defs, name)) {
    throw new ContractResponseError("schema_mismatch");
  }
  const validate = ajv.getSchema(`${contract.schema.$id}#/$defs/${name}`);
  if (!validate || !validate(value)) {
    const issues = (validate?.errors ?? []).slice(0, 8).map((issue) => ({
      path: issue.instancePath,
      keyword: issue.keyword,
    }));
    throw new ContractResponseError("schema_mismatch", issues);
  }
  // The only trust assertion is made after the canonical schema accepts data.
  return value as Schema<Name>;
}

export function decodeApiResponse<Op extends OperationId>(
  operation: Op,
  status: number,
  value: unknown,
): ApiResponse<Op> {
  if (!Object.hasOwn(contract.responses, operation)) {
    throw new ContractResponseError("unexpected_operation");
  }
  const available = contract.responses[operation];
  if (!Number.isInteger(status) || !Object.hasOwn(available, String(status))) {
    throw new ContractResponseError("unexpected_status");
  }
  const name = available[
    String(status) as keyof typeof available
  ] as SchemaName;
  const body = parseContractValue(name, value);
  return {
    kind: status >= 200 && status < 300 ? "response" : "api_error",
    status,
    body,
  } as ApiResponse<Op>;
}

export function parseApiResponse<Op extends OperationId>(
  operation: Op,
  status: number,
  text: string,
): ApiResponse<Op> {
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    throw new ContractResponseError("invalid_json");
  }
  return decodeApiResponse(operation, status, value);
}
