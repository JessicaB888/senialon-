# Verificación de la base BE 3.3

Registro del **18 de octubre de 2026, America/Bogota**, sobre trabajo local posterior a `5d3bda3`. No acredita un despliegue, facturación de cuenta, persistencia ni proveedores de análisis. BE 3.3 permanece abierta.

## Pruebas realizadas

| Comprobación | Resultado y alcance |
| --- | --- |
| Entorno | CPython **3.12.14**, uv **0.11.26**, Node **24.21.0**, npm **11.19.0**, Vercel CLI **64.5.0**. |
| Dependencias | `uv.lock` resuelto desde PyPI; FastAPI **0.143.3**, Pydantic **2.14.1**, Uvicorn **0.54.0**. pytest **9.1.1** y HTTPX **0.28.1** solo para desarrollo. |
| Backend | **52 pruebas aprobadas**: 41 de acceso/transporte y las 11 existentes de presupuesto. Configuración ausente/insegura, credencial incorrecta/malformada/UTF-8, origen de mutaciones, metadatos, request ID, docs desactivadas, rutas sin implementar y errores saneados. |
| Binding local real | `vercel dev -L` reconoció Next y FastAPI. El proceso Node recibió la URL generada y realizó cuatro lecturas a Python: **401, 401, 200, 404**, aceptadas por los esquemas canónicos mediante Ajv. No es solo un mock de fetch o TestClient. |
| Entrada pública local | Puerto **3200**: `/` → 200 HTML de Next; `/api/v1/meta`, `/backend/api/v1/meta` y `/openapi.json` → 404 HTML de Next. La API de Python solo se alcanzó por el servicio interno. La página local aún responde sin credencial; FE 1.3 está pendiente. |
| Caché | Las cuatro respuestas Python conservan `private, no-store`, versión, identidad de solicitud y fecha zonificada. Next en modo desarrollo respondió `no-cache, must-revalidate`; eso no acredita la política privada de un despliegue. |
| Contrato | **1.0.0**, SHA-256 `d7e0b018263658e686da00997ddffbd19ba96e6e73de5b08e3f8917b95375956`; fuente y derivados FE sin cambios. |
| Frontend conservado | `npm run build` y sus comprobaciones TypeScript/contrato aprobados; **250 pruebas Vitest** aprobadas. El build produce páginas de servidor y el ícono estático; todavía no hay BFF. Scripts de infraestructura y `vercel.json` comprobados con Prettier. |

Las credenciales de pruebas son sintéticas y no son una credencial de demo. No se consultaron YouTube, JEV, Gemini, Notion o PostgreSQL. La prueba no se registra como una factura de cero dólares ni verifica el saldo de Vercel.

pytest emite una advertencia de deprecación de Starlette sobre HTTPX en TestClient; no hay fallos. Es una dependencia de pruebas, sin cliente de proveedor en producción. Los procesos locales de Services se detuvieron al terminar las comprobaciones.

## Límites: referencia, configuración y realidad

La documentación consultada publica estos límites con Fluid compute; son **referencia de catálogo**, no valores leídos de la cuenta del equipo. [Functions](https://vercel.com/docs/functions/limitations), [Python](https://vercel.com/docs/functions/runtimes/python).

| Recurso | Referencia publicada | Configuración SENIALON | Verificación en cuenta/despliegue |
| --- | --- | --- | --- |
| Duración Node | Pro: máximo general 800 s | 60 s para funciones de `src/app/**/*` | Pendiente; hay páginas de servidor y aún no hay BFF. |
| Duración Python | Pro: máximo general 800 s | 60 s para `main.py` | Pendiente. |
| Memoria, ambos | Pro: 2 GB por defecto, máximo 4 GB | Sin incremento explícito | Pendiente. |
| Payload, ambos | 4,5 MB por solicitud/respuesta | JSON/URLs; no carga de videos | Límite de plataforma pendiente de verificar. |
| Bundle Node/Python | 250/500 MB sin compresión | Python excluye tests y guías del bundle | Tamaño desplegado pendiente. |
| Runtime Node | Seleccionado por engines del frontend | `>=24.21.0 <25` | Versión exacta cloud pendiente. |
| Runtime Python | 3.12 disponible | `>=3.12,<3.13` y `.python-version` 3.12 | Versión exacta cloud pendiente. |

Services sigue en beta. La configuración utiliza `services`, sin el modelo anterior `experimentalServices`; solo hay un rewrite público hacia Next. [Services](https://vercel.com/docs/services).

Las llamadas internas y el cómputo pueden facturarse; el abono existente no verifica consumos incluidos o margen disponible. No se activaron extras. BE 3.2 mantiene bloqueadas las pruebas pagadas hasta verificar cuenta/cargos/margen. [Precios de Services](https://vercel.com/docs/services/pricing).

## Pendientes para cerrar

1. Identificar/vincular el proyecto y equipo Vercel; no hay asociación local `.vercel/project.json` ni nombre/URL confirmados.
2. Verificar Fluid, límites efectivos, uso y margen incremental de la cuenta sin contratar extras.
3. Completar la protección de Next en FE 1.3 y revisar la entrega BE 3.6. El guard backend ya está disponible y probado localmente, también por binding.
4. Ejecutar el primer build/despliegue protegido, comprobar acceso al contrato desde el build frontend y que los patrones de funciones reciben los 60 s configurados.
5. Verificar la URL desde otro equipo, la lectura por un Route Handler real y que Python no tiene ruta pública, también con credenciales válidas.

La preparación local permite comenzar FE 1.3; no sustituye las verificaciones pendientes del despliegue. Las tareas de datos, persistencia y proveedores conservan su propio alcance.
