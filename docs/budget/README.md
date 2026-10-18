# Control previo de presupuesto — BE 3.2

**Estado: control preparado, verificación de cuentas pendiente; pruebas pagadas bloqueadas.** El límite confirmado es **20 USD de nuevos consumos y extras de la demo**. El usuario confirmó que la suscripción ya abonada de Vercel está pagada aparte. Esto no acredita que los extras futuros de Vercel estén cubiertos o sean gratuitos.

El [registro inicial](ledger.json) conserva como desconocidos los cargos/recargas previos, modelos, saldos, mínimos aplicables y tarifas de cuenta. Sus listas vacías no significan gasto cero. Se solicitó esta información al equipo sin pedir claves ni datos de pago; aún no hay verificación privada registrada. Gemini y Vercel están declarados configurados, JEV y YouTube por configurar, según las respuestas previas del usuario.

## Archivos y alcance

- [`backend/budget.py`](../../backend/budget.py): comprobación offline sin dependencias externas, sin red, pagos ni escrituras de reservas.
- [`ledger.json`](ledger.json): movimientos y estado de las verificaciones; importes como cadenas decimales en USD.
- [`preflight.json`](preflight.json): evidencia reproducible de bloqueo con el registro actual. No es una cotización ni una llamada real.
- [`backend/tests/test_budget.py`](../../backend/tests/test_budget.py): casos sintéticos de la política; no prueban saldos o cobros reales.

Requiere Python 3.12. Desde la raíz:

```sh
python3.12 -B backend/budget.py --ledger docs/budget/ledger.json --provider jev
python3.12 -B -m unittest discover -s backend/tests -v
```

El primer comando devuelve `state: blocked`, importes acumulados desconocidos (`null`) y código de salida **2**. No se le pasa una cota inventada. Con datos verificados, el operador puede evaluar una cota calculada mediante `--maximum-usd IMPORTE`; `--kind topup` comprueba el mínimo de una recarga propuesta. Código **0** significa que la foto registrada cabe según la política: **no ejecuta ni autoriza por sí solo un pago**.

## Qué verificar antes de cada prueba pagada

1. Confirmar el punto de partida con el equipo: nuevos cargos, compras de crédito, consumos y reservas pendientes de esta demo, incluso si el total confirmado es cero. Registrar fuente y fecha con zona horaria; no incluir claves, identificadores de cuenta o datos de pago.
2. Consultar la consola real del proveedor: cuenta operativa, modelo/servicio exacto, modalidad (`prepaid`, `postpaid` o `free`), saldo o margen disponible y recargas automáticas desactivadas/no aplicables. Si se necesita comprar crédito, comprobar el mínimo del checkout de esa cuenta. Un precio público no verifica su saldo o su mínimo efectivo.
3. Verificar la tarifa aplicable y calcular una **cota máxima**, considerando entrada, salida/pensamiento, audiovisual y extras aplicables. Identificar la fuente y los límites usados en la evidencia de la prueba; el comando no estima tokens ni precios por su cuenta. Si no puede acotarse el costo, conservarlo desconocido y bloquear.
4. Actualizar los consumos, cargos y reservas antes de evaluar. El saldo del proveedor se registra antes de descontar nuestras reservas locales aún no liquidadas. No liberar una reserva incierta por timeout, recarga de página o error de red.
5. Ejecutar el control y conservar la salida junto con la cota y su justificación. Si falta evidencia o no cabe, detener la prueba. No activar un plan, extra, recarga automática o compra de créditos como consecuencia del resultado.

Estos pasos requieren comprobación humana de la cuenta. Una fecha o el texto `verified` en un JSON no prueban por sí solos su veracidad o vigencia. La evidencia debe revisarse de nuevo antes de la prueba.

## Movimientos y cálculo

Cada movimiento exige `id` único, `provider`, `amount_usd`, `evidence` y `verified_at` con zona horaria. `cash_entries` admite `credit_purchase`, `hosting_extra` u `other_extra`: compras de crédito o extras cobrados directamente, sin volver a registrar la factura de un consumo postpago ya incluido. `usage_entries` declara su `funding_mode`. `reservations` conserva únicamente importes retenidos en estado `active` o `uncertain`; la liquidación y su historial duradero pertenecen a BE 3.10.

Se comprueban dos topes de 20 USD:

- **Compromiso de caja:** compras/extras + consumo postpago + reservas postpago.
- **Consumo comprometido:** todo el consumo + reservas activas/inciertas.

Así, una compra de crédito de 5 USD y el gasto de 1 USD de ese mismo crédito no se suman como 6 USD de caja. Una nueva llamada debe caber en el margen de consumo y en el saldo del proveedor tras las reservas; si es postpago, también en el margen de caja. Una recarga debe caber en el margen de caja y respetar el mínimo verificado. No se descuenta la suscripción previa de Vercel del límite de nuevos gastos.

El cálculo usa `Decimal`, rechaza importes negativos/flotantes/no finitos y redondea las cotas hacia arriba a una millonésima de USD. No cambia el límite, asume gratuidad ni modifica el registro al evaluarlo.

## Referencias públicas de tarifas y límites

Consulta documental: **17 de octubre de 2026, America/Bogota**. Son referencias públicas; los modelos y la facturación efectivos del equipo siguen sin confirmar.

| Servicio | Evidencia pública consultada | Lo que queda pendiente de cuenta |
| --- | --- | --- |
| JEV / TypeSafe | La [documentación de modelos](https://docs.typesafe.ai/models) publica `jev-1.14.0` y `jev-1.13.0` a **0.042 USD por millón de tokens de entrada**, salida sin cargo. Las [condiciones de créditos](https://typesafe.ai/legal/mca) describen créditos y recarga automática opcional. | Habilitación, modelo seleccionado, saldo/crédito y mínimo de compra efectivo. No se encontró un mínimo oficial aplicable a la cuenta. |
| Gemini | [Precios oficiales por modelo y modalidad](https://ai.google.dev/gemini-api/docs/pricing); la [guía de facturación](https://ai.google.dev/gemini-api/docs/billing) describe prepago y un mínimo público de referencia de **5 USD**. | Modelo, modalidad, límites de entrada/salida, tarifa audiovisual aplicable, saldo/margen, mínimo de checkout y estado de recarga automática. No se presupone acceso gratuito. |
| Vercel | [Control de uso por equipo/proyecto](https://vercel.com/docs/pricing/manage-and-optimize-usage) y [costos de Services](https://vercel.com/docs/services/pricing). | Uso incremental de la demo, créditos incluidos disponibles, límites efectivos y extras. El abono previo queda fuera de los 20 USD por confirmación del usuario. |
| YouTube | La configuración y verificación de cuota corresponden a BE 3.4. | Acceso y cuota de cuenta por verificar; no se registra como servicio ya operativo. |

Los avisos o límites de gasto del proveedor no sustituyen la reserva previa de SENIALON: pueden tener retrasos y no acreditan un límite duro de 20 USD.

## Entrega para BE 3.10 y cierre pendiente

La aplicación aún no dispone de un control transaccional de consumo. BE 3.10 debe integrar esta política con estado duradero y una reclamación/reserva atómica **antes de cada llamada**, incluso subpasos y reintentos; registrar uso real, liquidar sin duplicar y retener incertidumbre. El registro de este directorio es una base de preparación, no una base de datos operativa ni un cerrojo concurrente.

BE 3.2 conserva pendiente la verificación privada de punto de partida, modelos, saldos/márgenes y mínimos de cuenta. Hasta registrarla no hay prueba pagada habilitada. La evidencia de bloqueo y los tests sí pueden verificarse localmente sin consumir presupuesto.
