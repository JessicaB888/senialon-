# SENIALON

Detectamos la señal cuando apenas se enciende.

## Documentos del producto

- [Definición del MVP](docs/DEFINICION_MVP.md).
- [Plan de trabajo](docs/PLAN_DE_TRABAJO.md).

## OpenSpec

Configurado con OpenSpec **1.14.3**, esquema `spec-driven`, perfil `core` e integración para Codex. Las especificaciones y el código del producto todavía no se han generado.

Requiere Node.js **20.19.0 o posterior**. Para preparar otra máquina:

```sh
npm install -g @fission-ai/openspec@1.14.3
openspec --version
```

La configuración del proyecto y las skills ya están en `openspec/` y `.agents/skills/`; no hace falta repetir la inicialización al clonar el repositorio.

Para comenzar en Codex, seleccionar la skill `openspec-explore` o invocarla como `$openspec-explore`. El siguiente flujo, `openspec-propose`, genera los artefactos de planificación cuando se solicite. [Documentación de la integración](https://openspec.dev/docs/supported-tools#codex).

El contexto y las reglas de SENIALON están en [openspec/config.yaml](openspec/config.yaml). El trabajo comienza por las especificaciones antes de implementar el producto.

### Entorno local

El Node global de la máquina donde se hizo la configuración tiene un error de biblioteca. Se verificó OpenSpec utilizando el Node 24 disponible en Codex. En esa máquina, antes de ejecutar los comandos:

```sh
export PATH="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH"
node --version
openspec --version
```

Este ajuste afecta solo a la sesión de terminal. Otros equipos con Node compatible no lo necesitan.
