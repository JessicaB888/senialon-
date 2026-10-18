import "server-only";
import contract from "./generated/contract.json";
import type { OperationId } from "./types";

export type ResolvedOperation = {
  operation: OperationId;
  path: Record<string, string>;
  pathname: string;
};

export function resolveOperation(
  method: string,
  segments: string[],
): ResolvedOperation | null {
  // The caller cannot choose the host or send arbitrary private paths.
  if (
    segments.some(
      (value) =>
        !value || value === "." || value === ".." || /[/\\\u0000]/.test(value),
    )
  )
    return null;
  const received = ["api", "v1", ...segments];
  for (const [operation, definition] of Object.entries(contract.requests)) {
    // Optional Notion remains outside the active frontend until FE 1.12.
    if (operation === "exportNotion" || definition.method !== method) continue;
    const template = definition.path.slice(1).split("/");
    if (template.length !== received.length) continue;
    const values: Record<string, string> = {};
    const matches = template.every((part, index) => {
      const parameter = /^\{(.+)\}$/.exec(part);
      if (parameter) {
        values[parameter[1]] = received[index];
        return true;
      }
      return part === received[index];
    });
    if (matches) {
      return {
        // Keys come exclusively from the generated, locally checked contract.
        operation: operation as OperationId,
        path: values,
        pathname: received.map(encodeURIComponent).join("/"),
      };
    }
  }
  return null;
}

export function requestParameters(
  operation: OperationId,
  request: Request,
  path: Record<string, string>,
) {
  const definition = contract.requests[operation];
  const query: Record<string, string | number> = Object.create(null);
  const search = new URL(request.url).searchParams;
  const declared = definition.schema.properties.query.properties;
  for (const [key, value] of search) {
    if (search.getAll(key).length !== 1) throw new Error("Parámetro repetido.");
    const specification = Object.hasOwn(declared, key)
      ? (declared as Record<string, { type?: string }>)[key]
      : undefined;
    if (specification?.type === "integer") {
      if (!/^\d+$/.test(value) || !Number.isSafeInteger(Number(value)))
        throw new Error("Entero no válido.");
      query[key] = Number(value);
    } else {
      query[key] = value;
    }
  }
  const header = Object.fromEntries(
    Object.keys(definition.schema.properties.header.properties)
      .map((name) => [name, request.headers.get(name)] as const)
      .filter(([, value]) => value !== null),
  );
  return { path, query, header };
}
