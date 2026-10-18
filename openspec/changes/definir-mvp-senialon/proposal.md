# Proposal

## Why

SENIALON convierte publicaciones públicas de YouTube en oportunidades editoriales con evidencia de cambio temático, utilidad y patrones observables. El MVP necesita un contrato verificable que separe esas dimensiones y permita entregar una demo real sin atribuir capacidad predictiva al prototipo aportado.

## What Changes

- Recolectar automáticamente videos públicos de hasta 180 segundos del corpus fijo de 11 canales; incluir solo IA central o una aplicación concreta, con faltantes y condición de candidato corto/Short explícitos.
- Usar America/Bogota, UTC−5, para comparar los últimos 7 días completos con los 7 anteriores, excluyendo el día actual.
- Proponer grupos temáticos automáticamente usando ambas ventanas y requerir confirmación del operador antes del cálculo. Un video cuenta solamente en su tema principal; los secundarios quedan visibles sin sumarse.
- Detectar cambios descriptivos únicamente por tema. El formato se observa en las piezas elegidas para análisis profundo y no genera una comparación semanal obligatoria.
- Mostrar conteos, diferencia y porcentaje con base positiva evaluable. Base cero conocida y reciente positiva: «nuevo en el corpus», sin porcentaje. Cobertura parcial no equivale a cero ni a comparación completa.
- Permitir que el operador elija cualquier pieza elegible, incluso sin crecimiento, para observar gancho, formato, estructura, valor y adaptación con evidencia temporal.
- Exigir decisiones reales de JEV sobre pertinencia IA, valor y afinidad por persona, contexto empresarial y pilar. Valor: aporte respaldado / utilidad no sustentada / información insuficiente.
- Usar los pilares aprobados: ROI y costos de IA, automatización comercial con IA, eficiencia operativa con IA y liderazgo aplicado a IA; añadir otro pertinente e información insuficiente.
- Mantener confirmación de grupos y revisión editorial humana; no ofrecer edición manual de pertinencia o asignación temática en la demo.
- Desplegar una URL en Vercel con acceso a toda la aplicación mediante una credencial de demo compartida. Conservar resultados y decisiones tras cerrar el navegador o reiniciar la aplicación.
- Usar para el frontend el stack verificado de personal-finance-assistant: Next.js con App Router, React, TypeScript y npm; mantener el análisis en Python y la identidad visual de SENIALON.
- Aceptar una demo real de cobertura parcial explícita, dejando pendiente la comparación completa de los 11 canales. No simular datos ni decisiones para completar el recorrido.
- Limitar los nuevos consumos de la demo a 20 USD; el plan de pago de Vercel ya está activo y pagado aparte.
- Mantener Notion como guardado manual opcional de última prioridad, posterior al núcleo, evaluación y entrega.

## Capabilities

### New Capabilities

- `youtube-corpus`: fuentes fijas, adquisición automática, elegibilidad, procedencia, deduplicación y cobertura por etapa. [Spec](specs/youtube-corpus/spec.md).
- `content-classification`: pertinencia IA con JEV, grupos automáticos de ambas ventanas confirmados antes de comparar, un tema principal y secundarios no contados. [Spec](specs/content-classification/spec.md).
- `publication-signals`: ventanas en Colombia, conteos temáticos trazables, variación y base cero, límites de cobertura y ausencia de predicción. [Spec](specs/publication-signals/spec.md).
- `editorial-analysis`: análisis profundo seleccionado por el operador, formato y evidencia audiovisual, valor de tres resultados, afinidad y adaptación revisable. [Spec](specs/editorial-analysis/spec.md).
- `operator-review`: recorrido web protegido, confirmación de grupos, selección de piezas, revisión y recuperación duradera. [Spec](specs/operator-review/spec.md).
- `notion-export`: extensión opcional con guardado manual, contexto, confirmación real y control de duplicados. [Spec](specs/notion-export/spec.md).

### Modified Capabilities

Ninguna: estas capacidades son nuevas y todavía no se han publicado en openspec/specs/.

## Impact

La fase de especificación revisó las seis specs, la definición del MVP, el plan de trabajo y el contexto de OpenSpec sin desarrollar el producto. Posteriormente, el usuario autorizó FE 1.2/BE 3.2: se preparó la base frontend local y el control offline de presupuesto. No se ejecuta el prototipo aportado ni se configura un servicio de pago con esa implementación.

**Confirmado por el usuario:** frontend con el mismo stack de personal-finance-assistant, Python para el análisis, despliegue en Vercel, credencial compartida, persistencia duradera y presupuesto incremental de 20 USD. La referencia local tiene Next.js 16.3.3, React 19.3.0 y TypeScript 5.9.3 resueltos. FE 1.2 fija Next.js 16.3.8 por seguridad, conservando ese stack; su alcance y verificación local están en [frontend/README.md](../../../frontend/README.md). Gemini y Vercel están declarados configurados; YouTube Data API y JEV todavía no están configurados. Ningún servicio externo ha sido probado desde SENIALON.

**Arquitectura recomendada:** frontend Next.js y backend Python/FastAPI como servicios del mismo proyecto Vercel, con Next.js como entrada pública y Python interno mediante un binding. Ambos verifican el acceso compartido; Python concentra proveedores, PostgreSQL en Supabase Free y procesamiento por pasos con estado persistido. Vercel Services está en beta y su primer despliegue sigue pendiente. El fundamento, alternativas y dependencias están en [design.md](design.md); las actividades aún no realizadas están en [tasks.md](tasks.md).

La primera etapa de ejecución debe habilitar YouTube y JEV, configurar persistencia y verificar una ruta real con los accesos del equipo. La cuota, inventario de canales, calidad audiovisual, costos y latencias no están medidos. No se garantiza el costo final a partir de precios de catálogo; deben comprobarse límites y consumos efectivos antes de ampliar el procesamiento.

Se mantienen fuera del MVP predicción, Kleinberg obligatorio, crecimiento de audiencia, fases de saturación, puntuaciones compuestas, ingesta multirred, edición manual de clasificaciones y distribución por Gmail/Slack/Aply. El archivo radar_30x_prototype-v2.py queda como base candidata para una futura capa predictiva por validar.

El corpus y antecedentes están en [DEFINICION_MVP.md](../../../docs/DEFINICION_MVP.md). La fecha oficial permanece: 18 de octubre de 2026 antes de las 12:00, hora de Colombia. El usuario confirmó tres integrantes y tres áreas: Frontend, Algoritmia/JEV y Backend/infraestructura. Las tareas se redistribuyen con dueño único y contratos explícitos; no se amplía el producto ni se inventan nombres, experiencia u horas disponibles.
