# FE 1.1 — Revisión de consumo del contrato API

**Fecha:** 17 de octubre de 2026, America/Bogota. **Responsable:** FE, usuario solicitante.

**Estado actualizado al 18 de octubre de 2026:** FE 1.1 completa sus dos hitos. La revisión documental es favorable sobre [openapi.json](contracts/openapi.json) **`1.0.0`**; las diez necesidades y veinte casos tienen representación documental, con H01–H04 resueltos. Después de FE 1.2 se implementaron [tipos y validación del consumidor](../frontend/CONTRATO_API.md), con 250 pruebas locales y los 74 ejemplos canónicos comprobados estáticamente. La revisión semántica ALG, las interfaces internas y el registro BE conservan cerrado G0 contractual. Este cierre no acredita intercambio HTTP real, acceso, persistencia o gasto ni una aprobación atribuida a los otros integrantes.

**Versión vigente examinada:** `1.0.0`, SHA-256 `d7e0b018263658e686da00997ddffbd19ba96e6e73de5b08e3f8917b95375956`, con 94 esquemas y 74 ejemplos sintéticos. La revisión inicial correspondía a draft.1, SHA-256 `76f34a51c2ff5934f52005c0c4227185ef37d457224c55fa2a8fc2e9a7dd5d98`; H01–H04 se incorporaron en draft.2, SHA-256 `2b384d99c7a2a8f99fcc9375ae8e045af910128686d54fab761d75be256b1808`. Ambos son antecedentes históricos de la versión única acordada. Este ajuste documental no inicia Next.js, no implementa componentes y no retoma instalaciones canceladas.

**Alcance del acuerdo:** `contract_status=agreed`, revisiones `reviewed` y `g0=closed` describen el contrato documental. BE 3.2 y su control de los 20 USD siguen pendientes antes de cualquier consumo pagado; accesos, binding, persistencia y pruebas reales mantienen sus tareas propias.

**Antecedente de integración desde `main`:** el commit `ae6b1a0` añadió un segundo borrador incompatible, con error de sintaxis JSON. Esa propuesta se retira del árbol activo y su procedencia, matriz y referencia Git quedan en [openspec/contract/README.md](../openspec/contract/README.md). La única fuente API activa es `docs/contracts/openapi.json`. Los dictámenes de este documento se refieren a esa fuente; el antecedente remoto no recibe aprobación ni se transforma en otro contrato operativo.

Este documento conserva el entregable documental de FE y sus antecedentes; Backend mantiene la autoría de rutas, métodos, campos, esquemas y versiones. El segundo hito se registra en [frontend/CONTRATO_API.md](../frontend/CONTRATO_API.md), con derivados del mismo contrato y sin endpoints nuevos. Las proyecciones temporales anteriores de BE 3.1 siguen siendo antecedentes de aquella comprobación; no se confunden con el consumidor actual ni con resultados reales de demo.

## Resultado de la inspección inicial

| Verificación realizada | Resultado |
| --- | --- |
| Buscar contrato API, OpenAPI o esquemas de integración en el repositorio y consultar al usuario | La inspección inicial sin borrador dio paso a draft.1, conciliaciones en draft.2 y acuerdo documental único 1.0.0. La implementación continúa pendiente. |
| Revisar tareas y dependencias | Revisión documental FE y revisión semántica/interfaces ALG 2.1 registradas; G0 contractual cerrado en 1.0.0. La secuencia siguiente es 1.2, consumo técnico 1.1 y conexión/acceso 1.3; no se ejecuta código en este ajuste. |
| Contrastar necesidades FE con las seis specs y el borrador | Diez grupos de operaciones/datos y veinte casos contrastados documentalmente; matrices de evidencia y hallazgos abajo. No son pruebas de una aplicación implementada. |
| Revisar responsabilidades | FE consume; BE define API y persistencia; ALG define significado de clasificaciones y cálculos. No se escribe un backend sustituto dentro de Next. |
| Distinguir catálogo y comparación | Seleccionar una pieza elegible no exige confirmar grupos, crecimiento o comparación disponible. |
| Revisar la representación de faltantes | Metadatos, cobertura, clasificación, audiovisual, valor y afinidad requieren estados independientes; no existe un cero implícito. |

Fuentes revisadas: [corpus](../openspec/changes/definir-mvp-senialon/specs/youtube-corpus/spec.md), [clasificación](../openspec/changes/definir-mvp-senialon/specs/content-classification/spec.md), [señales](../openspec/changes/definir-mvp-senialon/specs/publication-signals/spec.md), [análisis editorial](../openspec/changes/definir-mvp-senialon/specs/editorial-analysis/spec.md), [operación y revisión](../openspec/changes/definir-mvp-senialon/specs/operator-review/spec.md), [Notion](../openspec/changes/definir-mvp-senialon/specs/notion-export/spec.md), [diseño técnico](../openspec/changes/definir-mvp-senialon/design.md) y [diseño visual](../DESIGN.md).

## Operaciones y datos que FE necesita consumir

Los nombres de esta tabla son conceptos del producto, no nombres de rutas o propiedades JSON. Las lecturas no deben iniciar inferencias o modificar estado; las acciones requieren una operación explícita y autenticada.

