# FE 1.1 — Revisión de consumo del contrato API

**Fecha:** 17 de octubre de 2026, America/Bogota. **Responsable:** FE, usuario solicitante.

**Estado:** revisión documental de FE realizada sobre [openapi.json](contracts/openapi.json), versión `0.1.0-draft.1`, con observaciones abiertas. Se contrastaron diez necesidades y veinte casos con las operaciones, campos, estados, errores y ejemplos del borrador. **No se emite conformidad final de consumo:** quedan los hallazgos H01–H03 para BE y la revisión semántica ALG 2.1. G0 permanece abierto y el segundo hito técnico de FE 1.1 no se ha iniciado.

**Versión examinada:** SHA-256 `76f34a51c2ff5934f52005c0c4227185ef37d457224c55fa2a8fc2e9a7dd5d98`. Esta revisión no modifica el contrato ni sus ejemplos; su [autoridad y política de versiones](contracts/README.md) permanecen en BE. La autorización de esta sesión cubre FE 1.1 documental; no autoriza iniciar 1.2, implementar otras tareas BE ni reintentar la instalación cancelada de validadores.

**Integración posterior desde `main`:** el commit remoto `ae6b1a0` añadió [openspec/contract/backend-contract-openapi.json](../openspec/contract/backend-contract-openapi.json). Ese segundo borrador se conserva sin modificar y queda fuera de esta revisión: tiene transporte/autenticación distintos y un error de sintaxis JSON al final. BE debe corregirlo y conciliar las propuestas antes de publicar la versión común. El hash y los dictámenes de este documento siguen referidos únicamente al borrador de `docs/contracts/`; no constituyen conformidad con el archivo remoto.

Este es el entregable de revisión de FE, no un contrato API alternativo. Backend conserva la autoría de rutas, métodos, nombres de campos, esquemas y versiones. Esta revisión no crea endpoints ni tipos consumidores del frontend. Las proyecciones temporales usadas antes para comprobar BE 3.1 no completan el segundo hito FE; sus ejemplos siguen siendo sintéticos.

## Resultado de la inspección inicial

| Verificación realizada | Resultado |
| --- | --- |
| Buscar contrato API, OpenAPI o esquemas de integración en el repositorio y consultar al usuario | En la inspección inicial no había borrador, confirmado por el usuario. Después se priorizó BE 3.1: existe el borrador enlazado arriba, todavía sin acuerdo o implementación. |
| Revisar tareas y dependencias | FE 1.1 tiene revisión documental previa a G0 y tipos/validación posteriores a 1.2. Se emite la revisión con observaciones; la conformidad y el segundo hito siguen pendientes. |
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

«Cubierto documentalmente» significa que el borrador permite definir el consumidor; no acredita implementación, revisión ALG o acuerdo de G0.

| Observación | Resultado del contraste | Dueño del pendiente |
| --- | --- | --- |
| FE-O01 — Autoridad y versión | Cubierto: fuente única, versión, hash, política y alcance interno/BFF identificados. Falta la versión común acordada; no se cierra BE 3.1 por esta revisión. | BE 3.1 tras revisiones. |
| FE-O02 — Faltantes y estados | Cubierto: `Metric`, `Duration`, `Count`, `Stage` y assessments separan cero, null, insuficiencia y fallo; `PartialSignal` prohíbe porcentaje. La semántica de ALG sigue pendiente. | ALG 2.1; validación durante implementación. |
| FE-O03 — Identidades y versiones | Cubierto: ejecución/captura/grupos/análisis/revisión tienen identidades y versiones; PUT controla ambas revisiones y devuelve 409. Consulta histórica con cautela de consumo H04. | BE aclara H04; FE conserva lectura histórica sin acciones. |
| FE-O04 — Decisión editorial | Representación consumible pero todavía propuesta: `pending_review`, `consider_for_adaptation`, `discarded`, con motivo y sin aprobación automática. Esta revisión no ratifica semántica ni añade estados. | BE y revisión semántica/producto antes del acuerdo. |
| FE-O05 — Listados y detalle | Cubierto: cursor, límite, fin con null, `snapshot_revision`, detalle y 409 al mezclar snapshots. Faltan ejemplos de paginación para el posterior consumo técnico. | BE ejemplos; FE verificación técnica después de 1.2. |
| FE-O06 — Avance y reintentos | Parcial: scope, clave, claim/reserva, operaciones running/blocked/uncertain y siguiente unidad están descritos. H01 impide descubrir la operación retenida mediante lectura tras perder su ID. | BE 3.1, H01. |
| FE-O07 — Acceso | Cubierto documentalmente: Basic en ambos servicios, Origin, headers privados, Route Handlers y variables sin valores secretos. Binding efectivo y pruebas reales siguen en BE 3.3/3.6 y FE 1.3. | BE/FE en sus tareas de implementación. |
| FE-O08 — Evidencia y revisión | Parcial: observaciones, marcas, motivos, traza de decisiones válidas y revisión independiente representables. Faltan procedencia de agrupación y traza del intento JEV fallido (H02/H03). | BE 3.1 con revisión ALG 2.1. |

