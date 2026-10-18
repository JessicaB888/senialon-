import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "@/proxy";
import {
  basicChallenge,
  permittedOrigin,
  readDemoSettings,
  validateAuthorization,
} from "@/lib/auth/access";
import { requirePageAccess } from "@/lib/auth/page-access";
import Home from "@/app/page";
import NotFound from "@/app/not-found";

const { incomingHeaders, interrupt } = vi.hoisted(() => ({
  incomingHeaders: vi.fn(),
  interrupt: vi.fn(() => {
    throw new Error("SYNTHETIC_AUTH_INTERRUPT");
  }),
}));
vi.mock("next/headers", () => ({ headers: incomingHeaders }));
vi.mock("next/navigation", () => ({ unauthorized: interrupt }));

const username = "synthetic-fe-operator";
const password = "synthetic-fe-password";
const origin = "https://senialon.example";
const basic = (user = username, pass = password) =>
  `Basic ${Buffer.from(`${user}:${pass}`).toString("base64")}`;

beforeEach(() => {
  vi.stubEnv("DEMO_USERNAME", username);
  vi.stubEnv("DEMO_PASSWORD", password);
  vi.stubEnv("DEMO_ALLOWED_ORIGIN", origin);
  vi.stubEnv("VERCEL", "");
  vi.stubEnv("VERCEL_ENV", "");
  vi.clearAllMocks();
});
afterEach(() => vi.unstubAllEnvs());

describe("configuración cerrada por defecto", () => {
  it.each(["DEMO_USERNAME", "DEMO_PASSWORD", "DEMO_ALLOWED_ORIGIN"])(
    "deniega si falta %s",
    (name) => {
      vi.stubEnv(name, "");
      expect(readDemoSettings()).toBeNull();
      const response = proxy(new NextRequest(origin));
      expect(response.status).toBe(500);
    },
  );
  it.each([
    "http://external.example",
    "https://senialon.example/path",
    "https://user:pass@senialon.example",
    "https://senialon.example/",
    "https://senialon.example?x=1",
    "null",
  ])("rechaza origen configurado inválido %s", (value) => {
    vi.stubEnv("DEMO_ALLOWED_ORIGIN", value);
    expect(readDemoSettings()).toBeNull();
  });
  it("acepta HTTP solo para loopback local y exige HTTPS en preview", () => {
    vi.stubEnv("DEMO_ALLOWED_ORIGIN", "http://127.0.0.1:3000");
    expect(readDemoSettings()).not.toBeNull();
    vi.stubEnv("VERCEL", "1");
    vi.stubEnv("VERCEL_ENV", "preview");
    expect(readDemoSettings()).toBeNull();
    vi.stubEnv("VERCEL_ENV", "development");
    expect(readDemoSettings()).not.toBeNull();
  });
});

describe("credencial HTTP Basic UTF-8", () => {
  it.each([
    null,
    "Bearer wrong",
    "Basic !!!",
    "Basic /w==",
    "Basic dXNlcg==",
    basic("wrong"),
    basic(username, "wrong"),
    `${basic()}, ${basic()}`,
  ])("deniega un encabezado incorrecto sin reflejarlo", (value) => {
    expect(validateAuthorization(value, readDemoSettings()!)).toBeNull();
  });
  it("valida sin devolver el objeto de configuración y conserva UTF-8/colon", () => {
    expect(validateAuthorization(basic(), readDemoSettings()!)).toBe(basic());
    vi.stubEnv("DEMO_USERNAME", "operadór");
    vi.stubEnv("DEMO_PASSWORD", "sintético:clave");
    expect(
      validateAuthorization(
        basic("operadór", "sintético:clave"),
        readDemoSettings()!,
      ),
    ).not.toBeNull();
  });
  it("no confía en host/origen reenviado", () => {
    expect(
      permittedOrigin(
        new Headers({
          "x-forwarded-host": "senialon.example",
          "x-forwarded-proto": "https",
          origin: "https://attacker.example",
        }),
        readDemoSettings()!,
      ),
    ).toBe(false);
  });
});

describe("proxy y páginas se protegen de forma independiente", () => {
  it.each([
    "/",
    "/api/v1/meta",
    "/api/v1/runs",
    "/unknown",
    "/branding/senialon-dark.png/private",
    "/_next/image?url=private",
  ])("el proxy deniega %s con challenge y sin datos", async (path) => {
    const response = proxy(new NextRequest(new URL(path, origin)));
    expect(response.status).toBe(401);
    expect(response.headers.get("WWW-Authenticate")).toBe(basicChallenge);
    expect(response.headers.get("Cache-Control")).toBe("private, no-store");
    if (path.startsWith("/api/")) {
      const body = await response.json();
      expect(body.meta.request_id).toBe(response.headers.get("x-request-id"));
      expect(body.error.code).toBe("AUTH_REQUIRED");
      expect(JSON.stringify(body)).not.toContain(password);
    } else {
      expect(await response.text()).toContain(
        "se requiere la credencial de demo",
      );
    }
  });
  it("conserva la identidad válida al permitir el acceso", () => {
    const response = proxy(
      new NextRequest(origin, {
        headers: { authorization: basic(), "x-request-id": "fe13:proxy" },
      }),
    );
    expect(response.headers.get("x-middleware-next")).toBe("1");
    expect(response.headers.get("x-request-id")).toBe("fe13:proxy");
  });
  it("rechaza mutación aun con credencial válida si el origen no coincide", () => {
    expect(
      proxy(
        new NextRequest(`${origin}/api/v1/runs`, {
          method: "POST",
          headers: {
            authorization: basic(),
            origin: "https://attacker.example",
          },
        }),
      ).status,
    ).toBe(403);
  });
  it.each([
    "/icon.png",
    "/branding/senialon-dark.png",
    "/_next/static/chunks/build.js",
  ])("permite solamente el asset público %s", (path) => {
    expect(
      proxy(new NextRequest(new URL(path, origin))).headers.get(
        "x-middleware-next",
      ),
    ).toBe("1");
  });
  it("la guarda de página deniega sin depender del proxy o layout", async () => {
    incomingHeaders.mockResolvedValue(new Headers());
    await expect(requirePageAccess()).rejects.toThrow(
      "SYNTHETIC_AUTH_INTERRUPT",
    );
    expect(interrupt).toHaveBeenCalledOnce();
  });
  it("la guarda no serializa ni devuelve una credencial", async () => {
    incomingHeaders.mockResolvedValue(new Headers({ authorization: basic() }));
    await expect(requirePageAccess()).resolves.toBeUndefined();
    expect(interrupt).not.toHaveBeenCalled();
  });
  it.each([
    ["inicio", Home],
    ["página inexistente", NotFound],
  ] as const)(
    "la página %s deniega si se invoca directamente sin proxy",
    async (_name, render) => {
      incomingHeaders.mockResolvedValue(new Headers());
      await expect(render()).rejects.toThrow("SYNTHETIC_AUTH_INTERRUPT");
      expect(interrupt).toHaveBeenCalledOnce();
    },
  );
});
