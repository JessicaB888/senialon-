# Definición del MVP SENIALON

SENIALON es una aplicación web para un operador que recolecta videos cortos públicos de YouTube, identifica cambios en la frecuencia de publicaciones sobre IA y los convierte en oportunidades editoriales revisables para líderes y equipos de LatAm. Separa qué está aumentando en el corpus, qué aporta valor a la audiencia y qué elementos del contenido podrían contribuir a su desempeño.

Esta revisión incorpora las decisiones confirmadas y contrasta la [investigación aportada](<Solucion_Reto_30X_ Radar_de_Contenido.md>) y el [prototipo de referencia](radar_30x_prototype-v2.py). Sus algoritmos, cifras, exclusiones de audiencia e integraciones no se convierten automáticamente en requisitos aprobados. El prototipo se revisó como texto; no se ejecutó ni se validó como producto.

## Problema y resultado

Traer métricas no explica qué producir. SENIALON reúne evidencia temporal, observaciones audiovisuales y evaluación editorial en una oportunidad con fuentes, límites y adaptación. Las explicaciones son hipótesis; no demuestran causalidad, veracidad de las afirmaciones del video ni éxito futuro.

La viralidad no acredita valor; el crecimiento de publicaciones tampoco acredita demanda de audiencia. Una pieza útil puede conservarse sin señal temporal. Una pieza popular o un tema creciente pueden carecer de valor para el público objetivo.

## Decisiones confirmadas

- Aplicación web para un operador durante la demo, desplegada en Vercel con una URL accesible para otras personas.
- Toda la aplicación requiere una credencial compartida de demo; no se incluye modo público de lectura ni cuentas individuales.
- Resultados y decisiones con persistencia duradera: deben recuperarse tras cerrar el navegador o reiniciar la aplicación, conservando contexto y revisión.
- Python para el análisis y el mismo stack frontend del proyecto `personal-finance-assistant`: Next.js con App Router, React y TypeScript. El prototipo aportado no determina la arquitectura ni acredita una implementación existente.
- Adquisición automática de publicaciones y contexto temporal de YouTube; sin importación obligatoria de archivos.
- Corpus estable de los 11 canales listados abajo; no representa todo YouTube ni la audiencia de LatAm.
- Videos públicos de hasta 180 segundos, con IA como tema principal o una aplicación concreta explicada. Una mención incidental no basta.
- Usar «candidato corto» cuando no se pueda confirmar que sea un Short mediante evidencia verificable; duración elegible no equivale a Short confirmado.
- Últimos 7 días completos frente a los 7 anteriores, excluyendo el día en curso, con corte en **America/Bogota, UTC−5**. Mostrar los límites de ambas ventanas.
- Posible tendencia: crecimiento de publicaciones por **tema principal**, uno por video. Los secundarios se muestran sin contar; los formatos se analizan en profundidad pero no producen señales temporales en la demo.
- El sistema propone automáticamente grupos temáticos usando ambas ventanas y el operador los confirma antes de calcular señales. No hay edición manual de clasificaciones de videos durante la demo.
- Conteos, diferencia absoluta y porcentaje cuando la base sea positiva y la comparación evaluable. Base conocida cero y actual positiva: «nuevo en el corpus», sin porcentaje.
- JEV es obligatorio para pertinencia IA, valor y afinidad de persona, contexto de empresa y pilar, mediante decisiones tipadas. Cálculos y fechas se resuelven de manera determinista.
- El operador puede escoger cualquier video elegible para análisis audiovisual profundo, formato, valor, afinidad y adaptación, aunque su tema no crezca.
- Valor con tres estados: **aporte respaldado**, **utilidad no sustentada** e **información insuficiente**. Pilares aprobados: ROI y costos de IA, automatización comercial con IA, eficiencia operativa con IA y liderazgo aplicado a IA; además de «otro pertinente» e «información insuficiente».
- Se permite una demo con cobertura parcial explícita. Si faltan datos, la comparación completa de los once canales queda pendiente; aceptar esa demo no acredita cobertura ni crecimiento completos.
- LatAm es el mercado editorial, no una medición de la ubicación de los espectadores.
- Notion: guardado manual opcional, última prioridad y sin condicionar la entrega esencial.
- Cuatro integrantes; entrega el 18 de octubre de 2026 antes de las 12:00, hora de Colombia. Nombres, experiencia individual y horas disponibles siguen sin confirmar.
- Vercel tiene un plan de pago activo ya abonado aparte. El máximo para **nuevos consumos de APIs y extras de la demo es USD 20**; no incluye ese abono existente. El límite no garantiza un volumen procesable sin pruebas.

