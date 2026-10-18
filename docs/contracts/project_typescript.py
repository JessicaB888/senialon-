#!/usr/bin/env python3
"""Temporary, one-way structural TypeScript projection; not another contract.

Usage: python3 -B project_openapi_types.py /absolute/openapi.json /output/directory
Only Python stdlib is used. Runtime/semantic JSON Schema constraints remain outside
this structural TypeScript check; never treat a successful tsc as G0 approval.
"""
from __future__ import annotations

import hashlib
import json
from pathlib import Path
import re
import sys


def js(value):
    return json.dumps(value, ensure_ascii=False, separators=(",", ":"))


def project(schema):
    if schema is True:
        return "unknown"
    if schema is False:
        return "never"
    if "$ref" in schema:
        prefix = "#/components/schemas/"
        reference = schema["$ref"]
        if not reference.startswith(prefix):
            raise ValueError(f"Unsupported ref: {reference}")
        return reference.removeprefix(prefix)
    if "const" in schema:
        return js(schema["const"])
    if "enum" in schema:
        return "(" + " | ".join(js(value) for value in schema["enum"]) + ")"
    for union in ("anyOf", "oneOf"):
        if union in schema:
            return "(" + " | ".join(project(part) for part in schema[union]) + ")"
    kind = schema.get("type")
    if isinstance(kind, list):
        return "(" + " | ".join(project({**schema, "type": t}) for t in kind) + ")"
    if kind in ("integer", "number"):
        base = "number"
    elif kind == "string":
        base = "string"
    elif kind == "boolean":
        base = "boolean"
    elif kind == "null":
        base = "null"
    elif kind == "array":
        base = "Array<" + project(schema.get("items", True)) + ">"
    elif kind == "object" or "properties" in schema:
        required = set(schema.get("required", []))
        fields = [js(key) + ("" if key in required else "?") + ": " + project(value) + ";"
                  for key, value in schema.get("properties", {}).items()]
        additional = schema.get("additionalProperties")
        if isinstance(additional, dict):
            fields.append("[key: string]: " + project(additional) + ";")
        base = "{ " + " ".join(fields) + " }"
    else:
        base = "unknown"
    if "allOf" in schema:
        # Intersect structural parts only. if/then/else/contains/not remain runtime.
        parts = [base, *(project(part) for part in schema["allOf"])]
        return "(" + " & ".join(parts) + ")"
    return base


def main():
    source = Path(sys.argv[1]).resolve()
    output = Path(sys.argv[2]).resolve()
    output.mkdir(parents=True, exist_ok=True)
    document = json.loads(source.read_text())
    schemas = document["components"]["schemas"]
    examples = document["components"]["examples"]
    for name in schemas:
        if not re.fullmatch(r"[A-Za-z_$][A-Za-z0-9_$]*", name):
            raise ValueError(f"Unsupported identifier: {name}")
    header = (
        "// TEMPORARY AUDIT OUTPUT — generated directly from OpenAPI; do not commit.\n"
        f"// Source: {source}\n"
        f"// Contract version: {document['info']['version']}\n"
        "// Structural types only; no runtime or semantic validation is implied.\n"
        "export {};\n\n"
    )
    aliases = "\n".join("type " + name + " = " + project(schema) + ";" for name, schema in schemas.items())
    fixture_lines = []
    for index, (name, example) in enumerate(examples.items(), start=1):
        target = example["x-schema"]
        if target not in schemas:
            raise ValueError(f"Unknown example schema: {target}")
        fixture_lines.append(f"// Synthetic example {index}: {name}")
        fixture_lines.append(f"const fixture_{index}: {target} = {js(example['value'])};")
    positive = header + aliases + "\n\n" + "\n".join(fixture_lines) + "\n"
    (output / "positive.ts").write_text(positive)
    negatives = [
        ("unknown metric cannot contain numeric zero", "const invalid_unknown_metric: UnknownMetric = {state:'unknown',value:0,reason:'unavailable'};"),
        ("known metric preserves source decimal string, not a JS number", "const invalid_known_metric: KnownMetric = {state:'known',value:0,reason:null};"),
        ("unknown count cannot become known zero", "declare const unknown_count_base: UnknownCount; const invalid_unknown_count: UnknownCount = {...unknown_count_base,total_count:0};"),
        ("partial comparison cannot expose a numeric percentage", "declare const partial_base: PartialSignal; const invalid_partial_percentage: PartialSignal = {...partial_base,percentage_change:100};"),
        ("partial comparison cannot be labelled as a new occurrence", "declare const partial_label_base: PartialSignal; const invalid_partial_kind: PartialSignal = {...partial_label_base,kind:'new_in_corpus'};"),
        ("editorial decision is constrained to draft contract enum", "declare const editorial_base: EditorialReview; const invalid_editorial: EditorialReview = {...editorial_base,decision:'auto_approved'};"),
        ("value judgement is constrained to its independent enum", "declare const value_base: ValueDecision; const invalid_value: ValueDecision = {...value_base,decision:'viral'};"),
    ]
    # Put each declaration on one line so @ts-expect-error targets that precise check.
    guarded = ["// " + reason + "\n// @ts-expect-error — deliberately invalid structural fixture\n" + statement for reason, statement in negatives]
    (output / "negative.ts").write_text(header + aliases + "\n\n" + "\n".join(guarded) + "\n")
    (output / "negative-unguarded.ts").write_text(header + aliases + "\n\n" + "\n".join(statement for _, statement in negatives) + "\n")
    print(json.dumps({
        "source": str(source), "sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
        "contract_version": document["info"]["version"], "schemas": len(schemas),
        "positive_examples": len(examples), "negative_cases": len(negatives),
        "outputs": [str(output / name) for name in ("positive.ts", "negative.ts", "negative-unguarded.ts")],
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
