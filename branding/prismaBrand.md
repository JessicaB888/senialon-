# Guía de Identidad de Marca: GEMA 3
### Personalidad, Código Distintivo y Brand Prism

Este documento establece la definición, sistematización e infraestructura de la identidad de marca de **Corefex** (GEMA 3). Se articulan los pilares inalterables de personalidad, la especificación de activos propietarios visuales y verbales bajo el sistema de diseño "Demerzel", la matriz del Prisma de Marca de Kapferer y la guía práctica de aplicación operativa (*Do's and Don'ts*). Todo el marco está estructurado bajo los principios de la ingeniería de software de alta precisión, la gobernanza de inteligencia artificial agéntica y el rigor metodológico B2B.

---

# 1. Sistema de Personalidad de Marca (Los 3 Pilares Invariantes)

La personalidad de Corefex no deviene de abstracciones publicitarias, sino de la traslación directa de su cultura de ingeniería, su arquitectura operativa y la aplicación estricta de sus metodologías de desarrollo (*Specification-Driven Development* - SDD y *Shape Up*). Corefex surge como respuesta directa a la crisis global de deuda técnica—estimada por la industria en más de **$85,000 millones de dólares anuales**—provocada por la generación descontrolada de código mediante modelos de lenguaje (*vibe coding*). Estudios empíricos del instituto **METR** revelan que el desarrollo con IA no gobernada genera una **desaceleración real del 19%** en la entrega funcional, a pesar de que los equipos mantienen la **ilusión perceptiva de avanzar un 20% más rápido**. Ante este panorama, Corefex se erige como un bastión de disciplina, arquitectura de criterio y gobernanza determinista.

| Rasgo Distintivo | Dicotomía / Opuesto Claro | Manifestación Operativa y Metodológica en Corefex |
| :--- | :--- | :--- |
| **1. Rigurosos, no impulsivos** | Especificación vs. *Vibe Coding* ("Modo Yolo") | Adhesión estricta al principio *Specification-Driven Development* (SDD). Asignación del 70% del esfuerzo a fases de diseño/especificación y 30% a código y pruebas. Cero líneas escritas sin especificación previa validada en `/specs`. |
| **2. Arquitectónicos, no cosméticos** | Sistemas e Infraestructura vs. Parches de Superficie | Priorización de la resiliencia estructural, el andamiaje (*Agent Harness*), las máquinas de estados finitos (FSM) y la ingeniería de criterio por encima de soluciones estocásticas o aceleración superficial de código. |
| **3. Inquebrantables, no complacientes** | Gobernanza e Invariantes vs. Ilusión y Condescendencia | Ejecución no negociable de reglas duras (`Invariants.md`), umbrales de confianza (<85% HIL), límites de latencia (20s) y blindaje jurídico defensivo (MSA Cláusula 4.2). Rechazo absoluto a sacrificar el rigor por entregas frágiles. |

### 1.1. Rigurosos, no impulsivos (Especificación vs. Vibe Coding)
La postura conductual de Corefex rechaza explícitamente el "modo yolo" o *vibe coding* —la práctica de generar código rápido mediante modelos de lenguaje (LLMs) sin contexto ni control arquitectónico, la cual multiplica la deuda técnica y las vulnerabilidades de ciberseguridad. La marca opera bajo el principio no negociable del *Specification-Driven Development* (SDD): **"Sin especificación no hay código"**. Esta conducta analítica y disciplinada exige invertir el ciclo tradicional colocando "primero el sistema y la arquitectura, luego el código". Operativamente, el tiempo del proyecto se distribuye asignando un **70% del esfuerzo a las fases de diseño y especificación**, reservando únicamente el **30% restante para la generación de código y pruebas**. Toda intención de desarrollo debe formalizarse primero en artefactos de especificación versionables dentro del repositorio (`/specs`), asegurando que la IA actúe como un ejecutor acotado y no como un improvisador de reglas de negocio.

