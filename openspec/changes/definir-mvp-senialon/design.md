# Design

## Context

Ver [proposal.md](proposal.md) para el problema y alcance. El usuario confirmó el mismo stack frontend de personal-finance-assistant, Python para análisis, Vercel para despliegue, acceso completo con una credencial de demo compartida y recuperación duradera. Las demás decisiones técnicas son recomendaciones. El plan de pago de Vercel ya está activo y abonado aparte; 20 USD es el máximo para nuevos consumos de APIs y extras de esta demo.

Gemini y Vercel están declarados configurados por el equipo; no se probaron desde SENIALON. YouTube Data API y JEV no están configurados. PostgreSQL externo aún debe prepararse. El repositorio contiene documentación, branding y un prototipo de referencia sin ejecutar; no existe implementación del producto.

Este diseño aplica: hay varios proveedores, un modelo de datos nuevo, autenticación, persistencia y límites de ejecución que deben resolverse antes de programar. Es la arquitectura recomendada para revisión; no presume experiencia del equipo ni servicios ya validados.

## Goals / Non-Goals

**Goals:**

- Un proyecto Vercel con frontend Next.js/React/TypeScript y backend Python, fuentes y resultados trazables y contratos explícitos entre ambos runtimes.
- Pasos acotados y recuperables entre solicitudes, con persistencia externa y contratos estables entre las tres áreas confirmadas: Frontend, Algoritmia/JEV y Backend/infraestructura.
- Acceso compartido a toda la aplicación y gasto incremental controlado dentro del límite autorizado.
- Pruebas de acceso y de una ruta real antes de ampliar procesamiento o trabajar en Notion.

**Non-Goals:**

- Introducir colas o workers externos sin necesidad demostrada, cuentas individuales o publicación automática.
- Copiar código, branding, autenticación o funciones financieras del proyecto de referencia; reutilizar su stack no amplía el alcance funcional.
- Usar el filesystem local de Vercel como base de datos, almacenar archivos de video o ejecutar el prototipo como detector validado.
- Prometer tiempo, precisión o costo real a partir de cifras comerciales de los proveedores.

## Decisions

### 1. Frontend de referencia y backend Python en Vercel

La decisión del usuario sustituye la propuesta anterior de interfaz Jinja2/HTMX. La inspección de package.json, package-lock.json, tsconfig.json y el plan de personal-finance-assistant confirma esta base:

