# Tasks

Plan de ejecución posterior a las especificaciones. El usuario confirmó **tres integrantes y tres áreas**: Frontend (FE), Algoritmia/JEV (ALG) y Backend/infraestructura (BE). Cada casilla tiene un único dueño: el del encabezado. Las revisiones o dependencias de otra área no transfieren la propiedad de la tarea.

Todas las casillas siguen pendientes. Después de preparar BE 3.1, se autorizó y emitió la [revisión documental FE 1.1 con observaciones](../../../docs/REVISION_CONTRATO_FRONTEND.md) sobre el [borrador único](../../../docs/contracts/README.md): H01–H03 pendientes, pauta histórica H04 y sin conformidad final. ALG 2.1, versión común, G0 y segundo hito técnico siguen pendientes. La última confirmación no inicia automáticamente Next.js 1.2 ni autoriza otras tareas BE o reinstalar validadores. Referencias: [diseño técnico](design.md), [sistema visual](../../../DESIGN.md), [propuesta](proposal.md) y [plan de tres áreas](../../../docs/PLAN_DE_TRABAJO.md). El usuario asume FE; identidades nominales, experiencia y horas disponibles restantes siguen sin confirmar.

Se separan tareas mixtas del plan anterior: **42 tareas con dueño único**, sin ampliar el alcance. La numeración agrupa por área; el orden global lo determinan estas puertas:

| Puerta | Condición y secuencia |
| --- | --- |
| G0 — Contratos y control previo | BE publica el borrador 3.1; ALG revisa semántica con 2.1 y FE revisa documentalmente entradas, estados y consumo en el primer hito de 1.1; BE registra una versión acordada. G0 no espera tipos programados ni la casilla 1.1 completa: su consumo técnico se verifica después de 1.2. Las revisiones empiezan sobre el borrador, sin esperar el cierre de 3.1. 3.2 habilita el control previo de cualquier consumo pagado. |
| G1 — Accesos y base desplegada | FE prepara 1.2–1.3; BE verifica 3.3–3.7 y control de pasos/gasto 3.10. Toda prueba externa de pago debe pasar antes por 3.2; toda llamada de la aplicación pasa por 3.10. ALG aporta entradas y revisa salidas de las pruebas mediante 2.1. |
| G2 — Corpus y comparación | ALG entrega ventanas 2.2; BE adquiere/persiste con 3.8–3.9; ALG entrega 2.3–2.6; BE conecta 3.11–3.12; FE integra 1.4–1.6. Confirmar grupos sigue siendo previo al cálculo. |
| G3 — Piezas y revisión | ALG entrega 2.7–2.9; BE integra análisis seleccionado y revisión con 3.11–3.12; FE integra 1.7–1.9. El catálogo elegible no espera a que la comparación esté completa. |
| G4 — Evaluación y entrega preparada | ALG completa 2.10–2.12; FE completa 1.10–1.11; BE completa 3.13–3.14. Hay recorrido real, cobertura explícita, evaluación y paquete preparado. |
| G5 — Extensión y cierre | BE decide Notion con 3.15. Solo si se activa, BE implementa 3.16 y FE 1.12; si se difiere, ambas tareas dejan constancia sin simular una integración. Después BE congela y entrega con 3.17–3.18. |

Los escenarios y ejemplos de prueba deben identificarse como tales; nunca sustituyen datos, evidencia o decisiones reales en la demo. Cada área documenta y comprueba sus entregables antes de pasarlos a otra.

## 1. Frontend — responsable FE

**Responsable confirmado:** el usuario solicitante. Prioridades, precedencias y entregas externas en [PLAN_FRONTEND.md](../../../docs/PLAN_FRONTEND.md). Empezar por la revisión documental de 1.1; después de G0, construir 1.2 y completar los tipos de 1.1 antes de 1.3. Las rutas 1.5–1.6 y 1.7–1.9 son independientes entre sí; 1.10 y el borrador de 1.11 se trabajan de forma continua. Se conservan los doce IDs y ninguna tarea se marca terminada por preparar este plan.

**Propiedad:** frontend/, sus dependencias y pruebas, branding de interfaz y DESIGN.md. Construye Next.js y sus Route Handlers; consume el contrato publicado por BE. No implementa adquisición, reglas analíticas, proveedores, acceso directo a PostgreSQL ni configuración de infraestructura.

