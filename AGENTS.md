# SENIALON

## Fase de trabajo

El usuario autorizó preparar el borrador BE 3.1 y después continuar específicamente con FE 1.1 documental. La revisión está emitida con observaciones en `docs/REVISION_CONTRATO_FRONTEND.md`: H01–H03 pendientes y pauta histórica H04; no hay conformidad final, aprobación ALG 2.1 o cierre de G0. El contrato único sigue en `docs/contracts/openapi.json`, con autoridad BE y política en `docs/contracts/README.md`. El alcance de la última confirmación no autoriza iniciar automáticamente Next.js 1.2, implementar el resto del backend ni reintentar la instalación cancelada de validadores. No ejecutar el prototipo ni modificar el contrato bajo la revisión FE. La configuración y las proyecciones temporales de tipos/modelos no completan el segundo hito técnico de FE 1.1.

## Contexto del producto

La sincronización de main incorporó `ae6b1a0` con otro borrador en `openspec/contract/backend-contract-openapi.json`, preservado sin cambios y pendiente de corregir sintaxis JSON y conciliar por BE. No usar ambos contratos como fuentes simultáneas ni atribuir al remoto las validaciones de `docs/contracts/openapi.json`. La revisión FE especifica su hash y alcance; no hay acuerdo de G0.

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
