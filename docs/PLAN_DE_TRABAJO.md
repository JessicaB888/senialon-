# Plan de trabajo del MVP SENIALON

El equipo de **tres personas** queda organizado en **tres áreas, con un responsable único por área: Frontend; Algoritmia/JEV para análisis de tendencias; Backend e infraestructura**. El usuario solicitante confirmó que asume Frontend; las identidades nominales de los otros integrantes, la experiencia individual y las horas disponibles siguen sin confirmar. Su orden de trabajo y dependencias están en [PLAN_FRONTEND.md](PLAN_FRONTEND.md).

La entrega oficial es el **18 de octubre de 2026 antes de las 12:00 del mediodía, America/Bogota**. Se conserva como objetivo interno propuesto el envío a las **11:00**, para dejar margen; no representa una disponibilidad confirmada.

El usuario autorizó continuar ALG 2.1 y cerrar el acuerdo definitivo: [contrato `1.0.0`](contracts/README.md), [revisión semántica](REVISION_SEMANTICA_ALG.md), [interfaces internas](INTERFACES_ANALISIS.md) y [conformidad documental FE](REVISION_CONTRATO_FRONTEND.md) registrados sobre la misma versión. ALG 2.1 y BE 3.1 se cierran documentalmente; G0 contractual queda cerrado por revisión asistida a solicitud del usuario, sin atribuir firmas a los otros integrantes ni integraciones probadas. FE 1.1 conserva pendiente el segundo hito técnico después de 1.2; BE 3.2 sigue pendiente antes de cualquier prueba pagada. La siguiente construcción es FE 1.2, que no se inicia en este acuerdo. La [definición del MVP](DEFINICION_MVP.md) fija el alcance; la [propuesta](../openspec/changes/definir-mvp-senialon/proposal.md), seis specs, [diseño técnico](../openspec/changes/definir-mvp-senialon/design.md) y [tareas OpenSpec](../openspec/changes/definir-mvp-senialon/tasks.md) formalizan su construcción. Las casillas se mantienen en ese último archivo; este plan define responsables, fronteras, entregables y orden sin duplicarlas.

## Alcance que las tres áreas deben conservar

- Web para un operador, desplegada en Vercel. Toda la aplicación, sus resultados y operaciones requieren una credencial compartida de demo; no hay cuentas individuales ni modo público de lectura. HTTP Basic sobre HTTPS es el mecanismo técnico propuesto.
- Persistencia duradera de ejecuciones, evidencias, grupos confirmados y decisiones después de cerrar el navegador o reiniciar la aplicación. Al volver se recupera el último paso confirmado; no se promete trabajo activo mientras el navegador está cerrado.
- Adquisición automática del corpus fijo de **once canales** con las URLs exactas de la [definición del MVP](DEFINICION_MVP.md). No sustituir fuentes fallidas ni ampliar a búsqueda global.
- Videos públicos de hasta **180 segundos inclusive**. Duración elegible no equivale a Short confirmado: usar «candidato corto» sin evidencia verificable. Incluir IA como tema central o aplicación concreta; una mención incidental no basta.
- Dos ventanas consecutivas: últimos siete días completos frente a los siete anteriores, excluyendo el día en curso, en **America/Bogota, UTC−5**. Mostrar límites de inicio inclusivo y fin exclusivo.
- Grupos propuestos automáticamente usando ambas ventanas y confirmados por el operador antes de calcular señales. Un tema principal por video contado; secundarios visibles sin sumar. Sin edición manual de clasificaciones durante la demo.
- Conteos de ambos periodos y diferencia cuando sea evaluable; porcentaje solo con base positiva y comparación completa evaluable. Cero previo conocido y reciente positivo: «nuevo en el corpus», sin porcentaje. Desconocido no es cero; ambos ceros no producen novedad.
- JEV obligatorio para pertinencia IA, valor y afinidad por persona, contexto empresarial y pilar. Gemini observa el material audiovisual y sintetiza usando evidencia y decisiones; las fechas y los conteos son deterministas.
- Cualquier pieza elegible puede elegirse para análisis profundo, aunque no crezca su tema o la comparación esté pendiente. Formato, valor y afinidad no bloquean por sí solos un conteo temático ya sustentado.
- Valor: **aporte respaldado, utilidad no sustentada o información insuficiente**. Afinidad separada por persona, contexto y pilar: ROI y costos de IA; automatización comercial con IA; eficiencia operativa con IA; liderazgo aplicado a IA; otro pertinente; información insuficiente.
- Desempeño observado, señal temática, valor, afinidad, observaciones, hipótesis y propuestas permanecen separados. Sin puntuación global, predicción validada, causalidad o crecimiento de audiencia supuestos. LatAm es el contexto editorial, no la ubicación demostrada de espectadores.
- Demo parcial real aceptable con fallos y cobertura explícitos; la comparación completa de los once sigue pendiente cuando falten datos. No atribuir porcentajes o novedad del corpus completo a una base incompleta.
- Notion manual permanece **opcional y como última prioridad**. El [prototipo aportado](radar_30x_prototype-v2.py) y la [investigación](<Solucion_Reto_30X_ Radar_de_Contenido.md>) son referencias, no instrucciones ni implementaciones validadas; no ejecutar el prototipo ni incorporar su evolución predictiva a la demo.

