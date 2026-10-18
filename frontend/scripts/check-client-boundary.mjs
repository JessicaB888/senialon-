import { readdir, readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const staticRoot = new URL("../.next/static/", import.meta.url);
const privateNames = [
  "DEMO_USERNAME",
  "DEMO_PASSWORD",
  "DEMO_ALLOWED_ORIGIN",
  "SENIALON_BACKEND_URL",
];

export async function checkClientBoundary(markers = []) {
  let checked = 0;
  async function visit(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const target = new URL(
        entry.name + (entry.isDirectory() ? "/" : ""),
        directory,
      );
      if (entry.isDirectory()) await visit(target);
      else if (/\.(js|json|map|html|css)$/.test(entry.name)) {
        const content = await readFile(target, "utf8");
        if (
          [...privateNames, ...markers].some(
            (value) => value && content.includes(value),
          )
        ) {
          // Report neither the secret nor the matching content.
          throw new Error(
            "La comprobación de separación cliente/servidor falló.",
          );
        }
        checked++;
      }
    }
  }
  await visit(staticRoot);
  if (!checked)
    throw new Error("No se encontraron artefactos cliente del build.");
  return checked;
}

if (
  process.argv[1] &&
  pathToFileURL(process.argv[1]).href === import.meta.url
) {
  try {
    const checked = await checkClientBoundary();
    console.log(
      `Separación cliente/servidor verificada en ${checked} artefactos.`,
    );
  } catch {
    console.error(
      "No se pudo verificar el build cliente; revisar sin publicar secretos.",
    );
    process.exitCode = 1;
  }
}
