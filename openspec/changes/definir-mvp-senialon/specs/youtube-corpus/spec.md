# Spec Delta

## Purpose

Obtener automáticamente publicaciones públicas del corpus acordado y declarar qué material puede sustentar las comparaciones, conservando procedencia, elegibilidad y límites de cobertura.

## ADDED Requirements

### Requirement: Corpus fijo trazable
El sistema SHALL utilizar las 11 URLs del escenario Corpus acordado y conservar URL original, identificador resuelto y resultado de acceso de cada canal. Una ejecución no SHALL ampliar o sustituir silenciosamente el corpus.

#### Scenario: Corpus acordado
- **WHEN** se prepara una ejecución del MVP
- **THEN** utiliza exactamente este conjunto de URLs como corpus previsto:

1. https://www.youtube.com/@30X_by_Andres_Bilbao
2. https://www.youtube.com/@30XDevs
3. https://www.youtube.com/@Platzi
4. https://www.youtube.com/@EloisaWolf
5. https://www.youtube.com/@manuelavillegas
6. https://www.youtube.com/@Gartnervideo
7. https://www.youtube.com/@AdrianSaenz
8. https://www.youtube.com/@EDteam
9. https://www.youtube.com/@KimiMoonshot
10. https://www.youtube.com/user/TheRANDCorporation
11. https://www.youtube.com/channel/UChugFTK0KyrES9terTid8vA

#### Scenario: Canal no resuelto
- **WHEN** una URL no puede resolverse o consultarse
- **THEN** el sistema identifica ese canal y su fallo sin reemplazarlo por otro ni declarar cobertura total.

### Requirement: Adquisición automática por ejecución
El sistema SHALL recolectar automáticamente las publicaciones de las dos ventanas acordadas al ejecutar el análisis. La carga manual de datos por video o de un archivo de tendencias no SHALL sustituir esa adquisición.

#### Scenario: Ejecución con acceso válido
- **WHEN** el operador inicia el análisis con los accesos requeridos disponibles
- **THEN** el sistema obtiene publicaciones de las ventanas para los canales consultables y conserva fecha de captura y estado de ejecución.

#### Scenario: Acceso o cuota insuficiente
- **WHEN** el proveedor impide completar una consulta
- **THEN** el sistema registra el error y el alcance incompleto sin presentar datos de ejemplo como publicaciones recolectadas.

### Requirement: Condición pública y duración elegible
El sistema SHALL admitir para clasificación IA solo videos públicos de hasta 180 segundos inclusive. Si no puede comprobar condición pública, duración o fecha necesaria, SHALL marcar elegibilidad pendiente sin asumir que cumple.

#### Scenario: Límite de duración
- **WHEN** dos videos públicos duran respectivamente 180 y 181 segundos
- **THEN** el primero pasa el filtro de duración y el segundo queda excluido por duración.

#### Scenario: Dato necesario ausente
- **WHEN** no se obtiene la duración de un video
- **THEN** su elegibilidad queda pendiente y su ausencia no se transforma en una duración de cero.

### Requirement: Distinción de Shorts y candidatos cortos
El sistema SHALL mostrar «candidato corto» para un video de duración elegible si no dispone de evidencia verificable para confirmarlo como Short. SHALL conservar el criterio y origen de una confirmación de Short.

#### Scenario: Solo duración disponible
- **WHEN** un video dura menos de tres minutos pero no existe otra evidencia verificable de su condición de Short
- **THEN** se muestra como candidato corto y no como Short confirmado.

### Requirement: Procedencia y estadísticas originales
El sistema SHALL conservar ID y URL del video, canal, título, descripción disponible, fecha de publicación, duración, estadísticas disponibles y fecha de captura. SHALL distinguir campos ausentes de valores cero y no presumir acceso a métricas privadas o históricas.

#### Scenario: Comentarios no disponibles
- **WHEN** se obtiene un video sin conteo de comentarios
- **THEN** ese campo figura como no disponible sin convertirse en cero ni en una medida de profundidad de comentarios.

### Requirement: Identidad y deduplicación de publicaciones
El sistema SHALL reconocer cada publicación por su ID de YouTube y evitar duplicarla dentro de una ejecución y de cada grupo de conteo. Un reintento de adquisición no SHALL incrementar artificialmente publicaciones.

#### Scenario: Misma publicación en dos respuestas
- **WHEN** dos páginas o reintentos devuelven el mismo ID
- **THEN** existe una sola publicación para ese ID en el corpus de la ejecución.

### Requirement: Cobertura visible y acotada
El sistema SHALL informar canales previstos y consultados, ventanas, etapas completadas y fallos. SHALL distinguir cero observado de adquisición, elegibilidad, pertinencia IA o tema principal incompletos. La cobertura temática no SHALL depender del análisis profundo, formato, valor o afinidad de todas las piezas.

#### Scenario: Canal vacío frente a canal fallido
- **WHEN** un canal se consulta completamente sin publicaciones elegibles y otro no pudo consultarse
- **THEN** el primero puede informar cero observado y el segundo informa desconocido; la ejecución señala cobertura parcial.

#### Scenario: Material histórico no recuperable
- **WHEN** se presenta la cobertura de las ventanas
- **THEN** se declara que no constituye un archivo histórico de publicaciones eliminadas o privatizadas.

### Requirement: Acceso conforme al alcance público
La adquisición SHALL respetar las restricciones del reto: contenido público, sin datos personales ni contenido detrás de login de terceros. Un acceso no disponible SHALL producir una limitación visible en lugar de presuponer credenciales o un método permitido.

#### Scenario: Publicación inaccesible
- **WHEN** una publicación no puede obtenerse por la ruta pública permitida
- **THEN** se registra la limitación sin exigir al operador credenciales del creador ni generar su contenido supuesto.

### Requirement: Demo parcial con comparación completa pendiente
El sistema SHALL permitir demostrar el recorrido con publicaciones y decisiones reales disponibles cuando falle parte del corpus. SHALL mantener los 11 canales previstos y distinguir aceptación de la demo parcial de cumplimiento de la comparación completa, que permanece pendiente.

#### Scenario: Parte de los canales no consultable
- **WHEN** una ejecución obtiene datos de parte del corpus y otras fuentes fallan
- **THEN** permite revisar el material disponible, muestra qué faltó y no sustituye el corpus por los canales accesibles ni declara completada la comparación de los 11.

#### Scenario: Análisis profundo no solicitado
- **WHEN** una publicación tiene adquisición, elegibilidad y tema principal resueltos pero no fue elegida para análisis profundo
- **THEN** su falta de evaluación audiovisual profunda no convierte en desconocido el conteo temático ya sustentado.