## Correspondencia con pantallas y operaciones

Los identificadores siguientes son los `operationId` y esquemas existentes en OpenAPI, no nuevas rutas o contratos.

| Necesidad | Pantalla/flujo FE | Operaciones y datos del borrador | Dictamen documental |
| --- | --- | --- | --- |
| FE-C01 | Ejecuciones y recuperar una anterior | `createRun`, `listRuns`, `getRun`; `run_id`, `revision`, `started_at`, ventanas y corpus. Crear con nueva clave es distinto de recuperar. | Cubierto. |
| FE-C02 | Estado y reanudación | `advanceRun`, `getOperation`; `Operation`, `last_checkpoint`, `allowed_actions`, scope y política de reintento. | Con reserva H01: consulta de la operación tras recarga. |
| FE-C03 | Cobertura por canal/semana | `getCoverage`, `getRun`; 11 fuentes y 22 celdas con etapas, paginación y faltantes. | Cubierto; no usar AV/afinidad para reducir cobertura temática. |
| FE-C04 | Inspección y confirmación de grupos | `getGroups`, `confirmGroups`; `Groups`, `Assignment`, evidencia y `Confirmation`. Sin endpoints de edición manual. | Consumo cubierto; procedencia de generación pendiente H02. |
| FE-C05 | Comparación temática | `getComparison`; variantes de `TopicSignal`, IDs y `by_source`. | Cubierto; FE no recalcula ni infiere novedad desde dos observados parciales. |
| FE-C06 | Catálogo y seleccionar pieza | `listEligibleVideos`, `getVideo`, `selectAnalysis`; `Publication`, candidato/Short y pertinencia. | Cubierto sin exigir grupos o aumento; traza de fallo JEV pendiente H03 en detalle. |
| FE-C07 | Ficha y evidencia | `getAnalysis`, `getGroups` de la ejecución original; dimensiones, evidence, model_uses, decisiones, señal snapshot e hipótesis/adaptación. | Representable con reservas H02/H03 y pauta histórica H04. |
| FE-C08 | Decisión y revisión de evidencia | `getReview`, `recordReview`; `expected_analysis_version`, `expected_review_revision`, motivo y una entrada por evidencia. | Cubierto; semántica de enums pendiente de acuerdo, historial solo lectura según H04. |
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
| FE-A07 | `Assignment.secondary_topic_ids`, `Count.video_ids/by_source` y regla normativa del principal. | Representación cubierta; falta ejemplo con secundarios no vacíos y aporte solo al principal para consumo técnico. |
| FE-A08 | `Signal_2_4`. | Cubierto: +2 y +100 %, con IDs de respaldo. |
| FE-A09 | `Signal_2_0`. | Cubierto: −2 y −100 %, sin señal creciente. |
| FE-A10 | `Signal_0_3`, variante `NewInCorpusSignal`. | Cubierto: nuevo, +3 y porcentaje null con razón `zero_baseline`. |
| FE-A11 | `Signal_0_0`, variante `EmptySignal`. | Cubierto: sin publicaciones/novedad y sin porcentaje. |
| FE-A12 | `SignalUnknownBaseline`, `SignalPartialNumeric`, `PartialComparison`. | Cubierto: incluso observados 2/4 parciales mantienen delta/% null para el corpus completo. |
| FE-A13 | `AudiovisualFailure`; metadatos, dimensiones insuficientes y señal conservados. | Cubierto para fallo AV. Fallo JEV y su intento requieren H03. |
| FE-A14 | Tres ejemplos `Value_*`, `AnalysisWithEvidence`, `PillarOther`, `PillarInsufficient`. | Enums/campos separados consumibles. Faltan fichas completas con afinidad insuficiente/no respaldada; semántica pendiente ALG 2.1. |
| FE-A15 | `AnalysisWithEvidence`, `Evidence`, `EvidenceReview`, `Hypothesis`, `Adaptation`. | Cubierto: original/marca, estado de revisión y sugerencia diferenciados. H02/H03 afectan trazabilidad de otros procesos. |
| FE-A16 | `InitialReview`, `DiscardRequest`, `SavedReview`, `Error_VERSION_CONFLICT`, control optimista en README. | Pendiente inicial y guardado representables, con pauta H04. Falta ejemplo enlazado v1→v2 y rechazo de guardado obsoleto. |
| FE-A17 | Errores comunes y regla de no anunciar guardado sin respuesta. | Contrato cubierto; conservar texto es responsabilidad del formulario FE, todavía sin implementar. |
| FE-A18 | `RunList`, `getAnalysis/getReview`, fecha/versiones persistidas. | Recuperación de resultados representable, pero recuperación de operación activa/incierta incompleta: H01. No se probó persistencia. |
| FE-A19 | GET sin efectos, `Advance*`, `Operation_*`, errores con ID y matriz de reintentos. | Replay/siguiente unidad cubiertos; la entrada tras recarga sin conocer operación sigue pendiente H01. |
| FE-A20 | `Capabilities` con Notion diferido; 501/503 y reglas de conservación. | Cubierto para núcleo independiente. No hay éxito externo verificado y no se exige implementarlo ahora. |

