# SENIALON

## Fase de trabajo

El trabajo actual consiste en definir el producto y generar sus especificaciones con OpenSpec. No desarrollar código del producto antes de contar con las especificaciones. La configuración de herramientas no equivale a iniciar implementación.

## Contexto del producto

Leer `docs/DEFINICION_MVP.md`, `docs/PLAN_DE_TRABAJO.md` y `openspec/config.yaml`. Distinguir las decisiones confirmadas de las propuestas y preguntas pendientes. No inventar datos, accesos, métricas ni tendencias.

SENIALON separa desempeño observado, valor para la audiencia y relación con tendencias documentadas. LatAm es el mercado editorial; cada fuente conserva su cobertura real. Notion permanece como última prioridad opcional.

## OpenSpec

- Usar las skills oficiales en `.agents/skills/openspec-*` y leer el `SKILL.md` correspondiente antes de ejecutar un flujo.
- Redactar en español conservando los encabezados estructurales y palabras normativas requeridos por OpenSpec.
- Mantener antecedentes de producto en `docs/`; los artefactos formales se crearán en `openspec/` mediante el flujo elegido.
- La instalación por sí sola no crea ni aprueba propuestas, especificaciones o tareas de implementación.

## Entorno de ejecución

OpenSpec 1.14.3 está instalado como herramienta global. Requiere Node.js 20.19.0 o posterior; no determina el stack del producto.

En la máquina donde se configuró, el Node global presenta un error de biblioteca. El CLI se verificó con Node 24.19.0 disponible en `$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin`. Si el Node habitual falla y existe ese runtime, verificar su versión y anteponer ese directorio al `PATH` de la sesión para ejecutar OpenSpec. En otros equipos, usar una instalación válida de Node que cumpla el requisito.
