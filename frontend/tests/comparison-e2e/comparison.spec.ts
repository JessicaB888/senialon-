import { expect, test } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const harness = "http://127.0.0.1:3351";
test.beforeEach(async ({ request }) => {
  await request.post(`${harness}/__test/scenario`, {
    data: { scenario: "comparison-ready" },
  });
});
async function advances(request: import("@playwright/test").APIRequestContext) {
  const result = await request.get(`${harness}/__test/requests`);
  const rows = (await result.json()) as {
    method: string;
    path: string;
    key: string;
    body: unknown;
  }[];
  return rows.filter(
    (row) => row.method === "POST" && row.path.endsWith("/advance"),
  );
}

test("leer no calcula; acción explícita muestra la comparación y sus fuentes", async ({
  page,
  request,
}) => {
  await page.goto("/?run=fixture-run-001#comparacion");
  const panel = page.locator("#comparacion");
  await expect(
    panel.getByRole("button", { name: "Calcular comparación", exact: true }),
  ).toBeDisabled();
  await panel.getByRole("button", { name: "Consultar comparación" }).click();
  await expect(
    panel.getByRole("button", { name: "Calcular comparación", exact: true }),
  ).toBeEnabled();
  expect(await advances(request)).toHaveLength(0);
  await panel
    .getByRole("button", { name: "Calcular comparación", exact: true })
    .click();
  await expect(panel.getByText("+100 %", { exact: true })).toBeVisible();
  await panel.getByText(/^Ver publicaciones y aporte por canal:/).click();
  await expect(
    panel.locator('a[href="https://www.youtube.com/watch?v=demoA000001"]'),
  ).toBeVisible();
  const commands = await advances(request);
  expect(commands).toHaveLength(1);
  expect(commands[0].body).toEqual({
    expected_run_revision: 10,
    target: { scope: "comparison" },
  });
  await panel.getByRole("button", { name: "Consultar comparación" }).click();
  expect(await advances(request)).toHaveLength(1);
});

test("grupos sin confirmar mantienen el cálculo deshabilitado", async ({
  page,
  request,
}) => {
  await request.post(`${harness}/__test/scenario`, {
    data: { scenario: "comparison-unconfirmed" },
  });
  await page.goto("/?run=fixture-run-001#comparacion");
  const panel = page.locator("#comparacion");
  await panel.getByRole("button", { name: "Consultar comparación" }).click();
  await expect(
    panel.getByText("Grupos pendientes de confirmar", { exact: true }),
  ).toBeVisible();
  await expect(
    panel.getByRole("button", { name: "Calcular comparación", exact: true }),
  ).toBeDisabled();
  expect(await advances(request)).toHaveLength(0);
});

test("cobertura parcial conserva desconocido y oculta porcentaje y novedad", async ({
  page,
  request,
}) => {
  await request.post(`${harness}/__test/scenario`, {
    data: { scenario: "comparison-partial" },
  });
  await page.goto("/?run=fixture-run-001#comparacion");
  const panel = page.locator("#comparacion");
  await panel.getByRole("button", { name: "Consultar comparación" }).click();
  await expect(panel.getByRole("table")).toContainText("Desconocido");
  await expect(panel.getByRole("table")).not.toContainText(
    "Nuevo en el corpus",
  );
  await expect(panel.getByRole("table")).not.toContainText("%");
});

test("respuesta perdida se recupera tras recargar sin otro POST", async ({
  page,
  request,
}) => {
  await request.post(`${harness}/__test/scenario`, {
    data: { scenario: "comparison-lost" },
  });
  await page.goto("/?run=fixture-run-001#comparacion");
  const panel = page.locator("#comparacion");
  await panel.getByRole("button", { name: "Consultar comparación" }).click();
  await panel
    .getByRole("button", { name: "Calcular comparación", exact: true })
    .click();
  await expect(panel.getByRole("alert")).toBeVisible();
  await page.reload();
  await panel.getByRole("button", { name: "Consultar comparación" }).click();
  await expect(panel.getByText("+100 %", { exact: true })).toBeVisible();
  await expect(
    panel.getByText(
      "Hay una solicitud de comparación pendiente de confirmar.",
      { exact: false },
    ),
  ).toHaveCount(0);
  expect(await advances(request)).toHaveLength(1);
});

