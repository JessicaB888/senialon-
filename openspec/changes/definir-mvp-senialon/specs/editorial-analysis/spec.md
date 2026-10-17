# Spec Delta

## Purpose

Convertir contenido efectivamente observado y señales trazables en una evaluación de utilidad y una adaptación revisable, distinguiendo desempeño, hipótesis, afinidad editorial y evidencia de crecimiento de publicaciones.

## ADDED Requirements

### Requirement: Observaciones audiovisuales verificables
El sistema SHALL describir recursos verbales, visuales y auditivos, estructura y problema abordado únicamente a partir del material efectivamente analizado. Cada observación SHALL conservar video, dimensión observada, marca temporal y estado de revisión.

#### Scenario: Gancho audiovisual observado
- **WHEN** se identifica un gancho hablado acompañado de un recurso visual
- **THEN** se registran ambas observaciones con sus marcas temporales para contrastarlas con el original, sin asumir que causaron retención.

### Requirement: Dimensiones no observadas explícitas
El sistema SHALL marcar información insuficiente cuando no tenga acceso o evidencia para una dimensión del contenido. No SHALL inventar audio, montaje, ritmo, transcripciones o formato desde el título o la descripción.

#### Scenario: Falla de análisis audiovisual
- **WHEN** se obtienen metadatos pero falla el procesamiento audiovisual
- **THEN** el análisis audiovisual queda pendiente o en error; la pieza y sus metadatos se conservan sin una explicación audiovisual supuesta.

### Requirement: Desempeño y causalidad separados
El sistema SHALL mostrar estadísticas originales con fecha y base explícita de cualquier comparación de desempeño. SHALL presentar contribuciones posibles del contenido como hipótesis, sin atribuir causalidad, retención, pauta o crecimiento de interacción no observados.

#### Scenario: Sin comparación suficiente
- **WHEN** solo se dispone de una captura de métricas y no de una base de comparación válida
- **THEN** muestra estadísticas y desempeño no evaluable, sin declarar que la pieza tuvo éxito o creció durante la semana.

### Requirement: Valor respaldado para la audiencia
El sistema SHALL identificar problema, aprendizaje o aplicación y su evidencia para líderes y equipos de LatAm. JEV SHALL clasificar el valor como aporte respaldado, utilidad no sustentada o información insuficiente. Popularidad, crecimiento o afinidad por sí solos no SHALL acreditar aporte respaldado.

#### Scenario: Popular pero sin utilidad sustentada
- **WHEN** una pieza tiene muchas vistas y no se identifica aporte respaldado para la audiencia
- **THEN** no se recomienda una adaptación por su popularidad solamente y se conserva el motivo de la evaluación.

#### Scenario: Alcance de la evaluación de valor
- **WHEN** se presenta una utilidad respaldada por el contenido
- **THEN** se distingue ese respaldo de una verificación externa de la exactitud de todas las afirmaciones del video.

### Requirement: Matriz de afinidad en tres dimensiones
El sistema SHALL evaluar separadamente persona, contexto de empresa o aplicación y pilar editorial, usando una rúbrica identificada por versión. Cada dimensión SHALL tener motivo, evidencia y estado de insuficiencia cuando corresponda, sin inferir identidad, cargo o presupuesto de los espectadores.

#### Scenario: Aplicación empresarial observada
- **WHEN** una pieza explica una aplicación de IA en una tarea empresarial
- **THEN** el sistema puede justificar su contexto de aplicación sin afirmar qué empresas o cargos vieron la pieza.

#### Scenario: Contexto insuficiente
- **WHEN** falta material que sustente una dimensión de afinidad
- **THEN** esa dimensión queda insuficiente, sin puntuación positiva ni categoría empresarial por defecto.

### Requirement: Afinidad sin exclusiones no acordadas
La evaluación editorial SHALL respetar la audiencia acordada sin adoptar rechazos automáticos de estudiantes, perfiles junior, B2C o comercios locales de la investigación. No SHALL alterar elegibilidad IA ni conteos por afinidad baja o pendiente.

#### Scenario: Bajo encaje sin exclusión temática
- **WHEN** una pieza es pertinente para IA pero tiene baja afinidad editorial
- **THEN** su conteo temático se conserva y la afinidad permanece como evaluación separada.

### Requirement: Decisiones auténticas y trazables con JEV
El sistema SHALL usar JEV obligatoriamente para valor y afinidad por persona, contexto empresarial y pilar de las piezas seleccionadas, conservando entrada, respuesta, modelo, criterios y errores. JEV no SHALL calcular fechas o conteos ni su confianza representar probabilidad de viralidad.

#### Scenario: JEV no disponible
- **WHEN** una decisión no puede ejecutarse por falta de acceso o fallo del servicio
- **THEN** se registra como pendiente o error, sin sustituirla por una decisión simulada o por conocimiento general sobre tendencias.

#### Scenario: Hipótesis explicativa
- **WHEN** se sintetiza una explicación usando resultados de JEV
- **THEN** la explicación conserva las decisiones y evidencias de origen y no presenta a JEV como generador de hechos o prueba causal.

