# Validación del borrador BE 3.1

**Contrato comprobado:** [openapi.json](openapi.json), `0.1.0-draft.1`. Fecha: 17 de octubre de 2026, America/Bogota. Este registro describe comprobaciones del contrato; no una implementación ni una aprobación de ALG/FE.

| Comprobación | Resultado |
| --- | --- |
| JSON y referencias internas | 92 esquemas, 60 ejemplos, 18 operaciones en 15 rutas; 472 referencias internas resolubles. |
| Revisión técnica independiente | Se corrigieron mappings de discriminadores, exigencia de evidencia en salidas respaldadas/dimensiones completas, referencia de operación en curso/incierta y distinción entre replay y siguiente avance. No sustituye ALG 2.1 ni FE 1.1. |
| OpenSpec | Validación estricta de `definir-mvp-senialon` correcta; sin cerrar casillas. |
| Restricciones de esquemas y ejemplos | Ajv 6.15.0 existente: 92 esquemas compilados, **60/60 ejemplos válidos y 9/9 casos inválidos rechazados**, sin coerción, defaults o eliminación de propiedades. Se comprueba el subconjunto usado compatible con draft-07, no el dialecto 2020-12 completo. |
| Proyección Pydantic v2 | Python 3.12.14 y Pydantic 2.14.0 disponibles: 92 proyecciones de transporte creadas directamente desde la fuente, **60/60 ejemplos aceptados en modo estricto y 4/4 inválidos rechazados**. No son modelos de producción ni un generador OpenAPI general. |
| Proyección TypeScript estricta | TypeScript 5.9.3 existente: 92 aliases derivados, **60 ejemplos tipados y 7 negativos** comprobados con `strict/noEmit`; exit 0 con `@ts-expect-error`, y exit 2 con los siete TS2322 esperados al retirarlo. No sustituye validación JSON durante la ejecución. |
| Validador completo OpenAPI 3.1 / JSON Schema 2020-12 y generadores estándar | **Pendiente.** La descarga de herramientas adicionales falló por DNS; el permiso de instalación fue cancelado. No se repitió la solicitud ni se instaló software. Se reutilizaron dependencias existentes de solo lectura. |

SHA-256 del OpenAPI comprobado: `76f34a51c2ff5934f52005c0c4227185ef37d457224c55fa2a8fc2e9a7dd5d98`.

## Reproducción sin modificar el producto

Los verificadores son herramientas de documentación del contrato; no crean endpoints, código de interfaz o algoritmos del producto. Los modelos/tipos proyectados solo se usan temporalmente. No se versionan como contratos alternativos.

- [check-ajv-subset.cjs](check-ajv-subset.cjs): recibe el OpenAPI y la ruta al módulo Ajv 6 existente. Aplica `oneOf`, `const`, condiciones y restricciones usadas; no valida todo el documento OpenAPI ni el dialecto completo. `discriminator` es una anotación ignorada por Ajv; sus mappings se revisaron por separado. Los negativos incluyen porcentaje parcial, evidencia vacía, operación sin ID, elegible de 181 segundos, formatos inválidos y campos adicionales.
- [check_pydantic.py](check_pydantic.py): requiere Pydantic v2 ya disponible y proyecta los campos directamente con `create_model`/`TypeAdapter`. Conserva campos requeridos/nulos, constantes, enums, tipos estrictos y límites básicos. Las condiciones `if/then`, unicidad y relaciones semánticas no las aplica esta proyección; se comprueban aparte donde corresponda.
- [project_typescript.py](project_typescript.py): usa solo la biblioteca estándar Python y escribe aliases y fixtures en el directorio temporal indicado. TypeScript comprueba la estructura, sin formatos, patrones, límites, condiciones, exclusividad de `oneOf` o reglas de negocio.

Desde la raíz del repositorio, con las variables apuntando a herramientas **ya disponibles**:

```bash
"$SENIALON_PYTHON_BIN" docs/contracts/check_pydantic.py docs/contracts/openapi.json
"$SENIALON_NODE_BIN" docs/contracts/check-ajv-subset.cjs docs/contracts/openapi.json "$SENIALON_AJV_MODULE" --summary
python3 -B docs/contracts/project_typescript.py docs/contracts/openapi.json /private/tmp/senialon-contract-types
"$SENIALON_NODE_BIN" "$SENIALON_TSC_JS" --strict --noEmit --skipLibCheck --target ES2022 /private/tmp/senialon-contract-types/positive.ts /private/tmp/senialon-contract-types/negative.ts
```

En esta máquina se usaron Python/Pydantic del runtime disponible, Ajv y TypeScript del `node_modules` existente de `personal-finance-assistant`, sin modificarlo, y Node 24.19.0 del bundle para ejecutar las herramientas. Ese Node **no satisface** por sí solo el requisito del frontend `>=24.21.0 <25`; no se acredita arranque/build de Next.

Las comprobaciones de estructura y generación no prueban el intercambio HTTP real, la autenticación en Next/FastAPI, validación de origen, persistencia, binding Vercel, cuota, costos o respuestas auténticas de YouTube/JEV/Gemini. Tampoco prueban por sí solas ventanas, fórmulas, cobertura efectiva, referencias entre entidades o fidelidad de observaciones: esas invariantes corresponden a las tareas de implementación y evaluación.

Los ejemplos son sintéticos. No se consultaron canales, no se ejecutó el prototipo y no se consumieron APIs del producto para construir este contrato.

**Pendientes de acuerdo:** revisión semántica ALG 2.1; revisión documental del primer hito FE 1.1; incorporación de observaciones y publicación de versión común por BE 3.1. G0 sigue abierto y BE 3.1 permanece sin marcar completa.
