import type { Schema } from "@/lib/api/types";
import type { ComparisonSnapshot } from "./types";

const number = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 20 });
const signed = new Intl.NumberFormat("es-CO", {
  signDisplay: "exceptZero",
  maximumFractionDigits: 20,
});

export function countLabel(count: Schema<"Count">): string {
  return count.state === "known"
    ? number.format(count.total_count)
    : "Desconocido";
}

export function signalLabels(signal: Schema<"TopicSignal">, complete: boolean) {
  if (!complete || signal.kind === "comparison_pending")
    return {
      label: "Comparación completa pendiente",
      delta: "Pendiente",
      percentage: "Pendiente",
      reason:
        signal.percentage_reason ??
        "La cobertura no permite comparar el corpus completo.",
    };
  return {
    label:
      signal.kind === "new_in_corpus"
        ? "Nuevo en el corpus"
        : signal.kind === "no_observed_publications"
          ? "Sin publicaciones observadas"
          : {
              increase: "Aumento de publicaciones",
              unchanged: "Sin cambio",
              decrease: "Descenso de publicaciones",
            }[signal.direction],
    delta: signed.format(signal.delta),
    percentage:
      signal.percentage_change === null
        ? "No aplicable"
        : `${signed.format(signal.percentage_change)} %`,
    reason:
      signal.percentage_change === null
        ? "La base es cero; no se calcula un porcentaje."
        : null,
  };
}

export function canCompare(snapshot: ComparisonSnapshot): boolean {
  return (
    snapshot.run.allowed_actions.includes("advance_comparison") &&
    snapshot.run.operations_to_inspect.length === 0 &&
    snapshot.groups.stage.state === "complete" &&
    snapshot.groups.proposal?.state === "confirmed" &&
    snapshot.comparison.confirmation_id ===
      snapshot.groups.proposal.confirmation?.confirmation_id &&
    snapshot.comparison.state === "not_requested"
  );
}