### 1.2. Arquitectónicos, no cosméticos (Sistemas e Infraestructura vs. Parches de Superficie)
Corefex concibe el software no como un conjunto de funciones aisladas o parches estéticos, sino como una infraestructura digital crítica y resiliente. La personalidad de la marca refleja el criterio técnico de los "arquitectos de sistemas" frente a la mera programación de funciones. Su manifestación técnica se fundamenta en la construcción del *Agent Harness* (Andamiaje) y el modelado de Máquinas de Estados Finitos (FSM). En lugar de aplicar soluciones cosméticas o refactorizaciones apresuradas sobre código defectuoso, Corefex aplica un ciclo de reconstrucción limpia (*Clean Rebuild Loop*) respaldado por el diseño de especificaciones completas (*Spec Kits*), el registro formal de decisiones arquitectónicas (*Architecture Decision Records* - ADR) y el principio de soberanía tecnológica *Open-Source* en contenedores Docker independientes de plataformas propietarias.

### 1.3. Inquebrantables, no complacientes (Gobernanza e Invariantes vs. Ilusión y Condescendencia)
Corefex no cede ante la tentación de la complacencia comercial ni ante la ilusión de una velocidad de desarrollo descontrolada. La marca impone límites duros e inquebrantables que protegen tanto la integridad de los sistemas como la sostenibilidad económica de los clientes:
- **Invariantes de Negocio (`Invariants.md`):** Reglas deterministas escritas en Markdown que el código o la IA jamás pueden romper bajo ninguna circunstancia.
- **Umbral de Confianza (*Confidence Threshold*):** Si la certeza de un agente en la toma de decisiones desciende por debajo del **85% (< 0.85)**, el sistema frena la automatización y escala el flujo a supervisión humana (*Human-in-the-Loop* - HIL).
- **Guardrail de Latencia:** Toda llamada a un LLM que sobrepase los **20 segundos** es abortada programáticamente para evitar bloqueos del hilo del sistema.
- **Blindaje Legal Defensivo:** La Cláusula 4.2 del Contrato Marco de Servicios (MSA) estipula que el cliente es el responsable jurídico final de la ejecución agéntica en su entorno, asegurando que Corefex mantenga una posición severa y transparente sobre el alcance y la co-responsabilidad técnica.

---

# 2. Activos Propietarios: Código Visual y Verbal

La identidad visual e interactiva de Corefex se materializa en el sistema de diseño **"Demerzel"**, una arquitectura estética *dark-first*, austera e industrial de alto contraste, diseñada para comunicar innovación agéntica y rigor técnico enterprise.

## 2.1. Paleta Cromática Core y Funcional ("Demerzel")

| Nombre del Color | Hexadecimal | Rol en el Sistema | Función UI / Identidad |
| :--- | :--- | :--- | :--- |
| **Void Black** | `#0A0A0A` | Core Brand | Ancla estructural principal. Fondo del portal (dark mode), profundidad visual y tipografía en documentos impresos. |
| **Hyper-Orchid** | `#B535F6` | Core Brand | Acento de marca primario que simboliza la convergencia de la Inteligencia Artificial Agéntica y puntos de enfoque crítico. |
| **Electric Leaf** | `#21C45D` | Core Brand | Acento secundario de vitalidad, agilidad, renovación tecnológica y estados de salud del sistema (system health / FSM exitoso). |
| **Cloud Grey** | `#E2E8F0` | UI / Funcional | Color primario de tipografía, lectura de datos e iconografía sobre fondos oscuros (máxima legibilidad). |
| **Deep Graphite** | `#1A1A1E` | UI / Funcional | Superficie secundaria (`--bg-surface`) para contenedores, tarjetas, modales y maquetación en Bento Grids. |

