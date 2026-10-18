# Módulo de Algoritmia de SENIALON

Propiedad de ALG. No contiene clientes HTTP, conexiones de base de datos, lectura de secretos, gestión de gasto o un reloj global. BE aporta entradas y persiste las salidas; FE las presenta. Las interfaces acordadas están en [INTERFACES_ANALISIS.md](../../docs/INTERFACES_ANALISIS.md), y la autoridad JSON sigue siendo `docs/contracts/openapi.json`, versión 1.0.0.

## ALG 2.2 — Ventanas entregadas

Única función: `analysis.derive_windows(started_at: datetime) -> Windows`, implementada en [windows.py](windows.py). Exige un `datetime` con desplazamiento conocido; no interpreta cadenas, fechas sin hora o valores sin zona. BE puede pasar el `AwareDatetime` validado al recibir/persistir `Run.started_at`.

La fecha de inicio se convierte a America/Bogota y se toma la medianoche del día local. La semana reciente empieza siete fechas antes y termina en esa medianoche; la anterior abarca las siete fechas inmediatamente anteriores. Los inicios son inclusivos y los fines exclusivos. El instante inicial y la hora de la consulta posterior no desplazan las ventanas guardadas.

Las fronteras se serializan en UTC con `Z`, admitido por el contrato; `timezone` conserva `America/Bogota`, la zona que define los días. En el periodo actual, las medianoches de Bogotá corresponden a 05:00 UTC. FE ya formatea las fechas recibidas en Bogotá; no debe restar siete días ni reconstruir los límites en el navegador.

```python
from datetime import datetime
from analysis import derive_windows

windows = derive_windows(datetime.fromisoformat("2026-10-18T12:00:00-05:00"))
```

Salida de ese caso temporal, no datos recolectados:

```json
{
  "timezone": "America/Bogota",
  "previous": {
    "start_inclusive": "2026-10-04T05:00:00Z",
    "end_exclusive": "2026-10-11T05:00:00Z",
    "days": 7
  },
  "recent": {
    "start_inclusive": "2026-10-11T05:00:00Z",
    "end_exclusive": "2026-10-18T05:00:00Z",
    "days": 7
  }
}
```

Para adquisición o conteo, BE/ALG comparan la fecha pública del video con `start_inclusive <= published_at < end_exclusive` de la salida persistida. Una publicación exactamente en el límite compartido pertenece solo a la semana reciente. Ninguna publicación del día en curso pertenece a esas ventanas. No se usa la fecha de la playlist como sustituto.

Los `TypedDict` de este módulo describen el retorno interno; no constituyen otro esquema JSON ni otra API. El módulo utiliza la base IANA disponible mediante `zoneinfo`; si falta America/Bogota en un entorno, el fallo se conserva y debe resolverse en el runtime. No sustituye la zona silenciosamente por UTC u otra configuración del host. Fechas para las que no se pueden representar ambas ventanas producen un error explícito.

## Verificación local

Desde `backend/`, con su entorno instalado:

```sh
./.venv/bin/python -B -m pytest -q analysis/tests
./.venv/bin/python -B -m pytest -q tests analysis/tests
```

En la entrega de ALG 2.2 se verificaron **27 pruebas nuevas** y **79 pruebas Python totales**, sin llamadas externas. Los casos incluyen el ejemplo canónico, un microsegundo antes/después del cambio de día desde UTC, medianoche exacta, mes/año/bisiesto, distintos offsets del mismo instante, ambos límites de inclusión, exclusión del día actual y entradas inválidas. El total actual con conteos/comparación está registrado al final; la suite conserva una advertencia previa de deprecación de Starlette/HTTPX, sin fallos.

Además, **nueve salidas producidas por `derive_windows`** se validaron con Ajv y el esquema `Windows` derivado de la autoridad canónica ya instalado en FE, sin instalar nuevos validadores o dependencias. Versión/hash permanecen iguales. Esta comprobación valida forma y formatos; las pruebas Python verifican el significado de las fronteras.

