"use client";

import { useRef, useState } from "react";
import {
  advanceComparisonAction,
  readComparisonAction,
} from "@/app/comparison-actions";
import { readOperationAction } from "@/app/run-actions";
import type { Schema } from "@/lib/api/types";
import { canCompare } from "@/lib/comparison/presentation";
import type { ComparisonSnapshot } from "@/lib/comparison/types";
import {
  clearReceipt,
  readReceipt,
  saveReceipt,
  type CommandReceipt,
} from "@/lib/runs/command";
import { changedReceipt, useReceipt } from "@/lib/runs/use-receipt";
import { connectionNotice, type Notice } from "@/lib/runs/types";
import { Feedback, OperationView } from "@/components/runs/run-detail";
import shared from "@/components/runs/runs.module.css";
import { ComparisonView } from "./comparison-view";
import styles from "./comparison.module.css";

type Receipt = Extract<CommandReceipt, { kind: "compare" }>;
const definitiveRejections = new Set([
  "AUTH_REQUIRED",
  "ORIGIN_FORBIDDEN",
  "NOT_FOUND",
  "VALIDATION_ERROR",
  "VERSION_CONFLICT",
  "GROUPS_NOT_CONFIRMED",
]);

function sameConfirmation(command: Receipt, snapshot: ComparisonSnapshot) {
  const comparison = snapshot.comparison;
  return (
    command.runId === comparison.run_id &&
    command.groupsId === comparison.groups_id &&
    command.groupsVersion === comparison.groups_version &&
    command.confirmationId === comparison.confirmation_id
  );
}

