# Plan de trabajo del MVP SENIALON

El equipo de cuatro personas construirá una aplicación web para un operador que recolecte videos cortos públicos de YouTube, identifique cambios en la frecuencia de publicaciones sobre IA y convierta referencias en oportunidades editoriales revisables para líderes y equipos de LatAm. El producto separa señal temporal, desempeño observado, valor para la audiencia y afinidad editorial. Ninguna de estas dimensiones sustituye las otras.

La entrega oficial es el **18 de octubre de 2026 antes de las 12:00 del mediodía, hora de Colombia**. Se propone el envío interno a las **11:00** para conservar margen; es un objetivo de coordinación, no una capacidad comprometida. Los nombres, experiencia individual y horas disponibles de los cuatro integrantes siguen sin confirmar; no se les atribuyen capacidades ni compromisos horarios.

La fase actual es de especificaciones. Este documento organiza el trabajo posterior; sus casillas no representan implementación realizada. La definición de producto está en [DEFINICION_MVP.md](DEFINICION_MVP.md) y los artefactos formales del cambio en [la propuesta OpenSpec](../openspec/changes/definir-mvp-senialon/proposal.md), sus seis capacidades (`youtube-corpus`, `content-classification`, `publication-signals`, `editorial-analysis`, `operator-review` y `notion-export`), [diseño](../openspec/changes/definir-mvp-senialon/design.md) y [tareas](../openspec/changes/definir-mvp-senialon/tasks.md). No iniciar código del producto durante esta fase.

## Decisiones que debe preservar el equipo

- Una aplicación web desplegada en Vercel, con URL accesible para otras personas. Toda la aplicación requiere una credencial compartida de demo; no hay modo público de lectura ni cuentas individuales en el MVP.
- Resultados y decisiones con persistencia duradera: cerrar el navegador o reiniciar la aplicación no los elimina. Su contexto y estado de revisión deben recuperarse.
- Python para el análisis y el mismo stack frontend de `personal-finance-assistant`: Next.js con App Router, React y TypeScript. La referencia usa Next.js 16.3.3, React/React DOM 19.3.0 y TypeScript 5.9.3 resueltos, npm con lockfile v3 y Node.js `>=24.21.0 <25`; ESLint, Prettier, Vitest y Playwright son herramientas de calidad. No se deduce Tailwind, shadcn/ui ni una biblioteca de iconos aprobada, ni se copia el diseño visual de PFA.
- Backend propuesto Python 3.12/FastAPI y PostgreSQL en Supabase Free, con estado de etapas y persistencia gestionados desde Python. Despliegue propuesto en Vercel Services beta: Next.js público y Python interno mediante binding en el mismo proyecto. Verificar acceso, runtimes y primer despliegue antes de ampliar funciones; no atribuir experiencia o integraciones validadas al equipo.
- Obtención automática tanto de publicaciones como de su contexto de tendencia en YouTube. La importación de CSV de Google Trends queda sustituida por esta decisión.
- Un corpus fijo de once canales, sin búsqueda global ni extrapolación a todo YouTube o a toda la audiencia de LatAm.
- Videos públicos de hasta tres minutos. Se permite la etiqueta «candidato corto» cuando no haya evidencia suficiente para confirmar que sea un Short.
- Incluir contenido donde la IA sea el tema principal o se explique una aplicación concreta. Una mención incidental de ChatGPT u otra herramienta no basta.
- Comparar los últimos siete días completos frente a los siete anteriores, excluyendo el día en curso, con corte en **America/Bogota, UTC−5**. Mostrar los límites de ambas ventanas.
- Medir cambios solo por **tema principal**, uno por video. Los temas secundarios se muestran sin contar; los formatos pertenecen al análisis profundo y no generan señales temporales en la demo.
- Proponer automáticamente grupos temáticos usando ambas ventanas y exigir su confirmación por el operador antes de calcular señales. La demo no incluye edición manual de las clasificaciones de videos.
- Mostrar conteos de ambos periodos, diferencia y variación calculable. Con base conocida de cero y publicaciones actuales positivas, indicar «nuevo en el corpus» sin inventar porcentaje. Datos ausentes no equivalen a cero.
- JEV es obligatorio para evaluar pertinencia de IA, valor y afinidad de persona, contexto de empresa y pilar, mediante decisiones tipadas y sustentadas. El cálculo de fechas, conteos y variaciones corresponde al código que se construya después de las especificaciones.
- El operador puede elegir cualquier video elegible para análisis audiovisual profundo, formato, valor, afinidad y adaptación, incluso cuando su tema no crezca.
- La evaluación de valor tiene tres estados: **aporte respaldado**, **utilidad no sustentada** e **información insuficiente**. Los pilares aprobados son ROI y costos de IA, automatización comercial con IA, eficiencia operativa con IA y liderazgo aplicado a IA, además de «otro pertinente» e «información insuficiente».
- La demo puede aceptarse con cobertura parcial declarada. La comparación completa de los once canales queda pendiente si faltan datos; esta excepción no convierte desconocidos en cero ni autoriza afirmaciones de cobertura completa.
- Notion es la última prioridad, opcional; no condiciona el cierre ni la demo del recorrido esencial.

