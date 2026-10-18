# Integración de JEV desde senialon-compatible

Integración local del 18 de octubre de 2026 sobre `ab05029`. La carpeta fuente no contiene `.git`: se conciliaron sus componentes con el proyecto vigente, sin atribuirle un merge de historiales. Se conservó la rama `codex/before-jev-integration-20261018` como referencia anterior a los cambios.

## Componentes incorporados y conflictos resueltos

| Diferencia                                                    | Resolución                                                                                                                                                    |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Frontend alternativo, autenticación y dependencias diferentes | Se conserva íntegro el frontend vigente de SENIALON, con sus guardas, BFF, estilos, acciones, tipos y pruebas. No se reemplazan por el dashboard alternativo. |
| Contrato de la copia con distinto hash                        | JSON equivalente al contrato acordado; se conserva byte por byte la fuente 1.0.0 vigente y sus derivados frontend.                                            |
| Segundo cálculo de ventanas y comparación                     | La nueva orquestación delega a ALG 2.2/2.5/2.6 existentes. No se reemplazan sus implementaciones o pruebas.                                                   |
| `backend/app` frente a `backend/senialon_api`                 | Persistencia y operaciones se adaptan a `senialon_api`; se conservan la entrada `main:app`, la configuración de acceso y las guardas originales.              |
| Cliente HTTP adicional                                        | Los adaptadores específicos usan `JsonHttpTransport` con un gate de reserva PostgreSQL. No hay bypass del transporte existente.                               |
| Prompts y reglas analíticas dentro del backend operativo      | Se trasladan a `analysis/inference.py` y `analysis/criteria.py`. BE inyecta proveedor, tiempo e identidades; ALG no lee HTTP, BD, entorno ni reloj.           |
| Versiones Python antiguas en la copia                         | Se conservan FastAPI/Pydantic/Uvicorn del destino y se agregan únicamente dependencias de persistencia/configuración con lockfile.                            |
| Timeout de proveedor igual al del frontend                    | Cada request se limita a 15 s y una unidad de adquisición hace hasta dos. La duración real en Vercel sigue pendiente de medición.                             |
| Contrato fuera del bundle Python                              | Se genera una proyección desde la fuente única y se incluye en el bundle; se prueba el arranque sin `/docs` ni frontend.                                      |
| Cursores y respuestas JEV mal formados                        | Se rechazan cursores inválidos/consultas duplicadas; una salida JEV inválida conserva la operación incierta y su original sin inventar una decisión.          |
| Claves Google en URLs y modo replay de una ejecución anterior | Las claves viajan por cabecera. El gate bloquea nuevos envíos live/record cuando la configuración vigente es replay.                                          |

Se incorporan las 18 operaciones del contrato: ejecuciones, cobertura, publicaciones, operaciones recuperables, grupos/confirmación, comparación, selección/análisis y revisión. Notion devuelve su indisponibilidad; no se implementa ni simula una exportación.

Las tablas `senialon_v1_*` se crean con una migración inicial explícita y aditiva. Las reservas se bloquean antes del envío; resultados inciertos no se repiten automáticamente ni se liberan por GET. Las revisiones se vinculan a la versión exacta y los snapshots históricos permanecen consultables.

## Preservación

- Carpeta fuente sin modificaciones; no se copiaron `.env`, credenciales, bases, `node_modules`, entornos virtuales o registros privados.
- Frontend, branding, `DESIGN.md`, prototipo, contrato acordado y funciones ALG previamente verificadas conservados.
- Los scripts Windows, el empaquetador, la configuración de despliegue alternativa y la CLI de inspección de la copia no sustituyen el arranque/control de gasto del destino.
- Sin creación de cuentas, acceso a bases del equipo, despliegue o pruebas pagadas. Gemini exige un modelo configurado explícitamente; no se presume uno habilitado.

## Validación

La base previa tenía 191 pruebas Python y 386 de frontend aprobadas. El recorrido incorporado se prueba con proveedores simulados y PostgreSQL temporal por socket, usando esquemas aleatorios aislados: contrato, origen/autenticación, idempotencia, reinicio, snapshots, revisiones obsoletas, respuestas perdidas/inciertas, concurrencia de claves y reservas. También se comprueba el consumo del contrato derivado y el arranque del bundle sin archivos externos.

Resultado final: **328 pruebas Python aprobadas sin omisiones**, incluidas las tres de concurrencia sobre PostgreSQL **17.11** temporal; **386 pruebas Vitest** del frontend aprobadas. TypeScript, ESLint, formato, contrato derivado frontend y OpenSpec estricto aprobados. **93 respuestas calculadas del recorrido FastAPI**, incluidos errores y snapshots, fueron aceptadas por `parseApiResponse` del frontend original con Ajv 2020-12. El contrato, frontend, branding y los archivos de ventanas/conteo/comparación no tienen diferencias respecto a la referencia previa.

Comando de suite Python: `uv run --locked python -B -m pytest -q tests analysis/tests`, con `TEST_DATABASE_URL` apuntando exclusivamente a la base temporal dedicada. El contexto de prueba inyecta transportes simulados y valores de prueba; no se usó una cuenta del equipo. Se conserva la advertencia previa de Starlette/HTTPX de TestClient.

El arranque de un bundle Python aislado sin `/docs` ni frontend pasó. Se mantiene [evidencia resumida](integration/jev-verification.json) y [procedencia de los módulos](integration/jev-source-manifest.json). La base temporal se detiene al finalizar. No se repitieron los E2E previamente rechazados ni se ejecutó un nuevo build de Next: su código y derivados se conservan sin cambios. La comprobación JSON entre runtimes no equivale a una sesión de navegador o un binding desplegado.

Las pruebas sintéticas no acreditan fidelidad audiovisual, calidad de clasificaciones, cuentas habilitadas o costos reales. OpenSpec conserva **7/42 tareas completas**: importar y probar estas partes no cierra los criterios de las tareas que todavía requieren datos, cuentas o despliegue reales.

## Uso y pendientes

Seguir [backend/README.md](../backend/README.md) y completar su plantilla privada. Ejecutar la migración únicamente contra la base dedicada que el equipo decida usar. `PAID_CALLS_ENABLED=false` permanece como valor predeterminado; habilitarlo exige el control previo de BE 3.2 y reservas/tarifas verificadas.

Las operaciones retenidas requieren conciliación administrativa antes de repetir su unidad; no se añade un endpoint ajeno al contrato ni se libera gasto automáticamente. La propuesta temática procesa el material disponible en una unidad: lotes grandes y evaluación real conservan sus pendientes. La aceptación del MVP completo, la UI futura de comparación/fichas y las pruebas reales en Vercel no se cierran por integrar estos módulos.

La transferencia del repositorio y la nueva URL de Vercel siguen siendo acciones separadas pendientes de confirmación. Esta integración no publica ni hace push automáticamente.

## Referencias de compatibilidad

Se contrastaron las interfaces documentadas de [JEV/TypeSafe](https://docs.typesafe.ai/api), [video por URL de Gemini](https://ai.google.dev/gemini-api/docs/video-understanding), [cabecera de API key de Google](https://docs.cloud.google.com/apis/docs/system-parameters) y [configuración por servicio de Vercel](https://vercel.com/docs/services/config-reference). Consultar documentación no acredita acceso operativo a esas cuentas.
