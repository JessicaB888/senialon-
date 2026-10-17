# Definición del MVP SENIALON

SENIALON recolecta automáticamente videos cortos públicos de YouTube y los convierte en oportunidades editoriales para líderes y equipos latinoamericanos aprendiendo IA. Evalúa por separado el desempeño observado, el valor para la audiencia y la relación con temas en tendencia documentados. Explica qué elementos del contenido podrían contribuir a su desempeño y qué patrones conviene estudiar para una adaptación.

Como última prioridad, incluye una integración opcional para guardar oportunidades seleccionadas en Notion. La entrega y la demo se consideran completas al cumplir el recorrido esencial, aunque esta integración quede pendiente.

## Problema que resuelve

El reto plantea una brecha entre obtener datos de publicaciones y entender qué producir. El MVP conecta métricas, observaciones del contenido y contexto temático para responder: qué aporta una pieza a la audiencia, qué podría explicar su desempeño, con qué tendencia se relaciona y cómo adaptarla.

Las vistas y la viralidad no acreditan valor. Una pieza con poco alcance puede contener una enseñanza útil; una pieza popular puede aportar poco a la audiencia de 30X. La evaluación de utilidad debe apoyarse en el contenido, no en sus métricas.

El resultado es una oportunidad editorial revisable. La explicación ofrece hipótesis respaldadas por evidencia; no demuestra por sí sola por qué un video tuvo éxito. Tampoco exige que todo contenido útil esté ligado a una tendencia.

## Decisiones confirmadas