| Componente | Referencia verificada para el frontend |
| --- | --- |
| Framework y rutas | Next.js 16.3.3, App Router. |
| Interfaz | React y React DOM 19.3.0 resueltos en el lockfile; los manifiestos declaran ^19.2.0. |
| Lenguaje | TypeScript 5.9.3 resuelto, modo estricto y alias @/* a src/*. |
| Entorno y dependencias | Node.js >=24.21.0 y <25, npm y package-lock.json v3. |
| Calidad | ESLint 9.39.5 con eslint-config-next 16.3.3 y Prettier 3.9.9. |
| Pruebas | Vitest 5.0.1 y Playwright 1.63.0. |

Estas son versiones observadas, no una afirmación de que sean las más recientes ni de compatibilidad ya probada en SENIALON. Al implementar, fijar dependencias compatibles y verificar el build. La referencia no tiene Tailwind ni shadcn/ui declarados; no introducirlos como si formaran parte del stack existente. Mantener estilos y assets propios de SENIALON. No se requiere una biblioteca de gráficos para resolver los conteos del MVP.

El backend recomendado continúa en **Python 3.12 + FastAPI**, con HTTPX para proveedores, Pydantic para contratos y pruebas deterministas con pytest. Las versiones de paquetes Python se fijarán al preparar el entorno. Proponer frontend/ y backend/ como directorios de implementación futura en este repositorio, sin crearlos en la fase de especificación.

Desplegar ambos mediante **Vercel Services** en un mismo proyecto: Next.js como servicio público en la raíz y Python como servicio interno sin rewrite público, accesible desde funciones de Next mediante un binding. Services está en beta; verificar disponibilidad efectiva, arranque local y primer despliegue en la cuenta del equipo antes de ampliar desarrollo. Los bindings están disponibles en funciones durante la ejecución, no en builds ni middleware; conservar las llamadas en Route Handlers o funciones de servidor. [Services](https://vercel.com/docs/services), [bindings](https://vercel.com/docs/services/bindings), [FastAPI en Vercel](https://vercel.com/docs/frameworks/backend/fastapi), [runtime Python](https://vercel.com/docs/functions/runtimes/python).

El navegador consume páginas y rutas de Next.js del mismo origen. Next valida el acceso y transmite solicitudes JSON al servicio Python; Python es dueño de reglas, llamadas a proveedores y persistencia. Los contratos cubren IDs, estados, cobertura, errores, evidencia y versiones; fechas y conteos no se recalculan en React. No conectar el cliente o Next directamente a la base de datos para duplicar la lógica. Las claves de proveedores y la conexión PostgreSQL permanecen en el backend.

Usar componentes de servidor para las lecturas y componentes cliente solo donde se necesite interacción, confirmación, selección o consulta periódica del estado. Las consultas no deben avanzar pasos ni disparar consumos; esas operaciones requieren mutaciones explícitas e idempotentes. El estado recuperable pertenece a PostgreSQL, no a memoria de React o del runtime Node.

Alternativas: la aplicación Python con plantillas deja de ser la ruta elegida por la nueva decisión de frontend; dos proyectos Vercel separados conservan el stack, pero agregan configuración de despliegue y acceso. Si Services bloquea el primer despliegue, registrar el impedimento y resolver esa conexión antes de ampliar el trabajo; no cambiar silenciosamente el frontend confirmado.

Las pantallas previstas son acceso protegido, ejecuciones y cobertura, propuesta de grupos, comparación temática, publicaciones elegibles y ficha de oportunidad/revisión. Usar los PNG Fluido actuales de branding en sus variantes clara, oscura e ícono; no restaurar el logo inicial.

### 2. Persistencia PostgreSQL fuera de la función

Recomendar **Supabase Free con PostgreSQL**, SQLAlchemy y psycopg, sujeto a configurar una cuenta del equipo y verificar límites. El nivel gratuito publica base de datos de 500 MB y pausa tras una semana de inactividad; no garantiza backups automáticos. Mantener un respaldo permitido de la ejecución de demo antes de la entrega. [Plan Free](https://supabase.com/pricing).

Conectar desde el backend mediante el pooler en modo transacción, con TLS, pool pequeño y prepared statements desactivados según el driver. El cliente web no necesita acceso directo a PostgreSQL ni claves de servicio. [Conexiones serverless](https://supabase.com/docs/guides/database/connecting-to-postgres).

Alternativas: SQLite o JSON local no satisfacen recuperación tras reciclar una función; memoria solo sirve para caché prescindible. Un proveedor PostgreSQL distinto puede sustituir a Supabase si mantiene el contrato y presupuesto, pero esta propuesta utiliza Supabase como ruta inicial. No se contrata el plan Pro ni extras automáticamente.

### 3. Acceso compartido sin complemento de pago

Usar **HTTP Basic sobre HTTPS** como mecanismo mínimo de demo. Next.js verifica la credencial compartida antes de entregar páginas privadas, datos o mutaciones. Cada Route Handler comprueba el acceso: proteger solo un layout o proxy no cubre las rutas de datos. El servidor Next transmite la autorización validada únicamente al servicio Python mediante su binding; FastAPI vuelve a comprobarla y protege o desactiva documentación/OpenAPI. Configurar los mismos secretos de demo en ambos servicios, compararlos de forma segura y no incluirlos en repositorio, bundle cliente o registros. [Autenticación Next.js](https://nextjs.org/docs/app/guides/authentication), [HTTP Basic FastAPI](https://fastapi.tiangolo.com/advanced/security/http-basic-auth/).

El binding permite acceso interno, pero no autentica la llamada ni aplica la protección pública del despliegue. Por ello la validación del backend es obligatoria aunque no tenga ruta pública. Las mutaciones usarán métodos apropiados y verificarán el origen esperado; ninguna lectura debe cambiar estado o ejecutar proveedores. [Autorización entre servicios](https://vercel.com/docs/services/bindings).

La credencial es de la aplicación, no las credenciales de Vercel ni las API keys. Todas las personas autenticadas acceden al mismo espacio de demo; no se atribuyen decisiones a identidades individuales. Las páginas, lecturas entre servicios y respuestas con datos privados no usarán caché compartida ni render estático en build. Los archivos públicos contienen solo assets sin datos de ejecuciones; los resultados no se escriben en public/. Reutilizar el stack frontend no implica incorporar Supabase Auth ni el acceso Google del proyecto de referencia.

Alternativas: Supabase Auth o una interfaz de login con sesiones podrían ampliarse después; para una sola credencial añaden trabajo no necesario. No se compra Password Protection de Vercel para cumplir este requisito.

### 4. Procesamiento por pasos persistidos

Cada ejecución guarda etapa, cobertura, versión de criterios y cursor de avance. Una mutación autenticada en Next solicita a Python una unidad acotada —página de canal, lote de clasificación o pieza seleccionada— y Python guarda el resultado antes de responder. La interfaz consulta el estado mediante Next y solicita el siguiente paso cuando corresponda. Tras cerrar el navegador, el trabajo no se promete activo: al volver, se recupera y reanuda desde el último paso confirmado.

No lanzar una tarea en memoria y declararla duradera después de devolver la respuesta. Cada paso tiene identidad estable por ejecución, etapa, elemento y versión. Antes de llamar al proveedor, reclamarlo atómicamente y reservar su costo estimado; solo quien obtiene esa reserva puede ejecutarlo. Otro intento devuelve el estado o resultado existente, sin una segunda llamada simultánea. Si se pierde la confirmación del proveedor, conservar el estado incierto y la reserva hasta reconciliar uso o decidir un reintento informado; no liberar automáticamente el paso y repetir la llamada. La persistencia de un resultado no implica que se completaron todas las etapas.

Vercel limita duración, memoria y tamaño por invocación; deben comprobarse los límites efectivos del plan activo. La documentación actual publica 300 segundos para Hobby y 800 para Pro con Fluid, y 4,5 MB por request/response. Enviar URLs y resultados estructurados, no archivos de video. Una lectura de los docs no acredita que una llamada real entre en esos límites. [Límites de Functions](https://vercel.com/docs/functions/limitations).

La solicitud atraviesa una función Node y otra Python; medir ambos tiempos y limitar cada paso para que termine antes del menor timeout configurado, incluyendo el retorno de la respuesta. Los servicios y las llamadas internas pueden generar uso facturable adicional que se registra dentro del presupuesto incremental; no asumir que el binding es gratuito. [Costos y límites de Services](https://vercel.com/docs/services/pricing).

Alternativa: una llamada para el corpus entero o un worker permanente; la primera acumula riesgo de timeout y pérdida de avance, el segundo agrega infraestructura. Mantener el procesamiento por pasos para esta demo y verificar su duración con una prueba real.

### 5. Adquisición y clasificación temática

Ruta inicial: resolver cada URL de canal con YouTube Data API, consultar su playlist de publicaciones, paginar hasta cubrir los intervalos y obtener metadatos de sus IDs. Conservar la URL original aunque su resolución falle. Filtrar usando la fecha pública del video y duración de hasta 180 segundos; deduplicar por ID. Duración no acredita Short confirmado. [Canales](https://developers.google.com/youtube/data/reference/rest/v3/channels/list), [publicaciones](https://developers.google.com/youtube/data/reference/rest/v3/playlistItems/list), [videos](https://developers.google.com/youtube/data/reference/rest/v3/videos/list).

Usar título, descripción y evidencia textual disponible para pertinencia IA con JEV; si no bastan, marcar insuficiente. No inventar transcripciones. La falta de análisis profundo no bloquea una clasificación temática suficientemente respaldada; la incertidumbre de pertinencia o tema principal sí limita el conteo correspondiente.

Gemini propone temas canónicos y asignaciones sobre el conjunto de ambas ventanas, con evidencia, sin confundir temas con pilares. Para lotes grandes, las propuestas parciales se concilian en una sola versión antes de mostrarla. Cada video tiene un principal y secundarios sin contribución al conteo. Validar identidades, asignaciones y evidencia antes de presentar la propuesta; una salida no válida queda pendiente.

El operador inspecciona y confirma la propuesta, sin edición manual. La confirmación conserva versión y momento. Sin confirmación no se calcula la comparación. Las clasificaciones y conteos guardados son una instantánea de esa ejecución; observaciones editoriales posteriores no los reescriben silenciosamente. Si se necesita una nueva clasificación, una nueva ejecución genera y confirma una versión nueva, conservando la anterior.

### 6. Cálculo determinista y cobertura

Calcular intervalos usando America/Bogota y el inicio del día de la ejecución: reciente desde siete días antes hasta ese inicio, anterior desde catorce hasta siete días antes. Guardar las fronteras y la zona, usando inicio inclusivo y fin exclusivo. Contar IDs distintos solo en su principal confirmado, conservando los videos y aportes por canal.

La cobertura temática se compone de adquisición, elegibilidad, pertinencia y tema principal resueltos en ambas ventanas. Cobertura audiovisual profunda, formato, valor o afinidad son estados aparte. A y B desconocidos no se serializan como cero. Solo una comparación completa evaluable produce el porcentaje con base positiva o «nuevo en el corpus» con base cero conocida. Con cobertura parcial se muestran conteos observados y limitaciones, con comparación completa pendiente.

Aceptar una demo parcial modifica el criterio de presentación, no la verdad de los datos. El recorrido parcial debe seguir usando publicaciones, observaciones y decisiones reales; no autoriza omitir JEV, fabricar evidencia o simular adquisiciones.

### 7. Análisis profundo y rúbrica JEV

El operador selecciona cualquier publicación elegible. Gemini por URL pública es la ruta candidata para observar formato, recursos verbales/visuales/auditivos y estructura, y extraer referencias temporales. Es una capacidad en preview; contrastar tiempos y observaciones contra el original y conservar el estado pendiente/revisado de cada evidencia. JEV recibe estado textual y evidencia, no el archivo audiovisual. [Video por URL](https://ai.google.dev/gemini-api/docs/video-understanding), [JEV](https://docs.typesafe.ai/introduction/quickstart).

Preguntas tipadas propuestas para el playbook:

| Pregunta | Salida | Uso |
| --- | --- | --- |
| ¿La IA es central o hay aplicación concreta explicada? | Choice: pertinente / no pertinente / insuficiente | Elegibilidad temática, con evidencia textual conservada. |
| ¿Existe aporte respaldado para la audiencia? | Choice: aporte respaldado / utilidad no sustentada / información insuficiente | Valor de la pieza seleccionada. |
| ¿La pieza ayuda a líderes o equipos de LatAm aprendiendo IA? | Choice: respaldado / no sustentado / insuficiente | Persona destinataria, con beneficiario describible. |
| ¿Su contexto de aplicación encaja con esa audiencia? | Choice: respaldado / no sustentado / insuficiente | Contexto empresarial o de equipo, sin inferir espectadores reales. |
| ¿A qué pilar corresponde principalmente? | Choice: los cuatro pilares aprobados / otro pertinente / información insuficiente | Afinidad editorial; otro pertinente requiere descripción respaldada. |

Los textos de preguntas y criterios se versionan; conservar respuestas, probabilidades disponibles y uso del proveedor. JEV devuelve decisiones tipadas, no redacta el motivo o guion: la síntesis en Gemini usa material observado y decisiones, y se valida estructuralmente. Las probabilidades se muestran como información del modelo, no como precisión comprobada ni probabilidad de viralidad. [API JEV](https://docs.typesafe.ai/api), [modelos y límites](https://docs.typesafe.ai/models).

No fijar un umbral numérico arbitrario como si estuviera calibrado. Las salidas insuficientes y errores quedan pendientes; la propuesta de grupos y toda decisión editorial pasan por revisión humana. No hay aprobación ni publicación autónoma, cualquiera que sea la confianza. El playbook registrará esta política de revisión y los resultados de evaluación antes de justificar otros umbrales.

La adaptación contiene ángulo, aporte, gancho y estructura sugeridos, CTA si tiene respaldo, evidencias, hipótesis y límites. No trasladar porcentajes o urgencias ilustrativas de la investigación a hechos, ni atribuir experiencias o recursos inexistentes al equipo.

### 8. Datos y contratos entre frentes

El usuario confirmó tres integrantes. Cada archivo y tarea tiene un dueño de implementación; otra área revisa o consume su entrega sin escribir una segunda versión. Las rutas siguientes delimitan la implementación futura: no se crean carpetas ni código durante esta revisión.

| Área | Propiedad de implementación y documentación |
| --- | --- |
| FE — Frontend | frontend/, incluidas dependencias, componentes, Route Handlers, tipos consumidores y pruebas frontend/E2E; branding de interfaz, DESIGN.md, guía frontend y playbook. Valida acceso en Next y presenta estados; no adquiere contenido, calcula señales ni accede directamente a proveedores o BD. |
| ALG — Algoritmia/JEV | backend/analysis/, incluidas sus pruebas y documentación de criterios/evaluación. Define ventanas, pertinencia IA, grupos, conteos, cobertura analítica, preguntas JEV, prompts Gemini y significado de observaciones/adaptaciones. No implementa HTTP, endpoints, BD, secretos, reservas ni despliegues. |
| BE — Backend/infraestructura | backend/ excepto backend/analysis/, incluidas pruebas de API/adaptadores/persistencia, contratos API y migraciones; configuración raíz y de Vercel, entornos/secretos, README operativo, costos, integración de ramas y paquete final. Adquiere YouTube, conecta proveedores, controla ejecución/persistencia y entrega; no duplica cálculos o rúbricas de ALG ni escribe componentes frontend. |

**Contrato de integración:** BE publica un borrador de operaciones, entradas/salidas, IDs, estados, errores, versiones y ejemplos; ALG comprueba su semántica y FE revisa documentalmente su consumo. BE registra la versión acordada en una única fuente de contrato, con validación de compatibilidad. Las revisiones se realizan sobre el borrador, sin esperar el cierre de esa misma tarea. G0 usa el primer hito documental de FE 1.1; los tipos y su validación técnica se completan después de la base 1.2, sin bloquear el cierre del contrato. El contrato API y los esquemas de transporte pertenecen a BE; las interfaces internas de análisis pertenecen a ALG y BE realiza el mapeo si hace falta. FE deriva tipos consumidores y no mantiene un contrato competidor. El usuario asume FE; su orden y dependencias están en [PLAN_FRONTEND.md](../../../docs/PLAN_FRONTEND.md).

El contrato BE 3.1 queda acordado en [docs/contracts/openapi.json](../../../docs/contracts/openapi.json), versión `1.0.0`, con [autoridad, registro y política de versiones](../../../docs/contracts/README.md). Incorpora H01–H04, la [revisión semántica ALG 2.1](../../../docs/REVISION_SEMANTICA_ALG.md), las [interfaces internas y puertos](../../../docs/INTERFACES_ANALISIS.md) y conformidad documental FE sobre la misma versión. G0 contractual queda cerrado mediante revisión asistida a solicitud del usuario, sin atribuir firmas a otros integrantes ni acreditar endpoints implementados. El segundo hito técnico de FE 1.1 se realizará después de 1.2. BE 3.2 sigue pendiente antes de cualquier prueba pagada y las verificaciones de acceso/despliegue conservan sus tareas.

| Transferencia | Productor y consumidor | Regla que evita duplicación |
| --- | --- | --- |
| Ventanas | ALG → BE | ALG calcula una vez desde el inicio de ejecución; BE conserva y usa esas fronteras para adquirir. FE solo las muestra. |
| Publicaciones y cobertura técnica | BE → ALG | BE resuelve canales, pagina, valida condición pública/duración y deduplica. ALG decide pertinencia IA y temas; no crea otro recolector. |
| Solicitudes a JEV/Gemini | ALG → adaptadores BE → ALG | ALG define preguntas, prompts y respuestas esperadas. BE aporta transporte autenticado, errores y uso; cada llamada pasa por reserva de costo/paso. Ningún secreto llega al módulo de ALG. |
| Grupos y confirmación | ALG → BE → FE → BE | ALG propone; FE permite inspeccionar/confirmar; BE persiste versión y momento. Confirmar no cambia asignaciones ni aprueba una adaptación. |
| Señales, análisis y evidencia | ALG → BE → FE | ALG produce resultados; BE valida/persiste/expone; FE presenta sin volver a calcular o juzgar. |
| Selección, revisión y motivo | FE → BE | BE conserva identidad de ejecución/análisis y aplica transiciones atómicas. Abrir una ficha no inicia análisis pagado. |
| Notion opcional | BE API → FE interfaz | BE decide la activación al final y construye el adaptador; FE conecta la acción solo cuando exista un contrato operativo. |

El módulo de ALG es código de dominio sin acceso directo a HTTP/BD/secretos; puede invocar puertos de proveedor inyectados por BE. Las funciones de ventanas y cálculo son deterministas. BE es el único dueño de reclamaciones de pasos, reservas, reintentos y persistencia: no delega a ALG una vía directa que omita esos controles. FE ejecuta comprobaciones E2E; ALG es dueño de evaluación analítica y entrega sus resultados a FE para el playbook; BE consolida operación, costos, respaldos y entrega final.

No editar archivos de otra área para resolver una integración: registrar el cambio requerido y su dueño lo aplica. Cada entrega incluye versión, ejemplo de entrada/salida, comprobación y limitaciones. BE coordina la integración de ramas sin reescribir silenciosamente el trabajo de los otros. El [plan de trabajo](../../../docs/PLAN_DE_TRABAJO.md) define las puertas globales y [tasks.md](tasks.md) contiene las casillas únicas y la trazabilidad de la redistribución.

| Entidad | Contenido propuesto |
| --- | --- |
| Ejecución | ID, inicio/captura, ventanas y zona, etapa/cursor, cobertura y versión de reglas/modelos. |
| Cobertura de canal | URL e ID resuelto, ventana, páginas revisadas, estado y errores de adquisición/clasificación. |
| Publicación y captura | ID único, metadatos públicos y estadísticas originales con fecha; condición pública, duración y candidato/Short. |
| Clasificación por ejecución | Evidencia, decisión IA, tema principal, secundarios no contados, estado y criterios. |
| Versión de grupos | Identidades canónicas, variantes, asignaciones, evidencia y confirmación con fecha. |
| Señal temática | IDs por ventana, A/B conocidos o desconocidos, diferencia/porcentaje permitido, cobertura y motivos. |
| Análisis de pieza | Material realmente procesado, observaciones y tiempos, formato, decisiones JEV, valor, afinidad, hipótesis y adaptación. |
| Revisión editorial | Estado inicial pendiente, decisión, motivo y revisión de evidencia; vinculados al análisis exacto. |
| Uso de proveedores | Petición/etapa, proveedor y modelo, uso informado, tiempo, error y estimación de costo con su fuente. |

Guardar confirmaciones y cambios de estado de forma atómica; validar esquemas antes de persistir resultados de modelos. El texto externo se trata como datos, se escapa al renderizar y no decide herramientas o mutaciones por instrucciones incluidas en un video. No almacenar datos personales, credenciales, videos o comentarios de usuarios como parte del corpus.

Python expone contratos JSON versionados y valida con Pydantic; Next usa tipos TypeScript y valida respuestas en el límite entre servicios. Mantener un solo contrato para estados desconocidos, errores y revisión; los tipos de TypeScript por sí solos no validan respuestas durante la ejecución. Probar el intercambio real sin duplicar los cálculos temáticos en el frontend.

### 9. Presupuesto y evaluación

El límite autorizado es **20 USD de nuevos consumos**, incluyendo APIs y posibles extras de hosting o persistencia; la cuota Vercel ya pagada queda aparte. Registrar recargas mínimas y cargos nuevos antes de consumirlos; no activar planes, complementos o asientos de pago automáticamente.

Comenzar con una prueba real acotada y medir duración, tokens y costo reportado o estimado. Registrar la fuente de tarifas y distinguir cuota, saldo prepagado, estimación y factura. El saldo disponible considera cargos confirmados más reservas de llamadas en curso o inciertas; reservar el costo antes de cada llamada, atómicamente junto con el paso. Antes de ampliar lotes, reservar margen según medición y no autorizar solicitudes pagadas si no se puede justificar que caben. Evitar reanalizar automáticamente piezas no elegidas o repetir resultados válidos guardados.

Las tarifas y límites públicos permiten estimar, pero no garantizan gasto exacto: dependen del modelo, contenido, reintentos, plan y retraso de contabilización. Verificar las cuentas del equipo, la recarga mínima de JEV y el estado real de Gemini. [Precios Gemini](https://ai.google.dev/gemini-api/docs/pricing), [facturación Gemini](https://ai.google.dev/gemini-api/docs/billing), [precios JEV](https://docs.typesafe.ai/models), [uso Vercel](https://vercel.com/docs/pricing).

Separar validación determinista —ventanas, deduplicación, conteos, base cero y control de acceso— de evaluación humana de pertinencia, equivalencias, fidelidad audiovisual y utilidad. Usar material de evaluación distinto del empleado para ajustar criterios; publicar resultados y desacuerdos reales, sin inventar un porcentaje mínimo de precisión o latencia.

Para frontend, usar comprobación TypeScript, ESLint y Prettier, Vitest para contratos o lógica relevante y Playwright para el recorrido protegido e integrado. Para Python, pytest cubre ventanas, conteos, cobertura y control de pasos/gasto. Un build correcto no sustituye una prueba del binding, de la credencial en ambos servicios o de la recuperación tras reinicio.

### 10. Estado de accesos y puerta inicial

| Dependencia | Estado declarado | Verificación inicial pendiente |
| --- | --- | --- |
| Vercel | Cuenta configurada, plan de pago activo y abonado aparte | Services, runtimes Node/Python, binding, límites efectivos, secretos y despliegue protegido. |
| Gemini | Configurado | Modelo disponible, URL pública admitida, salida temporal y uso real. |
| YouTube Data API | No configurado | Proyecto/clave, API habilitada, resolución de canales y metadatos públicos. |
| JEV | No configurado | Cuenta/clave, acceso al modelo, decisión tipada auténtica y facturación. |
| Supabase PostgreSQL | Por configurar | Proyecto Free, conexión backend, escritura y recuperación tras reinicio. |
| Notion | Por confirmar, opcional | Solo si se activa la extensión al final. |

La primera etapa de ejecución configura y comprueba estas dependencias; un error produce un bloqueo identificado, no una dependencia supuesta. Si una ruta obligatoria no puede funcionar dentro del presupuesto, se comunica antes de ampliar desarrollo. No sustituir JEV por resultados simulados ni suponer que aceptar cobertura parcial permite omitirlo.

## Risks / Trade-offs

- [Canal inaccesible o sin material elegible] → Conservar las 11 fuentes previstas y sus estados; permitir demo parcial real con comparación completa pendiente.
- [Metadatos ambiguos o clasificación equivocada] → Evidencia y versión visibles, insuficiencia explícita y confirmación humana de grupos. No ofrecer correcciones manuales no acordadas.
- [Observaciones de modelo inexactas] → Marcas temporales contrastables y estado de revisión; no declarar causalidad o hechos sin respaldo.
- [Llamadas lentas o función interrumpida] → Pasos acotados, persistencia y reanudación; medir antes de ampliar y no depender de trabajos en memoria tras responder.
- [Costos o mínimos de recarga incompatibles] → Comprobar acceso y cobro real al inicio, estimar antes de lotes y detener nuevas solicitudes si no caben en los 20 USD.
- [Persistencia gratuita pausada o sin backup automático] → Verificar disponibilidad antes de la demo y generar respaldo permitido de resultados y contexto.
- [Credencial compartida] → Proteger todos los datos y operaciones, sin afirmar identificación individual de quien tomó una decisión.
- [Dos runtimes y Services en beta] → Verificar el primer despliegue y binding al inicio; contratos JSON comprobados y autenticación en ambos servicios, sin presumir protección por la red interna.

## Migration Plan

1. Tras una nueva autorización para implementar, configurar y verificar los accesos iniciales del cuadro anterior. Preparar Node >=24.21.0 <25 para el frontend y Python 3.12 para backend, fijar dependencias compatibles y comprobar versiones; el Node 24.19.0 usado para OpenSpec no satisface por sí solo el requisito del frontend. No ejecutar el prototipo de referencia.
2. Preparar Next.js y FastAPI como servicios, comprobar el binding y rechazo sin credencial en ambos, crear el esquema PostgreSQL y publicar el primer despliegue protegido. Comprobar persistencia desde otra sesión y tras reinicio.
3. Integrar por etapas adquisición, pertinencia/grupos, confirmación/cálculo y análisis seleccionado/revisión, con sus comprobaciones y documentación en cada frente.
4. Ensayar con datos reales, registrar cobertura y evaluación, congelar la versión y el respaldo y preparar README/playbook/repositorio público sin secretos. Notion solo si cabe después de cubrir el núcleo y la entrega.
5. Ante regresión, volver al despliegue anterior compatible y mantener los resultados identificados por versión. Las migraciones de la demo serán aditivas cuando sea posible; no borrar resultados para corregir una ejecución fallida.

## Open Questions

Solo detalles operativos diferibles sin cambiar el contrato: identificadores concretos de modelos disponibles, versiones de paquetes Python y ajustes necesarios tras comprobar compatibilidad del frontend de referencia, nombre del proyecto/URL asignada, credenciales y responsables individuales de cada frente. El stack frontend ya está decidido; no es una pregunta abierta. No se han inventado los valores restantes ni las horas disponibles. Los accesos por configurar y sus pruebas están expresamente planificados como primer bloque en [tasks.md](tasks.md).
