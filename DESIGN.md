---
name: SENIALON
description: Sistema visual para revisar oportunidades editoriales con evidencia.
colors:
  primary: "#F5A04A"
  primary-hover: "#FFB86B"
  primary-active: "#E38C35"
  on-primary: "#141414"
  brand-light: "#F08A24"
  background: "#141414"
  surface: "#1A1A1E"
  surface-raised: "#242429"
  surface-hover: "#2E2E34"
  text: "#EEEDEA"
  text-secondary: "#B7B7BF"
  text-muted: "#9B9BA5"
  border: "#3B3B44"
  control-border: "#777780"
  success: "#63D69A"
  warning: "#E9C46A"
  error: "#FF9B91"
  info: "#91BFFF"
  light-background: "#EEEDEA"
  light-surface: "#FFFFFF"
  light-text: "#141414"
  light-text-secondary: "#55555F"
  light-accent-text: "#9A4700"
typography:
  headline:
    fontFamily: "Sora, system-ui, sans-serif"
    fontSize: "2rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  section:
    fontFamily: "Sora, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Sora, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Work Sans, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  body-small:
    fontFamily: "Work Sans, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Work Sans, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.4
  data:
    fontFamily: "Work Sans, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.5
    fontFeature: "'tnum' 1"
  caption:
    fontFamily: "Work Sans, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  small: "4px"
  control: "8px"
  panel: "12px"
spacing:
  micro: "4px"
  small: "8px"
  control: "12px"
  medium: "16px"
  panel: "24px"
  section: "32px"
  large: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "12px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-primary-active:
    backgroundColor: "{colors.primary-active}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "12px"
  input:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "12px"
  navigation-active:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.primary}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "12px"
  status:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.text-secondary}"
    typography: "{typography.label}"
    rounded: "{rounded.small}"
    padding: "4px"
  panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.panel}"
    padding: "24px"
  evidence:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text}"
    typography: "{typography.body-small}"
    rounded: "{rounded.control}"
    padding: "16px"
---

# Design System: SENIALON

## Overview

**Creative North Star: "Mesa de criterio editorial"**

SENIALON debe sentirse como un espacio de trabajo donde cada afirmación puede contrastarse. La identidad combina el negro, el blanco cálido y el punto naranja de los logos Fluido con la precisión estructural del prisma aportado. La marca aparece en detalles consistentes; publicaciones, evidencia y decisiones ocupan el centro de la interfaz.

Este documento es una **especificación visual previa a la implementación**, creada el 17 de octubre de 2026. Los tokens definen la base propuesta para construir la interfaz; todavía no describen componentes implementados ni certifican accesibilidad de una aplicación terminada. El usuario confirmó conservar los logos y el naranja de SENIALON y adaptar del prisma la tipografía, el rigor y la estructura. Las escalas y comportamientos restantes son decisiones de diseño de esta propuesta.

**Key Characteristics:**

- Superficies oscuras, contraste claro y un acento naranja contenido.
- Sora en títulos; Work Sans en lectura, controles y datos.
- Estructura modular alineada con el trabajo editorial y la inspección de evidencia.
- Estados expresados con palabras, símbolos y color, sin depender solo del color.
- Densidad suficiente para comparar, con espacio para leer y tomar una decisión.

### Fuentes y adaptación del prisma

| Insumo | Aplicación en SENIALON |
| --- | --- |
| [prismaBrand.md](branding/prismaBrand.md) | Adoptar precisión, trazabilidad, tipografía y organización por módulos. Adaptar el carácter industrial a una herramienta editorial legible. |
| Logos Fluido vigentes | Conservar nombre, dibujo, proporciones y colores originales. Son la autoridad de la identidad visual existente. |
| [PRODUCT.md](PRODUCT.md) y [definición del MVP](docs/DEFINICION_MVP.md) | Determinan audiencia, tareas, límites y significado de los resultados. |
| [Specs del MVP](openspec/changes/definir-mvp-senialon/proposal.md) | Rigen confirmación de grupos, cobertura, señales, evidencia y revisión. El diseño visual no cambia esos contratos. |
| [Diseño técnico](openspec/changes/definir-mvp-senialon/design.md) | Rige stack, acceso y persistencia. Este DESIGN.md especifica la interfaz. |