| Referencia | Necesidad de FE | Datos y comportamiento que debe documentar BE | Relación con tareas |
| --- | --- | --- | --- |
| FE-C01 | Crear, listar y recuperar ejecuciones | Identidad, fecha/inicio, ventanas, zona, versión, ejecución anterior y cobertura real. Distinguir iniciar una nueva ejecución de recuperar resultados existentes. | FE 1.4; BE 3.1/3.5/3.11. |
| FE-C02 | Consultar estado y solicitar avance/reanudación | Etapa, último paso confirmado, resultados disponibles, error/limitación y operación permitida. Cómo reconocer trabajo ya solicitado o resultado incierto sin repetir una llamada pagada. | FE 1.3/1.4; BE 3.10/3.11. |
| FE-C03 | Inspeccionar cobertura | Once fuentes previstas, canales/ventanas consultados o incompletos, procedencia y motivos por adquisición, elegibilidad, pertinencia y tema. Audiovisual/valor/afinidad aparte. | FE 1.4/1.6; BE 3.8/3.9; ALG 2.3/2.6. |
| FE-C04 | Inspeccionar y confirmar grupos | Identidad y versión de propuesta, nombre/descripción/variantes, publicaciones, evidencia de pertenencia y confirmación con fecha. No hay edición manual de asignaciones. | FE 1.5; BE 3.12; ALG 2.4. |
| FE-C05 | Consultar comparación temática | A/B conocidos o desconocidos, conteos observados parciales, diferencia/porcentaje permitido o motivo, novedad válida, fechas, fuentes y aporte por canal. FE no recalcula estos resultados. | FE 1.6; BE 3.11; ALG 2.5/2.6. |
| FE-C06 | Listar piezas elegibles y pedir análisis | ID/URL, canal/título, publicación/captura, duración, estadísticas disponibles, evidencia de Short o condición de candidato y pertinencia IA. Selección independiente de crecimiento y comparación. | FE 1.7; BE 3.8/3.11; ALG 2.3. |
| FE-C07 | Consultar ficha y evidencia | Análisis exacto, versión, material procesado, observaciones por dimensión, marcas y enlace al original, revisión, métricas/señal, decisiones JEV, criterios/modelos, hipótesis y adaptación separados. | FE 1.8; BE 3.11; ALG 2.7–2.9. |
| FE-C08 | Registrar decisión y revisión de evidencia | Identidad/versiones del análisis, estados de decisión permitidos, motivo, revisión de cada evidencia, confirmación de guardado y lectura posterior. No aprobar implícitamente al guardar. | FE 1.9; BE 3.5/3.12. |
| FE-C09 | Acceder y representar errores | Comportamiento de credencial compartida en ambos servicios, protección del acceso directo a Route Handlers, validación de origen en mutaciones, formato de error/insuficiencia y alcance de resultados conservados. Respuestas privadas sin caché compartida ni secretos. | FE 1.3–1.9; BE 3.1/3.6. |
| FE-C10 | Reconocer disponibilidad de Notion | Operación manual solo si se activa al final; respuesta real con enlace, duplicado o error sin pérdida local. No es dependencia de G0 ni del núcleo. | FE 1.12; BE 3.15/3.16. |

## Casos de aceptación para revisar contra el borrador

**Los veinte casos ya se contrastaron documentalmente**; los resultados y reservas aparecen en la matriz de revisión más abajo. La tabla siguiente conserva las expectativas derivadas de las specs: no acredita pruebas de integración ni datos recolectados. Los números de comparación son ejemplos ilustrativos.

| Caso | Situación | Resultado que FE debe poder representar desde el contrato |
| --- | --- | --- |
| FE-A01 | Sin credencial o credencial incorrecta, también al acceder directamente a Route Handlers | No se entregan datos ni ejecutan acciones; el mecanismo de acceso solicita una credencial válida. Las mutaciones con origen no permitido se rechazan y las respuestas privadas no se comparten por caché. No se introduce un login propio. |
| FE-A02 | Duración o estadísticas ausentes | La duración faltante no se interpreta como cero/elegible; una métrica ausente se muestra no disponible. Los valores cero conocidos se conservan como cero. |
| FE-A03 | Cierre de día | Ambas ventanas llegan con límites y America/Bogota; FE muestra lo recibido sin calcular fechas locales desde la zona del navegador. |
| FE-A04 | Canal fallido frente a canal revisado sin publicaciones | Se conservan los once previstos; el fallido queda desconocido y el revisado puede mostrar cero observado, sin cobertura completa supuesta. |
| FE-A05 | Propuesta de grupos sin confirmar | Se puede inspeccionar la propuesta; comparación pendiente. El catálogo de elegibles sigue accesible. |
| FE-A06 | Confirmación de grupos | Se registra una versión y su fecha para ambas ventanas, sin cambiar asignaciones ni aprobar la oportunidad editorial. |
| FE-A07 | Tema principal y secundario | Una publicación contribuye solo al principal; el secundario queda visible sin sumar. FE no deriva otro conteo. |
| FE-A08 | Cobertura completa evaluable, A=2 y B=4 | Conteos 2/4, diferencia +2 y variación +100%, con sus fuentes. |
| FE-A09 | Cobertura completa evaluable, A=2 y B=0 | Conteos 2/0, diferencia −2 y variación −100%, sin presentarlo como señal creciente. |
| FE-A10 | Cobertura completa evaluable, A=0 conocido y B=3 | «Nuevo en el corpus», diferencia +3 y porcentaje no aplicable. |
| FE-A11 | Cobertura suficiente, A=0 conocido y B=0 conocido | Ausencia de publicaciones observadas, sin novedad ni porcentaje inventado. |
| FE-A12 | Base desconocida y tres publicaciones recientes observadas; o conteos numéricos observados en ambas ventanas con cobertura parcial de los once canales | Se identifican los faltantes y los conteos parciales; la comparación completa queda pendiente. Tener dos números observados tampoco autoriza un porcentaje ni «nuevo en el corpus» para el corpus completo. |
| FE-A13 | Falla el audiovisual de una pieza | Metadatos y señal temática conocida permanecen; observaciones audiovisuales pendientes/error, sin recursos inventados. |
| FE-A14 | Valor y afinidad | Tres resultados de valor y dimensiones separadas de persona/contexto/pilar, con cuatro pilares y alternativas. Ninguna probabilidad se rotula como viralidad o precisión medida. |
| FE-A15 | Observación frente a hipótesis y adaptación | Dimensión, original, marca temporal y revisión de cada evidencia identificables; sugerencias y explicaciones no se presentan como observaciones. |
| FE-A16 | Decisión sobre un análisis | Se dirige al ID y versión exactos y a una transición permitida. El borrador debe explicar cómo rechaza o resuelve un cambio sobre una versión desactualizada. |
| FE-A17 | Falla el guardado editorial | No se anuncia éxito; FE conserva el motivo escrito y distingue resultados previos de una decisión sin confirmar. |
| FE-A18 | Cerrar navegador o reiniciar aplicación | Se recuperan resultados y revisión con su contexto. Una ejecución anterior conserva su fecha y no se presenta como nueva. |
| FE-A19 | Consultar, recargar o reintentar | Consultas sin inferencias ni mutaciones. Un intento repetido se reconoce según la identidad de operación; un resultado incierto no provoca consumo pagado automático. |
| FE-A20 | Notion diferido o con fallo | El núcleo funciona sin exportación. No se simula un registro creado; un error conserva ficha y decisión local. |