## Accesos, presupuesto y primer bloque de ejecución

El equipo declara Gemini y Vercel configurados; todavía no se han comprobado mediante el recorrido real de SENIALON. YouTube Data API y JEV están sin configurar; Supabase también requiere configuración. El plan de pago de Vercel no acredita acceso a Services beta ni comunicación mediante binding entre frontend y backend: comprobarlos con un primer despliegue protegido y registrar cualquier bloqueo. No presentar ninguna declaración de configuración como una prueba de acceso, cuota, calidad o despliegue operativo.

Vercel tiene un plan de pago activo ya abonado aparte. El máximo confirmado es de **USD 20 en nuevos consumos de APIs y extras de la demo**; el abono existente de Vercel no se descuenta de ese límite. No se reparte un gasto por proveedor ni se garantiza un costo total a partir de tarifas sin volumen medido.

El primer bloque al iniciar la ejecución posterior a las especificaciones será habilitar y probar las dependencias reales, con los responsables de los cuatro frentes, sin esperar una disponibilidad supuesta: adquirir datos públicos con YouTube, ejecutar decisiones auténticas con JEV, observar audio y video mediante Gemini, y comprobar acceso desplegado y almacenamiento duradero. Conservar fecha, campos obtenidos, errores, uso y costo disponible; resolver bloqueos antes de ampliar funciones. Estos son trabajos pendientes, no pruebas realizadas durante esta revisión documental.

Las pruebas y reintentos también pueden consumir presupuesto. Registrar consumos nuevos y estimaciones con su alcance, verificar las condiciones de las cuentas y evitar procesos sin control de gasto. Las tarifas, cuotas y promociones publicadas no garantizan el costo ni la capacidad efectiva del proyecto del equipo.

## Corpus acordado

Los enlaces seleccionan las fuentes; su resolución operativa y la existencia de publicaciones elegibles en las ventanas deben verificarse. Un enlace que no se resuelva produce un estado de cobertura pendiente o error, no una sustitución silenciosa del canal.

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

## Flujo de seis capas

| Capa | Trabajo y resultado verificable |
| --- | --- |
| 1. Adquisición y cobertura | Recolectar automáticamente los dos periodos del corpus acordado; conservar identificadores, fechas, procedencia, campos obtenidos, duplicados y errores por canal y ventana. |
| 2. IA y organización semántica | Evaluar con JEV IA central o aplicación concreta; proponer automáticamente grupos con ambas ventanas y asignar un tema principal por video, conservando secundarios sin conteo. Registrar evidencia, criterios y confirmación de grupos por el operador. |
| 3. Señales descriptivas | Calcular solo después de confirmar grupos; contar cada publicación una vez por su tema principal y periodo. Mostrar diferencia, variación válida, «nuevo en el corpus» o ausencia de aumento observado, junto con cobertura y límites. |
| 4. Análisis audiovisual | Analizar profundamente cualquier pieza elegible elegida por el operador, con o sin crecimiento; examinar formato, gancho verbal, visual y auditivo, estructura y problema con fragmentos y marcas temporales. |
| 5. Afinidad y valor | Evaluar con JEV los tres estados de valor y, por separado, persona destinataria, contexto de empresa y pilar aprobado, con motivos e insuficiencia. La afinidad no altera conteos. |
| 6. Adaptación y revisión | Proponer un ángulo, gancho, desarrollo y CTA sustentados; conservar hechos, hipótesis, sugerencias y límites. El operador revisa y decide; el resultado debe poder recuperarse. |