- [ ] 1.1 Completar dos hitos de la misma tarea: primero revisar documentalmente el borrador 3.1 y registrar campos, estados, ejemplos y observaciones para G0; después de 1.2, preparar tipos TypeScript y validación de respuestas del contrato acordado. Verificar desconocido distinto de cero y errores por etapa; documentar el consumo sin crear un segundo contrato API autoritativo. BE no espera los tipos programados para cerrar G0; marcar esta casilla solo tras ambos hitos.
- [ ] 1.2 Preparar Next.js 16.3.3 con App Router, React/React DOM 19.3.0, TypeScript 5.9.3 y npm sobre Node >=24.21.0 <25. Verificar arranque y build locales, dependencias fijadas y aplicación del DESIGN.md con los logos Fluido; entregar a BE los comandos y variables requeridos por el servicio frontend, sin secretos.
- [ ] 1.3 Implementar acceso compartido en páginas y Route Handlers de Next, transmisión validada al binding interno y consumo JSON del backend. Comprobar rechazo sin credencial o con credencial incorrecta, validación de origen en mutaciones, ausencia de secretos en bundle/logs y respuestas privadas sin caché compartida; no depender solo de layout/proxy ni ejecutar trabajo desde lecturas.
- [ ] 1.4 Construir la vista de ejecuciones, cobertura, errores y recuperación, con consulta de estado y petición explícita de avance/reanudación. Verificar once canales previstos, ventanas reales, ejecución anterior identificada y último paso persistido; no prometer trabajo activo tras cerrar navegador ni inventar progreso/ETA.
- [ ] 1.5 Construir inspección y confirmación de grupos mediante la API de BE. Comprobar versión/fecha visibles y comparación pendiente antes de confirmar, sin ofrecer edición manual de pertinencia, grupos o asignaciones; diferenciar esta acción de la revisión editorial.
- [ ] 1.6 Construir comparación por tema con A/B, diferencia, porcentaje permitido, base cero y cobertura. Verificar presentación de 2/4, 2/0, 0/3, 0/0 y base desconocida a partir de respuestas del contrato; con cobertura parcial no mostrar porcentaje ni novedad del corpus completo. Enlazar publicaciones y contribución por canal, sin recalcular las señales en React.
- [ ] 1.7 Construir listado y selección de cualquier pieza elegible para análisis profundo mediante BE. Comprobar selección sin aumento o con comparación pendiente y que abrir/listar una pieza no dispare análisis pagado; identificar candidato corto frente a Short confirmado.
- [ ] 1.8 Construir la ficha con métricas originales, señal, observaciones audiovisuales, evidencia temporal, valor, afinidad, hipótesis y adaptación separadas. Comprobar enlaces al original, estado de revisión y dimensiones insuficientes; ante fallo audiovisual conservar metadatos y señal disponible, sin puntuación global ni hechos inventados.
- [ ] 1.9 Construir registro de decisión editorial y motivo mediante la API, con confirmación real de guardado. Comprobar estado inicial pendiente, conservación de texto si falla el envío y recuperación tras cerrar navegador/reiniciar la aplicación con la misma evidencia y versión; no confundir confirmación de grupos con aprobación editorial.
- [ ] 1.10 Aplicar comprobaciones progresivamente desde 1.2 y cerrar TypeScript, ESLint, Prettier, build, Vitest para consumo/lógica relevante y Playwright para el recorrido protegido entre Next y Python. Cubrir fallo de canal, fallo audiovisual, consulta/recarga sin repetición pagada y recuperación desde otro equipo; documentar resultados y guía de frontend, sin asumir que un fixture acredita una integración real.
- [ ] 1.11 Preparar temprano el esquema del playbook y consolidar su versión de máximo cinco páginas u ocho diapositivas y el guion de demo con la evidencia de 1.10, evaluación ALG 2.10–2.12 y operación/costos BE 3.14. Verificar fuentes, preguntas JEV, evidencia, cobertura, límites y enlace correcto; entregar a BE el material final de presentación y comprobar que otra persona puede seguir el recorrido. Esta tarea contribuye al cierre de G4; no depende de que G4 ya esté cerrado.
- [ ] 1.12 Resolver la interfaz opcional de Notion solo después de G4 y la decisión 3.15. Si se activa, consumir 3.16 y comprobar guardado manual, enlace real, duplicado y error sin pérdida local. Si se difiere, dejarlo pendiente sin botón o resultado simulado; documentar cuál rama se resolvió.

## 2. Algoritmia y JEV — responsable ALG

**Propiedad:** backend/analysis/, incluidas sus pruebas y documentación de criterios/evaluación. Define reglas, ventanas, rúbricas, prompts y significado de las salidas. No crea endpoints, conexiones de base de datos, clientes HTTP, secretos, reservas de gasto o despliegues. Usa adaptadores autenticados inyectados por BE; JEV decide y Gemini observa/sintetiza según las funciones ya especificadas.