## Resultado de las ocho observaciones iniciales

«Cubierto documentalmente» significa que el contrato permite definir el consumidor; no acredita una implementación. El acuerdo ALG/BE y G0 contractual se registran por separado en sus documentos, sin atribuirlos a una prueba de interfaz.

| Observación | Resultado del contraste | Dueño del pendiente |
| --- | --- | --- |
| FE-O01 — Autoridad y versión | Cubierto: versión única acordada 1.0.0, hash, política y alcance interno/BFF identificados; el otro borrador queda como referencia histórica. | BE mantiene la fuente; FE deriva el consumidor tras 1.2. |
| FE-O02 — Faltantes y estados | Cubierto: `Metric`, `Duration`, `Count`, `Stage` y assessments separan cero, null, insuficiencia y fallo; `PartialSignal` prohíbe porcentaje. ALG 2.1 distingue decisión insuficiente, error y cobertura sin entradas. | ALG/BE implementan las invariantes; FE valida respuestas durante la ejecución. |
| FE-O03 — Identidades y versiones | Cubierto: ejecución/captura/grupos/análisis/revisión tienen identidades y versiones; PUT controla ambas revisiones y devuelve 409. H04 resuelto: capacidades actuales fuera del snapshot y consultas históricas solo lectura. | FE verifica el consumidor después de 1.2; BE implementa las invariantes. |
| FE-O04 — Decisión editorial | Estados acordados: `pending_review`, `consider_for_adaptation`, `discarded`, con motivo y sin aprobación automática. Estados revisados de evidencia exigen nota; no se permite `operator_note` como origen de una clasificación automática. | FE implementa el formulario; BE preserva controles y versiones. |
| FE-O05 — Listados y detalle | Cubierto: cursor, límite, fin con null, `snapshot_revision`, detalle y 409 al mezclar snapshots. Faltan ejemplos de paginación para el posterior consumo técnico. | BE ejemplos; FE verificación técnica después de 1.2. |
| FE-O06 — Avance y reintentos | Cubierto: scope, clave, claim/reserva y siguiente unidad descritos; H01 resuelto con referencias de operaciones en GET de ejecución y envelope de ficha, incluso sin checkpoint. | BE implementa persistencia/orquestación; FE verifica recuperación real. |
| FE-O07 — Acceso | Cubierto documentalmente: Basic en ambos servicios, Origin, headers privados, Route Handlers y variables sin valores secretos. Binding efectivo y pruebas reales siguen en BE 3.3/3.6 y FE 1.3. | BE/FE en sus tareas de implementación. |
| FE-O08 — Evidencia y revisión | Cubierto: observaciones, marcas y revisión separadas; H02/H03 conservan trazas efectivas/parciales. ALG 2.1 documenta correspondencia entre evidencia, pieza, dimensión y material procesado. | ALG/BE implementan las referencias e invariantes; FE las presenta y verifica. |

## Correspondencia con pantallas y operaciones

Los identificadores siguientes son los `operationId` y esquemas existentes en OpenAPI, no nuevas rutas o contratos.

