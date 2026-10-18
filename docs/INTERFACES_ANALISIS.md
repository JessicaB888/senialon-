# ALG 2.1 — Interfaces del módulo de análisis

**Estado:** especificación de interfaces para el acuerdo de integración. No implementa algoritmos, adaptadores ni proveedores. La versión HTTP vigente y sus tipos pertenecen a [OpenAPI](contracts/openapi.json); este documento define el límite interno entre ALG y BE, sin crear otra API.

El usuario autorizó continuar ALG 2.1 y cerrar el contrato. Esta revisión asistida por Codex no representa una firma o intervención de los otros integrantes. La [revisión semántica](REVISION_SEMANTICA_ALG.md) registra el contraste y el [registro de acuerdo](contracts/README.md) identifica la versión común.

**Entrega posterior ALG 2.2:** `analysis.derive_windows` ya está implementada y verificada localmente en [backend/analysis](../backend/analysis/README.md). Recibe un `datetime` con zona conocida y devuelve `Windows` serializable con instantes UTC y `timezone=America/Bogota`. BE debe persistir sus fronteras una vez y entregarlas sin recalcular a adquisición, conteos y FE. Las otras operaciones de esta interfaz continúan pendientes; esta entrega no implementa inferencia, endpoints o persistencia.

**Entrega posterior ALG 2.5:** `analysis.count_publications` recibe `AnalysisContext` y los registros canónicos de grupos confirmados, publicaciones y cobertura. Devuelve `CountSnapshot` interno con `Count` por tema/ventana, fuentes, IDs y contexto exacto. `AnalysisContext` conserva también `input_version` e instante de procesamiento aportados por BE. Ver [reglas y pruebas](../backend/analysis/README.md). Es código puro de dominio; la clasificación, generación de grupos y ruta real de integración conservan sus tareas. BE valida las formas del contrato y ALG sus relaciones, sin crear otra API.

**Entrega posterior ALG 2.6:** `analysis.compare_topics` consume ese `CountSnapshot`, grupos confirmados y cobertura del mismo contexto, con `comparison_revision` reservada por BE. Produce `Comparison` canónica y señales permitidas; parciales sin diferencia, porcentaje o novedad del corpus completo. Conserva las ventanas al procesar en otra fecha. Ventanas, conteos y comparación son funciones puras disponibles; las operaciones de inferencia y la integración real continúan pendientes.

## Propiedad y convenciones

ALG implementará `backend/analysis/**`; BE implementará los adaptadores inyectados, la serialización HTTP, persistencia, reclamaciones y gasto. Los nombres siguientes son interfaces internas a implementar, no endpoints, archivos ya creados ni métodos de un SDK externo. Los tipos públicos se referencian por su nombre en `components.schemas` de OpenAPI; sus enums, campos requeridos y nulabilidad no se duplican aquí.

Cada llamada de análisis recibe un contexto con `run_id`, `Windows` y `Versions` persistidos, una `input_version` que identifica exactamente sus entradas y el instante de procesamiento suministrado por BE. Las operaciones sobre una pieza incluyen `analysis_id`, la versión de entrada y la siguiente versión reservada por BE. Las operaciones de grupos incluyen el ID y la versión de propuesta reservados por BE. ALG no consulta un reloj global, la base de datos o variables de entorno para reconstruir ese contexto.

Los registros de entrada son inmutables durante la unidad. Si cambian publicaciones, grupos, criterios o material, BE proporciona otra versión de entrada; no se mezclan resultados ni se actualiza una versión histórica en una lectura. Las funciones puras no reciben puertos ni hacen llamadas externas. Las funciones con inferencia reciben exclusivamente los puertos descritos abajo y trabajan una unidad acotada definida por BE.

## Entrada desde adquisición y elegibilidad

BE entrega las publicaciones con sus campos `Publication`, las fuentes previstas y las 22 celdas `CoverageCell`. Los campos aún no resueltos mantienen sus estados originales. Incluye el material textual disponible y un catálogo de `Evidence` con IDs, video, fuente y captura; un texto resumido por un modelo no se presenta como cita literal del original.

