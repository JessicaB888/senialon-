import type { Schema } from "@/lib/api/types";
import type { Notice, RunSnapshot } from "@/lib/runs/types";
import { sourceLabel } from "@/lib/runs/corpus";
import {
  dateLabel,
  discoveryLabel,
  phaseLabel,
  stageLabels,
} from "@/lib/runs/presentation";
import styles from "./runs.module.css";

export function Feedback({
  notice,
  title,
}: {
  notice: Notice;
  title?: string;
}) {
  const unavailable = notice.code === "NOT_FOUND";
  return (
    <div className={styles.notice} role="alert">
      <strong>
        {title ??
          (unavailable
            ? "Servicio de ejecuciones no disponible"
            : "No se pudo completar la consulta")}
      </strong>
      <p>
        {unavailable
          ? "No fue posible consultar este recurso. No se confirma que existan ejecuciones o resultados disponibles."
          : notice.message}
      </p>
      {notice.retryPolicy === "manual_reconciliation_required" ? (
        <p>
          La operación requiere conciliación antes de repetir un consumo.
          Conserva su reserva y consulta el estado.
        </p>
      ) : null}
      {notice.requestId ? (
        <details>
          <summary>Referencia de la consulta</summary>
          <code>{notice.requestId}</code>
          {notice.stage ? <p>Etapa: {phaseLabel(notice.stage)}</p> : null}
        </details>
      ) : null}
    </div>
  );
}

export function Status({ stage }: { stage: Schema<"Stage"> }) {
  return (
    <span className={styles.status} data-state={stage.state}>
      {stageLabels[stage.state]}
    </span>
  );
}

function WindowView({
  title,
  window,
}: {
  title: string;
  window: Schema<"Window">;
}) {
  return (
    <div className={styles.window}>
      <h3>{title}</h3>
      <p>
        <time dateTime={window.start_inclusive}>
          {dateLabel(window.start_inclusive)}
        </time>{" "}
        <span>inclusive</span>
      </p>
      <p>
        <time dateTime={window.end_exclusive}>
          {dateLabel(window.end_exclusive)}
        </time>{" "}
        <span>exclusivo</span>
      </p>
    </div>
  );
}

export function RunContext({
  run,
  previous,
  stale,
}: {
  run: Schema<"Run">;
  previous: boolean;
  stale: boolean;
}) {
  return (
    <section className={styles.context} aria-labelledby="run-title">
      <div className={styles.sectionHeading}>
        <h2 id="run-title">
          {previous ? "Ejecución anterior" : "Ejecución creada"}
        </h2>
        <Status stage={run.workflow} />
      </div>
      <p className={styles.secondary}>
        Iniciada el{" "}
        <time dateTime={run.started_at}>{dateLabel(run.started_at)}</time>, hora
        de Colombia.
      </p>
      {stale ? (
        <p className={styles.warning}>
          Se conserva la última lectura disponible. Actualiza el estado antes de
          solicitar otro paso.
        </p>
      ) : null}
      <div className={styles.windows}>
        <WindowView title="Semana anterior" window={run.windows.previous} />
        <WindowView title="Semana reciente" window={run.windows.recent} />
      </div>
      <p className={styles.secondary}>
        {run.windows.timezone} · UTC−5 · el día en curso queda fuera de ambas
        ventanas.
      </p>
      <dl className={styles.facts}>
        <div>
          <dt>Etapa actual</dt>
          <dd>{phaseLabel(run.current_stage)}</dd>
        </div>
        <div>
          <dt>Última actualización guardada</dt>
          <dd>
            <time dateTime={run.updated_at}>{dateLabel(run.updated_at)}</time>
          </dd>
        </div>
        <div>
          <dt>Último paso confirmado</dt>
          <dd>
            {run.last_checkpoint ? (
              <>
                {phaseLabel(run.last_checkpoint.stage)}
                <br />
                <time dateTime={run.last_checkpoint.committed_at}>
                  {dateLabel(run.last_checkpoint.committed_at)}
                </time>
              </>
            ) : (
              "Ningún paso confirmado todavía"
            )}
          </dd>
        </div>
      </dl>
      {run.workflow.reason ? (
        <p className={styles.secondary}>{run.workflow.reason}</p>
      ) : null}
      {run.current_stage === "awaiting_confirmation" ? (
        <p className={styles.warning}>
          Los grupos necesitan confirmación antes de comparar las semanas.{" "}
          <a href="#grupos">Revisa la propuesta y su versión</a>.
        </p>
      ) : null}
      <details className={styles.technical}>
        <summary>Identidad y versiones de la ejecución</summary>
        <dl className={styles.facts}>
          <div>
            <dt>ID</dt>
            <dd>
              <code>{run.run_id}</code>
            </dd>
          </div>
          <div>
            <dt>Revisión guardada</dt>
            <dd>{run.revision}</dd>
          </div>
          <div>
            <dt>Reglas</dt>
            <dd>{run.versions.rules_version}</dd>
          </div>
          <div>
            <dt>Clasificación</dt>
            <dd>{run.versions.classification_version}</dd>
          </div>
          <div>
            <dt>Criterios</dt>
            <dd>{run.versions.criteria_version}</dd>
          </div>
        </dl>
        {run.last_checkpoint ? (
          <p>
            Operación: <code>{run.last_checkpoint.operation_id}</code>
            {run.last_checkpoint.item_id ? (
              <>
                {" "}
                · elemento: <code>{run.last_checkpoint.item_id}</code>
              </>
            ) : null}
          </p>
        ) : null}
      </details>
    </section>
  );
}

