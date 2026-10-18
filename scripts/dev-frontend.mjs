/** Arranque local de Next bajo Services; el smoke opcional no crea endpoints frontend. */
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

if (process.env.SENIALON_VERIFY_BINDING === "1") {
  const { checkBackendTransport } =
    await import("./check-backend-transport.mjs");
  let passed = false;
  for (let attempt = 0; attempt < 30; attempt++) {
    try {
      await checkBackendTransport(process.env.SENIALON_BACKEND_URL);
      passed = true;
      break;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  if (!passed) {
    console.error(
      "Binding local no verificado. No se inicia Next en modo de comprobación.",
    );
    process.exit(1);
  }
  console.log(
    "BE 3.3: binding generado verificado desde Node; 4 respuestas HTTP cumplen el contrato.",
  );
}

const next = fileURLToPath(
  new URL("../frontend/node_modules/next/dist/bin/next", import.meta.url),
);
const child = spawn(
  process.execPath,
  [next, "dev", "--hostname", "127.0.0.1", "--port", process.env.PORT],
  { stdio: "inherit", env: process.env },
);
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => child.kill(signal));
child.on("exit", (code) => process.exit(code ?? 1));