- [ ] 2.1 Revisar la semántica del borrador 3.1 y definir las interfaces de entrada/salida del módulo de análisis y sus puertos de proveedores. Verificar ejemplos de material suficiente/insuficiente, referencias a evidencia, estados y versiones; entregar a BE preguntas/esquemas esperados sin crear un cliente HTTP paralelo ni modificar el contrato API por su cuenta.
- [ ] 2.2 Implementar una única función determinista de ventanas a partir del inicio de ejecución: últimos siete días completos frente a los siete anteriores en America/Bogota, excluyendo el día actual. Probar inicio inclusivo/fin exclusivo y cambio de fecha desde UTC; entregar fronteras y zona a BE para la consulta, sin recalcularlas en otra área.
- [ ] 2.3 Implementar rúbrica y decisión de pertinencia IA con JEV mediante el puerto inyectado por BE. Probar IA central, aplicación concreta, mención incidental, material insuficiente y error del proveedor; conservar evidencia y criterios/modelo versionados, sin sustituir el error por una decisión simulada.
- [ ] 2.4 Implementar la propuesta automática de temas con Gemini a partir de ambas ventanas, conciliando una sola versión canónica. Probar equivalencias, asuntos distintos y falta de respaldo; validar IDs y asignar un tema principal y secundarios sin conteo, sin inventar transcripciones ni modificar manualmente las clasificaciones.
- [ ] 2.5 Implementar conteos de IDs distintos por tema principal y ventana, con publicaciones y aporte por canal, requiriendo versión confirmada. Probar que no se calcula sin confirmación y que secundarios, formato, afinidad o falta de análisis profundo no cambian por sí solos el conteo.
- [ ] 2.6 Implementar diferencia, porcentaje permitido, base cero y política de cobertura temática evaluable. Probar 2/4, 2/0, 0/3, 0/0 y base desconocida; con cobertura incompleta producir conteos observados y comparación completa pendiente, sin porcentaje ni novedad del corpus completo. No inferir crecimiento de audiencia o predicción.
- [ ] 2.7 Implementar prompts e interpretación del análisis audiovisual seleccionado con Gemini por el adaptador de BE. Contrastar formato, gancho verbal/visual/auditivo, estructura y marcas temporales contra el video original; comprobar que una dimensión no observada permanece insuficiente y que el formato no entra en el conteo semanal.
- [ ] 2.8 Implementar las rúbricas JEV de valor, persona, contexto empresarial y pilar. Verificar tres estados de valor, cuatro pilares y alternativas, razones/evidencia y versiones; no inventar espectadores, fijar umbrales no calibrados ni aplicar puntuación compuesta o exclusiones sociales automáticas.
- [ ] 2.9 Implementar síntesis de hipótesis y adaptación mediante Gemini con observaciones y decisiones JEV respaldadas. Revisar fuentes, ángulo, aporte, gancho, estructura y CTA cuando proceda; comprobar que no añade cifras, causalidad, resultados propios, activos o urgencias sin evidencia y que popularidad o crecimiento no acreditan utilidad.
- [ ] 2.10 Evaluar fidelidad audiovisual, pertinencia y utilidad con revisión humana y material distinto del usado para ajustar criterios. Registrar acuerdos, discrepancias, errores y límites reales; entregar a FE resultados, preguntas JEV y política de revisión para el playbook, sin inventar precisión o latencia.
- [ ] 2.11 Validar una ruta real de clasificación, grupos y conteos disponibles y una pieza seleccionada con audiovisual/JEV/adaptación, usando exclusivamente los adaptadores controlados por BE y el presupuesto disponible. Conservar entradas/salidas auténticas, criterios, uso y evidencia; distinguir comparación completa de demo parcial y no reprocesar piezas válidas por defecto.
- [ ] 2.12 Entregar pruebas pytest del módulo y documentación de ventanas, pertinencia, agrupación, conteos, cobertura, observaciones y rúbricas. Verificar que las pruebas cubren los casos anteriores, que las salidas respetan el contrato acordado y que no existe acceso directo a HTTP, base de datos o secretos en backend/analysis/.

## 3. Backend e infraestructura — responsable BE

**Propiedad:** backend/ excepto backend/analysis/, configuración raíz de despliegue y entornos, contratos API, migraciones, integraciones externas, README operativo, registro de costos, integración de ramas y paquete final. Escribe los adaptadores de YouTube, JEV y Gemini y conecta el módulo de ALG; no duplica sus criterios, prompts, ventanas o cálculos, ni edita el frontend.