export function ComparisonPanel({
  run,
  disabled,
  refreshContext,
}: {
  run: Schema<"Run">;
  disabled: boolean;
  refreshContext: () => Promise<void>;
}) {
  const [snapshot, setSnapshot] = useState<ComparisonSnapshot | null>(null);
  const [viewStale, setViewStale] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [operation, setOperation] = useState<Schema<"Operation"> | null>(null);
  const [inspectedKey, setInspectedKey] = useState<string | null>(null);
  const lock = useRef(false);
  const storage = useReceipt();
  const pending =
    storage.receipt?.kind === "compare" && storage.receipt.runId === run.run_id
      ? storage.receipt
      : null;
  const stale =
    viewStale || (snapshot !== null && snapshot.run.revision !== run.revision);
  const retry =
    !!pending &&
    !!snapshot &&
    !stale &&
    sameConfirmation(pending, snapshot) &&
    inspectedKey === pending.key &&
    operation?.operation_id === pending.operationId &&
    (operation.state === "failed" || operation.state === "blocked") &&
    operation.retry_policy === "same_request_after_status_read";
  const ready =
    storage.ready &&
    !storage.error &&
    !storage.receipt &&
    !busy &&
    !disabled &&
    !stale &&
    !!snapshot &&
    canCompare(snapshot);

  function forget(key: string) {
    clearReceipt(key);
    changedReceipt();
  }
  function remember(command: Receipt) {
    saveReceipt(command);
    changedReceipt();
  }

  async function perform(label: string, work: () => Promise<void>) {
    if (lock.current) return;
    lock.current = true;
    setBusy(label);
    setNotice(null);
    setMessage("");
    try {
      await work();
    } catch {
      setNotice(connectionNotice);
      setViewStale(true);
    } finally {
      lock.current = false;
      setBusy(null);
    }
  }

  async function readSnapshot() {
    const result = await readComparisonAction(run.run_id);
    if (!result.ok) {
      setNotice(result.error);
      setViewStale(true);
      return null;
    }
    setSnapshot(result.value);
    setViewStale(false);
    return result.value;
  }

  async function load() {
    await perform("Consultando comparación…", async () => {
      setInspectedKey(null);
      const fresh = await readSnapshot();
      if (!fresh) return;
      setMessage(
        "Comparación consultada. Esta lectura no solicita un cálculo.",
      );
      if (pending) {
        const id =
          pending.operationId ??
          fresh.run.operations_to_inspect.find(
            (item) => item.stage === "comparison" && item.analysis_id === null,
          )?.operation_id ??
          (fresh.run.last_checkpoint?.stage === "comparison"
            ? fresh.run.last_checkpoint.operation_id
            : null);
        if (id) {
          const result = await readOperationAction(run.run_id, id);
          if (!result.ok) {
            setNotice(result.error);
            return;
          }
          const current = result.value.data;
          if (
            current.stage !== "comparison" ||
            current.analysis_id !== null ||
            current.item_id !== pending.groupsId ||
            current.input_version !== String(pending.groupsVersion)
          ) {
            setNotice({
              ...connectionNotice,
              code: "STALE_DATA",
              message:
                "La operación recibida no corresponde a los grupos de esta solicitud. Conserva su identidad para conciliación.",
            });
            return;
          }
          setOperation(current);
          if (current.state === "succeeded") {
            forget(pending.key);
            setMessage(
              "La operación de comparación está confirmada. Se conserva el resultado recibido; no se repite el cálculo.",
            );
            if (
              !sameConfirmation(pending, fresh) ||
              fresh.comparison.comparison_revision === null ||
              fresh.comparison.comparison_revision <= pending.revision
            )
              setViewStale(true);
          } else {
            const remembered = { ...pending, operationId: id };
            remember(remembered);
            setInspectedKey(remembered.key);
            setMessage(
              current.state === "uncertain"
                ? "La solicitud requiere conciliación manual. No se volverá a enviar automáticamente."
                : "Estado de la operación consultado; no se volvió a enviar la solicitud.",
            );
          }
        } else {
          setMessage(
            "La respuesta de la solicitud sigue sin confirmarse. No se iniciará otro cálculo; conserva su identidad para conciliación.",
          );
        }
      }
      await refreshContext();
    });
  }

  async function calculate(command?: Receipt) {
    if (!snapshot) return;
    await perform(
      command ? "Reenviando la misma solicitud…" : "Calculando comparación…",
      async () => {
        if (
          command
            ? !retry || readReceipt()?.key !== command.key
            : readReceipt() || disabled || stale || !canCompare(snapshot)
        )
          return;
        const comparison = snapshot.comparison;
        if (
          !comparison.groups_id ||
          !comparison.groups_version ||
          !comparison.confirmation_id
        )
          return;
        const delivery: Receipt = command ?? {
          version: 1,
          kind: "compare",
          key: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          operationId: null,
          runId: run.run_id,
          revision: snapshot.run.revision,
          groupsId: comparison.groups_id,
          groupsVersion: comparison.groups_version,
          confirmationId: comparison.confirmation_id,
        };
        remember(delivery);
        setInspectedKey(null);
        const result = await advanceComparisonAction(
          delivery.runId,
          delivery.revision,
          delivery.key,
        );
        if (!result.ok) {
          if (result.error.operationId)
            remember({ ...delivery, operationId: result.error.operationId });
          else if (definitiveRejections.has(result.error.code))
            forget(delivery.key);
          setNotice(result.error);
          setViewStale(true);
          await refreshContext();
          return;
        }
        const current = result.value.data;
        setOperation(current);
        if (
          current.item_id !== delivery.groupsId ||
          current.input_version !== String(delivery.groupsVersion)
        ) {
          remember({ ...delivery, operationId: current.operation_id });
          setNotice({
            ...connectionNotice,
            code: "STALE_DATA",
            message:
              "La operación no corresponde a los grupos solicitados. Consulta su estado antes de continuar.",
          });
          setViewStale(true);
          return;
        }
        if (current.state === "succeeded") forget(delivery.key);
        else remember({ ...delivery, operationId: current.operation_id });
        const fresh = await readSnapshot();
        if (fresh && current.state === "succeeded")
          setMessage(
            "Paso de comparación confirmado. Se muestra el resultado guardado por el servidor.",
          );
        await refreshContext();
      },
    );
  }

  return (
    <section
      id="comparacion"
      className={styles.panel}
      aria-labelledby="comparison-title"
    >
      <div className={shared.sectionHeading}>
        <h2 id="comparison-title">Comparación temática</h2>
        <button
          className={shared.secondaryButton}
          onClick={load}
          disabled={!!busy || disabled}
        >
          Consultar comparación
        </button>
      </div>
      <p className={shared.secondary}>
        Qué temas tienen más o menos publicaciones entre las dos semanas del
        corpus.
      </p>
      <p role="status" aria-live="polite" className={styles.live}>
        {busy ?? message}
      </p>
      {notice ? (
        <Feedback notice={notice} title="No se pudo confirmar la comparación" />
      ) : null}
      {snapshot ? (
        <ComparisonView snapshot={snapshot} stale={stale} />
      ) : (
        <p className={styles.empty}>
          Consulta la comparación de esta ejecución. Se recuperarán los grupos,
          su confirmación y las señales disponibles, sin iniciar un cálculo.
        </p>
      )}
      {storage.error ? (
        <p className={shared.warning} role="alert">
          No se pudo recuperar el registro local de solicitudes. Puedes
          consultar resultados; los cálculos nuevos quedan detenidos para
          conservar su identidad.
        </p>
      ) : null}
      {pending ? (
        <p className={shared.warning}>
          Hay una solicitud de comparación pendiente de confirmar. Consulta su
          resultado y operación antes de intentar otro cálculo.
        </p>
      ) : storage.receipt ? (
        <p className={shared.warning}>
          Hay otra solicitud sin confirmar. Resuélvela en su ejecución antes de
          solicitar un cálculo.
        </p>
      ) : null}
      {operation ? <OperationView operation={operation} /> : null}
      <div className={styles.actions}>
        <button
          className={shared.primaryButton}
          onClick={() => calculate()}
          disabled={!ready}
          aria-describedby="comparison-calculate-help"
        >
          Calcular comparación
        </button>
        {retry && pending ? (
          <button
            className={shared.secondaryButton}
            onClick={() => calculate(pending)}
            disabled={!!busy || disabled}
          >
            Reenviar la misma solicitud
          </button>
        ) : null}
      </div>
      <p id="comparison-calculate-help" className={shared.help}>
        {!snapshot
          ? "Consulta primero el estado guardado."
          : stale
            ? "Actualiza la comparación antes de solicitar un cálculo."
            : snapshot.comparison.state === "groups_unconfirmed"
              ? "Confirma los grupos en la sección anterior. Confirmarlos no calcula la comparación."
              : snapshot.comparison.computed_at
                ? "Ya hay una comparación guardada. Consultarla no repite el cálculo."
                : "El cálculo usa las publicaciones guardadas y requiere grupos confirmados y una acción autorizada por el servidor."}
      </p>
    </section>
  );
}