**Comportamiento del Conmutador CSS (*Dark/Light Switch*):** La interfaz opera por defecto en *dark-first* (`#0A0A0A`). No obstante, para entornos corporativos o auditorías de alto contraste, el sistema incluye un selector manual CSS denominado **Crisp White** que invierte dinámicamente las variables hacia un fondo claro brillante con tipografía oscura. Este conmutador realiza un *swap* de variables CSS manteniendo el cumplimiento estricto de accesibilidad **WCAG AAA** para auditorías enterprise, preservando la jerarquía funcional de los acentos *Hyper-Orchid* y *Electric Leaf*.

## 2.2. Tipografía Oficial Corporativa
- **Encabezados y Títulos (H1-H6):** **Sora** (Display Sans, *open-source*). Tipografía geométrica utilizada para comunicar rigor técnico, precisión arquitectónica e innovación agéntica en los titulares y jerarquías superiores de la interfaz.
- **Cuerpo de Texto, Tablas e Interfaces de Datos:** **Work Sans** (Grotesque Sans, *open-source*). Seleccionada por su neutralidad, rendimiento e impecable legibilidad en bloques de texto técnico, código y tablas de datos. Cumple estrictamente con los estándares de accesibilidad **WCAG 2.2 niveles AA y AAA**.

## 2.3. Forma Geométrica y Simbología (Isotipo "Demerzel")
El isotipo oficial de Corefex es una construcción geométrica minimalista basada en un **círculo abierto con capas concéntricas** (herencia evolutiva de las identidades de Coremed y Corenet), complementado con un punto central pivotante teñido en verde **Electric Leaf** (`#21C45D`).
- **Significado Simbólico:** Las capas concéntricas abiertas representan los nodos de infraestructura crítica, las fronteras de seguridad perimetral y los bucles de orquestación agéntica (*Agent Loops*). El círculo abierto simboliza la adaptabilidad del sistema frente a datos externos, mientras que el punto central en *Electric Leaf* representa la invariante inquebrantable, la salud del núcleo y la supervisión determinista del sistema de estados cerrados.

## 2.4. Estilo Visual y Fotográfico
El estilo visual rechaza las ilustraciones publicitarias genéricas de IA (como "cerebros brillantes", "redes neuronales neón 3D" o "robots futuristas"). En su lugar, adopta una estética **industrial-digital de alto contraste**:
- **Maquetación en Bento Grid:** Organización asimétrica y modular de la información en contenedores *Deep Graphite* (`#1A1A1E`).
- **Efectos de Capa:** Cabeceras flotantes (*Floating Pill Nav*) con desenfoque de fondo (*backdrop-blur*) e iluminación sutil en bordes con *Hyper-Orchid*.
- **Representación de Datos Realistas:** Capturas de terminales de código, estructuras de archivos Markdown (`.md`), contratos en JSON plano y diagramas de flujo FSM limpios.

## 2.5. Lemas Verbales Reversibles y Propietarios

1. **"Sin especificación no hay código"**
   - *Significado Estratégico y Vinculación:* Articula directamente la regla de oro del Invariante INV-01 y el archivo `Requirements.md`. Establece la barrera de entrada para cualquier desarrollo: prohíbe tocar una sola línea de código sin que exista una especificación previa validada por un arquitecto humano en el directorio `/specs`.
   - *Ubicación Operativa:* Encabezado de Hero en el portal web, portada de propuestas técnicas B2B y directrices internas de desarrollo.

2. **"Ampliar la resiliencia de los nodos críticos"**
   - *Significado Estratégico y Vinculación:* Define la misión de convergencia tecnológica de Corefex y se vincula a la infraestructura georreferenciada *Edge Coarse Geo*. Posiciona a la empresa como un proveedor de capas de orquestación agéntica capaces de sostener infraestructura industrial, empresarial y territorial sensible sin margen de alucinación ni caída de servicio.
   - *Ubicación Operativa:* Subtítulo institucional en Pitch Decks corporativos, portada de Órdenes de Trabajo (SOW) y comunicados de prensa.

