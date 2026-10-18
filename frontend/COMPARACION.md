# FE1.6 · Comparación temática

Extensión del frontend implementada y revisada localmente. El cierre integrado sigue pendiente: la evidencia descrita aquí no valida APIs reales, la base del equipo ni Vercel. El backend y el contrato OpenAPI no cambiaron.

## Acceso y flujo

Seleccionar una ejecución y seguir el enlace `#comparacion`. La sección ofrece dos acciones separadas:

- **Consultar comparación** recupera mediante GET la ejecución, sus grupos y la comparación guardada. Consultar y confirmar grupos no solicitan cálculos.
- **Calcular comparación** solicita explícitamente `POST /runs/{run_id}/advance`, con `expected_run_revision` y `target: { scope: "comparison" }`.

El cálculo requiere grupos confirmados, etapa de grupos completa, confirmación coincidente y `advance_comparison` en `allowed_actions`; la comparación debe estar `not_requested` y no debe haber operaciones por inspeccionar. Una lectura obsoleta, otra solicitud pendiente o un fallo del almacenamiento local bloquean nuevos cálculos. El resultado mostrado procede del servidor; React no recalcula conteos, diferencias ni porcentajes.

## Presentación y respaldo

La tabla conserva el patrón de **Topic comparison** de `DESIGN.md`: tema principal, semana anterior y reciente, diferencia, variación y señal. Sus encabezados muestran fechas reales con límites inclusivo/exclusivo, zona horaria y exclusión del día en curso.

- Con cobertura completa, los valores y la señal se presentan como llegan del contrato.
- Una base conocida de cero muestra «No aplicable» y el motivo, sin porcentaje. «Nuevo en el corpus» depende de la señal recibida; dos ceros conocidos no constituyen novedad.
- Con cobertura parcial, diferencia y variación muestran «Pendiente» y la señal es «Comparación completa pendiente»; no se afirma crecimiento ni novedad del corpus completo.
- Un conteo desconocido conserva «Desconocido», cantidad observada y motivo. Desconocido no equivale a cero; la ausencia de señales tampoco acredita ausencia de publicaciones.
- Cada fila permite desplegar publicaciones y aporte por canal para ambas semanas, con enlaces al canal y a YouTube. Cada ID contribuye solo al tema principal; los secundarios no suman.
- El contexto desplegable identifica ejecución, grupos y versión, confirmación, revisión, fecha de cálculo y consulta. Las limitaciones que afectan la lectura permanecen visibles.

La señal describe publicaciones observadas. Un aumento no demuestra crecimiento de audiencia, viralidad, causalidad ni valor editorial.

## Coherencia y entrega

`comparison-actions.ts` reúne Run, Groups y Comparison en el servidor. `validation.ts` comprueba identidad de ejecución, ventanas y zona horaria, grupos y versión, confirmación, revisión y fecha de cálculo. También verifica temas, procedencia por canal y pertenencia de los IDs, sin duplicados entre temas o ventanas. La respuesta de avance debe corresponder a la ejecución y etapa de comparación; el panel comprueba además grupos y versión de entrada.

El recibo `compare` en `localStorage` conserva solo metadatos de entrega: clave, fecha, ejecución, revisión, grupos, versión, confirmación y operación. No almacena el resultado como autoridad ni provoca reenvíos automáticos.

Tras una respuesta sin confirmar, **Consultar comparación** recupera estado y operación. El reenvío manual conserva la misma solicitud y solo se ofrece después de leer una operación `failed` o `blocked` con `retry_policy: same_request_after_status_read`, identidad coincidente y contexto vigente. Un estado `uncertain` exige conciliación manual. Una operación exitosa confirmada libera el recibo y conserva el resultado recibido. Los errores mantienen la lectura anterior con aviso de obsolescencia.

## Sistema visual conservado

La extensión reutiliza los tokens semánticos de color, espaciado y texto, además de los botones y avisos existentes. La jerarquía usa texto pequeño para metadatos, peso 600 para encabezados y cifras tabulares alineadas a la derecha. Bordes y fondo elevado del encabezado separan la tabla; no se incorpora una nueva escala visual.

La tabla tiene ancho mínimo de `58rem` y desplazamiento horizontal dentro de una región enfocable con instrucciones. A `767px` o menos, acciones ocupan el ancho disponible y respaldo/contexto pasan a una columna. Los desplegables y enlaces de respaldo tienen altura mínima de `44px`; los mensajes de actividad usan `aria-live="polite"` y los enlaces externos anuncian la apertura de otra pestaña.

## Evidencia local de la revisión

Resultados comprobados durante la revisión de FE1.6 y registrados aquí sin volver a ejecutar comandos:

- **Vitest:** 431 pruebas totales aprobadas, 45 nuevas.
- **Playwright FE1.6:** 8 pruebas nuevas aprobadas con servidor sintético en puertos `3350/3351`. No se reejecutaron los E2E anteriores rechazados; esta evidencia no los cubre.
- **Verificación técnica:** typecheck, lint, formato, comprobación de contrato y build aprobados; 14 artefactos cliente sin marcadores privados de prueba.
- **Revisión visual:** capturas `/private/tmp/senialon-fe16-visual/desktop.png` y `/private/tmp/senialon-fe16-visual/mobile.png`; revisión externa de cinco secciones completada sin correcciones materiales. Detector: `[]` en una sola ejecución.
- **Contrato intacto:** OpenAPI `1.0.0`, SHA-256 `d7e0b018263658e686da00997ddffbd19ba96e6e73de5b08e3f8917b95375956`.

Comandos reproducibles desde `frontend/`:

```sh
npm test -- tests/comparison.test.ts
npm run typecheck
npm run lint
npm run format:check
npm run contract:check
npm run test:e2e:comparison
```

`test:e2e:comparison` usa su configuración exclusiva y el prehook `pretest:e2e:comparison` prepara un build controlado. Estas pruebas locales no sustituyen la comprobación integrada pendiente con servicios reales y despliegue.

Esta guía registra una extensión ordinaria del sistema existente. No canoniza resultados sintéticos como comportamiento validado en producción ni actualiza `DESIGN.md`, `PRODUCT.md` o `.impeccable/design.json`.
