"use server";

import type { Schema } from "@/lib/api/types";
import { consistentComparison } from "@/lib/comparison/validation";
import type { ComparisonSnapshot } from "@/lib/comparison/types";
import { invalidSnapshot, runRequest } from "@/lib/runs/server";
import type { Result } from "@/lib/runs/types";

export async function readComparisonAction(
  runId: string,
): Promise<Result<ComparisonSnapshot>> {
  const [run, groups, comparison] = await Promise.all([
    runRequest("getRun", ["runs", runId]),
    runRequest("getGroups", ["runs", runId, "groups"]),
    runRequest("getComparison", ["runs", runId, "comparison"]),
  ]);
  if (!run.ok) return run;
  if (!groups.ok) return groups;
  if (!comparison.ok) return comparison;
  const value = {
    run: run.value.data,
    groups: groups.value.data,
    comparison: comparison.value.data,
    servedAt: comparison.value.meta.served_at,
  };
  return value.run.run_id === runId && consistentComparison(value)
    ? { ok: true, value }
    : invalidSnapshot<ComparisonSnapshot>();
}

export async function advanceComparisonAction(
  runId: string,
  revision: number,
  key: string,
) {
  // The existing BFF authenticates this action and checks the original Origin.
  // BE checks revision and confirmation before it invokes ALG.
  const result = await runRequest("advanceRun", ["runs", runId, "advance"], {
    key,
    body: { expected_run_revision: revision, target: { scope: "comparison" } },
  });
  if (
    result.ok &&
    (result.value.data.run_id !== runId ||
      result.value.data.analysis_id !== null ||
      result.value.data.stage !== "comparison")
  )
    return invalidSnapshot<Schema<"OperationResponse">>();
  return result;
}
