import { randomBytes } from "node:crypto";
import { spawnSync } from "node:child_process";
import { checkClientBoundary } from "./check-client-boundary.mjs";

// Deliberately build with fresh synthetic markers to detect accidental inlining.
// Test server credentials are configured independently in playwright.config.ts.
const username = `synthetic-build-${randomBytes(16).toString("hex")}`;
const password = `synthetic-build-${randomBytes(24).toString("hex")}`;
const binding = "http://127.0.0.1:3301/synthetic-build-binding/";
const encoded = Buffer.from(`${username}:${password}`).toString("base64");
const markers = [username, password, encoded, binding];
const build = spawnSync(
  process.platform === "win32" ? "npm.cmd" : "npm",
  ["run", "build"],
  {
    encoding: "utf8",
    env: {
      ...process.env,
      DEMO_USERNAME: username,
      DEMO_PASSWORD: password,
      DEMO_ALLOWED_ORIGIN: "http://127.0.0.1:3300",
      SENIALON_BACKEND_URL: binding,
    },
  },
);
const logs = (build.stdout ?? "") + (build.stderr ?? "");
if (markers.some((marker) => logs.includes(marker))) {
  console.error(
    "El build reflejó un marcador privado; su salida se ha retenido.",
  );
  process.exit(1);
}
process.stdout.write(logs);
if (build.error || build.status !== 0) process.exit(1);
try {
  const checked = await checkClientBoundary(markers);
  console.log(
    `Marcadores sintéticos ausentes de logs y ${checked} artefactos cliente.`,
  );
} catch {
  console.error("La separación cliente/servidor no pasó la comprobación.");
  process.exitCode = 1;
}
