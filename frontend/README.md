# Frontend de SENIALON

Base local verificable de la aplicación. Incluye App Router, TypeScript estricto, fuentes locales, estilos de `DESIGN.md`, logos Fluido y una pantalla inicial sin resultados de análisis. La recolección permanece deshabilitada hasta implementar sus operaciones.

FE 1.1 añade [tipos generados y validación del contrato](CONTRATO_API.md), con pruebas Vitest locales. La fuente única sigue en `docs/contracts/openapi.json`; el transporte autenticado se implementará en FE 1.3.

## Requisitos y arranque

- Node.js `>=24.21.0 <25`; `.nvmrc` fija `24.21.0`.
- npm `11.19.0`, con `package-lock.json` versionado. Usar `npm ci` para reproducir la instalación.
- Next.js `16.3.8`, React/React DOM `19.3.0` y TypeScript `5.9.3`; dependencias directas fijadas sin rangos.

Desde la raíz del repositorio:

```sh
cd frontend
npm ci
npm run dev
```

Abrir `http://127.0.0.1:3000`. El desarrollo escucha solo en loopback por defecto. Para comprobar producción local:

```sh
npm run build
npm run start -- --hostname 127.0.0.1 --port 3100
```

Abrir `http://127.0.0.1:3100`. Estos comandos no necesitan credenciales, una base de datos ni llamadas a proveedores. No ejecutan análisis ni generan cargos de APIs.

## Entrega a Backend / BE 3.3

| Propiedad                         | Valor entregado                                     |
| --------------------------------- | --------------------------------------------------- |
| Directorio del servicio           | `frontend/`                                         |
| Instalación                       | `npm ci`                                            |
| Desarrollo local                  | `npm run dev`                                       |
| Build                             | `npm run build`                                     |
| Arranque de producción local      | `npm run start -- --hostname 127.0.0.1 --port 3100` |
| Framework                         | Next.js / App Router                                |
| Variables necesarias en esta base | Ninguna                                             |
| Artefactos generados              | `.next/`, excluido de Git                           |

El build ejecuta `contract:check` antes de Next. Su contexto debe incluir `../docs/contracts/openapi.json`; mantener el checkout completo al configurar BE 3.3.

La configuración de Vercel Services, su binding y el primer despliegue corresponden a BE 3.3. FE 1.3 implementará el acceso y el cliente del contrato [OpenAPI 1.0.0](../docs/contracts/README.md). Los nombres ya acordados para ese paso están en `.env.example`: `DEMO_USERNAME`, `DEMO_PASSWORD` y `DEMO_ALLOWED_ORIGIN`, solo de servidor y sin valores. Ninguno se consume todavía. El binding se acordará con BE; no se inventa una URL pública para Python ni una variable `NEXT_PUBLIC_*` para secretos.

Esta base todavía no autentica peticiones. Su revisión se realiza localmente; el despliegue accesible a otras personas requiere FE 1.3 y BE 3.6. Los documentos privados tendrán renderizado por solicitud y `Cache-Control: private, no-store`; esto no sustituye la autenticación.

## Sistema visual y activos

- Tokens en `src/app/globals.css`; composición en CSS Modules, sin un segundo framework de estilos.
- Sora y Work Sans variables se sirven localmente desde paquetes Fontsource fijados en `5.3.0`. No se consultan servicios de fuentes durante el build o la navegación. Sus licencias OFL se incluyen en los paquetes instalados.
- `public/branding/` contiene copias sin editar de los logos Fluido claro y oscuro a 2× de `branding/`; `src/app/icon.png` conserva el ícono Fluido a 1×.
- Navegación lateral en escritorio; menú nativo plegable en pantallas menores de 1200 px. Fuentes consultables con teclado y estado inicial explícito.
- Los once enlaces son configuración confirmada del corpus, no acreditan que los canales ya hayan sido consultados. No se muestran conteos, métricas o ejecuciones inventadas.

## Comprobaciones

```sh
npm run contract:check
npm run test
npm run test:types
npm run typecheck
npm run lint
npm run format:check
npm run build
npm audit --omit=dev
```

La evidencia de la base visual está en [VERIFICACION.md](VERIFICACION.md) y la del consumidor en [CONTRATO_API.md](CONTRATO_API.md). Vitest 5.0.1 comprueba el consumo local; Playwright para el recorrido protegido y el cierre de FE 1.10 siguen pendientes. Las pruebas locales no acreditan integración o persistencia.

## Parche de seguridad del stack de referencia

El proyecto de referencia usaba Next.js `16.3.3`. La instalación encontró alertas aplicables a esa versión, incluida [GHSA-vcvr-r3jv-pc5j](https://github.com/vercel/next.js/security/advisories/GHSA-vcvr-r3jv-pc5j). SENIALON fija Next.js y `eslint-config-next` en `16.3.8`, un parche de la misma línea, conservando React y TypeScript acordados.

La auditoría de producción con ese parche devuelve **0 vulnerabilidades**. La auditoría completa conserva **5 alertas altas** propagadas desde `braces@3.0.3` por las herramientas de ESLint; el [aviso oficial](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) no publica aún una versión corregida. Es una limitación del tooling de desarrollo, sin ese paquete en las dependencias de producción. No aplicar `npm audit fix --force`: propone cambios de versión mayores o una degradación incompatible del tooling.
