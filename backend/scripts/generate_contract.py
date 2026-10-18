"""Proyección de empaquetado, derivada de la única fuente OpenAPI del equipo."""

import hashlib
import json
import sys
from pathlib import Path

BACKEND = Path(__file__).resolve().parents[1]
SOURCE = BACKEND.parent / "docs/contracts/openapi.json"
OUTPUT = BACKEND / "senialon_api/generated/contract.json"


def render():
    raw = SOURCE.read_bytes()
    document = json.loads(raw)
    return json.dumps({
        "source": "docs/contracts/openapi.json",
        "sha256": hashlib.sha256(raw).hexdigest(),
        "document": {"info": {"version": document["info"]["version"]},
                     "paths": document["paths"],
                     "components": {"schemas": document["components"]["schemas"]}},
    }, ensure_ascii=False, indent=2) + "\n"


if __name__ == "__main__":
    expected = render()
    if "--check" in sys.argv:
        if not OUTPUT.exists() or OUTPUT.read_text(encoding="utf-8") != expected:
            raise SystemExit("Contrato derivado desactualizado: ejecutar python scripts/generate_contract.py.")
        print("Contrato backend derivado verificado.")
    else:
        OUTPUT.parent.mkdir(parents=True, exist_ok=True)
        OUTPUT.write_text(expected, encoding="utf-8")
        print("Contrato backend derivado generado.")
