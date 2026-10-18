import { Fragment } from "react";
import type { Schema } from "@/lib/api/types";
import type { ComparisonSnapshot } from "@/lib/comparison/types";
import { countLabel, signalLabels } from "@/lib/comparison/presentation";
import { sourceLabel } from "@/lib/runs/corpus";
import { dateLabel } from "@/lib/runs/presentation";
import shared from "@/components/runs/runs.module.css";
import styles from "./comparison.module.css";

function Period({ name, window }: { name: string; window: Schema<"Window"> }) {
  return (
    <>
      <span>{name}</span>
      <small>
        <time dateTime={window.start_inclusive}>
          {dateLabel(window.start_inclusive)}
        </time>{" "}
        inclusive
        <br />
        <time dateTime={window.end_exclusive}>
          {dateLabel(window.end_exclusive)}
        </time>{" "}
        exclusivo
      </small>
    </>
  );
}

function Count({ count }: { count: Schema<"Count"> }) {
  return (
    <>
      <strong>{countLabel(count)}</strong>
      {count.state === "unknown" ? (
        <>
          <small>{count.observed_count} publicaciones observadas</small>
          <small>{count.reason}</small>
        </>
      ) : null}
    </>
  );
}

function Contributions({
  count,
  snapshot,
  name,
}: {
  count: Schema<"Count">;
  snapshot: ComparisonSnapshot;
  name: string;
}) {
  const sources = new Map(
    snapshot.run.corpus.map((source) => [source.source_id, source]),
  );
  const titles = new Map(
    snapshot.groups.proposal?.evidence
      .filter((item) => item.kind === "text" && item.field === "title")
      .map((item) => [item.video_id, item.kind === "text" ? item.excerpt : ""]),
  );
  return (
    <section
      className={styles.contributions}
      aria-label={`Respaldo de la ${name.toLowerCase()}`}
    >
      <h4>{name}</h4>
      <p className={shared.secondary}>
        Total del corpus: {countLabel(count)}. Observadas:{" "}
        {count.observed_count}.
      </p>
      {count.reason ? <p className={shared.warning}>{count.reason}</p> : null}
      {count.by_source.length ? (
        <ul>
          {count.by_source.map((contribution) => {
            const source = sources.get(contribution.source_id);
            return (
              <li key={contribution.source_id}>
                <div className={styles.sourceHeading}>
                  {source ? (
                    <a
                      href={source.original_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {sourceLabel(source.original_url)}
                      <span className={shared.srOnly}>
                        {" "}
                        (abre en otra pestaña)
                      </span>
                    </a>
                  ) : (
                    <span>Canal no identificado</span>
                  )}
                  <span>{contribution.observed_count} observadas</span>
                </div>
                {contribution.video_ids.length ? (
                  <ul>
                    {contribution.video_ids.map((id) => (
                      <li key={id}>
                        <a
                          href={`https://www.youtube.com/watch?v=${encodeURIComponent(id)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {titles.get(id) ?? `Publicación ${id}`}
                          <span className={shared.srOnly}>
                            {" "}
                            (abre en YouTube en otra pestaña)
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={shared.secondary}>
                    Sin IDs observados en este aporte.
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className={shared.secondary}>
          {count.state === "known"
            ? "Sin publicaciones observadas en esta ventana."
            : "No se recibió un desglose de publicaciones; no acredita ausencia."}
        </p>
      )}
    </section>
  );
}

export function ComparisonView({
  snapshot,
  stale = false,
}: {
  snapshot: ComparisonSnapshot;
  stale?: boolean;
}) {
  const { comparison, groups } = snapshot;
  const complete =
    comparison.state === "complete" && comparison.coverage_state === "complete";
  const topics = new Map(
    groups.proposal?.topics.map((topic) => [topic.topic_id, topic]),
  );
  const labels: Record<Schema<"Comparison">["state"], string> = {
    groups_unconfirmed: "Grupos pendientes de confirmar",
    not_requested: "Comparación sin calcular",
    partial: "Comparación completa pendiente",
    complete: "Comparación disponible",
    failed: "Error de comparación",
  };
  return (
    <div className={styles.results}>
      <p className={styles.state}>{labels[comparison.state]}</p>
      {stale ? (
        <p className={shared.warning}>
          Lectura anterior conservada. Consulta la comparación para actualizar
          su contexto antes de solicitar un cálculo.
        </p>
      ) : null}
      {comparison.coverage_state !== "complete" ? (
        <p className={shared.warning}>
          Cobertura temática{" "}
          {comparison.coverage_state === "partial" ? "parcial" : "pendiente"}.
          La comparación completa de los once canales sigue pendiente;
          desconocido no equivale a cero.
        </p>
      ) : null}
      {comparison.state === "groups_unconfirmed" ? (
        <p>
          Inspecciona y <a href="#grupos">confirma la propuesta de grupos</a>{" "}
          antes de calcular ambas semanas.
        </p>
      ) : null}
      {comparison.state === "not_requested" ? (
        <p>
          Los grupos están confirmados. El cálculo requiere una solicitud
          explícita.
        </p>
      ) : null}
      {comparison.limitations.length ? (
        <ul className={styles.limitations}>
          {comparison.limitations.map((text, index) => (
            <li key={index}>{text}</li>
          ))}
        </ul>
      ) : null}
      <p className={shared.secondary}>
        Corte: {comparison.windows.timezone} · UTC−5. El día en curso está
        excluido.
      </p>
      {comparison.signals.length ? (
        <>
          <p className={styles.hint} id="comparison-scroll-help">
            La tabla compara las dos semanas. En pantallas pequeñas, desplázala
            horizontalmente para consultar todas las columnas.
          </p>
          <div
            className={styles.tableScroll}
            role="region"
            tabIndex={0}
            aria-label="Comparación de publicaciones por tema"
            aria-describedby="comparison-scroll-help"
          >
            <table>
              <caption>
                Publicaciones de IA por tema principal en el corpus de 11
                canales
              </caption>
              <thead>
                <tr>
                  <th scope="col">Tema principal</th>
                  <th scope="col">
                    <Period
                      name="Semana anterior · A"
                      window={comparison.windows.previous}
                    />
                  </th>
                  <th scope="col">
                    <Period
                      name="Semana reciente · B"
                      window={comparison.windows.recent}
                    />
                  </th>
                  <th scope="col">Diferencia</th>
                  <th scope="col">Variación</th>
                  <th scope="col">Señal en el corpus</th>
                </tr>
              </thead>
              <tbody>
                {comparison.signals.map((signal) => {
                  const topic = topics.get(signal.topic_id);
                  const text = signalLabels(signal, complete);
                  return (
                    <Fragment key={signal.topic_id}>
                      <tr>
                        <th scope="row">
                          <strong>{topic?.name ?? signal.topic_id}</strong>
                          {topic ? <small>{topic.description}</small> : null}
                        </th>
                        <td className={styles.numeric}>
                          <Count count={signal.previous} />
                        </td>
                        <td className={styles.numeric}>
                          <Count count={signal.recent} />
                        </td>
                        <td className={styles.numeric}>{text.delta}</td>
                        <td className={styles.numeric}>{text.percentage}</td>
                        <td>
                          <strong>{text.label}</strong>
                          {text.reason ? <small>{text.reason}</small> : null}
                        </td>
                      </tr>
                      <tr className={styles.evidenceRow}>
                        <td colSpan={6}>
                          <details>
                            <summary>
                              Ver publicaciones y aporte por canal:{" "}
                              {topic?.name ?? signal.topic_id}
                            </summary>
                            <p className={shared.secondary}>
                              Cada ID contribuye solo a su tema principal. Los
                              temas secundarios no suman publicaciones.
                            </p>
                            <div className={styles.breakdown}>
                              <Contributions
                                name="Semana anterior"
                                count={signal.previous}
                                snapshot={snapshot}
                              />
                              <Contributions
                                name="Semana reciente"
                                count={signal.recent}
                                snapshot={snapshot}
                              />
                            </div>
                          </details>
                        </td>
                      </tr>
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p className={styles.empty}>
          {complete
            ? "No hay temas con publicaciones observadas en la comparación guardada."
            : "Todavía no hay señales calculadas para mostrar. La ausencia de resultados no significa cero publicaciones."}
        </p>
      )}
      <details className={styles.provenance}>
        <summary>Contexto de la comparación guardada</summary>
        <dl>
          <div>
            <dt>Ejecución</dt>
            <dd>
              <code>{comparison.run_id}</code>
            </dd>
          </div>
          <div>
            <dt>Grupos</dt>
            <dd>
              {comparison.groups_id ?? "Sin propuesta"} · versión{" "}
              {comparison.groups_version ?? "pendiente"}
            </dd>
          </div>
          <div>
            <dt>Confirmación</dt>
            <dd>{comparison.confirmation_id ?? "Pendiente"}</dd>
          </div>
          <div>
            <dt>Revisión de comparación</dt>
            <dd>{comparison.comparison_revision ?? "Sin cálculo"}</dd>
          </div>
          <div>
            <dt>Cálculo guardado</dt>
            <dd>
              {comparison.computed_at ? (
                <time dateTime={comparison.computed_at}>
                  {dateLabel(comparison.computed_at)}
                </time>
              ) : (
                "Sin cálculo"
              )}
            </dd>
          </div>
          <div>
            <dt>Consulta recibida</dt>
            <dd>
              <time dateTime={snapshot.servedAt}>
                {dateLabel(snapshot.servedAt)}
              </time>
            </dd>
          </div>
        </dl>
      </details>
      <p className={shared.secondary}>
        La señal describe publicaciones observadas en estas ventanas. El aumento
        no demuestra crecimiento de audiencia, viralidad, causalidad ni valor
        editorial.
      </p>
    </div>
  );
}