test("una operación incierta se consulta y no habilita reenvío", async ({
  page,
  request,
}) => {
  await request.post(`${harness}/__test/scenario`, {
    data: { scenario: "comparison-uncertain" },
  });
  await page.goto("/?run=fixture-run-001#comparacion");
  const panel = page.locator("#comparacion");
  await panel.getByRole("button", { name: "Consultar comparación" }).click();
  await panel
    .getByRole("button", { name: "Calcular comparación", exact: true })
    .click();
  await panel.getByRole("button", { name: "Consultar comparación" }).click();
  await expect(
    panel.getByRole("button", { name: "Reenviar la misma solicitud" }),
  ).toHaveCount(0);
  await expect(
    panel.getByRole("button", { name: "Calcular comparación", exact: true }),
  ).toBeDisabled();
  expect(await advances(request)).toHaveLength(1);
});

test("reenvío manual solo después de GET y con cuerpo/clave originales", async ({
  page,
  request,
}) => {
  await request.post(`${harness}/__test/scenario`, {
    data: { scenario: "comparison-retry" },
  });
  await page.goto("/?run=fixture-run-001#comparacion");
  const panel = page.locator("#comparacion");
  await panel.getByRole("button", { name: "Consultar comparación" }).click();
  await panel
    .getByRole("button", { name: "Calcular comparación", exact: true })
    .click();
  await expect(
    panel.getByRole("button", { name: "Reenviar la misma solicitud" }),
  ).toHaveCount(0);
  await panel.getByRole("button", { name: "Consultar comparación" }).click();
  await panel
    .getByRole("button", { name: "Reenviar la misma solicitud" })
    .click();
  await expect(panel.getByText("+100 %", { exact: true })).toBeVisible();
  const commands = await advances(request);
  expect(commands).toHaveLength(2);
  expect(commands[0].key).toBe(commands[1].key);
  expect(commands[0].body).toEqual(commands[1].body);
});

test("un fallo de lectura conserva las cifras anteriores identificadas", async ({
  page,
  request,
}) => {
  await request.post(`${harness}/__test/scenario`, {
    data: { scenario: "comparison-complete" },
  });
  await page.goto("/?run=fixture-run-001#comparacion");
  const panel = page.locator("#comparacion");
  await panel.getByRole("button", { name: "Consultar comparación" }).click();
  await request.post(`${harness}/__test/fail`, {
    data: { reads: "comparison" },
  });
  await panel.getByRole("button", { name: "Consultar comparación" }).click();
  await expect(
    panel.getByText("Lectura anterior conservada.", { exact: false }),
  ).toBeVisible();
  await expect(panel.getByText("+100 %", { exact: true })).toBeVisible();
  await expect(
    panel.getByRole("button", { name: "Calcular comparación", exact: true }),
  ).toBeDisabled();
});

test("inspección visual de FE 1.6 en escritorio y móvil, datos sintéticos", async ({
  page,
  request,
}) => {
  await request.post(`${harness}/__test/scenario`, {
    data: { scenario: "comparison-complete" },
  });
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto("/?run=fixture-run-001#comparacion");
  const panel = page.locator("#comparacion");
  await panel.getByRole("button", { name: "Consultar comparación" }).click();
  await expect(panel.getByText("+100 %", { exact: true })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  const directory = "/private/tmp/senialon-fe16-visual";
  await mkdir(directory, { recursive: true });
  await panel.screenshot({ path: `${directory}/desktop.png` });
  await page.setViewportSize({ width: 390, height: 1100 });
  await panel.scrollIntoViewIfNeeded();
  const dimensions = await page.evaluate(() => ({
    body: document.body.scrollWidth,
    width: innerWidth,
  }));
  expect(dimensions.body).toBeLessThanOrEqual(dimensions.width);
  await panel.screenshot({ path: `${directory}/mobile.png` });
});