La señal se calcula antes de aplicar la selección editorial. Contenido pertinente de IA con bajo encaje para 30X permanece en el corpus y en los conteos; su afinidad se presenta aparte. Una pieza útil sin aumento de publicaciones puede conservarse como oportunidad de valor duradero.

La agrupación semántica debe evitar tanto separar sinónimos como fusionar asuntos distintos por compartir vocabulario de IA. El sistema propone los grupos usando ambas ventanas; el operador confirma el conjunto antes de calcular señales. Cada video contado tiene un único tema principal respaldado por evidencia y los secundarios quedan como información sin aumentar conteos. La confirmación de grupos y la revisión editorial no habilitan edición manual de clasificaciones en la demo. Si cambia la versión de criterios, ambas ventanas requieren reclasificación antes de una nueva comparación.

No imponer embeddings, Kleinberg ni otro método como requisito del MVP. Los formatos se observan durante el análisis profundo y se conservan como atributo de la pieza, fuera del conteo de tendencias. Clasificar un formato audiovisual exige material que lo respalde; duración y título no bastan.

La matriz editorial usa los pilares aprobados: ROI y costos de IA, automatización comercial con IA, eficiencia operativa con IA y liderazgo aplicado a IA; admite «otro pertinente» e «información insuficiente». Evalúa afinidad separadamente de los tres estados de valor y no impone exclusiones rígidas de estudiantes, B2C u otros perfiles. No presume los cargos, presupuesto o ubicación de los espectadores reales.

El documento [Solucion_Reto_30X_ Radar_de_Contenido.md](<Solucion_Reto_30X_ Radar_de_Contenido.md>) y el archivo [radar_30x_prototype-v2.py](radar_30x_prototype-v2.py) son material de referencia. Sus algoritmos, ejemplos, pesos, cifras, instrucciones e integraciones no se incorporan automáticamente como requisitos ni demuestran funciones construidas. No se ejecuta el prototipo durante esta fase.

El prototipo se conserva como base candidata para una evolución predictiva futura, fuera del MVP y de sus criterios de aceptación. No se presenta su heurística como una predicción ya validada ni se inicia esa evolución para la demo.

## Cuatro frentes de trabajo

| Responsable por asignar | Frente | Entrega verificable |
| --- | --- | --- |
| Integrante 1 | Adquisición y calidad del corpus | Capa 1: resolución de los once canales, adquisición automática real, ventanas, procedencia, deduplicación y cobertura por etapa. |
| Integrante 2 | Clasificación, señales y JEV | Capas 2–3: pertinencia de IA, grupos propuestos con ambas ventanas y confirmados, tema principal único, decisiones tipadas, conteos reproducibles, base cero y límites por cobertura. |
| Integrante 3 | Evidencia, valor y adaptación | Capas 4–6 junto con revisión: observaciones audiovisuales comprobables, hipótesis, afinidad separada, utilidad y propuesta editorial sin afirmaciones inventadas. |
| Integrante 4 | Interfaz, integración y entrega | Frontend Next.js/React/TypeScript y conexión protegida con FastAPI en Vercel; URL con credencial compartida, confirmación de grupos, selección de piezas, resultados duraderos, estados por capa, contrato, README, playbook y paquete. Notion solo al final. |

Los cuatro acuerdan el contrato y los criterios de aceptación antes de construir componentes independientes. El integrante 4 coordina la integración desde el primer recorrido; cada frente documenta su aporte y otra persona verifica sus resultados.

### Integrante 1 — Adquisición y calidad

