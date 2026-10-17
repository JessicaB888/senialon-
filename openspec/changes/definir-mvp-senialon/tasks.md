# Tasks

Plan de ejecución posterior a las especificaciones. Todas las tareas están pendientes: escribir esta lista no implementa el producto ni valida accesos. Iniciar desarrollo solo con una nueva instrucción del usuario. Referencias: [diseño](design.md), [propuesta](proposal.md) y [plan de cuatro frentes](../../../docs/PLAN_DE_TRABAJO.md).

Asignación por rol, sin inventar nombres o disponibilidad: integrante 1, adquisición/calidad; integrante 2, clasificación/señales/JEV; integrante 3, audiovisual/valor/adaptación; integrante 4, interfaz/persistencia/integración/entrega. El integrante 4 coordina contratos y despliegues; cada frente verifica y documenta su trabajo.

## 1. Accesos, prueba inicial y presupuesto

- [ ] 1.1 Preparar el registro de costos nuevos, recargas y reservas frente al máximo de 20 USD, excluyendo el abono Vercel existente; establecer como precondición de cada prueba real verificar tarifas y mínimos de su cuenta, estimar el consumo y comprobar saldo suficiente. Verificar que un costo desconocido no se trata como cero ni autoriza una llamada pagada.
- [ ] 1.2 Verificar el proyecto y límites efectivos del Vercel ya abonado, disponibilidad de Services para Next.js/Python y el acceso Gemini declarado; registrar runtimes, modelos y cuotas disponibles sin secretos. Tras el control previo de 1.1, completar con evidencia de acceso y una solicitud audiovisual real comprobada contra un video público.
- [ ] 1.3 Habilitar YouTube Data API en el proyecto del equipo y configurar su credencial; comprobar resolución de una URL del corpus y lectura de metadatos públicos, registrando campos, cuota y errores reales.
- [ ] 1.4 Configurar el acceso JEV y, tras verificar cobro y saldo mediante 1.1, comprobar una decisión tipada auténtica en español; registrar modelo, entrada pública o simulada identificada, respuesta y uso, sin presentar el material de prueba como contenido recolectado.
- [ ] 1.5 Configurar PostgreSQL en Supabase Free y probar conexión backend con TLS y pooler; comprobar escritura/lectura y acceso desde el entorno de despliegue sin exponer la conexión al cliente.
- [ ] 1.6 Consolidar las primeras mediciones de duración, uso y costo en el registro y comprobar que caben antes de ampliar el procesamiento. Si una dependencia obligatoria no cabe o no funciona, documentar el bloqueo, sin sustituirla por datos simulados.

## 2. Base web protegida, persistencia y ejecución por pasos

- [ ] 2.1 Preparar frontend Next.js 16.3.3/App Router, React/React DOM 19.3.0, TypeScript 5.9.3 y npm con Node >=24.21.0 <25, y backend Python 3.12/FastAPI; fijar dependencias compatibles. Comprobar arranque local, build y primer despliegue Vercel Services, con Next público y Python interno mediante binding, sin copiar código del proyecto de referencia ni presentar datos de prueba como reales.
- [ ] 2.2 Implementar la credencial compartida de demo en páginas, datos y mutaciones de Next y verificarla otra vez en FastAPI; comprobar rechazo sin credencial o con credencial incorrecta en ambos servicios, transmisión solo desde servidor por binding, origen de mutaciones y acceso válido. Verificar que layouts/proxy no sean el único control, Python no tenga ruta pública y no se expongan datos en caché compartida ni secretos en bundle o logs.
- [ ] 2.3 Crear esquema y migraciones de ejecuciones, cobertura, publicaciones, clasificaciones, grupos/confirmación, análisis, revisiones y uso de proveedores; comprobar restricciones de identidad y recuperación tras reiniciar la aplicación con datos de prueba identificados.
- [ ] 2.4 Implementar pasos y checkpoints persistidos con reclamación atómica antes de llamar proveedores y reserva de gasto; probar reintentos simultáneos del mismo paso, recuperación de resultados existentes y estado incierto sin segunda llamada pagada automática.
- [ ] 2.5 Documentar entornos Node/Python, arranque de ambos servicios, configuración y binding sin valores secretos, mecanismo de acceso, persistencia y reanudación. Definir y comprobar contrato JSON/Pydantic/TypeScript de estados, evidencia, cobertura y errores, validando respuestas durante la ejecución; verificar desde un entorno limpio los límites y tiempos de ambas funciones según el plan usado.