3. **"Gobernanza sobre la ilusión agéntica"**
   - *Significado Estratégico y Vinculación:* Se conecta con la configuración técnica de `mcp-config.json` y las interfaces de escalado *Human-in-the-Loop* (HIL). Contrapone el control técnico determinista (vía *Model Context Protocol* - MCP, EVALs escritas por humanos y guardrailes de latencia/confianza) frente al caos, la falsa velocidad y la deuda técnica del *vibe coding*.
   - *Ubicación Operativa:* Pie de página en acuerdos legales (MSA), separadores conceptuales en presentaciones ejecutivas y firmas corporativas.

---

# 3. Brand Prism de Kapferer para Corefex

El Prisma de Marca de Kapferer sintetiza la identidad de Corefex en sus 6 dimensiones clave, conectando la infraestructura técnica con su percepción estratégica B2B.

### 3.1. Físico (Atributos Tangibles y Visuales)
- **Interfaces Dark-First:** Dominancia del *Void Black* (`#0A0A0A`) y *Deep Graphite* (`#1A1A1E`) con acentos de luz en *Hyper-Orchid* (`#B535F6`) y *Electric Leaf* (`#21C45D`).
- **Isotipo Concéntrico:** Geometría de círculo abierto concéntrico con núcleo verde activo en *Electric Leaf*.
- **Arquitectura Bento Grid:** Estructuración visual en módulos asimétricos para la oferta de servicios (*Agent Loops*, Gobernanza en Ejecución, Tooling MCP, Estado y Memoria).
- **Artefactos Versionables (`/specs`):** Presencia física de la documentación en Markdown en la raíz del repositorio, incluyendo explícitamente `Requirements.md`, `Invariants.md`, `UseCases.md`, `ADR.md` y `mcp-config.json`.
- **Tipografía Abierta:** Combinación de fuentes *open-source* *Sora* (encabezados) y *Work Sans* (cuerpo/datos).
- **Portales Georreferenciados:** Presencia institucional dual mediante el motor *Edge Coarse Geo*, mostrando *Corefex S.A.S.* (Bogotá, Colombia) para LATAM (`/es`) o *Corefex LLC* (Athens, GA, EE. UU.) para el mercado global (`/en`).

### 3.2. Personalidad (Carácter y Tono de Voz)
- **Carácter:** Arquitectónico, severo, técnicamente implacable, guiado estrictamente por especificaciones y transparente en la trazabilidad.
- **Tono de Voz:** Formal, analítico, directo, desprovisto de adjetivos comerciales inflados o promesas mágicas de marketing de IA. Habla el lenguaje de la ingeniería de sistemas, la teoría de autómatas, el derecho corporativo defensivo y la eficiencia operativa.

### 3.3. Cultura (Valores y Sistema de Creencias)
- **Cultura SDD (*Specification-Driven Development*):** Creencia de que el sistema y la arquitectura deben preceder siempre a la implementación. Frente a los datos empíricos de **METR** (desaceleración real del 19% por *vibe coding*) y el impacto global de **$85,000 millones en deuda técnica**, la cultura impone disciplina previa.
- **Metodología Shape Up:** Enfoque de gestión guiado por resultados reales (*outcomes*) y tiempo acotado (*time-boxing* de 2 a 6 semanas por "hambre"), recortando alcances en lugar de extender plazos.
- **Soberanía Tecnológica Open-Source:** Independencia operativa mediante contenedores Docker, Next.js 15 y servidores propios, evitando el *lock-in* con proveedores propietarios.
- **Cero Tolerancia al Vibe Coding:** Rechazo absoluto a la generación estocástica de código sin andamiaje.
- **Gobernanza de IA:** Control del contexto mediante el estándar *Model Context Protocol* (MCP) e imposición de mecanismos de inspección.