- [ ] Verificar la resolución de los once enlaces, contenido público y condiciones del mecanismo de acceso propuesto.
- [ ] Habilitar YouTube Data API en el proyecto del equipo y comprobar credenciales, cuota y campos reales como parte del primer bloque; no dar por realizada la prueba.
- [ ] Aplicar America/Bogota, UTC−5, y calcular los dos intervalos completos y comparables, excluyendo el día en curso.
- [ ] Recolectar automáticamente publicaciones de ambos periodos; conservar identidad del canal, ID de video, URL, publicación, captura, duración y métricas disponibles.
- [ ] Aplicar el límite de duración sin afirmar que todos los candidatos son Shorts; registrar la evidencia de confirmación cuando exista.
- [ ] Deduplicar por identidad del video y controlar paginación, faltantes y errores. No fusionar publicaciones únicamente por título parecido.
- [ ] Entregar un lote trazable y cobertura por canal, periodo y etapa; distinguir un periodo revisado sin publicaciones de uno no recolectado. Si la demo es parcial, mantener los once canales previstos y la comparación completa pendiente.

### Integrante 2 — Clasificación, señales y JEV

- [ ] Acordar con 1 y 3 las entradas y evidencia necesarias para evaluar IA central o aplicación concreta; conservar exclusión incidental e información insuficiente.
- [ ] Configurar JEV y ejecutar decisiones auténticas como parte del primer bloque; conservar modelo, criterios, versión, evidencia, uso y errores.
- [ ] Implementar la propuesta automática de grupos usando ambas ventanas, con ejemplos contrastables y evidencia de pertenencia; esperar confirmación explícita del conjunto por el operador antes de calcular.
- [ ] Asignar exactamente un tema principal a cada video que se cuente, con referencias al material; conservar temas secundarios visibles sin contarlos. Mantener estados insuficientes cuando falte evidencia.
- [ ] Aplicar la misma versión de clasificación a ambos periodos; si cambia, reclasificar ambos antes de comparar. No incluir edición manual de clasificaciones en la demo.
- [ ] Contar una publicación una sola vez en su tema principal y periodo; excluir formatos y temas secundarios del cálculo de señales.
- [ ] Mostrar conteos previos y actuales, diferencia y variación con base positiva; con cero previo conocido y positivo actual, mostrar «nuevo en el corpus» sin porcentaje.
- [ ] Distinguir ausencia de aumento observado, ambos conteos cero y falta de datos. Una cobertura incompleta permite observaciones parciales, no una afirmación sobre todo el corpus.
- [ ] Vincular las piezas con sus agrupaciones y señales; no generar crecimiento desde el conocimiento general de JEV ni usar su confianza como probabilidad de viralidad.

### Integrante 3 — Evidencia, afinidad y adaptación

- [ ] Verificar realmente el acceso declarado a Gemini y comprobar qué material audiovisual analiza, como parte del primer bloque; conservar alcance, limitaciones, uso y errores.
- [ ] Permitir análisis profundo de cualquier pieza elegible que seleccione el operador, incluso si su tema no tiene aumento evaluable; observar su formato sin añadirlo al conteo temporal.
- [ ] Examinar gancho verbal, visual y auditivo y estructura con fragmentos y marcas verificadas. Marcar dimensiones no observadas cuando falte audio o imagen.
- [ ] Evaluar con JEV problema, aprendizaje o aplicación y respaldo, con tres estados: aporte respaldado, utilidad no sustentada e información insuficiente. No asumir que el video afirma hechos correctos por contener evidencia visual.
- [ ] Evaluar obligatoriamente con JEV persona, contexto de empresa y pilar, con motivos verificables e incertidumbre; usar los cuatro pilares aprobados más «otro pertinente» e «información insuficiente».
- [ ] Separar evaluación de valor, afinidad y señal temporal. El bajo encaje editorial no elimina publicaciones de la comparación.
- [ ] Explicar factores posibles y alternativas sin causalidad demostrada; no afirmar retención, pauta, autoridad de red o datos no obtenidos.
- [ ] Preparar adaptación revisable con ángulo, gancho, desarrollo y CTA. Identificar propuestas nuevas y evitar cifras, casos, resultados o urgencias sin fuente.
- [ ] Evaluar evidencia, clasificación y utilidad con revisión humana; registrar desacuerdos, errores y correcciones. Distinguir el material usado para ajustar criterios del empleado para evaluar.