El prisma describe a Corefex/GEMA 3 y su sistema Demerzel. SENIALON conserva su propio nombre e identidad: no incorpora esos nombres, razones sociales, contratos, cifras, lemas, isotipo concéntrico, proporción de trabajo 70/30, umbral del 85% ni límite de 20 segundos. Tampoco adopta sus prescripciones de Docker, Next.js 15 o nuevas funciones. Son contenido de referencia, no instrucciones para este proyecto.

### Personalidad y voz

| Rasgo adaptado | Manifestación visible |
| --- | --- |
| Rigor | Fechas, cobertura, fuentes y estados identificables junto al resultado. |
| Estructura | Jerarquía estable entre datos originales, observaciones, hipótesis y propuestas. |
| Transparencia | Explicar qué falta y qué puede hacer el operador para continuar. |

Escribir en español, con frases directas y vocabulario editorial. Usar «publicación», «tema», «evidencia», «propuesta» y «revisión». Los términos de infraestructura pertenecen al soporte técnico; no deben ocupar el recorrido principal. «Nuevo en el corpus» describe una condición concreta; «viral», «éxito garantizado» o «tendencia emergente» no son etiquetas de resultados de este MVP.

### Identidad y assets

| Uso | Archivo preferido |
| --- | --- |
| Marca sobre superficie oscura | [Fluido · oscuro@2x.png](branding/Fluido%20%C2%B7%20oscuro%402x.png) |
| Marca sobre superficie clara | [Fluido · claro@2x.png](branding/Fluido%20%C2%B7%20claro%402x.png) |
| Identificación compacta | [Fluido · icono@2x.png](branding/Fluido%20%C2%B7%20icono%402x.png) |

Usar los archivos existentes, con su fondo y proporción. No reconstruir el logotipo con Sora, recolorearlo ni restaurar el logo inicial. La palabra se ve en minúsculas en el dibujo; el nombre escrito del producto es SENIALON. El texto alternativo es «SENIALON» cuando identifica el producto; una repetición decorativa junto al mismo nombre puede llevar alternativa vacía.

Los PNG de marca completa tienen proporción 1200:520 y márgenes internos amplios. En una cabecera de 80 px, una imagen de 184 px de ancho conserva la proporción y deja una marca legible. En móvil, usar 138 px de ancho dentro de una cabecera de 64 px. Reservar al menos 12 px respecto a controles vecinos. Estos tamaños son recomendaciones de implementación, pendientes de comprobar en navegador.

## Colors

La paleta parte de los colores comprobados en los PNG: fondo oscuro, blanco cálido y dos variantes del naranja del punto. Los hexadecimales normativos están en el frontmatter; las descripciones siguientes explican su uso.

### Primary

- **Naranja señal — `primary`:** acento del logo oscuro, acción principal y selección activa. Usarlo con `on-primary` para botones sólidos.
- **Variantes `primary-hover` y `primary-active`:** cambios de interacción, sin brillo ni resplandor.
- **Naranja de la marca clara — `brand-light`:** color original del punto del logo claro. Su contraste no basta para texto pequeño sobre fondo claro; conservarlo en el asset y usar `light-accent-text` en enlaces o texto funcional.

### Neutral

| Token | Función |
| --- | --- |
| `background` | Lienzo de la aplicación y fondo que coincide con el logo oscuro. |
| `surface` | Módulos de trabajo y tablas; adapta Deep Graphite del prisma. |
| `surface-raised` | Selección, controles secundarios y agrupaciones dentro de un módulo. |
| `surface-hover` | Respuesta de filas y controles al puntero. |
| `text` | Texto principal. |
| `text-secondary` | Metadatos y explicaciones que siguen siendo legibles. |
| `text-muted` | Información auxiliar; nunca ocultar limitaciones esenciales mediante menor contraste. |
| `border` | Separadores decorativos y bordes de contenedores. |
| `control-border` | Límites de inputs y controles que necesitan ser reconocibles. No sustituirlo por el borde decorativo. |

### Estados funcionales

| Token | Significado permitido |
| --- | --- |
| `success` | Operación confirmada, como una decisión guardada. No acredita éxito futuro del contenido. |
| `warning` | Una limitación que requiere atención: cobertura parcial o comparación pendiente. |
| `error` | Fallo técnico o validación de un campo. «Utilidad no sustentada» no es un error técnico. |
| `info` | Ayuda, procedencia y detalles explicativos. |

