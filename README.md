# SENIALON

![Logo de SENIALON](branding/Fluido%20%C2%B7%20claro%402x.png)

Detectamos la señal cuando apenas se enciende.

## Identidad visual

Los logos actuales están en `branding/`. Las variantes disponibles son:

| Variante | 1x | 2x |
| --- | --- | --- |
| Clara | [1200 × 520](branding/Fluido%20%C2%B7%20claro%401x.png) | [2400 × 1040](branding/Fluido%20%C2%B7%20claro%402x.png) |
| Oscura | [1200 × 520](branding/Fluido%20%C2%B7%20oscuro%401x.png) | [2400 × 1040](branding/Fluido%20%C2%B7%20oscuro%402x.png) |
| Ícono | [512 × 512](branding/Fluido%20%C2%B7%20icono%401x.png) | [1024 × 1024](branding/Fluido%20%C2%B7%20icono%402x.png) |

## Documentos del producto

- [Definición del MVP](docs/DEFINICION_MVP.md).
- [Plan de trabajo](docs/PLAN_DE_TRABAJO.md).
- [Arquitectura C4](docs/ARQUITECTURA_C4.md).
- [Sistema visual y de interfaz](DESIGN.md).
- [Contexto del producto para diseño](PRODUCT.md).

## OpenSpec

Configurado con OpenSpec **1.14.3**, esquema `spec-driven`, perfil `core` e integración para Codex. El cambio [definir-mvp-senialon](openspec/changes/definir-mvp-senialon/proposal.md) incluye la propuesta, seis especificaciones funcionales, el [diseño técnico recomendado](openspec/changes/definir-mvp-senialon/design.md) y las [tareas pendientes de ejecución](openspec/changes/definir-mvp-senialon/tasks.md). La planificación está completa para revisión; no se ha desarrollado código del producto ni se han probado sus integraciones. El Python aportado en `docs/` se conserva como referencia para una evolución predictiva futura.

El frontend usará el stack verificado de `personal-finance-assistant`: **Next.js 16.3.3 con App Router, React 19.3.0, TypeScript 5.9.3 y npm**. Python para análisis y Vercel para despliegue también están confirmados. El diseño propone Next.js como entrada web y FastAPI/Python como servicio interno del mismo proyecto Vercel, PostgreSQL en Supabase Free y acceso mediante credencial compartida. El primer despliegue debe verificar esta conexión. Los nuevos consumos de la demo tienen un máximo de **20 USD**; la suscripción Vercel ya abonada queda aparte. El primer bloque de ejecución configura y comprueba YouTube Data API, JEV y persistencia, y verifica Gemini y Vercel.

OpenSpec requiere Node.js **20.19.0 o posterior**. Para preparar esta herramienta en otra máquina:

```sh
npm install -g @fission-ai/openspec@1.14.3
openspec --version
```

La configuración del proyecto y las skills ya están en `openspec/` y `.agents/skills/`; no hace falta repetir la inicialización al clonar el repositorio.

Para revisar o resolver dudas en Codex, usar `openspec-explore`. El cambio ya tiene artefactos de planificación; implementar mediante `openspec-apply-change` requiere una nueva instrucción del usuario. [Documentación de la integración](https://openspec.dev/docs/supported-tools#codex).

El contexto y las reglas de SENIALON están en [openspec/config.yaml](openspec/config.yaml). El trabajo comienza por las especificaciones antes de implementar el producto.

### Entorno local

El Node global de la máquina donde se hizo la configuración tiene un error de biblioteca. Se verificó OpenSpec utilizando el Node 24 disponible en Codex. En esa máquina, antes de ejecutar los comandos:

```sh
export PATH="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH"
node --version
openspec --version
```

Este ajuste afecta solo a la sesión de terminal. Otros equipos con Node compatible no lo necesitan. El runtime usado para verificar OpenSpec es 24.19.0; el futuro frontend requiere **Node.js >=24.21.0 y <25**, siguiendo el proyecto de referencia. El funcionamiento del CLI no valida ese requisito del producto.
