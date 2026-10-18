# Validación del contrato de integración 1.0.0

**Contrato comprobado:** [openapi.json](openapi.json), `1.0.0`. Fecha: 17 de octubre de 2026, America/Bogota. Se verificó la fuente final con el [acuerdo documental autorizado](README.md), la [revisión semántica asistida ALG](../REVISION_SEMANTICA_ALG.md) y la [revisión de consumo FE](../REVISION_CONTRATO_FRONTEND.md). Este registro acredita las comprobaciones indicadas; no una implementación ni firmas o aprobaciones nominales de otros integrantes. G0 contractual queda cerrado documentalmente; las pruebas de integración y el segundo hito técnico de FE 1.1 siguen pendientes.

| Comprobación | Resultado |
| --- | --- |
| JSON, referencias e identificadores | 94 esquemas, 74 ejemplos, 18 operaciones en 15 rutas; **491 referencias internas y 43 mappings de discriminadores resolubles**. Los 18 `operationId` son únicos; todos los parámetros de ruta requeridos coinciden con sus placeholders. Cada `x-schema` de ejemplo existe. Cada mapping apunta a una rama con discriminador requerido y `const`/`enum` correspondiente. |
| Versión de transporte | `info.version`, los **131 headers `X-Contract-Version`** y las **51 apariciones de `contract_version`** en el esquema o los ejemplos corresponden a `1.0.0`. Estas cifras cuentan apariciones, no recursos distintos. La fuente final registra `x-contract-status=agreed` y `x-agreed-enums`; sustituye los metadatos de propuesta. |
| Restricciones de esquemas y ejemplos | Ajv 6.15.0 existente: **94 esquemas compilados, 74/74 ejemplos válidos y 39/39 casos inválidos rechazados**, exit 0, sin coerción, defaults o eliminación de propiedades. `validateSchema:false` y `format:full`: se comprueba el subconjunto usado compatible con draft-07, incluidos `contains` y formatos `date-time`/`uri`; no el dialecto 2020-12 completo. |
| Proyección Pydantic v2 | Python 3.12.14 y Pydantic 2.14.0 disponibles: **94 proyecciones de transporte, 74/74 ejemplos aceptados en modo estricto y 4/4 inválidos rechazados**, sin fallos, exit 0. No son modelos de producción ni un generador OpenAPI general. |
| Proyección TypeScript estricta | TypeScript 5.9.3 existente: **94 aliases derivados, 74 ejemplos tipados y 7 negativos** comprobados con `strict/noEmit`; exit 0 con `@ts-expect-error`, y exit 2 con exactamente siete TS2322 esperados al retirarlo. No sustituye validación JSON durante la ejecución. |
| H01 — Recuperación documental de operaciones | `RunAfterLostResponse`, `RunWithUncertainOperation` y `AnalysisWithRetainedOperation` permiten localizar una operación mediante lectura. Sus referencias coinciden en `operation_id`, `run_id`, `analysis_id`, estado, etapa y fecha con los correspondientes ejemplos de `getOperation`, incluida la operación incierta sin checkpoint. No se ejecutó recuperación HTTP real. |
| H01/H04 — Integridad de snapshots | `AnalysisWithRetainedOperation.data` es exactamente igual a `SelectedAnalysis.data`; `AnalysisHistoricalReadOnly.data` conserva exactamente `AudiovisualFailure.data`. `current_actions` y `operations_to_inspect` están en el envelope, fuera de `Analysis.data`; ambas listas del histórico están vacías aunque el snapshot conserve acciones pasadas. La versión de análisis de la referencia retenida coincide con la ficha. |
| Comprobaciones focalizadas reproducibles | **74/74 comprobaciones adicionales correctas** en `check-ajv-subset.cjs`: H01/H04, propuesta vacía sin llamada inventada, mappings, consistencia de versiones e identidades de operaciones/parámetros. H02/H03 están cubiertos por ejemplos y negativos de procedencia/intentado-fallido. No son pruebas de procesamiento real. |
| Guardas incorporadas al acuerdo | Los 39 negativos incluyen los nueve anteriores y los seis de H01–H03, más adaptación completa sin aporte/ángulo/hook/estructura, revisión sin motivo, evidencia revisada sin nota, etapa fallida sin motivo, confirmación incoherente, comparación incompatible con estado/cobertura, señal contradictoria, reintento incierto normal, dimensión duplicada/ausente y cuatro usos de `operator_note`. |
| OpenSpec y revisión del cambio | `openspec validate definir-mvp-senialon --strict` y `git diff --check` del conjunto de cambios: exit 0. El seguimiento confirma ALG 2.1 y BE 3.1 completas, **2/42 tareas**; FE 1.1 y BE 3.2 siguen pendientes. Los verificadores de esquemas no deciden qué casillas se completan. |
| Validador completo OpenAPI 3.1 / JSON Schema 2020-12 y generadores estándar | **Pendiente.** La descarga de herramientas adicionales falló por DNS; el permiso de instalación fue cancelado. No se repitió la solicitud ni se instaló software. Se reutilizaron dependencias existentes de solo lectura. |

SHA-256 del OpenAPI comprobado: `d7e0b018263658e686da00997ddffbd19ba96e6e73de5b08e3f8917b95375956`.

