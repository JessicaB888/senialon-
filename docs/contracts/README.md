# Contrato API de SENIALON — BE 3.1

**Versión:** `0.1.0-draft.1`. **Estado:** borrador para revisión. **Fecha:** 17 de octubre de 2026, America/Bogota.

La única fuente de operaciones HTTP, entradas, salidas, enums y ejemplos es [openapi.json](openapi.json). BE mantiene ese archivo; los modelos Pydantic y los tipos consumidores TypeScript se derivan de él. Este documento explica sus reglas de uso y el proceso de acuerdo; no define un segundo esquema. Todavía no hay endpoints, base de datos o frontend implementados por este entregable.

La autorización recibida amplía temporalmente el trabajo de esta sesión a **preparar BE 3.1** para desbloquear la revisión de FE. No incluye las demás tareas de Backend, ejecutar el prototipo ni llamadas a proveedores. El borrador se basa en las seis specs actuales, el [diseño técnico](../../openspec/changes/definir-mvp-senialon/design.md) y las necesidades de [FE 1.1](../REVISION_CONTRATO_FRONTEND.md).

## Autoridad y revisiones pendientes

| Entrega | Estado y criterio de cierre |
| --- | --- |
| Borrador BE 3.1 | Publicado para revisión; compatibilidad estructural y ejemplos se registran en [VALIDACION.md](VALIDACION.md). No equivale a BE 3.1 completa. |
| ALG 2.1 | **Pendiente.** Revisar significado de estados, decisiones JEV, cobertura, interfaces internas y evidencia. Los modelos de transporte no reemplazan las interfaces de análisis de ALG. |
| FE 1.1, primer hito | **Pendiente.** Contrastar C01–C09 y A01–A19 con el borrador, registrar observaciones resueltas y conformidad documental. C10/A20 cubren Notion opcional. |
| Versión común y G0 | **Abiertos.** BE debe registrar la versión acordada y las revisiones reales. Los tipos programados de FE llegan después de 1.2, sin bloquear el acuerdo documental. El control previo de gasto de BE 3.2 sigue pendiente. |

Una revisión técnica asistida de este borrador no sustituye la revisión del integrante de ALG ni la conformidad documental de FE. No se han marcado aprobadas esas tareas. Las casillas únicas permanecen en [tasks.md](../../openspec/changes/definir-mvp-senialon/tasks.md).

`Stage.state`, `Operation.state`, los estados de revisión de evidencia y `EditorialReview.decision` son **propuestas de transporte para revisar**. La propuesta editorial es `pending_review`, `consider_for_adaptation` o `discarded`: considerar una adaptación no valida todas sus afirmaciones ni publica contenido. Cualquier cambio exige motivo; el estado inicial es pendiente. No se atribuyen identidades personales con una credencial compartida. Las tres salidas de valor y los seis resultados de pilar sí proceden de decisiones ya confirmadas en las specs; sus códigos en inglés son una representación propuesta.

## Rutas, acceso y errores

El documento OpenAPI describe rutas `/api/v1/...`. El navegador utilizará esas rutas del mismo origen en Next; los Route Handlers conservarán método, cuerpo y respuesta al llamar al servicio Python por el binding interno. No se está creando ni anunciando una URL pública de Python. La selección del binding y los secretos de entorno se implementan en BE 3.3/3.6 y FE 1.3.

- Toda página, operación y documentación publicada requiere la credencial compartida. Next valida cada Route Handler y FastAPI vuelve a validar HTTP Basic sobre HTTPS. El origen interno no sustituye autenticación. Los secretos acordados serán `DEMO_USERNAME` y `DEMO_PASSWORD`, disponibles solo en servidor en ambos servicios; BE configurará el binding y la URL exacta de `DEMO_ALLOWED_ORIGIN`. No se han creado valores ni credenciales.
- Las mutaciones exigen `Origin` permitido e `Idempotency-Key`. Next valida el origen original contra `DEMO_ALLOWED_ORIGIN` antes de llamar a Python; no confía en un origen/host reenviado arbitrario. Al binding transmite únicamente el origen autorizado. Python comprueba credencial y origen otra vez. Ausencia u origen no permitido produce 403 antes de validar el cuerpo. Las llamadas manuales también deben declarar el origen configurado. No se habilita CORS entre sitios.
- Todas las respuestas, incluidos errores, usan `Cache-Control: private, no-store`, `X-Contract-Version` y `X-Request-Id`. No generar resultados estáticos en build, almacenarlos en `public/` ni compartirlos por caché.
- GET solo lee estado persistido; no recolecta, infiere, confirma, reanuda ni exporta. Tampoco una consulta periódica. El único avance del trabajo es una mutación explícita y autorizada.