| Necesidad | Pantalla/flujo FE | Operaciones y datos del borrador | Dictamen documental |
| --- | --- | --- | --- |
| FE-C01 | Ejecuciones y recuperar una anterior | `createRun`, `listRuns`, `getRun`; `run_id`, `revision`, `started_at`, ventanas y corpus. Crear con nueva clave es distinto de recuperar. | Cubierto. |
| FE-C02 | Estado y reanudación | `advanceRun`, `getRun`, `getAnalysis`, `getOperation`; referencias `operations_to_inspect`, checkpoint, capacidades actuales y política de reintento. | Cubierto en 1.0.0; conserva H01 resuelto para recarga sin ID local. |
| FE-C03 | Cobertura por canal/semana | `getCoverage`, `getRun`; 11 fuentes y 22 celdas con etapas, paginación y faltantes. | Cubierto; no usar AV/afinidad para reducir cobertura temática. |
| FE-C04 | Inspección y confirmación de grupos | `getGroups`, `confirmGroups`; `Groups`, `Assignment`, evidencia, `generation_trace` y `Confirmation`. Sin endpoints de edición manual. | Cubierto; H02 resuelto con modelo/prompt/criterios efectivos. |
| FE-C05 | Comparación temática | `getComparison`; variantes de `TopicSignal`, IDs y `by_source`. | Cubierto; FE no recalcula ni infiere novedad desde dos observados parciales. |
| FE-C06 | Catálogo y seleccionar pieza | `listEligibleVideos`, `getVideo`, `selectAnalysis`; `Publication`, candidato/Short, pertinencia y traza de intento cuando existe. | Cubierto sin exigir grupos o aumento; H03 resuelto sin convertir el fallo en decisión. |
| FE-C07 | Ficha y evidencia | `getAnalysis`, `getGroups` de la ejecución original; dimensiones, evidencia, trazas, decisiones, señal snapshot e hipótesis/adaptación; operaciones/capacidades actuales en el envelope. | Cubierto con H02–H04 resueltos; el snapshot de resultados se conserva. |
| FE-C08 | Decisión y revisión de evidencia | `getReview`, `recordReview`; `expected_analysis_version`, `expected_review_revision`, motivo y una entrada por evidencia. | Cubierto; enums acordados, motivo/nota obligatorios cuando corresponden e historial solo lectura según H04. |
| FE-C09 | Acceso y errores | Seguridad global `DemoBasic`, Origin/clave en mutaciones, `ErrorResponse`, 401/403/409/422 y headers privados. | Cubierto documentalmente; no acredita pruebas HTTP. |
| FE-C10 | Notion opcional | `getCapabilities.data.notion`, operación futura `exportNotion`, 501/503 y respuesta auténtica si se activa. | Extensión diferida; no bloquea núcleo ni obliga botón. |

## Resultado de los veinte casos

Los nombres de ejemplo remiten a `components.examples` de OpenAPI. «Cubierto» evalúa la representación y la norma, no certifica el comportamiento de un servidor. Las comprobaciones de tipos previas están en [VALIDACION.md](contracts/VALIDACION.md); no se repitieron instalaciones ni se ejecutaron integraciones en esta revisión.

| Caso | Evidencia documental examinada | Resultado y pendiente |
| --- | --- | --- |
| FE-A01 | `DemoBasic`, Origin en mutaciones, headers; `Error_AUTH_REQUIRED` y `Error_ORIGIN_FORBIDDEN`. | Cubierto. Rechazo real de páginas/handlers/binding se verifica en FE 1.3/1.10 y BE 3.6. |
| FE-A02 | `PublicVideo180`, `MissingDuration`, `Video181`; `Metric` conocido/unknown. | Cubierto. `"0"` es estadística conocida; null no habilita elegibilidad. |
| FE-A03 | `Windows` en ejecución/comparación; ejemplos del 3/10/17 de octubre con UTC−5. | Cubierto en transporte. Algoritmo de ventanas corresponde a ALG 2.2, sin aprobación aquí. |
| FE-A04 | `CompleteCoverage`, `PartialCoverage`; fuente c02 fallida frente a otras consultadas sin IDs. | Cubierto. Mantener corpus previsto y razones. |
| FE-A05 | `ProposedGroups`, `UnconfirmedComparison`, `CatalogBeforeGroups`, `SelectBeforeComparison`. | Cubierto: catálogo accesible y comparación pendiente son independientes. |
| FE-A06 | `ConfirmGroups`, `ConfirmedGroups`; versión, fecha y `confirmation_id`. | Cubierto: confirmar no calcula ni aprueba adaptación. |
| FE-A07 | `Assignment.secondary_topic_ids`, `GroupsWithSecondaryTopics`, `Count.video_ids/by_source` y regla del principal. | Cubierto con secundarios visibles y aporte solo al principal; las referencias y cálculos se verificarán al implementar. |
| FE-A08 | `Signal_2_4`. | Cubierto: +2 y +100 %, con IDs de respaldo. |
| FE-A09 | `Signal_2_0`. | Cubierto: −2 y −100 %, sin señal creciente. |
| FE-A10 | `Signal_0_3`, variante `NewInCorpusSignal`. | Cubierto: nuevo, +3 y porcentaje null con razón `zero_baseline`. |
| FE-A11 | `Signal_0_0`, variante `EmptySignal`. | Cubierto: sin publicaciones/novedad y sin porcentaje. |
| FE-A12 | `SignalUnknownBaseline`, `SignalPartialNumeric`, `PartialComparison`. | Cubierto: incluso observados 2/4 parciales mantienen delta/% null para el corpus completo. |
| FE-A13 | `AudiovisualFailure`, `JevFailureBeforeSend`, `JevFailureAfterSend`; metadatos/señal y trazas parciales. | Cubierto: fallo AV conserva contexto y H03 conserva solo lo conocido del intento JEV. |
| FE-A14 | Tres ejemplos `Value_*`, `AnalysisWithEvidence`, `AnalysisWithInsufficientEditorialMaterial`, `PillarOther`, `PillarInsufficient`. | Cubierto: enums y dimensiones acordados, incluida insuficiencia editorial. La fidelidad de las decisiones reales se evaluará en ALG 2.10–2.12. |
| FE-A15 | `AnalysisWithEvidence`, `Evidence`, `EvidenceReview`, `Hypothesis`, `Adaptation`, trazas de grupos/intentos. | Cubierto: original/marca, revisión y sugerencia diferenciados; H02/H03 incorporan la procedencia faltante. |
| FE-A16 | `InitialReview`, `DiscardRequest`, `SavedReview`, `AnalysisNewVersionPendingReview`, `AnalysisHistoricalReadOnly`, `Error_VERSION_CONFLICT` y control optimista. | Cubierto: una nueva versión inicia otra revisión pendiente; la histórica se conserva sin acciones. El rechazo real de guardado obsoleto se verificará en el hito técnico. |
| FE-A17 | Errores comunes y regla de no anunciar guardado sin respuesta. | Contrato cubierto; conservar texto es responsabilidad del formulario FE, todavía sin implementar. |
| FE-A18 | `RunList`, `getAnalysis/getReview`, `RunAfterLostResponse`, `RunWithUncertainOperation`, `AnalysisWithRetainedOperation`. | Cubierto documentalmente con H01 resuelto: operación identificable por lectura sin checkpoint. La persistencia real sigue sin probarse. |
| FE-A19 | GET sin efectos, `Advance*`, `Operation_*`, errores con ID, referencias recuperables y matriz de reintentos. | Cubierto: replay y siguiente unidad diferenciados; tras recarga se descubre y consulta la operación sin repetir consumo. |
| FE-A20 | `Capabilities` con Notion diferido; 501/503 y reglas de conservación. | Cubierto para núcleo independiente. No hay éxito externo verificado y no se exige implementarlo ahora. |