### 3.4. Relación (Específica con Clientes B2B)
- **Colaboración Gobernada y Auditada:** Relación de co-responsabilidad técnica basada en acuerdos transparentes.
- **Marco Contractual Defensivo:** Articulación transparente mediante el Contrato Marco de Servicios (MSA Cláusula 4.2) y las Órdenes de Trabajo (SOW Anexo A), definiendo que el cliente es el responsable jurídico de la ejecución agéntica en su entorno.
- **Transferencia de Soberanía:** Entrega del código y la orquestación en modelo *Self-Hosted* sobre la VPC del cliente para garantizar la residencia absoluta de los datos.
- **Supervisión Compartida:** Escalado hacia el cliente mediante interfaces *Human-in-the-Loop* (HIL) cuando el umbral de confianza decae (<85%).

### 3.5. Reflejo (Percepción del Cliente Objetivo / ICP Dual)
- **Comprador Técnico (Technical Buyer):** Chief Technology Officers (CTOs), VPs de Ingeniería, Directores de Tecnología y Arquitectos Principales de organizaciones B2B (Servicios Financieros, Salud/MedTech, SaaS Enterprise e Infraestructura Crítica). Agotados por la multiplicación de la deuda técnica y repositorios inmanejables por el uso descontrolado de IA.
- **Comprador Económico (Economic Buyer):** Chief Financial Officers (CFOs), CEOs y Miembros de Junta Directiva. Experimentan alta ansiedad financiera por el consumo desenfrenado de tokens, el riesgo de incumplimiento regulatorio (RGPD, HIPAA, Ley 1581) por acciones no autorizadas de agentes y el deterioro de la reputación de marca tras 6 meses de parches inestables que destruyen la experiencia del cliente.

### 3.6. Autoimagen (La Identidad Interna de la Marca)
- **Sentimiento Interno:** "Somos los másters del método y arquitectos de criterio que transforman la automatización estocástica en infraestructura digital industrial, confiable e indestructible."

---

# 4. Guía Práctica de Do's and Don'ts (Matriz de Aplicación)

## 4.1. Dimensión Visual e Interfaz de Usuario (UI)

| Criterio / Ámbito | Qué HACER (Do's) | Qué NO HACER (Don'ts) |
| :--- | :--- | :--- |
| **Esquema de Color Dominante** | Utilizar la paleta "Demerzel" *dark-first* con fondo estructural en Void Black (`#0A0A0A`) y tarjetas en Deep Graphite (`#1A1A1E`). | Usar temas claros por defecto en el portal o aplicar fondos blancos brillantes que rompan la estética *dark-first*. |
| **Acentos de Interfaz** | Reservar Hyper-Orchid (`#B535F6`) para acentos de IA agéntica y Electric Leaf (`#21C45D`) exclusivamente para indicadores de salud, éxito y FSM activo. | Saturar la interfaz con colores neón sin jerarquía o usar el verde Electric Leaf para elementos de error o advertencia. |
| **Maquetación y Layout** | Organizar servicios y datos mediante grillas rectangulares asimétricas tipo *Bento Grid* con bordes sutiles (`border-slate-800`). | Utilizar layouts tradicionales de bloques simétricos sin separación de contenedores o diseños recargados estilo "sitio folleto". |
| **Tipografía y Legibilidad** | Emplear Sora para encabezados (H1-H6) y Work Sans para el cuerpo de texto, garantizando contraste WCAG 2.2 AA/AAA. | Usar tipografías decorativas, cursivas o fuentes Serif que resten carácter técnico a la marca. |
| **Fotografía e Ilustración** | Representar la tecnología mediante código limpio, terminales, archivos Markdown (`.md`), esquemas FSM y tarjetas Bento. | Usar imágenes de stock genéricas de IA (cerebros 3D brillantes, robots estrechando manos o redes neuronales flotantes). |
| **Adaptabilidad Corporativa** | Incluir un conmutador CSS visible (variante Crisp White) para permitir el cambio manual a alto contraste en clientes corporativos. | Forzar el modo oscuro sin posibilidad de alternar el contraste para auditorías o clientes con requerimientos específicos. |

