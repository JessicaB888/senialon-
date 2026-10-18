import { Icon } from "@/components/icon";
import { Workspace } from "@/components/workspace";
import { requirePageAccess } from "@/lib/auth/page-access";
import styles from "./page.module.css";

// Fixed, user-confirmed source URLs. This is configuration, not fetched results.
const corpus = [
  "https://www.youtube.com/@30X_by_Andres_Bilbao",
  "https://www.youtube.com/@30XDevs",
  "https://www.youtube.com/@Platzi",
  "https://www.youtube.com/@EloisaWolf",
  "https://www.youtube.com/@manuelavillegas",
  "https://www.youtube.com/@Gartnervideo",
  "https://www.youtube.com/@AdrianSaenz",
  "https://www.youtube.com/@EDteam",
  "https://www.youtube.com/@KimiMoonshot",
  "https://www.youtube.com/user/TheRANDCorporation",
  "https://www.youtube.com/channel/UChugFTK0KyrES9terTid8vA",
] as const;

export default async function Home() {
  await requirePageAccess();
  return (
    <Workspace>
      <div className={styles.heading}>
        <div>
          <h1>Ejecuciones</h1>
          <p className={styles.intro}>
            Del contenido publicado a una oportunidad con evidencia.
          </p>
        </div>
        <div className={styles.action}>
          <button type="button" disabled aria-describedby="collection-state">
            Iniciar recolección
            <Icon name="arrow" />
          </button>
          <p id="collection-state">Recolección aún no habilitada.</p>
        </div>
      </div>
      <section className={styles.scope} aria-label="Alcance previsto del radar">
        <div>
          <span>Corpus previsto</span>
          <strong>11 canales de YouTube</strong>
        </div>
        <div>
          <span>Publicaciones</span>
          <strong>IA · hasta 3 minutos</strong>
        </div>
        <div>
          <span>Comparación</span>
          <strong>7 días frente a los 7 anteriores</strong>
        </div>
        <div>
          <span>Corte de cada día</span>
          <strong>Hora de Colombia</strong>
        </div>
      </section>
      <section className={styles.start} aria-labelledby="start-title">
        <div className={styles.startHeading}>
          <Icon name="runs" />
          <span>Sin ejecución seleccionada</span>
        </div>
        <h2 id="start-title">El radar empieza con una ejecución</h2>
        <p className={styles.explanation}>
          Reúne publicaciones de las dos semanas para descubrir qué temas se
          repiten y qué contenido puede aportar a tu audiencia.
        </p>
        <ol className={styles.steps}>
          <li>
            <span className={styles.stepNumber} aria-hidden="true">
              1
            </span>
            <div>
              <h3>Recolecta publicaciones</h3>
              <p>
                Conserva las fuentes, las fechas y lo que falte por consultar.
              </p>
            </div>
          </li>
          <li>
            <span className={styles.stepNumber} aria-hidden="true">
              2
            </span>
            <div>
              <h3>Confirma los temas</h3>
              <p>Revisa los grupos propuestos antes de comparar las semanas.</p>
            </div>
          </li>
          <li>
            <span className={styles.stepNumber} aria-hidden="true">
              3
            </span>
            <div>
              <h3>Construye tu criterio</h3>
              <p>Elige una pieza y contrasta su utilidad con la evidencia.</p>
            </div>
          </li>
        </ol>
        <p className={styles.footnote}>
          Puedes revisar cualquier publicación elegible, aunque su tema no esté
          creciendo.
        </p>
      </section>
      <details className={styles.sources}>
        <summary>
          <span>
            Canales previstos <span className={styles.sourceCount}>11</span>
          </span>
          <span className={styles.sourceAction}>
            Ver fuentes
            <Icon name="chevron" />
          </span>
        </summary>
        <p className={styles.sourceDescription}>
          Estas son las fuentes del corpus. Su cobertura se mostrará cuando
          exista una ejecución disponible.
        </p>
        <ul>
          {corpus.map((url) => (
            <li key={url}>
              <a href={url} target="_blank" rel="noopener noreferrer">
                <span>
                  {url.includes("/channel/")
                    ? "Canal UChugFTK0KyrES9terTid8vA"
                    : url.split("/").at(-1)}
                </span>
                <Icon name="external" />
                <span className={styles.srOnly}> (abre en otra pestaña)</span>
              </a>
            </li>
          ))}
        </ul>
      </details>
      <p className={styles.interpretation}>
        Más publicaciones no significa más valor. La señal temática y la
        utilidad se revisan por separado.
      </p>
    </Workspace>
  );
}
