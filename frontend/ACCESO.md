# Acceso y transporte — FE 1.3

Implementación y pruebas **locales**, 18 de octubre de 2026, America/Bogota. El usuario confirmó que aún **no existe un proyecto de SENIALON en Vercel**. FE 1.3 conserva pendiente su cierre con despliegue protegido y las verificaciones BE 3.3/3.6; no se presenta esta evidencia como una URL publicada.

## Comportamiento implementado

HTTP Basic utiliza la credencial compartida de demo. El navegador solicita el usuario y la contraseña; no se añadió un formulario, cuentas individuales, cookies de sesión o acceso público de lectura.

La protección se comprueba en tres lugares:

1. `src/proxy.ts` rechaza solicitudes sin credencial válida antes de entregar páginas o rutas. Solo los assets de build, el ícono y los dos logos conocidos son públicos.
2. Las páginas de inicio y no encontrada ejecutan `requirePageAccess()` antes de devolver contenido, aunque se invoquen sin proxy. No se confía en el layout. Las nuevas páginas privadas deberán usar la misma guarda.
3. El Route Handler `api/v1/[[...path]]` comprueba por sí mismo configuración, credencial y origen antes de procesar el cuerpo o conectar con Python. Los nuevos Server Actions necesitarán su propia comprobación; no se añadieron acciones en esta tarea.

Una configuración ausente/inválida mantiene el acceso cerrado con error seguro. Una credencial ausente/incorrecta produce 401 y `WWW-Authenticate`; un origen de mutación ausente/distinto produce 403. No se infiere el origen permitido a partir de `Host`, `Referer` o encabezados reenviados.

