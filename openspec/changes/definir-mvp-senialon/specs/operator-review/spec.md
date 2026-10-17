# Spec Delta

## Purpose

Ofrecer una aplicación web desplegada y protegida para confirmar grupos, comparar temas y revisar oportunidades, conservando datos y decisiones de forma duradera y mostrando el alcance real de cada ejecución.

## ADDED Requirements

### Requirement: URL desplegada y recorrido reproducible
La aplicación SHALL estar desplegada en una URL que otras personas puedan abrir con la credencial de demo. El repositorio SHALL permitir reproducir el arranque fuera de los sistemas de 30X; una ejecución local no SHALL sustituir la URL de entrega.

#### Scenario: Apertura desde otro equipo
- **WHEN** una persona abre la URL de entrega desde otro equipo
- **THEN** encuentra el acceso protegido y, con la credencial válida, puede usar el recorrido de la demo.

### Requirement: Credencial compartida para toda la aplicación
La aplicación SHALL proteger páginas, resultados y operaciones mediante una credencial de demo compartida. Sin autenticación válida no SHALL permitir consultar datos ni ejecutar análisis, confirmaciones, revisiones o exportaciones; la demo no SHALL requerir cuentas individuales.

#### Scenario: Acceso directo sin credencial
- **WHEN** se intenta abrir una ficha o invocar una operación directamente sin autenticación válida
- **THEN** no se entregan resultados ni se realiza la operación y se solicita acceso válido.

#### Scenario: Acceso válido
- **WHEN** se utiliza la credencial compartida correcta
- **THEN** se puede acceder a todas las funciones disponibles de la demo, sin un modo público de lectura.

### Requirement: Confirmación previa a la comparación
El recorrido SHALL permitir recolectar, inspeccionar cobertura y propuesta automática de grupos, confirmar su versión y después calcular la comparación temática. SHALL registrar confirmación y versión por ejecución; confirmar grupos no SHALL aprobar la adaptación editorial.

#### Scenario: Propuesta sin confirmar
- **WHEN** el operador inspecciona grupos pero no los confirma
- **THEN** la comparación queda pendiente y se conserva la propuesta sin presentarla como confirmada.

### Requirement: Selección de cualquier pieza elegible
El operador SHALL poder seleccionar cualquier publicación elegible para análisis profundo desde el material disponible, incluso sin aumento de su tema o con comparación pendiente. No SHALL existir una selección obligatoria basada solo en vistas o crecimiento.

#### Scenario: Selección sin señal creciente
- **WHEN** el operador elige una pieza elegible cuyo tema no muestra aumento
- **THEN** puede analizar formato, gancho, estructura, valor y adaptación de esa pieza.

### Requirement: Clasificaciones sin edición manual en la demo
La aplicación SHALL permitir confirmar grupos y revisar oportunidades, sin ofrecer edición manual de pertinencia IA, tema principal o asignaciones propuestas. La confirmación no SHALL modificar esas clasificaciones.

#### Scenario: Revisión de asignación
- **WHEN** el operador revisa qué publicaciones pertenecen a un grupo
- **THEN** puede inspeccionar la asignación y confirmar la propuesta, pero no cambiar manualmente la pertinencia o el tema principal.

### Requirement: Capas y dimensiones visibles
La interfaz SHALL distinguir cobertura, clasificación y grupos, señal temática, análisis audiovisual, valor y afinidad, y adaptación y revisión. SHALL mostrar métricas de desempeño, señal temporal, valor y afinidad por separado, con sus fuentes y pendientes.

#### Scenario: Aumento y valor insuficiente
- **WHEN** una ficha tiene señal creciente pero información insuficiente para evaluar valor
- **THEN** ambas condiciones permanecen visibles sin generar una aprobación o prioridad global automática.

### Requirement: Inspección de evidencia y procedencia
El operador SHALL poder consultar publicaciones y canales detrás del conteo, ventanas y zona de corte, criterios y versión de grupos confirmados. Cada observación audiovisual SHALL enlazar el video original y la marca temporal para su contraste.

#### Scenario: Comprobación de hipótesis
- **WHEN** el operador abre la evidencia de una explicación
- **THEN** encuentra video, marca temporal, observación, estado de revisión y una hipótesis diferenciada de los hechos observados.

### Requirement: Errores por etapa sin perder resultados
La aplicación SHALL mostrar proceso, insuficiencia y error por etapa, conservando resultados disponibles. Un fallo técnico no SHALL convertirse en cero publicaciones, descarte editorial o aprobación automática.

#### Scenario: Falla del análisis profundo
- **WHEN** falla el procesamiento audiovisual de una pieza ya recolectada y clasificada
- **THEN** su ficha conserva metadatos, conteo temático conocido y el error audiovisual sin inventar observaciones.

### Requirement: Revisión humana de oportunidades
Cada oportunidad SHALL iniciar pendiente de revisión editorial. El operador SHALL poder registrar decisión y motivo, y estado de revisión de la evidencia. Guardar una ficha o confirmar grupos no SHALL equivaler a aprobar su explicación o adaptación.

#### Scenario: Descartar una adaptación
- **WHEN** el operador descarta una propuesta y registra el motivo
- **THEN** se conserva esa decisión sin borrar publicaciones, evidencias o señal temática de origen.

### Requirement: Persistencia duradera con contexto
La aplicación SHALL conservar ejecuciones, evidencias y decisiones después de cerrar el navegador y reiniciar la aplicación. SHALL recuperar ID, fecha, corpus, ventanas, zona, cobertura, clasificaciones, confirmación de grupos, modelos, criterios y revisión asociados al resultado.

#### Scenario: Cierre del navegador
- **WHEN** se guarda una decisión, se cierra el navegador y se vuelve a entrar con la credencial
- **THEN** la oportunidad y su revisión se recuperan con el mismo contexto.

#### Scenario: Reinicio de aplicación
- **WHEN** se reinicia la aplicación después de guardar resultados
- **THEN** los resultados y decisiones permanecen disponibles sin depender de la memoria de la instancia anterior.

### Requirement: Identificación de ejecuciones previas y parciales
La aplicación SHALL identificar fecha y cobertura de una ejecución previa usada como respaldo y permitir mostrar una demo real parcial con sus incidencias. No SHALL presentar esa ejecución como nueva ni una comparación incompleta como completa.

#### Scenario: Respaldo durante la demo
- **WHEN** se usa una ejecución guardada porque falla una consulta nueva
- **THEN** se identifica como anterior, muestra su cobertura y mantiene pendientes los datos no obtenidos.

### Requirement: Núcleo independiente de Notion
El recorrido esencial SHALL poder completarse con resultados reales disponibles aunque Notion no esté implementado o accesible. Su ausencia SHALL declararse pendiente sin simular una exportación.

#### Scenario: Extensión no desarrollada
- **WHEN** el operador revisa una ficha en una versión sin Notion
- **THEN** puede completar y recuperar su revisión y la interfaz no anuncia un guardado externo operativo.
