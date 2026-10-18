# Consumo del contrato — FE 1.1

**Estado:** ambos hitos de FE 1.1 completos: [revisión documental](../docs/REVISION_CONTRATO_FRONTEND.md) y consumidor técnico local. **Fecha:** 18 de octubre de 2026, America/Bogota. El transporte HTTP, el acceso compartido y la conexión con FastAPI se implementan después, en FE 1.3 con BE 3.3/3.6.

La única autoridad sigue siendo [`docs/contracts/openapi.json`](../docs/contracts/openapi.json), versión **1.0.0**, SHA-256 **`d7e0b018263658e686da00997ddffbd19ba96e6e73de5b08e3f8917b95375956`**. Esta tarea no modifica el contrato ni introduce rutas, campos o enums de API.

## Archivos y regeneración

| Archivo                                                                      | Función                                                                                                                     |
| ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| [`scripts/generate-contract.mjs`](scripts/generate-contract.mjs)             | Deriva tipos y material de validación exclusivamente de la fuente local.                                                    |
| [`src/lib/api/generated/openapi.d.ts`](src/lib/api/generated/openapi.d.ts)   | Tipos de esquemas, rutas, operaciones, parámetros y respuestas. Generado con `openapi-typescript` 7.13.0; no editar a mano. |
| [`src/lib/api/generated/contract.json`](src/lib/api/generated/contract.json) | Esquemas derivados y relación operación/estado/esquema, con versión y hash. No contiene los ejemplos de demo.               |
| [`src/lib/api/types.ts`](src/lib/api/types.ts)                               | Alias consumidores y unión discriminada por respuesta HTTP, derivados de los tipos anteriores.                              |
| [`src/lib/api/validation.ts`](src/lib/api/validation.ts)                     | Validación de valores y respuestas JSON; módulo marcado `server-only`.                                                      |
| [`tests/contract.test.ts`](tests/contract.test.ts)                           | Pruebas del consumidor con ejemplos canónicos sintéticos y mutaciones negativas.                                            |
| [`tests/contract-types.ts`](tests/contract-types.ts)                         | Estrechamiento de tipos y cinco negativos estáticos comprobados por TypeScript.                                             |
| [`scripts/check-contract-types.mjs`](scripts/check-contract-types.mjs)       | Comprueba los 74 ejemplos contra los tipos generados en memoria, sin copiar fixtures a otra fuente.                         |

Desde `frontend/`:

```sh
npm run contract:generate
npm run contract:check
npm run test
npm run test:types
npm run typecheck
npm run lint
npm run format:check
npm run build
```

`contract:generate` escribe derivados; `contract:check` los compara sin modificarlos y falla ante diferencias o archivos ausentes. El `prebuild` ejecuta esa comprobación: un cambio de contrato exige regenerar y revisar antes de construir. La comprobación de desactualización se probó añadiendo temporalmente una diferencia al tipo derivado: devolvió código 1 y el archivo se restauró. La fuente canónica no se modificó.

BE debe conservar el checkout completo en el contexto de build: el generador lee `../docs/contracts/openapi.json` desde el servicio `frontend/`. Los derivados no pasan a ser una segunda autoridad ni se actualizan silenciosamente en producción.

## Validación durante la ejecución