- YouTube sustituye a Instagram como plataforma de la primera versión.
- El foco son los videos cortos.
- Los canales iniciales proporcionados por el equipo son [30X by Andrés Bilbao](https://www.youtube.com/@30X_by_Andres_Bilbao) y [30XDevs](https://www.youtube.com/@30XDevs).
- El proyecto y las credenciales serán del equipo; el corpus inicial será el contenido público de esos canales de referencia.
- El MVP cubre adquisición automática, explicación del desempeño, evaluación de valor y cruce con temas en tendencia documentados.
- LatAm es el mercado editorial confirmado. Cada señal de tendencia debe conservar los países o territorios realmente consultados; los países concretos y el periodo de la demo siguen pendientes de configuración.
- JEV participa en las decisiones del análisis.
- La integración con Notion queda como última prioridad y puede quedar fuera de la demo sin impedir la entrega del MVP esencial.
- El equipo tiene cuatro integrantes y la entrega es el 18 de octubre de 2026 antes del mediodía, hora de Colombia.
- Se mantienen las restricciones del reto: contenido público, sin datos personales, sin contenido detrás de login de terceros y sin métodos que dependan de violar términos de servicio.

## Alcance propuesto

Empezar por los dos canales proporcionados. Se propone priorizar Shorts y comenzar con candidatos de hasta tres minutos. La demo acordada utiliza los dos canales indicados.

El usuario configura los canales y ejecuta una recolección. El producto obtiene los videos y sus datos públicos por una ruta permitida, selecciona candidatos cortos y analiza el contenido de una selección. La selección editorial considera utilidad y contexto de tendencia además del desempeño; no se limita a las piezas con más vistas. La carga manual de datos de cada video no sustituye el recorrido principal.

Para incorporar tendencias sin depender de otro acceso por confirmar, la ruta mínima propuesta es importar una exportación oficial CSV de Google Trends Trending Now aportada por el equipo. Es una entrada complementaria de contexto; la recolección de publicaciones de YouTube continúa siendo automática. El origen, la fecha, el territorio y el periodo de cada señal deben quedar visibles. No se presupone acceso a una API de Google Trends.

El filtro de duración de la API no identifica Shorts exactamente: `videoDuration=short` incluye videos de menos de cuatro minutos. La duración de hasta tres minutos es un filtro propuesto del producto; la condición de Short requiere una señal verificable adicional. La interfaz distingue candidatos cortos de Shorts confirmados. YouTube documenta criterios de duración, proporción y fecha de publicación para Shorts.

## Capacidades esenciales

| Capacidad | Resultado exigido |
| --- | --- |
| Recolección automática | Videos reales, fuente, canal, título, descripción, fecha, duración y estadísticas disponibles, con fecha de captura y errores identificados. |
| Selección y comparación | Métricas originales y comparación visible de piezas comparables. Considerar canal, antigüedad y formato. El alcance orienta el estudio de referencias; no define por sí solo la prioridad editorial. |
| Observación audiovisual | Identificar elementos del audio y video con marcas de tiempo que permitan comprobarlos contra el original. Un título o descripción no acredita montaje, ritmo ni gancho hablado. |
| Valor para la audiencia | Identificar el problema, aprendizaje o decisión que la pieza ayuda a abordar, con evidencia del contenido y encaje con la audiencia. Distinguir poca utilidad de información insuficiente. |
| Cruce con tendencias | Relacionar el tema del video con señales documentadas, conservando fuente, fecha, territorio, periodo y alcance. Distinguir crecimiento reportado, actualidad, recurrencia y ausencia de señal. |
| Decisiones con JEV | Evaluar preguntas delimitadas sobre gancho, estructura, aplicación práctica, valor editorial y relación temática con el contexto aportado. |
| Explicación editorial | Conectar señales de desempeño con elementos observables e hipótesis sobre su contribución al resultado. |
| Oportunidad de adaptación | Mostrar el patrón reutilizable, qué valor aportaría y por qué podría ser oportuno tratarlo ahora, o identificarlo como contenido duradero sin señal de tendencia verificada. |

## Valor y contexto de tendencias

La rúbrica de valor propuesta distingue **utilidad concreta respaldada**, **aprendizaje pertinente**, **utilidad no sustentada** e **información insuficiente**. El editor debe poder señalar qué tarea, comprensión o decisión de la audiencia se beneficia y qué fragmentos lo respaldan. Esta clasificación no verifica por sí sola la exactitud de las afirmaciones del video.

Cada señal de contexto conserva el tema o consulta original, evidencia de origen, URL, fecha de captura, territorio, periodo y el estado reportado por la fuente. JEV evalúa si la relación con el contenido es **directa**, **indirecta**, **sin relación** o **insuficiente**; no declara que un tema crece a partir de su conocimiento general.

El estado de la fuente distingue crecimiento reportado por la fuente, vigencia informativa sin crecimiento demostrado, recurrencia en la muestra, sin señal verificada y datos pendientes. Estos estados no forman una escala de puntuación. Un tema reciente o repetido en dos canales no demuestra una tendencia creciente.

Trending Now aporta contexto de búsquedas de Google; una coincidencia no acredita una tendencia de YouTube. LatAm orienta la relevancia editorial, pero una señal de un país conserva ese alcance y no se presenta como representativa de toda la región. Sin una señal pertinente se muestra «sin señal verificada en la fuente, territorio y periodo consultados»; no se concluye que el tema no sea tendencia.

Las reglas de prioridad propuestas son:

- Valor respaldado y relación directa con crecimiento documentado: candidata prioritaria para revisión.
- Valor respaldado sin señal de tendencia: oportunidad de contenido duradero.
- Popularidad o tendencia sin valor respaldado: no recomendar una adaptación por esas señales; el formato puede estudiarse por separado.
- Evidencia insuficiente o contradictoria: revisión pendiente.

No se combinan las dimensiones en una puntuación con pesos arbitrarios. La oportunidad conserva sus motivos y la decisión final del editor.

## Ruta técnica propuesta

1. **YouTube Data API:** recolectar metadatos y estadísticas públicos con una API key y la API habilitada. El acceso y la cuota del proyecto del equipo deben comprobarse.
2. **Análisis audiovisual con Gemini:** probar su entrada directa de URLs públicas de YouTube para obtener observaciones de audio y video y referencias temporales. La función está en preview; no se ha ejecutado todavía con los accesos del equipo.
3. **Contexto de tendencias:** incorporar el CSV oficial y validar procedencia, fechas, cobertura y señales antes de cruzarlo con los temas de las piezas.
4. **Código y JEV:** el código maneja fechas, ordenación y comparaciones; JEV evalúa factores observables, valor y correspondencia temática con el contexto. El crecimiento procede de evidencia temporal o de una declaración atribuida a la fuente. Conservar versiones y resultados.
5. **Explicación y revisión:** sintetizar las tres dimensiones en una ficha que permita reproducir el video, comprobar observaciones y fuentes y decidir una adaptación.
6. **Notion, opcional y al final:** desde una ficha seleccionada, guardar su contenido en una única base preconfigurada del equipo. Este paso se desarrolla después de validar el recorrido esencial y solo si cabe antes del cierre de funciones.

Data API no entrega por sí sola el archivo audiovisual ni una transcripción de terceros. La descarga oficial de subtítulos requiere permiso de edición del video. El análisis por URL de Gemini es la ruta candidata para resolver esa dependencia sin presumir acceso a subtítulos ajenos.

El modelo puede equivocarse al describir un video; sus observaciones necesitan contraste con la reproducción original. Una falla de procesamiento produce un estado visible, no una explicación a partir de contenido supuesto.

## Ficha de resultado

Cada ficha muestra enlace al video, canal, duración y estado de clasificación, métricas disponibles con fecha, base de comparación, factores identificados y marcas de tiempo verificables. Presenta tres bloques separados: desempeño observado; valor para la audiencia con su motivo; y contexto de tendencia con fuente, fecha, territorio, periodo y relación temática. Incluye explicación, propuesta de adaptación y estado editorial.

La explicación separa datos de la plataforma, observaciones verificadas e hipótesis. No atribuye causalidad a un gancho ni presume pauta, retención o distribución que no se hayan obtenido. Una captura actual no demuestra crecimiento semanal. Los faltantes se identifican sin transformarlos en cero.

Las métricas originales conservan sus nombres y definiciones. Antes de incorporar puntuaciones propias u otros análisis derivados de datos de la API, verificar las condiciones adicionales de YouTube y completar su aceptación cuando corresponda. Las interpretaciones del producto se distinguen de datos publicados por YouTube.

## Integración opcional con Notion

Su propósito es convertir las oportunidades seleccionadas en un banco editorial que el equipo pueda revisar y organizar. Es la última prioridad: solo se inicia cuando el recorrido real de recolección, comparación, evaluación de valor, cruce de tendencias y explicación funciona y las tareas necesarias de evaluación, documentación y entrega están cubiertas. No desplaza esos trabajos ni modifica la fecha de cierre de funciones.

El alcance se limita a la acción manual **«Guardar oportunidad en Notion»**, con una única base de destino y acceso configurado por el equipo. Cada registro incluye:

- ID y enlace del video original, título y canal.
- Métricas disponibles y fecha de captura.
- Evidencias con marcas de tiempo e indicación de su revisión.
- Hipótesis editorial, encaje evaluado por JEV y propuesta de adaptación.
- Valor para la audiencia y contexto de tendencia, con fuentes, cobertura y estado de la relación temática separados de las métricas.
- Estado inicial «pendiente de revisión editorial» y responsable opcional.

Seleccionar una ficha para guardarla no equivale a aprobar su explicación ni su propuesta. Las observaciones generadas por modelos conservan su estado de revisión.

Si se implementa, debe confirmar el guardado y mostrar el enlace al registro, controlar duplicados por ID del video y mostrar los errores sin perder la ficha local. Un fallo de Notion no bloquea la recolección ni el análisis.

Quedan fuera la conexión de cuentas de terceros mediante OAuth, la sincronización bidireccional, comentarios, aprobaciones automáticas y el envío a Slack u otros canales. Si no se alcanza a completar y comprobar el guardado real, se presenta como funcionalidad pendiente; la demo utiliza las fichas y los informes del recorrido esencial.

## Primera prueba de viabilidad

Procesar una URL pública real con el recorrido completo: obtener datos mediante YouTube Data API, analizar su contenido, evaluar factores y valor con JEV, contrastar su tema con contexto real y abrir una ficha con evidencia temporal y procedencia de las señales. El cruce puede terminar sin coincidencia; no se fuerza una tendencia. Comprobar también la recolección automática de nuevos videos del canal.

Esta prueba debe verificar acceso, campos obtenidos, clasificación del video, calidad de las observaciones, errores, latencia y costo real. La documentación confirma capacidades de los proveedores; la validación con cuentas del equipo sigue pendiente.

## Estado del proyecto

La carpeta raíz del proyecto es `SENIALON/`. Contiene los documentos de producto, el logo y la configuración de OpenSpec para preparar las especificaciones. Todavía no se han generado especificaciones formales ni código del producto. Las capacidades y rutas descritas en este documento son propuestas de producto por especificar y validar.

## Criterios de aceptación del MVP esencial

- [ ] Recolectar videos reales de canales configurados sin copiar manualmente los datos de cada pieza.
- [ ] Mostrar métricas disponibles, fecha de captura y clasificación verificable o estado de candidato corto.
- [ ] Hacer visible la comparación utilizada para seleccionar una pieza.
- [ ] Obtener observaciones audiovisuales de un video real con marcas de tiempo y contrastarlas con el original.
- [ ] Ejecutar JEV sobre el material obtenido y conservar modelo y criterios utilizados.
- [ ] Mostrar desempeño, valor para la audiencia y contexto de tendencia en bloques separados, con sus evidencias y datos pendientes.
- [ ] Cruzar el contenido con contexto real identificable, conservando fuente, fecha, países o territorios consultados y periodo; registrar también resultados sin coincidencia.
- [ ] Comprobar que muchas vistas o una tendencia no bastan para recomendar una pieza sin valor respaldado, y que una pieza útil sin tendencia se conserva como oportunidad duradera.
- [ ] Presentar una explicación respaldada y una adaptación revisable.
- [ ] Mostrar errores de cuota, acceso o procesamiento y material insuficiente.
- [ ] Medir tiempo y costo efectivos del recorrido, indicando qué incluyen.

## Pendientes para construir

Confirmar los accesos a YouTube Data API, al servicio de análisis audiovisual y a JEV, y la disponibilidad del equipo. Los dos canales y el mercado editorial LatAm ya están definidos. Concretar los países o territorios cubiertos por la fuente y el periodo de la demostración, validar la exportación oficial e implementar su carga y cruce. Probar los servicios antes de ampliar el corpus. El plan operativo incorpora valor y contexto de tendencia a los cuatro frentes existentes.

Notion queda como integración opcional planificada, con acceso y base de destino pendientes de confirmar. Se retira del trabajo de la demo si pone en riesgo cualquier criterio del MVP esencial o la preparación de la entrega.

## Referencias

- Reto 30X Radar de contenido y Reto 30X JEV, en esta carpeta.
- [YouTube Data API](https://developers.google.com/youtube/data/getting-started).
- [Filtro de duración de búsqueda](https://developers.google.com/youtube/v3/docs/search/list).
- [Definición de Shorts](https://support.google.com/youtube/answer/15424877).
- [Descarga de subtítulos](https://developers.google.com/youtube/v3/docs/captions/download).
- [Gemini y análisis de video por URL](https://ai.google.dev/gemini-api/docs/video-understanding).
- [Condiciones de métricas derivadas](https://developers.google.com/youtube/terms/derived-metrics-policy).
- [Introducción de JEV](https://docs.typesafe.ai/introduction).
- [Conexiones y permisos de Notion](https://www.notion.com/help/add-and-manage-connections-with-the-api).
- [Google Trends Trending Now y exportación oficial](https://support.google.com/trends/answer/3076011?hl=en).
- [Interpretación y límites de Google Trends](https://support.google.com/trends/answer/4365533?hl=en).
