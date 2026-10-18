# Conciliación del contrato API de SENIALON

**Fecha:** 17 de octubre de 2026, America/Bogota. **Estado:** antecedente de conciliación documental de borradores. El contrato vigente es `1.0.0`, con revisión semántica e interfaces ALG 2.1, conformidad documental FE y acuerdo BE registrados por revisión asistida solicitada por el usuario. **G0 contractual cerrado; sin implementación de servicios.**

La fuente única de operaciones, esquemas, estados de transporte y ejemplos es [docs/contracts/openapi.json](../../docs/contracts/openapi.json), mantenida por BE. Su [README](../../docs/contracts/README.md) define uso, hash del acuerdo y versionado. La conciliación inicial produjo `0.1.0-draft.2` y fue incorporada después al acuerdo `1.0.0`; la versión efectiva se consulta en `info.version`. Este archivo documenta la migración y no constituye otro contrato consumible.

El borrador `backend-contract-openapi.json` de esta carpeta se retira del árbol de trabajo. Se conserva íntegro en Git como antecedente: tenía sintaxis JSON inválida y diferencias de transporte respecto del borrador revisado. No se corrige su sintaxis para mantener dos autoridades, ni se sustituye por un JSON mínimo que pueda confundirse con OpenAPI vigente. Las comprobaciones del contrato único no validan retroactivamente ese antecedente.

## Antecedente conservado en Git

