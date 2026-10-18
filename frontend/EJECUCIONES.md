# Ejecuciones y cobertura — FE 1.4

Implementación frontend local, 18 de octubre de 2026, America/Bogota. La interfaz consume el contrato acordado **1.0.0**; su fuente y hash se conservan. **FE 1.4 sigue abierta** hasta comprobar las operaciones, persistencia y recuperación reales entregadas por BE/ALG. El backend actual solo ofrece metadatos: la consulta de ejecuciones devuelve un 404 contractual y la pantalla informa que el servicio no está disponible, sin presentar un historial vacío como consulta exitosa.

## Recorrido implementado

- Consulta inicial de ejecuciones guardadas, en el orden del servidor, con paginación mediante su cursor opaco. Solo una respuesta válida con `items: []` acredita un listado vacío. Si cambia el snapshot o falla una página, conserva lo recibido y pide actualizar antes de mezclar resultados.
- Recuperación de la ejecución seleccionada mediante `/?run=<run_id>`. Sin selección explícita, abre la primera ejecución devuelta. La etiqueta «Ejecución anterior» y la fecha original identifican lo recuperado; no se crea una ejecución al volver a abrir la aplicación.
- Inicio inclusivo y fin exclusivo de ambas ventanas, fecha original, actualización, revisión, versiones y último paso confirmado. Las fechas recibidas solo se formatean en America/Bogota: FE no calcula ventanas, señales ni porcentajes de avance.
- Tabla de once canales y ambas semanas, con recolección, elegibilidad, pertinencia IA y tema principal inspeccionables. Conserva resolución, paginación, pendientes y fallos. Las publicaciones descubiertas no se presentan como conteo elegible o señal temática: cero observado y desconocido son distintos.
- «Crear ejecución» envía `{}`; el servidor fija corpus y ventanas. No inicia la recolección automáticamente. «Solicitar siguiente paso» envía una unidad de `scope: corpus` con la revisión recibida; confirmar grupos y avanzar la comparación mantienen sus tareas posteriores.
- «Actualizar estado», abrir una ejecución, consultar una operación y recargar solo leen. No hay timers, avance automático, porcentajes de progreso, ETA o promesas de ejecución activa al cerrar el navegador.
- Si falla una actualización conserva la última lectura con advertencia. Si solo falla cobertura, permite consultar la última cobertura recibida, identificada como anterior y con su revisión; no la mezcla silenciosamente con la actual.

La tabla mantiene sus tres columnas en un contenedor desplazable por teclado y en móvil, con instrucción visible y nombre accesible. Las acciones llevan estado de proceso, bloquean doble envío local y anuncian resultados mediante regiones de estado/alerta. Las nuevas clasificaciones no se editan manualmente.

## Consumo y protección

Los Server Components leen y los controles llaman Server Actions tipadas. **Cada llamada** se despacha por `handleApiRequest`, la misma guarda y validación del BFF de FE 1.3, y cruza el validador canónico antes de entregar datos a React. Las acciones comprueban Basic de forma independiente; crear/avanzar verifican además el Origin original, el cuerpo y la idempotencia. La guarda de página sigue activa. No se importan validadores o secretos en componentes cliente.

El Request interno usa un host reservado únicamente para resolver la ruta en memoria; no realiza HTTP a ese host. El único destino HTTP sigue siendo el binding `SENIALON_BACKEND_URL` del servidor. El transporte conserva timeout, ausencia de reintentos automáticos, respuestas privadas y tratamiento seguro de errores de FE 1.3. No hay variables, paquetes, proveedores o conexiones de base de datos nuevos.

| Operación canónica | Uso en la interfaz                                                                        |
| ------------------ | ----------------------------------------------------------------------------------------- |
| `listRuns`         | Historial, cursor y recuperación tras perder una creación.                                |
| `getRun`           | Estado, permisos, versiones, checkpoint y referencias a operaciones.                      |
| `getCoverage`      | Cobertura de la misma ejecución/revisión.                                                 |
| `createRun`        | Crear una ejecución por acción explícita.                                                 |
| `advanceRun`       | Una unidad del corpus con `expected_run_revision` y la misma clave para el mismo intento. |
| `getOperation`     | Recuperar el estado persistido, incluso sin checkpoint o respuesta POST recibida.         |

Además de validar la estructura canónica, FE comprueba los IDs relacionados, corpus exacto, fuentes/celdas únicas y coincidencia de revisión. Una respuesta mezclada conserva su limitación y no se presenta como cobertura vigente.

