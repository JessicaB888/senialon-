"use server";

import type { Schema } from "@/lib/api/types";
import { consistentGroups } from "@/lib/groups/validation";
import { invalidSnapshot, runRequest } from "@/lib/runs/server";

export async function readGroupsAction(runId: string) {
  const result = await runRequest("getGroups", ["runs", runId, "groups"]);
  return result.ok && !consistentGroups(result.value.data, runId)
    ? invalidSnapshot<Schema<"GroupsResponse">>()
    : result;
}

export async function confirmGroupsAction(
  runId: string,
  body: Schema<"ConfirmGroupsRequest">,
  key: string,
) {
  const result = await runRequest(
    "confirmGroups",
    ["runs", runId, "groups", "confirmation"],
    { body, key },
  );
  if (!result.ok) return result;
  const view = result.value.data;
  if (
    !consistentGroups(view, runId) ||
    view.stage.state !== "complete" ||
    view.proposal?.state !== "confirmed" ||
    view.proposal.groups_id !== body.groups_id ||
    view.proposal.groups_version !== body.groups_version
  )
    return invalidSnapshot<Schema<"GroupsResponse">>();
  return result;
}
