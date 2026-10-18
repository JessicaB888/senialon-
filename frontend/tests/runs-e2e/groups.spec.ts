import { expect, test, type APIRequestContext } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const control = "http://127.0.0.1:3341/__test";
async function scenario(request: APIRequestContext, name = "groups") {
  await request.post(`${control}/scenario`, { data: { scenario: name } });
}
async function commands(request: APIRequestContext) {
  const values: Array<{
    method: string;
    path: string;
    key: string;
    body: unknown;
  }> = await (await request.get(`${control}/requests`)).json();
  return values.filter((value) => value.method === "POST");
}
test.beforeEach(async ({ request }) => {
  await scenario(request);
});

test("inspección explícita muestra versión, evidencia y secundarios sin edición ni POST", async ({
  page,
  request,
}) => {
  await scenario(request, "groups-secondary");
  await page.goto("/");
  const groups = page.locator("#grupos");
  await expect(groups.getByText(/Todavía no se ha consultado/)).toBeVisible();
  await groups.getByRole("button", { name: "Consultar grupos" }).click();
  await expect(
    groups.getByText("Versión 1 · Propuesta", { exact: true }),
  ).toBeVisible();
  await expect(groups.getByText(/Propuesta creada el/)).toBeVisible();
  await expect(
    groups.getByText(/Comparación pendiente: esta propuesta/),
  ).toBeVisible();
  await expect(
    groups.getByText(/Secundarios sin conteo: Tema secundario/),
  ).toBeVisible();
  await groups
    .getByText("Inspeccionar evidencia de la asignación", { exact: true })
    .first()
    .click();
  const openedEvidence = groups.locator("details[open]");
  await expect(openedEvidence.getByText("Evidencia textual")).toBeVisible();
  await expect(
    openedEvidence.getByRole("link", { name: /Fuente registrada/ }),
  ).toHaveAttribute("href", "https://example.invalid/watch/demoA000001");
  await expect(
    groups.locator("input,select,textarea,[contenteditable=true]"),
  ).toHaveCount(0);
  expect(await commands(request)).toHaveLength(0);
});

test("confirmación usa versión/revisión exactas y no inicia comparación ni aprobación editorial", async ({
  page,
  request,
}) => {
  await page.goto("/");
  const groups = page.locator("#grupos");
  await groups.getByRole("button", { name: "Consultar grupos" }).click();
  await groups.getByRole("button", { name: "Confirmar esta versión" }).click();
  await expect(
    groups.getByText("Versión 1 · Confirmada", { exact: true }),
  ).toBeVisible();
  await expect(groups.getByText(/Confirmación registrada el/)).toBeVisible();
  await expect(
    groups.getByText(/Las oportunidades conservan su revisión pendiente/),
  ).toBeVisible();
  await expect(
    groups.getByRole("button", { name: "Confirmar esta versión" }),
  ).toBeDisabled();
  const sent = await commands(request);
  expect(sent).toHaveLength(1);
  expect(sent[0].path).toBe("/api/v1/runs/fixture-run-001/groups/confirmation");
  expect(sent[0].body).toEqual({
    expected_run_revision: 10,
    groups_id: "fixture-groups-001",
    groups_version: 1,
  });
  expect(sent[0].key.length).toBeGreaterThanOrEqual(16);
  await page.reload();
  await page
    .locator("#grupos")
    .getByRole("button", { name: "Consultar grupos" })
    .click();
  await expect(
    page
      .locator("#grupos")
      .getByText("Versión 1 · Confirmada", { exact: true }),
  ).toBeVisible();
  expect(await commands(request)).toHaveLength(1);
});

test("409 conserva la versión anterior y exige inspección de la nueva antes de confirmar", async ({
  page,
  request,
}) => {
  await scenario(request, "groups-conflict");
  await page.goto("/");
  const groups = page.locator("#grupos");
  await groups.getByRole("button", { name: "Consultar grupos" }).click();
  await groups.getByRole("button", { name: "Confirmar esta versión" }).click();
  await expect(groups.getByText(/Propuesta anterior conservada/)).toBeVisible();
  await expect(
    groups.getByText("Versión 1 · Propuesta", { exact: true }),
  ).toBeVisible();
  await expect(
    groups.getByRole("button", { name: "Confirmar esta versión" }),
  ).toBeDisabled();
  expect(await commands(request)).toHaveLength(1);
  await groups.getByRole("button", { name: "Actualizar grupos" }).click();
  await expect(
    groups.getByText("Versión 2 · Propuesta", { exact: true }),
  ).toBeVisible();
  await groups.getByRole("button", { name: "Confirmar esta versión" }).click();
  await expect(
    groups.getByText("Versión 2 · Confirmada", { exact: true }),
  ).toBeVisible();
  const sent = await commands(request);
  expect(sent).toHaveLength(2);
  expect(sent[1].key).not.toBe(sent[0].key);
  expect(sent[1].body).toEqual({
    expected_run_revision: 11,
    groups_id: "fixture-groups-001",
    groups_version: 2,
  });
});

