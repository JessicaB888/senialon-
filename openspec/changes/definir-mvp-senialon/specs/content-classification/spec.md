# Spec Delta

## Purpose

Determinar pertinencia de IA y organizar publicaciones en grupos temáticos trazables, propuestos desde ambas ventanas y confirmados antes de comparar, contando cada video solamente en su tema principal.

## ADDED Requirements

### Requirement: Pertinencia de IA previa al conteo
El sistema SHALL incluir solo publicaciones donde la IA sea el tema principal o se explique una aplicación concreta. SHALL usar una decisión tipada real de JEV sobre el material disponible y conservar respuesta, evidencia, modelo y criterios, distinguiendo pertinencia, no pertinencia e información insuficiente.

#### Scenario: Mención incidental
- **WHEN** una pieza trata otro asunto y solo menciona ChatGPT sin desarrollar una aplicación de IA
- **THEN** queda fuera de los conteos con el motivo y la evidencia de clasificación.

#### Scenario: Aplicación concreta
- **WHEN** el material respalda una explicación de cómo aplicar IA a una tarea identificable
- **THEN** puede incluirse por esa aplicación sin depender de su popularidad o afinidad editorial.

### Requirement: Incertidumbre sin clasificaciones inventadas
El sistema SHALL conservar información insuficiente cuando no pueda resolver la pertinencia o el tema principal a partir de material disponible. No SHALL completar una clasificación positiva o negativa por falta de evidencia ni simular respuestas de JEV.

#### Scenario: Metadatos ambiguos
- **WHEN** título y descripción no bastan para resolver pertinencia y no hay evidencia adicional suficiente
- **THEN** la pieza queda pendiente de clasificación y se informa su efecto sobre la cobertura temática.

#### Scenario: Fallo de JEV
- **WHEN** JEV no devuelve una decisión válida por acceso, cuota o procesamiento
- **THEN** se identifica el fallo y no se trata la pieza como no pertinente ni como cero publicaciones.

### Requirement: Propuesta automática usando ambas ventanas
El sistema SHALL proponer automáticamente grupos temáticos usando las publicaciones clasificables de ambas ventanas. SHALL conservar identidad, nombre, descripción, variantes y evidencia de pertenencia de los grupos, indicando material pendiente que limite la propuesta.

#### Scenario: Tema presente solo en la semana reciente
- **WHEN** un concepto respaldado aparece únicamente en la ventana reciente
- **THEN** puede formar parte de la propuesta conjunta sin exigir que ya existiera en la anterior.

### Requirement: Equivalencia semántica respaldada
El sistema SHALL reunir variantes del mismo concepto con evidencia de equivalencia y mantener separados asuntos distintos que solo compartan vocabulario genérico de IA. Un pilar editorial no SHALL sustituir automáticamente un tema.

#### Scenario: Variantes equivalentes
- **WHEN** dos expresiones diferentes describen el mismo concepto según el material
- **THEN** pueden compartir identidad temática con respaldo visible de sus asignaciones.

#### Scenario: Coincidencia literal insuficiente
- **WHEN** dos piezas comparten «agentes» pero desarrollan aplicaciones diferentes sin equivalencia demostrada
- **THEN** no se fusionan únicamente por esa coincidencia.

### Requirement: Confirmación antes de comparar
El sistema SHALL presentar la propuesta de grupos y sus publicaciones al operador y requerir su confirmación antes de calcular la comparación temática. SHALL registrar la confirmación y la versión utilizada; confirmar grupos no SHALL aprobar oportunidades editoriales.

#### Scenario: Grupos sin confirmar
- **WHEN** hay una propuesta automática que el operador todavía no confirmó
- **THEN** se puede inspeccionar la propuesta pero la comparación permanece pendiente.

#### Scenario: Confirmación de propuesta
- **WHEN** el operador confirma los grupos propuestos
- **THEN** queda registrada esa versión para calcular ambas ventanas y las oportunidades siguen pendientes de revisión editorial.

### Requirement: Un tema principal contado por publicación
El sistema SHALL asignar un único tema principal a cada publicación resuelta para el conteo. SHALL mostrar los temas secundarios identificados sin sumar esa publicación en ellos. Cada ID cuenta una vez en su tema principal y ventana.

#### Scenario: Pieza con dos temas
- **WHEN** un video tiene un tema principal y otro secundario respaldados
- **THEN** contribuye una vez al principal y cero al secundario, que sigue visible en su ficha.

#### Scenario: Tema principal no resuelto
- **WHEN** no se puede determinar un tema principal respaldado
- **THEN** su asignación queda pendiente y no se reparten fracciones ni se cuentan varias pertenencias para completar el dato.

### Requirement: Criterios y grupos comunes versionados
El sistema SHALL aplicar la misma versión de criterios y grupos confirmados en ambas ventanas. Cambiar categorías o equivalencias SHALL requerir una nueva versión, reclasificar ambas ventanas y obtener confirmación antes de una nueva comparación.

#### Scenario: Nueva propuesta de agrupación
- **WHEN** una nueva versión reúne dos temas antes separados
- **THEN** no se mezcla esa versión en la semana reciente con los grupos antiguos de la anterior; la comparación previa conserva su contexto.

### Requirement: Afinidad y análisis profundo independientes del conteo
El sistema SHALL conservar publicaciones elegibles en su tema principal aunque tengan baja afinidad o no hayan sido seleccionadas para análisis profundo. El formato, valor y afinidad de las piezas seleccionadas no SHALL producir conteos semanales propios ni bloquear por sí solos los conteos temáticos.

#### Scenario: Pieza sin análisis profundo
- **WHEN** pertinencia y tema principal están resueltos y el operador no selecciona la pieza para análisis profundo
- **THEN** cuenta en su tema principal sin exigir observaciones de formato, valor o afinidad.

#### Scenario: Bajo encaje editorial
- **WHEN** una publicación pertinente de IA tiene baja afinidad con la audiencia
- **THEN** mantiene su contribución temática y la afinidad se muestra aparte.