## 3. Adquisición y cobertura — integrante 1

- [ ] 3.1 Implementar las dos ventanas completas en America/Bogota y el corte de día actual; comprobar límites inclusivo/exclusivo y un caso que cambie de fecha al convertir desde UTC.
- [ ] 3.2 Resolver y conservar las once URLs exactas del corpus y sus estados; comprobar que un fallo no sustituye el canal ni elimina su estado de cobertura.
- [ ] 3.3 Recolectar páginas y metadatos necesarios para las ventanas usando la fecha pública del video, deduplicando por ID; verificar paginación, repetición de IDs y diferencia entre fecha de inclusión en playlist y publicación del video.
- [ ] 3.4 Aplicar condición pública y hasta 180 segundos, conservando estadísticas originales y captura; verificar 180/181 segundos, duración o métrica ausente y candidato corto sin afirmar Short por duración solamente.
- [ ] 3.5 Persistir cobertura por canal, ventana y etapa y documentar el contrato de adquisición; comprobar con una consulta real y casos controlados de canal vacío, acceso fallido y reintento que desconocido no se transforme en cero.

## 4. Clasificación, confirmación y señales — integrante 2 con interfaz del 4

- [ ] 4.1 Implementar pertinencia IA con JEV y evidencia de entrada versionada; comprobar IA central, aplicación concreta, mención incidental, material insuficiente y fallo de proveedor, sin reemplazar errores por decisiones simuladas.
- [ ] 4.2 Generar grupos automáticamente con material de ambas ventanas y asignar un principal y secundarios sin conteo; validar IDs de entrada, equivalencias, aplicaciones distintas y falta de respaldo antes de presentar la propuesta.
- [ ] 4.3 Construir inspección y confirmación de grupos con fecha/versión persistida; comprobar que no se calcula comparación antes de confirmar y que no hay edición manual de pertinencia, principal o asignaciones.
- [ ] 4.4 Implementar conteos de IDs únicos por principal y ventana, con publicaciones y contribución por canal; comprobar que secundarios, formato, afinidad y falta de análisis profundo no alteran por sí solos el conteo.
- [ ] 4.5 Implementar diferencia, porcentaje permitido, base cero y cobertura parcial; verificar A/B de 2/4, 2/0, 0/3, 0/0 y base desconocida. Con cobertura incompleta comprobar comparación completa pendiente, sin porcentaje ni novedad del corpus completo.
- [ ] 4.6 Documentar criterios de pertinencia/agrupación y confirmación, y validar una ejecución real hasta los conteos disponibles; conservar versiones y evidencia de JEV y diferenciar la comparación completa de una demo parcial.

## 5. Análisis profundo, valor y adaptación — integrante 3 con JEV del 2