## Hallazgos de draft.1 y resolución incorporada en draft.2

Las descripciones de defecto de esta sección son antecedentes de la revisión de draft.1. **H01–H04 se resolvieron en draft.2 y se conservan en el acuerdo 1.0.0**; cada apartado mantiene el escenario original y la solución aplicada. Eso no acredita todavía la recuperación, los proveedores o las mutaciones de una aplicación implementada.

### H01 — P1 resuelto: descubrir la operación activa o retenida

**Ubicación original:** `#/components/schemas/Run/properties`, `#/components/schemas/Analysis/properties` y `getOperation`. La solución añade referencias en `Run` y en el envelope `AnalysisResponse`. **Afecta:** FE-C02, FE-A18/A19, FE-O06.

Escenario original en draft.1: después de perder la primera respuesta de `advanceRun` y cerrar el navegador, GET de ejecución/análisis no devolvía la identidad de la operación. `last_checkpoint` podía ser null y `getOperation` exigía un ID conocido, sin otra lectura para descubrirlo. El error con ID ayudaba a quien lo recibía, pero no resolvía esa recarga. Forzar otro POST habría contradicho el recorrido de consulta sin consumo.

**Resolución aplicada:** `Run.operations_to_inspect` y `AnalysisResponse.operations_to_inspect` contienen referencias recuperables con identidad de operación, ejecución y pieza cuando corresponde. `RunAfterLostResponse`, `RunWithUncertainOperation` y `AnalysisWithRetainedOperation` permiten localizar por GET una operación sin checkpoint; `RetainedAnalysisOperation` muestra su detalle. El estado operativo actual queda fuera de `Analysis.data`. **Aceptación documental favorable:** no se necesita inventar un ID, reclamar otra unidad o liberar una reserva para consultar el estado.

### H02 — P2 resuelto: procedencia del modelo que generó los grupos

**Ubicación:** `#/components/schemas/Groups/properties` y `ProposedGroups`/`ConfirmedGroups`. **Afecta:** FE-C04/C07, FE-O08 y contexto recuperable de FE-A18.

En draft.1 la propuesta exponía criterios y versiones de clasificación, pero no el modelo Gemini ni la versión de prompt usados para generarla. Ni `Run` ni `Operation` completaban esa procedencia. FE podía mostrar la versión del grupo, pero no recuperar el modelo asociado al resultado.

**Resolución aplicada:** `Groups.generation_trace` reutiliza `ModelUse`, restringe el proveedor a Gemini y conserva modelo, versión de prompt, criterios y momento efectivos. `ProposedGroups`, `ConfirmedGroups` y `GroupsWithGenerationTrace` incluyen la procedencia. Si hay temas se exige una traza; una propuesta vacía admite `[]` cuando no hubo llamada. **Aceptación documental favorable:** el consumidor puede recuperar la procedencia original sin sustituirla por la configuración actual. La revisión asistida ALG 2.1 recoge la semántica y las interfaces; su ejecución se implementará posteriormente.

### H03 — P2 resuelto: traza parcial conocida del intento JEV fallido

**Ubicación original:** `#/components/schemas/UnavailableAssessment/properties/trace`, que en draft.1 estaba fijo a null; ejemplo `JevFailure`. **Afecta:** FE-C06/C07, FE-O08 y representación de errores con contexto.

En draft.1 un fallo de JEV permitía motivo y decisión nula, pero obligaba a perder del transporte los datos conocidos del intento: pregunta, entrada, modelo/criterios o ID de petición, si existía. `Publication` tampoco ofrecía otra referencia. Eso impedía inspeccionar esa procedencia desde el detalle.

**Resolución aplicada:** `UnavailableAssessment.trace` acepta `JevAttemptTrace` parcial o null; `decision` continúa null. `JevFailureBeforeSend` y `JevFailureAfterSend` conservan solo los datos conocidos, con modelo/ID/respuesta nulos cuando no están disponibles. La condición `not_sent` exige ID y respuesta de proveedor nulos, sin borrar preguntas o configuración preparadas que sí se conozcan. **Aceptación documental favorable:** un fallo queda diferenciado de una decisión auténtica; no se inventa información insuficiente como respuesta de JEV. ALG 2.1 documenta esa distinción y la implementación de proveedor sigue pendiente.

### H04 — P2 resuelto: acciones en versiones históricas

**Ubicación original:** `Analysis.allowed_actions` y parámetro `analysis_version` de `getAnalysis/getReview`. En draft.1 el snapshot de v1 podía enumerar `record_review` o `advance_analysis` aun existiendo v2, mientras PUT solo admitía la última. Faltaba distinguir capacidades actuales de capacidades capturadas.

