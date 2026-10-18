import { NextResponse, type NextRequest } from "next/server";
import {
  permittedOrigin,
  readDemoSettings,
  requiresOrigin,
  validateAuthorization,
} from "@/lib/auth/access";
import { apiError, privateHeaders, requestId } from "@/lib/api/http";

function publicAsset(path: string): boolean {
  // Only build assets and explicitly known branding may bypass access checks.
  return (
    path.startsWith("/_next/static/") ||
    [
      "/icon.png",
      "/branding/senialon-dark.png",
      "/branding/senialon-light.png",
    ].includes(path)
  );
}

export function proxy(request: NextRequest) {
  if (publicAsset(request.nextUrl.pathname)) return NextResponse.next();
  const identity = requestId(request.headers);
  const settings = readDemoSettings();
  let denied: Response | null = null;
  if (!settings) {
    denied = apiError(
      identity,
      500,
      "INTERNAL_ERROR",
      "El acceso a SENIALON no está disponible.",
    );
  } else if (
    !validateAuthorization(request.headers.get("authorization"), settings)
  ) {
    denied = apiError(
      identity,
      401,
      "AUTH_REQUIRED",
      "Se requiere la credencial de demo.",
    );
  } else if (
    requiresOrigin(request.method) &&
    !permittedOrigin(request.headers, settings)
  ) {
    denied = apiError(
      identity,
      403,
      "ORIGIN_FORBIDDEN",
      "Origen no permitido.",
    );
  }
  if (denied) {
    if (request.nextUrl.pathname.startsWith("/api/")) return denied;
    const message =
      denied.status === 401
        ? "SENIALON: se requiere la credencial de demo para continuar."
        : denied.status === 403
          ? "SENIALON: origen no permitido."
          : "El acceso a SENIALON no está disponible.";
    const headers = new Headers(denied.headers);
    headers.set("Content-Type", "text/plain; charset=utf-8");
    return new Response(message, { status: denied.status, headers });
  }
  const forwarded = new Headers(request.headers);
  forwarded.set("X-Request-Id", identity);
  const response = NextResponse.next({ request: { headers: forwarded } });
  for (const [key, value] of privateHeaders(identity))
    response.headers.set(key, value);
  return response;
}

export const config = { matcher: "/:path*" };