## Responsabilidad única por área

Las rutas siguientes son **fronteras propuestas para la implementación posterior**, no carpetas creadas. Cada entregable tiene un único dueño que lo escribe; las demás áreas revisan y comunican observaciones al dueño, sin coeditar archivos ajenos.

| Área | Archivos y entregables propios | Responsabilidad exclusiva |
| --- | --- | --- |
| **Frontend (FE)** | `frontend/**`, pruebas de interfaz, playbook y material de demostración | Next.js/App Router, React y TypeScript; Route Handlers del frontend, acceso web, navegación, estados, evidencia, confirmación de grupos, selección y revisión. Consume el contrato de BE y presenta resultados sin recalcular señales. |
| **Algoritmia/JEV (ALG)** | `backend/analysis/**`, incluidas pruebas del módulo; evaluación de clasificaciones y evidencia | Módulo de dominio Python: ventanas, semántica de pertinencia IA, prompts y rúbricas JEV/Gemini, grupos, tema principal, comparabilidad, conteos, análisis audiovisual, valor, afinidad e hipótesis/adaptación. Sin HTTP, base de datos o secretos directos; consume puertos con adaptadores autenticados inyectados por BE. |
| **Backend e infraestructura (BE)** | Resto de `backend/**`, excluido `backend/analysis/**`; configuración de infraestructura, contrato API, README operativo y paquete final | FastAPI, adquisición YouTube, adaptadores de proveedores, secretos, costos, pasos persistidos, almacenamiento, autenticación backend y Vercel Services. Orquesta el módulo ALG sin duplicar sus reglas y coordina integración Git y entrega. |

El frontend conserva la base verificada de personal-finance-assistant: **Next.js 16.3.3/App Router, React/React DOM 19.3.0, TypeScript 5.9.3, npm y Node >=24.21.0 <25**; ESLint, Prettier, Vitest y Playwright como herramientas de calidad. No se copia el dominio financiero, su autenticación o su branding, ni se presuponen Tailwind o shadcn/ui.

Python para análisis y Vercel para despliegue están confirmados. La arquitectura propuesta usa **Python 3.12/FastAPI, PostgreSQL en Supabase Free y Vercel Services beta**, con Next.js público y Python interno mediante binding. BE verifica esa ruta antes de ampliar desarrollo. FE sigue [DESIGN.md](../DESIGN.md), conservando los logos Fluido y el naranja de SENIALON.

### Frontend: recorrido verificable y presentación

FE implementa y prueba el acceso de todas sus páginas, Route Handlers y mutaciones con la credencial compartida; no incorpora un formulario propio de login, usuarios o recuperación de contraseña. Valida las respuestas del contrato de BE en el límite del frontend y transmite la autorización al backend mediante la conexión interna acordada.