## Recuperación de solicitudes

`Run.operations_to_inspect` es la fuente de recuperación de operaciones en otro navegador. Incluye las de piezas seleccionadas y no requiere que el navegador conserve el ID de una respuesta anterior. El detalle muestra estado, motivo, revisión, checkpoint y política de reintento sin resolver ni liberar reservas desde una lectura.

El navegador conserva únicamente un recibo versionado en `senialon:command:v1`: clave, tipo, fecha, ejecución/revisión cuando corresponda e ID de operación si se obtuvo. **No guarda credenciales, resultados o presupuesto.** Si no puede recuperar ese recibo, permite lecturas y detiene nuevas solicitudes. Una pestaña no sobrescribe intencionalmente un recibo pendiente; la exclusión entre solicitudes/equipos y el gasto siguen siendo autoridad de BE 3.10.

No hay reenvío automático. «Reenviar la misma solicitud» aparece únicamente tras consultar por GET la operación exacta del recibo, recibir `same_request_after_status_read` y un estado fallido/bloqueado. Conserva clave, cuerpo y revisión original. Una operación incierta exige conciliación; una respuesta perdida sin identidad recuperable conserva el recibo y no autoriza otro consumo. Una creación sin confirmación pide revisar el historial y, si no puede conciliarse, mantiene el bloqueo. No se añadió una operación de conciliación fuera del contrato.

## Verificación reproducible

Desde `frontend/`, con el entorno de [ACCESO.md](ACCESO.md):

```sh
npm test
npm run test:types
npm run typecheck
npm run lint
npm run format:check
npm run test:e2e
npm run test:e2e:runs
```

Las suites E2E preparan un build con credenciales sintéticas y comprueban su separación de logs/assets. La suite existente usa **Next y FastAPI reales en 127.0.0.1:3300/3301**. La nueva suite usa **Next de producción y un servidor HTTP de fixtures en 127.0.0.1:3340/3341**, exclusivamente para estados de dominio aún no disponibles. El servidor sintético exige `SENIALON_SYNTHETIC_TEST_ONLY=1`, se inicia solo mediante la configuración de pruebas y no contiene clientes de proveedores ni persistencia. Nunca forma parte del producto o de una demo real.

Los escenarios verifican canales/ventanas, creación sin avance, lectura sin nuevo POST, recuperación desde otro navegador sin checkpoint, incertidumbre, clave/cuerpo estables al reenviar manualmente, respuesta perdida, conservación ante fallo y paginación. La revisión visual utiliza escenarios rotulados como sintéticos, en escritorio y móvil, y comprueba que a 320 px el desplazamiento se limite a la tabla. Estas pruebas no acreditan Supabase, adquisiciones, JEV/Gemini, gasto real o despliegue.

## Entrega y pendientes para cerrar

Evidencia local: **356 pruebas Vitest**, **74 ejemplos tipados**, **9 E2E con FastAPI real** y **12 E2E con escenarios de dominio sintéticos** aprobados. Build, TypeScript, ESLint, separación de marcadores privados en logs/14 assets cliente y OpenSpec estricto aprobados. Detector visual sin hallazgos; los dos ajustes de revisión visual quedaron resueltos. [Registro de verificación](verification/runs-local.json).

1. **ALG 2.2 entregada:** [función única de ventanas](../backend/analysis/README.md) implementada y probada. BE debe integrarla y persistir sus fronteras al crear la ejecución; FE muestra las recibidas, sin recalcularlas. El registro local de FE 1.4 conserva el estado anterior a esta entrega.
2. **BE 3.5, 3.9, 3.10 y 3.11:** entregar persistencia, cobertura, pasos/reclamaciones/reservas y las seis operaciones anteriores. Conservar los once canales, 22 celdas, versiones, errores y referencias recuperables a operaciones.
3. **BE 3.3/3.6 y FE 1.3:** completar proyecto, límites, credencial y despliegue protegido.
4. Comprobar el recorrido con datos auténticos, recuperación tras cerrar navegador y reiniciar servicios, y acceso desde otro equipo. Hasta entonces no marcar FE 1.4 ni FE 1.10 completas.

No se modificaron backend, análisis, contrato canónico o infraestructura. La cuenta de presupuesto y las pruebas pagadas conservan sus pendientes de BE 3.2/3.10. Notion no forma parte de esta entrega.