La repetición usa exclusivamente la fuente publicada en `docs/contracts/openapi.json`. Los resultados anteriores de borradores o candidatos temporales no se atribuyen a otro archivo de contrato. Tras cambiar los metadatos del primer candidato `1.0.0` de propuesta a acuerdo, los tres verificadores se ejecutaron de nuevo sobre el hash final indicado. Los reportes y proyecciones de esta comprobación se guardaron en `/private/tmp/senialon-final-contract/`, sin modificar OpenAPI ni crear otra fuente versionada.

## Reproducción sin modificar el producto

Los verificadores son herramientas de documentación del contrato; no crean endpoints, código de interfaz o algoritmos del producto. Los modelos/tipos proyectados solo se usan temporalmente. No se versionan como contratos alternativos.

- [check-ajv-subset.cjs](check-ajv-subset.cjs): recibe el OpenAPI y la ruta al módulo Ajv 6 existente. Aplica `oneOf`, `const`, condiciones y restricciones usadas; no valida todo el documento OpenAPI ni el dialecto completo. `discriminator` es una anotación ignorada por Ajv; el mismo script resuelve sus mappings y contrasta propiedades requeridas/etiquetas de rama. Incluye los 39 negativos y las 74 comprobaciones focalizadas; devuelve exit 1 ante un ejemplo inválido, negativo aceptado o comprobación focalizada fallida.
- [check_pydantic.py](check_pydantic.py): requiere Pydantic v2 ya disponible y proyecta los campos directamente con `create_model`/`TypeAdapter`. Conserva campos requeridos/nulos, constantes, enums, tipos estrictos y límites básicos. Las condiciones `if/then`, unicidad y relaciones semánticas no las aplica esta proyección; se comprueban aparte donde corresponda.
- [project_typescript.py](project_typescript.py): usa solo la biblioteca estándar Python y escribe aliases y fixtures en el directorio temporal indicado. TypeScript comprueba la estructura, sin formatos, patrones, límites, condiciones, exclusividad de `oneOf` o reglas de negocio.

Desde la raíz del repositorio, con las variables apuntando a herramientas **ya disponibles**:

```bash
"$SENIALON_PYTHON_BIN" docs/contracts/check_pydantic.py docs/contracts/openapi.json
"$SENIALON_NODE_BIN" docs/contracts/check-ajv-subset.cjs docs/contracts/openapi.json "$SENIALON_AJV_MODULE" --summary
"$SENIALON_PYTHON_BIN" -B docs/contracts/project_typescript.py docs/contracts/openapi.json /private/tmp/senialon-final-contract/types
"$SENIALON_NODE_BIN" "$SENIALON_TSC_JS" --strict --noEmit --skipLibCheck --target ES2022 /private/tmp/senialon-final-contract/types/positive.ts /private/tmp/senialon-final-contract/types/negative.ts
# Debe fallar con exit 2 y siete TS2322: son fixtures deliberadamente inválidos.
"$SENIALON_NODE_BIN" "$SENIALON_TSC_JS" --strict --noEmit --skipLibCheck --target ES2022 /private/tmp/senialon-final-contract/types/negative-unguarded.ts
```

En esta máquina se usaron Python/Pydantic del runtime disponible, Ajv y TypeScript del `node_modules` existente de `personal-finance-assistant`, sin modificarlo, y Node 24.19.0 del bundle para ejecutar las herramientas. Ese Node **no satisface** por sí solo el requisito del frontend `>=24.21.0 <25`; no se acredita arranque/build de Next.

Ajv 6 no valida el documento OpenAPI completo ni su metaesquema 2020-12; ignora `discriminator` como anotación, aunque aplica las restricciones `oneOf`/`const` y sus mappings se contrastan en la inspección focalizada. La proyección Pydantic no aplica `if/then/allOf`, `contains`, unicidad ni todas las relaciones entre campos, y su unión no acredita exclusividad de `oneOf`. TypeScript comprueba formas estáticas, sin formatos, patrones, límites o condiciones durante la ejecución. Que Pydantic/TypeScript acepten los ejemplos **no acredita las 39 exclusiones comprobadas con Ajv**. Ninguno de estos resultados equivale a ejecutar generadores estándar OpenAPI para Pydantic o TypeScript.

Las comprobaciones de estructura y proyección no prueban el intercambio HTTP real, la autenticación en Next/FastAPI, validación de origen, persistencia, binding Vercel, cuota, costos o respuestas auténticas de YouTube/JEV/Gemini. Tampoco prueban por sí solas ventanas, fórmulas, cobertura efectiva, todas las referencias entre entidades o fidelidad de observaciones: las identidades/versiones de H01/H04 se comprobaron solo en sus fixtures documentados; las invariantes generales corresponden a implementación y evaluación.

Los ejemplos son sintéticos. No se consultaron canales, no se ejecutó el prototipo y no se consumieron APIs del producto para construir este contrato.

**Estado de acuerdo:** `1.0.0` es la base documental común autorizada por el usuario y consolidada por revisión asistida en los roles ALG, FE y BE. El [registro de acuerdo](README.md) identifica versión y hash; no se atribuye aprobación de otros humanos. El cierre de G0 es contractual: **FE 1.1 conserva pendiente su segundo hito técnico, BE 3.2 su control previo de gasto y las integraciones reales sus tareas propias**. Esta comprobación no inicia frontend/backend de producto, no consume APIs y no demuestra despliegue, calidad predictiva o funcionamiento de una demo.