- [ ] 5.1 Conectar selección del operador desde cualquier pieza elegible y procesar solo las elegidas en profundidad; comprobar acceso a una pieza sin aumento o con comparación pendiente y que otras piezas no disparan ese análisis por defecto.
- [ ] 5.2 Obtener observaciones de formato, gancho verbal/visual/auditivo y estructura con Gemini por URL; contrastar marcas contra el video real, conservar estados de revisión y comprobar que una dimensión no observada no se inventa desde metadatos.
- [ ] 5.3 Implementar las decisiones JEV de valor, persona, contexto y pilar con salidas acordadas; verificar tres estados de valor, cuatro pilares y alternativas, evidencia y modelo/versiones, sin puntuación compuesta ni rechazos sociales automáticos.
- [ ] 5.4 Producir hipótesis y adaptación con fuentes, ángulo, aporte, gancho, estructura y CTA cuando proceda; revisar que no añade cifras, causalidad, resultados propios, activos o urgencias sin evidencia y que crecimiento o popularidad no acreditan utilidad.
- [ ] 5.5 Evaluar fidelidad audiovisual, pertinencia y utilidad con material distinto del usado para ajustar criterios; registrar acuerdos, discrepancias, errores y límites reales, y documentar preguntas JEV y política de revisión humana para el playbook.

## 6. Revisión, integración y entrega — integrante 4 con los demás frentes

- [ ] 6.1 Integrar en Next.js/React la bandeja de ejecuciones/cobertura, grupos, comparación temática, publicaciones y fichas con las variantes Fluido de branding; consumir contratos de FastAPI por rutas autenticadas de Next, sin duplicar conteos en el cliente. Comprobar el recorrido protegido desde otra persona/equipo y separación visible de señal, métricas, valor, afinidad y propuestas.
- [ ] 6.2 Guardar revisión editorial y motivo, y diferenciarla de confirmar grupos; comprobar recuperación tras cerrar navegador y reiniciar la app con la misma evidencia y versión, y ejecución anterior identificada como respaldo.
- [ ] 6.3 Verificar con Playwright el recorrido entre Next y Python de extremo a extremo: publicación real → pertinencia/grupos → confirmación → conteos disponibles → selección → audiovisual/JEV → adaptación/revisión recuperable. Incluir fallo de canal y fallo audiovisual, y comprobar que recargar o consultar estado no repite llamadas pagadas; registrar cobertura parcial sin simular cumplimiento de la comparación completa.
- [ ] 6.4 Comprobar TypeScript, ESLint, Prettier y build del frontend, Vitest para contratos/lógica relevante y pytest para cálculo/cobertura/pasos. Completar README, medición de tiempo/costo de ambos servicios y playbook de máximo cinco páginas u ocho diapositivas; otra persona debe reproducir el arranque fuera de 30X, abrir la URL y contrastar las evidencias y decisiones documentadas.

## 7. Notion opcional, posterior al núcleo

- [ ] 7.1 Decidir antes del cierre de funciones si la extensión cabe después de validar núcleo, evaluación y preparación de entrega; verificar que la decisión y su motivo quedan documentados y que no desplaza ninguna dependencia esencial.
- [ ] 7.2 Resolver la rama elegida: si se activa, implementar y comprobar guardado manual real, enlace, deduplicación por ID, contexto completo y error sin pérdida local; si se difiere, comprobar que queda pendiente y la demo no simula guardados. Registrar cuál de las dos ramas se completó, sin afirmar que Notion está implementado cuando se difiere.

## 8. Cierre y paquete final — integrante 4 con el equipo

- [ ] 8.1 Congelar versión y respaldo permitido de ejecuciones reales tras cerrar el núcleo y resolver si Notion se implementó o difirió; comprobar fecha, cobertura, versiones y revisión, y que después solo quedan correcciones necesarias para ejecutar o entregar.
- [ ] 8.2 Verificar repositorio público sin secretos, URL protegida, acceso con credencial compartida y paquete preparado según condiciones finales de envío; dejar al equipo responsable el envío y registro de recepción antes del 18 de octubre de 2026 a las 12:00, Colombia. Las 11:00 son objetivo interno propuesto, no un hito ya cumplido.

## Workflow follow-up

- Revisar artefactos y evidencias de implementación antes de sincronizar o archivar el cambio; no archivar mientras el producto solo esté planificado.
- La evolución predictiva basada en radar_30x_prototype-v2.py se especificará como trabajo futuro; este cambio no ejecuta ni integra ese archivo.