const coverageStages = [
  ["acquisition", "Recolección"],
  ["eligibility", "Elegibilidad"],
  ["ia_relevance", "Pertinencia de IA"],
  ["main_topic", "Tema principal"],
] as const;

function Cell({ cell }: { cell: Schema<"CoverageCell"> | undefined }) {
  if (!cell) return <span>Desconocido · cobertura no recibida</span>;
  const issue = coverageStages
    .map(([key]) => cell[key])
    .find((stage) =>
      ["failed", "uncertain", "blocked", "insufficient"].includes(stage.state),
    );
  return (
    <>
      <p>{discoveryLabel(cell)}</p>
      {issue ? (
        <p className={styles.warning}>
          {stageLabels[issue.state]}: {issue.reason}
        </p>
      ) : null}
      <details className={styles.cellDetails}>
        <summary>Ver etapas</summary>
        <dl className={styles.stages}>
          {coverageStages.map(([key, label]) => (
            <div key={key}>
              <dt>{label}</dt>
              <dd>
                <Status stage={cell[key]} />
                {cell[key].reason ? <p>{cell[key].reason}</p> : null}
              </dd>
            </div>
          ))}
        </dl>
        <p>
          Páginas consultadas: {cell.pages_read}. Paginación{" "}
          {cell.pagination_complete ? "completa" : "incompleta"}.
        </p>
        <p>IDs pendientes: {cell.unresolved_video_ids.length}.</p>
        {cell.failures.length ? (
          <ul>
            {cell.failures.map((failure, index) => (
              <li key={index}>{failure}</li>
            ))}
          </ul>
        ) : null}
      </details>
    </>
  );
}

