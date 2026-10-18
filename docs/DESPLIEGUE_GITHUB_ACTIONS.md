# Despliegue de main en Vercel mediante GitHub Actions

Workflow preparado: [deploy-main.yml](../.github/workflows/deploy-main.yml). Usa el repositorio original `albcamargo/senialon-` y un proyecto de tu equipo Vercel existente, sin invitar miembros ni contratar puestos. No configura la integración Git nativa de Vercel. **Preparado localmente; proyecto, secretos y primer despliegue real todavía pendientes.**

## 1. Crear o vincular tu proyecto

Usa Node **24.21.0**, indicado en `frontend/.nvmrc`, y ejecuta desde la raíz de SENIALON:

```sh
cd /Users/andrescelis/Documents/30x/hackathon30x/SENIALON
npx vercel@64.5.0 login
npx vercel@64.5.0 link
```

En el asistente, inicia sesión con **tu cuenta**, selecciona el equipo donde ya pagas Vercel y crea `senialon` si está disponible; si ya lo creaste, selecciona ese proyecto existente. El directorio de código es **`.`**. Si ofrece conectar Git, omite esa conexión: la automatización la ejecutará GitHub Actions. No hace falta importar el repositorio de la otra persona, crear un fork, transferirlo o invitarla a tu equipo.

