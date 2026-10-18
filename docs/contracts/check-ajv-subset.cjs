#!/usr/bin/env node
"use strict";

// Complementary validation only. Ajv 6 implements draft-07, not OpenAPI 3.1
// or the complete JSON Schema 2020-12 dialect used by this document.
const fs = require("node:fs");
const crypto = require("node:crypto");
const path = require("node:path");
const { isDeepStrictEqual } = require("node:util");

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

// Regression assertions for the conditions added during the G0 review.
for (const field of ["angle", "expected_contribution", "proposed_hook"]) {
  const value = cloneExample("AnalysisWithEvidence").data.adaptation;
  value[field] = null;
  reject(`complete_adaptation_without_${field}`, "Adaptation", value);
}
const noStructure = cloneExample("AnalysisWithEvidence").data.adaptation;
noStructure.proposed_structure = [];
reject("complete_adaptation_without_structure", "Adaptation", noStructure);

const noEditorialReason = cloneExample("SavedReview").data;
noEditorialReason.reason = null;
reject("decided_editorial_review_without_reason", "EditorialReview", noEditorialReason);
const noEvidenceNote = cloneExample("AnalysisWithEvidence").data.review.evidence_reviews[0];
noEvidenceNote.state = "verified_against_source";
noEvidenceNote.note = null;
reject("reviewed_evidence_without_note", "EvidenceReview", noEvidenceNote);
reject("failed_stage_without_reason", "Stage", { state: "failed", reason: null });

const noConfirmation = cloneExample("ConfirmedGroups").data.proposal;
noConfirmation.confirmation = null;
reject("confirmed_groups_without_confirmation", "Groups", noConfirmation);
const prematureConfirmation = cloneExample("ProposedGroups").data.proposal;
prematureConfirmation.confirmation = cloneExample("ConfirmedGroups").data.proposal.confirmation;
reject("proposed_groups_with_confirmation", "Groups", prematureConfirmation);

const partialWithComparable = cloneExample("PartialComparison").data;
partialWithComparable.signals = [cloneExample("Signal_2_4")];
reject("partial_comparison_with_comparable_signal", "Comparison", partialWithComparable);
const completeWithPartial = cloneExample("CompleteComparison").data;
completeWithPartial.signals = [cloneExample("SignalPartialNumeric")];
reject("complete_comparison_with_partial_signal", "Comparison", completeWithPartial);
const completePartialCoverage = cloneExample("CompleteComparison").data;
completePartialCoverage.coverage_state = "partial";
reject("complete_comparison_with_partial_coverage", "Comparison", completePartialCoverage);
const unconfirmedSignals = cloneExample("UnconfirmedComparison").data;
unconfirmedSignals.signals = [cloneExample("Signal_2_4")];
reject("unconfirmed_comparison_with_signal", "Comparison", unconfirmedSignals);
const computedWithoutConfirmation = cloneExample("CompleteComparison").data;
computedWithoutConfirmation.confirmation_id = null;
reject("computed_comparison_without_confirmation", "Comparison", computedWithoutConfirmation);

const missingAvailableSignal = cloneExample("AnalysisWithEvidence").data.signal;
missingAvailableSignal.signal = null;
reject("available_signal_reference_without_signal", "SignalReference", missingAvailableSignal);
const pendingWithSignal = cloneExample("AnalysisWithEvidence").data.signal;
pendingWithSignal.state = "pending";
reject("pending_signal_reference_with_calculation", "SignalReference", pendingWithSignal);
const unassignedWithTopic = cloneExample("AnalysisWithEvidence").data.signal;
unassignedWithTopic.state = "unassigned";
unassignedWithTopic.signal = null;
unassignedWithTopic.comparison_revision = null;
reject("unassigned_signal_reference_with_topic", "SignalReference", unassignedWithTopic);

const uncertainReplay = cloneExample("Operation_uncertain").data;
uncertainReplay.retry_policy = "same_request_after_status_read";
reject("uncertain_operation_with_normal_replay", "Operation", uncertainReplay);
const uncertainErrorReplay = cloneExample("Error_PROVIDER_RESULT_UNCERTAIN");
uncertainErrorReplay.error.retry_policy = "same_request_after_status_read";
reject("uncertain_error_with_normal_replay", "ErrorResponse", uncertainErrorReplay);