export function CoverageView({
  run,
  result,
}: {
  run: Schema<"Run">;
  result: RunSnapshot["coverage"];
}) {
  const coverage = result.ok ? result.value.data : null;
  const scrollHelpId = `coverage-scroll-${encodeURIComponent(run.run_id)}-${run.revision}`;
  return (
    <section className={styles.coverage} aria-labelledby="coverage-title">
      <div className={styles.sectionHeading}>
        <h2 id="coverage-title">Cobertura de los 11 canales</h2>
        <span className={styles.status}>
          {coverage
            ? {
                complete: "Cobertura temática completa",
                partial: "Cobertura temática parcial",
                pending: "Cobertura temática pendiente",
              }[coverage.thematic_state]
            : "Cobertura no disponible"}
        </span>
      </div>
      <p className={styles.secondary}>
        Publicaciones descubiertas por ventana; no son conteos de piezas
        elegibles ni señales de tendencia.
      </p>
      {!result.ok ? (
        <Feedback
          notice={result.error}
          title="No se recibió cobertura de esta revisión"
        />
      ) : null}
      {coverage?.thematic_state !== "complete" ? (
        <p className={styles.warning}>
          La comparación completa de los once canales sigue pendiente. Lo
          desconocido no equivale a cero.
        </p>
      ) : null}
      {coverage ? (
        <>
          {coverage.limitations.length ? (
            <ul className={styles.limitations}>
              {coverage.limitations.map((limitation, index) => (
                <li key={index}>{limitation}</li>
              ))}
            </ul>
          ) : null}
          <p id={scrollHelpId} className={styles.tableHint}>
            La tabla contiene las dos semanas. Desplázala horizontalmente para
            ver la semana reciente.
          </p>
          <div
            className={styles.tableScroll}
            role="region"
            aria-label="Cobertura por canal y semana"
            aria-describedby={scrollHelpId}
            tabIndex={0}
          >
            <table>
              <caption>
                Recolección, elegibilidad y clasificación por fuente
              </caption>
              <thead>
                <tr>
                  <th scope="col">Canal</th>
                  <th scope="col">Semana anterior</th>
                  <th scope="col">Semana reciente</th>
                </tr>
              </thead>
              <tbody>
                {run.corpus.map((source) => (
                  <tr key={source.source_id}>
                    <th scope="row">
                      <a
                        href={source.original_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {sourceLabel(source.original_url)}
                        <span className={styles.srOnly}>
                          {" "}
                          (abre en otra pestaña)
                        </span>
                      </a>
                      <p className={styles.resolution}>
                        Resolución: {stageLabels[source.resolution.state]}
                      </p>
                      {source.resolution.reason ? (
                        <p className={styles.resolution}>
                          {source.resolution.reason}
                        </p>
                      ) : null}
                    </th>
                    {(["previous", "recent"] as const).map((window) => (
                      <td key={window}>
                        <Cell
                          cell={coverage.cells.find(
                            (cell) =>
                              cell.source_id === source.source_id &&
                              cell.window === window,
                          )}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={styles.secondary}>
            Material público recuperable en la captura. No es un archivo
            histórico de publicaciones eliminadas o privatizadas.
          </p>
        </>
      ) : (
        <p className={styles.secondary}>
          Las fuentes previstas se conservan abajo; su consulta no se presume
          completada.
        </p>
      )}
    </section>
  );
}

export function OperationView({
  operation,
}: {
  operation: Schema<"Operation">;
}) {
  const labels = {
    succeeded: "Paso confirmado",
    running: "Solicitud en proceso",
    failed: "Paso con error",
    blocked: "Paso bloqueado",
    uncertain: "Resultado incierto",
  };
  return (
    <div className={styles.operation}>
      <strong>
        {labels[operation.state]} · {phaseLabel(operation.stage)}
      </strong>
      {operation.reason ? <p>{operation.reason}</p> : null}
      <p className={styles.secondary}>
        Último estado guardado: {dateLabel(operation.updated_at)}.
      </p>
      {operation.state === "running" ? (
        <p>
          Otra solicitud figura en proceso. Esta lectura no confirma trabajo
          activo después de cerrar el navegador.
        </p>
      ) : null}
      {operation.retry_policy === "manual_reconciliation_required" ? (
        <p className={styles.warning}>
          Conciliación manual requerida. La reserva se conserva; no vuelvas a
          enviar este paso.
        </p>
      ) : null}
      <p className={styles.secondary}>
        Revisión de ejecución: {operation.run_revision}. Último paso confirmado:{" "}
        {operation.last_checkpoint
          ? dateLabel(operation.last_checkpoint.committed_at)
          : "ninguno"}
        .
      </p>
      <code>{operation.operation_id}</code>
    </div>
  );
}