- [ ] 3.1 Publicar un borrador del contrato JSON/API y recoger la revisión semántica 2.1 y la revisión documental del primer hito 1.1 para cerrar una versión común antes de integrar, sin esperar los tipos programados de FE. Incluir operaciones, IDs, ventanas, cobertura, grupos/confirmación, selección, evidencia/revisión, errores y ejemplos; comprobar compatibilidad con Pydantic y consumidor TypeScript. Documentar la autoridad del contrato y el cambio de versiones en un único lugar.
- [ ] 3.2 Preparar el registro de cargos nuevos, recargas, reservas y tarifas frente al máximo incremental de 20 USD, excluyendo el abono Vercel existente. Verificar mínimos y saldo de las cuentas antes de cada prueba pagada; un costo desconocido no equivale a cero. Dejar evidencia del control previo del consumo y del bloqueo si no puede justificarse que cabe, sin activar planes o extras automáticamente.
- [ ] 3.3 Preparar Python 3.12/FastAPI y verificar Vercel Services, runtimes, comandos frontend entregados en 1.2 y límites efectivos del plan abonado. Comprobar arranque local y primer despliegue con Next público y Python interno por binding, sin ruta pública para Python; registrar límites de ambas funciones y cualquier bloqueo antes de ampliar desarrollo.
- [ ] 3.4 Habilitar YouTube Data API y JEV y verificar los accesos declarados a Gemini y Vercel. Configurar secretos solo en servidor y, tras 3.2, comprobar una resolución/lectura pública, una decisión tipada JEV auténtica y una observación audiovisual real con entradas de ALG; registrar modelo, cuota, uso, cobro y errores sin exponer claves.
- [ ] 3.5 Configurar PostgreSQL en Supabase Free con TLS y pooler; crear esquema y migraciones de ejecuciones, cobertura, publicaciones/capturas, clasificaciones, grupos/confirmación, análisis, revisiones y uso. Probar restricciones de identidad, escritura/lectura desde despliegue y recuperación tras reinicio; no usar filesystem ni memoria como almacenamiento duradero.
- [ ] 3.6 Implementar autenticación de FastAPI y autorización de todas sus operaciones con la misma credencial de demo. Probar rechazo a llamadas internas sin credencial o con credencial incorrecta, protección/desactivación de OpenAPI y respuestas privadas; configurar binding y secretos para que FE implemente su control separado en 1.3.
- [ ] 3.7 Implementar adaptadores HTTP de YouTube, JEV y Gemini con los contratos de proveedor y puertos acordados en 2.1. Probar serialización, respuesta válida/no válida, uso informado, timeout y fallo técnico; transportar preguntas/prompts de ALG sin redefinirlos, capturar versión y evidencia, y canalizar cada llamada pagada por 3.10.
- [ ] 3.8 Resolver las once URLs exactas, consultar publicaciones paginadas con las fronteras de 2.2 y conservar la fecha pública del video. Aplicar condición pública y duración hasta 180 segundos, deduplicar por ID y guardar estadísticas originales/captura; probar 180/181, duración o métrica ausente, fecha playlist distinta, ID repetido y candidato corto sin confirmación de Short. Un canal fallido no se sustituye ni desaparece.
- [ ] 3.9 Persistir cobertura de adquisición/elegibilidad por canal, ventana y etapa y conectar los estados de clasificación entregados por ALG sin reinterpretarlos. Probar canal revisado sin publicaciones, canal no consultado, paginación incompleta, error y reintento; desconocido no se serializa como cero y un fallo audiovisual no altera cobertura temática ya sustentada.
- [ ] 3.10 Implementar orquestación por pasos persistidos, cursor y reclamación atómica con reserva de gasto antes de cada llamada pagada, incluida cada llamada dentro de un lote analítico. Probar reintentos simultáneos, reutilización de resultados y recuperación del último checkpoint; ante confirmación de proveedor incierta conservar estado y reserva sin liberar ni repetir automáticamente el consumo.
- [ ] 3.11 Conectar adquisición, módulo de ALG y endpoints mediante el contrato común. Probar ejecución persistida hasta propuesta de grupos y conteos tras confirmar, y análisis profundo solo por selección explícita; listar/consultar no dispara consumos, una pieza elegible puede analizarse sin crecimiento o con comparación pendiente y no se procesa profundamente el resto por defecto.
- [ ] 3.12 Implementar operaciones persistidas y atómicas de confirmación de grupos, revisión de evidencia y decisión editorial/motivo, vinculadas a ejecución, versión y análisis exactos. Probar acciones independientes, estado inicial pendiente, rechazo de edición manual no permitida y recuperación tras cierre/reinicio sin borrar origen al descartar una adaptación.
- [ ] 3.13 Ejecutar pruebas de contrato e integración backend y documentar sus resultados: autenticación interna, proveedores, persistencia, flujo entre etapas, fallo de canal, fallo audiovisual, concurrencia y gasto incierto. Verificar con el recorrido real disponible que estado y evidencia sobreviven a reinicios y que el binding cumple el contrato consumido por FE.
- [ ] 3.14 Consolidar mediciones iniciales y finales de tiempo, cuota y costo de ambos servicios y proveedores, con su fuente y alcance. Comprobar margen antes de ampliar lotes y dependencia funcional dentro de los 20 USD; completar README operativo con entornos Node/Python, secretos sin valores, arranque reproducible, acceso, persistencia y reanudación. Entregar a FE datos de operación/costo para el playbook.
- [ ] 3.15 Decidir y registrar si Notion se activa o se difiere, solo tras G4 y antes de congelar funciones. Verificar que el núcleo, la evaluación y la preparación de entrega están cubiertos y que la extensión no desplaza dependencias esenciales; FE recibe esta decisión, sin implementar Notion anticipadamente.
- [ ] 3.16 Resolver el backend de la rama Notion: si se activa, configurar una base y comprobar guardado manual real, ID de publicación para duplicados, contexto/revisión, enlace y error sin pérdida local ni sobreescritura silenciosa. Si se difiere, dejar estado pendiente documentado sin llamadas o guardados simulados; entregar a FE el contrato y la rama efectiva para 1.12.
- [ ] 3.17 Integrar únicamente entregables revisados de cada dueño y congelar versión y respaldo permitido de ejecuciones reales después de cerrar el núcleo y resolver Notion. Comprobar fecha, cobertura, criterios/modelos, evidencia/revisión y recuperación del respaldo; tras el cierre solo aceptar correcciones necesarias para ejecutar o entregar.
- [ ] 3.18 Verificar repositorio público sin secretos, URL protegida y acceso desde otro equipo, y reunir README/playbook/evaluación/respaldo en el paquete final. Dejar al responsable humano de BE el envío por el canal requerido y registro de recepción antes del 18 de octubre de 2026 a las 12:00, Colombia. Las 11:00 son objetivo interno propuesto; no se da por hecho el envío ni se autoriza mensajería automática.