Todo estado lleva una etiqueta y, cuando aporte orientación, un símbolo. Mostrar aumentos, descensos y valor mediante texto explícito; no construir una lectura de «verde = contenido recomendado». Las etiquetas de valor y afinidad usan una base neutral con sus nombres completos. No asignar colores de popularidad a los pilares editoriales.

**The Evidence Rule.** Un color nunca convierte una observación en verdad, una hipótesis en resultado ni un aumento de publicaciones en valor editorial.

### Variante clara y contraste

La demo se diseña primero en oscuro. Los tokens `light-*` sirven como base para documentos, materiales claros y una futura variante de interfaz. Un selector de tema no forma parte del recorrido esencial por el solo hecho de aparecer en el prisma. Una interfaz clara requerirá completar y comprobar todos sus estados antes de ofrecerla.

Se calcularon estos contrastes nominales sRGB entre tokens, redondeados aquí a dos decimales:

| Pareja | Contraste |
| --- | --- |
| `text` sobre `background` | 15,74:1 |
| `text-secondary` sobre `surface` | 8,71:1 |
| `on-primary` sobre `primary` | 8,78:1 |
| `light-text-secondary` sobre `light-background` | 6,29:1 |
| `light-accent-text` sobre `light-background` | 5,48:1 |
| `brand-light` sobre `light-background` | 2,14:1; reservado al logo, no a texto funcional. |
| `control-border` sobre `surface` | 3,91:1 |

