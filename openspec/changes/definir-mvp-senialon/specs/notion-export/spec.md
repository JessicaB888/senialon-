# Spec Delta

## Purpose

Definir la extensión opcional para registrar oportunidades revisables en una única base de Notion del equipo, conservando evidencia y contexto sin condicionar la aceptación del MVP esencial.

## ADDED Requirements

### Requirement: Extensión opcional de última prioridad
La exportación a Notion SHALL permanecer fuera de los criterios obligatorios de la demo esencial. Solo SHALL abordarse después de validar el núcleo y cubrir evaluación y entrega; su ausencia no SHALL impedir completar la revisión local.

#### Scenario: No hay tiempo para la integración
- **WHEN** el equipo alcanza el cierre sin comprobar el guardado real
- **THEN** Notion queda identificado como pendiente y el recorrido esencial mantiene su aceptación independiente.

### Requirement: Guardado manual en un destino del equipo
Si la extensión está disponible, el sistema SHALL permitir «Guardar oportunidad en Notion» solo por acción del operador hacia una única base preconfigurada del equipo. No SHALL distribuir automáticamente por Gmail, Slack u otros canales ni gestionar cuentas de terceros.

#### Scenario: Selección explícita
- **WHEN** el operador elige guardar una ficha y el destino está disponible
- **THEN** el sistema intenta registrar esa oportunidad en la base configurada sin iniciar otras distribuciones.

#### Scenario: Destino no configurado
- **WHEN** faltan acceso o base de destino
- **THEN** se indica el pendiente y no se simula un registro creado.

### Requirement: Contexto y revisión preservados
El registro SHALL conservar origen, métricas y captura, tema principal y secundarios no contados, señal temática, ventanas, cobertura y grupos confirmados, evidencia y revisión, decisiones JEV y criterios, valor, afinidad, hipótesis y adaptación. SHALL iniciar pendiente de revisión editorial y distinguir guardado de aprobación.

#### Scenario: Guardado de observaciones sin revisar
- **WHEN** se exporta una ficha con observaciones generadas todavía no revisadas
- **THEN** el registro mantiene ese estado y no presenta las observaciones como validadas por el operador.

### Requirement: Confirmación y control de duplicados
El sistema SHALL confirmar un guardado únicamente tras respuesta de éxito y mostrar el enlace real al registro. SHALL controlar duplicados por ID de video en la base de destino; un reintento no SHALL crear un segundo registro silenciosamente.

#### Scenario: Reintento de una oportunidad guardada
- **WHEN** ya existe un registro para el mismo video en la base
- **THEN** se identifica el registro existente y su enlace sin duplicarlo ni perder su contexto por una sobrescritura silenciosa.

### Requirement: Error externo sin pérdida local
Ante un fallo de Notion, el sistema SHALL mostrar el error, conservar la ficha y su revisión local y permitir reconocer que el guardado no se confirmó. El error no SHALL bloquear adquisición, análisis o revisión de otras oportunidades.

#### Scenario: Falla del proveedor
- **WHEN** Notion rechaza o no confirma el guardado
- **THEN** la oportunidad permanece disponible y no aparece como exportación exitosa.

### Requirement: Formato y clasificación coherentes con la ficha
La exportación SHALL conservar las tres salidas de valor y los pilares aprobados de la ficha. El formato exportado SHALL proceder del análisis de esa pieza y no SHALL presentarse como una señal semanal de crecimiento de formatos.

#### Scenario: Guardado con formato observado
- **WHEN** se guarda una pieza cuyo formato tiene evidencia audiovisual
- **THEN** el formato se conserva con su procedencia, separado de los conteos de su tema principal y de los secundarios no contados.
