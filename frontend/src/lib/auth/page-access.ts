import "server-only";
import { headers } from "next/headers";
import { unauthorized } from "next/navigation";
import { readDemoSettings, validateAuthorization } from "./access";

export async function requirePageAccess(): Promise<void> {
  const incoming = await headers();
  const settings = readDemoSettings();
  if (!settings) throw new Error("El acceso a SENIALON no está disponible.");
  if (!validateAuthorization(incoming.get("authorization"), settings)) {
    unauthorized();
  }
  // No credential is returned as a page prop or serialized into the RSC stream.
}
