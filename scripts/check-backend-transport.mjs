/** Smoke HTTP local contra el contrato canónico. No realiza análisis ni llamadas de pago. */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const root = new URL("../", import.meta.url);
const requireFrontend = createRequire(new URL("frontend/package.json", root));
const Ajv2020 = requireFrontend("ajv/dist/2020").default;
const addFormats = requireFrontend("ajv-formats");
const contract = JSON.parse(
  readFileSync(new URL("frontend/src/lib/api/generated/contract.json", root)),
);
const canonical = readFileSync(new URL("docs/contracts/openapi.json", root));
assert.equal(
  createHash("sha256").update(canonical).digest("hex"),
  contract.sha256,
  "Regenerar consumidor FE antes del smoke.",
);
const ajv = new Ajv2020({
  strict: true,
  strictTypes: false,
  strictRequired: false,
  ownProperties: true,
});
addFormats(ajv, { mode: "full" });
ajv.addKeyword({ keyword: "discriminator", schemaType: "object", valid: true });
ajv.addSchema(contract.schema);

export async function checkBackendTransport(base) {
  const url = new URL(base);
  assert.ok(
    ["http:", "https:"].includes(url.protocol) &&
      ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname),
    "Este smoke solo admite loopback local.",
  );
  assert.ok(
    !url.username && !url.password && !url.search && !url.hash,
    "Binding local no válido.",
  );
  assert.ok(
    process.env.DEMO_USERNAME && process.env.DEMO_PASSWORD,
    "Configurar credencial sintética local en el entorno.",
  );
  const authorization = `Basic ${Buffer.from(`${process.env.DEMO_USERNAME}:${process.env.DEMO_PASSWORD}`, "utf8").toString("base64")}`;
  const cases = [
    {
      path: "api/v1/meta",
      authorization: undefined,
      status: 401,
      schema: "ErrorResponse",
      code: "AUTH_REQUIRED",
    },
    {
      path: "api/v1/meta",
      authorization: "Basic aW52YWxpZDppbnZhbGlk",
      status: 401,
      schema: "ErrorResponse",
      code: "AUTH_REQUIRED",
    },
    {
      path: "api/v1/meta",
      authorization,
      status: 200,
      schema: "CapabilitiesResponse",
    },
    {
      path: "openapi.json",
      authorization,
      status: 404,
      schema: "ErrorResponse",
      code: "NOT_FOUND",
    },
  ];
  for (const [index, item] of cases.entries()) {
    const target = new URL(url);
    target.pathname = `${target.pathname.replace(/\/$/, "")}/${item.path}`;
    const identity = `be33-smoke:${index}`;
    const headers = { "X-Request-Id": identity };
    if (item.authorization) headers.Authorization = item.authorization;
    const response = await fetch(target, {
      headers,
      redirect: "error",
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    assert.equal(
      response.status,
      item.status,
      `Estado HTTP inesperado en caso ${index}.`,
    );
    assert.equal(response.headers.get("cache-control"), "private, no-store");
    assert.equal(response.headers.get("x-contract-version"), contract.version);
    assert.equal(response.headers.get("x-request-id"), identity);
    if (item.status === 401)
      assert.equal(
        response.headers.get("www-authenticate"),
        'Basic realm="SENIALON", charset="UTF-8"',
      );
    const value = await response.json();
    const validate = ajv.getSchema(
      `${contract.schema.$id}#/$defs/${item.schema}`,
    );
    assert.ok(
      validate(value),
      `Respuesta no conforme al contrato en caso ${index}.`,
    );
    assert.equal(value.meta.request_id, identity);
    if (item.code) assert.equal(value.error.code, item.code);
  }
  return {
    cases: cases.length,
    contract: contract.version,
    sha256: contract.sha256,
  };
}

if (
  process.argv[1] &&
  pathToFileURL(process.argv[1]).href === import.meta.url
) {
  try {
    const result = await checkBackendTransport(process.argv[2]);
    console.log(JSON.stringify({ result: "passed", ...result }));
  } catch {
    console.error(
      "Smoke de transporte fallido; revisar servidor/configuración sin publicar secretos.",
    );
    process.exitCode = 1;
  }
}
