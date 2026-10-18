import { createHash } from "node:crypto";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import openapiTS, { astToString } from "openapi-typescript";
import { format } from "prettier";

// One-way build products; docs/contracts/openapi.json remains the only authority.
const source = new URL("../../docs/contracts/openapi.json", import.meta.url);
const output = new URL("../src/lib/api/generated/", import.meta.url);
const checking = process.argv.includes("--check");
const raw = await readFile(source);
const document = JSON.parse(raw.toString("utf8"));
const sha256 = createHash("sha256").update(raw).digest("hex");
const prefix = "#/components/schemas/";
const dialect = "https://json-schema.org/draft/2020-12/schema";

function assertLocalReferences(value) {
  if (!value || typeof value !== "object") return;
  if (Object.hasOwn(value, "$ref")) {
    if (typeof value.$ref !== "string" || !value.$ref.startsWith("#/")) {
      throw new Error(
        "La generación solo admite referencias internas; no consulta URLs externas.",
      );
    }
    let target = document;
    for (const encoded of value.$ref.slice(2).split("/")) {
      const key = decodeURIComponent(encoded)
        .replace(/~1/g, "/")
        .replace(/~0/g, "~");
      if (!target || !Object.hasOwn(target, key)) {
        throw new Error("Referencia interna sin resolver en el contrato.");
      }
      target = target[key];
    }
  }
  for (const child of Object.values(value)) assertLocalReferences(child);
}
assertLocalReferences(document);
if (
  !document.openapi.startsWith("3.1.") ||
  document.jsonSchemaDialect !== dialect
) {
  throw new Error(
    "El consumidor requiere el contrato OpenAPI 3.1 / JSON Schema 2020-12 acordado.",
  );
}

function definitionName(ref) {
  if (typeof ref !== "string" || !ref.startsWith(prefix)) {
    throw new Error("Referencia fuera de los esquemas locales del contrato.");
  }
  const name = ref.slice(prefix.length);
  if (!Object.hasOwn(document.components.schemas, name)) {
    throw new Error(`Esquema inexistente: ${name}`);
  }
  return name;
}

function project(value) {
  if (Array.isArray(value)) return value.map(project);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value).map(([key, child]) => [
      key,
      key === "$ref" ? `#/$defs/${definitionName(child)}` : project(child),
    ]),
  );
}

const responses = {};
const requests = {};
for (const [path, methods] of Object.entries(document.paths)) {
  for (const [method, operation] of Object.entries(methods)) {
    if (!operation || !Object.hasOwn(operation, "operationId")) continue;
    if (Object.hasOwn(responses, operation.operationId)) {
      throw new Error("operationId duplicado en el contrato.");
    }
    responses[operation.operationId] = Object.fromEntries(
      Object.entries(operation.responses).map(([status, response]) => {
        if (!/^[1-5]\d{2}$/.test(status)) {
          throw new Error(
            "La respuesta debe declarar un estado HTTP concreto.",
          );
        }
        const ref = response.content?.["application/json"]?.schema?.$ref;
        return [status, definitionName(ref)];
      }),
    );
    const properties = {};
    for (const location of ["path", "query", "header"]) {
      const parameters = (operation.parameters ?? []).filter(
        (item) => item.in === location,
      );
      properties[location] = {
        type: "object",
        additionalProperties: false,
        required: parameters
          .filter((item) => item.required)
          .map((item) =>
            location === "header" ? item.name.toLowerCase() : item.name,
          ),
        properties: Object.fromEntries(
          parameters.map((item) => [
            location === "header" ? item.name.toLowerCase() : item.name,
            project(item.schema),
          ]),
        ),
      };
    }
    const required = ["path", "query", "header"];
    if (operation.requestBody) {
      const body = operation.requestBody.content?.["application/json"]?.schema;
      definitionName(body?.$ref);
      properties.body = project(body);
      if (operation.requestBody.required) required.push("body");
    }
    requests[operation.operationId] = {
      method: method.toUpperCase(),
      path,
      schema: {
        type: "object",
        additionalProperties: false,
        required,
        properties,
      },
    };
  }
}

const data = {
  source: "docs/contracts/openapi.json",
  version: document.info.version,
  sha256,
  responses,
  requests,
  schema: {
    $id: "urn:senialon:frontend:contract",
    $schema: dialect,
    $defs: project(document.components.schemas),
  },
};
const ast = await openapiTS(structuredClone(document), {
  alphabetize: true,
  defaultNonNullable: false,
});
const header = `// GENERADO. No editar; ejecutar npm run contract:generate.\n// Fuente única: docs/contracts/openapi.json\n// Versión: ${document.info.version}; SHA-256: ${sha256}\n`;
const artifacts = [
  [
    "openapi.d.ts",
    await format(header + astToString(ast), { parser: "typescript" }),
  ],
  ["contract.json", await format(JSON.stringify(data), { parser: "json" })],
];
let stale = false;
if (!checking) await mkdir(output, { recursive: true });
for (const [name, content] of artifacts) {
  const file = new URL(name, output);
  if (checking) {
    const previous = await readFile(file, "utf8").catch((error) => {
      if (error.code === "ENOENT") return null;
      throw error;
    });
    if (previous !== content) {
      console.error(`Derivado desactualizado: ${fileURLToPath(file)}.`);
      stale = true;
    }
  } else {
    await writeFile(file, content);
  }
}
if (stale) {
  console.error(
    "Regenerar con npm run contract:generate y revisar los cambios del contrato.",
  );
  process.exitCode = 1;
} else {
  console.log(
    `${checking ? "Verificado" : "Generado"}: contrato ${data.version}, SHA-256 ${sha256}.`,
  );
}
