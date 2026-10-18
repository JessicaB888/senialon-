// Static checks run by tsc, not by the browser or the Vitest runtime.
import { expectTypeOf } from "vitest";
import type { ApiResponse, Schema } from "@/lib/api/types";

export function checkResponseNarrowing(response: ApiResponse<"getAnalysis">) {
  if (response.kind === "api_error") {
    expectTypeOf(response.body).toEqualTypeOf<Schema<"ErrorResponse">>();
    return response.body.error.code;
  }
  expectTypeOf(response.body).toEqualTypeOf<Schema<"AnalysisResponse">>();
  return response.body.current_actions;
}

export function checkFieldNarrowing(
  metric: Schema<"Metric">,
  count: Schema<"Count">,
) {
  if (metric.state === "unknown")
    expectTypeOf(metric.value).toEqualTypeOf<null>();
  else expectTypeOf(metric.value).toEqualTypeOf<string>();
  if (count.state === "unknown")
    expectTypeOf(count.total_count).toEqualTypeOf<null>();
  else expectTypeOf(count.total_count).toEqualTypeOf<number>();
}

const numberMetric: Schema<"KnownMetric"> = {
  state: "known",
  // @ts-expect-error — a known provider metric is a decimal string, not a number.
  value: 0,
  reason: null,
};
const unknownMetric: Schema<"UnknownMetric"> = {
  state: "unknown",
  // @ts-expect-error — unknown remains null, never zero.
  value: "0",
  reason: "missing",
};
const unknownCount: Schema<"UnknownCount"> = {
  state: "unknown",
  // @ts-expect-error — unknown totals cannot contain a numeric zero.
  total_count: 0,
  observed_count: 0,
  video_ids: [],
  by_source: [],
  reason: "missing",
};
const wrongResponse: ApiResponse<"getVideo"> = {
  kind: "response",
  status: 200,
  // @ts-expect-error — API responses must match the chosen operation.
  body: { not_in_contract: true },
};
declare const errorBody: Schema<"ErrorResponse">;
const wrongStatus: ApiResponse<"getVideo"> = {
  kind: "api_error",
  // @ts-expect-error — unsupported HTTP statuses are not members of an operation.
  status: 418,
  body: errorBody,
};

void [numberMetric, unknownMetric, unknownCount, wrongResponse, wrongStatus];