## Hallazgos para Backend y pauta de consumo

### H01 — P1: la operación activa o retenida no se descubre al recuperar la ejecución

**Ubicación:** `#/components/schemas/Run/properties`, `#/components/schemas/Analysis/properties` y `getOperation`. **Afecta:** FE-C02, FE-A18/A19, FE-O06.

Escenario: el primer `advanceRun` reclama trabajo; se pierde su respuesta y se cierra el navegador. Desde otro equipo, GET de ejecución/análisis no devuelve la identidad de esa operación. `last_checkpoint` solo identifica trabajo confirmado y puede ser null; `getOperation` exige un ID conocido y no hay un listado de operaciones. El error con `operation_id` obligatorio ayuda al caller que recibió ese error, pero no resuelve por lectura este caso. Forzar otro POST para descubrirlo contradice el recorrido que exige solo consultar una operación running/incierta.

**Solicitado a BE 3.1:** exponer mediante lectura una referencia de la operación activa/retenida relevante, o una consulta GET equivalente. BE elige el transporte sin delegar a FE un ID inventado o un avance para obtenerlo. **Aceptación documental:** ejemplo de primera operación sin checkpoint, respuesta perdida y recuperación desde otro equipo que permita llegar por GET a su estado running/uncertain, sin proveedor, nuevo claim o liberación de reserva. Este punto requiere corrección antes de dar conformidad de consumo a la recuperación.

### H02 — P2: falta procedencia del modelo que generó los grupos

**Ubicación:** `#/components/schemas/Groups/properties` y `ProposedGroups`/`ConfirmedGroups`. **Afecta:** FE-C04/C07, FE-O08 y contexto recuperable de FE-A18.

La propuesta expone criterios y versiones de clasificación, pero no el modelo Gemini ni la versión de prompt usados para generarla. Ni `Run` ni `Operation` completan esa procedencia. FE puede mostrar la versión del grupo, pero no recuperar el modelo asociado al resultado conforme al diseño y la persistencia de contexto.

**Solicitado a BE 3.1 con ALG 2.1:** traza de generación referenciable o datos de procedencia en la propuesta, distinguiendo versión de grupos, criterios y modelo/prompt efectivamente usados. **Aceptación documental:** desde la propuesta confirmada de una ejecución anterior se recuperan esos datos sin inventarlos ni usar el modelo actualmente configurado. No se solicita que FE seleccione modelos o implemente prompts.

### H03 — P2: un intento JEV fallido no admite su traza parcial conocida

**Ubicación:** `#/components/schemas/UnavailableAssessment/properties/trace`, fijo a null; ejemplo `JevFailure`. **Afecta:** FE-C06/C07, FE-O08 y representación de errores con contexto.

Si se envió una pregunta de pertinencia y JEV falla, la representación permite motivo y decisión nula, pero obliga a perder del transporte los datos conocidos del intento: pregunta, material de entrada, modelo/criterios o identificador de petición, si llegó a existir. `Publication` no ofrece otra referencia a ese intento. Esto impide inspeccionar esa procedencia desde el detalle, aunque no haya una respuesta válida.

**Solicitado a BE 3.1 con ALG 2.1:** distinguir traza de intento parcial de traza de decisión auténtica, conservando solo lo conocido; respuesta ausente sigue ausente y `decision` continúa null. No rellenar modelo o request ID si el fallo ocurrió antes de obtenerlos. **Aceptación documental:** dos ejemplos, fallo previo al envío y fallo después del envío, con material/modelo conocido donde corresponda, sin convertirlos en decisión insuficiente simulada.

### H04 — P2, no bloqueante con pauta FE: acciones en versiones históricas