BE conserva su configuración de pytest. Mientras no agregue los tests de ALG a su descubrimiento general en BE 3.13, ejecutar el comando completo con **ambas rutas** para incluir esta suite. No se cambió configuración de infraestructura o de otra área para añadir el módulo.

## Entrega a BE y FE

1. BE 3.11 crea el instante `started_at` de la ejecución con zona explícita, llama **una vez** a `derive_windows` y guarda la salida junto con ese inicio.
2. BE 3.8 consulta publicaciones usando esas fronteras, y BE 3.5 conserva los intervalos. Reanudar o leer una ejecución recupera las mismas ventanas; no invoca otra vez el cálculo con el reloj del momento.
3. Los conteos ALG y FE reciben exactamente los intervalos persistidos. Cambiar de zona del navegador o abrir al día siguiente no genera otras semanas para la misma ejecución.

ALG 2.2 está entregada; no implementa adquisición, conteos, clasificación, endpoints, persistencia o despliegue. Esas capacidades conservan sus tareas y dependencias. FE 1.4 sigue abierta hasta que las operaciones y recuperación reales estén disponibles.

## ALG 2.5 — Conteos por tema entregados

`analysis.count_publications(context, groups=..., publications=..., coverage=...)` recibe registros canónicos **prevalidados por BE** y comprueba las relaciones entre entidades. No vuelve a clasificar IA o temas. `AnalysisContext` identifica ejecución/revisión, ventanas persistidas, versiones de reglas/clasificación/criterios, once fuentes, versión exacta de entradas e instante de procesamiento suministrado por BE. No hay fechas/versiones por defecto ni lectura de reloj.

La propuesta debe estar confirmada y corresponder a esa ejecución, ventanas y versiones. La confirmación identifica sus grupos y versión exactos. Cada publicación debe pertenecer al corpus, conservar elegibilidad y pertinencia respaldadas, y estar en su ventana según su fecha pública. Los principales, secundarios y referencias de evidencia deben existir y corresponder a esa pieza. Las exclusiones técnicas resueltas no necesitan tema ni análisis profundo.

El resultado es un `CountSnapshot` de transferencia interna con identidad, versiones, confirmación y `Count` por tema y ventana. No es otra respuesta o autoridad HTTP. BE utiliza sus conteos en la comparación y los persiste con ese contexto; FE recibe la comparación publicada por BE. No implementar conteos alternativos en Node o React.

- Cada ID contribuye una vez a su principal. Las copias idénticas de una publicación se deduplican; capturas/clasificaciones contradictorias se rechazan, sin elegir una arbitrariamente.
- Los IDs se ordenan para obtener una salida determinista y sus contribuciones por fuente particionan exactamente lo observado. Los secundarios siguen en la propuesta pero no incrementan otros temas. Métricas, condición de Short y ausencia de análisis profundo no cambian los conteos.
- Un total conocido exige cobertura temática suficiente de **las once fuentes de esa ventana**, no solo de los videos observados del tema. Paginación, adquisición, elegibilidad, pertinencia o principal incompletos mantienen `total_count=null`, razón e IDs observados.
- Una fecha pendiente sin ventana conocida limita ambas ventanas posibles. Un cero observado bajo incertidumbre conserva total desconocido; una ventana completa sin piezas aporta cero conocido. Las etapas justificadas como no aplicables no exigen llamadas ficticias.
- Una cobertura declarada completa con material/etapas pendientes se rechaza como snapshot incompatible. No se produce un total conocido o una comparación completa a partir de esa contradicción.

**55 pruebas de conteo** aprobadas; la suite Python conjunta alcanza **134 pruebas**. Incluyen los conteos canónicos 2/4, deduplicación, fuentes, frontera compartida, secundarios, ceros/desconocidos, cobertura parcial, principal/fecha pendientes, exclusión técnica, confirmación obligatoria y mezclas de identidades/versiones/evidencia. Se comprobaron también **seis salidas `Count` calculadas** contra el esquema canónico 1.0.0 con el Ajv existente de FE. No hay nuevas dependencias ni proveedores llamados; los grupos/publicaciones de prueba son fixtures sintéticos identificados como tales.

