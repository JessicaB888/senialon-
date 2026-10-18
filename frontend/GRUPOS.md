# Inspección y confirmación de grupos — avance FE 1.5

Interfaz local sobre el contrato **1.0.0**, sin cambiar su versión o hash. **FE 1.5 permanece abierta:** los grupos de ALG 2.3/2.4, su exposición por BE 3.11 y la confirmación persistida de BE 3.12 todavía no están disponibles. El backend real solo ofrece metadatos; no se incorporó un reemplazo de datos a producto o demo.

## Recorrido preparado

Dentro de una ejecución recuperada, «Consultar grupos» realiza una lectura explícita. Muestra estado/motivo, fecha de consulta y creación, versión, temas y variantes, asignaciones principales, secundarios sin conteo y pendientes. Permite inspeccionar la evidencia de equivalencia y de cada asignación, su texto o dimensión audiovisual, fuente y fecha. Una observación audiovisual enlaza también el video desde el segundo informado. La procedencia conserva criterios y uso de modelo recibidos; no se deducen transcripciones o modelos.

«Confirmar esta versión» envía únicamente `expected_run_revision`, `groups_id` y `groups_version`, con una clave de idempotencia. No hay edición de pertinencia, grupos o asignaciones. Un HTTP 200 solo acredita éxito si la respuesta canónica corresponde a esos IDs/versiones y contiene la confirmación registrada. Después se consulta el contexto actual; **confirmar no calcula la comparación ni aprueba una oportunidad editorial**.

Si falta propuesta, muestra etapa y motivo, sin fabricar grupos vacíos. Si falla una lectura, conserva la propuesta anterior identificada y bloquea su confirmación. Un conflicto exige recuperar contexto y consultar explícitamente la nueva propuesta antes de otra confirmación.

## Consumo, protección y recuperación

`readGroupsAction` y `confirmGroupsAction` reutilizan el transporte y las guardas del BFF. La primera usa `getGroups`; la segunda, `confirmGroups`. Cada llamada comprueba Basic independientemente, y la mutación comprueba además Origin, cuerpo y clave. El validador canónico permanece `server-only`. Se verifican las relaciones entre ejecución, temas, asignaciones, evidencias y confirmación; React comprueba el contexto recibido sin recalcular ventanas o clasificaciones. Los enlaces de evidencia admiten HTTPS sin credenciales; el texto se presenta escapado.

El recibo local compartido de FE 1.4 admite ahora `confirm_groups`: conserva clave, ejecución/revisión y propuesta/versión exactas, sin resultados o credenciales. Si se pierde la respuesta, queda pendiente y se consulta el servidor. Recuperar esa misma versión confirmada permite conciliar el recibo por GET; no se repite el POST automáticamente. Cuando existe ID de operación, se consulta también su estado. Un reenvío manual conserva cuerpo y clave y requiere la política permitida después de la lectura; un resultado incierto queda bloqueado para conciliación.

No se añadieron dependencias, variables, conexiones de BD, proveedores o infraestructura. Se conserva el mundo visual de `DESIGN.md`, con detalles nativos para evidencia y procedencia y adaptación a 320 px.

## Verificación y límites

- **386 Vitest aprobadas**, incluidas 30 nuevas de grupos: acceso independiente, origen, contrato de petición, identidades/versiones, respuesta sin confirmación, evidencia ajena, transporte y recibos.
- **74 ejemplos canónicos tipados**, TypeScript, ESLint, Prettier y build aprobados. Sin marcadores privados sintéticos en logs o 14 artefactos cliente.
- Primera pasada del navegador: **19/21 aprobadas** —12 de ejecuciones y 7 de grupos— contra Next de producción y un servidor HTTP **sintético exclusivo de pruebas**. No acredita persistencia o inferencia auténtica.
- Los otros dos casos fallaron por un selector que apuntaba a evidencia plegada y por un HTTP 503 del harness donde el contrato exige 409. Se corrigieron ambos archivos de prueba; **su repetición no se ejecutó porque la solicitud de aprobación fue rechazada**. No se contabilizan como aprobados.
- Capturas de la primera pasada: escritorio 1440×1000 y móvil 390×844, con comprobación de no desbordamiento global a 320 px. Detector de componentes/CSS sin hallazgos. El registro de revisión visual y sus pendientes están en [verification/groups-local.json](verification/groups-local.json).

La suite sintética se describe en [EJECUCIONES.md](EJECUCIONES.md). El comando concreto pendiente, desde `frontend/`, es:

```sh
npx playwright test --config playwright.runs.config.ts tests/runs-e2e/groups.spec.ts
```

La repetición solicitada fue rechazada; este documento no concede autorización para ejecutarla ni acredita su resultado. El cierre requiere además grupos auténticos, confirmación atómica recuperable tras reinicio, integración protegida y despliegue. Las casillas FE 1.4/1.5/1.10 siguen abiertas.
