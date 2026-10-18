# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Frontend confirmado por el usuario: el mismo stack de personal-finance-assistant, verificado como Next.js 16.3.3 con App Router, React/React DOM 19.3.0, TypeScript 5.9.3 y npm; Node.js >=24.21.0 y <25. Python para análisis y Vercel para despliegue también están confirmados.

FastAPI, PostgreSQL en Supabase Free y dos servicios conectados en Vercel son la arquitectura propuesta, todavía sin implementar ni probar. Ver [diseño técnico](openspec/changes/definir-mvp-senialon/design.md). Reutilizar el stack no implica copiar código ni la identidad visual del proyecto financiero.

## Users

Una persona opera la aplicación durante la demo: ejecuta la recolección, confirma grupos temáticos, selecciona publicaciones y revisa oportunidades editoriales. Las personas con la credencial compartida acceden al mismo espacio; no hay identidades individuales.

Los líderes y equipos de LatAm que aprenden o aplican IA constituyen el contexto editorial del contenido. Esto no demuestra la ubicación ni los cargos de los espectadores de YouTube.

## Product Purpose

Convertir publicaciones públicas de YouTube en oportunidades de contenido con evidencia verificable. Separar el cambio temático observado, las métricas originales, el aporte para la audiencia y la afinidad editorial; explicar posibles mecanismos del contenido como hipótesis revisables.

## Positioning

SENIALON conecta una comparación de publicaciones por tema dentro de un corpus declarado con análisis audiovisual de piezas elegidas, evaluación con JEV y propuestas de adaptación. No promete causalidad, viralidad ni predicción de tendencias.

## Operating Context

El recorrido comprende adquisición y cobertura, grupos propuestos, confirmación, comparación temática, selección libre de piezas elegibles, análisis profundo y revisión editorial recuperable. La selección no depende de que aumente el tema ni de que la comparación esté completa.

La entrega prevista es el 18 de octubre de 2026 antes de las 12:00, America/Bogota. El equipo confirmó tres integrantes: Frontend, Algoritmia/JEV y Backend/infraestructura, con tareas de dueño único en el [plan de trabajo](docs/PLAN_DE_TRABAJO.md). El usuario asume Frontend, cuyo orden está en [PLAN_FRONTEND.md](docs/PLAN_FRONTEND.md); las identidades nominales de los otros integrantes, la experiencia y las horas disponibles siguen sin confirmar. El presupuesto es de 20 USD de nuevos consumos; la suscripción activa de Vercel está pagada aparte.

## Capabilities and Constraints

- Corpus fijo de once canales de la [definición del MVP](docs/DEFINICION_MVP.md); videos públicos de hasta 180 segundos, con IA central o una aplicación concreta. Duración corta no acredita por sí sola que sean Shorts.
- Últimos siete días completos frente a los siete anteriores, con corte en America/Bogota y exclusión del día en curso.
- Grupos propuestos usando ambas ventanas y confirmados antes del cálculo. Un tema principal por video; secundarios visibles sin contar. Sin edición manual de las clasificaciones en la demo.
- Señales descriptivas de publicaciones por tema. Desconocido no equivale a cero; una base cero conocida no admite porcentaje. Cobertura parcial mantiene pendiente la comparación completa del corpus.
- Análisis audiovisual solamente de las piezas elegidas. Formato, evidencia temporal, valor, afinidad, hipótesis y adaptación tienen estados independientes.
- JEV decide pertinencia IA, valor y afinidad por persona, contexto empresarial y pilar. Valor: aporte respaldado, utilidad no sustentada o información insuficiente.
- Pilares: ROI y costos de IA, automatización comercial con IA, eficiencia operativa con IA y liderazgo aplicado a IA; también otro pertinente e información insuficiente.
- URL desplegada, credencial compartida para toda la aplicación y persistencia duradera. HTTP Basic es el mecanismo técnico propuesto; no hay un login propio confirmado.
- Notion es una extensión manual opcional de última prioridad. El prototipo predictivo aportado queda fuera del MVP, sin ejecutar ni validar.
- No se ha implementado código del producto. Las capacidades se formalizan en las [specs del cambio](openspec/changes/definir-mvp-senialon/proposal.md).

## Brand Commitments

Nombre: **SENIALON**. Logos vigentes: variantes Fluido clara, oscura e ícono en [branding](branding/). El usuario confirmó conservar esos logos y su naranja, adaptando de [prismaBrand.md](branding/prismaBrand.md) la tipografía, el rigor y la estructura.

El prisma describe otra marca, Corefex. Sus razones sociales, contratos, lemas, cifras, umbrales y reglas técnicas no se trasladan a SENIALON. La identidad visual adaptada se especifica en [DESIGN.md](DESIGN.md).

## Evidence on Hand

Existen documentos del reto, definición del MVP, plan de trabajo, investigación, prototipo externo de referencia, seis specs y archivos PNG de branding. No existen resultados de análisis de SENIALON, métricas de precisión ni integraciones probadas que puedan usarse como evidencia del producto.

## Product Principles

- Conservar la procedencia y el contexto de cada resultado.
- Distinguir lo observado, lo inferido, lo sugerido y lo pendiente.
- Mantener el criterio editorial humano y recuperar decisiones guardadas.
- Comunicar la cobertura real, incluidos fallos y datos insuficientes.
- Preservar el recorrido esencial antes de ampliar integraciones.