`link` crea o asocia el proyecto, sin desplegarlo. Conserva Root Directory en la raíz; [vercel.json](../vercel.json) define los servicios `frontend/` y `backend/`, el build por servicio y su binding. No configures un build global que sustituya esa configuración. [Guía CLI de Vercel](https://vercel.com/docs/projects/deploy-from-cli), [Services](https://vercel.com/docs/services).

En la máquina donde se preparó SENIALON el Node global falla; si sigue ocurriendo, esta ruta local de Node 24.21.0 estaba disponible y puede anteponerse al PATH de esa terminal:

```sh
export PATH="/private/tmp/node-v24.21.0-darwin-x64/bin:$PATH"
node --version
```

Es una ruta temporal de esta máquina, no un requisito para otros equipos. Usa en ellos una instalación compatible.

## 2. Obtener los identificadores y crear el token

`link` genera `.vercel/project.json`, excluido de Git. Muestra solo sus dos identificadores:

```sh
node -e 'const fs = require("node:fs"); const p = JSON.parse(fs.readFileSync(".vercel/project.json", "utf8")); console.log({ VERCEL_ORG_ID: p.orgId, VERCEL_PROJECT_ID: p.projectId });'
```

En [Vercel → Account Settings → Tokens](https://vercel.com/account/tokens), crea un token para `senialon-github-actions`, con el equipo correcto como scope y una caducidad adecuada para la demo. Guárdalo directamente como secreto de GitHub; no lo pegues en el chat, un archivo del repo o un comando que quede en el historial. El token autoriza a GitHub Actions a desplegar en tu nombre; su alcance es el que concedas en Vercel, no se presume limitado a un solo proyecto. [Referencia de tokens](https://vercel.com/kb/guide/how-do-i-use-a-vercel-api-access-token).

## 3. Registrar tres secretos en el repositorio original

El propietario o administrador entra a [Settings → Secrets and variables → Actions](https://github.com/albcamargo/senialon-/settings/secrets/actions) y crea tres **Repository secrets** mediante **New repository secret**:

| Nombre exacto       | Valor que debe introducir                                                              |
| ------------------- | -------------------------------------------------------------------------------------- |
| `VERCEL_TOKEN`      | Token creado desde tu cuenta Vercel.                                                   |
| `VERCEL_ORG_ID`     | `orgId` del proyecto vinculado; corresponde al equipo de Vercel, no al usuario GitHub. |
| `VERCEL_PROJECT_ID` | `projectId` del mismo proyecto.                                                        |

Conservar estos nombres. El workflow no contiene valores reales. Las credenciales solo llegan a los pasos de configuración y despliegue, después de las pruebas; no se imprimen, cachean ni suben como artefactos. La configuración descargada por `vercel pull` queda en el runner efímero. [Secretos de GitHub Actions](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets).

## 4. Configurar la aplicación en Vercel

En el proyecto, **Settings → Environment Variables**, registra para **Production**:

| Nombre                | Contenido                                                                                         |
| --------------------- | ------------------------------------------------------------------------------------------------- |
| `DEMO_USERNAME`       | Usuario compartido de la demo, sin `:`.                                                           |
| `DEMO_PASSWORD`       | Contraseña de demo elegida por el equipo.                                                         |
| `DEMO_ALLOWED_ORIGIN` | Origen HTTPS exacto del dominio de producción de **Settings → Domains**, sin ruta ni barra final. |

Son variables de servidor compartidas por ambos servicios. No necesitan `NEXT_PUBLIC_` ni copias en los secretos de GitHub. `SENIALON_BACKEND_URL` lo genera Services: no asignarlo manualmente en la nube.

Usa el dominio que realmente asigne Vercel, sin suponer que `senialon.vercel.app` esté disponible. Si se asigna después del primer despliegue, actualiza el origen y despliega de nuevo; sin configuración válida la aplicación conserva el acceso cerrado. No uses el dominio efímero de cada deployment como origen estable de producción.

Antes de habilitar el primer despliegue, verifica el uso/margen y los límites del plan abonado según [BE 3.2/3.3](../backend/VERIFICACION.md). Este procedimiento no contrata extras, puestos, complementos de protección o planes. El acceso de demo ya lo implementa la aplicación con HTTP Basic.

## 5. Subir y activar el workflow

Cuando la configuración esté lista, incorporar el workflow y esta guía a `main` del repositorio original. Ese push lo activa; mientras estos archivos sigan solo locales no habrá automatización. Si ya estaba publicado antes de registrar los secretos, en **Actions → SENIALON · producción en Vercel → Run workflow**, selecciona **main**.

El workflow solo admite el repositorio original y `refs/heads/main`, también al ejecutarlo manualmente. Tiene permiso `contents: read`. Las acciones externas están fijadas por SHA y Node, uv y la CLI están fijados a las versiones de la base. No necesita permisos de escritura al código ni una membresía adicional de Vercel.

Primero ejecuta contrato, Vitest, ejemplos tipados, TypeScript, ESLint, Prettier, build y separación cliente/servidor de frontend; después instala Python desde el lockfile y ejecuta `tests` más `analysis/tests`. No ejecuta el prototipo, E2E pendientes, adquisiciones o pruebas pagadas de proveedores. Estas comprobaciones no equivalen al recorrido real integrado.

Solo después de aprobar ese job y comprobar los tres secretos, recupera la configuración del proyecto existente y ejecuta **`vercel deploy --prod --yes` desde la raíz**, con la CLI 64.5.0. El build remoto construye ambos servicios según `vercel.json`; no se usa un artefacto prebuilt de Next aislado. `--prod` define el destino; el filtro de `main` vive en el workflow y no necesita Branch Tracking de una integración Git.

Los despliegues se serializan sin cancelar uno ya enviado. GitHub puede reemplazar ejecuciones pendientes por la más reciente; además, un commit que ya no sea el último de `main` se omite antes de llamar a Vercel. No hay reintentos automáticos de despliegue. Si una respuesta se pierde, comprueba primero el commit en **Vercel → Deployments** antes de repetir manualmente. [CLI deploy](https://vercel.com/docs/cli/deploy), [concurrencia en Actions](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-workflow-concurrency).

Si el proyecto ya tenía una conexión Git nativa, deja un solo mecanismo de despliegue para evitar duplicados. Esta ruta funciona con el proyecto sin esa conexión; no cambies la URL original del repositorio.

## 6. Comprobar el primer resultado

En GitHub, ambos jobs deben terminar correctamente; el log de despliegue muestra la URL. En Vercel comprueba el proyecto/equipo, destino Production, estado Ready, commit y metadato `senialonCommit`. En una sesión sin credencial, la página y `/api/v1/meta` deben rechazar el acceso; con la credencial válida, los metadatos deben cruzar Next y su binding a Python. Comprueba también que Python no tenga un ingreso público y que otra persona pueda acceder mediante la credencial compartida.

El backend actual solo ofrece metadatos; un despliegue correcto no acredita operaciones de dominio, proveedores o persistencia. Los pendientes de [FE 1.3](../frontend/ACCESO.md), [FE 1.4](../frontend/EJECUCIONES.md) y [BE 3.3](../backend/VERIFICACION.md) conservan su alcance hasta comprobarlo realmente.

GitHub publica ejecución gratuita para repositorios públicos con runners estándar, como `ubuntu-latest`; se evita el costo de otro puesto Vercel. Los builds y el uso de Vercel conservan las condiciones de tu plan y el presupuesto incremental. [Facturación de Actions](https://docs.github.com/en/billing/concepts/product-billing/github-actions).

## Verificación local de esta preparación

YAML válido y siete bloques Bash con sintaxis comprobada. Siete casos sintéticos aprobados: cada secreto ausente, los tres presentes, commit vigente, commit anterior y fallo al consultar la rama. Los valores sintéticos no aparecen en las salidas; no hubo llamadas a Vercel. Los SHA de checkout 7.0.1, setup-node 7.1.0 y setup-uv 10.3.0 se contrastaron con los repositorios oficiales; los tres usan runtime Node 24. También pasaron **386 pruebas Vitest**, **191 pruebas Python**, 74 ejemplos canónicos tipados, TypeScript, ESLint, formato y OpenSpec estricto. Siete comprobaciones del patrón de bundle confirman exclusión de pruebas/guías y conservación de código de producto. Python conserva la advertencia previa de deprecación de Starlette/HTTPX.

Esta validación no ejecuta el runner de GitHub ni el build de Services en la nube. No se crearon proyectos, tokens, secretos, miembros o despliegues; la verificación real queda pendiente de los pasos anteriores. Las casillas de despliegue no se cierran por preparar el archivo.
