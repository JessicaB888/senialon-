import { Suspense } from "react";
import { Workspace } from "@/components/workspace";
import { RunsConsole } from "@/components/runs/runs-console";
import { requirePageAccess } from "@/lib/auth/page-access";
import { listRunsAction, readRunAction } from "./run-actions";

type Query = { run?: string | string[] };

async function Runs({ searchParams }: { searchParams: Promise<Query> }) {
  const [query, list] = await Promise.all([searchParams, listRunsAction()]);
  if (
    query.run !== undefined &&
    (typeof query.run !== "string" ||
      !query.run.length ||
      query.run.length > 128)
  ) {
    return (
      <div>
        <h1>Ejecuciones</h1>
        <p role="alert">
          El identificador de la ejecución no es válido. Vuelve a Ejecuciones
          para recuperar el listado.
        </p>
      </div>
    );
  }
  const selectedId =
    query.run ?? (list.ok ? list.value.items[0]?.run_id : null) ?? null;
  const snapshot = selectedId ? await readRunAction(selectedId) : null;
  return (
    <RunsConsole
      key={selectedId ?? "no-selection"}
      initialList={list}
      initialSnapshot={snapshot}
      selectedId={selectedId}
    />
  );
}

export default async function Home({
  searchParams = Promise.resolve({}),
}: { searchParams?: Promise<Query> } = {}) {
  await requirePageAccess();
  return (
    <Workspace>
      <Suspense
        fallback={
          <div role="status">
            <h1>Ejecuciones</h1>
            <p>Consultando ejecuciones guardadas…</p>
          </div>
        }
      >
        <Runs searchParams={searchParams} />
      </Suspense>
    </Workspace>
  );
}
