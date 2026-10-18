import "server-only";
import type { Schema } from "@/lib/api/types";
import { consistentGroups } from "@/lib/groups/validation";
import { matchesRun } from "@/lib/groups/presentation";
import type { ComparisonSnapshot } from "./types";

// Validate identities and provenance at the server boundary. ALG owns arithmetic.
export function consistentComparison(snapshot: ComparisonSnapshot): boolean {
  const { run, groups, comparison } = snapshot;
  if (comparison.run_id !== run.run_id || !consistentGroups(groups, run.run_id))
    return false;
  if (
    comparison.windows.timezone !== run.windows.timezone ||
    !(["previous", "recent"] as const).every((period) =>
      (["start_inclusive", "end_exclusive"] as const).every(
        (boundary) =>
          Date.parse(comparison.windows[period][boundary]) ===
          Date.parse(run.windows[period][boundary]),
      ),
    )
  )
    return false;
  const proposal = groups.proposal;
  if (!proposal)
    return (
      comparison.state === "groups_unconfirmed" &&
      comparison.groups_id === null &&
      comparison.groups_version === null
    );
  if (
    !matchesRun(proposal, run) ||
    comparison.groups_id !== proposal.groups_id ||
    comparison.groups_version !== proposal.groups_version
  )
    return false;
  if (comparison.state === "groups_unconfirmed")
    return proposal.state === "proposed" && proposal.confirmation === null;
  if (
    proposal.state !== "confirmed" ||
    groups.stage.state !== "complete" ||
    !proposal.confirmation ||
    comparison.confirmation_id !== proposal.confirmation.confirmation_id
  )
    return false;
  if (
    comparison.comparison_revision !== null &&
    comparison.comparison_revision > run.revision
  )
    return false;
  if (
    comparison.computed_at &&
    Date.parse(comparison.computed_at) <
      Date.parse(proposal.confirmation.confirmed_at)
  )
    return false;
  const topicIds = new Set(proposal.topics.map((topic) => topic.topic_id));
  const signals = new Set(comparison.signals.map((signal) => signal.topic_id));
  if (
    signals.size !== comparison.signals.length ||
    comparison.signals.some(
      (signal) =>
        !topicIds.has(signal.topic_id) ||
        signal.groups_id !== comparison.groups_id ||
        signal.groups_version !== comparison.groups_version,
    )
  )
    return false;
  if (
    (comparison.state === "complete" || comparison.state === "partial") &&
    signals.size !== topicIds.size
  )
    return false;
  const sources = new Set(run.corpus.map((source) => source.source_id));
  const counted = { previous: new Set<string>(), recent: new Set<string>() };
  for (const signal of comparison.signals) {
    for (const window of ["previous", "recent"] as const) {
      const count: Schema<"Count"> = signal[window];
      const seen = new Set<string>();
      const channels = new Set<string>();
      for (const contribution of count.by_source) {
        if (
          !sources.has(contribution.source_id) ||
          channels.has(contribution.source_id)
        )
          return false;
        channels.add(contribution.source_id);
        for (const id of contribution.video_ids) {
          if (seen.has(id)) return false;
          seen.add(id);
        }
      }
      if (
        seen.size !== count.video_ids.length ||
        count.video_ids.some((id) => !seen.has(id))
      )
        return false;
      for (const id of count.video_ids) {
        if (counted.previous.has(id) || counted.recent.has(id)) return false;
        counted[window].add(id);
      }
    }
  }
  return true;
}