La guarda de páginas usa `unauthorized()` de Next **16.3.8**, habilitada mediante `experimental.authInterrupts`. Es una API experimental: se verificó en el build y en producción local; revisar esta compatibilidad al actualizar Next. No se llama desde el root layout ni dentro de una promesa sin esperar. [Referencia de Next](https://nextjs.org/docs/app/api-reference/functions/unauthorized), [protección de operaciones](https://nextjs.org/docs/app/guides/authentication).

## Contrato y conexión interna

La autoridad permanece en `docs/contracts/openapi.json`, versión **1.0.0**, SHA-256 **`d7e0b018263658e686da00997ddffbd19ba96e6e73de5b08e3f8917b95375956`**. No se cambió su contenido. El generador FE ahora deriva también métodos, paths y esquemas de parámetros/cuerpos de las 18 operaciones; `contract:check` comprueba esos derivados antes del build.

El BFF de Next permite las operaciones del núcleo que reconoce el contrato. Valida parámetros de path/query, JSON y encabezados de comandos con Ajv, sin defaults/coerción del JSON. La conversión de enteros de query es explícita y comprueba representación y rango seguro. Parámetros desconocidos/repetidos y comandos sin idempotencia o cuerpo válido producen 422 antes de conectar con Python. Notion queda fuera del transporte activo hasta FE 1.12.

El destino proviene únicamente de `SENIALON_BACKEND_URL`, generado por Services para el servidor. Se conserva su prefijo al añadir la ruta. El usuario no elige otro host/path interno ni reenvía cookies, claves arbitrarias, `Host` o encabezados de proxy. Solo se transmiten autorización validada, ID de solicitud, JSON y, en mutaciones, origen autorizado e `Idempotency-Key` estable.

Cada llamada usa `cache: no-store`, redirects rechazados y un timeout de **50 segundos**, inferior a los 60 configurados por función. No hay reintentos automáticos. Se limita la lectura JSON a **4.000.000 bytes**; no se transportan archivos de video. Si una mutación pierde la respuesta, el frontend devuelve un error sin recomendar repetirla: BE conserva la autoridad sobre su estado y reserva.

La respuesta debe tener el estado y esquema de la operación, JSON válido, versión acordada, caché privada e ID coincidente entre encabezado y envelope. Un cuerpo HTML, estado inesperado, esquema ajeno, ID distinto o fallo de conexión se convierte en un `INTERNAL_ERROR` contractual saneado, sin devolver el cuerpo recibido. No se copian cookies ni otros encabezados del backend. Las respuestas JSON conservan exactamente `Cache-Control: private, no-store`.

`GET /api/v1/meta` ya consulta **FastAPI real** desde Next. Informa el acuerdo documental y Notion diferido; no acredita datos, ejecución o proveedores operativos. Los otros endpoints del núcleo se conectarán conforme los entregue BE; actualmente conservan su 404 contractual. Listar/leer no avanza análisis ni llama proveedores. FastAPI vuelve a comprobar acceso y origen, también por binding. [Bindings de Vercel](https://vercel.com/docs/services/bindings).

## Configuración local

Para Next solo, copiar `.env.example` a `.env.local` y completar `DEMO_USERNAME`, `DEMO_PASSWORD` y `DEMO_ALLOWED_ORIGIN`. Los nombres son solo de servidor, sin `NEXT_PUBLIC_`. No hay valores predeterminados ni credencial de demo creada por esta entrega.

Para los dos servicios, usar los mismos valores de `backend/.env` mediante uv, desde la raíz del repositorio:

```sh
npm --prefix frontend ci
uv sync --project backend --locked
uv run --project backend --locked --env-file backend/.env npx --yes vercel@64.5.0 dev -L --listen 127.0.0.1:3000
```

Abrir el origen exacto configurado, por ejemplo `http://127.0.0.1:3000` si ese es el elegido localmente; `localhost` y `127.0.0.1` son orígenes diferentes. HTTP se admite solo en loopback local; preview/producción en Vercel exige HTTPS. No configurar manualmente el binding de la nube. [Arranque backend y variables](../backend/README.md).

## Verificación reproducible

Desde `frontend/`, con Python 3.12, uv, Node/npm y las dependencias instaladas:

```sh
npm run test
npm run test:types
npm run typecheck
npm run lint
npm run format:check
npm run test:e2e
```

`test:e2e` prepara un build con marcadores de credencial sintéticos y aleatorios. Antes de mostrar logs, comprueba que no los contengan; luego revisa los assets cliente. Arranca servidores temporales en **127.0.0.1:3300/3301**, con otras credenciales sintéticas, y los detiene al terminar. El test no admite una URL remota ni credenciales reales. Requiere Chromium instalado para Playwright **1.63.0**; no activa cuentas ni pruebas de pago. `security:client` permite repetir la revisión de nombres privados sobre un build existente.

| Verificación                | Evidencia                                                                                                                                                                                                                                      |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Consumidor existente        | Se conservan 94 esquemas y 74 ejemplos canónicos sintéticos; tipos y validación siguen con la misma autoridad.                                                                                                                                 |
| Acceso y transporte         | **326 pruebas Vitest aprobadas**: consumidor existente y 76 casos nuevos de configuración, Basic UTF-8, proxy, páginas/handlers invocados directamente, origen, comandos, rutas, parámetros, errores de red, identidad y respuestas inválidas. |
| Producción local            | **9 pruebas Playwright aprobadas**, incluida navegación en Chromium con Basic y consulta del BFF desde el mismo origen; FastAPI real comprueba credencial por separado.                                                                        |
| Separación cliente/servidor | Marcadores privados ausentes de logs de build y **13 artefactos cliente**. HTML/respuestas/encabezados de las pruebas no contienen las credenciales sintéticas.                                                                                |
| Binding real de Services    | **6 comprobaciones aprobadas** en `vercel dev -L`: páginas/API denegadas sin acceso, página y metadatos válidos, ruta pública Python inexistente y origen de mutación rechazado. [Registro saneado](verification/access-services.json).        |

Los ejemplos/cuentas de pruebas no se usan como datos de demo. No se consultaron YouTube, JEV, Gemini, Notion o PostgreSQL; no se ejecutó el prototipo. En modo desarrollo, Next puede cambiar la caché de páginas; la política privada se comprobó en producción local y la API conserva el encabezado contractual también con Services.

## Pendiente para cierre

BE 3.3 debe crear/vincular el proyecto y verificar límites y margen de gasto, sin activar extras; BE 3.6 debe revisar/configurar la credencial compartida de despliegue. Después corresponde comprobar FE 1.3 en la URL protegida: acceso desde otro equipo, Route Handler por el binding desplegado, rechazo directo de Python y políticas de caché/secretos. El usuario confirmó la ausencia de proyecto; las pruebas locales no resuelven ese requisito.

La recolección, persistencia, pantallas de datos, revisión editorial y análisis conservan sus tareas posteriores. Esta entrega no inicia esas operaciones ni cierra FE 1.10 o la evaluación del producto.