La entrada interna añade `technical_eligibility`, con `state=eligible|excluded|pending` y motivo, por publicación. Es el resultado de BE sobre condición pública, duración y fecha, antes de la pertinencia IA. No se añade ese campo al esquema HTTP. `CoverageCell.eligibility` describe esta etapa técnica; `Publication.eligibility` describe la elegibilidad final.

| Situación | Entrada a pertinencia / resultado final | Efecto sobre cobertura |
| --- | --- | --- |
| Público, duración conocida hasta 180 s y fecha dentro de una ventana | Técnicamente apto; puede entrar en `classify_ai` aunque `Publication.eligibility` todavía sea `pending`. | Falta resolver IA; no esperar elegibilidad final para llamar a JEV. |
| JEV devuelve `relevant` auténtico | Elegibilidad final `eligible`; seleccionable sin exigir tema o comparación. | Falta tema principal si no está resuelto; audiovisual y afinidad no intervienen. |
| JEV devuelve `not_relevant` auténtico | Elegibilidad final `excluded`, con evidencia y motivo. | Pertinencia resuelta; no exige asignación temática. |
| JEV devuelve `insufficient_information` | Decisión auténtica insuficiente; elegibilidad final `pending`. | Pertinencia no resuelta para conteos. `decided` no equivale a cobertura completa. |
| JEV no devuelve una decisión válida | Assessment sin decisión, con el estado y la traza conocidos; elegibilidad final `pending`. | Error o incertidumbre se conserva; no se convierte en exclusión, cero o una respuesta insuficiente inventada. |
| Duración mayor de 180 s, fecha fuera de ventanas u otra exclusión técnica respaldada | Excluido sin exigir JEV o tema. | Etapas posteriores no aplicables justificadas; no se inventan llamadas. |
| Fecha pública o duración desconocidas | Pendiente técnico; no adivinar desde fecha de playlist o valores cero. | El ID permanece visible. Si no puede situarse temporalmente, limita ambas ventanas posibles de su fuente hasta resolverlo o excluirlo con respaldo. |
| Canal consultado por completo sin piezas técnicamente aptas | No hay material que clasificar. | Etapas sin entradas pueden cerrarse como completas sin trabajo o `not_applicable` con motivo; no son una falla de acceso. |

Un campo de fecha desconocido no autoriza a omitir el ID y declarar completas las dos ventanas. Una exclusión verificable sí puede resolverlo. La cobertura se limita siempre a contenido público recuperable en la captura, sin prometer un archivo de videos eliminados.

## Operaciones que ALG entrega a BE