La meta de implementación es contraste mínimo AA: 4,5:1 para texto normal y 3:1 para texto grande según sus condiciones. Esto no certifica conformidad AA o AAA de la interfaz completa; verificar tamaños, fondos, estados, foco y uso real. [Criterio de contraste de W3C](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

## Typography

**Display Font:** Sora (con system-ui y sans-serif como alternativas).

**Body Font:** Work Sans (con system-ui y sans-serif como alternativas).

**Character:** Sora aporta el carácter geométrico del prisma en títulos breves; Work Sans sostiene la comparación de datos, la lectura de evidencia y los controles. Las fuentes aún no se distribuyen en este repositorio: deben incorporarse y comprobarse al implementar, con carga local o la estrategia del frontend elegido.

### Hierarchy

| Rol | Uso |
| --- | --- |
| `headline` | Un título principal por vista, sin escala de hero publicitario. |
| `section` | Separaciones importantes dentro de una ficha. |
| `title` | Encabezados de módulos y grupos. |
| `body` | Explicaciones y adaptación editorial. |
| `body-small` | Tablas, evidencia compacta y metadatos. |
| `label` | Botones, navegación, campos y estados. |
| `data` | Conteos y valores comparables con cifras tabulares. |
| `caption` | Detalles secundarios prescindibles; no usarlo para errores, límites o acciones esenciales. |

Los tamaños usan rem y permanecen estables entre dispositivos. Mantener párrafos de hasta 70 caracteres aproximados por línea. Alinear números a la derecha en tablas; nombres y explicaciones a la izquierda. Etiquetas en estilo oración, sin bloques extensos en mayúsculas. Mostrar cantidades con formato español de Colombia y conservar la precisión del dato original.

No usar monoespaciada como sustituto de legibilidad. Reservar una pila del sistema monoespaciada para IDs o respuestas técnicas dentro de detalles expandibles. El logotipo siempre es el asset, nunca texto recreado.

## Layout

La aplicación es una mesa de revisión: navegación discreta, un encabezado con el contexto de la ejecución y una zona principal para comparar o inspeccionar. La vista inicial prioriza la ejecución disponible, su fecha, sus ventanas y su cobertura; no necesita un hero comercial ni una fila de indicadores sin contenido real.

### Retícula y adaptación

| Ancho | Comportamiento propuesto |
| --- | --- |
| Desde 1200 px | Navegación lateral de 224 px; zona de trabajo con máximo de 1440 px, márgenes de 32 px y separación de 24 px entre módulos. Una ficha puede usar dos columnas en proporción 7:5 para contenido y evidencia. |
| De 768 a 1199 px | Navegación compacta en cabecera y contenido en una columna cuando falte espacio; márgenes de 24 px. La evidencia sigue inmediatamente al bloque que respalda. |
| Menos de 768 px | Navegación mediante un control con nombre accesible; márgenes de 16 px y una columna. Controles apilados con acciones completas, sin perder acceso a publicaciones o evidencia. |

Usar la escala de espaciado del frontmatter: 4 px para ajustes, 8–16 px entre elementos relacionados, 24 px dentro de módulos y 32–48 px entre secciones. La estructura modular del prisma se traduce en grupos alineados y comparables. Las tablas densas no se convierten en mosaicos asimétricos que rompan la lectura de columnas.

En móvil, ofrecer una lista resumida por tema con sus conteos y detalle accesible, o desplazamiento horizontal limitado al contenedor de la tabla. No desplazar toda la página horizontalmente. Preservar nombres completos, ambos periodos y advertencias; no esconder la cobertura para ahorrar espacio.

### Jerarquía de información

1. Contexto persistente: ejecución, fecha, dos ventanas exactas, America/Bogota y alcance del corpus.
2. Estado y acción siguiente: continuar, confirmar grupos o revisar una pieza, según lo que realmente esté disponible.
3. Resultado: comparación, publicaciones o análisis seleccionado.
4. Respaldo: fuentes, criterios, versión, modelo y detalles por etapa.

El catálogo de publicaciones elegibles permanece accesible aunque la comparación esté pendiente. La falta de análisis audiovisual no debe ocultar los conteos que ya estén sustentados. Distinguir con el encabezado «Ejecución anterior» los resultados recuperados como respaldo.

### Accesibilidad de la composición

Mantener orden de lectura y foco coincidentes, un enlace para saltar al contenido y encabezados semánticos. El diseño debe funcionar con zoom al 200% y contenido reordenado en ancho equivalente a 320 px, salvo tablas que requieran sus dos dimensiones. Los encabezados o barras fijas no pueden tapar el foco ni la evidencia enlazada.

Los controles principales tienen un área interactiva de al menos 44 × 44 px como decisión de comodidad del sistema. Las marcas de tiempo dentro de texto pueden seguir el patrón de enlace en línea. No confundir esta decisión con la exigencia general de 24 × 24 px y sus excepciones del [criterio de tamaño mínimo de W3C](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).

## Elevation & Depth

La profundidad se consigue con contraste tonal, alineación y separadores. Lienzo, módulo y selección tienen superficies distintas. Los módulos y filas permanecen planos en reposo; no añadir resplandores naranjas, vidrio desenfocado o sombras a cada contenedor. La cabecera es una estructura de trabajo estable, no una píldora flotante heredada del portal del prisma.

Un popover o diálogo necesario puede usar una sombra de 0 12px 32px rgba(0, 0, 0, 0.32), junto con borde visible. No usar sombra como única delimitación de un control. Preferir detalles en línea a modales para evidencia, errores de etapa o confirmaciones frecuentes.

El movimiento explica cambios de estado: 160 ms para controles y hasta 220 ms para expandir detalles. No animar conteos desde cero, simular escaneos de radar, producir entradas escalonadas ni girar la marca. Con reducción de movimiento, eliminar transiciones no esenciales y mantener los estados comprensibles.

## Shapes

Los controles usan radio de 8 px, los módulos 12 px y las etiquetas compactas 4 px. Bordes de 1 px, con el token apropiado para separación o identificación de controles. Una etiqueta rectangular se percibe como estado; evitar que parezca botón cuando no realiza una acción.

La suavidad del logo Fluido se refleja en esquinas moderadas y un trato accesible, sin convertir todos los elementos en cápsulas. El punto circular naranja pertenece a la marca; no multiplicarlo como decoración ni usarlo simultáneamente para significados incompatibles.

Iconografía sencilla de trazo, consistente en grosor y tamaño de 20 px. La biblioteca de iconos sigue sin seleccionarse; este documento no agrega una dependencia. Un icono que realiza una acción lleva nombre accesible y texto visible cuando la acción pueda ser ambigua.

## Components

Los siguientes componentes son patrones propuestos para implementación. Cada control debe cubrir reposo, hover, foco, pulsado, deshabilitado y proceso cuando corresponda. El foco será visible con un contorno de 2 px en `primary` sobre superficie oscura y separación de 2 px; sobre un botón naranja, usar el contorno claro `text` y la misma separación. Comprobarlo también en modos de alto contraste.

### Buttons

Una acción principal naranja por zona de tarea; los botones secundarios usan superficie neutral y borde de control. Altura mínima de 44 px con crecimiento si el texto ocupa más de una línea. El botón primario usa texto oscuro, nunca blanco sobre naranja.

Usar verbos concretos: «Iniciar recolección», «Confirmar grupos», «Analizar publicación» y «Guardar decisión». El nombre exacto depende del estado del contrato. Mostrar «Guardando…» o «Analizando…» durante una operación; impedir una segunda solicitud del mismo control sin ocultar su estado. Un botón deshabilitado debe tener una explicación visible cuando el motivo no sea obvio.

Confirmar grupos, revisar evidencia, guardar una decisión y exportar a Notion son acciones diferentes. Ninguna confirma implícitamente las otras.

### Inputs / Fields

Etiqueta visible, texto de ayuda vinculado y error junto al campo. Fondo oscuro, borde de control y radio de 8 px. El motivo editorial admite varias líneas; el contenido se conserva si falla el guardado. No usar el placeholder como única etiqueta ni cambiar a rojo todo el módulo por un campo inválido.

No diseñar un formulario de login propio: el mecanismo técnico propuesto es HTTP Basic y la solicitud de credencial corresponde al navegador. Tampoco agregar registro, perfiles, recuperación de contraseña o administración de cuentas.

### Navigation

Navegación breve por ejecuciones, comparación temática y publicaciones, con el contexto de la ejecución visible. La ficha es un detalle de una publicación; debe permitir volver al listado conservando el contexto. La selección activa usa `navigation-active`, texto claro y una señal de posición adicional al color.

No inventar rutas, buscador global, configuración de canales ni un área de tendencias externas. Los once canales son el corpus fijo. La navegación móvil conserva todas las acciones esenciales y se opera por teclado.

### Status / Coverage

Etiquetas con texto completo: «Pendiente», «En proceso», «Disponible», «Información insuficiente» o «Error», aplicadas a su etapa. Junto a la cobertura parcial, mostrar canales previstos, consultados y fallidos con sus motivos reales; no sustituir desconocidos por cero.

Un resultado parcial permanece visible aunque otra etapa finalice. La etiqueta «Disponible» en una etapa no significa que terminó la ejecución completa. Indicar qué debe ocurrir para continuar. Al volver tras cerrar el navegador, mostrar el último paso confirmado y la opción real de reanudar; no afirmar que el análisis siguió activo.

### Panels / Containers

Agrupar contenido relacionado sobre `surface`, con borde decorativo y espacio interior de 24 px. Un encabezado, una descripción breve cuando haga falta y la acción pertinente. Evitar tarjetas dentro de tarjetas para cada frase o dato. Tablas y grupos de evidencia pueden ocupar el ancho del módulo.

### Topic comparison

El patrón central es una tabla legible: tema, conteo anterior, conteo reciente, diferencia permitida, variación porcentual cuando proceda y estado de comparación. Cuando el porcentaje no corresponda, mostrar «No aplicable» o «Pendiente» con el motivo. Encabezados con fechas reales; fuente y contribución por canal accesibles desde la fila. Distinguir tema principal contado y secundarios sin contribución.

Ejemplos de presentación, **ilustrativos y no resultados de SENIALON**:

| Anterior | Reciente | Presentación |
| --- | --- | --- |
| 2 | 4 | +2 publicaciones; +100% solo con cobertura completa evaluable. |
| 0 conocido | 3 | +3; «Nuevo en el corpus», sin porcentaje, con cobertura completa evaluable. |
| 0 conocido | 0 conocido | Sin publicaciones observadas; no es novedad. |
| Desconocido | 3 observadas | «Comparación completa pendiente» y motivo; no calcular crecimiento del corpus. |

Con cobertura parcial, presentar conteos observados y el alcance real, sin porcentaje ni novedad del corpus completo. No añadir medidor de viralidad, puntuación compuesta, saturación, predicción ni una línea temporal inferida a partir de solo dos conteos. Una subida de publicaciones tampoco acredita audiencia creciente.

### Groups / Confirmation

Mostrar los grupos propuestos con nombre, descripción, publicaciones y evidencia de pertenencia, además de versión y estado. La confirmación es explícita y posterior a la inspección. No ofrecer renombrar, fusionar, reasignar videos o editar pertinencia de IA manualmente.

Mientras no se confirmen, mostrar «Grupos pendientes de confirmar» en lugar de resultados de comparación. Si el operador decide no confirmar, conservar la propuesta; no fabricar un resultado ni bloquear el acceso a las publicaciones elegibles.

### Publication / Evidence

La publicación conserva título original, canal, enlace, fecha, duración, captura y condición «Candidato corto» o Short confirmado según evidencia. Las métricas faltantes se rotulan «No disponible». La miniatura, si está disponible, ayuda a reconocer la pieza; no la sustituye una imagen generada que parezca provenir del video.

La ficha separa cuatro bloques: **métricas originales**, **señal temática**, **valor** y **afinidad**. Las observaciones audiovisuales se muestran junto a sus marcas de tiempo y enlace al original. «Observación», «Hipótesis» y «Adaptación sugerida» son rótulos distintos, no variantes de un mismo resultado.

Cada evidencia muestra qué se observó y su estado de revisión. Una dimensión no observada sigue identificada como insuficiente. Enlazar al momento exacto si es posible y conservar la marca temporal en texto. La información de proveedor y criterios puede estar en detalles expandibles; la limitación que afecta la interpretación permanece visible.

### Editorial review / Feedback

El valor utiliza sus tres etiquetas completas: «Aporte respaldado», «Utilidad no sustentada» e «Información insuficiente». La afinidad se desglosa en persona, contexto empresarial y pilar, con razones y límites; no infiere quién vio el video. No reducir estos bloques a una estrella, semáforo o aprobación global.

La revisión editorial empieza «Pendiente de revisión». Registrar decisión y motivo sobre el análisis correspondiente; los valores adicionales de decisión deben seguir el contrato de producto, sin crear una taxonomía nueva desde el diseño. Si se descarta una adaptación, conservar publicación, evidencia y señal de origen.

Mostrar «Decisión guardada» solo tras confirmación real del servidor. Un error mantiene el texto escrito y los resultados existentes. Especificar qué falló y qué continúa disponible: «No se completó el análisis audiovisual. Los metadatos y la señal temática disponibles se conservan».

Durante la carga inicial usar un esqueleto simple y una explicación de la etapa, sin mostrar ceros provisionales. En actualizaciones conservar resultados previos con fecha y estado. No usar porcentajes de progreso, tiempos restantes o precisión sin una medición válida. Anunciar guardados y errores a tecnologías de asistencia sin mover el foco innecesariamente.

Un estado vacío explica la causa y el siguiente paso: aún sin ejecución, consulta completa sin publicaciones elegibles o cobertura insuficiente son situaciones distintas. No convertir un fallo en «No encontramos contenido».

Notion aparece al final de la ficha solamente si la integración está operativa. El éxito incluye enlace real; un duplicado se identifica y un fallo no borra la revisión local. Si la extensión se difiere, indicarlo como pendiente sin un botón que simule exportación.

## Do's and Don'ts

### Do:

- **Do** conservar los logos Fluido y el naranja de SENIALON; usar las variantes según su fondo.
- **Do** mantener fechas, cobertura y límites junto al resultado al que afectan.
- **Do** separar visualmente observación, hipótesis y propuesta de adaptación.
- **Do** usar tablas y alineación para comparar; componentes reutilizables para operar.
- **Do** comprobar teclado, foco, zoom, tamaños interactivos y todos los estados de contraste al implementar.
- **Do** tratar estos tokens como base normativa del diseño y registrar los ajustes cuando exista una interfaz comprobable.

### Don't:

- **Don't** trasladar la identidad legal, el morado/verde de marca ni las reglas operativas de Corefex al producto.
- **Don't** confundir crecimiento de publicaciones con viralidad, valor, causalidad o aumento de audiencia.
- **Don't** ocultar faltantes, convertir desconocidos en cero ni usar color como única explicación.
- **Don't** bloquear piezas útiles porque su tema no crece o la comparación está pendiente.
- **Don't** añadir rankings predictivos, edición de clasificaciones, cuentas individuales o integraciones fuera del alcance confirmado.
- **Don't** usar bento decorativo, nav flotante con desenfoque, neones o animaciones de radar para sustituir evidencia y jerarquía.
- **Don't** afirmar cumplimiento AAA, tiempos de respuesta, precisión o exportaciones que no se hayan verificado.

Formato organizado según [DESIGN.md](https://raw.githubusercontent.com/google-labs-code/design.md/main/docs/spec.md). La implementación posterior debe contrastar esta especificación visual con las specs funcionales y el diseño técnico, sin modificar silenciosamente el alcance.