const missingDimension = cloneExample("AnalysisWithEvidence").data;
missingDimension.dimensions[1] = structuredClone(missingDimension.dimensions[0]);
reject("six_dimensions_with_duplicate_and_missing_dimension", "Analysis", missingDimension);

for (const [schema, value] of [
  ["AiDecision", cloneExample("PublicVideo180").data.ai_relevance],
  ["ValueDecision", cloneExample("Value_supported_contribution")],
  ["FitDecision", cloneExample("AnalysisWithEvidence").data.affinity.persona],
  ["PillarDecision", cloneExample("PillarOther")],
]) {
  value.explanation_source = "operator_note";
  reject(`${schema}_manual_explanation_source`, schema, value);
}

const missingRetainedId = cloneExample("AnalysisWithRetainedOperation");
missingRetainedId.operations_to_inspect[0].operation_id = null;
reject("retained_operation_reference_without_id", "AnalysisResponse", missingRetainedId);
const wrongGroupingProvider = cloneExample("GroupsWithGenerationTrace").data.proposal;
wrongGroupingProvider.generation_trace[0].provider = "jev";
reject("grouping_trace_attributed_to_jev", "Groups", wrongGroupingProvider);
const missingGenerationTrace = cloneExample("GroupsWithGenerationTrace").data.proposal;
missingGenerationTrace.generation_trace = [];
reject("nonempty_topics_without_generation_trace", "Groups", missingGenerationTrace);
const unsentWithResponse = cloneExample("JevFailureBeforeSend");
unsentWithResponse.trace.raw_response_text = "invented response";
reject("not_sent_jev_attempt_with_response", "AiAssessment", unsentWithResponse);
const unsentWithProviderId = cloneExample("JevFailureBeforeSend");
unsentWithProviderId.trace.provider_request_id = "invented-provider-id";
reject("not_sent_jev_attempt_with_provider_id", "AiAssessment", unsentWithProviderId);
const failureAsDecision = cloneExample("JevFailureAfterSend");
failureAsDecision.decision = "not_relevant";
reject("jev_failure_as_negative_decision", "AiAssessment", failureAsDecision);

const focalChecks = [];
function check(name, condition) {
  focalChecks.push({ name, passed: Boolean(condition) });
}
const emptyProposal = cloneExample("ProposedGroups").data.proposal;
emptyProposal.topics = [];
emptyProposal.assignments = [];
emptyProposal.unresolved_video_ids = [];
emptyProposal.evidence = [];
emptyProposal.generation_trace = [];
check("empty_groups_do_not_invent_generation", validators.get("Groups")(emptyProposal));

// Focal fixture integrity only: no claim of general semantic/domain validation.
const retainedAnalysis = cloneExample("AnalysisWithRetainedOperation");
const historicalAnalysis = cloneExample("AnalysisHistoricalReadOnly");
check("H01_current_snapshot_preserved", isDeepStrictEqual(retainedAnalysis.data, cloneExample("SelectedAnalysis").data));
check("H04_historical_snapshot_preserved", isDeepStrictEqual(historicalAnalysis.data, cloneExample("AudiovisualFailure").data));
check("H04_historical_current_lists_empty", historicalAnalysis.current_actions.length === 0 && historicalAnalysis.operations_to_inspect.length === 0);
check("H04_current_metadata_outside_snapshot", !Object.hasOwn(schemas.Analysis.properties, "current_actions") && !Object.hasOwn(schemas.Analysis.properties, "operations_to_inspect"));
function matchingReference(reference, operation) {
  return ["operation_id", "run_id", "analysis_id", "state", "stage", "updated_at"].every((key) => reference[key] === operation[key]);
}
check("H01_retained_analysis_reference_matches_get", matchingReference(retainedAnalysis.operations_to_inspect[0], cloneExample("RetainedAnalysisOperation").data));
check("H01_retained_analysis_version_matches_get", retainedAnalysis.data.analysis_version === cloneExample("RetainedAnalysisOperation").data.analysis_version);
check("H01_lost_run_response_reference_matches_get", matchingReference(cloneExample("RunAfterLostResponse").data.operations_to_inspect[0], cloneExample("Operation_running").data));
check("H01_uncertain_run_reference_matches_get", matchingReference(cloneExample("RunWithUncertainOperation").data.operations_to_inspect[0], cloneExample("Operation_uncertain").data));
check("H01_uncertain_without_checkpoint", cloneExample("RetainedAnalysisOperation").data.last_checkpoint === null && cloneExample("Operation_uncertain").data.last_checkpoint === null);