## 4.2. Dimensión Verbal, Narrativa y Comunicación

| Criterio / Ámbito | Qué HACER (Do's) | Qué NO HACER (Don'ts) |
| :--- | :--- | :--- |
| **Terminología Técnica** | Utilizar jerga de ingeniería precisa: SDD, *Agent Harness*, Invariantes, MCP, EVALs, *Contract Testing*, BDD/Gherkin, MSA. | Usar *buzzwords* vacíos de marketing de IA tales como "magia", "revolución sin esfuerzo", "IA omnipotente" o "automatización total". |
| **Promesa de Valor** | Enfocar la narrativa en la eliminación de la deuda técnica, la resiliencia del sistema, la gobernanza y la arquitectura de criterio. | Prometer velocidades de desarrollo descontroladas sin control de calidad o sugerir que la IA reemplaza el criterio del ingeniero. |
| **Narrativa de IA** | Describir los agentes como sistemas de estados cerrados con objetivos, límites, herramientas tipadas y escalado humano. | Usar lenguaje antropomórfico para los agentes (ej. "los agentes piensan", "sienten" o "tienen intuición humana"). |
| **Blindaje Legal en la Propuesta** | Comunicar claramente el deslinde de responsabilidad (MSA Cláusula 4.2) y el modelo de co-responsabilidad en la ejecución agéntica. | Asegurar o insinuar en textos comerciales que Corefex asume la responsabilidad jurídica u operativa directa de los agentes en producción. |
| **Manejo de Marca Geográfica** | Exponer la razón social correspondiente según la región (Corefex S.A.S. para LATAM / Corefex LLC para EE. UU. y Global). | Mezclar las razones sociales en el mismo documento o comunicar la empresa como una entidad genérica sin domicilio legal transparente. |

## 4.3. Dimensión Técnica, Metodológica y Operativa

| Criterio / Ámbito | Qué HACER (Do's) | Qué NO HACER (Don'ts) |
| :--- | :--- | :--- |
| **Integración de Código** | Exigir la existencia de archivos de especificación validados en `/specs` antes de autorizar cualquier Pull Request (INV-01). | Permitir el *merge* de código en la rama principal sin sus correspondientes archivos `.md` de requisitos o invariantes asociados. |
| **Acceso a Herramientas de IA** | Declarar y limitar explícitamente el acceso a APIs y bases de datos mediante el estándar Model Context Protocol (MCP). | Conceder a los agentes acceso irrestricto a APIs completas o permitir operaciones prohibidas en `mcp-config.json` (`DROP_TABLE`, `DELETE_FROM`, `UPDATE_PAYMENT_METHOD`, `EXECUTE_RAW_SQL`). |
| **Gestión de la Estocasticidad** | Aplicar el umbral de confianza (Confidence < 0.85) para detener la ejecución autónoma y escalar a supervisión humana (HIL). | Ignorar la métrica de certeza del modelo y permitir que el agente tome decisiones autónomas en escenarios de baja confianza. |
| **Control de Latencia y Recursos** | Abortar programáticamente cualquier llamada a un LLM que sobrepase los 20 segundos de tiempo de respuesta. | Permitir bucles de inferencia infinitos que bloqueen el hilo de ejecución o disparen los costos por consumo de tokens. |
| **Validación en CI/CD** | Ejecutar pruebas de contrato (*Contract Testing*) en Vitest y Playwright que certifiquen los invariantes antes del despliegue. | Omitir las pruebas automatizadas o permitir que la propia IA redacte los tests que validan su propio código generado. |
| **Privacidad y Registro** | Anonimizar la telemetría registrando únicamente el código ISO del país (`country_code`) en los eventos de analítica B2B. | Almacenar direcciones IP completas o datos personales sensibles en los registros centrales de auditoría de la aplicación. |

