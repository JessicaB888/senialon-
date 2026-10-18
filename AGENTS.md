# SENIALON

## Fase de trabajo

El usuario autorizó implementar FE 1.2 y BE 3.2. La base Next.js y su entrega a BE están en `frontend/README.md`; las verificaciones locales en `frontend/VERIFICACION.md`. Se aplicó Next.js 16.3.8 como parche de seguridad de la referencia 16.3.3. El control offline y el registro de gasto están en `docs/budget/README.md`: BE 3.2 conserva pendiente la verificación de cargos previos, modelos, saldos y mínimos de cuenta, con consumos pagados bloqueados. No desplegar la base sin completar FE 1.3/BE 3.6.

El usuario autorizó después continuar con la siguiente tarea recomendada, FE 1.1. Ambos hitos están completos: revisión documental y tipos/validación locales en `frontend/CONTRATO_API.md`, con 250 pruebas Vitest y 74 ejemplos canónicos comprobados estáticamente. La fuente única `docs/contracts/openapi.json` conserva versión `1.0.0` y hash; los archivos de `frontend/src/lib/api/generated/` son derivados regenerables, nunca otra autoridad. `contract:check` bloquea el build si están desactualizados. No usar casts sobre JSON sin validar ni importar el validador `server-only` desde componentes cliente.

ALG 2.1 y BE 3.1 siguen cerradas documentalmente y G0 contractual cerrado por revisión asistida solicitada por el usuario, sin firmas atribuidas ni integraciones probadas. La siguiente tarea FE es 1.3, con dependencias BE 3.3/3.6; este cierre no implementa HTTP, autenticación, persistencia o despliegue. No ejecutar el prototipo ni reintentar la instalación cancelada de validadores.

El usuario autorizó después avanzar con el backend necesario para desbloquear FE. BE 3.3 tiene base Python 3.12/FastAPI, `GET /api/v1/meta`, guard de acceso/origen y `vercel.json` con Next como única entrada pública y binding `SENIALON_BACKEND_URL`. Se verificaron 52 pruebas backend, cuatro lecturas contractuales por binding real en `vercel dev -L`, build y 250 pruebas frontend. Ver `backend/README.md` y `backend/VERIFICACION.md`. El smoke parte del proceso Node local, no de un Route Handler ni funciones desplegadas. FE 1.3 puede iniciarse localmente; su protección de páginas/rutas sigue pendiente. BE 3.3 permanece abierta por proyecto/equipo, límites/costos efectivos y primer despliegue protegido. BE 3.6 tiene guard adelantado, sin cierre de su entrega conjunta. No publicar la base desprotegida ni consumir proveedores de pago; no hay persistencia o análisis implementados.

Autorización posterior: continuar FE 1.3. Acceso compartido y BFF implementados en `frontend/`, con guardas independientes en proxy, páginas y Route Handlers, requests/respuestas derivados de 1.0.0 y lectura real de FastAPI por binding. Evidencia en `frontend/ACCESO.md`: 326 Vitest, 9 Playwright de producción local, separación de secretos en build/logs y 6 comprobaciones de `vercel dev -L`. `authInterrupts` de Next es experimental y se usa en la guarda de páginas; no llamar a `unauthorized()` desde el root layout. No se implementaron pantallas/operaciones de datos ni Notion. El usuario confirmó que aún no existe proyecto Vercel; FE 1.3 conserva pendiente su cierre con despliegue protegido y BE 3.3/3.6. No confundir la credencial sintética de pruebas con una credencial real de demo ni publicar valores. Los scripts E2E solo usan loopback y no aceptan destinos remotos.

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