**Ubicación:** `Analysis.allowed_actions` y parámetro `analysis_version` de `getAnalysis/getReview`. El snapshot de v1 puede contener `record_review` o `advance_analysis` aunque ya exista v2, mientras el PUT solo admite la última versión. Falta una regla explícita del contrato que distinga capacidades actuales de capacidades guardadas.

**Pauta FE documental:** toda consulta explícita con `analysis_version` se trata como lectura histórica, sin controles de mutación, aunque el snapshot enumere acciones. Para editar se vuelve al GET sin ese parámetro y se usa la última versión devuelta; el control optimista conserva la protección ante carreras posteriores. Esto permite consumir el borrador sin inventar un campo `is_current` ni añadir una pantalla de historial. BE debe confirmar/aclarar la norma y aportar un ejemplo v1 recuperada después de v2 antes del acuerdo común; si decide cambiar transporte, publica nueva versión. Esta pauta no implementa controles de UI ahora.

## Decisiones de consumo que ya pueden prepararse documentalmente

- Resolver nombres temáticos mediante `getGroups` de la **ejecución original**, con clave compuesta `(run_id, groups_id, groups_version, topic_id)`. No cachear solo por `topic_id` ni consultar los grupos de la última ejecución global al abrir una ficha anterior. La regla de reclasificar en una nueva ejecución conserva el contexto de la antigua.
- Presentar `observed_count` como parcial cuando corresponda y `total_count=null` como desconocido; nunca derivar porcentaje o «nuevo» en React. Las estadísticas de YouTube son cadenas decimales; no convertirlas sin control a números que pierdan precisión.
- Seleccionar crea el análisis pendiente; `advanceRun` con scope analysis solicita el trabajo. Abrir ficha, listar, recargar o hacer polling solo lee. Respetar acciones permitidas y motivos; no inventar ETA ni actividad en segundo plano.
- Ante `VERSION_CONFLICT`, conservar motivo y revisión local sin confirmar. Recuperar la última ficha y su revisión antes de decidir un nuevo envío; no interpretar el único `current_revision` del error como si representara a la vez versión de análisis y revisión editorial. No reenviar automáticamente.
- Mantener la misma clave y cuerpo para recuperar una respuesta perdida; para la siguiente unidad permitida usar clave nueva y revisiones actuales. En incertidumbre, consultar y esperar reconciliación BE. H01 todavía impide descubrir el ID por lectura en el caso descrito.
- Renderizar razones, modelos y evidencias como datos externos, no como instrucciones; separar observaciones, hipótesis y sugerencias. La evaluación de valor no es una verificación externa de todas las afirmaciones del video.

## Ejemplos pendientes para el consumo técnico posterior

BE conserva los ejemplos canónicos dentro de OpenAPI; esta revisión no crea fixtures competidores. Antes de verificar el consumidor técnico conviene completar: dos páginas y conflicto de cursor; grupos sin propuesta por insuficiencia/fallo; catálogo elegible vacío manteniendo once fuentes; principal con secundarios no vacíos; JEV que responde pertinencia insuficiente frente a error; AV válido con JEV fallido; ficha con afinidad no respaldada/insuficiente; nueva versión de análisis con revisión reiniciada; lectura histórica y guardado obsoleto. Los ejemplos específicos de H01–H03 sí acompañan sus correcciones para dar conformidad documental. Las demás muestras amplían las pruebas técnicas y no se presentan como requisitos de funcionalidad nuevos.

## Criterio de salida y estado de la tarea

El hito documental puede cerrarse cuando BE publique el borrador, se contrasten FE-C01–C09 y los casos aplicables, se resuelvan las observaciones esenciales con ALG y BE registre una versión acordada. FE-C10/FE-A20 no obligan a implementar Notion para cerrar G0.

El segundo hito de FE 1.1 sigue después de la base 1.2: tipos consumidores y validación de respuestas durante la ejecución, con comprobaciones del contrato acordado. La casilla completa sigue abierta hasta verificar ambos hitos.

**Entrega de esta sesión:** revisión documental emitida con matrices de diez necesidades, veinte casos y ocho observaciones, tres hallazgos pendientes de BE/ALG y una aclaración histórica con pauta FE. La conformidad final queda pendiente de H01–H03, aclaración H04, revisión ALG 2.1 y versión común registrada por BE. **FE 1.1 completa sigue abierta** porque además faltan 1.2 y su segundo hito de tipos/validación durante la ejecución. La autorización actual no incluye empezar 1.2; tampoco se cierra G0 ni se cambia el contrato para resolver estos hallazgos por cuenta de FE.