La ejecución con datos auténticos y la integración de estos resultados permanecen en ALG 2.11 y BE 3.11. La implementación pura de conteos no acredita acceso JEV/Gemini, generación real de grupos, persistencia o despliegue.

## ALG 2.6 — Comparación descriptiva entregada

`analysis.compare_topics(context, counts=..., groups=..., coverage=..., comparison_revision=...)` produce el objeto canónico `Comparison`. BE aporta una revisión de comparación reservada y el instante de procesamiento; no se generan desde un reloj global ni a partir de números de petición. El contexto debe identificar las mismas entradas del conteo; el instante de comparación puede ser posterior, sin cambiar sus ventanas originales.

La función exige confirmación válida y coherencia entre ejecución/revisión, versión de entradas, ventanas, criterios, grupos y confirmación. Los `Count` deben conservar IDs distintos, principal correcto y contribuciones por fuente que particionen lo observado en esa ventana. Las referencias ausentes, duplicaciones, totales inconsistentes o una cobertura completa no respaldada producen `AnalysisInputError`; una propuesta sin confirmar produce `GroupsNotConfirmedError`. BE traduce errores y sirve los estados pendientes desde su API, sin llamar al cálculo desde GET.

| Entradas evaluables | Señal y campos |
| --- | --- |
| A > 0 | Diferencia B − A y porcentaje 100 × (B − A) / A; dirección aumento, igualdad o descenso. Sin umbral de tendencia ni redondeo analítico adicional. |
| A = 0 y B > 0 | `new_in_corpus`, diferencia positiva y porcentaje null con motivo `zero_baseline`. |
| A = B = 0 | `no_observed_publications`, diferencia cero y porcentaje null; sin novedad. |
| Cobertura pendiente/parcial | Únicamente `comparison_pending`: conserva conteos observados y motivos, con diferencia y porcentaje null y dirección `not_evaluable`. Incluso dos números conocidos no justifican comparación completa si la cobertura agregada sigue parcial. |

La regla de cobertura por fuente/ventana es común al conteo y la comparación. No hay una segunda política en React o BE. La salida conserva limitaciones de grupos/cobertura y las referencias a las publicaciones a través de sus IDs y fuentes. No contiene crecimiento de audiencia, causalidad, fases de tendencia, puntuación, popularidad, predicción o conteos por formato.

**45 pruebas de comparación** aprobadas; la suite Python conjunta suma **179 pruebas**: 52 previas, 27 de ventanas, 55 de conteos y 45 de comparación. Se verificaron 2/4, 2/0, 0/3, 0/0, igualdad, porcentaje fraccionario, base desconocida, cobertura parcial/pending, confirmación obligatoria, revisión reservada y mezclas de entradas/versiones/IDs. **Ocho `Comparison` calculadas** se aceptaron con Ajv y el contrato canónico 1.0.0 existente; no cambió su hash.

Estas tres funciones puras están entregadas. La ejecución con publicaciones y grupos auténticos, acceso a proveedores, orquestación persistida y despliegue siguen pendientes. Las pruebas sintéticas no se incorporan como datos de producto o demo.

[Registro de verificación de las tres entregas](verification.json). Las siguientes dependencias operativas siguen pendientes: cuentas/control previo BE 3.2, accesos/adaptadores BE 3.4/3.7, persistencia/pasos/endpoints BE 3.5/3.10/3.11 y clasificación/grupos auténticos ALG 2.3/2.4. No configurar accesos, leer/alterar secretos o ejecutar pruebas pagadas para resolverlas bajo esta entrega offline. BE debe revisar también la exclusión de `analysis/tests/**` del empaquetado de producción al cerrar su configuración de despliegue; estos fixtures no se importan desde el módulo de producto.
