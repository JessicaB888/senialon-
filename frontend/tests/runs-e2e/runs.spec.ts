import { expect, test, type APIRequestContext } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const control = "http://127.0.0.1:3341/__test";
async function scenario(request: APIRequestContext, name: string) {
  await request.post(`${control}/scenario`, { data: { scenario: name } });
}
async function commands(request: APIRequestContext) {
  const result: Array<{
    method: string;
    path: string;
    key: string;
    body: unknown;
  }> = await (await request.get(`${control}/requests`)).json();
  return result.filter((item) => item.method === "POST");
}
test.beforeEach(async ({ request }) => {
  await scenario(request, "partial");
});

test("muestra ventanas exactas, once canales y cero observado distinto de desconocido", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Ejecución anterior", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "America/Bogota · UTC−5 · el día en curso queda fuera de ambas ventanas.",
    ),
  ).toBeVisible();
  await expect(page.getByText(/3.*oct.*2026.*00:00:00/).first()).toBeVisible();
  const table = page.getByRole("table");
  await expect(table.getByRole("row")).toHaveCount(12);
  const failed = table.getByRole("row").filter({ hasText: "@30XDevs" });
  await expect(failed).toContainText("Desconocido · consulta incompleta");
  await expect(
    table.getByRole("row").filter({ hasText: "@Platzi" }),
  ).toContainText("0 publicaciones observadas");
  await failed.getByText("Ver etapas").first().click();
  await expect(failed).toContainText("Cuota insuficiente en el fixture.");
  await expect(
    page.getByRole("button", { name: "Solicitar siguiente paso" }),
  ).toBeEnabled();
  expect(await commands(request)).toHaveLength(0);
});

test("crear guarda una ejecución sin avanzar y navega a su identidad", async ({
  page,
  request,
}) => {
  await scenario(request, "empty");
  await page.goto("/");
  await expect(
    page.getByText(/Todavía no hay ejecuciones guardadas/),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Crear ejecución", exact: true })
    .click();
  await expect(page).toHaveURL(/run=fixture-run-001/);
  await expect(
    page.getByRole("heading", { name: "Ejecución anterior" }),
  ).toBeVisible();
  const sent = await commands(request);
  expect(sent).toHaveLength(1);
  expect(sent[0].path).toBe("/api/v1/runs");
  expect(sent[0].body).toEqual({});
});

test("avanzar envía una unidad; recargar o actualizar solo consulta", async ({
  page,
  request,
}) => {
  await page.goto("/?run=fixture-run-001");
  await page.getByRole("button", { name: "Solicitar siguiente paso" }).click();
  await expect(page.getByText(/Paso confirmado ·/)).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Actualizar estado" }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "Actualizar estado" }).click();
  await expect(
    page.getByRole("button", { name: "Actualizar estado" }),
  ).toBeEnabled();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Ejecución anterior" }),
  ).toBeVisible();
  const sent = await commands(request);
  expect(sent).toHaveLength(1);
  expect(sent[0].body).toEqual({
    expected_run_revision: 10,
    target: { scope: "corpus" },
  });
  expect(sent[0].key.length).toBeGreaterThanOrEqual(16);
});

test("recupera operación sin checkpoint desde otro navegador, sin crear solicitudes", async ({
  browser,
  request,
}) => {
  await scenario(request, "lost");
  const context = await browser.newContext({
    httpCredentials: {
      username: "synthetic-e2e-operator",
      password: "synthetic-e2e-only-password",
    },
  });
  try {
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:3340/");
    await expect(
      page.getByText("Ningún paso confirmado todavía"),
    ).toBeVisible();
    await page.getByRole("button", { name: /Consultar operación/ }).click();
    await expect(
      page.getByText(/Otra solicitud figura en proceso/),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Solicitar siguiente paso" }),
    ).toBeDisabled();
    expect(await commands(request)).toHaveLength(0);
  } finally {
    await context.close();
  }
});

test("resultado incierto muestra conciliación y no ofrece reenviar", async ({
  page,
  request,
}) => {
  await scenario(request, "uncertain");
  await page.goto("/");
  await page.getByRole("button", { name: /Consultar operación/ }).click();
  await expect(page.getByText(/Conciliación manual requerida/)).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Reenviar la misma solicitud" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Solicitar siguiente paso" }),
  ).toBeDisabled();
  expect(await commands(request)).toHaveLength(0);
});

