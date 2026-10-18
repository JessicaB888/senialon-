import type { Schema } from "@/lib/api/types";

export type ComparisonSnapshot = {
  run: Schema<"Run">;
  groups: Schema<"GroupView">;
  comparison: Schema<"Comparison">;
  servedAt: string;
};