| HTTP | Códigos del cuerpo y uso |
| --- | --- |
| 401 | `AUTH_REQUIRED`; incluye `WWW-Authenticate`. No datos de la ejecución. |
| 403 | `ORIGIN_FORBIDDEN`, incluso con credencial válida. |
| 404 | `NOT_FOUND`; un recurso debe pertenecer a la ejecución de la ruta. |
| 409 | `VERSION_CONFLICT`, `IDEMPOTENCY_KEY_REUSED`, `GROUPS_NOT_CONFIRMED`, `OPERATION_IN_PROGRESS`, `PROVIDER_RESULT_UNCERTAIN` o `BUDGET_BLOCKED` cuando la acción se rechaza antes de reclamar trabajo. |
| 422 | `VALIDATION_ERROR` o `NOT_ELIGIBLE`; nunca aceptar duración desconocida como cero. |
| 500 | `INTERNAL_ERROR` saneado; conservar resultados previos. |
| 501/503 | Notion diferido/no implementado o proveedor no disponible, respectivamente; no guardado externo supuesto. |

El backend deberá adaptar los errores de validación de FastAPI/Pydantic al envelope `ErrorResponse`; las respuestas por defecto de un framework no establecen otro contrato. No devolver claves, cabeceras de autorización, stack traces o datos ajenos a la ejecución. Un HTTP 200 de `advanceRun` describe el estado persistido de **una unidad**, que también puede terminar bloqueada, fallida o incierta; no significa que la comparación esté completa.

## Identidad, versiones e idempotencia

`run_id` identifica una ejecución; `revision` cambia con sus mutaciones persistidas. `video_id` es la identidad de YouTube, deduplicada por ejecución; `capture_id` identifica la captura original. `source_id` conserva la fuente prevista aunque no se resuelva. `groups_id` y `groups_version` identifican la propuesta conjunta; la confirmación guarda exactamente esa versión. `comparison_revision` identifica el cálculo y sus fuentes.

`analysis_id` identifica la selección de una pieza en una ejecución. Cada checkpoint de nuevos resultados agrega una `analysis_version` inmutable; se conservan las anteriores. Los cambios de revisión no cambian el análisis: tienen `review_id` y `revision` propios, vinculados a la versión exacta. Una nueva versión de resultados inicia revisión pendiente y no hereda validación de evidencia. GET de ficha/revisión admite `analysis_version` para recuperar una versión histórica; sin parámetro devuelve la última. La creación de una ejecución nueva es la ruta para volver a clasificar ambas ventanas, sin reescribir clasificaciones antiguas.

Para guardar revisión se comprueban atómicamente `expected_analysis_version` y `expected_review_revision`; una versión obsoleta devuelve 409, sin sobrescribir ni perder el texto que FE conserve en el formulario. Cada `evidence_id` de esa versión aparece exactamente una vez en la revisión; no se aceptan evidencias ajenas, duplicadas u omitidas. Confirmar grupos y guardar revisión son acciones distintas.

La idempotencia tiene dos niveles:

1. **Solicitud:** alcance de la clave = operación + ejecución/recurso + clave. Clave y cuerpo idénticos recuperan la respuesta persistida sin repetir efectos; mismo alcance/clave con otro cuerpo devuelve 409. Primero se comprueban autenticación y origen; una clave no evita esos controles. Un replay exacto se resuelve antes de rechazar una versión ya avanzada por esa misma solicitud. Nueva clave en `createRun` crea una ejecución distinta, no reutiliza resultados como si fueran nuevos.
2. **Unidad de trabajo:** identidad estable por ejecución, etapa, elemento y versión de entrada, incluso con claves distintas. BE reclama la unidad de forma atómica y reserva el costo **antes de cada llamada pagada**, también las llamadas individuales dentro de un lote de ALG. Otro intento devuelve el estado/resultado existente. Seleccionar de nuevo el mismo video/ejecución recupera el análisis existente, sin reprocesar por defecto.

`advanceRun` ejecuta una unidad acotada durante la solicitud y persiste el checkpoint antes de responder. `202/running` significa que otro claim está activo; se consulta su operación, sin prometer un worker tras cerrar el navegador. Si la confirmación del proveedor queda incierta, se mantiene la reserva y se exige reconciliación de BE, sin liberar ni repetir automáticamente. Para un fallo confirmado sin resultado, BE debe reconciliar cargo/reserva antes de habilitar un nuevo intento explícito del mismo paso; se conserva su historial. Cambiar una clave o refrescar la página no resuelve un estado incierto.