### Integrante 4 — Integración y entrega

- [ ] Seguir el diseño técnico documentado: frontend Next.js/App Router, React y TypeScript sobre la base de PFA; backend Python 3.12/FastAPI y PostgreSQL en Supabase Free propuestos. Conservar branding de SENIALON y verificar versiones, runtimes y herramientas, sin atribuir experiencia no confirmada al equipo.
- [ ] Como parte del primer bloque, comprobar acceso a Vercel Services beta y desplegar Next.js público y FastAPI interno en el mismo proyecto; verificar el binding, la protección de las rutas Next.js y la validación del backend. Configurar la persistencia propuesta y comprobar escritura y recuperación duraderas desde la URL. Gemini y Vercel declarados configurados no equivalen a pruebas superadas.
- [ ] Coordinar contrato y ejemplos identificados, estados de procesamiento y versiones compartidas.
- [ ] Construir el recorrido protegido por una credencial compartida: ejecutar adquisición → revisar cobertura y propuesta de grupos → confirmar grupos → consultar señales → elegir cualquier pieza elegible → abrir evidencia y evaluación → revisar adaptación → guardar decisión.
- [ ] Mostrar fechas, zona de corte, corpus, conteos, cobertura y pendientes; separar señal, métricas disponibles, valor y afinidad sin un puntaje compuesto.
- [ ] Conservar resultados y decisiones de forma duradera, incluyendo fuentes, versiones y revisión; comprobar recuperación tras cerrar navegador y reiniciar la aplicación.
- [ ] Desplegar en Vercel y comprobar acceso para otra persona con la credencial compartida, protección de toda la aplicación y ausencia de edición manual de clasificaciones. No introducir cuentas individuales ni modo público de lectura.
- [ ] Integrar errores y recuperación sin fabricar datos: los fallos de adquisición, clasificación y análisis mantienen sus motivos y alcances.
- [ ] Consolidar README, playbook, evaluación y requisitos de envío; comprobar URL, arranque reproducible y respaldo real. Registrar nuevos consumos dentro del máximo de USD 20, sin incluir el abono existente de Vercel.
- [ ] **Última prioridad, opcional:** conectar una base preconfigurada de Notion y comprobar un guardado manual real solo cuando el núcleo, la evaluación y la preparación de entrega estén cubiertos.

## Contrato compartido entre frentes

| Bloque | Datos mínimos y límites |
| --- | --- |
| Ejecución y corpus | Identificador de ejecución, fuentes configuradas y resueltas, captura, America/Bogota UTC−5 e intervalos exactos de siete días; comparación completa o pendiente. |
| Publicación | ID, URL, canal, publicación, duración disponible, candidato corto o Short con evidencia; métricas disponibles con captura y procedencia. |
| Cobertura | Canales y periodos examinados; estado de adquisición, elegibilidad y clasificación; faltantes y motivo. Un faltante no vale cero. |
| Clasificación y grupos | Pertinencia IA decidida con JEV, un tema principal por video contado, secundarios sin conteo, evidencia, versión de criterios y estado insuficiente; grupos propuestos con ambas ventanas y confirmación del operador antes del cálculo. |
| Señal | Tema principal, videos de cada periodo, conteos observados, diferencia, porcentaje solo calculable, base cero y límites; sin señales por formato o tema secundario. |
| Evidencia audiovisual | Material efectivamente analizado, método, fragmentos o marcas verificadas, dimensiones observadas y ausentes y revisión pendiente o realizada. |
| Valor y afinidad | Aporte respaldado / utilidad no sustentada / información insuficiente; problema y respaldo; persona, contexto de empresa y pilar aprobado evaluados por separado con motivos e incertidumbre. |
| Decisiones tipadas | JEV obligatorio en IA, valor y las tres dimensiones de afinidad; pregunta, respuesta, modelo, versión, evidencia, uso, errores y revisión. Los conteos siguen siendo cálculos. |
| Oportunidad | Referencias a señal y pieza, hipótesis y límites, adaptación, candidatura y decisión humana con motivo y estado de revisión. |
| Interfaz y backend | Next.js/App Router, React y TypeScript presentan resultados y validan el acceso de demo; llaman al servicio interno FastAPI por binding autorizado. Python mantiene etapas, cálculos y estado persistido; el navegador no accede directamente a proveedores o al almacenamiento privilegiado. |
| Operación y entrega | URL en Vercel, acceso mediante credencial compartida a toda la aplicación, almacenamiento duradero y nuevos consumos de APIs/extras registrados frente al límite de USD 20. No incluir secretos en resultados o documentación pública. |

