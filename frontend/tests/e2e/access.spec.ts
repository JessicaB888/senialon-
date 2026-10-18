import { expect, test } from "@playwright/test";

const credentials = {
  username: "synthetic-e2e-operator",
  password: "synthetic-e2e-only-password",
};
const authorization = `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString("base64")}`;

test("sin credencial no se entrega la página ni el JSON", async ({
  request,
}) => {
  for (const path of ["/", "/api/v1/meta", "/not-a-page"]) {
    const response = await request.get(path);
    expect(response.status()).toBe(401);
    expect(response.headers()["www-authenticate"]).toBe(
      'Basic realm="SENIALON", charset="UTF-8"',
    );
    expect(response.headers()["cache-control"]).toContain("no-store");
    expect(await response.text()).not.toContain(
      "El radar empieza con una ejecución",
    );
  }
});

test("credencial incorrecta se rechaza sin pasar al contenido", async ({
  request,
}) => {
  const response = await request.get("/api/v1/meta", {
    headers: { Authorization: "Basic aW52YWxpZDppbnZhbGlk" },
  });
  expect(response.status()).toBe(401);
  expect((await response.json()).error.code).toBe("AUTH_REQUIRED");
});

test("el Route Handler lee FastAPI real y conserva identidad/caché/versión", async ({
  request,
}) => {
  const response = await request.get("/api/v1/meta", {
    headers: { Authorization: authorization, "X-Request-Id": "fe13:e2e:meta" },
  });
  expect(response.status()).toBe(200);
  expect(response.headers()["cache-control"]).toBe("private, no-store");
  expect(response.headers()["x-contract-version"]).toBe("1.0.0");
  expect(response.headers()["x-request-id"]).toBe("fe13:e2e:meta");
  const body = await response.json();
  expect(body.meta.request_id).toBe("fe13:e2e:meta");
  expect(body.data.contract_status).toBe("agreed");
  expect(body.data.notion.state).toBe("deferred");
  expect(JSON.stringify(body)).not.toContain(credentials.password);
  expect(JSON.stringify(body)).not.toContain(authorization);
  const exposedHeaders = JSON.stringify(response.headers());
  expect(exposedHeaders).not.toContain(authorization);
  expect(exposedHeaders).not.toContain(credentials.password);
});

test("mutaciones requieren el origen exacto antes de leer/reenviar cuerpo", async ({
  request,
}) => {
  for (const origin of [undefined, "https://attacker.example"]) {
    const response = await request.post("/api/v1/runs", {
      headers: {
        Authorization: authorization,
        ...(origin ? { Origin: origin } : {}),
      },
      data: "malformed JSON",
    });
    expect(response.status()).toBe(403);
    expect((await response.json()).error.code).toBe("ORIGIN_FORBIDDEN");
  }
});

test("un comando mal formado se rechaza localmente con 422", async ({
  request,
}) => {
  const response = await request.post("/api/v1/runs", {
    headers: { Authorization: authorization, Origin: "http://127.0.0.1:3300" },
    data: { unexpected: "synthetic invalid command" },
  });
  expect(response.status()).toBe(422);
  expect((await response.json()).error.code).toBe("VALIDATION_ERROR");
});

test("Python sigue rechazando llamadas directas sin autorización", async ({
  request,
}) => {
  const denied = await request.get("http://127.0.0.1:3301/api/v1/meta");
  expect(denied.status()).toBe(401);
  const docs = await request.get("http://127.0.0.1:3301/openapi.json", {
    headers: { Authorization: authorization },
  });
  expect(docs.status()).toBe(404);
});

test("un recurso aún no implementado conserva 404 y no aparece como éxito", async ({
  request,
}) => {
  const response = await request.get("/api/v1/runs", {
    headers: { Authorization: authorization },
  });
  expect(response.status()).toBe(404);
  expect((await response.json()).error.code).toBe("NOT_FOUND");
});

test("se rechazan intentos de saltar el proxy y páginas RSC sin credencial", async ({
  request,
}) => {
  const response = await request.get("/?_rsc=synthetic", {
    headers: {
      RSC: "1",
      "x-middleware-subrequest":
        "src/proxy:src/proxy:src/proxy:src/proxy:src/proxy",
    },
  });
  expect(response.status()).toBe(401);
  expect(await response.text()).not.toContain(
    "El radar empieza con una ejecución",
  );
});

test("el navegador accede con Basic y consulta el BFF del mismo origen", async ({
  browser,
}) => {
  const context = await browser.newContext({ httpCredentials: credentials });
  try {
    const page = await context.newPage();
    const response = await page.goto("http://127.0.0.1:3300");
    expect(response?.status()).toBe(200);
    expect(response?.headers()["cache-control"]).toContain("private");
    expect(response?.headers()["cache-control"]).toContain("no-store");
    await expect(
      page.getByRole("heading", { name: "Ejecuciones", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Iniciar recolección" }),
    ).toBeDisabled();
    const result = await page.evaluate(async () => {
      const response = await fetch("/api/v1/meta", {
        cache: "no-store",
        credentials: "same-origin",
      });
      return { status: response.status, body: await response.json() };
    });
    expect(result.status).toBe(200);
    expect(result.body.data.contract_status).toBe("agreed");
    expect(await page.content()).not.toContain(credentials.password);
    expect(await page.content()).not.toContain(authorization);
  } finally {
    await context.close();
  }
});