## Trazabilidad de la redistribución

Los IDs anteriores se reemplazan por los nuevos. Las casillas anteriores estaban sin completar; ninguna se marca hecha por esta reorganización. Esta tabla permite comprobar que todas conservan cobertura:

| ID anterior | Tareas nuevas |
| --- | --- |
| 1.1 | 3.2, 3.10 |
| 1.2 | 3.3, 3.4, 3.7, 2.11 |
| 1.3 | 3.4, 3.8 |
| 1.4 | 3.4, 3.7, 2.3, 2.11 |
| 1.5 | 3.5 |
| 1.6 | 2.11, 3.14 |
| 2.1 | 1.2, 3.3 |
| 2.2 | 1.3, 3.6 |
| 2.3 | 3.5 |
| 2.4 | 3.10 |
| 2.5 | 1.1, 2.1, 3.1, 3.14 |
| 3.1 | 2.2, 3.8 |
| 3.2 | 3.8 |
| 3.3 | 3.8 |
| 3.4 | 3.8 |
| 3.5 | 3.9, 3.13 |
| 4.1 | 2.3 |
| 4.2 | 2.4 |
| 4.3 | 1.5, 2.5, 3.12 |
| 4.4 | 2.5 |
| 4.5 | 2.6 |
| 4.6 | 2.11, 2.12 |
| 5.1 | 1.7, 3.11 |
| 5.2 | 2.7, 3.7 |
| 5.3 | 2.8 |
| 5.4 | 2.9 |
| 5.5 | 2.10, 2.12 |
| 6.1 | 1.4, 1.5, 1.6, 1.7, 1.8 |
| 6.2 | 1.9, 3.12 |
| 6.3 | 1.10, 3.13 |
| 6.4 | 1.10, 1.11, 2.10, 2.12, 3.14 |
| 7.1 | 3.15 |
| 7.2 | 1.12, 3.16 |
| 8.1 | 3.17 |
| 8.2 | 3.18 |

## Workflow follow-up

- Revisar artefactos y evidencias antes de sincronizar o archivar el cambio; no archivar mientras el producto solo esté planificado.
- La evolución predictiva basada en radar_30x_prototype-v2.py se especificará como trabajo futuro; este cambio no ejecuta ni integra ese archivo.