**Resolución aplicada:** `AnalysisResponse.current_actions` contiene capacidades actuales fuera del snapshot; para una versión histórica devuelve `[]`, igual que `operations_to_inspect`. `AnalysisHistoricalReadOnly` conserva los datos y revisión exactos de v1 mientras muestra vacías esas listas actuales. `data.allowed_actions` conserva capacidades capturadas y no se usa para habilitar controles. **Pauta FE:** al consultar un histórico, no ofrecer mutaciones; para editar, recuperar la ficha vigente y usar las capacidades del envelope, manteniendo las comprobaciones optimistas. La norma no requiere un campo `is_current` ni una nueva pantalla y no supone controles de UI ya implementados.

## Decisiones de consumo que ya pueden prepararse documentalmente

- Resolver nombres temáticos mediante `getGroups` de la **ejecución original**, con clave compuesta `(run_id, groups_id, groups_version, topic_id)`. No cachear solo por `topic_id` ni consultar los grupos de la última ejecución global al abrir una ficha anterior. La regla de reclasificar en una nueva ejecución conserva el contexto de la antigua.
- Presentar `observed_count` como parcial cuando corresponda y `total_count=null` como desconocido; nunca derivar porcentaje o «nuevo» en React. Las estadísticas de YouTube son cadenas decimales; no convertirlas sin control a números que pierdan precisión.
- Seleccionar crea el análisis pendiente; `advanceRun` con scope analysis solicita el trabajo. Abrir ficha, listar, recargar o hacer polling solo lee. En fichas, usar `AnalysisResponse.current_actions` y las referencias operativas del envelope, nunca `data.allowed_actions` para habilitar controles; no inventar ETA ni actividad en segundo plano.
- Ante `VERSION_CONFLICT`, conservar motivo y revisión local sin confirmar. Recuperar la última ficha y su revisión antes de decidir un nuevo envío; no interpretar el único `current_revision` del error como si representara a la vez versión de análisis y revisión editorial. No reenviar automáticamente.
- Mantener la misma clave y cuerpo para recuperar una respuesta perdida; para la siguiente unidad permitida usar clave nueva y revisiones actuales. Tras recarga, descubrir la operación mediante `operations_to_inspect` y consultar su detalle por GET. En incertidumbre, esperar reconciliación BE sin repetir consumo.
- Renderizar razones, modelos y evidencias como datos externos, no como instrucciones; separar observaciones, hipótesis y sugerencias. La evaluación de valor no es una verificación externa de todas las afirmaciones del video.

## Acuerdo de consumo 1.0.0

La revisión asistida de ALG 2.1 y las interfaces ALG–BE están registradas en [REVISION_SEMANTICA_ALG.md](REVISION_SEMANTICA_ALG.md) e [INTERFACES_ANALISIS.md](INTERFACES_ANALISIS.md). Junto con la conformidad FE y el registro de BE cierran **G0 contractual**, sin atribuir una intervención a los otros integrantes ni dar por configurados proveedores o presupuesto.

El consumidor conserva H01–H04 y aplica además estas reglas acordadas:

- `explanation_source` de pertinencia, valor y afinidad admite `evidence_summary` o `gemini_synthesis`; `operator_note` se retiró. Los motivos humanos pertenecen a `EditorialReview` y `EvidenceReview`, sin edición manual de clasificaciones.
- Una adaptación `complete` incluye ángulo, aporte esperado con evidencia, gancho y estructura no vacía. El CTA puede ser null. Un estado pendiente o insuficiente no se presenta como propuesta completa.
- Una decisión editorial distinta de pendiente exige motivo; guardar una revisión mantiene esa exigencia incluso al volver a pendiente. Una evidencia revisada exige nota; su estado inicial pendiente puede conservar nota null.
- `AiInsufficientInformation`, `PublicationWithInsufficientAi` y `CoverageWithInsufficientAi` distinguen la respuesta JEV auténtica insuficiente de un error. `decided` no convierte por sí solo la pertinencia en elegibilidad o cobertura completas.
- `GroupsWithSecondaryTopics`, `AnalysisWithInsufficientEditorialMaterial` y `AnalysisNewVersionPendingReview` amplían los ejemplos de secundarios sin conteo, insuficiencia editorial y revisión inicial de otra versión. No acreditan decisiones de proveedor o revisión humana reales.

La versión acordada contiene 94 esquemas y 74 ejemplos sintéticos. Los resultados finales de validación y sus límites se registran en [VALIDACION.md](contracts/VALIDACION.md); el cierre documental no sustituye la validación JSON del consumidor ni la integración real que se comprobarán después de 1.2.

## Ejemplos adicionales para el consumo técnico posterior

BE conserva los ejemplos canónicos dentro de OpenAPI; esta revisión no crea fixtures competidores. Para verificar el consumidor técnico conviene añadir escenarios de dos páginas y conflicto de cursor, grupos sin propuesta, catálogo elegible vacío manteniendo las once fuentes, AV válido con JEV fallido y rechazo de guardado obsoleto. H01–H04 y los seis casos semánticos nuevos ya tienen representación en 1.0.0. Las muestras adicionales amplían las pruebas técnicas y no bloquean el acuerdo ni añaden funcionalidad.

## Comparación histórica de los dos borradores desde el consumidor FE

En una etapa anterior de FE 1.1, `origin/main` estaba en `91f4c5a` y contenía dos propuestas. El borrador de `docs/contracts/` era draft.1; el archivo agregado por `ae6b1a0` en `openspec/contract/` no se podía cargar como JSON: error al final, línea 364, columna 1. La matriz siguiente conserva esa comparación **histórica**, basada en el texto de la segunda propuesta. La conciliación mantuvo como única fuente activa `docs/contracts/openapi.json`, primero en draft.2 y ahora acordada en 1.0.0; el [registro de retiro y referencia Git](../openspec/contract/README.md) conserva el antecedente sin otro contrato API operativo.