| Dato | Referencia verificada |
| --- | --- |
| Commit de incorporación | `ae6b1a08040f9a17e9189da9a85f8b6c1b239439` |
| Ruta histórica | `openspec/contract/backend-contract-openapi.json` |
| SHA-256 del archivo original | `dbc8f93191c69c74cd453dd8093124486d0c63048ff9a6b824a4ede3fe6bf856` |
| Consulta web | [Archivo original en el commit](https://github.com/albcamargo/senialon-/blob/ae6b1a08040f9a17e9189da9a85f8b6c1b239439/openspec/contract/backend-contract-openapi.json) |

Desde la raíz del repositorio se puede inspeccionar el original sin restaurarlo como contrato activo:

```sh
git show ae6b1a08040f9a17e9189da9a85f8b6c1b239439:openspec/contract/backend-contract-openapi.json
```

La referencia sirve para auditar las decisiones y recuperar el antecedente. Su contenido se comparó como texto; no se considera un OpenAPI válido ni una integración existente.

## Decisiones de conciliación

Se conserva el comportamiento de las seis specs y del [diseño técnico](../changes/definir-mvp-senialon/design.md). Los nombres del transporte vigente se consultan siempre en el contrato único.

| Aspecto del antecedente | Resolución documental para el contrato único |
| --- | --- |
| `DemoApiKey` y cabecera `X-DEMO-CRED` | Se adopta `DemoBasic`: credencial compartida mediante HTTP Basic sobre HTTPS, comprobada en Next y FastAPI. No hay mecanismo alternativo con `X-DEMO-CRED`. Las mutaciones comprueban origen y clave idempotente; todas las respuestas privadas llevan `private, no-store`. No se publica una URL de Python ni se exponen claves de proveedores al navegador. |
| `Execution.windows[]`, `reference_time` editable y zona solo ilustrativa | Se conservan `Run.started_at` y dos ventanas `previous`/`recent` de siete días completos en `America/Bogota`, excluyendo el día actual, con inicio inclusivo y fin exclusivo. ALG calcula una vez; BE persiste; FE presenta. Recuperar una ejecución no cambia su corte. |
| `ChannelCoverage.retrieved/item_count` y conteos enteros sin representación explícita de desconocido | Se adopta cobertura por fuente, ventana y etapa, manteniendo las once fuentes y los 22 pares. `Count` distingue total conocido, total desconocido y observado parcial. Cobertura parcial no produce porcentaje ni novedad del corpus completo. Solo el principal confirmado cuenta; secundarios, formato, vistas y afinidad no alteran el conteo. |
| `JEVDecision.pertinent` booleano, motivos libres y marcas audiovisuales de tipo fecha | JEV conserva decisiones tipadas y sus evidencias; insuficiencia y fallo son distintos. Las observaciones audiovisuales usan posiciones en segundos dentro del video, dimensión, original y revisión. La procedencia de grupos conserva modelo/prompt/criterios; un intento JEV fallido conserva solo los datos conocidos y no fabrica decisión ni respuesta. Gemini observa, agrupa y sintetiza; JEV no procesa audiovisual ni redacta el guion. |
| Confirmación individual de grupos y resultados sin identidad/versionado de revisión editorial | Se confirma una propuesta conjunta y su versión exacta para ambas ventanas. Confirmar grupos no aprueba una oportunidad. Los resultados de análisis mantienen versiones inmutables y la revisión tiene revisión propia, motivo y vínculo exacto; una nueva versión no hereda aprobación. La credencial compartida no identifica una persona real. |
| Adquisición/análisis «encolados», sin controles de reintento o reserva | Se utilizan mutaciones de avance explícitas y acotadas, checkpoints duraderos y consulta GET de operaciones recuperables. La identidad del paso y la reclamación/reserva son atómicas antes de cada llamada pagada. Un estado incierto conserva su reserva sin repetición automática. No se introduce cola ni worker autónomo. |
| Listados con `offset/limit`, resultado global por video y ausencia de selección separada | Los listados del contrato único usan cursor y reglas de snapshot; detalle y análisis se vinculan a ejecución. Seleccionar cualquier pieza elegible persiste la selección sin inferir; el avance analítico se solicita aparte, sin exigir crecimiento o comparación completa. GET no calcula, adquiere ni exporta. |
| `trace_id` opcional en ejecución, error, evidencia y resultado | No se incorpora como alias implícito. `Meta.request_id` y `X-Request-Id` correlacionan la solicitud/respuesta del contrato; `run_id`, `operation_id`, versiones y clave idempotente conservan sus identidades propias. El antecedente no define una traza distribuida operativa. Añadirla en el futuro requiere semántica y versionado explícitos, sin renombrar o mezclar IDs. |

## Correspondencia de rutas

La tabla orienta la migración documental; no implementa redirecciones, aliases ni compatibilidad con clientes anteriores. Los métodos, parámetros, respuestas y errores autoritativos están en OpenAPI.

| Ruta del antecedente | Ruta o resolución en el contrato único |
| --- | --- |
| `POST /executions` | `POST /api/v1/runs`; corpus y corte fijados por servidor, sin fechas editables ni programación automática. |
| `GET /executions` y `GET /executions/{execution_id}` | `GET /api/v1/runs` y `GET /api/v1/runs/{run_id}`. |
| `POST /executions/{execution_id}/acquire` | `POST /api/v1/runs/{run_id}/advance` con scope `corpus`; una unidad acotada y persistida, sin promesa de cola. |
| `GET /executions/{execution_id}/coverage` | `GET /api/v1/runs/{run_id}/coverage`; cobertura por etapas y fuentes previstas. |
| `GET /executions/{execution_id}/groups` | `GET /api/v1/runs/{run_id}/groups`; una propuesta canónica conjunta y trazable. |
| `POST /executions/{execution_id}/groups/{group_id}/confirm` | `POST /api/v1/runs/{run_id}/groups/confirmation`; versión exacta, identidad compartida y fecha conservadas por servidor. |
| `GET /executions/{execution_id}/signals` | `GET /api/v1/runs/{run_id}/comparison`; solo lectura de lo persistido. Calcular requiere confirmación y `advance` con scope `comparison`. |
| `POST /videos/{video_id}/analysis` | `POST /api/v1/runs/{run_id}/analyses` selecciona sin consumo; `advance` con scope `analysis` solicita después el trabajo. |
| `GET /videos/{video_id}/analysis` | `GET /api/v1/runs/{run_id}/analyses/{analysis_id}`, con versión histórica cuando se solicite. Operaciones y capacidades actuales se entregan fuera del snapshot de resultados. |
| `POST /executions/{execution_id}/evidence` | Se retira la escritura libre de evidencia desde FE. El análisis produce observaciones trazables; el operador registra su revisión mediante `PUT /api/v1/runs/{run_id}/analyses/{analysis_id}/review`, sin editar la observación original, pertinencia o asignaciones. |
| `POST /notion/save` con destino en el cuerpo | Extensión futura `POST /api/v1/runs/{run_id}/analyses/{analysis_id}/notion-export`; una base preconfigurada, acción manual y duplicados por video/base. Permanece diferida hasta validar núcleo y entrega. |
| `GET /contracts` | La autoridad documental es el archivo OpenAPI del repositorio; `GET /api/v1/meta` informa metadatos del contrato y extensiones. No se añade una ruta competidora para servir otro esquema. |
| `GET /health` | Sin equivalente de salud operativa en este alcance. `/api/v1/meta` no acredita disponibilidad de proveedores, persistencia o despliegue. |

## Identidades y trazabilidad

`Meta.request_id` identifica la solicitud HTTP actual, coincide con `X-Request-Id` y se propaga de Next a Python. Al recuperar un resultado idempotente, el resultado de dominio permanece y el envelope de metadatos/cabeceras corresponde a la solicitud actual. El ID no sustituye la clave `Idempotency-Key`: repetir una solicitud se resuelve mediante la clave, el cuerpo y su alcance, aunque cambie la interacción HTTP. Tampoco identifica el conjunto de solicitudes de una ejecución. Para ello se usan `run_id` y sus recursos vinculados. Un ID de petición de JEV/Gemini, cuando el proveedor lo informe, pertenece a la traza de ese proveedor y no se inventa a partir del ID local.

Las capacidades y las operaciones presentes se consultan por GET sin reescribir los resultados históricos. Una ficha histórica conserva su `data` y revisión exacta; sus capacidades actuales están vacías. Los ejemplos de recuperación y trazas son sintéticos, no acreditan consultas reales, gasto, integraciones o una revisión humana ya realizada.

## Alcance y puertas pendientes

La conciliación resuelve la duplicidad documental y los bloqueos de consumo identificados; no desarrolla frontend/backend, no configura proveedores ni ejecuta el prototipo. BE mantiene el transporte; ALG mantiene rúbricas, ventanas y cálculos; FE consume los resultados sin duplicarlos.

ALG 2.1 y BE 3.1 quedaron registrados documentalmente para `1.0.0`, con [revisión semántica e interfaces](../../docs/REVISION_SEMANTICA_ALG.md), [consumo FE](../../docs/REVISION_CONTRATO_FRONTEND.md) y acuerdo en el README del contrato único. G0 contractual está cerrado por revisión asistida autorizada, sin atribuir firmas a otros integrantes. FE 1.1 completa requiere todavía el segundo hito técnico posterior a 1.2. BE 3.2, accesos, persistencia y despliegue mantienen sus pruebas pendientes; las comprobaciones de esquemas no acreditan integración real. Las casillas únicas permanecen en [tasks.md](../changes/definir-mvp-senialon/tasks.md).
