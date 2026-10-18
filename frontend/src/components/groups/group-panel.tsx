"use client";

import { useRef, useState } from "react";
import { confirmGroupsAction, readGroupsAction } from "@/app/group-actions";
import { readOperationAction } from "@/app/run-actions";
import type { Schema } from "@/lib/api/types";
import { matchesRun, sourceLink } from "@/lib/groups/presentation";
import {
  clearReceipt,
  readReceipt,
  saveReceipt,
  type CommandReceipt,
} from "@/lib/runs/command";
import { changedReceipt, useReceipt } from "@/lib/runs/use-receipt";
import { dateLabel } from "@/lib/runs/presentation";
import { connectionNotice, type Notice } from "@/lib/runs/types";
import { Feedback, Status } from "@/components/runs/run-detail";
import shared from "@/components/runs/runs.module.css";
import styles from "./groups.module.css";

function Evidence({ evidence }: { evidence: Schema<"Evidence"> }) {
  const href = sourceLink(evidence.source_url);
  return (
    <li>
      <strong>
        {evidence.kind === "text"
          ? "Evidencia textual"
          : "Observación audiovisual"}
      </strong>
      <p>
        {evidence.kind === "text" ? evidence.excerpt : evidence.observation}
      </p>
      <p className={shared.secondary}>
        {evidence.kind === "text"
          ? {
              title: "Título",
              description: "Descripción",
              available_text: "Texto disponible",
            }[evidence.field]
          : `Desde ${evidence.start_seconds} s${evidence.end_seconds === null ? "" : ` hasta ${evidence.end_seconds} s`}`}{" "}
        · capturada el {dateLabel(evidence.captured_at)}.
      </p>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer">
          Fuente registrada: {new URL(href).hostname}
          <span className={shared.srOnly}> (abre en otra pestaña)</span>
        </a>
      ) : (
        <p className={shared.secondary}>
          La fuente no tiene un enlace HTTPS utilizable.
        </p>
      )}
      {evidence.kind === "audiovisual" ? (
        <a
          href={`https://www.youtube.com/watch?v=${encodeURIComponent(evidence.video_id)}&t=${evidence.start_seconds}s`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver video desde {evidence.start_seconds} s
          <span className={shared.srOnly}> (abre en otra pestaña)</span>
        </a>
      ) : null}
    </li>
  );
}

