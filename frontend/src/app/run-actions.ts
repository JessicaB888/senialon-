"use server";

import { invalidSnapshot, runRequest } from "@/lib/runs/server";
import type { RunSnapshot } from "@/lib/runs/types";

export async function listRunsAction(cursor?: string) {
  const query = new URLSearchParams({ limit: "20" });
  if (cursor !== undefined) query.set("cursor", cursor);
  return runRequest("listRuns", ["runs"], { query });
}

export async function readRunAction(runId: string): Promise<RunSnapshot> {
  const [run, coverage] = await Promise.all([
    runRequest("getRun", ["runs", runId]),
    runRequest("getCoverage", ["runs", runId, "coverage"]),
  ]);
  if (run.ok && run.value.data.run_id !== runId)
    return { run: invalidSnapshot(), coverage: invalidSnapshot() };
  if (coverage.ok) {
    const data = coverage.value.data;
    const cells = new Set(
      data.cells.map((cell) => `${cell.source_id}:${cell.window}`),
    );
    const sources = run.ok
      ? new Set(run.value.data.corpus.map((source) => source.source_id))
      : null;
    if (
      !run.ok ||
      data.run_id !== runId ||
      data.run_revision !== run.value.data.revision ||
      cells.size !== 22 ||
      data.cells.some((cell) => !sources?.has(cell.source_id))
    )
      return { run, coverage: invalidSnapshot() };
  }
  return { run, coverage };
}

export async function createRunAction(key: string) {
  return runRequest("createRun", ["runs"], { body: {}, key });
}

export async function advanceRunAction(
  runId: string,
  revision: number,
  key: string,
) {
  const result = await runRequest("advanceRun", ["runs", runId, "advance"], {
    key,
    body: { expected_run_revision: revision, target: { scope: "corpus" } },
  });
  if (
    result.ok &&
    (result.value.data.run_id !== runId ||
      result.value.data.analysis_id !== null)
  )
    return invalidSnapshot<
      import("@/lib/api/types").Schema<"OperationResponse">
    >();
  return result;
}

export async function readOperationAction(runId: string, operationId: string) {
  const result = await runRequest("getOperation", [
    "runs",
    runId,
    "operations",
    operationId,
  ]);
  if (
    result.ok &&
    (result.value.data.run_id !== runId ||
      result.value.data.operation_id !== operationId)
  )
    return invalidSnapshot<
      import("@/lib/api/types").Schema<"OperationResponse">
    >();
  return result;
}