test("reenvío manual solo después de GET autorizado conserva clave y cuerpo", async ({
  page,
  request,
}) => {
  await scenario(request, "retry");
  await page.goto("/");
  await page.getByRole("button", { name: "Solicitar siguiente paso" }).click();
  await expect(
    page.getByText("Solicitud pendiente de confirmar"),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Reenviar la misma solicitud" }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: /Consultar operación/ }).click();
  await page
    .getByRole("button", { name: "Reenviar la misma solicitud" })
    .click();
  await expect(page.getByText(/Paso confirmado ·/)).toBeVisible();
  const sent = await commands(request);
  expect(sent).toHaveLength(2);
  expect(sent[1].key).toBe(sent[0].key);
  expect(sent[1].body).toEqual(sent[0].body);
});

test("pérdida de respuesta conserva recibo y recupera la operación sin repetir POST", async ({
  page,
  request,
}) => {
  await scenario(request, "lost-after-send");
  await page.goto("/");
  await page.getByRole("button", { name: "Solicitar siguiente paso" }).click();
  await expect(
    page.getByText("Solicitud pendiente de confirmar"),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Actualizar estado" }),
  ).toBeEnabled();
  await page.reload();
  await expect(
    page.getByText("Solicitud pendiente de confirmar"),
  ).toBeVisible();
  await page.getByRole("button", { name: /Consultar operación/ }).click();
  await expect(page.getByText(/Conciliación manual requerida/)).toBeVisible();
  expect(await commands(request)).toHaveLength(1);
});

test("error al actualizar conserva contexto y cobertura anteriores", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await expect(page.getByRole("table")).toBeVisible();
  await request.post(`${control}/fail`, { data: { reads: "all" } });
  await page.getByRole("button", { name: "Actualizar estado" }).click();
  await expect(
    page.getByText(/Se conserva la última lectura disponible/),
  ).toBeVisible();
  await expect(page.getByRole("table")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Solicitar siguiente paso" }),
  ).toBeDisabled();
  expect(await commands(request)).toHaveLength(0);
});

test("paginación conserva cursor opaco y no oculta ejecuciones anteriores", async ({
  page,
  request,
}) => {
  await scenario(request, "paged");
  await page.goto("/");
  await page.getByRole("button", { name: "Ver más ejecuciones" }).click();
  await expect(
    page.getByRole("link", { name: /Abrir ejecución.*fixture-run-002/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Ver más ejecuciones" }),
  ).toHaveCount(0);
  expect(await commands(request)).toHaveLength(0);
});

test("fallo solo de cobertura conserva la lectura anterior identificada", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await expect(page.getByRole("table")).toBeVisible();
  await request.post(`${control}/fail`, { data: { reads: "coverage" } });
  await page.getByRole("button", { name: "Actualizar estado" }).click();
  await page.getByText("Última cobertura recibida · revisión 10").click();
  await expect(
    page.getByText(
      "Lectura anterior conservada. No describe necesariamente el estado actual.",
    ),
  ).toBeVisible();
  await expect(page.getByRole("table")).toBeVisible();
  expect(await commands(request)).toHaveLength(0);
});

test("conflicto al paginar conserva un solo listado y exige actualizar", async ({
  page,
  request,
}) => {
  await scenario(request, "paged-conflict");
  await page.goto("/");
  await page.getByRole("button", { name: "Ver más ejecuciones" }).click();
  await expect(
    page.getByText(
      "Listado anterior conservado. Actualiza antes de cargar otra página.",
    ),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Ver más ejecuciones" }),
  ).toBeDisabled();
  await expect(
    page.getByRole("link", { name: /Abrir ejecución.*fixture-run-002/ }),
  ).toHaveCount(0);
  expect(await commands(request)).toHaveLength(0);
});

test("inspección conjunta escritorio/móvil: composición, teclado y desbordamiento", async ({
  page,
}) => {
  await mkdir("/private/tmp/senialon-fe14", { recursive: true });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(page.getByRole("table")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Crear ejecución", exact: true }),
  ).toBeEnabled();
  await page.screenshot({
    path: "/private/tmp/senialon-fe14/desktop.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: "/private/tmp/senialon-fe14/mobile.png",
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.setViewportSize({ width: 320, height: 720 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Saltar al contenido" }),
  ).toBeFocused();
});
