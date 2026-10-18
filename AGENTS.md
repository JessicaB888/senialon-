# SENIALON

## Fase de trabajo

El usuario autorizó continuar ALG 2.1 y cerrar el acuerdo definitivo del contrato. La fuente única `docs/contracts/openapi.json` está acordada en `1.0.0`, con autoridad BE y política/registro en `docs/contracts/README.md`. La revisión semántica e interfaces están en `docs/REVISION_SEMANTICA_ALG.md` y `docs/INTERFACES_ANALISIS.md`; el consumo documental FE en `docs/REVISION_CONTRATO_FRONTEND.md`. ALG 2.1 y BE 3.1 se cierran documentalmente; G0 contractual queda cerrado. El acuerdo es revisión asistida por Codex a solicitud del usuario, sin atribuir firmas a los otros integrantes ni acreditar integraciones. FE 1.1 sigue pendiente de su segundo hito técnico tras 1.2. La siguiente tarea de construcción es FE 1.2; no se inicia automáticamente por cerrar este acuerdo. No ejecutar el prototipo ni reintentar la instalación cancelada de validadores.

## Contexto del producto

El borrador competidor incorporado en `ae6b1a0` se retiró del árbol activo. `openspec/contract/README.md` registra su recuperación desde Git y la conciliación de transporte; no es otro contrato. No restaurar dos fuentes simultáneas ni atribuir al antecedente inválido las validaciones del contrato actual. Las revisiones ALG/FE especifican versión, hash y alcance. BE 3.2 sigue pendiente antes de cualquier prueba pagada y BE 3.10 controla cada consumo de la aplicación; el acuerdo contractual no cierra accesos, gasto, persistencia o despliegue.

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