Cada etapa debe distinguir trabajo pendiente, en proceso, resultado disponible, información insuficiente y error. La cobertura parcial permanece visible incluso cuando otras etapas terminan. Un error técnico no es un descarte editorial. La demo no permite editar manualmente clasificaciones; una nueva versión automática de criterios exige tratar ambos periodos de forma consistente. Confirmar grupos y registrar la revisión editorial son acciones diferentes.

La comparación cuenta publicaciones, no crecimiento de vistas o audiencia. Las métricas actuales que puedan obtenerse conservan nombre, fecha y alcance propios; no se convierten en una serie histórica inexistente. Una señal del corpus no representa todo YouTube ni demuestra el país de sus espectadores.

La aceptación de una demo parcial no equivale al cumplimiento de la comparación completa de once canales. El recorrido puede mostrar datos auténticos recuperados, grupos confirmados, conteos parciales, una pieza elegida y su revisión, con faltantes explícitos. La comparación completa sigue pendiente; no mostrar porcentajes de crecimiento completo ni «nuevo en el corpus» a partir de una base desconocida. No se inventa un mínimo de publicaciones ni se presenta una simulación como resultado real.

## Notion como última prioridad

El integrante 4 coordina esta extensión después de validar el recorrido esencial y cubrir evaluación, documentación y ensayo. Se limita a la acción manual «Guardar oportunidad en Notion», en una única base del equipo con acceso por verificar. El registro conserva fuente, métricas disponibles y captura, agrupación y conteos de ambos periodos, cobertura, evidencia temporal, valor y afinidad, hipótesis, adaptación y estado inicial pendiente de revisión editorial.

Si se implementa, debe confirmar el guardado con enlace, controlar duplicados por ID de video y conservar el resultado local ante errores. No incluye sincronización bidireccional, comentarios, aprobaciones, cuentas de terceros ni envío a Gmail, Slack u otros canales.

Si compromete el núcleo o la preparación de entrega, se registra como pendiente y se retira de la demo. No simular un guardado ni iniciarla después del cierre de funciones. Su ausencia no altera los criterios del MVP esencial.

## Hitos propuestos por dependencias

La disponibilidad del equipo todavía no está confirmada. Los hitos siguientes expresan orden de trabajo y evidencia de salida; no asignan horas ni duraciones nuevas a las tareas. Antes de construir, distribuir responsables y acordar el cierre de funciones conservando evaluación, ensayo y margen de envío.