Su entrega recorre **ejecución y cobertura → inspección y confirmación de grupos → comparación temática → catálogo de publicaciones elegibles → ficha de evidencia, valor y afinidad → adaptación → decisión guardada**. El catálogo permanece accesible sin crecimiento y con comparación pendiente. La confirmación y la revisión editorial son operaciones diferentes; ninguna modifica manualmente pertinencia o tema principal.

FE presenta fuentes, ventanas, zona, fecha de captura, conteos, cobertura y pendientes con las etiquetas del contrato. Conserva el texto de revisión si falla el guardado y anuncia éxito solo tras confirmación real. No llama directamente a YouTube, JEV, Gemini o almacenamiento privilegiado; tampoco mantiene el único ejemplar de un resultado en memoria del navegador.

FE es dueño de TypeScript, lint/formato, pruebas de interfaz relevantes y Playwright del recorrido protegido e integrado. Escribe el **playbook de máximo cinco páginas u ocho diapositivas**, el guion/material de demo y la presentación; usa los resultados reales de ALG y la operación verificada por BE. Las otras áreas revisan esos documentos sin asumir su edición.

### Algoritmia/JEV: módulo de dominio y evaluación

ALG define las entradas y salidas semánticas del análisis, sus estados y criterios versionados. Recibe metadatos, cobertura y respuestas estructuradas de proveedores mediante BE; puede solicitar inferencias por puertos acordados, sin ejecutar HTTP, cargar secretos, persistir resultados o administrar reintentos directamente. BE inyecta los adaptadores autenticados y controla cada llamada, incluida su reserva de costo.

El módulo calcula **una sola vez** las ventanas a partir del instante de referencia acordado. BE reutiliza exactamente esas fronteras para adquirir publicaciones y FE las muestra sin recalcularlas. ALG decide pertinencia IA con JEV, propone grupos usando ambas ventanas, asigna un tema principal con evidencia y conserva secundarios sin conteo. Tras la confirmación de esa versión por el operador, produce conteos y variaciones permitidas según cobertura, manteniendo desconocidos e insuficiencia.

Para las piezas que elija el operador, ALG define las solicitudes y rúbricas audiovisuales, interpreta material realmente observado y genera observaciones con marcas temporales, formato, decisiones JEV de valor/afinidad e hipótesis/adaptación. BE ejecuta las solicitudes a los proveedores mediante sus adaptadores. La falta de audio, imagen o respuesta válida no se rellena desde el título ni se transforma en una decisión negativa.

ALG es dueño de pruebas deterministas de ventanas, agrupación, conteos y base cero, además de la evaluación humana de pertinencia, equivalencias, fidelidad audiovisual, valor y afinidad. Mantiene criterios, resultados, desacuerdos y límites; separa material usado para ajustar rúbricas del usado para evaluar. No inventa metas de precisión, latencia o volumen. Entrega la evaluación a FE para el playbook y a BE para el paquete final.

### Backend e infraestructura: integración, operación y entrega

BE habilita y prueba los accesos; implementa la adquisición automática con YouTube Data API usando las fronteras temporales de ALG. Comprueba condición pública, fecha y duración, aplica el límite de 180 segundos, deduplica por ID y conserva procedencia y cobertura de adquisición por canal/ventana. La pertinencia IA y el tema principal pertenecen a ALG.

BE es dueño único del contrato HTTP/JSON y su serialización, de la persistencia y del estado de ejecución. Integra las salidas semánticas de ALG sin reimplementar fechas, reglas de clasificación, conteos o evaluación editorial. Conserva y transmite cobertura de adquisición y los límites temáticos devueltos por ALG, sin convertirlos en cobertura completa.

Los adaptadores HTTP de **YouTube, JEV y Gemini** pertenecen a BE, incluidos acceso, modelos configurados, transporte, errores y uso informado. ALG determina qué se pregunta y cómo se interpreta; BE ejecuta las solicitudes. Las reservas de costo y la reclamación atómica de pasos ocurren antes de cada llamada. Un reintento no duplica publicaciones, consumos o resultados; una respuesta incierta conserva su estado y reserva hasta reconciliación.