| Interfaz interna | Entrada requerida | Salida y postcondición | Implementación posterior |
| --- | --- | --- | --- |
| `derive_windows` | `started_at` con zona explícita. | `Windows`: dos semanas consecutivas de siete días completos en Bogotá, inicio inclusivo/fin exclusivo, sin día en curso. BE persiste el resultado una vez y lo reutiliza. Función pura. | ALG 2.2. |
| `classify_ai` | Contexto, una publicación técnicamente apta, evidencia textual disponible y especificación versionada de pregunta/criterios; puerto JEV. | `AiAssessment` y las evidencias de entrada referenciadas. Solo una respuesta válida produce `AiDecision`; los fallos conservan `decision=null`. BE integra la elegibilidad final con el resultado técnico. | ALG 2.3; adaptador BE 3.7. |
| `propose_topics` | Contexto común, publicaciones pertinentes disponibles de ambas ventanas, evidencias, IDs pendientes, límites de cobertura y propuesta/versión reservadas; puerto Gemini. | `GroupView`: propuesta `Groups` no confirmada o etapa sin propuesta con motivo. Incluye temas, variantes, asignaciones, evidencias, faltantes y `generation_trace` efectiva. Lotes y conciliación terminan en una versión común; no cambia clasificaciones manualmente. | ALG 2.4. |
| `count_publications` | Grupos confirmados exactos, sus asignaciones/evidencias, publicaciones de la misma ejecución y cobertura por ventana. | Conteos `Count` por tema/ventana con IDs distintos y `ChannelContribution`; secundarios no suman. Rechaza versión sin confirmar, referencias ajenas o mezcladas. Función pura. | ALG 2.5. |
| `compare_topics` | Conteos anteriores, grupos/confirmación exactos, cobertura y contexto. BE suministra revisión e instante del cálculo. | `Comparison` y sus `TopicSignal`: fórmulas y estados de base cero o parcial según la cobertura. No consulta proveedores. Los IDs de respaldo no se pierden. | ALG 2.6. |
| `observe_selected` | Selección persistida de una pieza elegible, contexto, URL pública, duración, material disponible y especificación versionada; puerto Gemini. | Material efectivamente procesado, `Stage` audiovisual, las seis `ObservationDimension`, `Evidence`, problema/aprendizaje respaldado si existe y `ModelUse`. Cada dimensión insuficiente o fallida sigue visible. No procesa otras piezas por defecto. | ALG 2.7. |
| `assess_editorial` | Selección, evidencia/material disponibles y preguntas/criterios versionados; puerto JEV. | `ValueAssessment` y afinidad con dos `FitAssessment` más `PillarAssessment`, separados. Cada juicio conserva su propia respuesta o intento; fallar uno no simula los otros. | ALG 2.8. |
| `synthesize_opportunity` | Observaciones, evidencia, decisiones JEV disponibles, métricas/señal con sus límites y especificación versionada; puerto Gemini. | `Hypothesis[]` y `Adaptation`, con procedencia/modelo. Adaptación completa exige ángulo, aporte respaldado, gancho y estructura; CTA es opcional. No recomienda solo por vistas/aumento ni rellena afirmaciones o juicios faltantes. | ALG 2.9. |

BE compone y persiste `Analysis`, revisiones, operaciones, metadatos y envelopes de respuesta; ALG no construye respuestas HTTP ni altera la decisión humana. Un fallo audiovisual conserva la publicación y señal ya sustentadas. Las funciones de conteo no esperan `observe_selected` ni `assess_editorial`.

## Puertos de proveedor inyectados por BE

Ambos puertos son contratos de aplicación, no promesas sobre campos o métodos del proveedor externo. BE 3.4/3.7 verificará la API y el modelo realmente habilitados y adaptará las solicitudes. Si no puede obtener la salida exigida, devuelve fallo/pendiente; no inventa una decisión ni sustituye JEV por Gemini. No se fija ahora un identificador de modelo, tarifa, timeout o volumen no comprobado.

### Contexto de una inferencia

Cada solicitud identifica ejecución, etapa/propósito, elemento, versión exacta de entrada, pregunta/prompt y criterios. Incluye `operation_id` de BE y el límite de ejecución suministrado por el orquestador. Los propósitos son distintos: pertinencia IA, valor, persona, contexto empresarial, pilar, lote temático, conciliación temática, audiovisual y síntesis.

BE deriva una identidad estable de subpaso a partir de ejecución, propósito, elemento, versión de entrada, pregunta/prompt y criterios; no basta usar «analysis + video + criterios». La identidad excluye `operation_id`, `request_id`, `Idempotency-Key`, instante del intento, límite de ejecución y presupuesto: son metadatos de entrega que pueden cambiar sin justificar otro consumo. Dos preguntas sobre el mismo video necesitan identidades distintas. Repetir la misma pregunta con las mismas entradas/versiones recupera su resultado, mientras cambiar pregunta, entrada o criterios identifica otra unidad explícita. El `operation_id` externo puede agrupar varios subpasos, pero no reemplaza sus identidades ni reservas.

Antes de **cada** llamada externa de pago, también dentro de un lote, el adaptador BE reclama la unidad y reserva costo atómicamente. Puede devolver un resultado ya persistido sin llamar al proveedor. ALG no administra saldo, libera reservas, reintenta transporte ni crea otra identidad para eludir un bloqueo. Si no cabe otra llamada en el paso acotado, BE conserva el checkpoint y habilita después otra mutación explícita. GET no ejecuta esos puertos.

### `JevDecisionPort`

