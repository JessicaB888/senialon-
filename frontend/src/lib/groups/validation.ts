import "server-only";
import type { Schema } from "@/lib/api/types";

// Relationships between canonical records; no second transport schema.
export function consistentGroups(
  view: Schema<"GroupView">,
  runId: string,
): boolean {
  if (view.run_id !== runId) return false;
  const group = view.proposal;
  if (!group) return true;
  if (group.run_id !== runId) return false;
  const topics = new Set(group.topics.map((topic) => topic.topic_id));
  const evidence = new Map(
    group.evidence.map((item) => [item.evidence_id, item]),
  );
  const assigned = new Set(group.assignments.map((item) => item.video_id));
  if (
    topics.size !== group.topics.length ||
    evidence.size !== group.evidence.length ||
    assigned.size !== group.assignments.length
  )
    return false;
  if (group.unresolved_video_ids.some((id) => assigned.has(id))) return false;
  if (
    group.topics.some((topic) =>
      topic.equivalence_evidence_ids.some((id) => !evidence.has(id)),
    )
  )
    return false;
  if (
    group.assignments.some(
      (assignment) =>
        !topics.has(assignment.main_topic_id) ||
        assignment.secondary_topic_ids.some(
          (id) => !topics.has(id) || id === assignment.main_topic_id,
        ) ||
        assignment.evidence_ids.some(
          (id) => evidence.get(id)?.video_id !== assignment.video_id,
        ),
    )
  )
    return false;
  return (
    group.state !== "confirmed" ||
    (!!group.confirmation &&
      group.confirmation.groups_id === group.groups_id &&
      group.confirmation.groups_version === group.groups_version &&
      Date.parse(group.confirmation.confirmed_at) >=
        Date.parse(group.created_at))
  );
}