BE protege FastAPI incluso mediante el binding interno, gestiona secretos y persistencia, registra confirmaciones y decisiones, configura Vercel Services y verifica la recuperación tras reinicio. No expone secretos en el repositorio público, el bundle del navegador o los registros.

BE es dueño de pruebas de API, adquisición, deduplicación, persistencia, idempotencia, autorización backend y control de costos; FE verifica la protección web y el recorrido extremo a extremo. BE mantiene el **README de arranque/operación**, evidencias de acceso, costos y despliegue, coordina la integración Git y consolida el paquete de entrega. Cada área corrige los fallos en sus propios archivos.

## Contrato y transferencia entre áreas

La puerta G0 del contrato siguió esta secuencia: **BE publica borrador 3.1 → ALG revisa semántica/interfaces 2.1 → FE revisa documentalmente su consumo en el primer hito 1.1 → BE incorpora observaciones y registra `1.0.0`**. El cierre asistido solicitado por el usuario y su alcance están en el registro del contrato; no presupone firmas individuales. G0 no espera la casilla 1.1 completa: el segundo hito de tipos/validación se programa después de 1.2. BE mantiene el contrato API y ALG las interfaces del módulo. El control de gasto BE 3.2 permanece independiente y obligatorio antes de consumir; no se convierte en realizado al cerrar el contrato.

Las tareas formales se agrupan por dueño: **1.1–1.12 FE, 2.1–2.12 ALG y 3.1–3.18 BE**. Esta referencia permite localizar el trabajo sin duplicar sus casillas o estados en el plan.

| Transferencia | Contenido mínimo | Dueño que produce |
| --- | --- | --- |
| Referencia temporal → adquisición | Instante de referencia, dos ventanas exactas y America/Bogota | ALG; BE consume fronteras sin recalcular. |
| Adquisición → análisis | IDs y URLs, canal, publicación, captura, duración, estadísticas disponibles, condición Short/candidato y cobertura con errores | BE; ALG recibe campos ausentes diferenciados de cero. |
| Análisis → operación persistida | Propuestas/solicitudes, decisiones tipadas, evidencia, versiones, grupos y límites de comparabilidad | ALG; BE llama proveedores, valida/serializa y guarda. |
| Confirmación → comparación | ID de ejecución, versión de grupos y confirmación registrada | BE registra la acción recibida desde FE y autoriza la etapa; ALG calcula sobre esa versión. |
| API → interfaz | Estados, fuentes, conteos, cálculos permitidos, valor, afinidad, revisión y errores | BE publica el contrato único; FE valida y presenta, sin duplicar el cálculo. |
| Revisión → persistencia | Análisis exacto, decisión, motivo y estado de revisión de evidencia | FE captura la acción; BE confirma el guardado duradero y devuelve el resultado. |

Cada etapa distingue **pendiente, en proceso, disponible, información insuficiente y error**. Un fallo técnico no es un descarte editorial. Los ejemplos de contrato se rotulan como ejemplos y no se presentan como datos recolectados. Los cambios semánticos los prepara ALG; BE actualiza la versión del contrato y su persistencia; FE adapta el consumidor. Si cambia una clasificación, se tratan ambas ventanas de forma consistente y se obtiene la confirmación requerida.

Ante discrepancias, se abre un cambio concreto al dueño del entregable. No mantener esquemas paralelos, cálculos alternativos ni adaptadores de proveedor dentro de `backend/analysis/**` o `frontend/**`.

## Seis capas y resultado de cada una

| Capa | Resultado verificable | Dueño del resultado |
| --- | --- | --- |
| 1. Recolección, elegibilidad básica y cobertura | Publicaciones públicas de duración elegible, procedencia, IDs únicos y estado de adquisición de los once canales en ambas ventanas | BE |
| 2. Pertinencia IA y grupos | Decisión JEV real, grupos conjuntos, tema principal único, secundarios sin conteo y evidencia/versiones | ALG |
| 3. Comparación temporal | Conteos por tema principal, diferencia y porcentaje permitido o motivo de no evaluación | ALG |
| 4. Contenido audiovisual | Observaciones y formato realmente sustentados, con marcas temporales y dimensiones no observadas | ALG |
| 5. Valor y afinidad | Tres estados de valor y evaluación separada de persona, contexto y pilar, mediante JEV | ALG |
| 6. Adaptación y revisión | Propuesta de adaptación con límites; decisión editorial recuperable | ALG produce la propuesta; FE es dueño de su revisión en interfaz y BE del registro duradero. Son entregables separados. |

