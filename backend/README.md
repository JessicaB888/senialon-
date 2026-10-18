# Backend de SENIALON

Base local de **BE 3.3**, preparada para que FE implemente **1.3**. Python 3.12, FastAPI y configuración de dos Vercel Services. El binding se verificó localmente con el CLI; el primer despliegue y los límites efectivos de la cuenta siguen pendientes. [Evidencia y pendientes](VERIFICACION.md).

## Arranque reproducible

Requisitos: Python **3.12**, uv (verificado con **0.11.26**), Node **>=24.21.0 <25** y npm **11.19.0** para Next. Las versiones Python directas y transitivas están fijadas en `pyproject.toml` y `uv.lock`. No usar el Python del prototipo ni ejecutar archivos de `docs/`.

Desde `backend/`:

```sh
uv sync --locked
cp -n .env.example .env
```

Completar las tres variables en el archivo local ignorado `.env`, con una credencial de desarrollo propia y el origen exacto. No compartir sus valores ni guardarlos en Git. Sin configuración válida, la API deniega todas las solicitudes; no existe una contraseña predeterminada. `uv run --env-file` carga ese archivo; la aplicación no busca archivos de secretos por su cuenta.

```sh
uv run --locked --env-file .env uvicorn main:app --host 127.0.0.1 --port 8000 --no-access-log
```

Pruebas sin cuentas ni servicios de pago:

```sh
uv run --locked pytest -q
```

## Los dos servicios en local

Desde la raíz de SENIALON, instalar primero el frontend:

```sh
npm --prefix frontend ci
uv sync --project backend --locked
uv run --project backend --locked --env-file backend/.env npx --yes vercel@64.5.0 dev -L --listen 127.0.0.1:3000
```

`-L` inicia Services sin vincular un proyecto ni descargar variables de la nube. Los valores locales cargados por uv llegan a ambos procesos. El CLI genera `SENIALON_BACKEND_URL` para Node. No definir esa URL manualmente ni usar un nombre `NEXT_PUBLIC_`. La entrada de `vercel.json` dirige todo el tráfico público a Next; Python no tiene rewrite público. La [configuración de Services](https://vercel.com/docs/services/config-reference) vive en la raíz y conserva los comandos frontend `npm ci` / `npm run build`.

Para comprobar el binding antes de iniciar Next:

```sh
SENIALON_VERIFY_BINDING=1 uv run --project backend --locked --env-file backend/.env npx --yes vercel@64.5.0 dev -L --listen 127.0.0.1:3000
```

El arranque Node verifica cuatro respuestas HTTP de Python contra los esquemas derivados del contrato canónico. Requiere las dependencias de frontend instaladas y un binding de loopback; no admite destinos de nube. El smoke usa solamente lecturas de metadatos/documentación. Si falla, no inicia Next en ese modo y muestra un error sin credenciales.

Este smoke verifica el binding desde el proceso Node de desarrollo. **Todavía no es un Route Handler de Next ni una prueba de funciones desplegadas.** Las páginas locales actuales siguen sin protección web; la protección de FastAPI no las protege. No publicar esta base antes de FE 1.3 y la comprobación de acceso de ambos servicios.

## Entrega para FE 1.3 y BE 3.6

| Elemento | Entrega disponible |
| --- | --- |
| Transporte | FastAPI en `main:app`; `GET /api/v1/meta`, operación `getCapabilities`. |
| Contrato único | `docs/contracts/openapi.json`, **1.0.0**, sin cambios de versión o hash. Los modelos Pydantic son un subconjunto implementado, no otra autoridad. |
| Binding | `SENIALON_BACKEND_URL`, generado para el servicio `frontend` y dirigido a `backend`. Conservar el path base al añadir `api/v1/meta`. |
| Credencial | `DEMO_USERNAME` y `DEMO_PASSWORD`, iguales en ambos servidores. HTTP Basic UTF-8; comparación segura. Nunca enviar la contraseña de Vercel o claves de proveedores. |
| Configuración | `DEMO_ALLOWED_ORIGIN` sin path ni slash final. HTTPS en preview/producción; HTTP de loopback permitido solo en desarrollo. |
| Respuestas | JSON contractual, `Cache-Control: private, no-store`, `X-Contract-Version`, `X-Request-Id` igual a `meta.request_id` y fecha con zona UTC. |
| Errores | 401 `AUTH_REQUIRED` con challenge Basic; 403 `ORIGIN_FORBIDDEN`; 404 `NOT_FOUND`; 422 `VALIDATION_ERROR`; 500 `INTERNAL_ERROR`, sin entradas ni excepciones reflejadas. Configuración incompleta produce 500 y nunca acceso abierto. |
| Identidad HTTP | Se propaga un ID ASCII seguro de hasta 128 caracteres; si falta o no es seguro, Python genera uno. No reutilizarlo como ID de ejecución u operación. |
| Operaciones futuras | Guard global antes del router, incluso para rutas inexistentes. Mutaciones rechazan un `Origin` ausente/distinto. Los endpoints de dominio, su idempotencia y persistencia aún no existen. |

FE debe comprobar acceso en páginas y cada Route Handler, validar la respuesta con el consumidor `server-only`, reenviar la autorización validada únicamente al binding y verificar el origen original antes de reenviar mutaciones. No seguir redirects, usar caché compartida ni llamar al binding desde el build o middleware. Un binding concede conectividad, no autenticación. [Comportamiento oficial de bindings](https://vercel.com/docs/services/bindings).

`/api/v1/meta` informa únicamente el acuerdo documental y Notion diferido. No acredita proveedores, ejecuciones, datos, persistencia o tendencias operativas. Las demás rutas devuelven recurso no disponible tras autenticar; no hay análisis ni resultados simulados.

La base incorpora el guard necesario para comprobar la conexión privada y adelanta BE 3.6. Su casilla permanece abierta para la entrega/revisión conjunta con FE 1.3. No se modificó `backend/analysis/` ni el código del frontend.

## Despliegue pendiente

El proyecto Vercel debe usar **la raíz de este repositorio**, con `vercel.json`; no configurar `frontend/` como Project Root Directory. El build de Next necesita también `docs/contracts/openapi.json`, fuera de su directorio. Verificar ese contexto en el primer build de Services.

Antes de desplegar: resolver el proyecto/equipo Vercel, verificar límites y margen de gasto de BE 3.2, completar FE 1.3 y revisar BE 3.6, configurar secretos en servidor y comprobar protección de páginas/rutas. Después, verificar desde la URL protegida: rechazo sin credencial, metadatos por Next/binding, ausencia de ingreso público a Python y los límites aplicados a ambas funciones. No activar planes o extras para resolver un fallo.

`maxDuration: 60` es la configuración inicial de ambas funciones en `vercel.json`; no es un límite medido ni una garantía de costo. No se aumentó memoria o duración de la cuenta. Los pasos analíticos deberán caber dentro del menor tiempo efectivo, incluido transporte/retorno; BE 3.10 controla trabajo y gasto persistidos. [Límites y estado de verificación](VERIFICACION.md).