test("respuesta perdida conserva recibo y recupera confirmación por GET después de recargar", async ({
  page,
  request,
}) => {
  await scenario(request, "groups-lost-after-send");
  await page.goto("/");
  let groups = page.locator("#grupos");
  await groups.getByRole("button", { name: "Consultar grupos" }).click();
  await groups.getByRole("button", { name: "Confirmar esta versión" }).click();
  await expect(
    groups.getByText(/Hay una confirmación sin respuesta definitiva/),
  ).toBeVisible();
  await page.reload();
  groups = page.locator("#grupos");
  await expect(
    groups.getByText(/Hay una confirmación sin respuesta definitiva/),
  ).toBeVisible();
  await groups.getByRole("button", { name: "Consultar grupos" }).click();
  await expect(
    groups.getByText(/Confirmación recuperada del servidor/),
  ).toBeVisible();
  await expect(
    groups.getByText("Versión 1 · Confirmada", { exact: true }),
  ).toBeVisible();
  await expect(
    groups.getByText(/Hay una confirmación sin respuesta definitiva/),
  ).toHaveCount(0);
  expect(await commands(request)).toHaveLength(1);
});

test("sin propuesta conserva motivo y comparación pendiente sin inventar grupos", async ({
  page,
  request,
}) => {
  await scenario(request, "groups-pending");
  await page.goto("/");
  const groups = page.locator("#grupos");
  await groups.getByRole("button", { name: "Consultar grupos" }).click();
  await expect(
    groups.getByText("Sin propuesta disponible", { exact: true }),
  ).toBeVisible();
  await expect(
    groups.getByText("Propuesta sintética aún no disponible."),
  ).toBeVisible();
  await expect(
    groups.getByRole("button", { name: "Confirmar esta versión" }),
  ).toHaveCount(0);
  expect(await commands(request)).toHaveLength(0);
});

test("reenvío manual conserva cuerpo/clave y requiere GET de la operación con permiso", async ({
  page,
  request,
}) => {
  await scenario(request, "groups-retry");
  await page.goto("/");
  const groups = page.locator("#grupos");
  await groups.getByRole("button", { name: "Consultar grupos" }).click();
  await groups.getByRole("button", { name: "Confirmar esta versión" }).click();
  await expect(
    groups.getByText(/Hay una confirmación sin respuesta definitiva/),
  ).toBeVisible();
  await expect(
    groups.getByRole("button", { name: "Reenviar la misma confirmación" }),
  ).toHaveCount(0);
  await groups.getByRole("button", { name: "Actualizar grupos" }).click();
  await groups
    .getByRole("button", { name: "Reenviar la misma confirmación" })
    .click();
  await expect(
    groups.getByText("Versión 1 · Confirmada", { exact: true }),
  ).toBeVisible();
  const sent = await commands(request);
  expect(sent).toHaveLength(2);
  expect(sent[1].key).toBe(sent[0].key);
  expect(sent[1].body).toEqual(sent[0].body);
  const all: Array<{ method: string; path: string }> = await (
    await request.get(`${control}/requests`)
  ).json();
  expect(
    all.some(
      (item) =>
        item.method === "GET" &&
        item.path.endsWith("/operations/fixture-operation-001"),
    ),
  ).toBe(true);
});

test("confirmación incierta permite consultar y mantiene bloqueado el reenvío", async ({
  page,
  request,
}) => {
  await scenario(request, "groups-uncertain");
  await page.goto("/");
  const groups = page.locator("#grupos");
  await groups.getByRole("button", { name: "Consultar grupos" }).click();
  await groups.getByRole("button", { name: "Confirmar esta versión" }).click();
  await expect(
    groups.getByText(/Hay una confirmación sin respuesta definitiva/),
  ).toBeVisible();
  await groups.getByRole("button", { name: "Actualizar grupos" }).click();
  await expect(
    groups.getByText(/Resultado incierto: requiere conciliación/),
  ).toBeVisible();
  await expect(
    groups.getByRole("button", { name: "Reenviar la misma confirmación" }),
  ).toHaveCount(0);
  await expect(
    groups.getByRole("button", { name: "Confirmar esta versión" }),
  ).toBeDisabled();
  expect(await commands(request)).toHaveLength(1);
});

test("fallo de lectura conserva propuesta visible y bloquea confirmación", async ({
  page,
  request,
}) => {
  await page.goto("/");
  const groups = page.locator("#grupos");
  await groups.getByRole("button", { name: "Consultar grupos" }).click();
  await request.post(`${control}/fail`, { data: { reads: "groups" } });
  await groups.getByRole("button", { name: "Actualizar grupos" }).click();
  await expect(
    groups.getByText(/No se pudo consultar o confirmar la propuesta/),
  ).toBeVisible();
  await expect(
    groups.getByText("Versión 1 · Propuesta", { exact: true }),
  ).toBeVisible();
  await expect(
    groups.getByRole("button", { name: "Confirmar esta versión" }),
  ).toBeDisabled();
  expect(await commands(request)).toHaveLength(0);
});

test("grupos en escritorio y móvil conservan jerarquía y no desbordan a 320 px", async ({
  page,
}) => {
  await mkdir("/private/tmp/senialon-fe15", { recursive: true });
  await scenario(page.request, "groups-secondary");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const groups = page.locator("#grupos");
  await groups.getByRole("button", { name: "Consultar grupos" }).click();
  await expect(
    groups.getByRole("button", { name: "Confirmar esta versión" }),
  ).toBeEnabled();
  await groups.screenshot({ path: "/private/tmp/senialon-fe15/desktop.png" });
  await page.setViewportSize({ width: 390, height: 844 });
  await groups.screenshot({ path: "/private/tmp/senialon-fe15/mobile.png" });
  await page.setViewportSize({ width: 320, height: 720 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