| Hito y dependencia | Evidencia para avanzar |
| --- | --- |
| 1. Cerrar especificaciones y preparar el primer bloque | Alcance y contrato revisados; corte Bogotá, tema principal único, confirmación de grupos, estados de valor y pilares registrados; responsables por asignar y accesos declarados diferenciados de los probados. |
| 2. Habilitar y probar dependencias reales antes de ampliar funciones | YouTube Data API y JEV configurados y probados; Gemini comprobado; acceso a Vercel Services beta, primer despliegue de Next.js/FastAPI con binding protegido y almacenamiento duradero probados, o bloqueo concreto documentado. Medir consumos disponibles dentro del máximo de USD 20 en nuevos cargos. |
| 3. Integrar el primer recorrido real | Adquisición → pertinencia IA con JEV → grupos automáticos de ambas ventanas y confirmación → conteos por tema principal con cobertura → selección de una pieza → evidencia, valor y afinidad con JEV → revisión duradera. No forzar crecimiento. |
| 4. Revisar el núcleo y distinguir alcance de demo | Once fuentes previstas con cobertura real declarada; base cero y desconocidos, agrupación consistente y separación de afinidad verificadas. Una demo parcial conserva la comparación completa pendiente y declara sus límites. |
| 5. Cerrar funciones y preparar la versión candidata | Núcleo evaluado; decidir si Notion ya está comprobado o queda pendiente. Después, solo correcciones necesarias, documentación y entrega. |
| 6. Ensayar y comprobar el paquete | Otra persona abre la URL de Vercel y accede mediante la credencial compartida; persistencia tras cierre/reinicio comprobada, README y playbook revisados, límites y respaldo real identificados. |
| 7. Enviar y verificar recepción | Objetivo interno propuesto: 18 de octubre a las 11:00, hora de Colombia. Límite oficial: antes de las 12:00 del mismo día. |

## Coordinación y bloqueos

1. Usar un tablero con pendiente, en curso, bloqueado, revisión y terminado; cada tarea tiene responsable, dependencia y evidencia de aceptación. Revisar coordinación según la disponibilidad confirmada y avisar de inmediato los bloqueos.
2. Compartir cambios pequeños y una versión integrada desde el primer recorrido. Una tarea termina cuando otra persona puede verificarla; el integrante 4 coordina cambios al contrato compartido.
3. Si no existe el primer recorrido real, detener ampliaciones y resolver su dependencia bloqueante. Reducir acabado y automatización secundaria de redacción antes de afectar adquisición automática, confirmación de grupos, conteos por tema principal, JEV, valor, evidencia, acceso protegido y revisión duradera.
4. Si falla una ruta de acceso, evaluar otra permitida para la misma función sin suponer credenciales. Cargar referencias manualmente o ejecutar el archivo de referencia no demuestra la adquisición automática del producto.
5. Datos incompletos se presentan como cobertura parcial aceptable para la demo con límites explícitos, manteniendo pendiente la comparación completa de once canales. No transformar un fallo o clasificación pendiente en cero ni declarar «nuevo en el corpus» con base desconocida.
6. Sin evidencia audiovisual, limitar observaciones al material efectivamente analizado y registrar lo pendiente; título y descripción no acreditan montaje, gancho hablado ni audio.
7. Ante una caída en la demo, mostrar una ejecución real guardada con fecha, versión y alcance, identificada como anterior. El material de evaluación no sustituye una adquisición automática demostrada.
8. Las funciones nuevas deben respetar el alcance y el orden de dependencias. Después del cierre de funciones no se inicia Notion ni otra extensión.
9. Si no hay crecimiento observado, mostrar los conteos reales y sus límites. Mantener las oportunidades de valor duradero sin inventar temas, porcentajes, urgencias ni etiquetas de tendencia emergente.
10. El operador elige cualquier pieza elegible para análisis profundo; no restringir la selección a temas crecientes ni usar la revisión como edición manual de clasificaciones. Los formatos y secundarios no entran en las señales temporales.
11. Controlar nuevos consumos de APIs y extras frente al máximo de USD 20; detener ampliaciones que no quepan en el presupuesto. El pago existente de Vercel queda separado y ninguna configuración declarada acredita pruebas superadas.

## Criterios de cierre y paquete