| Aspecto | Borrador inicial `docs/contracts/`, draft.1 | Segundo borrador histórico `openspec/contract/` | Comportamiento preservado por la conciliación actual |
| --- | --- | --- | --- |
| Acceso | `DemoBasic`, validación en Next y Python, Origin y headers privados. | `DemoApiKey` con `X-DEMO-CRED`, sin la misma norma de origen/cache. | La fuente activa conserva Basic sobre HTTPS con origen/cache privados para ambos servicios. FE no combina dos mecanismos. |
| Ventanas | `previous/recent`, siete días cada una, Bogotá y corte desde inicio de ejecución. | Arreglo `Window[]`, zona de ejemplo y `reference_time` editable. | Conservar las dos semanas completas, excluir hoy y recuperar el corte original. Una fecha arbitraria no se acepta como una ejecución nueva del recorrido acordado. |
| Cobertura y faltantes | `Count` known/unknown, total separado de observado y 22 celdas por fuente/ventana. | `Signal` con dos enteros requeridos y cobertura `retrieved/item_count`, sin las mismas etapas analíticas. | Desconocido distinto de cero, once fuentes previstas y parcial sin porcentaje/novedad. No introducir ceros para adaptar el segundo modelo al primero. |
| Evidencia y decisiones | Observaciones audiovisuales con segundos, dimensión, origen y revisión; decisiones tipadas separadas. En esta etapa inicial faltaban H02/H03. | `timestamps` con formato de fecha calendario, pertinencia booleana y metadatos de evidencia libres. | Posición dentro del video, evidencia inspeccionable, insuficiencia distinta de fallo y valor/afinidad separados; draft.2 añade la procedencia H02/H03. No reconstruir campos faltantes en React. |
| Confirmación y revisión | Confirmación de propuesta/versionado común; análisis y revisión con control optimista. | Confirmación por grupo y análisis global por video; no operación de revisión editorial equivalente. | Misma versión para ambas semanas, confirmación separada de decisión editorial, motivo persistido y análisis exacto. `confirmed_by` no acredita identidad individual con credencial compartida. |
| Reintentos y paginación | Clave idempotente, revisiones, claim/reserva y cursor/snapshot. | Sin controles equivalentes declarados; listado por offset. | Offset no es un error por sí mismo, pero necesita una regla de recorrido consistente. Ninguna adaptación permite repetir consumo, liberar un incierto o mezclar snapshots. |
| Selección y ejecución | Catálogo elegible, selección sin consumo y avance explícito por unidad. | Adquisición/análisis responden «encolado»; falta consulta equivalente de operación por ejecución. | Cualquier elegible sin exigir crecimiento, trabajo acotado persistido y GET sin consumo. No prometer un worker que no forma parte de la arquitectura. |
| Correlación | `Meta.request_id`, `operation_id`, `run_id` y versiones con funciones diferentes. | `trace_id` opcional sin ciclo de vida acordado. | La fuente activa conserva sus identidades diferenciadas. El `trace_id` histórico no se mapea como sinónimo de request, ejecución, operación o clave idempotente. |

**Resultado para FE:** la conciliación autorizada conservó esos comportamientos en draft.2 y retiró la otra propuesta del árbol activo. La versión común es ahora 1.0.0, con revisión asistida ALG documentada por mandato del usuario. FE consume esa única fuente sin un adaptador entre borradores; esta matriz histórica no acredita pruebas del producto ni una firma de los demás integrantes.

## Registro del patch aplicado para resolver los hallazgos

