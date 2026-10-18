import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import ts from "typescript";

// Type-check canonical examples in memory: no competing fixture source is written.
const source = new URL("../../docs/contracts/openapi.json", import.meta.url);
const document = JSON.parse(readFileSync(source, "utf8"));
const virtualFile = fileURLToPath(
  new URL("../tests/__canonical_examples__.ts", import.meta.url),
);
const content = [
  'import type { components } from "../src/lib/api/generated/openapi";',
  ...Object.entries(document.components.examples).map(
    ([name, example], index) =>
      `// SINTÉTICO: ${name}\nconst fixture${index}: components["schemas"][${JSON.stringify(example["x-schema"])}] = ${JSON.stringify(example.value)};`,
  ),
].join("\n");
const options = {
  strict: true,
  noEmit: true,
  skipLibCheck: false,
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  types: [],
};
const host = ts.createCompilerHost(options);
const read = host.getSourceFile.bind(host);
host.getSourceFile = (file, languageVersion, onError, create) =>
  file === virtualFile
    ? ts.createSourceFile(file, content, languageVersion, true)
    : read(file, languageVersion, onError, create);
const program = ts.createProgram([virtualFile], options, host);
const diagnostics = ts.getPreEmitDiagnostics(program);
if (diagnostics.length) {
  console.error(
    ts.formatDiagnosticsWithColorAndContext(diagnostics, {
      getCanonicalFileName: (name) => name,
      getCurrentDirectory: () => process.cwd(),
      getNewLine: () => "\n",
    }),
  );
  process.exitCode = 1;
} else {
  console.log(
    `${Object.keys(document.components.examples).length} ejemplos canónicos comprobados contra los tipos generados, sin emitir archivos.`,
  );
}