## Corpus de referencia

Las URLs están confirmadas; su resolución a identificadores y acceso operativo siguen pendientes. No sustituir canales por supuesta equivalencia.

1. https://www.youtube.com/@30X_by_Andres_Bilbao
2. https://www.youtube.com/@30XDevs
3. https://www.youtube.com/@Platzi
4. https://www.youtube.com/@EloisaWolf
5. https://www.youtube.com/@manuelavillegas
6. https://www.youtube.com/@Gartnervideo
7. https://www.youtube.com/@AdrianSaenz
8. https://www.youtube.com/@EDteam
9. https://www.youtube.com/@KimiMoonshot
10. https://www.youtube.com/user/TheRANDCorporation
11. https://www.youtube.com/channel/UChugFTK0KyrES9terTid8vA

## Estructura de capas

Las capas 1–3 producen señales descriptivas; las capas 4–6 evalúan contenido y oportunidades. La afinidad editorial no altera retrospectivamente el conteo de publicaciones elegibles.

| Capa | Pregunta | Resultado verificable |
| --- | --- | --- |
| 1. Recolección, elegibilidad y cobertura | ¿Qué publicaciones podemos observar? | IDs, URLs, canal, fechas, duración, métricas disponibles y captura; condición pública y duración; cobertura por canal, ventana y etapa; faltantes. |
| 2. Pertinencia IA y agrupación semántica | ¿Es pertinente y cuál es su tema principal? | IA central/aplicación concreta evaluada con JEV; grupos automáticos de ambas ventanas; un tema principal por video contado y secundarios sin conteo, con evidencia y versión. Confirmación del operador antes del cálculo. |
| 3. Comparación temporal | ¿Qué tema aumentó entre semanas? | Videos distintos por tema principal, conteos, diferencia y porcentaje permitido, publicaciones y canales de respaldo y comparabilidad. Sin señales por formato o tema secundario. |
| 4. Análisis profundo del contenido | ¿Qué recursos observamos y qué podrían aportar? | Pieza elegible elegida por el operador, con o sin crecimiento; formato, gancho verbal, visual y auditivo, estructura y problema con marcas temporales; métricas e hipótesis separadas. |
| 5. Valor y afinidad editorial | ¿A quién ayuda y en qué contexto? | JEV evalúa los tres estados de valor y, por separado, persona, contexto de empresa y pilar aprobado, con motivos e incertidumbre. |
| 6. Adaptación y revisión | ¿Qué vale la pena probar? | Ángulo, gancho propuesto, estructura, CTA si aplica, fuentes, límites y decisión humana duradera; Notion opcional. |

### Agrupación y comparabilidad

Agrupar variantes de un concepto permite contar una conversación sin depender de coincidencias literales. Compartir «agentes» o «IA» no basta para fusionar aplicaciones distintas. Cada pertenencia conserva evidencia. Tema, formato y pilar editorial son conceptos distintos.

El sistema propone los grupos automáticamente usando el material de ambas ventanas. El operador confirma el conjunto antes de calcular las señales; mientras falte esa confirmación, el cálculo permanece pendiente. La confirmación de grupos es distinta de la revisión editorial y no autoriza edición manual de las clasificaciones de videos en la demo.

