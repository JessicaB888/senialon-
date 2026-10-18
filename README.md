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
- [Prioridades y dependencias de frontend](docs/PLAN_FRONTEND.md).
- [Revisión de consumo del contrato API — FE 1.1](docs/REVISION_CONTRATO_FRONTEND.md).
- [Revisión semántica — ALG 2.1](docs/REVISION_SEMANTICA_ALG.md).
- [Interfaces internas de análisis y puertos de proveedores](docs/INTERFACES_ANALISIS.md).
- [Contrato API único — acuerdo 1.0.0 y política de versiones](docs/contracts/README.md).
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

Para revisar o resolver dudas en Codex, usar `openspec-explore`. El usuario autorizó ALG 2.1 y el acuerdo definitivo: el [contrato único](docs/contracts/openapi.json) queda acordado en `1.0.0`, con revisión semántica, interfaces y [consumo documental FE](docs/REVISION_CONTRATO_FRONTEND.md) registrados. ALG 2.1 y BE 3.1 se cierran y G0 contractual queda cerrado mediante revisión asistida por Codex; no se atribuyen firmas a otros integrantes ni pruebas reales de servicios. La siguiente construcción es **FE 1.2**, después el hito técnico de tipos/validación FE 1.1 y FE 1.3. Las proyecciones temporales no completan ese hito. BE 3.2 sigue pendiente antes de pruebas pagadas. Este acuerdo no inicia automáticamente código; las tareas conservan dueños y dependencias. [Documentación de la integración](https://openspec.dev/docs/supported-tools#codex).

El contexto y las reglas de SENIALON están en [openspec/config.yaml](openspec/config.yaml). El trabajo comienza por las especificaciones antes de implementar el producto.

La conciliación mantiene una sola fuente de integración: [docs/contracts/openapi.json](docs/contracts/openapi.json). El borrador competidor incorporado en `ae6b1a0` se retiró del árbol activo; sus diferencias, decisiones de migración y recuperación desde Git están en [openspec/contract/README.md](openspec/contract/README.md). Las comprobaciones se refieren exclusivamente a la versión y hash del contrato actual.

### Entorno local

El Node global de la máquina donde se hizo la configuración tiene un error de biblioteca. Se verificó OpenSpec utilizando el Node 24 disponible en Codex. En esa máquina, antes de ejecutar los comandos:

```sh
export PATH="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH"
node --version
openspec --version
```

Este ajuste afecta solo a la sesión de terminal. Otros equipos con Node compatible no lo necesitan. El runtime usado para verificar OpenSpec es 24.19.0; el futuro frontend requiere **Node.js >=24.21.0 y <25**, siguiendo el proyecto de referencia. El funcionamiento del CLI no valida ese requisito del producto.