El avance de FE produjo un [JSON Patch](FE_1_1_CAMBIOS_PROPUESTOS.patch.json), expresado como una secuencia de cambios sobre draft.1 conforme al [formato RFC 6902](https://www.rfc-editor.org/rfc/rfc6902). **Sus 46 operaciones se aplicaron por autorización del usuario y se publicaron en draft.2**, con actualización de versión en metadatos, headers y ejemplos. El archivo queda como registro histórico de cambios, no otra API ni un endpoint PATCH del producto; BE conserva la autoría del transporte.

La base histórica del patch es `0.1.0-draft.1`, hash `76f34a51c2ff5934f52005c0c4227185ef37d457224c55fa2a8fc2e9a7dd5d98`. El candidato se comprobó primero en un directorio temporal y después se promovió el contrato a draft.2. **No volver a aplicar este patch sobre draft.2 ni 1.0.0**: su guarda exige draft.1 y sus operaciones registran una transformación ya incorporada. El acuerdo semántico y de consumo posterior se registra sobre 1.0.0.

| Hallazgo resuelto | Comportamiento incorporado y aceptación documental para FE |
| --- | --- |
| H01 | `Run.operations_to_inspect` y el envelope `AnalysisResponse.operations_to_inspect` devuelven referencias consultables, incluida una incierta sin checkpoint. Se consulta `getOperation` por el ID recuperado, sin POST ni liberación de reserva. El estado operativo actual queda fuera del snapshot `Analysis`. |
| H02 | `Groups.generation_trace` conserva llamadas efectivas de Gemini con modelo, versión de prompt, criterios y momento usados. Admite lotes/conciliación; si hay temas exige al menos una traza. Una propuesta vacía permite cero trazas y no obliga a inventar una llamada. |
| H03 | `UnavailableAssessment.trace` admite `JevAttemptTrace` parcial: antes del envío, después o confirmación desconocida. Campos no conocidos permanecen null y `decision` sigue null. `not_sent` prohíbe ID y respuesta de proveedor para impedir una procedencia contradictoria. |
| H04 | `AnalysisResponse.current_actions` representa capacidades actuales, fuera del snapshot; el histórico devuelve []. Los hechos y su revisión se conservan, incluso si `data.allowed_actions` refleja capacidades capturadas antes. FE usa la lista actual del envelope y para editar recupera la versión vigente. |

**Estado actual:** H01–H04 permanecen resueltos en la versión común 1.0.0. El cierre contractual de G0 procede de los registros de revisión y acuerdo, no del patch histórico por sí solo. FE 1.1 completa sigue pendiente de su segundo hito técnico.

### Comprobaciones históricas de la conciliación draft.2

El patch contenía **46 operaciones**, con guarda de versión base. Antes de incorporarlo, una aplicación independiente sobre una copia produjo el mismo candidato que la preparación original. SHA-256 del patch histórico: `c60fec194345b01c77a90f0f8a270314fbbf412d033061539e48cd12d0b8c403`; candidato temporal previo a promover la versión: `21bdcc283ce349df9ecfd8ca3e2265c0d84b2159ed45d48ec9db2470b1a507a4`. Draft.2 quedó en SHA-256 `2b384d99c7a2a8f99fcc9375ae8e045af910128686d54fab761d75be256b1808`. La tabla conserva los resultados de esa etapa histórica de 68 ejemplos; las comprobaciones actuales de 1.0.0 y sus 74 ejemplos se registran en [VALIDACION.md](contracts/VALIDACION.md).

| Comprobación del candidato y repetida en draft.2 | Resultado observado |
| --- | --- |
| Modelos y ejemplos | 94 esquemas, 68 ejemplos sintéticos: ocho ejemplos adicionales a los sesenta de base. |
| Restricciones usadas, con Ajv 6.15.0 existente | 68/68 ejemplos aceptados y 9/9 negativos anteriores rechazados. Subconjunto compatible con draft-07; no es validación completa OpenAPI 3.1/2020-12. |
| Proyección Pydantic 2.14.0, Python 3.12.14 | 68/68 ejemplos aceptados en modo estricto y 4/4 negativos anteriores rechazados. No aplica por sí sola condiciones `allOf/if/then` ni todas las reglas entre campos. |
| Proyección TypeScript 5.9.3 | Compilación estricta sin emisión de los 68 ejemplos y siete errores esperados mediante `@ts-expect-error`. No valida JSON durante la ejecución ni formatos/condiciones semánticas. |
| Seis negativos específicos de H01–H03 | Rechazados: referencia de operación sin ID, traza de grupos atribuida a JEV, temas no vacíos sin traza, respuesta de proveedor en intento no enviado, ID de proveedor en intento no enviado y fallo convertido en decisión negativa. |
| Propuesta vacía | Aceptada sin traza de generación cuando no hay temas; no fuerza una llamada Gemini ficticia. |
| Integridad de snapshots | `AnalysisWithRetainedOperation.data` conserva exactamente `SelectedAnalysis.data`; el histórico conserva `AudiovisualFailure.data` y expone `current_actions=[]`. La referencia retenida coincide con el ejemplo de lectura de su operación. |
| Fuentes y revisiones en esa etapa | Las correcciones se incorporaron en draft.2 y FE emitió conformidad documental; entonces ALG 2.1 y G0 seguían pendientes. Más adelante se registró su cierre contractual en 1.0.0. No se instalaron herramientas, iniciaron servicios o llamaron proveedores. |

Los ocho ejemplos incorporados en `components.examples` de draft.2 son `RunAfterLostResponse`, `RunWithUncertainOperation`, `AnalysisWithRetainedOperation`, `RetainedAnalysisOperation`, `GroupsWithGenerationTrace`, `JevFailureBeforeSend`, `JevFailureAfterSend` y `AnalysisHistoricalReadOnly`. El patch conserva su adición histórica; el candidato previo y las proyecciones se mantuvieron en `/private/tmp/fe11-proposal/`, sin crear otra API versionada.

Las herramientas y límites están en [VALIDACION.md](contracts/VALIDACION.md). Las comprobaciones estructurales no acreditan recuperación HTTP real, persistencia, exactitud del análisis o fidelidad empírica del modelo. La revisión semántica asistida se registra por separado. El segundo hito FE 1.1 usará el contrato 1.0.0 después de 1.2, con validación del consumidor en la aplicación.

## Criterio de salida y estado de la tarea

El contraste documental de FE-C01–C09 y los casos aplicables es **favorable sobre 1.0.0**, con H01–H04 preservados y guardas semánticas/editoriales acordadas. Los registros de revisión asistida ALG y acuerdo BE cierran G0 contractual por autorización del usuario. FE-C10/FE-A20 mantienen Notion fuera del núcleo. BE 3.2 y las verificaciones de acceso, persistencia y gasto siguen pendientes; el cierre de contrato no las sustituye.

El segundo hito de FE 1.1 sigue después de la base 1.2: tipos consumidores y validación de respuestas durante la ejecución, con comprobaciones del contrato acordado. La casilla completa sigue abierta hasta verificar ambos hitos.

**Avance acumulado:** revisión documental de diez necesidades, veinte casos y ocho observaciones; H01–H04 resueltos; revisión semántica/interfaces ALG 2.1 registradas y contrato único acordado 1.0.0, con G0 contractual cerrado. **FE 1.1 completa sigue abierta**: la siguiente construcción será 1.2, después el hito técnico de tipos/validación de 1.1 y luego 1.3. Este ajuste no inicia Next.js ni implementa endpoints, infraestructura o proveedores; BE 3.2 permanece como control previo de cualquier consumo pagado.