Se usa Ajv **8.20.0** con su entrada **2020-12** y `ajv-formats` **3.0.1** en modo completo. La proyección conserva las restricciones del contrato y solo reubica referencias de `components.schemas` a `$defs`. El discriminador OpenAPI se conserva como anotación; `oneOf` y las constantes de las ramas verifican sus variantes. No se convierte el contrato a draft-07 ni se utiliza la antigua comprobación documental como validador del producto. Referencias: [JSON Schema en Ajv](https://ajv.js.org/json-schema.html), [API de generación de tipos](https://openapi-ts.dev/node).

La validación no aplica coerción, valores por defecto o eliminación de propiedades. Rechaza campos adicionales, valores con tipos incorrectos, fechas/URI inválidas y las condiciones `if/then`, `contains`, unicidad y límites presentes en la fuente. Los validadores se reutilizan durante la vida del módulo; no se almacenan respuestas de usuarios en caché. La compilación y los esquemas permanecen en servidor; los componentes cliente pueden importar únicamente los tipos con `import type`.

- `parseContractValue(nombre, valorDesconocido)` devuelve un valor tipado únicamente después de validar su esquema.
- `decodeApiResponse(operación, estadoHTTP, valorDesconocido)` selecciona el esquema declarado para esa pareja. Devuelve `kind: response` para HTTP 2xx o `kind: api_error` para un error HTTP con cuerpo contractual válido.
- `parseApiResponse(operación, estadoHTTP, texto)` añade el análisis JSON y rechaza HTML, JSON incompleto u otro cuerpo inválido.
- `ContractResponseError` distingue JSON inválido, operación/estado inesperados o incumplimiento del esquema. Es un error local del consumidor, no un código añadido a la API. Conserva como máximo ocho rutas/palabras clave de validación; no incorpora cuerpos, valores de campos ni mensajes originales del parser.

Ejemplo de consumo dentro de un módulo de servidor, sin realizar una solicitud:

```ts
import { parseApiResponse } from "@/lib/api/validation";

export function readAnalysis(status: number, text: string) {
  const result = parseApiResponse("getAnalysis", status, text);
  if (result.kind === "api_error") {
    return { error: result.body.error };
  }
  return {
    analysis: result.body.data,
    currentActions: result.body.current_actions,
    operationsToInspect: result.body.operations_to_inspect,
  };
}
```

Un HTTP 200 no declara completo el análisis: sus etapas pueden estar bloqueadas, fallidas o inciertas. Se conserva el estado recibido. En una ficha se usan `current_actions` del envelope; las acciones del snapshot histórico no habilitan mutaciones actuales. Un fallo del contrato tampoco debe convertirse en cero, descarte o reintento automático.

## Evidencia local de cierre

| Comprobación            | Resultado                                                                                                                                                                                |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Identidad de fuente     | Versión/hash coincidentes; 94 esquemas y 18 operaciones.                                                                                                                                 |
| Compilación de esquemas | Los 94 esquemas se compilan con Ajv 2020-12, incluidos los que no tienen ejemplo propio.                                                                                                 |
| Ejemplos                | Los 74 ejemplos canónicos se aceptan sin mutación y pasan la comprobación estática contra los tipos generados. Son sintéticos; no son resultados de SENIALON.                            |
| Matriz de respuestas    | Se comprueban las 131 parejas operación/estado declaradas; un cuerpo de otra operación y un estado inesperado se rechazan. Notion sigue diferido: sus respuestas de éxito no se simulan. |
| Casos de datos          | Cero conocido, desconocido con null, estadísticas como cadenas grandes, base cero, cobertura parcial, etapas fallidas/inciertas, trazas JEV, fuentes y versiones históricas.             |
| Negativos               | Porcentaje improcedente, metadatos inválidos, falta de evidencia/motivo/nota, campos extra, versión ajena, confirmación ausente y reintento incompatible con incertidumbre.              |
| Tests                   | **250 pruebas Vitest aprobadas**; cinco negativos estáticos y estrechamiento de tipos comprobados con `tsc`.                                                                             |
| Calidad                 | TypeScript, ESLint, Prettier, `contract:check` y build aprobados.                                                                                                                        |
| Dependencias            | Auditoría de producción: **0 vulnerabilidades**. Persisten las cinco alertas de herramientas de desarrollo ya documentadas.                                                              |

La prueba inicial de nota de evidencia se corrigió para distinguir una revisión pendiente —que admite null— de una evidencia revisada —que exige nota—. Los negativos estáticos se alinearon con sus campos después del formato para conservar su comprobación efectiva.

## Límites y entrega a FE 1.3

La validación de esquemas no prueba sumas entre entidades, fórmulas, correspondencia general de IDs/versiones, cobertura real, autorización, persistencia ni fidelidad audiovisual. Esas invariantes siguen perteneciendo a ALG/BE y a las pruebas integradas. La matriz comprueba el esquema de cada respuesta; no sustituye la política del servidor para elegir el código HTTP/error apropiado.

FE 1.3 conectará este consumidor a Route Handlers protegidos y al binding autenticado. Debe comprobar credencial, origen y cabeceras privadas/versionadas; tratar un `ContractResponseError` sin exponer el cuerpo recibido y sin reintentar consumos. No usar un cast `as` sobre JSON sin validar. Ninguna función de este módulo hace llamadas, recolección, pagos, guardados o reintentos.

BE 3.2 sigue pendiente de verificar las cuentas antes de pruebas pagadas. El código y los tests de esta entrega no consumieron APIs del producto. La suite E2E protegida y el cierre de FE 1.10 permanecen pendientes.
