# Spec Delta

## Purpose

Mostrar cambios descriptivos en la frecuencia de publicaciones de IA por tema principal dentro del corpus acordado, con evidencia temporal y límites que permitan evaluar posibles tendencias sin afirmar crecimiento de audiencia.

## ADDED Requirements

### Requirement: Dos ventanas completas consecutivas
El sistema SHALL comparar los últimos 7 días completos con los 7 anteriores, usando America/Bogota, UTC−5. SHALL excluir el día en curso, usar la fecha de publicación y mostrar inicio inclusivo y fin exclusivo de cada ventana, sin solapamientos.

#### Scenario: Publicación del día actual
- **WHEN** una publicación pertenece al día en curso en la zona de corte configurada
- **THEN** no integra ninguna de las dos ventanas comparadas.

#### Scenario: Publicación en el límite compartido
- **WHEN** una publicación coincide exactamente con el inicio de la ventana reciente
- **THEN** cuenta en la ventana reciente y no en la anterior.

#### Scenario: Corte diario de Colombia
- **WHEN** se ejecuta un análisis el 17 de octubre de 2026 según America/Bogota
- **THEN** la ventana reciente abarca del 10 de octubre a las 00:00 inclusive al 17 a las 00:00 exclusivo, y la anterior del 3 a las 00:00 inclusive al 10 a las 00:00 exclusivo, en esa misma zona.

### Requirement: Universo y criterios comparables
La comparación SHALL utilizar el mismo corpus de 11 canales, condiciones de elegibilidad y versión de clasificación en ambos periodos. SHALL identificar cualquier falta de cobertura que impida una comparación evaluable.

#### Scenario: Canal consultado solo en una ventana
- **WHEN** se completa un canal en la ventana reciente pero no en la anterior
- **THEN** la cobertura queda parcial y no se presenta el cambio observado como crecimiento comparable del corpus completo.

### Requirement: Conteo de publicaciones por grupo
El sistema SHALL contar cada ID de publicación elegible solo en su tema principal confirmado y ventana, conservando videos y contribución por canal. Temas secundarios, formato, vistas, afinidad y selección para análisis profundo no SHALL incrementar o reducir ese conteo por sí solos.

#### Scenario: Aumento concentrado en un canal
- **WHEN** un tema aumenta porque un solo canal publica más piezas pertinentes
- **THEN** el reporte muestra ese aporte y los videos de respaldo, sin describirlo como expansión entre varios canales.

#### Scenario: Menor afinidad editorial
- **WHEN** una publicación elegible recibe una evaluación editorial de baja afinidad
- **THEN** sigue formando parte del conteo temporal de su grupo.

### Requirement: Diferencia y porcentaje con base positiva
Para una comparación evaluable con conteo anterior A mayor que cero y conteo reciente B, el sistema SHALL mostrar A, B, diferencia B − A y variación 100 × (B − A) / A. SHALL conservar el sentido de aumento, igualdad o descenso sin agregar un umbral de tendencia no acordado.

#### Scenario: Duplicación de publicaciones
- **WHEN** los conteos evaluables de un grupo son A = 2 y B = 4
- **THEN** muestra diferencia +2 y variación +100 %, con los videos que respaldan cada conteo.

#### Scenario: Descenso a cero observado
- **WHEN** los conteos evaluables son A = 2 y B = 0
- **THEN** muestra diferencia −2 y variación −100 %, sin llamarlo una señal creciente.

### Requirement: Base cero sin porcentaje inventado
Si A es cero conocido y B es positivo en una comparación evaluable, el sistema SHALL mostrar «nuevo en el corpus», ambos conteos y diferencia, con porcentaje no aplicable. Si ambos son cero conocidos, SHALL indicar ausencia de publicaciones observadas, sin señal nueva.

#### Scenario: Primera aparición observada
- **WHEN** la base evaluable tiene A = 0 y la ventana reciente tiene B = 3
- **THEN** muestra «nuevo en el corpus», 0, 3 y diferencia +3, sin porcentaje, infinito o división artificial.

