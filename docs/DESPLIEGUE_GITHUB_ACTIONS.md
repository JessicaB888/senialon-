# Comprobaciones de GitHub Actions y despliegue nativo de Vercel

El usuario confirmó el 18 de octubre de 2026 que albcamargo creó el proyecto en Vercel, plan **Hobby**, y lo conectó al repositorio original `albcamargo/senialon-`. La URL reportada es [corefex-psi.vercel.app](https://corefex-psi.vercel.app). Vercel despliega producción desde `main` mediante su integración Git.

El [workflow](../.github/workflows/deploy-main.yml) conserva únicamente las comprobaciones. Se mantienen los nombres de archivo para conservar los enlaces existentes; las instrucciones anteriores de despliegue por CLI y secretos de Actions quedan sustituidas por esta guía.

## GitHub Actions

El workflow **SENIALON · comprobaciones** se ejecuta con cada push a `main` o manualmente mediante **Actions → SENIALON · comprobaciones → Run workflow**, seleccionando `main`. Conserva el filtro del repositorio original y de esa rama, permiso `contents: read`, acciones fijadas por SHA y las versiones existentes de Node, uv y Python.

El único job, `verify`, mantiene sus pasos y comandos:

- Frontend: `npm ci`, contrato actualizado, Vitest, ejemplos tipados, TypeScript, ESLint, formato, build y separación cliente/servidor.
- Backend y análisis: `uv sync --locked` y `uv run --locked python -B -m pytest -q tests analysis/tests`.

Las pruebas usan proveedores simulados. Sin `TEST_DATABASE_URL` se omiten las comprobaciones que requieren PostgreSQL; el resto usa la base de pruebas prevista. El workflow no ejecuta el prototipo, los E2E pendientes ni pruebas pagadas de proveedores.

Una nueva ejecución puede cancelar las comprobaciones anteriores de la misma rama. Esta concurrencia solo afecta a Actions.

## Vercel

Vercel conserva la responsabilidad del despliegue automático de `main`. El job `deploy`, la instalación de la CLI, `vercel pull` y `vercel deploy` se retiraron de Actions.

Las pruebas de Actions y el despliegue nativo de Vercel se ejecutan **de forma independiente**. Este workflow no añade una condición de aprobación de CI antes de publicar en Vercel. El resultado de las pruebas se consulta en GitHub; el resultado del despliegue y sus logs, en Vercel.

En el proyecto Vercel:

- Conservar la conexión a `albcamargo/senialon-` y la rama de producción `main`.
- Mantener **Root Directory en la raíz del repositorio**. [vercel.json](../vercel.json) define los servicios `frontend/` y `backend/`, sus comandos y el binding; no sustituirlo por un build global de Next.
- Configurar las variables de servidor en Vercel para el entorno correspondiente, según [backend/README.md](../backend/README.md). Las credenciales compartidas deben llegar a Next y Python.
- Configurar `DEMO_ALLOWED_ORIGIN=https://corefex-psi.vercel.app`, sin barra final, junto con `DEMO_USERNAME` y `DEMO_PASSWORD` privados.
- Dejar que Services genere `SENIALON_BACKEND_URL`; no asignarlo manualmente.
- Conservar `PAID_CALLS_ENABLED=false` hasta completar el control de cuentas, tarifas y reservas de BE 3.2.

Después de modificar variables hay que crear un nuevo despliegue: los cambios no se aplican a despliegues anteriores. [Variables de entorno de Vercel](https://vercel.com/docs/environment-variables).

## Secretos

Este workflow no usa `VERCEL_TOKEN`, `VERCEL_ORG_ID` ni `VERCEL_PROJECT_ID`. No es necesario crearlos para las comprobaciones de Actions o para la integración Git nativa.

Las claves de proveedores, la conexión PostgreSQL y la credencial de demo permanecen en la configuración privada del servidor en Vercel; no se añaden al workflow ni al repositorio. Este cambio no elimina ni modifica secretos o conexiones en las cuentas externas.

## Verificación pendiente

La creación del proyecto y su URL no cierran FE 1.3 ni BE 3.3/3.6. Falta comprobar acceso con credencial válida, rechazo sin ella, comunicación real Next–Python, protección del backend y límites efectivos del plan. La base de datos y los proveedores conservan sus verificaciones propias.

La [integración JEV](INTEGRACION_JEV.md) tiene código y pruebas locales; esas comprobaciones no acreditan acceso operativo a cuentas, persistencia del equipo o calidad del análisis real.
