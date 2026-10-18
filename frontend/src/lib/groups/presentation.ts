import type { Schema } from "@/lib/api/types";

export function matchesRun(
  group: Schema<"Groups">,
  run: Schema<"Run">,
): boolean {
  if (
    group.run_id !== run.run_id ||
    group.input_windows.timezone !== run.windows.timezone
  )
    return false;
  if (
    (
      ["rules_version", "classification_version", "criteria_version"] as const
    ).some((key) => group.versions[key] !== run.versions[key])
  )
    return false;
  return (["previous", "recent"] as const).every((period) =>
    (["start_inclusive", "end_exclusive"] as const).every(
      (boundary) =>
        Date.parse(group.input_windows[period][boundary]) ===
        Date.parse(run.windows[period][boundary]),
    ),
  );
}

export function sourceLink(value: string): string | null {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password
      ? url.href
      : null;
  } catch {
    return null;
  }
}