export function GroupPanel({
  run,
  disabled,
  refreshContext,
}: {
  run: Schema<"Run">;
  disabled: boolean;
  refreshContext: () => Promise<void>;
}) {
  const [response, setResponse] = useState<Schema<"GroupsResponse"> | null>(
    null,
  );
  const [loadedRevision, setLoadedRevision] = useState<number | null>(null);
  const [viewStale, setViewStale] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [readAfterFailure, setReadAfterFailure] = useState(false);
  const [retryPolicy, setRetryPolicy] = useState<Notice["retryPolicy"]>("none");
  const lock = useRef(false);
  const storage = useReceipt();
  const group = response?.data.proposal ?? null;
  const receipt = storage.receipt;
  const pending =
    receipt?.kind === "confirm_groups" && receipt.runId === run.run_id
      ? receipt
      : null;
  const stale =
    viewStale ||
    (loadedRevision !== null &&
      loadedRevision !== run.revision &&
      (group?.state !== "confirmed" ||
        run.allowed_actions.includes("confirm_groups"))) ||
    (!!group && !matchesRun(group, run));
  const confirmed =
    group?.state === "confirmed" && response?.data.stage.state === "complete";
  const replay =
    !!pending &&
    readAfterFailure &&
    retryPolicy === "same_request_after_status_read" &&
    !!group &&
    group.state === "proposed" &&
    pending.groupsId === group.groups_id &&
    pending.groupsVersion === group.groups_version &&
    !stale;

  async function perform(work: () => Promise<void>) {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setMessage("");
    setNotice(null);
    try {
      await work();
    } catch {
      setNotice(connectionNotice);
      setViewStale(true);
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  function forget(key: string) {
    clearReceipt(key);
    changedReceipt();
  }

  async function load() {
    await perform(async () => {
      const requestedRevision = run.revision;
      const result = await readGroupsAction(run.run_id);
      if (!result.ok) {
        setNotice(result.error);
        setViewStale(true);
        setReadAfterFailure(false);
        return;
      }
      setResponse(result.value);
      setLoadedRevision(requestedRevision);
      setViewStale(false);
      setReadAfterFailure(true);
      const proposal = result.value.data.proposal;
      if (
        pending &&
        proposal?.state === "confirmed" &&
        proposal.confirmation &&
        result.value.data.stage.state === "complete" &&
        pending.groupsId === proposal.groups_id &&
        pending.groupsVersion === proposal.groups_version
      ) {
        forget(pending.key);
        setMessage("Confirmación recuperada del servidor para esta versión.");
        await refreshContext();
      } else
        setMessage(
          "Propuesta consultada. Esta lectura no confirma grupos ni calcula la comparación.",
        );
      if (pending?.operationId && proposal?.state !== "confirmed") {
        const operation = await readOperationAction(
          pending.runId,
          pending.operationId,
        );
        if (!operation.ok) {
          setNotice(operation.error);
          setReadAfterFailure(false);
          return;
        }
        const state = operation.value.data;
        setRetryPolicy(
          state.state === "failed" || state.state === "blocked"
            ? state.retry_policy
            : "none",
        );
        setMessage(
          state.state === "uncertain"
            ? "Resultado incierto: requiere conciliación antes de otra confirmación."
            : `Estado de la solicitud recuperado: ${state.reason ?? state.state}.`,
        );
      }
    });
  }

  async function confirm(
    command?: Extract<CommandReceipt, { kind: "confirm_groups" }>,
  ) {
    if (!group) return;
    await perform(async () => {
      if (
        !command &&
        (readReceipt() ||
          stale ||
          disabled ||
          !run.allowed_actions.includes("confirm_groups") ||
          group.state !== "proposed" ||
          response?.data.stage.state !== "complete")
      )
        return;
      const delivery = command ?? {
        version: 1 as const,
        kind: "confirm_groups" as const,
        key: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        operationId: null,
        runId: run.run_id,
        revision: run.revision,
        groupsId: group.groups_id,
        groupsVersion: group.groups_version,
      };
      saveReceipt(delivery);
      changedReceipt();
      setReadAfterFailure(false);
      const result = await confirmGroupsAction(
        delivery.runId,
        {
          expected_run_revision: delivery.revision,
          groups_id: delivery.groupsId,
          groups_version: delivery.groupsVersion,
        },
        delivery.key,
      );
      if (!result.ok) {
        if (result.error.operationId) {
          saveReceipt({ ...delivery, operationId: result.error.operationId });
          changedReceipt();
        }
        setNotice(result.error);
        setRetryPolicy(result.error.retryPolicy);
        setViewStale(true);
        if (
          !result.error.operationId &&
          [
            "AUTH_REQUIRED",
            "ORIGIN_FORBIDDEN",
            "NOT_FOUND",
            "VALIDATION_ERROR",
            "VERSION_CONFLICT",
            "GROUPS_NOT_CONFIRMED",
          ].includes(result.error.code)
        )
          forget(delivery.key);
        if (result.error.code === "VERSION_CONFLICT") await refreshContext();
        return;
      }
      setResponse(result.value);
      setLoadedRevision(delivery.revision);
      setViewStale(false);
      forget(delivery.key);
      setRetryPolicy("none");
      setMessage(
        "Versión confirmada y recuperable según la respuesta del servidor. Las oportunidades siguen pendientes de revisión editorial.",
      );
      await refreshContext();
    });
  }

  const canConfirm =
    !!group &&
    group.state === "proposed" &&
    response?.data.stage.state === "complete" &&
    run.allowed_actions.includes("confirm_groups") &&
    Number.isSafeInteger(run.revision) &&
    Number.isSafeInteger(group.groups_version) &&
    storage.ready &&
    !storage.error &&
    !receipt &&
    !stale &&
    !busy &&
    !disabled;
  return (
    <section
      id="grupos"
      className={styles.panel}
      aria-labelledby="groups-title"
    >
      <div className={shared.sectionHeading}>
        <div>
          <h2 id="groups-title">Grupos temáticos</h2>
          <p className={shared.secondary}>
            Inspecciona las asignaciones y su evidencia antes de confirmar una
            versión común para ambas semanas.
          </p>
        </div>
        <button
          className={shared.secondaryButton}
          onClick={load}
          disabled={busy || disabled}
        >
          {response ? "Actualizar grupos" : "Consultar grupos"}
        </button>
      </div>
      <p role="status" aria-live="polite" className={shared.live}>
        {busy ? "Consultando o registrando la versión…" : message}
      </p>
      {notice ? (
        <Feedback
          notice={notice}
          title="No se pudo consultar o confirmar la propuesta"
        />
      ) : null}
      {pending ? (
        <p className={shared.warning}>
          Hay una confirmación sin respuesta definitiva para la versión{" "}
          {pending.groupsVersion}. Consulta los grupos para recuperar su estado;
          no se volverá a enviar automáticamente.
        </p>
      ) : null}
      {stale && response ? (
        <p className={shared.warning}>
          Propuesta anterior conservada. Actualiza los grupos antes de confirmar
          esta ejecución.
        </p>
      ) : null}
      {!response ? (
        <p className={shared.secondary}>
          Todavía no se ha consultado una propuesta. La comparación permanece
          pendiente de confirmación.
        </p>
      ) : (
        <>
          <div className={styles.version}>
            <Status stage={response.data.stage} />
            <span>
              {group
                ? `Versión ${group.groups_version} · ${group.state === "confirmed" ? "Confirmada" : "Propuesta"}`
                : "Sin propuesta disponible"}
            </span>
            <span>Consulta: {dateLabel(response.meta.served_at)}</span>
          </div>
          {response.data.stage.reason ? (
            <p className={shared.secondary}>{response.data.stage.reason}</p>
          ) : null}
          {group ? (
            <>
              <p className={shared.secondary}>
                Propuesta creada el {dateLabel(group.created_at)}.{" "}
                {confirmed
                  ? "La confirmación no inicia el cálculo de la comparación."
                  : "Comparación pendiente: esta propuesta todavía no está confirmada."}
              </p>
              {group.limitations.length ? (
                <ul className={shared.limitations}>
                  {group.limitations.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : null}
              {!group.topics.length ? (
                <p className={shared.secondary}>
                  Esta versión no contiene grupos temáticos.
                </p>
              ) : (
                <ol className={styles.topics}>
                  {group.topics.map((topic) => {
                    const main = group.assignments.filter(
                      (assignment) =>
                        assignment.main_topic_id === topic.topic_id,
                    );
                    const secondary = group.assignments.filter((assignment) =>
                      assignment.secondary_topic_ids.includes(topic.topic_id),
                    );
                    return (
                      <li key={topic.topic_id}>
                        <h3>{topic.name}</h3>
                        <p>{topic.description}</p>
                        {topic.variants.length ? (
                          <p className={shared.secondary}>
                            Variantes: {topic.variants.join(" · ")}
                          </p>
                        ) : null}
                        {topic.equivalence_evidence_ids.length ? (
                          <details>
                            <summary>Inspeccionar evidencia del grupo</summary>
                            <ul className={styles.evidence}>
                              {topic.equivalence_evidence_ids.map((id) => {
                                const evidence = group.evidence.find(
                                  (item) => item.evidence_id === id,
                                );
                                return evidence ? (
                                  <Evidence key={id} evidence={evidence} />
                                ) : null;
                              })}
                            </ul>
                          </details>
                        ) : null}
                        {main.length ? (
                          <ul className={styles.assignments}>
                            {main.map((assignment) => (
                              <li key={assignment.video_id}>
                                <a
                                  href={`https://www.youtube.com/watch?v=${encodeURIComponent(assignment.video_id)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Ver video {assignment.video_id}
                                  <span className={shared.srOnly}>
                                    {" "}
                                    (abre en otra pestaña)
                                  </span>
                                </a>
                                <p className={shared.secondary}>
                                  Tema principal: {topic.name}.{" "}
                                  {assignment.secondary_topic_ids.length
                                    ? `Secundarios sin conteo: ${assignment.secondary_topic_ids.map((id) => group.topics.find((item) => item.topic_id === id)?.name ?? id).join(" · ")}.`
                                    : "Sin temas secundarios informados."}
                                </p>
                                <details>
                                  <summary>
                                    Inspeccionar evidencia de la asignación
                                  </summary>
                                  <p className={shared.secondary}>
                                    Confirmar grupos no valida por sí solo las
                                    observaciones o afirmaciones del contenido.
                                  </p>
                                  <ul className={styles.evidence}>
                                    {assignment.evidence_ids.map((id) => {
                                      const evidence = group.evidence.find(
                                        (item) => item.evidence_id === id,
                                      );
                                      return evidence ? (
                                        <Evidence
                                          key={id}
                                          evidence={evidence}
                                        />
                                      ) : null;
                                    })}
                                  </ul>
                                </details>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className={shared.secondary}>
                            Sin asignaciones principales en esta versión.
                          </p>
                        )}
                        {secondary.length ? (
                          <p className={shared.secondary}>
                            Figura como secundario, sin sumar publicaciones, en:{" "}
                            {secondary
                              .map((assignment) => assignment.video_id)
                              .join(" · ")}
                            .
                          </p>
                        ) : null}
                      </li>
                    );
                  })}
                </ol>
              )}
              {group.unresolved_video_ids.length ? (
                <details className={styles.pending}>
                  <summary>Publicaciones pendientes de asignación</summary>
                  <p className={shared.warning}>
                    Estos IDs siguen pendientes y limitan la cobertura; no se
                    asignan manualmente ni cuentan como cero.
                  </p>
                  <ul>
                    {group.unresolved_video_ids.map((id) => (
                      <li key={id}>{id}</li>
                    ))}
                  </ul>
                </details>
              ) : null}
              <details className={styles.provenance}>
                <summary>
                  Identidad, criterios y procedencia de la propuesta
                </summary>
                <p>
                  ID: <code>{group.groups_id}</code> · revisión de ejecución
                  consultada: {loadedRevision}.
                </p>
                <p>
                  Reglas: {group.versions.rules_version}. Clasificación:{" "}
                  {group.versions.classification_version}. Criterios:{" "}
                  {group.versions.criteria_version}.
                </p>
                <ul>
                  {group.generation_trace.map((trace, index) => (
                    <li key={index}>
                      {trace.provider} · modelo informado: {trace.model} ·
                      versión de pregunta: {trace.prompt_or_question_version} ·{" "}
                      {dateLabel(trace.processed_at)}.
                    </li>
                  ))}
                </ul>
              </details>
              <div className={styles.confirmation}>
                <button
                  className={shared.primaryButton}
                  disabled={!canConfirm}
                  onClick={() => confirm()}
                  aria-describedby="confirm-groups-help"
                >
                  Confirmar esta versión
                </button>
                <p id="confirm-groups-help" className={shared.help}>
                  {confirmed
                    ? `Confirmación registrada el ${dateLabel(group.confirmation!.confirmed_at)} para esta versión.`
                    : stale
                      ? "Actualiza la propuesta y revisa su versión antes de confirmar."
                      : receipt
                        ? "Primero consulta el estado de la solicitud pendiente."
                        : !run.allowed_actions.includes("confirm_groups")
                          ? "La ejecución no permite confirmar grupos en el estado recibido."
                          : "Confirma solo esta versión. Los grupos, pertinencia y asignaciones no se editan en la demo."}
                </p>
                <p className={shared.secondary}>
                  Confirmar grupos y aprobar una oportunidad editorial son
                  decisiones diferentes. Las oportunidades conservan su revisión
                  pendiente.
                </p>
                {replay && pending ? (
                  <button
                    className={shared.secondaryButton}
                    disabled={busy || disabled}
                    onClick={() => confirm(pending)}
                  >
                    Reenviar la misma confirmación
                  </button>
                ) : null}
              </div>
            </>
          ) : null}
        </>
      )}
    </section>
  );
}
