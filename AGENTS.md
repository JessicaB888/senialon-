# SENIALON

## Fase de trabajo

El usuario autorizó implementar FE 1.2 y BE 3.2. La base Next.js y su entrega a BE están en `frontend/README.md`; las verificaciones locales en `frontend/VERIFICACION.md`. Se aplicó Next.js 16.3.8 como parche de seguridad de la referencia 16.3.3. El control offline y el registro de gasto están en `docs/budget/README.md`: BE 3.2 conserva pendiente la verificación de cargos previos, modelos, saldos y mínimos de cuenta, con consumos pagados bloqueados. No desplegar la base sin completar FE 1.3/BE 3.6.

El usuario autorizó después continuar con la siguiente tarea recomendada, FE 1.1. Ambos hitos están completos: revisión documental y tipos/validación locales en `frontend/CONTRATO_API.md`, con 250 pruebas Vitest y 74 ejemplos canónicos comprobados estáticamente. La fuente única `docs/contracts/openapi.json` conserva versión `1.0.0` y hash; los archivos de `frontend/src/lib/api/generated/` son derivados regenerables, nunca otra autoridad. `contract:check` bloquea el build si están desactualizados. No usar casts sobre JSON sin validar ni importar el validador `server-only` desde componentes cliente.

ALG 2.1 y BE 3.1 siguen cerradas documentalmente y G0 contractual cerrado por revisión asistida solicitada por el usuario, sin firmas atribuidas ni integraciones probadas. La siguiente tarea FE es 1.3, con dependencias BE 3.3/3.6; este cierre no implementa HTTP, autenticación, persistencia o despliegue. No ejecutar el prototipo ni reintentar la instalación cancelada de validadores.

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