| Situación | Petición siguiente permitida |
| --- | --- |
| Se perdió la respuesta de una mutación | Reenviar **la misma clave y el mismo cuerpo**, sin actualizar revisiones en ese cuerpo. Se recupera el resultado/operación de esa solicitud. |
| Operación `running` | Solo GET de la operación identificada; no inventar una clave para eludir el claim. `same_request_after_status_read` permite recuperar la solicitud original si se perdió su respuesta, no crear otro consumo. |
| Operación `succeeded` y quedan unidades | Leer el contexto actual; nueva petición de avance con **clave nueva y revisiones actuales** para la siguiente unidad permitida en `allowed_actions`. Por ejemplo, tras el ejemplo `CompletedOperation` que devuelve `run_revision=2`, el siguiente avance corpus usa `expected_run_revision=2`, no vuelve a enviar 1 con la clave anterior. |
| `failed` confirmado o `blocked` | Recuperar estado y motivo. BE resuelve la causa y registra/reconcilia cargo y reserva; solo si vuelve a habilitarse la acción se solicita un avance explícito con clave nueva y revisiones actuales. La API no ofrece un bypass de presupuesto ni un endpoint para liberar reservas. |
| `uncertain` | Consultar la operación retenida; no reintentar consumo. BE debe reconciliar el resultado antes de habilitar otra acción. Los errores `OPERATION_IN_PROGRESS` y `PROVIDER_RESULT_UNCERTAIN` incluyen obligatoriamente `operation_id` para esa consulta dentro de la ejecución de la ruta. |

## Ventanas, cobertura y conteos

ALG calcula las fronteras una sola vez desde `started_at`: últimas dos semanas completas de siete días en `America/Bogota`, inicio inclusivo y fin exclusivo, sin día en curso. BE usa y conserva las fronteras; FE las presenta sin recalcularlas. No se aceptan fechas/corpus alternativos en `CreateRunRequest`.

La ejecución contiene las once URLs exactas. `Coverage.cells` conserva una celda por fuente y ventana: 22 pares únicos. Se distinguen adquisición, elegibilidad, pertinencia y tema principal, con paginación, pendientes y fallos. Consultar completamente un canal sin publicaciones puede respaldar cero; no consultarlo no respalda cero. `thematic_state=complete` requiere todas esas etapas resueltas para las dos ventanas; audiovisual, formato, valor y afinidad no participan en ese requisito.

Cada `Count` contiene conteo observado, IDs y contribución por fuente. Los IDs son distintos; las contribuciones particionan los IDs, sus conteos suman `observed_count` y cada video cuenta solo en su principal confirmado. `state=known` exige `total_count=observed_count`; `unknown` conserva `total_count=null`, motivo y lo observado parcial. El fin de una página no prueba cobertura completa: FE sigue `next_cursor` hasta null. Los listados por ejecución fijan `snapshot_revision`; si cambia durante la paginación, 409 y reinicio del listado sin mezclar snapshots. Listado de ejecuciones: orden estable por inicio descendente e ID como desempate; cursor fija el punto de recorrido, sin duplicar nuevas inserciones.

`Comparison.state=groups_unconfirmed` impide calcular y devuelve `signals=[]`. Confirmar no calcula por sí solo: se pide `advanceRun` con scope `comparison`. Una propuesta confirmada con cobertura incompleta solo genera conteos parciales y `comparison_pending`, con delta y porcentaje nulos; tampoco «nuevo en el corpus», incluso si hay dos números observados. En cobertura completa evaluable, las variantes de `TopicSignal` representan base positiva, base cero con recientes positivos o ambos ceros. Las fórmulas, las relaciones entre campos y la cobertura efectiva son invariantes de ALG/BE, no cálculos de React ni algo acreditado por un type-check.

Los enteros de conteo de publicaciones viajan como enteros JSON. Las estadísticas originales de YouTube se representan como cadenas decimales en `Metric.value` para conservar valores fuera del rango exacto de JavaScript; `"0"` es cero conocido y `unknown/value=null` es ausencia con motivo. La duración conocida se expresa en segundos; hasta 180 inclusive no confirma condición de Short. Sin evidencia verificable se conserva `candidate_short` y una confirmación de Short exige su criterio/fuente.

## Selección, evidencia y evaluación editorial

El catálogo devuelve cualquier publicación elegible, incluso sin tema asignado, grupos confirmados o crecimiento. Elegibilidad significa condición pública, fecha/duración verificadas y pertinencia IA respaldada; si JEV falla no se convierte en un descarte o elegibilidad positiva. La selección persiste el análisis inicial y revisión pendiente sin llamadas externas; el operador solicita después el avance del análisis elegido. No hay endpoint para editar pertinencia, temas o asignaciones ni un proceso profundo obligatorio para todas las piezas.

