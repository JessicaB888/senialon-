// GENERADO. No editar; ejecutar npm run contract:generate.
// Fuente única: docs/contracts/openapi.json
// Versión: 1.0.0; SHA-256: d7e0b018263658e686da00997ddffbd19ba96e6e73de5b08e3f8917b95375956
export interface paths {
  "/api/v1/meta": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Consultar versión y disponibilidad de extensiones
     * @description Consultar versión y disponibilidad de extensiones
     */
    get: operations["getCapabilities"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/v1/runs": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Recuperar ejecuciones guardadas, más recientes primero
     * @description Recuperar ejecuciones guardadas, más recientes primero
     */
    get: operations["listRuns"];
    put?: never;
    /**
     * Crear ejecución con corpus y ventanas fijos
     * @description Persiste ejecución inicial y calcula fronteras con ALG, sin adquirir ni inferir. Nueva clave crea nueva ejecución; misma clave/cuerpo recupera la ya creada.
     */
    post: operations["createRun"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/v1/runs/{run_id}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Recuperar contexto y último checkpoint
     * @description Recuperar contexto y último checkpoint
     */
    get: operations["getRun"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/v1/runs/{run_id}/advance": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Ejecutar una unidad acotada y persistida
     * @description scope corpus avanza adquisición/IA/grupos; scope comparison exige confirmación exacta; scope analysis exige selección previa. 409 si versión/estado no permite el avance. Mismo paso con otra clave no duplica proveedor: identidad de dominio y claim atómico. Reserva antes de CADA llamada pagada dentro de un lote. No liberar/repetir resultado incierto; requiere reconciliación BE fuera de este endpoint. Un intento terminado responde 200 con estado de la unidad (también blocked/failed/uncertain); errores antes de reclamar responden 4xx/5xx. La ejecución no sigue sola tras responder.
     */
    post: operations["advanceRun"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/v1/runs/{run_id}/analyses": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Recuperar piezas seleccionadas y sus versiones
     * @description Recuperar piezas seleccionadas y sus versiones
     */
    get: operations["listAnalyses"];
    put?: never;
    /**
     * Seleccionar una pieza elegible para análisis profundo
     * @description No requiere grupos, aumento ni comparación. Persiste análisis inicial y revisión pendiente sin llamadas de proveedor. El trabajo se solicita explícitamente con advance scope analysis. Misma pieza/ejecución reutiliza análisis; no reprocesar por defecto. eligibility distinto de eligible: 422 NOT_ELIGIBLE.
     */
    post: operations["selectAnalysis"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/v1/runs/{run_id}/analyses/{analysis_id}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Consultar ficha y contexto exacto de análisis
     * @description Consultar ficha y contexto exacto de análisis. analysis_version anterior a la última es solo lectura. La revisión recuperada pertenece a esa versión exacta; no implica que pueda escribirse. El envelope de la ficha histórica devuelve current_actions=[] y operations_to_inspect=[]; data permanece intacto. Recuperar Run o la ficha actual para capacidades u operaciones presentes. No recalcular ni actualizar resultados al consultar.
     */
    get: operations["getAnalysis"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/v1/runs/{run_id}/analyses/{analysis_id}/notion-export": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Extensión futura: guardar manualmente una oportunidad
     * @description Fuera del núcleo/G0. Solo habilitar después de BE3.15/3.16 y FE1.12. Si diferido: no botón ni éxito simulado. Base única preconfigurada, dedupe video_id/base, snapshot de contexto y revisión conservados; el registro externo inicia pendiente. Sin Slack/Gmail ni sobrescritura silenciosa. Nunca exportar desde GET.
     */
    post: operations["exportNotion"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/v1/runs/{run_id}/analyses/{analysis_id}/review": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Recuperar revisión de una versión exacta
     * @description Recuperar revisión de una versión exacta. analysis_version anterior a la última es solo lectura. La revisión recuperada pertenece a esa versión exacta; no implica que pueda escribirse. El envelope de la ficha histórica devuelve current_actions=[] y operations_to_inspect=[]; data permanece intacto. Recuperar Run o la ficha actual para capacidades u operaciones presentes. No recalcular ni actualizar resultados al consultar.
     */
    get: operations["getReview"];
    /**
     * Guardar decisión, motivo y revisión de evidencia atómicamente
     * @description Verifica expected_analysis_version contra última versión y expected_review_revision contra revisión actual; conflicto 409 VERSION_CONFLICT sin escribir. No cambia metadatos/IA/temas/señal. reason requerido incluso para volver a pendiente; cliente conserva texto si falla. Todos los evidence_ids de esa versión exactamente una vez.
     */
    put: operations["recordReview"];
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/v1/runs/{run_id}/comparison": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Consultar conteos y sus fuentes sin calcularlos
     * @description Consultar conteos y sus fuentes sin calcularlos
     */
    get: operations["getComparison"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/v1/runs/{run_id}/coverage": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Inspeccionar cobertura de las once fuentes por ventana
     * @description Inspeccionar cobertura de las once fuentes por ventana
     */
    get: operations["getCoverage"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/v1/runs/{run_id}/groups": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Inspeccionar propuesta automática conjunta de temas
     * @description Inspeccionar propuesta automática conjunta de temas
     */
    get: operations["getGroups"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/v1/runs/{run_id}/groups/confirmation": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Confirmar versión exacta sin editar asignaciones
     * @description Persiste confirmación, incrementa revisión de ejecución. No calcula comparación ni aprueba adaptación. Misma propuesta ya confirmada devuelve confirmación existente; propuesta obsoleta 409. Clasificar de nuevo requiere nueva ejecución.
     */
    post: operations["confirmGroups"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/v1/runs/{run_id}/operations/{operation_id}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Consultar estado de una operación sin reanudarla
     * @description Consultar estado de una operación sin reanudarla
     */
    get: operations["getOperation"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/v1/runs/{run_id}/videos": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Listar todas las publicaciones elegibles sin exigir tema/señal
     * @description Solo eligibility=eligible; seguir next_cursor hasta null. No exige grupos confirmados ni comparación. IDs pendientes/excluidos se inspeccionan desde cobertura y detalle, no se seleccionan.
     */
    get: operations["listEligibleVideos"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/api/v1/runs/{run_id}/videos/{video_id}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Consultar publicación y clasificación conservadas
     * @description Solo un ID perteneciente a la ejecución; puede exponer elegibilidad pendiente/excluida sin autorizar selección. Sin adquisición nueva ni inferencia.
     */
    get: operations["getVideo"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
}
export type webhooks = Record<string, never>;
export interface components {
  schemas: {
    /** @description Solo propuesta respaldada. No recomendar por popularidad/aumento únicamente; sin cifras/casos propios/urgencias/activos inventados. */
    Adaptation: {
      angle: components["schemas"]["Suggestion"] | null;
      expected_contribution: components["schemas"]["SupportedStatement"] | null;
      limitations: string[];
      proposed_cta: components["schemas"]["Suggestion"] | null;
      proposed_hook: components["schemas"]["Suggestion"] | null;
      proposed_structure: components["schemas"]["Suggestion"][];
      stage: components["schemas"]["Stage"];
    } & unknown;
    AdvanceRequest: {
      expected_run_revision: number;
      target: components["schemas"]["AdvanceTarget"];
    };
    AdvanceTarget:
      | components["schemas"]["CorpusTarget"]
      | components["schemas"]["ComparisonTarget"]
      | components["schemas"]["AnalysisTarget"];
    AiAssessment:
      | components["schemas"]["AiDecision"]
      | components["schemas"]["UnavailableAssessment"];
    /** @description Decisión tipada auténtica de JEV; explicación atribuida a resumen de evidencia o síntesis Gemini, sin edición manual de clasificación. Una decisión insuficiente es distinta de fallo del proveedor. Las referencias deben existir y pertenecer al material evaluado. */
    AiDecision: {
      /** @enum {string} */
      decision: "relevant" | "not_relevant" | "insufficient_information";
      evidence_ids: string[];
      explanation: string;
      /** @enum {string} */
      explanation_source: "evidence_summary" | "gemini_synthesis";
      /** @constant */
      state: "decided";
      trace: components["schemas"]["JevTrace"];
    } & (unknown & {
      /**
       * @description discriminator enum property added by openapi-typescript
       * @enum {string}
       */
      state: "decided";
    });
    /** @description Cursor opaco, orden estable; next_cursor=null significa fin. Para listado por ejecución, cursor fija snapshot_revision; si cambia, 409 y reiniciar listado sin mezclar páginas. No truncar silenciosamente. */
    AnalysesResponse: {
      items: components["schemas"]["AnalysisRef"][];
      meta: components["schemas"]["Meta"];
      next_cursor: string | null;
      snapshot_revision: number | null;
    };
    /** @description Identidad de selección estable. Cada checkpoint de resultados agrega analysis_version inmutable; revisión vinculada a versión exacta y su propio revision. Nuevas versiones no heredan aprobación/revisión de evidencia. Una captura no acredita éxito ni crecimiento de desempeño. Los resultados, material, criterios, SignalReference y capacidades capturadas no se reescriben al leer. Las operaciones y capacidades presentes se exponen fuera de data, en AnalysisResponse.operations_to_inspect/current_actions. La revisión sigue su revisión propia y vínculo de versión exacta; no se transfiere a otra versión. */
    Analysis: {
      adaptation: components["schemas"]["Adaptation"];
      affinity: {
        company_context: components["schemas"]["FitAssessment"];
        persona: components["schemas"]["FitAssessment"];
        pillar: components["schemas"]["PillarAssessment"];
      };
      /** @description Capacidades capturadas en esta versión de resultados, preservadas para contexto histórico; no autorizan acciones en el estado presente. FE habilita controles solo desde AnalysisResponse.current_actions. Conservar el valor persistido al recuperar históricos, sin reescribirlo desde GET. */
      allowed_actions: ("advance_analysis" | "record_review")[];
      analysis_id: string;
      analysis_version: number;
      audiovisual: components["schemas"]["Stage"];
      /** Format: date-time */
      created_at: string;
      dimensions: components["schemas"]["ObservationDimension"][] &
        (unknown & unknown & unknown & unknown & unknown & unknown);
      evidence: components["schemas"]["Evidence"][];
      groups_id: string | null;
      groups_version: number | null;
      hypotheses: components["schemas"]["Hypothesis"][];
      material: components["schemas"]["Material"][];
      model_uses: components["schemas"]["ModelUse"][];
      performance: {
        capture_id: string;
        reason: string;
        /** @constant */
        state: "not_evaluable";
      };
      problem_or_learning: components["schemas"]["SupportedStatement"] | null;
      publication: components["schemas"]["Publication"];
      review: components["schemas"]["EditorialReview"];
      run_id: string;
      signal: components["schemas"]["SignalReference"];
      value: components["schemas"]["ValueAssessment"];
      /** Format: date-time */
      version_created_at: string;
      versions: components["schemas"]["Versions"];
      windows: components["schemas"]["Windows"];
    };
    AnalysisRef: {
      analysis_id: string;
      analysis_version: number;
      audiovisual: components["schemas"]["Stage"];
      /** Format: date-time */
      created_at: string;
      video_id: components["schemas"]["VideoId"];
    };
    /** @description data conserva el contexto de la versión solicitada. current_actions y operations_to_inspect son metadatos de entrega derivados del estado persistido actual, fuera del snapshot y sin efectos de escritura. Para una versión histórica ambas listas son []; la ficha y revisión exactas permanecen consultables. No recalcular resultados, inferir o mutar al leer. */
    AnalysisResponse: {
      /** @description Capacidades actuales del envelope, fuera del snapshot data. Si data.analysis_version es anterior a la última devuelve []; no ofrece avance ni guardado editorial sobre ese histórico. Para la versión actual solo acciones permitidas ahora. FE usa esta lista, nunca data.allowed_actions, para habilitar controles. La ausencia no autoriza inferir otra transición; controles optimistas obligatorios si cambia el estado tras leer. */
      current_actions: ("advance_analysis" | "record_review")[];
      data: components["schemas"]["Analysis"];
      meta: components["schemas"]["Meta"];
      /** @description En el envelope de la ficha actual, operaciones activas o con incidencia pendiente de este analysis_id y run_id, recuperables por GET aun tras perder la respuesta o cerrar el navegador. No incluir operaciones de otras piezas. Para una versión histórica devuelve []; consultar Run o la ficha actual para el estado operativo. Son metadatos actuales fuera de data, no campos del snapshot. No autoriza reintento de consumo. */
      operations_to_inspect: components["schemas"]["OperationReference"][];
    };
    AnalysisTarget: {
      analysis_id: string;
      expected_analysis_version: number;
      /**
       * @description discriminator enum property added by openapi-typescript
       * @enum {string}
       */
      scope: "analysis";
    };
    /** @description Único principal, excluido de secundarios. Secundarios no contados. IDs de evidencia resolubles en evidence de la propuesta. */
    Assignment: {
      evidence_ids: string[];
      main_topic_id: string;
      secondary_topic_ids: string[];
      video_id: components["schemas"]["VideoId"];
    };
    /** @description URL al original contrastable con marca temporal. end >= start, marcas dentro del material procesado. No hipótesis ni sugerencias. */
    AudiovisualEvidence: {
      /** Format: date-time */
      captured_at: string;
      /** @enum {string} */
      dimension:
        | "format"
        | "verbal_hook"
        | "visual_hook"
        | "audio_hook"
        | "structure"
        | "problem";
      end_seconds: number | null;
      evidence_id: string;
      /**
       * @description discriminator enum property added by openapi-typescript
       * @enum {string}
       */
      kind: "audiovisual";
      observation: string;
      /** Format: uri */
      source_url: string;
      start_seconds: number;
      video_id: components["schemas"]["VideoId"];
    };
    /** @description Incluye TODOS los cargos nuevos y reservas compartidos por la demo; excluye abono Vercel existente. null = costo no determinado, nunca cero. allowed requiere estimación justificable antes de CADA llamada; no autoriza gasto desde GET. */
    Budget: {
      available_for_new_calls: string | null;
      confirmed_new_charges: string | null;
      /** @constant */
      currency: "USD";
      /** @constant */
      incremental_limit: "20.00";
      reason: string | null;
      reserved: string | null;
      /** @enum {string} */
      state: "check_required" | "allowed" | "blocked" | "uncertain";
    };
    /** @description Metadatos del acuerdo documental de integración. G0 contractual cerrado; accesos, gasto, implementación y evaluación real siguen pendientes en sus tareas. */
    Capabilities: {
      /** @constant */
      contract_status: "agreed";
      notion: components["schemas"]["NotionAvailability"];
      reviews: {
        /** @constant */
        alg_2_1: "reviewed";
        /** @constant */
        fe_1_1_documentary: "reviewed";
        /** @constant */
        g0: "closed";
      };
    };
    CapabilitiesResponse: {
      data: components["schemas"]["Capabilities"];
      meta: components["schemas"]["Meta"];
    };
    ChannelContribution: {
      observed_count: number;
      source_id: string;
      video_ids: components["schemas"]["VideoId"][];
    };
    Checkpoint: {
      /** Format: date-time */
      committed_at: string;
      item_id: string | null;
      operation_id: string;
      stage: string;
    };
    /** @description Ambos Count known y A>0. delta=B-A; %=100*(B-A)/A. Sin umbral de tendencia. Cálculo exclusivo de ALG. */
    ComparableSignal: {
      delta: number;
      /** @enum {string} */
      direction: "increase" | "unchanged" | "decrease";
      groups_id: string;
      groups_version: number;
      /**
       * @description discriminator enum property added by openapi-typescript
       * @enum {string}
       */
      kind: "comparable";
      percentage_change: number;
      percentage_reason: null;
      previous: components["schemas"]["PositiveCount"];
      recent: components["schemas"]["KnownCount"];
      topic_id: string;
    };
    /** @description Antes de confirmar: signals=[] y computed_at/revision/confirmation=null. partial solo contiene PartialSignal. No crecimiento global, de audiencia o causalidad. */
    Comparison: {
      comparison_revision: number | null;
      computed_at: string | null;
      confirmation_id: string | null;
      /** @enum {string} */
      coverage_state: "pending" | "partial" | "complete";
      groups_id: string | null;
      groups_version: number | null;
      limitations: string[];
      run_id: string;
      signals: components["schemas"]["TopicSignal"][];
      /** @enum {string} */
      state:
        | "groups_unconfirmed"
        | "not_requested"
        | "partial"
        | "complete"
        | "failed";
      windows: components["schemas"]["Windows"];
    } & (unknown & unknown & unknown & unknown & unknown);
    ComparisonResponse: {
      data: components["schemas"]["Comparison"];
      meta: components["schemas"]["Meta"];
    };
    ComparisonTarget: {
      /**
       * @description discriminator enum property added by openapi-typescript
       * @enum {string}
       */
      scope: "comparison";
    };
    Confirmation: {
      /** @constant */
      actor: "shared_demo_operator";
      confirmation_id: string;
      /** Format: date-time */
      confirmed_at: string;
      groups_id: string;
      groups_version: number;
    };
    ConfirmGroupsRequest: {
      expected_run_revision: number;
      groups_id: string;
      groups_version: number;
    };
    CorpusSource: {
      /** Format: uri */
      original_url: string;
      resolution: components["schemas"]["Stage"];
      resolved_channel_id: string | null;
      source_id: string;
    };
    CorpusTarget: {
      /**
       * @description discriminator enum property added by openapi-typescript
       * @enum {string}
       */
      scope: "corpus";
    };
    Count:
      | components["schemas"]["KnownCount"]
      | components["schemas"]["UnknownCount"];
    /** @description complete exige adquisición, elegibilidad, pertinencia y tema resueltos en ambas ventanas de los once canales. No es archivo de eliminados/privatizados. Una decisión JEV insuficiente no resuelve pertinencia para conteos; una exclusión respaldada no requiere tema. Etapas completas sin entradas o no aplicables justificadas pueden resolver celdas vacías. */
    Coverage: {
      cells: components["schemas"]["CoverageCell"][];
      /** @constant */
      expected_source_count: 11;
      /** @constant */
      historical_scope: "public_recoverable_at_capture";
      limitations: string[];
      run_id: string;
      run_revision: number;
      /** @enum {string} */
      thematic_state: "pending" | "partial" | "complete";
    };
    /** @description Celda por fuente y ventana: exactamente 22 celdas únicas en coverage. Canal fallido sigue presente. AV/valor/afinidad no participan aquí. eligibility refleja la etapa técnica previa a IA, no Publication.eligibility final. Celdas vacías o exclusiones resueltas no exigen llamadas JEV/Gemini; etapas no aplicables llevan motivo. Incertidumbre temporal conserva el ID entre los pendientes de las ventanas posibles. */
    CoverageCell: {
      acquisition: components["schemas"]["Stage"];
      discovered_video_ids: components["schemas"]["VideoId"][];
      eligibility: components["schemas"]["Stage"];
      failures: string[];
      ia_relevance: components["schemas"]["Stage"];
      main_topic: components["schemas"]["Stage"];
      pages_read: number;
      pagination_complete: boolean;
      source_id: string;
      unresolved_video_ids: components["schemas"]["VideoId"][];
      /** @enum {string} */
      window: "previous" | "recent";
    };
    CoverageResponse: {
      data: components["schemas"]["Coverage"];
      meta: components["schemas"]["Meta"];
    };
    /** @description El servidor fija corpus y ventanas desde inicio real; no acepta listas/fechas/clasificaciones editables. */
    CreateRunRequest: Record<string, never>;
    Duration:
      | components["schemas"]["KnownDuration"]
      | components["schemas"]["UnknownDuration"];
    /** @description Estados acordados: inicial pending_review/reason=null; considerar adaptación no aprueba hechos ni publica; discarded conserva contexto. Todo cambio requiere motivo; no cambia conteos ni grupos. La credencial compartida no identifica una persona real. */
    EditorialReview: {
      /** @constant */
      actor: "shared_demo_operator";
      analysis_id: string;
      analysis_version: number;
      /** @enum {string} */
      decision: "pending_review" | "consider_for_adaptation" | "discarded";
      evidence_reviews: components["schemas"]["EvidenceReview"][];
      reason: string | null;
      review_id: string;
      revision: number;
      run_id: string;
      /** Format: date-time */
      updated_at: string;
    } & unknown;
    /** @description A=B=0 conocidos y cobertura suficiente. Sin novedad. */
    EmptySignal: {
      /** @constant */
      delta: 0;
      /** @constant */
      direction: "unchanged";
      groups_id: string;
      groups_version: number;
      /**
       * @description discriminator enum property added by openapi-typescript
       * @enum {string}
       */
      kind: "no_observed_publications";
      percentage_change: null;
      /** @constant */
      percentage_reason: "zero_baseline";
      previous: components["schemas"]["ZeroCount"];
      recent: components["schemas"]["ZeroCount"];
      topic_id: string;
    };
    /** @description Mensaje saneado sin secretos, stack ni claves. Detalles de proveedor visibles solo como limitación segura. Error no borra resultados persistidos. */
    ErrorDetail: {
      /** @enum {string} */
      code:
        | "AUTH_REQUIRED"
        | "ORIGIN_FORBIDDEN"
        | "NOT_FOUND"
        | "VALIDATION_ERROR"
        | "VERSION_CONFLICT"
        | "IDEMPOTENCY_KEY_REUSED"
        | "GROUPS_NOT_CONFIRMED"
        | "NOT_ELIGIBLE"
        | "OPERATION_IN_PROGRESS"
        | "PROVIDER_RESULT_UNCERTAIN"
        | "BUDGET_BLOCKED"
        | "FEATURE_UNAVAILABLE"
        | "PROVIDER_FAILURE"
        | "INTERNAL_ERROR";
      current_revision: number | null;
      issues: {
        message: string;
        path: string;
      }[];
      message: string;
      operation_id: string | null;
      /** @enum {string} */
      retry_policy:
        | "none"
        | "same_request_after_status_read"
        | "manual_reconciliation_required";
      stage: string | null;
    } & (unknown & unknown);
    ErrorResponse: {
      error: components["schemas"]["ErrorDetail"];
      meta: components["schemas"]["Meta"];
    };
    Evidence:
      | components["schemas"]["TextEvidence"]
      | components["schemas"]["AudiovisualEvidence"];
    /** @description Revisión humana acordada, independiente de la observación original. Inicial pending_review; todo estado revisado requiere nota. No reescribe clasificaciones ni atribuye identidad personal. */
    EvidenceReview: {
      evidence_id: string;
      note: string | null;
      /** @enum {string} */
      state:
        | "pending_review"
        | "verified_against_source"
        | "disputed"
        | "insufficient_to_verify";
    } & unknown;
    FitAssessment:
      | components["schemas"]["FitDecision"]
      | components["schemas"]["UnavailableAssessment"];
    /** @description Decisión tipada auténtica de JEV; explicación atribuida a resumen de evidencia o síntesis Gemini, sin edición manual de clasificación. Una decisión insuficiente es distinta de fallo del proveedor. Las referencias deben existir y pertenecer al material evaluado. */
    FitDecision: {
      /** @enum {string} */
      decision: "supported" | "unsupported" | "insufficient_information";
      evidence_ids: string[];
      explanation: string;
      /** @enum {string} */
      explanation_source: "evidence_summary" | "gemini_synthesis";
      /** @constant */
      state: "decided";
      trace: components["schemas"]["JevTrace"];
    } & (unknown & {
      /**
       * @description discriminator enum property added by openapi-typescript
       * @enum {string}
       */
      state: "decided";
    });
    /** @description Propuesta canónica conjunta de ambas semanas. Solo confirmar; no endpoint de edición. Cambios de clasificación requieren nueva ejecución; preservar versión anterior. */
    Groups: {
      assignments: components["schemas"]["Assignment"][];
      confirmation: components["schemas"]["Confirmation"] | null;
      /** Format: date-time */
      created_at: string;
      evidence: components["schemas"]["Evidence"][];
      /** @description Llamadas efectivas de Gemini que produjeron la propuesta canónica, incluidas propuestas por lote y conciliación si las hubo. Una propuesta con temas exige al menos una entrada; sin temas la lista puede estar vacía si no hubo llamada, sin inventar generación. Conservar modelo, versión del prompt, criterios y momento efectivos; ID/uso null solo cuando no fueron informados. No rellenar con un modelo supuesto ni con configuración futura. La traza forma parte del snapshot de esta versión de grupos. */
      generation_trace: components["schemas"]["ModelUse"][] & unknown;
      groups_id: string;
      groups_version: number;
      input_windows: components["schemas"]["Windows"];
      limitations: string[];
      run_id: string;
      /** @enum {string} */
      state: "proposed" | "confirmed";
      topics: components["schemas"]["Topic"][];
      unresolved_video_ids: components["schemas"]["VideoId"][];
      versions: components["schemas"]["Versions"];
    } & (unknown & unknown & unknown);
    GroupsResponse: {
      data: components["schemas"]["GroupView"];
      meta: components["schemas"]["Meta"];
    };
    GroupView: {
      proposal: components["schemas"]["Groups"] | null;
      run_id: string;
      stage: components["schemas"]["Stage"];
    };
    /** @description Posible explicación, nunca observación ni causalidad demostrada. */
    Hypothesis: {
      evidence_ids: string[];
      hypothesis_id: string;
      limitations: string[];
      text: string;
    };
    /** @description Metadatos conocidos del intento sin una decisión tipada válida. null significa desconocido/no disponible, nunca modelo, petición, pregunta o respuesta inventados. not_sent significa que BE sabe que no se envió; sent que conoce el envío, sin afirmar recepción ni cargo; unknown que no puede confirmarlo. Conservar solo material seguro sin claves ni cabeceras de autorización. No implica autorización para reintentar ni sustituye Operation/uso/reserva. */
    JevAttemptTrace: {
      attempted_at: string | null;
      criteria_version: string | null;
      input_text: string | null;
      model: string | null;
      /** @constant */
      provider: "jev";
      provider_request_id: string | null;
      question: string | null;
      question_version: string | null;
      raw_response_text: string | null;
      /** @enum {string} */
      submission_state: "not_sent" | "sent" | "unknown";
    } & unknown;
    /** @description Entradas/respuesta reales sin claves. Modelo real del proveedor, sin identificador por defecto. Probabilidad no es precisión ni viralidad. JEV decide; no se le atribuye la explicación sintetizada. */
    JevTrace: {
      criteria_version: string;
      /** Format: date-time */
      decided_at: string;
      input_text: string;
      model: string;
      probabilities: components["schemas"]["Probability"][] | null;
      /** @constant */
      provider: "jev";
      provider_request_id: string | null;
      question: string;
      question_version: string;
      raw_response_text: string;
    };
    /** @description total_count=observed_count=longitud IDs distintos; aportes suman ese total. Solo cobertura suficiente de la ventana. Cobertura suficiente de las once fuentes de esa ventana y mismos criterios/grupos; no basta resolver los IDs observados de un solo tema. */
    KnownCount: {
      by_source: components["schemas"]["ChannelContribution"][];
      observed_count: number;
      reason: null;
      /**
       * @description discriminator enum property added by openapi-typescript
       * @enum {string}
       */
      state: "known";
      total_count: number;
      video_ids: components["schemas"]["VideoId"][];
    };
    KnownDuration: {
      reason: null;
      seconds: number;
      /**
       * @description discriminator enum property added by openapi-typescript
       * @enum {string}
       */
      state: "known";
    };
    /** @description Conteo original del proveedor como cadena decimal para evitar pérdida de precisión en JavaScript. */
    KnownMetric: {
      reason: null;
      /**
       * @description discriminator enum property added by openapi-typescript
       * @enum {string}
       */
      state: "known";
      value: string;
    };
    Material: {
      /** @enum {string} */
      kind: "public_video_url" | "metadata_text" | "available_text";
      limitations: string[];
      material_id: string;
      processed_end_seconds: number | null;
      processed_start_seconds: number | null;
      /** Format: uri */
      source_url: string;
    };
    Meta: {
      /** @constant */
      contract_version: "1.0.0";
      /** @description Identificador de la solicitud HTTP que sirve esta respuesta; coincide con X-Request-Id. Next lo propaga al binding interno. Un replay conserva el resultado persistido y devuelve metadatos de la solicitud actual. No sustituye run_id, operation_id, provider_request_id ni Idempotency-Key; no se introduce un alias trace_id. */
      request_id: string;
      /** Format: date-time */
      served_at: string;
    };
    Metric:
      | components["schemas"]["KnownMetric"]
      | components["schemas"]["UnknownMetric"];
    /** @description Modelo y uso reales, no estimados como hechos. Se omiten claves/cabeceras de autorización. */
    ModelUse: {
      criteria_version: string;
      model: string;
      /** Format: date-time */
      processed_at: string;
      prompt_or_question_version: string;
      /** @enum {string} */
      provider: "gemini" | "jev";
      provider_request_id: string | null;
      usage_report: string | null;
    };
    /** @description Ambas ventanas known, A=0, B>0 y cobertura completa evaluable. No infinito ni porcentaje artificial. */
    NewInCorpusSignal: {
      delta: number;
      /** @constant */
      direction: "increase";
      groups_id: string;
      groups_version: number;
      /**
       * @description discriminator enum property added by openapi-typescript
       * @enum {string}
       */
      kind: "new_in_corpus";
      percentage_change: null;
      /** @constant */
      percentage_reason: "zero_baseline";
      previous: components["schemas"]["ZeroCount"];
      recent: components["schemas"]["PositiveCount"];
      topic_id: string;
    };
    /** @description Feature explícita. deferred no obliga implementar endpoint/botón ni condiciona G0/núcleo. */
    NotionAvailability: {
      reason: string | null;
      /** @enum {string} */
      state: "deferred" | "unconfigured" | "enabled";
    };
    /** @description Solo éxito auténtico al activar extensión. Dedupe por video/base; existing remite al snapshot original, sin sobrescritura silenciosa; revisión de origen conservada y guardado no aprueba. */
    NotionExport: {
      analysis_id: string;
      analysis_version: number;
      /** @constant */
      destination_editorial_state: "pending_review";
      export_id: string;
      /** Format: date-time */
      exported_at: string;
      /** Format: uri */
      record_url: string;
      source_review_revision: number;
      /** @enum {string} */
      state: "created" | "already_exists";
      video_id: components["schemas"]["VideoId"];
    };
    NotionExportRequest: {
      expected_analysis_version: number;
      expected_review_revision: number;
    };
    NotionExportResponse: {
      data: components["schemas"]["NotionExport"];
      meta: components["schemas"]["Meta"];
    };
    /** @description complete requiere evidencia AV de esa dimensión; insuficiente/fallo no se completa desde título. Dimensiones no observadas se mantienen visibles. */
    ObservationDimension: {
      description: string | null;
      /** @enum {string} */
      dimension:
        | "format"
        | "verbal_hook"
        | "visual_hook"
        | "audio_hook"
        | "structure"
        | "problem";
      evidence_ids: string[];
      stage: components["schemas"]["Stage"];
    } & unknown;
    /** @description Solo una unidad acotada dentro de la solicitud; running describe otro claim activo, no promesa de worker tras responder. Identidad de dominio run+stage+item+input_version y claim/reserva por cada llamada dentro del lote. uncertain conserva reserva; ninguna ruta de reintento automático. Un resultado incierto exige conciliación manual y no permite un nuevo consumo mediante replay normal. Los subpasos de cada pregunta/prompt tienen identidad estable propia, independiente de IDs de solicitud/operación y claves de entrega. */
    Operation: {
      analysis_id: string | null;
      analysis_version: number | null;
      budget: components["schemas"]["Budget"];
      input_version: string;
      item_id: string | null;
      last_checkpoint: components["schemas"]["Checkpoint"] | null;
      operation_id: string;
      reason: string | null;
      /** Format: date-time */
      requested_at: string;
      /** @enum {string} */
      retry_policy:
        | "none"
        | "same_request_after_status_read"
        | "manual_reconciliation_required";
      run_id: string;
      run_revision: number;
      stage: string;
      /** @enum {string} */
      state: "running" | "succeeded" | "failed" | "blocked" | "uncertain";
      /** Format: date-time */
      updated_at: string;
    } & unknown;
    /** @description Referencia a una operación persistida consultable mediante GET de la operación dentro de run_id. La identidad no depende de una respuesta POST recibida ni de memoria local. state/updated_at reflejan la lectura actual. No autoriza reintento, avance o liberación de reserva; consultar el detalle y su retry_policy. */
    OperationReference: {
      analysis_id: string | null;
      operation_id: string;
      run_id: string;
      stage: string;
      /** @enum {string} */
      state: "running" | "blocked" | "uncertain" | "failed";
      /** Format: date-time */
      updated_at: string;
    };
    OperationResponse: {
      data: components["schemas"]["Operation"];
      meta: components["schemas"]["Meta"];
    };
    /** @description Cobertura incompleta o criterios no comparables. Sin delta/%/novedad del corpus completo, incluso con dos números observados. */
    PartialSignal: {
      delta: null;
      /** @constant */
      direction: "not_evaluable";
      groups_id: string;
      groups_version: number;
      /**
       * @description discriminator enum property added by openapi-typescript
       * @enum {string}
       */
      kind: "comparison_pending";
      percentage_change: null;
      percentage_reason: string;
      previous: components["schemas"]["Count"];
      recent: components["schemas"]["Count"];
      topic_id: string;
    };
    PillarAssessment:
      | components["schemas"]["PillarDecision"]
      | components["schemas"]["UnavailableAssessment"];
    /** @description Decisión tipada auténtica de JEV; explicación atribuida a resumen de evidencia o síntesis Gemini, sin edición manual de clasificación. Una decisión insuficiente es distinta de fallo del proveedor. Las referencias deben existir y pertenecer al material evaluado. other_relevant exige describir el aporte respaldado fuera de los cuatro pilares. */
    PillarDecision: {
      /** @enum {string} */
      decision:
        | "ai_roi_costs"
        | "ai_sales_automation"
        | "ai_operational_efficiency"
        | "ai_applied_leadership"
        | "other_relevant"
        | "insufficient_information";
      evidence_ids: string[];
      explanation: string;
      /** @enum {string} */
      explanation_source: "evidence_summary" | "gemini_synthesis";
      /** @constant */
      state: "decided";
      trace: components["schemas"]["JevTrace"];
    } & (unknown & {
      /**
       * @description discriminator enum property added by openapi-typescript
       * @enum {string}
       */
      state: "decided";
    });
    /** @description total_count=observed_count=longitud IDs distintos; aportes suman ese total. Solo cobertura suficiente de la ventana. */
    PositiveCount: {
      by_source: components["schemas"]["ChannelContribution"][];
      observed_count: number;
      reason: null;
      /** @constant */
      state: "known";
      total_count: number;
      video_ids: components["schemas"]["VideoId"][];
    };
    Probability: {
      label: string;
      probability: number;
    };
    /** @description eligible = público + duración <=180 + fecha en ventanas + IA relevante. Seleccionable aunque tema/comparación pendientes. Evidencias referenciadas por clasificación se incluyen. No subtítulos o métricas privadas supuestos. La etapa interna técnica BE y CoverageCell.eligibility no requieren previamente IA relevante: Publication.eligibility es la elegibilidad final. JEV insuficiente o sin decisión mantiene pending. Una fecha desconocida conserva la limitación en las ventanas posibles, sin omitir el ID. */
    Publication: {
      ai_relevance: components["schemas"]["AiAssessment"];
      capture_id: string;
      /** Format: date-time */
      captured_at: string;
      description: string | null;
      duration: components["schemas"]["Duration"];
      /** @enum {string} */
      eligibility: "eligible" | "excluded" | "pending";
      eligibility_reason: string;
      evidence: components["schemas"]["Evidence"][];
      main_topic_id: string | null;
      /** @enum {string} */
      public_state: "confirmed_public" | "unknown" | "unavailable";
      published_at: string | null;
      run_id: string;
      secondary_topic_ids: string[];
      short_evidence: string | null;
      /** @enum {string} */
      short_status: "candidate_short" | "confirmed_short" | "undetermined";
      source_id: string;
      statistics: {
        comments: components["schemas"]["Metric"];
        likes: components["schemas"]["Metric"];
        views: components["schemas"]["Metric"];
      };
      title: string | null;
      /** Format: uri */
      url: string;
      video_id: components["schemas"]["VideoId"];
      window: ("previous" | "recent") | null;
    } & (unknown & unknown);
    PublicationResponse: {
      data: components["schemas"]["Publication"];
      meta: components["schemas"]["Meta"];
    };
    /** @description Cursor opaco, orden estable; next_cursor=null significa fin. Para listado por ejecución, cursor fija snapshot_revision; si cambia, 409 y reiniciar listado sin mezclar páginas. No truncar silenciosamente. */
    PublicationsResponse: {
      items: components["schemas"]["Publication"][];
      meta: components["schemas"]["Meta"];
      next_cursor: string | null;
      snapshot_revision: number | null;
    };
    ResourceId: string;
    /** @description Reemplazo atómico de revisión para versión actual exacta. Incluye una entrada por evidencia conocida; rechaza extras/duplicados/omisiones. Requiere motivo; no edita clasificación. */
    ReviewRequest: {
      /** @enum {string} */
      decision: "pending_review" | "consider_for_adaptation" | "discarded";
      evidence_reviews: components["schemas"]["EvidenceReview"][];
      expected_analysis_version: number;
      expected_review_revision: number;
      reason: string;
    };
    ReviewResponse: {
      data: components["schemas"]["EditorialReview"];
      meta: components["schemas"]["Meta"];
    };
    /** @description revision cambia al persistir avance/confirmación/selección. workflow complete no acredita comparación completa ni aprobación. started_at siempre fecha original; recuperar no crea ejecución nueva. */
    Run: {
      allowed_actions: (
        | "advance_corpus"
        | "confirm_groups"
        | "advance_comparison"
        | "select_analysis"
      )[];
      budget: components["schemas"]["Budget"];
      corpus: components["schemas"]["CorpusSource"][];
      /** @enum {string} */
      current_stage:
        | "acquisition"
        | "ia_relevance"
        | "grouping"
        | "awaiting_confirmation"
        | "comparison"
        | "idle";
      last_checkpoint: components["schemas"]["Checkpoint"] | null;
      /** @description Todas las operaciones activas o con incidencia pendiente de esta ejecución, incluidas las de piezas seleccionadas. Incluye running/uncertain y failed/blocked sin resolver, aun sin checkpoint. Pares run_id/operation_id únicos, orden updated_at descendente e ID como desempate. [] solo si no hay tales operaciones. GET no las reconoce, resuelve ni elimina: cambian por transición persistida de BE. No sustituye el historial duradero ni la consulta de cada operación. */
      operations_to_inspect: components["schemas"]["OperationReference"][];
      revision: number;
      run_id: string;
      /** Format: date-time */
      started_at: string;
      /** Format: date-time */
      updated_at: string;
      versions: components["schemas"]["Versions"];
      windows: components["schemas"]["Windows"];
      workflow: components["schemas"]["Stage"];
    };
    RunResponse: {
      data: components["schemas"]["Run"];
      meta: components["schemas"]["Meta"];
    };
    /** @description Cursor opaco, orden estable; next_cursor=null significa fin. Para listado por ejecución, cursor fija snapshot_revision; si cambia, 409 y reiniciar listado sin mezclar páginas. No truncar silenciosamente. */
    RunsResponse: {
      items: components["schemas"]["Run"][];
      meta: components["schemas"]["Meta"];
      next_cursor: string | null;
      snapshot_revision: number | null;
    };
    /** @description Persiste selección y análisis inicial pendiente; NO llama proveedor. Selección explícita habilita advance_analysis. Repetir mismo video/run reutiliza análisis válido, no reprocesa. */
    SelectAnalysisRequest: {
      expected_run_revision: number;
      video_id: components["schemas"]["VideoId"];
    };
    /** @description Estado del contexto de señal persistido en esta versión de análisis: available exige señal, tema y revisión; puede ser una señal parcial expresamente limitada. pending/unassigned no contienen cálculo; unassigned tampoco tema. Relaciones de IDs/versiones se validan entre entidades. */
    SignalReference: {
      comparison_revision: number | null;
      signal: components["schemas"]["TopicSignal"] | null;
      /** @enum {string} */
      state: "available" | "pending" | "unassigned";
      topic_id: string | null;
    } & (unknown & unknown & unknown);
    /** @description Estado de UNA etapa. insufficient requiere material insuficiente; failed es error técnico. No es cobertura ni decisión editorial. reason obligatorio y no nulo salvo complete/running/not_requested. */
    Stage: {
      reason: string | null;
      /** @enum {string} */
      state:
        | "not_requested"
        | "pending"
        | "running"
        | "complete"
        | "insufficient"
        | "failed"
        | "blocked"
        | "uncertain"
        | "not_applicable";
    } & unknown;
    /** @description Recurso propuesto; no afirma que esté observado o disponible para el equipo. */
    Suggestion: {
      based_on_evidence_ids: string[];
      text: string;
    };
    SupportedStatement: {
      evidence_ids: string[];
      text: string;
    };
    TextEvidence: {
      /** Format: date-time */
      captured_at: string;
      /** @enum {string} */
      dimension:
        | "metadata"
        | "ia_relevance"
        | "main_topic"
        | "value"
        | "persona"
        | "company_context"
        | "pillar";
      evidence_id: string;
      excerpt: string;
      /** @enum {string} */
      field: "title" | "description" | "available_text";
      /**
       * @description discriminator enum property added by openapi-typescript
       * @enum {string}
       */
      kind: "text";
      /** Format: uri */
      source_url: string;
      video_id: components["schemas"]["VideoId"];
    };
    Topic: {
      description: string;
      equivalence_evidence_ids: string[];
      name: string;
      topic_id: string;
      variants: string[];
    };
    TopicSignal:
      | components["schemas"]["ComparableSignal"]
      | components["schemas"]["NewInCorpusSignal"]
      | components["schemas"]["EmptySignal"]
      | components["schemas"]["PartialSignal"];
    /** @description Fallo técnico conserva decision=null. No convertirlo en no pertinente, utilidad no sustentada o información insuficiente como si JEV hubiera respondido. trace conserva los metadatos parciales conocidos del intento, incluso si falló antes del envío; null solo cuando no hay traza recuperable. Una respuesta inválida no se representa como decisión auténtica; decision sigue null. No se pierden entradas o versiones conocidas por faltar modelo, ID o respuesta. */
    UnavailableAssessment: {
      decision: null;
      evidence_ids: string[];
      reason: string;
      /**
       * @description discriminator enum property added by openapi-typescript
       * @enum {string}
       */
      state:
        | "not_requested"
        | "pending"
        | "insufficient"
        | "failed"
        | "blocked"
        | "uncertain";
      trace: components["schemas"]["JevAttemptTrace"] | null;
    };
    /** @description observed_count describe IDs recuperados; no es total del corpus. Incluso observed_count=0 no acredita ausencia. */
    UnknownCount: {
      by_source: components["schemas"]["ChannelContribution"][];
      observed_count: number;
      reason: string;
      /**
       * @description discriminator enum property added by openapi-typescript
       * @enum {string}
       */
      state: "unknown";
      total_count: null;
      video_ids: components["schemas"]["VideoId"][];
    };
    UnknownDuration: {
      reason: string;
      seconds: null;
      /**
       * @description discriminator enum property added by openapi-typescript
       * @enum {string}
       */
      state: "unknown";
    };
    UnknownMetric: {
      reason: string;
      /**
       * @description discriminator enum property added by openapi-typescript
       * @enum {string}
       */
      state: "unknown";
      value: null;
    };
    ValueAssessment:
      | components["schemas"]["ValueDecision"]
      | components["schemas"]["UnavailableAssessment"];
    /** @description Decisión tipada auténtica de JEV; explicación atribuida a resumen de evidencia o síntesis Gemini, sin edición manual de clasificación. Una decisión insuficiente es distinta de fallo del proveedor. Las referencias deben existir y pertenecer al material evaluado. */
    ValueDecision: {
      /** @enum {string} */
      decision:
        | "supported_contribution"
        | "unsupported_utility"
        | "insufficient_information";
      evidence_ids: string[];
      explanation: string;
      /** @enum {string} */
      explanation_source: "evidence_summary" | "gemini_synthesis";
      /** @constant */
      state: "decided";
      trace: components["schemas"]["JevTrace"];
    } & (unknown & {
      /**
       * @description discriminator enum property added by openapi-typescript
       * @enum {string}
       */
      state: "decided";
    });
    /** @description Versiones de reglas/criterios usadas, no números inventados de modelos disponibles. */
    Versions: {
      classification_version: string;
      criteria_version: string;
      rules_version: string;
    };
    VideoId: string;
    Window: {
      /** @constant */
      days: 7;
      /** Format: date-time */
      end_exclusive: string;
      /** Format: date-time */
      start_inclusive: string;
    };
    /** @description Calculadas UNA vez por ALG desde started_at; fecha pública del video, inicio inclusivo, fin exclusivo; excluyen día actual. */
    Windows: {
      previous: components["schemas"]["Window"];
      recent: components["schemas"]["Window"];
      /** @constant */
      timezone: "America/Bogota";
    };
    /** @description total_count=observed_count=longitud IDs distintos; aportes suman ese total. Solo cobertura suficiente de la ventana. */
    ZeroCount: {
      by_source: components["schemas"]["ChannelContribution"][];
      /** @constant */
      observed_count: 0;
      reason: null;
      /** @constant */
      state: "known";
      /** @constant */
      total_count: 0;
      video_ids: components["schemas"]["VideoId"][];
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
  getCapabilities: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Resultado persistido o lectura sin efectos secundarios. */
      200: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["CapabilitiesResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      401: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "WWW-Authenticate"?: 'Basic realm="SENIALON", charset="UTF-8"';
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      403: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      404: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      409: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      422: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      500: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
    };
  };
  listRuns: {
    parameters: {
      query?: {
        /** @description Cursor opaco emitido por servidor; no fabricar ni mezclar snapshots. */
        cursor?: string;
        /** @description Tamaño máximo de página; next_cursor marca lo pendiente. */
        limit?: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Resultado persistido o lectura sin efectos secundarios. */
      200: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["RunsResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      401: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "WWW-Authenticate"?: 'Basic realm="SENIALON", charset="UTF-8"';
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      403: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      404: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      409: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      422: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      500: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
    };
  };
  createRun: {
    parameters: {
      query?: never;
      header: {
        /** @description Clave estable para el intento lógico; no cambiar al reintentar misma solicitud. */
        "Idempotency-Key": string;
        /** @description Origen permitido configurado. Next valida el original; al binding solo envía el origen autorizado. Ausente/no permitido: 403. */
        Origin: string;
      };
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["CreateRunRequest"];
      };
    };
    responses: {
      /** @description Resultado persistido o lectura sin efectos secundarios. */
      201: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          /** @description true si se devolvió la misma respuesta guardada para clave/cuerpo idénticos. */
          "Idempotency-Replayed"?: boolean;
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["RunResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      401: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "WWW-Authenticate"?: 'Basic realm="SENIALON", charset="UTF-8"';
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      403: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      404: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      409: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      422: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      500: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
    };
  };
  getRun: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        run_id: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Resultado persistido o lectura sin efectos secundarios. */
      200: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["RunResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      401: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "WWW-Authenticate"?: 'Basic realm="SENIALON", charset="UTF-8"';
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      403: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      404: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      409: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      422: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      500: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
    };
  };
  advanceRun: {
    parameters: {
      query?: never;
      header: {
        /** @description Clave estable para el intento lógico; no cambiar al reintentar misma solicitud. */
        "Idempotency-Key": string;
        /** @description Origen permitido configurado. Next valida el original; al binding solo envía el origen autorizado. Ausente/no permitido: 403. */
        Origin: string;
      };
      path: {
        run_id: string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["AdvanceRequest"];
      };
    };
    responses: {
      /** @description Resultado persistido o lectura sin efectos secundarios. */
      200: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          /** @description true si se devolvió la misma respuesta guardada para clave/cuerpo idénticos. */
          "Idempotency-Replayed"?: boolean;
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["OperationResponse"];
        };
      };
      /** @description Otro intento mantiene claim activo; solo consultar estado. No acredita un worker después de responder. */
      202: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["OperationResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      401: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "WWW-Authenticate"?: 'Basic realm="SENIALON", charset="UTF-8"';
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      403: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      404: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      409: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      422: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      500: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
    };
  };
  listAnalyses: {
    parameters: {
      query?: {
        /** @description Cursor opaco emitido por servidor; no fabricar ni mezclar snapshots. */
        cursor?: string;
        /** @description Tamaño máximo de página; next_cursor marca lo pendiente. */
        limit?: number;
      };
      header?: never;
      path: {
        run_id: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Resultado persistido o lectura sin efectos secundarios. */
      200: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["AnalysesResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      401: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "WWW-Authenticate"?: 'Basic realm="SENIALON", charset="UTF-8"';
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      403: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      404: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      409: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      422: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      500: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
    };
  };
  selectAnalysis: {
    parameters: {
      query?: never;
      header: {
        /** @description Clave estable para el intento lógico; no cambiar al reintentar misma solicitud. */
        "Idempotency-Key": string;
        /** @description Origen permitido configurado. Next valida el original; al binding solo envía el origen autorizado. Ausente/no permitido: 403. */
        Origin: string;
      };
      path: {
        run_id: string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SelectAnalysisRequest"];
      };
    };
    responses: {
      /** @description Ya existe selección/análisis para ese video y ejecución; reutilizar sin consumo. */
      200: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["AnalysisResponse"];
        };
      };
      /** @description Resultado persistido o lectura sin efectos secundarios. */
      201: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          /** @description true si se devolvió la misma respuesta guardada para clave/cuerpo idénticos. */
          "Idempotency-Replayed"?: boolean;
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["AnalysisResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      401: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "WWW-Authenticate"?: 'Basic realm="SENIALON", charset="UTF-8"';
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      403: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      404: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      409: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      422: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      500: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
    };
  };
  getAnalysis: {
    parameters: {
      query?: {
        /** @description Versión histórica exacta; sin parámetro devuelve última. No modifica estado. */
        analysis_version?: number;
      };
      header?: never;
      path: {
        analysis_id: string;
        run_id: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Resultado persistido o lectura sin efectos secundarios. */
      200: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["AnalysisResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      401: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "WWW-Authenticate"?: 'Basic realm="SENIALON", charset="UTF-8"';
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      403: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      404: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      409: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      422: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      500: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
    };
  };
  exportNotion: {
    parameters: {
      query?: never;
      header: {
        /** @description Clave estable para el intento lógico; no cambiar al reintentar misma solicitud. */
        "Idempotency-Key": string;
        /** @description Origen permitido configurado. Next valida el original; al binding solo envía el origen autorizado. Ausente/no permitido: 403. */
        Origin: string;
      };
      path: {
        analysis_id: string;
        run_id: string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["NotionExportRequest"];
      };
    };
    responses: {
      /** @description Registro existente por video/base; conservar snapshot y enlace reales, sin sobrescribir. */
      200: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["NotionExportResponse"];
        };
      };
      /** @description Resultado persistido o lectura sin efectos secundarios. */
      201: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          /** @description true si se devolvió la misma respuesta guardada para clave/cuerpo idénticos. */
          "Idempotency-Replayed"?: boolean;
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["NotionExportResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      401: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "WWW-Authenticate"?: 'Basic realm="SENIALON", charset="UTF-8"';
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      403: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      404: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      409: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      422: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      500: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Feature diferida/no implementada; no anunciar guardado. */
      501: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Extensión activada pero proveedor sin confirmar resultado; datos locales conservados. */
      503: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
    };
  };
  getReview: {
    parameters: {
      query?: {
        /** @description Versión histórica exacta; sin parámetro devuelve última. No modifica estado. */
        analysis_version?: number;
      };
      header?: never;
      path: {
        analysis_id: string;
        run_id: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Resultado persistido o lectura sin efectos secundarios. */
      200: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ReviewResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      401: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "WWW-Authenticate"?: 'Basic realm="SENIALON", charset="UTF-8"';
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      403: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      404: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      409: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      422: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      500: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
    };
  };
  recordReview: {
    parameters: {
      query?: never;
      header: {
        /** @description Clave estable para el intento lógico; no cambiar al reintentar misma solicitud. */
        "Idempotency-Key": string;
        /** @description Origen permitido configurado. Next valida el original; al binding solo envía el origen autorizado. Ausente/no permitido: 403. */
        Origin: string;
      };
      path: {
        analysis_id: string;
        run_id: string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["ReviewRequest"];
      };
    };
    responses: {
      /** @description Resultado persistido o lectura sin efectos secundarios. */
      200: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          /** @description true si se devolvió la misma respuesta guardada para clave/cuerpo idénticos. */
          "Idempotency-Replayed"?: boolean;
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ReviewResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      401: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "WWW-Authenticate"?: 'Basic realm="SENIALON", charset="UTF-8"';
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      403: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      404: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      409: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      422: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      500: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
    };
  };
  getComparison: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        run_id: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Resultado persistido o lectura sin efectos secundarios. */
      200: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ComparisonResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      401: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "WWW-Authenticate"?: 'Basic realm="SENIALON", charset="UTF-8"';
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      403: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      404: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      409: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      422: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      500: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
    };
  };
  getCoverage: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        run_id: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Resultado persistido o lectura sin efectos secundarios. */
      200: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["CoverageResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      401: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "WWW-Authenticate"?: 'Basic realm="SENIALON", charset="UTF-8"';
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      403: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      404: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      409: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      422: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      500: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
    };
  };
  getGroups: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        run_id: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Resultado persistido o lectura sin efectos secundarios. */
      200: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["GroupsResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      401: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "WWW-Authenticate"?: 'Basic realm="SENIALON", charset="UTF-8"';
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      403: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      404: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      409: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      422: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      500: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
    };
  };
  confirmGroups: {
    parameters: {
      query?: never;
      header: {
        /** @description Clave estable para el intento lógico; no cambiar al reintentar misma solicitud. */
        "Idempotency-Key": string;
        /** @description Origen permitido configurado. Next valida el original; al binding solo envía el origen autorizado. Ausente/no permitido: 403. */
        Origin: string;
      };
      path: {
        run_id: string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["ConfirmGroupsRequest"];
      };
    };
    responses: {
      /** @description Resultado persistido o lectura sin efectos secundarios. */
      200: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          /** @description true si se devolvió la misma respuesta guardada para clave/cuerpo idénticos. */
          "Idempotency-Replayed"?: boolean;
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["GroupsResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      401: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "WWW-Authenticate"?: 'Basic realm="SENIALON", charset="UTF-8"';
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      403: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      404: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      409: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      422: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      500: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
    };
  };
  getOperation: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        operation_id: string;
        run_id: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Resultado persistido o lectura sin efectos secundarios. */
      200: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["OperationResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      401: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "WWW-Authenticate"?: 'Basic realm="SENIALON", charset="UTF-8"';
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      403: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      404: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      409: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      422: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      500: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
    };
  };
  listEligibleVideos: {
    parameters: {
      query?: {
        /** @description Cursor opaco emitido por servidor; no fabricar ni mezclar snapshots. */
        cursor?: string;
        /** @description Tamaño máximo de página; next_cursor marca lo pendiente. */
        limit?: number;
      };
      header?: never;
      path: {
        run_id: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Resultado persistido o lectura sin efectos secundarios. */
      200: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["PublicationsResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      401: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "WWW-Authenticate"?: 'Basic realm="SENIALON", charset="UTF-8"';
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      403: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      404: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      409: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      422: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      500: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
    };
  };
  getVideo: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        run_id: string;
        video_id: components["schemas"]["VideoId"];
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Resultado persistido o lectura sin efectos secundarios. */
      200: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["PublicationResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      401: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "WWW-Authenticate"?: 'Basic realm="SENIALON", charset="UTF-8"';
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      403: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      404: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      409: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      422: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
      /** @description Error de acceso, estado o validación; conserva resultados. */
      500: {
        headers: {
          /** @description En TODAS las respuestas, incluidos errores y BFF. */
          "Cache-Control"?: "private, no-store";
          "X-Contract-Version"?: "1.0.0";
          /** @description ID de la solicitud HTTP actual; coincide con meta.request_id. Se propaga entre Next y Python, también al recuperar un resultado idempotente. No es un ID de ejecución, operación o proveedor. */
          "X-Request-Id"?: string;
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
    };
  };
}