const references = [];
const discriminatorMappings = [];
const headerVersions = [];
const metaVersions = [];
function resolveReference(reference) {
  if (!reference.startsWith("#/")) throw new Error(`External reference outside this check: ${reference}`);
  return reference.slice(2).split("/").reduce((value, token) => {
    const key = token.replaceAll("~1", "/").replaceAll("~0", "~");
    if (!Object.hasOwn(value, key)) throw new Error(`Unresolved internal reference: ${reference}`);
    return value[key];
  }, document);
}
function inspectDocument(value) {
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) return value.forEach(inspectDocument);
  if (value.$ref) { resolveReference(value.$ref); references.push(value.$ref); }
  if (value.discriminator) {
    const propertyName = value.discriminator.propertyName;
    for (const [label, reference] of Object.entries(value.discriminator.mapping || {})) {
      const branch = resolveReference(reference);
      const discriminator = branch.properties?.[propertyName];
      check(`discriminator_${reference}_${label}`, branch.required?.includes(propertyName) && (discriminator?.const === label || discriminator?.enum?.includes(label)));
      discriminatorMappings.push(reference);
    }
  }
  if (value["X-Contract-Version"]) headerVersions.push(value["X-Contract-Version"].schema.const);
  if (Object.hasOwn(value, "contract_version")) {
    const version = value.contract_version;
    metaVersions.push(typeof version === "object" ? version.const : version);
  }
  Object.values(value).forEach(inspectDocument);
}
inspectDocument(document);
check("version_headers_consistent", headerVersions.every((version) => version === document.info.version));
check("version_meta_consistent", metaVersions.every((version) => version === document.info.version));
const operations = Object.entries(document.paths).flatMap(([route, entry]) => Object.entries(entry)
  .filter(([method]) => ["get", "post", "put", "patch", "delete", "head", "options", "trace"].includes(method))
  .map(([method, operation]) => ({ route, method, operation })));
const operationIds = operations.map(({ operation }) => operation.operationId);
check("operation_ids_unique_and_present", operationIds.every((id) => typeof id === "string" && id.length > 0) && new Set(operationIds).size === operationIds.length);
for (const { route, method, operation } of operations) {
  const placeholders = [...route.matchAll(/\{([^}]+)\}/g)].map((match) => match[1]).sort();
  const parameters = [...(document.paths[route].parameters || []), ...(operation.parameters || [])]
    .map((parameter) => parameter.$ref ? resolveReference(parameter.$ref) : parameter)
    .filter((parameter) => parameter.in === "path");
  check(`path_parameters_${method}_${route}`, parameters.every((parameter) => parameter.required === true) && isDeepStrictEqual(placeholders, parameters.map((parameter) => parameter.name).sort()));
}

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

const failures = positive.filter((item) => !item.valid).length + negatives.filter((item) => !item.rejected).length + focalChecks.filter((item) => !item.passed).length;
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
  contractVersion: document.info.version,
  integrity: { internalRefs: references.length, discriminatorMappings: discriminatorMappings.length, versionHeaders: headerVersions.length, versionMeta: metaVersions.length, paths: Object.keys(document.paths).length, operations: operations.length },
  schemaKeywords: [...schemaKeywords].sort(),
  formats: [...formats].sort(),
  ignoredAnnotation: "OpenAPI discriminator is not enforced; oneOf/const assertions are evaluated independently",
  positive: { passed: positive.filter((item) => item.valid).length, total: positive.length },
  negative: { rejected: negatives.filter((item) => item.rejected).length, total: negatives.length },
  focal: { passed: focalChecks.filter((item) => item.passed).length, total: focalChecks.length },
  positiveResults: positive,
  negativeResults: negatives,
  focalResults: focalChecks,
  limitations: [
    "No full OpenAPI document/meta-schema validation.",
    "No validation of a generated Pydantic model or TypeScript types.",
    "No FastAPI/Next.js implementation, authentication, authorization, persistence or provider integration test.",
    "Focal synthetic-fixture checks do not validate general ALG semantics, temporal arithmetic, evidence truth, or all cross-entity references.",
    "Synthetic examples and deliberately invalid mutations are contract checks, not real demonstration data.",
  ],
};
if (process.argv.includes("--summary")) {
  delete report.positiveResults;
  delete report.negativeResults;
  delete report.focalResults;
}
console.log(JSON.stringify(report, null, 2));
process.exitCode = failures === 0 ? 0 : 1;
