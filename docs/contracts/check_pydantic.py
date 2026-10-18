"""Projection check from the published schemas; not a generated backend model set."""
import json
import sys
from pathlib import Path
from typing import Annotated, Any, Literal, Union
from pydantic import ConfigDict, Field, TypeAdapter, create_model, AwareDatetime, AnyUrl
import pydantic

doc=json.loads(Path(sys.argv[1]).read_text())
schemas=doc['components']['schemas']
cache={}
def project(schema, name='Inline'):
    if '$ref' in schema:
        key=schema['$ref'].split('/')[-1]
        if key not in cache: cache[key]=project(schemas[key],key)
        return cache[key]
    if 'const' in schema:return Literal[schema['const']]
    if 'enum' in schema:return Literal[tuple(schema['enum'])]
    if 'oneOf' in schema or 'anyOf' in schema:
        return Union[tuple(project(x,name+'Variant'+str(i)) for i,x in enumerate(schema.get('oneOf',schema.get('anyOf',[]))))]
    kind=schema.get('type')
    if kind=='null': return type(None)
    if kind=='string':
        if schema.get('format')=='date-time': return AwareDatetime
        if schema.get('format')=='uri': return AnyUrl
        constraints={}
        for src,dest in [('minLength','min_length'),('maxLength','max_length'),('pattern','pattern')]:
            if src in schema:constraints[dest]=schema[src]
        return Annotated[str,Field(**constraints)] if constraints else str
    if kind in ('integer','number'):
        typ=int if kind=='integer' else float
        constraints={}
        for src,dest in [('minimum','ge'),('maximum','le')]:
            if src in schema:constraints[dest]=schema[src]
        return Annotated[typ,Field(**constraints)] if constraints else typ
    if kind=='boolean': return bool
    if kind=='array':
        typ=list[project(schema['items'],name+'Item')]
        constraints={}
        for src,dest in [('minItems','min_length'),('maxItems','max_length')]:
            if src in schema:constraints[dest]=schema[src]
        return Annotated[typ,Field(**constraints)] if constraints else typ
    if kind=='object':
        fields={}
        for prop,sub in schema.get('properties',{}).items():
            fields[prop]=(project(sub,name+'_'+prop), ... if prop in schema.get('required',[]) else None)
        return create_model(name,__config__=ConfigDict(extra='forbid',strict=True),**fields)
    raise ValueError(f'Unsupported projection {name}: {schema}')

for name in schemas:project({'$ref':'#/components/schemas/'+name})
failures=[]
passed=0
for name,example in doc['components']['examples'].items():
    try:
        TypeAdapter(cache[example['x-schema']]).validate_json(json.dumps(example['value']),strict=True)
        passed+=1
    except Exception as exc:failures.append({'example':name,'error':str(exc)[:1000]})

negative=[('KnownMetric',{'state':'known','value':None,'reason':None}),('UnknownMetric',{'state':'unknown','value':'0','reason':'missing'}),('ValueDecision',{**doc['components']['examples']['Value_supported_contribution']['value'],'decision':'viral'}),('PartialSignal',{**doc['components']['examples']['SignalPartialNumeric']['value'],'percentage_change':100})]
rejected=0
for schema,value in negative:
    try:TypeAdapter(cache[schema]).validate_json(json.dumps(value),strict=True)
    except Exception:rejected+=1
    else:failures.append({'negative':schema,'error':'Invalid transport example accepted'})
result={'python':sys.version.split()[0],'pydantic':pydantic.__version__,'projected_schemas':len(cache),'examples_passed':passed,'negative_cases_rejected':rejected,'failures':failures,'limitations':['Projection is a compatibility check, not production model generation.','JSON Schema if/then/allOf semantic conditions and uniqueItems are checked separately; Pydantic projection does not claim to enforce them.','No FastAPI transport, providers, persistence, authentication or ALG review was executed.']}
print(json.dumps(result,ensure_ascii=False,indent=2))
assert not failures