Los resultados de JEV distinguen `decided` con una decisión auténtica, incluida información insuficiente, de error/pendiente con `decision=null`. Se preservan pregunta, entrada, respuesta original, modelo, versiones y probabilidades si existen. `explanation_source` atribuye el motivo sintetizado separadamente: JEV no se presenta como autor de un guion o de una explicación libre. Una probabilidad del proveedor no mide viralidad ni precisión validada.

La ficha contiene seis dimensiones audiovisuales con estados independientes, material realmente procesado y evidencia textual o audiovisual. Cada evidencia audiovisual conserva video, dimensión, observación, URL y marca temporal; fin no anterior al inicio y dentro del material procesado. Una dimensión completa requiere evidencia audiovisual de esa dimensión. La revisión de cada evidencia está separada de la observación; un desacuerdo no borra el registro original.

Valor, persona, contexto empresarial y pilar se presentan por separado. Las hipótesis remiten a observaciones y declaran límites; la adaptación diferencia recursos sugeridos de lo observado y no inventa cifras, urgencias, experiencias propias ni activos del equipo. Popularidad o aumento solos no justifican una recomendación. Una captura de métricas deja desempeño `not_evaluable`; no acredita éxito. Un fallo audiovisual conserva metadatos y la señal temática ya conocida.

`SignalReference` y el resto del contexto de una versión de análisis son snapshots persistidos; una lectura no los reescribe con una comparación posterior. La comparación actual puede consultarse aparte. Si se añade contexto/resultados al análisis, se publica una nueva versión y se conserva la anterior.

## Ejemplos, validación y límites

Los ejemplos residen exclusivamente en `components.examples` dentro de OpenAPI. Cada uno indica **SINTÉTICO**, tiene un `x-schema` para validación y no representa una respuesta recolectada. Las URLs `example.invalid`, IDs y modelos `fixture-*` son datos de prueba. Los ejemplos de conteos son escenarios independientes; no se deben mezclar como un único dataset. Las once URLs del corpus sí son las aportadas por el usuario.

La comprobación de compatibilidad deriva modelos/tipos en un directorio temporal: no los publica como una segunda fuente ni crea un backend o frontend. Generar tipos TypeScript no valida JSON durante la ejecución; FE 1.1 deberá añadir validación del consumidor con el contrato acordado. Pydantic tampoco valida por sí solo relaciones de BD, consistencia de referencias o todas las restricciones entre campos; BE implementará esas invariantes y ALG los cálculos en sus tareas respectivas.

Notion permanece explícitamente `deferred`. Su operación está descrita como extensión futura: no hay implementación ni enlace de éxito de ejemplo. Si se activa al final, BE 3.16 debe confirmar un registro real, controlar duplicados por video/base y conservar contexto y revisión; FE 1.12 conecta el botón después. El estado editorial externo inicial es pendiente y el snapshot de la decisión local se conserva aparte.

## Política de versiones

BE edita OpenAPI y registra los cambios en este mismo directorio. Mientras sea borrador, cada cambio de transporte aumenta el sufijo `draft.N`; no se presenta como acuerdo estable. La versión se comunica en `info.version`, `Meta.contract_version` y `X-Contract-Version`. Las rutas `/api/v1` reservan el primer contrato de integración; no afirman que ya exista un servicio v1 desplegado.

Antes de integrar: registrar observaciones ALG/FE, resolverlas, guardar la conformidad documental real y publicar una versión común. Una vez acordado, cambios incompatibles de métodos, campos requeridos, significado, nulabilidad o enums requieren versión mayor/ruta nueva y coordinación de ambos consumidores. Los objetos son cerrados (`additionalProperties=false`), por lo que añadir campos puede romper validadores estrictos: también exige coordinación/versionado y pruebas, nunca asumir compatibilidad silenciosa. No mezclar resultados históricos de criterios/modelos diferentes ni reescribir su versión.

| Versión | Cambio | Acuerdo |
| --- | --- | --- |
| `0.1.0-draft.1` | Primer borrador BE 3.1 con operaciones, esquemas y ejemplos; derivación y validaciones en VALIDACION.md. | ALG 2.1 pendiente; revisión documental FE 1.1 pendiente; G0 abierto. |

Referencias técnicas consultadas para el formato y la derivación: [OpenAPI 3.1.0](https://spec.openapis.org/oas/v3.1.0.html), [JSON Schema en Pydantic](https://docs.pydantic.dev/latest/concepts/json_schema/) y [CLI de openapi-typescript](https://openapi-ts.dev/cli). Las versiones efectivamente usadas en las comprobaciones constan en VALIDACION.md.