BE orquesta y persiste las salidas; FE las presenta y permite las acciones del operador. Esa integración no transfiere la autoría del módulo analítico a BE ni asigna lógica de negocio al frontend. La falta de análisis profundo o la baja afinidad de una pieza no alteran su conteo temático conocido.

## Accesos, presupuesto y puerta inicial

Gemini y Vercel están **declarados configurados, sin prueba del recorrido real de SENIALON**. YouTube Data API y JEV no están configurados; Supabase debe prepararse. BE verifica credenciales, cuotas, modelos, facturación, permisos y campos reales. ALG revisa que las respuestas de JEV/Gemini sirvan para las rúbricas; FE verifica acceso y resultados desde la URL. Cada uno registra su verificación en su entregable, sin declarar superada una dependencia por una configuración informada.

El plan de pago de Vercel está abonado aparte. El máximo es **USD 20 para nuevos consumos de APIs y extras de la demo**; no se descuenta de él la suscripción existente. BE registra cargos confirmados, reservas y estimaciones con su fuente antes de ampliar lotes; las pruebas y los reintentos también cuentan. No se promete un número de videos, costo por ejecución o latencia sin medición.

El primer bloque posterior al cierre de especificaciones comprueba **YouTube real → decisión JEV auténtica → observación audiovisual Gemini**, además del despliegue protegido Next.js/FastAPI mediante binding y escritura/recuperación duraderas. BE verifica acceso a Vercel Services beta y límites efectivos; tener plan de pago no lo demuestra. Si una dependencia obligatoria falla o su costo no cabe, se registra y resuelve el bloqueo antes de ampliar funciones; no se sustituye con simulación o importación manual.

## Hitos y puertas para avanzar

No asignar horas sin conocer disponibilidad. Los hitos fijan dependencias y evidencia de salida; los estados y tareas específicas están en [tasks.md](../openspec/changes/definir-mvp-senialon/tasks.md).

| Puerta | Evidencia necesaria | Responsable del cierre |
| --- | --- | --- |
| **1. Especificaciones y contrato (G0)** | Tres dueños identificados por área; alcance y fronteras revisados; borrador 3.1 revisado semánticamente por ALG 2.1 y documentalmente por FE en el primer hito 1.1, y v1 cerrada por BE 3.1. No requiere tipos programados ni la casilla 1.1 completa. No iniciar código durante esta fase. | BE consolida; ALG y FE revisan el borrador sin esperar el cierre de 3.1. |
| **2. Dependencias reales** | YouTube, JEV y Gemini probados; primer despliegue protegido de ambos servicios, binding y persistencia verificados, o bloqueo concreto registrado. Uso medido frente a USD 20. | BE; ALG valida salidas y FE acceso web. |
| **3. Primer recorrido integrado** | Adquisición → pertinencia JEV → grupos automáticos → confirmación → conteos con cobertura → selección libre de pieza → evidencia, valor/afinidad JEV → decisión duradera. | BE integra; FE entrega recorrido y ALG resultados analíticos. |
| **4. Evaluación del núcleo** | Ventanas, deduplicación, base cero/desconocidos y cobertura comprobadas; fidelidad audiovisual, clasificación y utilidad evaluadas sin forzar crecimiento. Persistencia y acceso directo protegidos. | ALG 2.10–2.12 cierra evaluación semántica; FE 1.10 verifica E2E; BE consolida evidencia técnica de los tres dueños. |
| **5. Cierre de funciones** | Núcleo, evaluación y preparación de entrega cubiertos; decisión sobre Notion 3.15: comprobado mediante 3.16/1.12 o declarado pendiente. Después solo correcciones necesarias. | BE 3.17 registra versión candidata y respaldo con revisión de FE/ALG. |
| **6. Ensayo y paquete** | Otra persona abre la URL con la credencial; ejecución previa real identificada como respaldo; README, playbook y evaluación revisados; recuperación tras cierre/reinicio comprobada. | FE 1.11 dirige ensayo/playbook; BE 3.18 consolida paquete. |
| **7. Envío y recepción** | URL, repositorio, README, playbook y evaluación entregados; credencial por canal de entrega sin publicarla en el repositorio; recepción comprobada antes del límite. | BE 3.18 coordina la entrega del equipo. |

