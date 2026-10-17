# Plan de trabajo del MVP SENIALON

El equipo de cuatro personas construirá SENIALON, un radar de videos cortos públicos de YouTube, priorizando Shorts, que recolecte publicaciones automáticamente, compare su desempeño dentro de una muestra definida y explique factores observables con evidencia. El alcance esencial separa desempeño observado, valor respaldado para la audiencia y contexto de tendencia: muchas visitas o un tema en tendencia no bastan para recomendar una oportunidad. La definición de producto está en [DEFINICION_MVP.md](DEFINICION_MVP.md).

La carpeta raíz `SENIALON/` contiene los documentos del producto, el logo y la configuración de OpenSpec. El siguiente paso será generar las especificaciones antes de desarrollar código. Este plan conserva la propuesta previa de trabajo; sus tareas de implementación y horarios deberán revisarse después de las especificaciones.

La entrega oficial es el 18 de octubre de 2026 antes de las 12:00 del mediodía, hora de Colombia; el objetivo interno es entregar a las 11:00. Los canales iniciales son https://www.youtube.com/@30X_by_Andres_Bilbao y https://www.youtube.com/@30XDevs. Los responsables, experiencia, disponibilidad, credenciales y presupuesto siguen por confirmar. Estos horarios son objetivos de coordinación, no capacidad comprometida ni avances realizados.

La preparación se hará con un proyecto y credenciales del equipo, conservando esos dos canales como corpus público.

## Alcance que debe preservarse

El recorrido principal será: configurar canales y contexto de tendencias → recolectar automáticamente → obtener material analizable → comparar publicaciones → evaluar con JEV valor y relación temática con las tendencias documentadas → explicar con evidencia → revisar una oportunidad editorial. La audiencia es la indicada en el reto: líderes y equipos latinoamericanos aprendiendo IA.