#### Scenario: Ambas ventanas sin publicaciones
- **WHEN** A = 0 y B = 0 son resultados conocidos de cobertura suficiente
- **THEN** indica que no se observaron publicaciones en esas ventanas y no declara novedad.

### Requirement: Datos incompletos no equivalen a cero
Cuando fallos de adquisición, elegibilidad, pertinencia IA o tema principal impidan conocer conteos comparables, el sistema SHALL mostrar conteos observados parciales, faltantes y motivo. No SHALL declarar «nuevo en el corpus» ni porcentaje de crecimiento comparable usando una base desconocida.

#### Scenario: Base sin acceso
- **WHEN** hay tres publicaciones recientes observadas pero no se pudo revisar el periodo anterior
- **THEN** informa base desconocida y cobertura parcial, sin transformar el resultado en 0 frente a 3.

#### Scenario: Pertinencia sin resolver
- **WHEN** quedan piezas de relevancia IA o agrupación sin resolver que afectan el conteo
- **THEN** indica la limitación de clasificación y no presenta ese conteo como completo.

### Requirement: Interpretación acotada y sin puntuación global
La señal SHALL describir expansión de publicaciones observadas en el corpus y conservar fechas, cobertura y criterio. No SHALL afirmarse crecimiento de audiencia, viralidad, aceleración, causalidad, saturación, longevidad o tendencia global a partir de esos conteos.

#### Scenario: Señal creciente
- **WHEN** un grupo tiene aumento evaluable y se presenta como posible tendencia
- **THEN** la salida lo limita al corpus y acompaña la afirmación con conteos y periodo; no le asigna fase emergente o consolidada.

#### Scenario: Muchas vistas sin aumento de publicaciones
- **WHEN** un video tiene muchas vistas pero no hay aumento de publicaciones de su grupo
- **THEN** las vistas permanecen como desempeño observado y no sustituyen la señal temporal.

### Requirement: Fuente temporal propia de YouTube
El sistema SHALL obtener automáticamente la señal a partir de publicaciones de YouTube en el corpus. Una noticia, una búsqueda externa o conocimiento general del modelo no SHALL sustituir la comparación temporal requerida.

#### Scenario: Contexto externo sin publicaciones comparables
- **WHEN** existe una noticia sobre un tema pero no se ha podido calcular la comparación de publicaciones
- **THEN** la señal de YouTube sigue pendiente y no se presenta el contexto externo como cumplimiento de esta capacidad.

### Requirement: Confirmación de grupos como requisito de cálculo
El sistema SHALL calcular la comparación temática después de que el operador confirme la propuesta de grupos y versión. La confirmación SHALL aplicarse a ambas ventanas y no SHALL sustituir datos faltantes ni transformar una cobertura parcial en completa.

#### Scenario: Confirmación con fuentes incompletas
- **WHEN** el operador confirma los grupos propuestos a partir del material disponible y faltan canales
- **THEN** se pueden mostrar conteos temáticos observados parciales con sus fuentes, pero la comparación completa de los 11 sigue pendiente.

### Requirement: Aceptación de demo separada de cobertura completa
El sistema SHALL permitir presentar una demo con cobertura parcial explícita, conforme al alcance acordado. No SHALL atribuir a los 11 canales porcentajes, novedad o crecimiento comparable calculados sobre una base incompleta; la comparación completa permanece pendiente.

#### Scenario: Demo real con incidencias
- **WHEN** el recorrido funciona con publicaciones reales de los canales accesibles y otros fallan
- **THEN** la demo identifica los fallos y presenta los resultados parciales sin afirmar cobertura completa ni completar conteos desconocidos con cero.

#### Scenario: Formato pendiente sin impacto temático
- **WHEN** ambas ventanas tienen cobertura temática suficiente pero hay piezas sin formato o sin evaluación de valor
- **THEN** esas dimensiones pendientes no impiden calcular la comparación temática confirmada.
