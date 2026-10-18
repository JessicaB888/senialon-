import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";

export const basicChallenge = 'Basic realm="SENIALON", charset="UTF-8"';

export type DemoSettings = Readonly<{
  username: string;
  password: string;
  allowedOrigin: string;
}>;

export function readDemoSettings(): DemoSettings | null {
  const username = process.env.DEMO_USERNAME ?? "";
  const password = process.env.DEMO_PASSWORD ?? "";
  const allowedOrigin = process.env.DEMO_ALLOWED_ORIGIN ?? "";
  if (
    !username.trim() ||
    !password.trim() ||
    username.includes(":") ||
    /[\u0000-\u001f\u007f]/.test(username + password)
  ) {
    return null;
  }
  try {
    const origin = new URL(allowedOrigin);
    const deployed =
      process.env.VERCEL === "1" && process.env.VERCEL_ENV !== "development";
    const local = ["localhost", "127.0.0.1", "[::1]"].includes(origin.hostname);
    if (
      origin.origin !== allowedOrigin ||
      origin.username ||
      origin.password ||
      !(
        origin.protocol === "https:" ||
        (!deployed && local && origin.protocol === "http:")
      )
    ) {
      return null;
    }
    return { username, password, allowedOrigin };
  } catch {
    return null;
  }
}

function equalSecret(left: string, right: string): boolean {
  // Fixed-size digests allow constant-time comparison even for unequal lengths.
  return timingSafeEqual(
    createHash("sha256").update(left, "utf8").digest(),
    createHash("sha256").update(right, "utf8").digest(),
  );
}

export function validateAuthorization(
  value: string | null,
  settings: DemoSettings,
): string | null {
  if (!value || value.length > 4096) return null;
  const match = /^Basic ([A-Za-z0-9+/]+={0,2})$/i.exec(value);
  if (!match) return null;
  try {
    const bytes = Buffer.from(match[1], "base64");
    if (bytes.toString("base64") !== match[1]) return null;
    const decoded = new TextDecoder("utf-8", {
      fatal: true,
      ignoreBOM: true,
    }).decode(bytes);
    const separator = decoded.indexOf(":");
    if (separator < 0) return null;
    const username = decoded.slice(0, separator);
    const password = decoded.slice(separator + 1);
    const userMatches = equalSecret(username, settings.username);
    const passwordMatches = equalSecret(password, settings.password);
    if (!userMatches || !passwordMatches) return null;
    return `Basic ${match[1]}`;
  } catch {
    return null;
  }
}

export function requiresOrigin(method: string): boolean {
  return !["GET", "HEAD", "OPTIONS"].includes(method);
}

export function permittedOrigin(
  headers: Headers,
  settings: DemoSettings,
): boolean {
  // Never infer the trusted origin from Host, Referer or forwarded headers.
  return headers.get("origin") === settings.allowedOrigin;
}