Ambas ventanas usan el mismo corpus, reglas y versión de clasificación. Cada video contado tiene exactamente un tema principal y cuenta una sola vez, aunque se recolecte repetidamente. Los secundarios son visibles como contexto y no suman publicaciones a otros grupos. Ante falta de evidencia para un tema principal, se conserva insuficiencia y se refleja su efecto sobre la cobertura. Si cambian los criterios, se reclasifican ambas ventanas antes de una nueva comparación evaluable.

La agrupación semántica es un comportamiento requerido; embeddings, clustering y proveedores no son requisitos impuestos por la investigación. Los formatos se observan en el análisis profundo de las piezas seleccionadas, fuera de los conteos de tendencia. Un formato audiovisual necesita evidencia del contenido: la longitud del título no demuestra un tutorial o una entrevista.

### Señal temporal

Sean A las publicaciones del periodo anterior y B las del reciente: diferencia = B − A; variación = 100 × (B − A) / A, solo si A > 0 y la comparación es evaluable. No hay puntuación global ni umbral inventado de tendencia.

| Situación | Presentación |
| --- | --- |
| A > 0 y comparación evaluable | A, B, diferencia y variación; aumento, igualdad o descenso según el cálculo. |
| A = 0 y B > 0, base observada suficiente | «Nuevo en el corpus», conteos y diferencia; porcentaje no aplicable. |
| A = 0 y B = 0, datos suficientes | Sin publicaciones observadas en ambas ventanas; sin señal nueva. |
| Recolección o clasificación incompleta | Conteos observados parciales y motivo; desconocido no es cero y no permite afirmar novedad o crecimiento comparable. |

La cobertura describe material público recuperable en la consulta, no un archivo de videos eliminados o privatizados. Mostrar canales efectivamente revisados, periodos, fallos y contribución por canal. Un solo canal puede explicar un aumento; no se inventa un mínimo de canales.

«Posible tendencia en el corpus» siempre debe acompañarse del cambio observado y su alcance. No afirma crecimiento de audiencia, aceleración, causalidad o tendencia global; tampoco clasifica fases emergentes/consolidadas/saturadas, predice longevidad ni promete anticiparse a otros creadores.

La demo puede aceptarse con adquisición y clasificación parciales declaradas, conservando los once canales como corpus previsto. Muestra resultados reales disponibles, faltantes y motivos; la comparación completa continúa pendiente. No se sustituye el corpus por los canales recuperados ni se presenta un porcentaje o novedad del corpus completo con una base desconocida. Esta aceptación no elimina el objetivo de una comparación completa ni permite datos simulados.

### Matriz editorial de tres dimensiones

Se incorpora de la investigación la separación entre **persona**, **empresa o contexto de aplicación** y **pilar de contenido**. Cada dimensión tiene razones apoyadas en el material y admite información insuficiente. Evalúa para quién podría ser útil; no identifica quién vio el video, su cargo real ni su capacidad de compra.

Los pilares aprobados para el MVP son **ROI y costos de IA**, **automatización comercial con IA**, **eficiencia operativa con IA** y **liderazgo aplicado a IA**. Se incluyen «otro pertinente» e «información insuficiente» para no forzar una pertenencia sin respaldo. Esta decisión del equipo no convierte las cifras o afirmaciones de la investigación en hechos verificados.

La evaluación de valor tiene tres resultados: **aporte respaldado**, cuando se identifica una utilidad para la audiencia y evidencia que la sustenta; **utilidad no sustentada**, cuando el material analizado no respalda ese aporte; e **información insuficiente**, cuando faltan elementos para decidir. JEV evalúa obligatoriamente valor, persona, contexto de empresa y pilar con criterios versionados y evidencia de entrada. No se adopta el rechazo automático de estudiantes, perfiles junior, B2C o comercios locales, ni puntuaciones positivas por defecto ante falta de evidencia.