La solicitud contiene contexto de inferencia, `question`, `input_text`, `question_version`, `criteria_version`, el enum esperado referenciado a OpenAPI y los IDs de evidencia que acompañan el texto. El material audiovisual llega aquí como texto observado con su evidencia; no como archivo de video. ALG es dueño del texto, opciones y significado; BE conserva lo efectivamente enviado.

| Propósito | Pregunta de integración | Salida esperada de OpenAPI |
| --- | --- | --- |
| Pertinencia | ¿La IA es central o se explica una aplicación concreta, más allá de una mención incidental? | `AiDecision.decision`: relevante / no relevante / insuficiente, según sus códigos canónicos. |
| Valor | ¿El material respalda un problema, aprendizaje o aplicación útil para líderes y equipos de LatAm? | `ValueDecision.decision`: aporte respaldado / utilidad no sustentada / insuficiente. |
| Persona | ¿Se respalda utilidad para la audiencia editorial descrita, sin inferir quién vio el video? | `FitDecision.decision`: respaldado / no sustentado / insuficiente. |
| Contexto empresarial | ¿Existe un contexto de aplicación empresarial o de equipo pertinente y respaldado? | `FitDecision.decision`, independiente del juicio de persona. |
| Pilar | ¿Cuál es el pilar principal respaldado o el aporte pertinente fuera de los cuatro aprobados? | `PillarDecision.decision`: cuatro pilares / otro pertinente / insuficiente. Otro pertinente describe el aporte en la explicación. |

Son preguntas de interfaz; las rúbricas y textos finales se implementan/versionan en 2.3/2.8 y se evalúan en 2.10. No se fijan umbrales de probabilidad ni se fuerza una respuesta positiva por falta de material. Si el proveedor usa etiquetas diferentes, BE necesita una correspondencia explícita y comprobada; nunca interpreta libremente una respuesta inválida como una etiqueta válida.

Una salida válida conserva decisión tipada, respuesta original y `JevTrace`; probabilidades e ID son null si no fueron informados. La explicación es un resumen de evidencia o síntesis Gemini atribuida aparte, no una explicación libre atribuida a JEV. Las notas humanas pertenecen a la revisión editorial y no editan estas clasificaciones.

### `GeminiAnalysisPort`

La solicitud contiene contexto de inferencia, tarea concreta, prompt y su versión, criterios, material permitido y esquema de salida esperado por ALG. Para agrupar recibe el material de ambas semanas y sus límites; para audiovisual una URL pública de la pieza seleccionada y las dimensiones requeridas; para síntesis evidencia y decisiones originales. BE no sustituye el prompt ni añade supuestas transcripciones.

La respuesta normalizada devuelve el contenido estructurado de esa tarea, salida original conservable, material/segmentos realmente procesados y procedencia. ALG valida el contenido, IDs y referencias antes de emitir `Groups` u observaciones/adaptación; BE valida de nuevo el transporte y persiste. Las llamadas efectivas producen `ModelUse`; la propuesta temática conserva sus trazas en `generation_trace`. Una llamada sin resultado válido queda como fallo, no como grupos vacíos o audiovisual completo.

### Resultado común de transporte

BE devuelve al puerto el estado `returned|failed|blocked|uncertain`, el estado de envío `not_sent|sent|unknown`, motivo cuando no hay resultado válido, instante e identificador de subpaso, modelo/ID conocidos, respuesta original disponible y uso informado. Los desconocidos son null, nunca valores por defecto supuestos. `returned` solo indica recepción: ALG todavía valida la estructura y el significado esperado. Una salida no válida conserva su original y no se promueve a decisión auténtica.

Los resultados JEV se proyectan en `JevTrace` si hay decisión válida, o en `JevAttemptTrace`/`UnavailableAssessment` si no la hay. Un intento no enviado no tiene ID ni respuesta del proveedor. Los detalles de fallos Gemini permanecen en la operación y el registro BE junto con el material/resultados previos; no se inventa un `ModelUse` completo cuando faltan sus datos. Un estado incierto mantiene la reserva y requiere conciliación BE antes de otro intento. ALG entrega ese estado y termina la unidad; no hace retry automático.