- [ ] Las especificaciones están disponibles antes de implementar; las propuestas y decisiones pendientes se distinguen de funciones realizadas.
- [ ] Una adquisición nueva y automática de YouTube alimenta el recorrido con datos auténticos; los once canales tienen un estado de cobertura explícito.
- [ ] Se ven los intervalos de siete días completos y sus siete anteriores, America/Bogota UTC−5 y la exclusión del día en curso.
- [ ] Solo entran publicaciones públicas de hasta tres minutos con IA central o aplicación concreta; menciones incidentales e información insuficiente se identifican.
- [ ] Se distinguen candidatos cortos y Shorts confirmados sin equiparar duración con confirmación.
- [ ] Los grupos se proponen automáticamente usando ambas ventanas y el operador los confirma antes de calcular señales; la confirmación y la versión quedan registradas.
- [ ] Cada video contado tiene un solo tema principal con evidencia; los secundarios son visibles sin contar y los formatos se limitan al análisis profundo. No hay edición manual de clasificaciones en la demo.
- [ ] Ambas ventanas usan la misma versión de clasificación y los duplicados no inflan conteos.
- [ ] Las señales muestran conteos previos y actuales y variación válida; cero previo conocido y positivo actual muestra «nuevo en el corpus» sin porcentaje. Ambos ceros no generan novedad y una base incompleta no se declara cero.
- [ ] La demo parcial declara cobertura, errores y faltantes y mantiene pendiente la comparación completa de once canales. Su aceptación no se presenta como comparación completa ni transforma desconocidos en cero.
- [ ] No se afirma crecimiento de audiencia, tendencia global, saturación ni causalidad a partir de los conteos.
- [ ] El operador puede elegir cualquier pieza elegible, con o sin crecimiento. Su ficha contiene observaciones audiovisuales reales y marcas contrastadas, dimensiones no observadas y revisión pendiente.
- [ ] JEV ejecuta obligatoriamente decisiones auténticas de pertinencia IA, valor y afinidad de persona/contexto/pilar; conserva criterios y versiones, diferenciando clasificaciones, cálculos, hechos e hipótesis.
- [ ] El valor distingue aporte respaldado, utilidad no sustentada e información insuficiente; la afinidad usa los cuatro pilares aprobados, «otro pertinente» e «información insuficiente» sin rechazos sociales automáticos.
- [ ] Señal, métricas originales, valor y afinidad se presentan por separado. La baja afinidad no altera el conteo, la popularidad no acredita utilidad y el valor sin aumento permite una oportunidad duradera.
- [ ] La adaptación es revisable, está sustentada y no introduce cifras, casos o urgencias sin fuente; resultado y decisión se recuperan tras cerrar navegador y reiniciar la aplicación.
- [ ] La evaluación humana registra acuerdos, errores y límites. Tiempo y costo, cuando se reporten, proceden de mediciones reales con su alcance.
- [ ] La web está desplegada en Vercel con una URL accesible para otras personas; toda la aplicación requiere la credencial compartida de demo, incluidos accesos directos a resultados y operaciones.
- [ ] Otra persona puede arrancar siguiendo el README y configurando sus accesos; el repositorio público no contiene credenciales ni material no permitido.
- [ ] Los nuevos consumos de APIs y extras se registran frente al tope de USD 20, separando el pago existente de Vercel. No se atribuyen costos o pruebas a servicios solo declarados configurados.
- [ ] El playbook, de máximo cinco páginas u ocho diapositivas, explica decisiones, preguntas, reglas, revisión, operación y medición.
- [ ] Requisitos oficiales de envío verificados, demo ensayada, respaldo real identificado y recepción comprobada antes del límite oficial.

La demo parte de la URL desplegada y la credencial compartida. Recorre adquisición y cobertura → elegibilidad de IA y propuesta de grupos con ambas ventanas → confirmación del operador → conteos semanales por tema principal → selección libre de una pieza elegible → evidencia audiovisual, formato, valor y afinidad → adaptación y revisión humana duradera. Explica qué datos respaldan cada resultado y qué permanece desconocido. Puede mostrar cobertura parcial explícita y comparación completa pendiente; no presenta ese estado como un análisis completo de los once canales. Si los datos reales permiten contrastar una señal de aumento con una oportunidad útil sin crecimiento, mostrar ambas sin fabricar ejemplos.

El paquete incluye URL desplegada en Vercel con acceso protegido, repositorio, README, playbook y evaluación. Entregar la credencial de demo por el canal de entrega correspondiente, sin publicarla en el repositorio. Añadir video según requisitos verificados y recursos disponibles; no asumir formato o duración de presentación. Solo si quedó comprobado antes del cierre de funciones, la demo puede terminar con un guardado real en Notion y su enlace. La evolución predictiva del prototipo queda fuera.
