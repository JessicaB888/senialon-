#!/usr/bin/env node
"use strict";

// Complementary validation only. Ajv 6 implements draft-07, not OpenAPI 3.1
// or the complete JSON Schema 2020-12 dialect used by this document.
const fs = require("node:fs");
const crypto = require("node:crypto");
const path = require("node:path");

const [documentPath, ajvModulePath] = process.argv.slice(2);
if (!documentPath || !ajvModulePath) {
  console.error("Usage: node check-ajv-subset.cjs <openapi.json> <ajv/lib/ajv.js>");
  process.exit(2);
}
const Ajv = require(path.resolve(ajvModulePath));
const ajvVersion = require(path.resolve(path.dirname(ajvModulePath), "../package.json")).version;
const raw = fs.readFileSync(documentPath);
const document = JSON.parse(raw.toString("utf8"));
const ajv = new Ajv({
  allErrors: true,
  validateSchema: false,
  coerceTypes: false,
  useDefaults: false,
  removeAdditional: false,
  format: "full",
  jsonPointers: true,
});
const rootId = "urn:senialon:contract-check";
ajv.addSchema(document, rootId);
const examples = document.components.examples;
const schemas = document.components.schemas;
const validators = new Map();
for (const name of Object.keys(schemas)) {
  validators.set(name, ajv.getSchema(`${rootId}#/components/schemas/${name}`));
  if (typeof validators.get(name) !== "function") throw new Error(`Cannot compile schema ${name}`);
}

const positive = [];
for (const [name, example] of Object.entries(examples)) {
  const schemaName = example["x-schema"];
  const validate = validators.get(schemaName);
  if (!validate) throw new Error(`Example ${name}: unknown x-schema ${schemaName}`);
  const valid = validate(example.value);
  positive.push({ name, schema: schemaName, valid, errors: valid ? [] : structuredClone(validate.errors) });
}

function cloneExample(name) {
  if (!examples[name]) throw new Error(`Missing prerequisite example ${name}`);
  return structuredClone(examples[name].value);
}

const negatives = [];
function reject(name, schema, value) {
  const validate = validators.get(schema);
  if (!validate) throw new Error(`Unknown negative-test schema ${schema}`);
  const unexpectedlyAccepted = validate(value);
  negatives.push({
    name,
    schema,
    rejected: !unexpectedlyAccepted,
    errors: unexpectedlyAccepted ? [] : structuredClone(validate.errors),
  });
}

const partialPercentage = cloneExample("SignalPartialNumeric");
partialPercentage.percentage_change = 100;
reject("partial_signal_with_percentage", "TopicSignal", partialPercentage);

const unsupportedValue = cloneExample("Value_supported_contribution");
unsupportedValue.evidence_ids = [];
reject("supported_value_without_evidence", "ValueAssessment", unsupportedValue);

const emptyDimension = cloneExample("AnalysisWithEvidence").data.dimensions[0];
emptyDimension.evidence_ids = [];
reject("complete_dimension_without_evidence", "ObservationDimension", emptyDimension);

const inProgress = cloneExample("Error_OPERATION_IN_PROGRESS");
inProgress.error.operation_id = null;
reject("in_progress_without_operation_id", "ErrorResponse", inProgress);

const uncertain = cloneExample("Error_PROVIDER_RESULT_UNCERTAIN");
uncertain.error.operation_id = null;
reject("uncertain_without_operation_id", "ErrorResponse", uncertain);

const longEligible = cloneExample("PublicVideo180");
longEligible.data.duration.seconds = 181;
reject("eligible_video_181_seconds", "PublicationResponse", longEligible);

const badDate = cloneExample("PublicVideo180");
badDate.data.captured_at = "not-a-date";
reject("invalid_date_time", "PublicationResponse", badDate);

const badUri = cloneExample("PublicVideo180");
badUri.data.url = "not a uri";
reject("invalid_uri", "PublicationResponse", badUri);

const extraField = cloneExample("PublicVideo180");
extraField.data.extra_unexpected = true;
reject("additional_property_on_closed_publication", "PublicationResponse", extraField);

const schemaKeywords = new Set();
const formats = new Set();
function inspectSchema(schema) {
  if (typeof schema !== "object" || schema === null || Array.isArray(schema)) return;
  for (const key of Object.keys(schema)) schemaKeywords.add(key);
  if (schema.format) formats.add(schema.format);
  for (const mapping of [schema.properties, schema.patternProperties, schema.definitions, schema.$defs]) {
    if (mapping) for (const child of Object.values(mapping)) inspectSchema(child);
  }
  for (const key of ["items", "additionalProperties", "contains", "propertyNames", "not", "if", "then", "else"]) {
    if (Array.isArray(schema[key])) schema[key].forEach(inspectSchema);
    else inspectSchema(schema[key]);
  }
  for (const key of ["allOf", "anyOf", "oneOf", "prefixItems"]) {
    if (Array.isArray(schema[key])) schema[key].forEach(inspectSchema);
  }
}
Object.values(schemas).forEach(inspectSchema);

const failures = positive.filter((item) => !item.valid).length + negatives.filter((item) => !item.rejected).length;
const report = {
  status: failures === 0 ? "PASS_SUBSET_CHECK" : "FAIL_SUBSET_CHECK",
  document: path.resolve(documentPath),
  sha256: crypto.createHash("sha256").update(raw).digest("hex"),
  node: process.version,
  ajv: ajvVersion,
  declaredOpenAPI: document.openapi,
  declaredDialect: document.jsonSchemaDialect,
  validationScope: "Ajv 6 draft-07-compatible schema assertions; not complete OpenAPI 3.1 or JSON Schema 2020-12 validation",
  options: { validateSchema: false, coerceTypes: false, useDefaults: false, removeAdditional: false, format: "full" },
  compiledSchemas: validators.size,
  schemaKeywords: [...schemaKeywords].sort(),
  formats: [...formats].sort(),
  ignoredAnnotation: "OpenAPI discriminator is not enforced; oneOf/const assertions are evaluated independently",
  positive: { passed: positive.filter((item) => item.valid).length, total: positive.length },
  negative: { rejected: negatives.filter((item) => item.rejected).length, total: negatives.length },
  positiveResults: positive,
  negativeResults: negatives,
  limitations: [
    "No full OpenAPI document/meta-schema validation.",
    "No validation of a generated Pydantic model or TypeScript types.",
    "No FastAPI/Next.js implementation, authentication, authorization, persistence or provider integration test.",
    "No approval of ALG rubric, grouping semantics, temporal arithmetic, evidence truth, or cross-entity references.",
    "Synthetic examples and deliberately invalid mutations are contract checks, not real demonstration data.",
  ],
};
if (process.argv.includes("--summary")) {
  delete report.positiveResults;
  delete report.negativeResults;
}
console.log(JSON.stringify(report, null, 2));
process.exitCode = failures === 0 ? 0 : 1;
