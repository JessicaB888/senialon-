import Link from "next/link";
import { Workspace } from "@/components/workspace";
import { requirePageAccess } from "@/lib/auth/page-access";

export default async function NotFound() {
  await requirePageAccess();
  return (
    <Workspace>
      <h1>No encontramos esta página</h1>
      <p>Vuelve a las ejecuciones para continuar con el radar.</p>
      <p>
        <Link href="/">Volver a ejecuciones</Link>
      </p>
    </Workspace>
  );
}