## Invariantes semánticas de integración

Estas comprobaciones entre entidades son responsabilidad de ALG antes de emitir el resultado y de BE al aceptar/persistirlo. Un schema JSON por sí solo no comprueba que una evidencia exista, que una fecha pertenezca a su ventana o que una clasificación sea fiel al video.

1. Mismos `run_id`, ventanas, corpus y versiones para publicaciones, grupos, confirmación y conteos; cada ID pertenece al material de esa ejecución. Los grupos anteriores no se consultan por el último resultado global.
2. Una asignación por video pertinente resuelto, principal existente y distinto de secundarios; temas secundarios existentes y sin repetición. Asignaciones y pendientes son disjuntos y cubren las piezas que requieren resolver tema. Una exclusión respaldada no exige tema ficticio.
3. Todo ID de evidencia referenciado existe en el catálogo conservado y corresponde al video y dimensión pertinentes. Un tema puede relacionar varias piezas; cada asignación conserva respaldo de su propia pieza. No convertir una hipótesis o síntesis en cita del original.
4. Los 22 pares fuente/ventana son únicos. `known` exige cobertura suficiente de las once fuentes de su ventana; no basta que un tema tenga IDs conocidos. Un pendiente técnico, pertinencia insuficiente o tema no resuelto mantiene desconocido el total afectado.
5. Los IDs contados son distintos, pertenecen a su ventana y principal confirmado; las contribuciones por canal particionan esos IDs y suman el observado. Cero observado con total desconocido no demuestra ausencia.
6. Comparación sin confirmar no tiene señales calculadas. Parcial solo muestra `comparison_pending` con delta y porcentaje nulos, incluso cuando una ventana sea conocida. Completa usa las fórmulas y reglas de cero de las specs, sin umbral, predicción o señal por formato.
7. Las seis dimensiones audiovisuales aparecen una vez cada una. Una dimensión completa tiene evidencia audiovisual de esa dimensión, de la misma pieza y dentro del material realmente procesado; fin no anterior al inicio. Metadatos solos no completan formato, audio o montaje.
8. Valor, persona, contexto y pilar son juicios independientes. `unsupported` exige material evaluado que no sustenta el encaje; falta de material permanece insuficiente o sin decisión. Ninguno altera el conteo. No hay exclusiones sociales automáticas, puntuación compuesta ni probabilidad de viralidad.
9. Hipótesis son posibles explicaciones con límites; la adaptación distingue lo sugerido de lo observado. Sus afirmaciones remiten a evidencia y no añaden cifras, causalidad, experiencia propia, recursos o urgencias no sustentados.
10. Revisión y confirmación son actos humanos separados, con motivo, IDs/versiones exactos y control optimista. Revisión inicial pendiente, evidencia inicialmente pendiente; otra versión de análisis inicia otra revisión. Consultar un histórico no lo reescribe ni habilita mutaciones.

## Verificación y transferencia

El [registro semántico](REVISION_SEMANTICA_ALG.md) y [VALIDACION.md](contracts/VALIDACION.md) distinguen ejemplos sintéticos revisados, restricciones comprobadas por esquemas y verificaciones que corresponden al producto posterior. Ningún ejemplo acredita acceso, gasto, inferencia o revisión humana real.

BE recibe estas interfaces y las preguntas/esquemas esperados para implementar 3.7/3.10/3.11. ALG implementa 2.2–2.9 con pruebas de sus invariantes y entrega evaluación real en 2.10–2.12. Cinco preguntas distintas sobre una misma pieza requieren cinco identidades; repetir una con las mismas entradas no crea una sexta llamada. Esa garantía de ejecución y gasto se prueba al implementar BE 3.10, no por cerrar este documento.

El acuerdo documental no configura YouTube/JEV/Gemini, PostgreSQL o Vercel ni sustituye las pruebas de accesos, fidelidad, persistencia y presupuesto. BE 3.2 continúa siendo requisito previo de cualquier prueba pagada y BE 3.10 de cualquier consumo de la aplicación. Notion conserva su prioridad final opcional.