El contexto mínimo propuesto es una exportación oficial CSV de Google Trends Trending Now aportada por el equipo, con fuente, fecha de consulta, territorio y periodo conservados. LatAm es el mercado editorial confirmado; los países o territorios realmente consultados y el periodo de la demostración siguen pendientes de configuración. Una señal de un país conserva ese alcance y no representa por sí sola a toda LatAm. Esta carga complementaria no sustituye la recolección automática de YouTube ni supone acceso a una API de Trends. El futuro producto debe incorporar el contexto y hacer visible su procedencia; una señal de búsquedas de Google no demuestra una tendencia de YouTube. La fuente documenta [exportaciones y filtros](https://support.google.com/trends/answer/3076011?hl=en) y los [límites de interpretación](https://support.google.com/trends/answer/4365533?hl=en).

Guardar una oportunidad seleccionada en Notion se incluye como última prioridad y extensión opcional. El recorrido principal, los criterios de cierre y la demo no dependen de esta integración.

Se comienza con canales acotados, una ventana temporal y criterios de selección acordados. Se propone seleccionar candidatos de hasta tres minutos y priorizar Shorts. La búsqueda global, varias redes, monitoreo continuo, predicción de viralidad, publicación automática y guiones completos quedan fuera. La duración por sí sola no demuestra que un video sea un Short: registrar una señal verificable adicional o indicar que está pendiente. No comparar candidatos pendientes con Shorts confirmados como si fueran equivalentes.

Ruta técnica propuesta, por especificar y validar: YouTube Data API para metadatos públicos; Gemini sobre URLs públicas de YouTube para análisis audiovisual, con esta función en preview; JEV para decisiones tipadas. La API de metadatos no entrega por sí sola la transcripción que necesita el análisis. La incorporación del CSV, el cruce con tendencias y la evaluación de valor forman parte del alcance de producto; su implementación queda pendiente de las especificaciones.

La recolección debe respetar los términos del mecanismo elegido y las restricciones del reto: contenido público, sin acceso detrás del login de terceros ni datos personales. Antes de implementar comparaciones o indicadores derivados, comprobar que su uso está permitido por las condiciones vigentes. No introducir un índice de viralidad sin fundamento ni autorización de uso.

Cada explicación separa: **hechos observados** con referencia al material; **señal de desempeño** con comparación visible; **hipótesis editorial** sobre factores posibles; y **límites o explicaciones alternativas**. Una diferencia de vistas no demuestra causalidad. Sin material o datos comparables suficientes, el resultado es «no evaluable», con el motivo.

La evaluación de valor debe apoyarse en un problema identificable de la audiencia, utilidad o aprendizaje aplicable y evidencia suficiente para respaldar lo que afirma la pieza. La relevancia temática y el alcance se muestran por separado. No se crean pesos numéricos, umbrales de viralidad ni una suma que permita compensar poco valor con muchas visitas.

Las reglas editoriales propuestas son: valor respaldado y relación directa con crecimiento documentado por la fuente → candidata prioritaria para revisión; valor respaldado sin señal de tendencia → oportunidad duradera; popularidad o tendencia sin valor respaldado → no recomendar por esas señales; información insuficiente → revisión pendiente. Una candidatura prioritaria todavía requiere decisión humana.

## Cuatro frentes y responsables

| Responsable | Frente | Entrega verificable |
| --- | --- | --- |
| Integrante 1 | Recolección de YouTube y calidad | Canales acordados, recolección automática real, procedencia, fechas, campos disponibles, deduplicación, errores y exportación de tendencias documentada. |
| Integrante 2 | Comparación y JEV | Regla de comparación permitida y explícita, muestra visible, decisiones auténticas de valor y relación temática, versiones y ruta de revisión. |
| Integrante 3 | Análisis audiovisual, explicación y evaluación editorial | Material efectivamente analizado, evidencias verificables, evaluación de valor y oportunidad temporal, explicación y adaptación, errores y límites. |
| Integrante 4 | Interfaz, integración, persistencia y entrega | Recorrido conectado con tres dimensiones visibles, resultados y contexto recuperables, README, playbook, repositorio público y paquete comprobado. |

El integrante 4 integra desde el inicio. Los cuatro acuerdan el contrato antes de desarrollar componentes independientes. Cada frente documenta su parte del playbook; el 4 reúne el paquete, sin asumir todo el trabajo documental.

### Tareas propuestas para después de las especificaciones

**Integrante 1 — Recolección y calidad**

- [ ] Confirmar canales y ventana; verificar contenido público y condiciones del acceso propuesto.
- [ ] Configurar la cobertura por países o territorios dentro del mercado editorial LatAm y el periodo para Trends; obtener la exportación oficial y registrar archivo original, enlace de origen, fecha de consulta y filtros. No inventar temas si la fuente no ofrece señales pertinentes.
- [ ] Entregar contexto de tendencia con estados de fuente explícitos, distinguiendo crecimiento reportado, vigencia informativa, recurrencia en la muestra, falta de señal y datos pendientes.
- [ ] Ejecutar una recolección real y registrar qué metadatos y métricas se obtienen, con fecha y procedencia.
- [ ] Seleccionar candidatos a videos cortos; verificar Shorts por un criterio documentado o marcar la clasificación pendiente.
- [ ] Entregar un lote con duplicados controlados, ausencias explícitas y errores reproducibles; compartirlo con 2 y 3.

**Integrante 2 — Comparación y JEV**

- [ ] Comprobar acceso real a JEV y obtener una decisión auténtica.
- [ ] Acordar con 1 una comparación permitida: muestra, métrica, antigüedad, formato y límites; preferir piezas comparables del mismo canal cuando sea viable.
- [ ] Mostrar los datos que respaldan «destaca en esta muestra»; evitar equiparar una captura con crecimiento temporal.
- [ ] Definir preguntas separadas sobre gancho, estructura, aplicación práctica y encaje; incluir «otro» o información insuficiente y revisión humana.
- [ ] Ampliar la rúbrica de valor con problema de audiencia, utilidad aplicable y respaldo; separar esta evaluación de vistas y de la señal de tendencia.
- [ ] Implementar en JEV la relación entre pieza y contexto como relación directa, indirecta, sin relación o insuficiente, con evidencia de ambas partes; JEV no inventa ni mide crecimiento de búsquedas.
- [ ] Aplicar las reglas editoriales sin pesos ni umbrales inventados y mantener separadas la candidatura automática y la decisión humana.
- [ ] Registrar modelo, criterios y reglas provisionales; la confianza de JEV no es probabilidad de viralidad.

**Integrante 3 — Evidencia y explicación**

- [ ] Probar el acceso audiovisual de la ruta candidata y comprobar qué material analiza realmente.
- [ ] Vincular observaciones con fragmentos o marcas temporales verificadas; no inventar transcripciones ni describir imágenes no observadas.
- [ ] Producir la explicación con un LLM disponible o una plantilla, conservando evidencias y límites.
- [ ] Revisar qué problema resuelve cada pieza, qué puede aplicar la audiencia y qué afirmaciones cuentan con respaldo; una pieza entretenida o popular no acredita valor por sí sola.
- [ ] Verificar la relación con los temas documentados y explicar si aporta oportunidad temporal o valor duradero. Registrar posibles coincidencias de palabras sin relación sustantiva.
- [ ] Reservar un corpus anotado o de un creador que autorice su uso para evaluar; distinguirlo del lote usado para ajustar preguntas.
- [ ] Revisar pertinencia, fidelidad de evidencia y utilidad editorial; registrar desacuerdos y preparar el relato de demo.

**Integrante 4 — Integración y entrega**

- [ ] Comprobar el estado del proyecto, preparar el stack conocido por el equipo y crear o compartir el repositorio.
- [ ] Publicar contrato y ejemplos identificados; mantener una versión integrada desde el primer flujo.
- [ ] Incorporar carga y validación del CSV oficial, con su fuente, fecha, mercado y periodo, sin requerir una API no disponible.
- [ ] Construir controles de recolección, bandeja y ficha con desempeño, valor y contexto de tendencia separados, explicación y datos faltantes.
- [ ] Persistir datos y resultados según condiciones aplicables; guardar contexto utilizado, estado de fuente, relación temática, estado editorial y motivo.
- [ ] Verificar requisitos de envío, README, playbook, arranque por otra persona y respaldo de resultados reales.
- [ ] **Última prioridad, opcional:** implementar «Guardar oportunidad en Notion» solo después de validar el recorrido esencial y cubrir las tareas de evaluación y entrega, con margen antes del cierre de funciones.

## Contrato compartido

| Bloque | Datos mínimos |
| --- | --- |
| Publicación | ID, URL, canal de origen, fecha de publicación y captura, duración si existe, criterio de candidatura, métricas disponibles y procedencia. |
| Comparación | Muestra y regla utilizadas, observaciones originales, fecha, resultado y límites; estado no evaluable si faltan condiciones. |
| Evidencia | Material realmente analizado, método, fragmentos o marcas verificadas, alcance audiovisual o textual y datos ausentes. |
| Valor para la audiencia | Problema identificable, utilidad o aprendizaje aplicable, respaldo observable, afinidad con la audiencia y motivo; insuficiente cuando falten evidencias. |
| Contexto de tendencia | Archivo o evidencia de origen, URL y fuente, fecha de consulta, mercado, periodo, tema o consulta original, señal reportada y límites de cobertura. |
| Estado de fuente | Crecimiento reportado por la fuente / vigencia informativa sin crecimiento demostrado / recurrencia en muestra / sin señal verificada / pendiente; motivo y evidencia para el estado utilizado. |
| Relación temática | Relación directa / indirecta / sin relación / insuficiente, referencias a la pieza y al contexto que sustentan la evaluación. |
| Decisiones | Respuestas tipadas de JEV, modelo, versión de criterios, necesidad de revisión y errores; separar valor, afinidad temática y desempeño. |
| Oportunidad | Explicación que enlaza las tres dimensiones, hipótesis, límites, adaptación, candidatura y decisión editorial humana con motivo. |

Cada etapa tiene estado pendiente, procesando, listo, insuficiente o error. Un error de extracción o análisis nunca equivale a un descarte editorial. Un dato ausente no vale cero. La decisión editorial puede ser pendiente, priorizada o descartada y se guarda por separado.

Los estados de fuente no son equivalentes ni constituyen una escala de puntuación. Vigencia informativa indica actualidad documentada sin crecimiento demostrado; recurrencia describe repetición en la muestra y no un crecimiento del mercado. «Sin señal verificada» se limita a la fuente, mercado y periodo consultados: la ausencia de coincidencia no demuestra que un tema no sea tendencia. Un CSV de Trending Now no convierte una coincidencia temática en tendencia de YouTube.

El código maneja fechas, conteos y comparaciones permitidas; JEV evalúa factores, valor y relación temática con el contexto aportado; el análisis audiovisual y la explicación usan material accesible y verificable. Una plantilla puede presentar resultados reales cuando no haya generador de texto. El editor decide qué probar. El contrato distingue evidencias, inferencias y mediciones. Interés reciente, crecimiento documentado y afinidad temática se comunican por separado.

## Notion como última prioridad

El integrante 4 coordina esta extensión únicamente si el recorrido real completo ya está validado y las tareas de evaluación, documentación y ensayo están cubiertas. Se limita a un envío manual de una oportunidad seleccionada a una base preconfigurada del equipo, con fuente, métricas y fecha, evidencia temporal, hipótesis, valor respaldado, contexto de tendencia y su procedencia, relación evaluada por JEV, adaptación y estado editorial pendiente.

La integración debe mostrar confirmación y enlace, controlar duplicados por ID de video y conservar el resultado local ante errores. No incluye cuentas de terceros, sincronización bidireccional, comentarios, aprobaciones ni otros canales. La definición detallada está en DEFINICION_MVP.md.

Si amenaza la integración del núcleo, su evaluación o el ensayo, se retira de la demo y se registra como pendiente. No modifica los hitos ni los criterios de cierre; no se simulan guardados en Notion. Después del cierre de funciones no se inicia esta extensión.

## Hitos propuestos

Todas las horas son de Colombia. Confirmar disponibilidad y reasignar responsables manteniendo el orden de las dependencias y el margen final.

Los hitos conservan sus horarios. El contrato inicial debe incluir las tres dimensiones; el flujo esencial y su evaluación deben cubrir valor y cruce de tendencias, además de extracción y explicación. LatAm está confirmado como mercado editorial; quedan por configurar la cobertura por países o territorios y el periodo, sin suponer capacidad adicional.

| Fecha y hora | Resultado esperado |
| --- | --- |
| 17 de octubre, 13:30 | Responsables, canales, stack y contrato; pruebas reales de acceso a datos, material audiovisual y JEV, o bloqueos con responsable. |
| 17 de octubre, 16:00 | Primer flujo real: recolección nueva → comparación visible → JEV → explicación respaldada → ficha recuperable. |
| 17 de octubre, 18:30 | Flujo esencial completo con varias publicaciones, revisión de evidencia y estados insuficiente/error. |
| 17 de octubre, 20:00 | Cierre de funciones; quedan correcciones, evaluación y preparación de entrega. |
| 17 de octubre, 21:00 | Versión candidata guardada, README y playbook en borrador, evaluación y pendientes asignados. |
| Noche del 17 al 18 | Descanso propuesto hasta las 08:00; confirmar disponibilidad, sin depender de trabajo nocturno. |
| 18 de octubre, 08:00–09:30 | Prueba completa, evaluación final, correcciones necesarias y ensayo. |
| 18 de octubre, 09:30 | Congelar versión de entrega y guardar respaldo identificado de ejecuciones reales. |
| 18 de octubre, 10:30 | Otra persona comprueba arranque; verificar repositorio, enlaces, paquete y condiciones de acceso. |
| 18 de octubre, 11:00 | Envío objetivo y comprobación de recepción; margen hasta el límite oficial antes de las 12:00. |

## Coordinación y bloqueos

1. Un tablero con pendiente, en curso, bloqueado, revisión y terminado. Cada tarea tiene responsable, dependencia y evidencia de aceptación; una tarea principal por persona.
2. Revisión breve cada dos horas activas y aviso inmediato de bloqueos de acceso. Cada entrega indica qué funciona, cómo probarlo y qué falta.
3. Integrar cambios pequeños. Una tarea termina cuando funciona en la versión compartida y otra persona puede verificarla. El 4 coordina cambios al contrato y archivos compartidos.
4. Si a las 16:00 falta el primer flujo, detener ampliaciones y resolver su dependencia bloqueante. Recortar filtros, agrupación, automatización de redacción y acabado secundario; conservar recolección, comparación, valor, contexto de tendencia, JEV y evidencia. Notion permanece como última prioridad opcional.
5. Si falla una ruta, buscar otra permitida para la misma función. Sin recolección automática o sin material suficiente, declarar la limitación: cargar referencias manualmente no completa el MVP acordado.
6. Sin una comparación permitida y suficiente, marcar desempeño no evaluable. Sin evidencia audiovisual, limitar la explicación al material observado y explicitar lo pendiente; no presentar metadatos como análisis del video.
7. El corpus anotado apoya evaluación; no sustituye la adquisición automática. Ante una caída durante la demo, mostrar una ejecución real guardada con fecha y versión, identificada como anterior.
8. Toda función nueva sustituye otra. Después de las 20:00 solo correcciones y entrega; después de las 09:30 del domingo solo cambios necesarios para ejecutar o entregar.
9. Si no hay señal pertinente en el contexto consultado, guardar «sin señal verificada» con su alcance y conservar oportunidades de valor duradero. Si aún falta la fuente, mercado o periodo, marcar pendiente; no completar esos campos con una tendencia imaginada ni afirmar que se hizo el cruce.

## Criterios de cierre y paquete

- [ ] Una recolección nueva y automática alimenta el recorrido completo con datos auténticos de YouTube.
- [ ] La selección de videos cortos y la clasificación como Shorts tienen criterio visible; no dependen solo de una duración arbitraria.
- [ ] Una oportunidad muestra comparación suficiente y permitida, material analizado y explicación que referencia evidencia verificable.
- [ ] Cada ficha muestra por separado desempeño observado, valor respaldado para la audiencia y contexto de tendencia, con fuente, fecha, mercado y periodo o ausencia explícita.
- [ ] El contexto procede de una exportación oficial identificable y la relación temática de JEV referencia evidencia de la pieza y del contexto; no se presenta Google Search como medición de tendencias de YouTube.
- [ ] Los cinco estados de fuente y las cuatro relaciones temáticas se distinguen; sin coincidencia no se concluye ausencia de tendencia.
- [ ] La revisión comprueba que popularidad o tendencia sin valor no generan una recomendación, que valor sin tendencia permite una oportunidad duradera y que valor con relación directa y crecimiento documentado produce solo una candidatura prioritaria para revisión.
- [ ] Se distinguen hechos, cálculos, clasificaciones e hipótesis; no se atribuye causalidad ni crecimiento no medido.
- [ ] JEV ejecuta decisiones reales; ausencias, incertidumbre y errores tienen estados visibles.
- [ ] Resultados y decisión editorial pueden recuperarse; se respetan las condiciones de almacenamiento del acceso elegido.
- [ ] La evaluación humana registra acuerdos, errores y límites; tiempo y costo proceden de mediciones reales con su alcance.
- [ ] Otra persona ejecuta el prototipo fuera de los sistemas de 30X siguiendo el README y configurando sus accesos.
- [ ] Repositorio público sin credenciales ni material no permitido; playbook de máximo cinco páginas u ocho diapositivas con decisiones, preguntas, reglas, revisión, operación y medición.
- [ ] Requisitos oficiales de envío verificados, demo ensayada y respaldo identificado de resultados auténticos.

La demo sigue la secuencia recolección real → publicación y comparación → valor respaldado y explicación con evidencia → contexto de tendencia con fuente, fecha, mercado y periodo → relación temática evaluada por JEV → oportunidad para 30X y revisión humana. Se explica por qué alcance, valor y oportunidad temporal son dimensiones distintas. Si los datos reales lo permiten, contrastar una oportunidad de valor duradero con una candidata vinculada a crecimiento documentado; no fabricar ejemplos para completar el relato. El paquete incluye repositorio, README, playbook y evaluación. Añadir enlace desplegado o video según requisitos verificados o recursos ya disponibles; no asumir formato ni duración de presentación.

Solo si la integración opcional quedó implementada y comprobada antes del cierre de funciones, la demo puede terminar guardando una oportunidad en Notion y abriendo el registro real. Su ausencia no impide entregar el MVP esencial.