Un tema de baja afinidad puede aumentar y sigue siendo visible. Valor respaldado sin crecimiento permite una oportunidad sin señal temporal; popularidad o crecimiento sin valor respaldado no bastan para recomendar una adaptación.

## Contraste con la investigación y el prototipo

| Propuesta de los archivos | Ajuste para SENIALON |
| --- | --- |
| Ingesta multirred continua y RSS | Corpus fijo de YouTube y ejecución por el operador. |
| Frecuencia de conceptos y agrupación semántica | Proponer grupos usando ambas ventanas, confirmar con el operador y contar solo el tema principal de cada video, con trazabilidad y criterios comunes. |
| Kleinberg, velocidad y aceleración | Investigación futura. El MVP compara semanas; el prototipo usa una captura ponderada dividida por edad, sin secuencia de estados ni medición de aceleración. |
| Pesos 50/35/15 y score compuesto de popularidad/afinidad | Excluir pesos sin validar; mantener datos, señal, valor y afinidad separados. |
| Guardados, compartidos y «comentarios profundos» | No suponer acceso; un conteo de comentarios no demuestra profundidad. |
| Gancho verbal, visual y auditivo | Incorporar con marcas temporales; no convertir tres segundos o una estética en causa universal del éxito. |
| Análisis causal y grafos de autoridad | Hipótesis observacionales; centralidad requiere un grafo y datos no definidos para el MVP. |
| Persona/Company/Content Pillar Fit rígidos | Tres dimensiones explicables; usar los cuatro pilares aprobados por el equipo, «otro pertinente» e insuficiencia, sin adoptar rechazos sociales automáticos. |
| Plan prescriptivo y urgencias de 24–72 horas | Adaptación revisable sin urgencias, cifras, resultados propios o activos comerciales inventados. |
| Aply, Gmail, Slack y distribución automática | Fuera de alcance; Notion es la única extensión opcional prevista, manual y al final. |