La entrega conserva el objetivo interno propuesto del **18 de octubre a las 11:00**, con límite oficial **antes de las 12:00**, hora de Colombia. BE verifica los requisitos oficiales de envío y el equipo realiza el envío humano por el canal correspondiente; este plan no acredita envío realizado. Añadir video únicamente según requisitos verificados y recursos disponibles, sin inventar formato o duración.

## Notion: última prioridad y reparto acotado

Solo después de validar el núcleo y cubrir evaluación y preparación de entrega, y **antes del cierre de funciones**:

- **BE** es dueño del adaptador/API de Notion, configuración de una única base del equipo, duplicados por ID de video, respuesta de éxito real con enlace y preservación de contexto.
- **FE** es dueño del botón manual «Guardar oportunidad en Notion», sus estados y enlace. Solo lo presenta como operativo cuando el contrato y el guardado real estén comprobados.
- **ALG** no incorpora lógica específica de Notion al módulo; BE exporta sus salidas ya persistidas sin reinterpretarlas.

Guardar conserva fuentes, métricas y captura, señal temática, ventanas y cobertura, grupos confirmados, evidencia y revisión, decisiones JEV, valor, afinidad, hipótesis y adaptación. El registro externo comienza pendiente de revisión editorial; guardarlo no equivale a aprobar. Si ya existe el video, mostrar el registro existente sin duplicarlo ni sobrescribirlo silenciosamente. Un fallo no borra la ficha ni su decisión local.

Si compromete el núcleo, la evaluación o el ensayo, BE registra Notion como pendiente y FE evita simular exportaciones. No iniciarlo después del cierre de funciones. Su ausencia no invalida la demo esencial; no incluir Slack, Gmail, sincronización bidireccional o cuentas de terceros.

## Coordinación, bloqueos y aceptación

Usar un tablero con pendiente, en curso, bloqueado, revisión y terminado, enlazado a las tareas formales. Cada tarjeta tiene un único dueño, dependencia y evidencia para verificar. Otra área revisa el resultado sin coeditar: **FE revisa legibilidad y consumo de contrato; ALG fidelidad semántica; BE integración, persistencia y operación**. BE integra cambios pequeños desde el primer recorrido; cada dueño resuelve los fallos en sus archivos.

Si falta el primer recorrido real, detener ampliaciones y resolver su dependencia. Priorizar adquisición automática, JEV, grupos confirmados, conteos por tema principal, evidencia, valor, acceso y revisión duradera. Reducir acabado secundario antes de afectar esas capacidades. No añadir funciones para compensar una dependencia bloqueada.

La demo parte de la URL desplegada y usa datos auténticos. Si hay cobertura parcial, conserva los once canales previstos, identifica qué falta y mantiene la comparación completa pendiente. Si una consulta nueva falla, puede usarse una ejecución real anterior con fecha, alcance y versión visibles; no presentarla como nueva. Sin aumento, mostrar el resultado real y permitir una oportunidad útil sin señal creciente.

El cierre exige el recorrido protegido verificable, persistencia tras reinicio, evidencia audiovisual y decisiones reales de JEV, evaluación documentada, README reproducible, playbook y nuevos consumos dentro del límite. Separar lo entregado, lo pendiente y lo no evaluable. Notion y la evolución predictiva no condicionan el núcleo. La conformidad se comprueba contra las seis specs y las tareas OpenSpec, no por completar una segunda lista en este documento.