### Requirement: Relación explícita con la señal
El sistema SHALL enlazar una pieza con el grupo temporal correspondiente cuando exista respaldo de esa relación. SHALL mostrar la señal, sus ventanas y límites por separado de valor y afinidad, conservando oportunidades útiles sin crecimiento comprobado.

#### Scenario: Oportunidad útil sin aumento
- **WHEN** una pieza tiene utilidad respaldada y su tema no muestra crecimiento evaluable
- **THEN** puede conservarse como oportunidad editorial sin señal temporal verificada, sin forzar una tendencia.

#### Scenario: Aumento sin valor respaldado
- **WHEN** aumenta un tema pero la pieza no tiene utilidad respaldada para la audiencia
- **THEN** se muestra el aumento y la evaluación de valor por separado, sin recomendar la adaptación por ese aumento solamente.

### Requirement: Adaptación propuesta sin hechos inventados
La oportunidad SHALL incluir ángulo, valor esperado, gancho propuesto, estructura y CTA si aplica, distinguiendo recursos verbales, visuales o auditivos sugeridos de los observados. Las afirmaciones fácticas SHALL remitir a evidencia; no se inventarán cifras, experiencia propia, activos comerciales ni urgencias.

#### Scenario: Cifra ilustrativa de la investigación
- **WHEN** se propone un guion a partir de un ejemplo que menciona 80 %, 65 % o una ventana de 72 horas sin fuente
- **THEN** esas cifras o urgencias no se presentan como hechos ni se transfieren a la recomendación.

#### Scenario: Idea nueva en la adaptación
- **WHEN** se propone un recurso visual o un CTA que no aparece en el video original
- **THEN** se identifica como sugerencia y no como evidencia observada ni como un recurso del equipo ya disponible.

### Requirement: Dimensiones sin puntuación compensatoria
La ficha SHALL conservar desempeño, señal temporal, valor y afinidad como dimensiones separadas, con razones para la revisión. No SHALL combinarlas en una puntuación con pesos o umbrales del prototipo que permita compensar falta de valor con popularidad.

#### Scenario: Métricas altas y poca evidencia
- **WHEN** hay alto alcance pero evidencia insuficiente de valor o afinidad
- **THEN** el resultado mantiene esa insuficiencia y no la transforma en prioridad alta mediante una suma ponderada.

### Requirement: Análisis profundo seleccionado por el operador
El sistema SHALL permitir que el operador elija cualquier publicación elegible para análisis audiovisual profundo, valor, afinidad y adaptación, incluso si su tema no tiene crecimiento. Ese análisis no SHALL ejecutarse obligatoriamente sobre todo el corpus para habilitar los conteos temáticos.

#### Scenario: Selección de contenido sin aumento
- **WHEN** el operador elige una pieza elegible cuyo tema no crece o cuya comparación está pendiente
- **THEN** puede analizarla en profundidad y revisar su utilidad sin exigir una señal creciente.

### Requirement: Formato observado en la pieza seleccionada
El sistema SHALL describir el formato de una pieza seleccionada con evidencia del material audiovisual o marcarlo insuficiente. El formato no SHALL inferirse de la longitud del título ni producir conteos semanales de formatos en este MVP.

#### Scenario: Solo título disponible
- **WHEN** no se obtuvo material suficiente para identificar el formato
- **THEN** se marca insuficiente y no se atribuye tutorial, entrevista o etapa comercial por la extensión del título.

### Requirement: Pilares editoriales aprobados
El sistema SHALL clasificar el pilar entre ROI y costos de IA, automatización comercial con IA, eficiencia operativa con IA, liderazgo aplicado a IA, otro pertinente e información insuficiente. SHALL conservar evidencia y motivo; otro pertinente requiere describir el aporte fuera de los cuatro pilares.

#### Scenario: Aporte fuera de los cuatro pilares
- **WHEN** una pieza tiene pertinencia editorial respaldada que no encaja en esos cuatro pilares
- **THEN** puede clasificarse como otro pertinente con su descripción, sin forzar un pilar existente.

#### Scenario: Material insuficiente para el pilar
- **WHEN** la evidencia no permite decidir a qué pilar corresponde la pieza
- **THEN** la salida es información insuficiente y no un pilar positivo por defecto.

### Requirement: Tres resultados de valor diferenciados
El sistema SHALL distinguir aporte respaldado, utilidad no sustentada e información insuficiente. La falta de material no SHALL convertirse en una afirmación de falta de utilidad.

#### Scenario: Material suficiente sin aporte sustentado
- **WHEN** se observa material suficiente pero no respalda una utilidad concreta para la audiencia
- **THEN** el valor se registra como utilidad no sustentada con su motivo.

#### Scenario: Material no disponible
- **WHEN** falta el material necesario para evaluar valor
- **THEN** el valor se registra como información insuficiente en lugar de utilidad no sustentada.