El trabajo de [Kleinberg](https://www.cs.cornell.edu/home/kleinber/bhs.pdf) modela estados de intensidad de un flujo temporal; interacción por hora no acredita implementar ese método. La [referencia pública de videos](https://developers.google.com/youtube/data/reference/rest/v3/videos?hl=en) no ofrece guardados o compartidos como métricas públicas equivalentes a las presupuestas en la investigación. Estas limitaciones no impiden contar publicaciones.

## Recorrido y ficha

Abrir la URL de Vercel → acceder con la credencial compartida → ejecutar adquisición → revisar cobertura y ventanas → revisar y confirmar los grupos propuestos → calcular señales por tema principal → seleccionar una pieza elegible → revisar análisis audiovisual profundo, formato, valor y afinidad → evaluar adaptación → guardar decisión humana.

La selección para análisis profundo no depende de un aumento temporal: el operador puede elegir cualquier pieza elegible del listado, incluso sin crecimiento o con comparación completa pendiente. No se ofrece edición manual de clasificaciones de videos durante la demo. Confirmar grupos y registrar una decisión editorial no cambia las asignaciones automáticamente producidas.

La ficha conserva fuente, video, canal, fechas, duración, condición de candidato/Short, tema principal y secundarios sin conteo, métricas y su base de comparación cuando exista. Presenta señal temporal por tema principal y publicaciones de respaldo, cobertura, observaciones y formato con marcas de tiempo, decisiones reales de JEV y versión de criterios, uno de los tres estados de valor, afinidad en tres dimensiones y adaptación.

Separar hechos, cálculos, clasificaciones, hipótesis y propuestas. Sin comparación válida, el desempeño es no evaluable; no se presume éxito. Si falta audio o imagen, esa dimensión queda pendiente sin completarla desde el título. La adaptación no inventa cifras, casos propios, mejoras, plazos ni recursos para el CTA. Evaluar utilidad no equivale a verificar externamente todas las afirmaciones de la pieza.

Los resultados y la revisión se conservan de manera duradera: cerrar el navegador o reiniciar la aplicación no elimina lo guardado. Al recuperar una oportunidad se mantienen identificador y fecha de ejecución, corpus, ventanas Bogotá, cobertura, grupos confirmados y versión, evidencia, decisiones y estado de revisión. Una ejecución anterior usada como respaldo se identifica con su fecha; no se presenta como adquisición nueva.

Toda la aplicación y sus operaciones requieren la credencial compartida de demo, también al intentar acceder directamente a resultados. No se introducen cuentas individuales ni acceso público de solo lectura. La demo debe poder abrirse desde su URL por otra persona que disponga de la credencial; el repositorio público no contiene secretos.

## Notion opcional

Solo tras validar el núcleo y cubrir evaluación y entrega: «Guardar oportunidad en Notion» a una única base del equipo preconfigurada. Conservar ID y enlace del video, métricas y captura, señal y ventanas, fuentes y cobertura, evidencia y revisión, decisiones JEV, valor, afinidad, hipótesis, adaptación y estado editorial pendiente.

Confirmar guardado real y enlace, controlar duplicados por ID de video y conservar la ficha ante errores. No incluye sincronización bidireccional, cuentas de terceros, publicación automática, Gmail o Slack. Si no se comprueba, queda pendiente y la demo esencial sigue siendo válida.

## Evolución futura: algoritmo predictivo de tendencias

Por indicación del equipo, conservar [radar_30x_prototype-v2.py](radar_30x_prototype-v2.py) como base candidata para desarrollar una capa predictiva que identifique posibles tendencias. Retomar su estructura de evaluación y sus señales propuestas al especificar esa evolución, sin dar por aprobados sus pesos ni umbrales.

El archivo actual contiene una heurística de puntuación; su capacidad de anticipar tendencias sigue pendiente de validación. Antes de presentarlo como algoritmo predictivo operativo, definir qué resultado futuro se busca anticipar y con qué horizonte, y contrastarlo con datos temporales y resultados posteriores no usados para ajustar el algoritmo.

Esta evolución queda fuera del alcance y de los criterios de aceptación del MVP actual. Se conserva el archivo original sin ejecutarlo ni integrarlo durante la fase de especificaciones.

## Ruta técnica propuesta y estado de accesos

Python para el análisis, Vercel para el despliegue y la reutilización del stack frontend de `personal-finance-assistant` están confirmados. La referencia inspeccionada usa **Next.js 16.3.3 con App Router, React y React DOM 19.3.0 resueltos y TypeScript 5.9.3**, con npm y lockfile v3; declara Node.js `>=24.21.0 <25`. La planificación conserva esa base, con ESLint, Prettier, Vitest y Playwright como herramientas de calidad. No se han instalado dependencias ni generado código de SENIALON. La referencia no acredita Tailwind, shadcn/ui ni una biblioteca de iconos seleccionada; tampoco exige copiar el diseño visual de PFA o sus funciones financieras.

La ruta técnica recomendada separa el frontend Next.js del backend **Python 3.12 con FastAPI**, donde residen el análisis, las etapas y la persistencia de su estado. **PostgreSQL en Supabase Free** sigue propuesto para el almacenamiento duradero. Se plantea desplegar ambos como servicios del mismo proyecto mediante **Vercel Services, actualmente beta**: Next.js como servicio público y Python interno mediante un binding de servicio. El acceso de la cuenta a esta modalidad, los runtimes compatibles y un primer despliegue con comunicación real deben verificarse antes de ampliar funciones; no se consideran integraciones ya probadas.

La credencial compartida se valida en las rutas de Next.js y el backend valida las llamadas autorizadas recibidas por el binding; no se expone una ruta Python desprotegida como alternativa al acceso de demo. Estas decisiones técnicas y sus comprobaciones se detallan en [design.md](../openspec/changes/definir-mvp-senialon/design.md) y [tasks.md](../openspec/changes/definir-mvp-senialon/tasks.md). No atribuyen experiencia al equipo ni replican la autenticación específica de PFA.

| Dependencia | Estado declarado y comprobación pendiente |
| --- | --- |
| Gemini | Configurado según el equipo; no se ha probado todavía el análisis audiovisual del recorrido SENIALON. Comprobar URLs públicas, evidencia temporal, errores, cuotas y uso real. |
| Vercel | Configurado, con plan de pago activo ya abonado aparte. Por verificar acceso a Services beta, despliegue de Next.js y FastAPI en el mismo proyecto, binding interno, acceso protegido y persistencia entre reinicios. |
| YouTube Data API | Sin configurar; habilitar el acceso del proyecto y comprobar resolución de canales, campos, cuotas y adquisición real. |
| JEV | Sin configurar; obtener el acceso del equipo y ejecutar decisiones auténticas de pertinencia IA, valor y afinidad con uso y versión registrados. |
| Supabase | Por configurar para la ruta de almacenamiento propuesta; comprobar escritura y recuperación duraderas. |

El presupuesto confirmado es **USD 20 para nuevos consumos de APIs y extras de la demo**. El abono existente de Vercel queda separado. Las pruebas y reintentos pueden consumir ese presupuesto; registrar uso, costo disponible y estimaciones con su alcance. No asignar montos por proveedor ni garantizar capacidad o costo total sin volúmenes reales. Un servicio declarado configurado no equivale a una prueba superada.

El primer bloque de ejecución posterior a las especificaciones será configurar lo que falta y probar las dependencias reales antes de ampliar funciones. La planificación no presupone credenciales disponibles, un inventario de videos concreto ni éxito de las llamadas. Si una dependencia falla, conservar el bloqueo y su alcance, sin simular resultados.

No se presupone acceso a subtítulos de terceros, retención, guardados, compartidos ni series históricas de interacción. Verificar condiciones aplicables al análisis derivado y al almacenamiento antes de construir. Usar contenido público según las restricciones del reto, sin datos personales ni acceso detrás de login de terceros.

## Pendientes de operación

- Asignar nombres a los cuatro frentes y confirmar experiencia individual y horas disponibles, sin inventar disponibilidad.
- Configurar y comprobar realmente YouTube Data API, JEV y la persistencia propuesta; verificar también los accesos declarados de Gemini y Vercel, incluido Services beta y la comunicación protegida entre Next.js y Python.
- Resolver los once canales y medir el material elegible recuperable en ambas ventanas, distinguiendo cero conocido de falta de datos.
- Medir calidad audiovisual y de decisiones, costos, cuotas, latencia y errores con el proyecto del equipo. Conservar versiones y evidencias de las pruebas.
- Comprobar la URL, protección completa mediante credencial compartida y recuperación tras cierre del navegador y reinicio de la aplicación.
- Verificar el paquete y condiciones finales de envío; registrar cobertura parcial cuando corresponda y mantener pendiente la comparación completa que no se haya logrado.
- Configurar acceso y base de Notion solamente si se alcanza esa extensión opcional.

## Criterios de aceptación del recorrido esencial

- [ ] Recolección automática real con cobertura, fechas y errores visibles.
- [ ] Hasta 180 segundos, IA central o aplicación concreta; incertidumbre y distinción candidato/Short.
- [ ] Grupos propuestos automáticamente usando ambas ventanas y confirmados por el operador antes de calcular señales; conservar confirmación y criterios versionados.
- [ ] Un tema principal por video contado; secundarios visibles sin conteo, sin señales por formato y sin edición manual de clasificaciones en la demo.
- [ ] Temas trazables y sin duplicados; criterios comunes en ambas ventanas, con reclasificación de ambas ante cambios.
- [ ] Dos ventanas completas en America/Bogota UTC−5 y exclusión del día en curso.
- [ ] Conteos, diferencia y porcentaje permitido; base cero positiva como nuevo, nunca convertir desconocido en cero.
- [ ] Publicaciones y contribución de canales de respaldo; interpretación limitada al corpus.
- [ ] Si la demo es parcial, mostrar faltantes y motivos y mantener la comparación completa de once canales pendiente; aceptar esa demo no acredita crecimiento ni cobertura completos.
- [ ] Selección de cualquier pieza elegible, incluso sin crecimiento, para observaciones audiovisuales profundas y formato con marcas temporales y dimensiones faltantes explícitas.
- [ ] Decisiones auténticas obligatorias de JEV en pertinencia IA, valor y afinidad de persona/contexto/pilar, con evidencia, modelo y versión de criterios.
- [ ] Valor en los tres estados aprobados y afinidad con los cuatro pilares, «otro pertinente» e «información insuficiente», sin exclusiones sociales automáticas.
- [ ] Desempeño, señal, valor y afinidad separados; afinidad no cambia el conteo.
- [ ] Contenido útil sin crecimiento conservado; popularidad o crecimiento no bastan para recomendar.
- [ ] Hipótesis y adaptación revisables sin cifras ni causalidad inventadas; resultados y decisión recuperables tras cerrar navegador y reiniciar la aplicación.
- [ ] URL desplegada en Vercel utilizable por otras personas con la credencial compartida; toda la aplicación y sus operaciones protegidas, sin cuentas individuales ni modo público de lectura.
- [ ] Errores e información insuficiente visibles; tiempo y costo medidos con su alcance.
- [ ] Nuevos consumos de APIs y extras registrados frente al máximo de USD 20, separados del abono existente de Vercel; configuraciones declaradas diferenciadas de pruebas realizadas.

## Estado y especificaciones

El cambio [definir-mvp-senialon](../openspec/changes/definir-mvp-senialon/proposal.md) recoge la propuesta y seis capacidades: youtube-corpus, content-classification, publication-signals, editorial-analysis, operator-review y notion-export. El [diseño](../openspec/changes/definir-mvp-senialon/design.md) y las [tareas](../openspec/changes/definir-mvp-senialon/tasks.md) desarrollan la planificación previa al código. Los artefactos no describen una implementación terminada ni acreditan pruebas de integración. No se ha iniciado código del producto. El Python aportado en docs permanece como referencia externa sin integración.

Esta revisión sustituye las propuestas anteriores de CSV de Google Trends, corpus limitado a dos canales, tendencias externas como criterio suficiente, conteos por formato y política multietiqueta pendiente. El conteo actual usa un tema principal único y grupos confirmados por el operador. Las fuentes aportadas se conservan sin cambios. El plan está en [PLAN_DE_TRABAJO.md](PLAN_DE_TRABAJO.md).

## Referencias

- Retos 30X Radar de contenido y JEV, y auditoría estratégica aportados en la carpeta superior.
- [Investigación](<Solucion_Reto_30X_ Radar_de_Contenido.md>) y [prototipo](radar_30x_prototype-v2.py).
- [YouTube Data API: videos](https://developers.google.com/youtube/data/reference/rest/v3/videos?hl=en).
- [Publicaciones de una playlist](https://developers.google.com/youtube/data/reference/rest/v3/playlistItems/list).
- [Criterios de Shorts](https://support.google.com/youtube/answer/15424877).
- [Kleinberg: Bursty and Hierarchical Structure in Streams](https://www.cs.cornell.edu/home/kleinber/bhs.pdf).
- [Gemini: video](https://ai.google.dev/gemini-api/docs/video-understanding).
- [Condiciones de métricas derivadas](https://developers.google.com/youtube/terms/derived-metrics-policy).
- [JEV](https://docs.typesafe.ai/introduction).
