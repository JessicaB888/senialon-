import { handleApiRequest } from "@/lib/api/handler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

type Context = { params: Promise<{ path?: string[] }> };

async function handle(request: Request, context: Context) {
  return handleApiRequest(request, (await context.params).path ?? []);
}

// Every method enters the same independent guard; OPTIONS does not enable CORS.
export {
  handle as GET,
  handle as POST,
  handle as PUT,
  handle as PATCH,
  handle as DELETE,
  handle as HEAD,
  handle as OPTIONS,
};
