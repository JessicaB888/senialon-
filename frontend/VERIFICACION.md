# Verificación de FE 1.2

**Fecha:** 18 de octubre de 2026, America/Bogota. **Resultado:** base local completa; entrega a BE en [README.md](README.md). Esta evidencia no acredita autenticación, proveedores, persistencia o despliegue.

## Entorno y comprobaciones

| Comprobación            | Resultado                                                                                                       |
| ----------------------- | --------------------------------------------------------------------------------------------------------------- |
| Runtime                 | Node `24.21.0`, npm `11.19.0`; satisface `>=24.21.0 <25`.                                                       |
| Instalación             | `npm ci` reproducida desde el lockfile; dependencias directas fijadas.                                          |
| Versiones               | Next.js / eslint-config-next `16.3.8`, React/React DOM `19.3.0`, TypeScript `5.9.3`.                            |
| TypeScript              | `npm run typecheck` aprobado.                                                                                   |
| ESLint                  | `npm run lint` aprobado.                                                                                        |
| Formato                 | `npm run format:check` aprobado.                                                                                |
| Build                   | `npm run build` aprobado; `/` y la página no encontrada se renderizan por solicitud.                            |
| Arranque                | `npm run start -- --hostname 127.0.0.1 --port 3100`, HTTP 200 local.                                            |
| Cabeceras de página     | `Cache-Control: private, no-store`, `X-Content-Type-Options: nosniff`.                                          |
| Activos                 | Tres PNG copiados byte a byte de los originales Fluido; fuentes WOFF2 locales.                                  |
| Auditoría de producción | `npm audit --omit=dev`: 0 vulnerabilidades. La limitación de las 5 alertas de tooling está explicada en README. |

La instalación inicial de Next.js 16.3.3 detectó una alerta crítica; se aplicó el parche de la misma línea antes del build verificado. El primer lint señaló enlaces internos sin `next/link`; se corrigieron antes del resultado final.

## Navegador y revisión visual

Prueba local con Chromium y Playwright `1.63.0` disponible en el entorno de revisión. Es una comprobación puntual de la base, no la suite E2E del producto. Los primeros intentos del script se corrigieron para localizar un `summary` nativo y esperar la navegación de Next; no requirieron cambios de interfaz. El [resultado final](verification/smoke.json) conserva:

- Escritorio de 1440 px y móvil de 390 px; comprobación adicional de 320 px sin desbordamiento horizontal.
- Apertura con teclado de las fuentes y del menú móvil; once enlaces exactos del corpus.
- Recolección deshabilitada con motivo visible; ningún resultado de análisis simulado.
- Respuesta 404 y regreso a ejecuciones.
- Cero errores de página en las vistas probadas; las 32 solicitudes observadas de las vistas iniciales fueron exclusivamente a localhost, incluidos logos y fuentes.

Capturas de la misma interfaz revisada: [escritorio](verification/desktop.png), [móvil](verification/mobile.png). El contrato de dirección `senialon-fe-1-2` se conserva en el HTML de producción. Una pasada del detector de Impeccable devolvió [lista vacía de hallazgos](verification/detector.json); no se interpreta como certificación integral de accesibilidad.

Revisión de cierre independiente según Impeccable: composición, tipografía, materiales, marca, adaptación y veracidad conformes al diseño confirmado. No se generó una identidad alternativa o un comp: se aplicó la excepción de solicitud acotada sobre `DESIGN.md` existente.

| Hallazgo material del revisor                                                          | Veredicto final                                                                                                                   |
| -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| PRODUCT.md y DESIGN.md todavía describían la base y las fuentes como no implementadas. | **Resuelto.** Ambos reflejan la base existente, la carga local y Next.js 16.3.8; conservan explícitas las capacidades pendientes. |
| Pendientes de esa revisión visual                                                      | **Ninguno (`clear`).**                                                                                                            |

La corrección final fue documental; no cambió la interfaz de las capturas. El sidecar anterior de Impeccable conserva una advertencia de desfase; no se reparó incidentalmente ni se utilizó para reemplazar los tokens confirmados.

## Fronteras del cierre

FE 1.2 entrega la base y los comandos. El hito técnico posterior de FE 1.1 está documentado en [CONTRATO_API.md](CONTRATO_API.md); no modifica las capturas de esta base. FE 1.3/BE 3.6 deben proteger la aplicación antes de publicarla. BE 3.3 verificará los servicios y el primer despliegue; el arranque local no los sustituye. El control offline de [BE 3.2](../docs/budget/README.md) mantiene bloqueadas las pruebas pagadas mientras falten verificaciones de cuenta.
