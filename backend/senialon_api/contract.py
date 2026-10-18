"""Valida el subconjunto JSON Schema utilizado por la fuente OpenAPI del equipo.

Sin coerción/defaults; no implementa un validador general OpenAPI.
Las relaciones de dominio se verifican en los servicios, no aquí.
"""
import json
import hashlib
import math
import re
from datetime import datetime
from pathlib import Path
from urllib.parse import urlsplit

_ROOT = Path(__file__).resolve().parents[2]
_SOURCE = _ROOT / 'docs/contracts/openapi.json'
_GENERATED = Path(__file__).resolve().parent / 'generated/contract.json'
_artifact = json.loads(_GENERATED.read_text(encoding='utf-8'))
SOURCE_SHA256 = _artifact['sha256']
if _SOURCE.exists():
    _raw = _SOURCE.read_bytes()
    if hashlib.sha256(_raw).hexdigest() != SOURCE_SHA256:
        raise RuntimeError('Regenerar el contrato backend antes de arrancar.')
    DOCUMENT = json.loads(_raw)
else:
    # Services empaqueta backend/ sin requerir acceso al árbol externo de docs/.
    DOCUMENT = _artifact['document']
SCHEMAS = DOCUMENT['components']['schemas']
VERSION = DOCUMENT['info']['version']


class Invalid(ValueError):
    pass


def validate(schema, value, path='$'):
    if isinstance(schema, str):
        schema = SCHEMAS[schema]
    if schema is True:
        return value
    if schema is False:
        raise Invalid(path)
    def check(ok):
        if not ok:
            raise Invalid(path)
    def accepts(part):
        try:
            validate(part, value, path)
            return True
        except Invalid:
            return False
    if '$ref' in schema:
        validate(SCHEMAS[schema['$ref'].split('/')[-1]], value, path)
    if 'const' in schema:
        check(type(value) is type(schema['const']) and value == schema['const'])
    if 'enum' in schema:
        check(any(type(value) is type(x) and value == x for x in schema['enum']))
    if 'oneOf' in schema:
        check(sum(accepts(x) for x in schema['oneOf']) == 1)
    if 'anyOf' in schema:
        check(any(accepts(x) for x in schema['anyOf']))
    for part in schema.get('allOf', []):
        validate(part, value, path)
    if 'not' in schema:
        check(not accepts(schema['not']))
    if 'if' in schema:
        validate(schema.get('then' if accepts(schema['if']) else 'else', True), value, path)
    kinds = schema.get('type')
    if kinds:
        kinds = kinds if isinstance(kinds, list) else [kinds]
        types = {'null': value is None, 'boolean': type(value) is bool,
                 'integer': type(value) is int, 'number': type(value) in (int, float) and math.isfinite(value),
                 'string': isinstance(value, str), 'array': isinstance(value, list), 'object': isinstance(value, dict)}
        check(any(types.get(k, False) for k in kinds))
    if isinstance(value, dict):
        check(set(schema.get('required', [])) <= value.keys())
        properties = schema.get('properties', {})
        for key, item in value.items():
            validate(properties.get(key, schema.get('additionalProperties', True)), item, path+'.'+key)
    if isinstance(value, list):
        check(len(value) >= schema.get('minItems', 0) and len(value) <= schema.get('maxItems', math.inf))
        if schema.get('uniqueItems'):
            check(len({json.dumps(x, sort_keys=True) for x in value}) == len(value))
        for index, item in enumerate(value):
            validate(schema.get('items', True), item, path+f'[{index}]')
        if 'contains' in schema:
            found = 0
            for item in value:
                try:
                    validate(schema['contains'], item, path)
                    found += 1
                except Invalid:
                    pass
            check(found >= schema.get('minContains', 1))
    if isinstance(value, str):
        check(schema.get('minLength', 0) <= len(value) <= schema.get('maxLength', math.inf))
        if 'pattern' in schema:
            check(re.search(schema['pattern'], value) is not None)
        if schema.get('format') == 'uri':
            check(bool(urlsplit(value).scheme) and not any(x.isspace() for x in value))
        if schema.get('format') == 'date-time':
            try:
                check(datetime.fromisoformat(value.replace('Z', '+00:00')).tzinfo is not None)
            except ValueError:
                raise Invalid(path) from None
    if type(value) in (int, float):
        check(math.isfinite(value) and value >= schema.get('minimum', -math.inf) and value <= schema.get('maximum', math.inf))
    return value
