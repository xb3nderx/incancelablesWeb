# INCANCELABLES — CHANGELOG

Este archivo registra los cambios relevantes realizados en el proyecto Incancelables.

# 2026-07-25

## Estado actual del proyecto

Se actualiza la documentación del estado general del proyecto.
Documentación principal:
- `PROJECT_STATE.md`
- `BACKEND_DOCUMENTATION.md`
- `CHANGELOG.md`
Se actualiza el estado general de la versión 1.0 y se documentan los componentes completados.

## Separación DEV / PROD

Se implementa y valida la separación completa entre los entornos de desarrollo y producción.
### Ramas Git

- dev    → DEV
- master → PROD

### Entorno DEV

Utiliza:
- Frontend DEV.
- Backend DEV.
- Google Sheet DEV.
- Configuración `ENVIRONMENT: "DEV"`.
### Entorno PROD

Utiliza:
- Frontend PROD.
- Backend PROD.
- Google Sheet PROD.
- Configuración `ENVIRONMENT: "PROD"`.
### Objetivo

Evitar que los datos, configuraciones y servicios de desarrollo se mezclen con producción.

## Backend DEV y PROD

Se crean y configuran copias independientes del backend de Google Apps Script.
Cada entorno posee:
- Su propio código de Apps Script.
- Su propio despliegue Web App.
- Su propia Google Sheet.
- Su propia URL de API.
Se valida la correspondencia:
- DEV  → Backend DEV  → Google Sheet DEV
- PROD → Backend PROD → Google Sheet PROD

## Configuración de entorno

Se implementa la configuración de entorno mediante `apiConfig.js`.
La configuración determina:
- Entorno activo.
- URL de API correspondiente.
- Tiempo de espera de las solicitudes.
La configuración de API se mantiene específica para cada entorno.

## Control de versiones

Se incorpora configuración de Git para evitar que la configuración específica de `apiConfig.js` sea sobrescrita incorrectamente durante las operaciones de merge entre ramas.
Se utiliza `.gitattributes` para gestionar el comportamiento del archivo durante los merges.

## Frontend

Se completa la implementación principal del frontend del sitio.
Secciones principales:
- Inicio.
- Música.
- Shows.
- Integrantes.
- Contacto.
Se implementan:
- Estados dinámicos.
- Página de resultados.
- Diseño responsive.
- Diseño mobile-first.
- Integración con el backend.
- Gestión de estados de formularios.
**Estado: COMPLETADO**

## Página 404

Se crea una página 404 personalizada.
Se implementa:
- `404.html`.
- Estilos específicos.
- Rutas absolutas.
- Compatibilidad con URLs inexistentes en la raíz.
- Compatibilidad con URLs inexistentes dentro de `/pages/`.
Se valida su funcionamiento en producción.

## SEO técnico básico

Se incorporan elementos básicos de SEO técnico.
Agregado:
- `sitemap.xml`.
- `robots.txt`.
- Metadatos Open Graph.

## Google Analytics 4

Se implementa Google Analytics 4 para el sitio de producción.
Se crea:
- scripts/analytics.js

El sistema carga Analytics únicamente cuando:
- API.ENVIRONMENT === "PROD"

De esta forma:
- DEV  → No envía datos a Analytics de producción.
- PROD → Carga Google Analytics 4.

Se integra el sistema en las páginas principales del sitio.
Se valida la integración en producción.

## Dominio personalizado

Se configura el dominio oficial:
- incancelables.com.ar

El dominio queda asociado al sitio publicado en GitHub Pages.

## Cloudflare

Se configura Cloudflare para la gestión DNS del dominio.
Se completa la delegación del dominio hacia los nameservers de Cloudflare.

## GitHub Pages

Se configura GitHub Pages como sistema de hosting del frontend.
Se configura el dominio personalizado:
- incancelables.com.ar

## HTTPS

Se configura HTTPS para el dominio de producción.
El sitio queda disponible mediante conexión segura.

# 2026-07-13

## Newsletter Backend v1

Se implementa el sistema inicial de newsletter.
### Agregado

- Obtención de suscriptores activos.
- Envío de newsletters HTML.
- Inclusión automática del enlace de unsubscribe.
- Registro histórico de campañas.

## Nueva hoja: Campañas

Se agrega la hoja:
- Campañas

### Columnas

- ID
- FECHA
- ASUNTO
- CONTENIDO
- DESTINATARIOS
- ENVIADOS
- ESTADO

### Estados posibles

- ENVIADA
- PARCIAL
- ERROR

## Templates de Email

Se separa la presentación visual de los emails de la lógica de negocio.
Se incorporan templates HTML para las comunicaciones del sistema.
Se prepara la arquitectura para la evolución visual de:
- Emails de confirmación.
- Comunicaciones del sistema.
- Newsletters.

## Estado Base Documentado

Se crea la documentación formal del proyecto:
- PROJECT_STATE.md
- BACKEND_DOCUMENTATION.md
- CHANGELOG.md

Estos documentos pasan a ser la referencia oficial para futuros checkpoints y actualizaciones del proyecto.

## Sistema de Comunidad

Se implementa:
- Registro de usuarios.
- Validación de datos.
- Normalización de información.
- Prevención de duplicados.
- Persistencia en Google Sheets.

## Sistema Pendientes

Se implementa:
- Hoja `Pendientes`.
- Generación de token de confirmación.
- Expiración de token.
- Cooldown para reenvío de emails.
- Control de intentos.

## Confirmación por Email

Se implementa:
- Envío de email de validación.
- Endpoint `GET action=confirm`.
- Función `confirmarPendiente()`.
- Movimiento de registros desde `Pendientes` a `Comunidad`.
### Decisiones

- Se conserva el ID original.
- Se conserva la fecha de registro original.
- Se registra `FECHA_CONFIRMACION`.

## Refactor de Comunidad

Se implementa:
- Uso de constantes `CONFIG` para columnas.
- Centralización de índices.
- Mejora de validaciones de email.
- Mejora de la organización del código.

## Sistema Unsubscribe

Se implementa:
- Endpoint `GET action=unsubscribe`.
- Función `darDeBajaPorToken()`.
- Generación de `TOKEN_BAJA`.
- Registro de `FECHA_BAJA`.
### Decisiones

- ESTADO = BAJA

no elimina el contacto.
El registro permanece en la hoja `Comunidad`.

## Re-suscripción

Se implementa la posibilidad de volver a suscribirse después de una baja.
### Decisiones

- Se permite la re-suscripción.
- Se requiere una nueva confirmación por email.
- Se reactiva el registro existente.
- Se actualizan `NOMBRE` y `CIUDAD`.
- Se genera un nuevo `TOKEN_BAJA`.
- Se conserva la `FECHA_BAJA` histórica.

# Estado actual

El proyecto cuenta actualmente con:
- BACKEND V1.0              COMPLETADO
- FRONTEND                  COMPLETADO
- COMUNIDAD                 COMPLETADO
- CONTACTO                  COMPLETADO
- CONFIRMACIÓN EMAIL        COMPLETADA
- UNSUBSCRIBE               COMPLETADO
- RE-SUSCRIPCIÓN            COMPLETADA
- NEWSLETTER BACKEND V1     COMPLETADO
- TEMPLATES EMAIL           IMPLEMENTADOS
- SEPARACIÓN DEV / PROD     COMPLETADA
- DOMINIO                   CONFIGURADO
- CLOUDFLARE                CONFIGURADO
- GITHUB PAGES              CONFIGURADO
- HTTPS                     CONFIGURADO
- PÁGINA 404                COMPLETADA
- SEO TÉCNICO BÁSICO        COMPLETADO
- GOOGLE ANALYTICS 4        COMPLETADO

# Próximos cambios previstos

## Versión 1.0 — Validación final

Pendiente:
- Testing funcional completo.
- Testing responsive final.
- Verificación de todos los flujos en DEV.
- Verificación de todos los flujos en PROD.
- Verificación final de aislamiento DEV/PROD.
- Backup completo.
- Documentación de recuperación.
- Revisión final de producción.

## Versión 1.1

Previsto:
- Galerías fotográficas de shows históricos.
- Nuevas mejoras de contenido.
- Mejoras de experiencia de usuario.

## Versión 1.2

Previsto:
- Refactor general.
- Auditoría SEO avanzada.
- Revisión CSS.
- Mejoras UX.
- Evolución progresiva de la arquitectura JavaScript.
# 2026-07-27

# Versión 1.0 — Validación final completada

Se completa la validación final de la versión 1.0 del proyecto Incancelables.

## Testing funcional DEV

Se validan los flujos principales del entorno DEV:
- Navegación completa del sitio.
- Formularios de contacto y comunidad.
- Integración frontend con backend DEV.
- Persistencia correcta en Google Sheet DEV.
- Flujo de confirmación por email.

## Testing responsive

Se completa la revisión responsive final del frontend.
Se validan:
- Diseño mobile-first.
- Adaptación a diferentes resoluciones.
- Componentes principales del sitio.
- Formularios.
- Secciones dinámicas.
- Correcciones menores de layout.

## Aislamiento DEV / PROD

Se valida definitivamente la separación entre entornos de desarrollo y producción.
### Entorno DEV

Configuración validada:
- Frontend DEV.
- Backend DEV.
- Google Sheet DEV.
- ENVIRONMENT: "DEV".
### Entorno PROD

Configuración validada:
- Frontend PROD.
- Backend PROD.
- Google Sheet PROD.
- ENVIRONMENT: "PROD".
Se confirma que la configuración específica de cada entorno permanece protegida durante los merges mediante la configuración de Git.

## Promoción a producción

Se realiza el merge de la rama `dev` hacia `master`.
Se publica la versión validada en producción:
- GitHub Pages.
- Dominio oficial incancelables.com.ar.
- HTTPS activo.

## Testing final PROD

Se validan los flujos principales sobre producción:
- Navegación completa.
- Carga de recursos.
- Formularios de contacto.
- Registro de comunidad.
- Confirmación por email.
- Comunicación con backend PROD.
# Estado final versión 1.0

| **Componente** | **Estado** |
| --- | --- |
| BACKEND V1.0 | COMPLETADO |
| FRONTEND | COMPLETADO |
| COMUNIDAD | COMPLETADO |
| CONTACTO | COMPLETADO |
| CONFIRMACIÓN EMAIL | COMPLETADA |
| UNSUBSCRIBE | COMPLETADO |
| RE-SUSCRIPCIÓN | COMPLETADA |
| NEWSLETTER BACKEND V1 | COMPLETADO |
| TEMPLATES EMAIL | IMPLEMENTADOS |
| SEPARACIÓN DEV / PROD | COMPLETADA |
| DOMINIO | CONFIGURADO |
| CLOUDFLARE | CONFIGURADO |
| GITHUB PAGES | CONFIGURADO |
| HTTPS | CONFIGURADO |
| PÁGINA 404 | COMPLETADA |
| SEO TÉCNICO BÁSICO | COMPLETADO |
| GOOGLE ANALYTICS 4 | COMPLETADO |
| VALIDACIÓN FINAL v1.0 | COMPLETADA |

## [2026-07-29]

### Added

#### Google Analytics 4

- Implementada infraestructura centralizada de medición GA4.
- Creado sistema `Analytics.trackEvent()` como única interfaz para eventos personalizados.
- Se estableció la regla arquitectónica de no utilizar `gtag()` fuera de `analytics.js`.
- GA4 funciona únicamente en entorno PROD mediante validación de `API.ENVIRONMENT`.
- En DEV los eventos son simulados mediante consola para pruebas.
- Agregados eventos personalizados:
  - `contact_form_submitted`
  - `community_signup_requested`
  - `community_signup_confirmed`

#### Galerías históricas de shows

- Implementado sistema dinámico de galerías fotográficas históricas.
- Incorporada estructura de imágenes:
  - `assets/shows/galerias/`
- Creado generador automático:
  - `tools/generarGalerias.js`
- Creado índice de galerías:
  - `scripts/data/galerias.js`
- Integrado modal responsive para visualización de fotografías.
- Actualizado sistema de shows históricos para soportar galerías asociadas.

### Changed

- Mejorada la arquitectura frontend para separar la lógica de medición analítica de los componentes funcionales.
- Actualizado el sistema de datos de shows históricos para incluir información de galerías.

### Status

- GA4: Implementado y validado en DEV/PROD.
- Galerías históricas: Implementadas y funcionando.

# 2026-08-07

## Estado de documentación y backup

Se completa la documentación operativa y de recuperación del proyecto.

Documentación consolidada:

- `PROJECT_STATE.md`
- `BACKEND_DOCUMENTATION.md`
- `BACKUP_AND_RECOVERY.md`
- `CHANGELOG.md`

La documentación completa se conserva en almacenamiento privado de Google Drive.

## Arquitectura de versionado del backend

Se aclara la estrategia real de versionado del backend.

El backend no posee un repositorio Git remoto independiente.

El código del backend se mantiene versionado localmente mediante Git.

Los entornos remotos de ejecución son:

- Google Apps Script DEV.
- Google Apps Script PROD.

Cada entorno posee:

- Su propio proyecto de Google Apps Script.
- Su propio deployment Web App.
- Su propia Google Sheet.
- Su propia URL de API.

La estructura real es:

DEV
↓
Código backend versionado localmente
↓
Google Apps Script DEV
↓
Google Sheet DEV

PROD
↓
Código backend versionado localmente
↓
Google Apps Script PROD
↓
Google Sheet PROD

La recuperación del backend se apoya en:

- Código local versionado.
- Copias de seguridad.
- Proyectos de Google Apps Script DEV y PROD.
- Documentación de recuperación almacenada en Google Drive.

## Backup y recuperación

Se documenta el procedimiento completo de backup y recuperación de:

- Frontend.
- Backend DEV.
- Backend PROD.
- Google Sheets.
- GitHub Pages.
- Cloudflare.
- Dominio.
- Google Analytics 4.
- Documentación.

Estado:

BACKUP Y RECUPERACIÓN — COMPLETADO

# 2026-10-07

## Bloque 6 — continuación de la compra en el drawer (post-verificación)

Se retira la sección provisional **Tu compra** (`#compra`) y todo el flujo posterior a la verificación del email pasa a vivir en el **drawer del carrito** que ya existe en `pages/tienda.html`: recuperación del Pedido por token, edición de items, reemplazo del Pedido, pago, correcciones y reintentos comparten el mismo panel, el mismo carrito y el mismo CTA.

Sin cambios en el backend (cerrado en `1f3d37a`) ni en `scripts/api/apiConfig.js`. No se despliega a PROD. Trabajo realizado en el working tree, sin commit.

### Flujo

`resultado.html` (verificación) → **Continuar compra** → `tienda.html?token=TOKEN` → `POST /api/email-verificaciones/pedidos` → drawer con el Pedido sembrado (estado `#carrito-estado` + CTA **Pagar**) → edición libre de items → si cambiaron, `POST /api/email-verificaciones/pedidos/reemplazo` → `POST /api/pedidos/{id}/pago` → confirmación, rechazo o corrección dentro del mismo drawer.

### Cliente (`scripts/api/tiendaClient.js`)

- Nueva función `reemplazarPedido(token, items)`: `POST ${TIENDA_API.URL}/email-verificaciones/pedidos/reemplazo` con `{token, items}`, headers JSON, timeout con `AbortSignal.timeout(TIENDA_API.TIMEOUT)` y envelope uniforme `{ok, message, data, codigo}`.
- `200` + `resultado: "reemplazado"` (hay Pedido nuevo) y `200` + `resultado: "correccion"` (transacción deshecha, Pedido activo intacto) son salidas válidas; `{"error"}` ⇒ `codigo` crudo (`token_invalido`, `token_expirado`, `verificacion_pendiente`, `pedido_no_activo`, `varios_pedidos_activos`, `pedido_vencido`, `carrito_vacio`, `accion_invalida`); `502` sin cuerpo JSON ⇒ `HTTP 502`; timeout/sin conexión ⇒ `data: null` con mensaje apto para el usuario.
- Sin token o sin `items[]` no se arma la ruta: se devuelve error sin hacer `fetch`.

### Página de resultado (`scripts/resultado.js`)

- En `mostrarContinuarCompra()` se oculta **Volver a Incancelables** (`btnVolver.style.display = "none"`): el estado `checkout_confirmado` sólo ofrece continuar en la tienda. Los demás estados de la página (newsletter y errores) conservan el botón, porque `mostrarEstado()` lo restaura.

### Tienda — HTML y CSS (`pages/tienda.html`, `styles/tienda.css`)

- Eliminada la sección `#compra` completa. Nuevo `#carrito-estado` dentro del panel, entre la cabecera y la lista, con `role="status"`, `aria-live="polite"` y `tabindex="-1"`; **sin `hidden`**: se colapsa con `#carrito-estado:empty` (un `display:none` lo sacaría del flujo del grid y desplazaría lista y pie).
- `.carrito-panel` pasa a 4 filas `auto auto 1fr auto` (cabecera / estado / zona central / pie): la lista y el `form#checkout-datos` siguen compartiendo la fila `1fr`, que se activa cuando la lista queda `display: none`.
- `#carrito-estado` suma `grid-area: auto` (mismo reset que las otras zonas contra los selectores globales) y entra al bloque de foco visible del drawer.

### Tienda — lógica (`scripts/tienda.js`)

- `mostrarEstadoCarrito(texto, tipo, {enfocar})` reemplaza a la interfaz retirada: concentra carga, recuperación, pago, corrección, rechazo y confirmación en `#carrito-estado` (clases `checkout-estado`, `.exito`, `.error`).
- Recuperación al abrir la página: `abrirCarrito()` con lista y pie ocultos y estado **Estamos recuperando tu compra...**; éxito ⇒ **Tu pedido está listo para pagar.**; fallo ⇒ `falloDeRecuperacion()` devuelve el carrito local intacto, sale del modo verificación y muestra el error con foco.
- El CTA del pie (`#carrito-continuar`) alterna **Pagar** / **Continuar compra** según `modoPostVerificacionActivo()` (`tokenVerificacion && pedidoContinuar`), con un único enganche `manejarClicContinuar()` que decide entre `procesarPago()` y `mostrarCheckout()`.
- El Pedido recuperado **reemplaza** (nunca fusiona) el carrito local y fija `pedidoContinuar = {id, estado, items}`; `cargarCatalogo()` sólo sincroniza nombre, precio y disponibilidad (ya no pinta resúmenes ajenos).
- `procesarPago()`: si los items coinciden con el snapshot (`itemsIgualesAlSnapshot()`, tripletas `producto_id|cantidad|precio_unitario` normalizadas e insensibles al orden) paga directo el Pedido activo; si cambiaron, primero `reemplazarPedido()` y después paga el Pedido nuevo. Las cadenas A → B → C son válidas; como un pago aprobado retira el modo, sólo continúan tras un rechazo.
- `resultado: "correccion"` del reemplazo ⇒ `mostrarCorreccionDeReemplazo()`: aplica `carrito_corregido` + catálogo, **no** paga, **no** toca el snapshot y el siguiente **Pagar** vuelve a comparar.
- Corrección durante el pago ⇒ `mostrarCorreccionDePago()` aplica el carrito pero **no** sobrescribe `pedidoContinuar.items`, de modo que el siguiente **Pagar** materializa el reemplazo.
- Rechazo: aviso con `Intento N de M` y "volver a intentarlo con **Pagar**" dentro de `#carrito-estado` (sin botón aparte); se sale del modo si el Pedido ya no está en `PEND_PAGO`.
- `PAGADO` ⇒ `vaciarCarrito()` + badge + render + `cargarCatalogo()` + salida del modo y estado de confirmación; `PAGADO_STOCK_NO_AFECTADO` ⇒ mensaje neutro con el carrito conservado.
- Errores: los códigos identificables (`MENSAJES_DE_VERIFICACION` y `ESTADOS_DE_ERROR_DE_PAGO`, con `varios_pedidos_activos` agregado) retiran el modo; los fallos de transporte lo conservan. El código crudo del backend nunca se muestra.
- `sessionStorage` y la clave `incancelables_carrito` no cambian: el token sólo vive en memoria.

### Eliminado

- Sección `#compra` de `pages/tienda.html`, bloque `.compra*` de `styles/tienda.css` y sus helpers de `scripts/tienda.js` (`mostrarEstadoCompra`, `pintarResumenCompra`, `agregarAccionCompra` y el enganche de `#compra-pagar`).

### Validación

- 254/254 PASS / 0 fallos: 47 pruebas de `carrito.js`, 77 de `tiendaClient.js` (63 previas + 14 nuevas de `reemplazarPedido()`), 12 de creación de Pedido (`test_checkout.js`), 13 escenarios de `resultado.js`, 73 de UI de `tienda.js` y 32 de recuperación/reemplazo/pago en `tiendaPago.test.mjs`.
- `node --check` OK para `scripts/resultado.js`, `scripts/carrito.js`, `scripts/tienda.js` y `scripts/api/tiendaClient.js`.
- Sin cambios en el backend ni en `scripts/api/apiConfig.js`.

### Archivos

- Modificados: `scripts/resultado.js`, `scripts/tienda.js`, `scripts/api/tiendaClient.js`, `pages/tienda.html`, `styles/tienda.css`

Estado:

CONTINUACIÓN DE LA COMPRA EN EL DRAWER — IMPLEMENTADO

# 2026-10-06

## Bloque 5 — continuación de la compra y pago desde la tienda

Se rehace el flujo posterior a la verificación del email para que la compra **no dependa de `sessionStorage`**: `pages/resultado.html` sólo informa la verificación y ofrece **Continuar compra**, que lleva a `pages/tienda.html?token=TOKEN`; la tienda recupera el Pedido con `POST /api/email-verificaciones/pedidos`, muestra el resumen y ejecuta el pago desde su propia página.

Reutiliza la orquestación de pago implementada en el Bloque 5 (`ea58cd5`): sólo se mudó de `resultado.js` a `tienda.js`. Sin cambios en el backend ni en `scripts/api/apiConfig.js`. No se despliega a PROD. Trabajo realizado en el working tree, sin commit.

### Flujo

`resultado.html` (verificación) → **Continuar compra** → `tienda.html?token=TOKEN` → `POST /api/email-verificaciones/pedidos` → resumen de compra (Producto / Cantidad / Precio unitario / Subtotal / Total) → **Pagar** → `POST /api/pedidos/{id}/pago`

### Cliente (`scripts/api/tiendaClient.js`)

- Nueva función `obtenerPedidosVerificados(token)`: `POST ${TIENDA_API.URL}/email-verificaciones/pedidos` con `{token}` y headers JSON, timeout con `AbortSignal.timeout(TIENDA_API.TIMEOUT)` y envelope uniforme `{ok, message, data, codigo}`.
- `200` con `resultado: "ok"` y `pedidos[]` → `ok: true`; `{"error"}` del backend → `codigo` crudo (`token_invalido`, `token_expirado`, `verificacion_pendiente`); `502` sin cuerpo JSON → `HTTP 502`; timeout/sin conexión → `data: null` con mensaje apto para el usuario.
- Sin token no se arma la ruta: devuelve error sin hacer `fetch`. El endpoint es de sólo lectura: no crea ni modifica Pedidos.

### Página de resultado (`scripts/resultado.js`, `pages/resultado.html`)

- Vuelve a script clásico (`<script src>` sin `type="module"`) y deja de importar `carrito.js`.
- Eliminada toda la sección de pago (estados, botones, `iniciarPago`, `obtenerItemsParaPago`, `vaciarCarrito`): ya no recupera items ni ejecuta pagos.
- Tras `resultado: "confirmado"` muestra **Email verificado** y el enlace **Continuar compra** → `tienda.html?token=${encodeURIComponent(token)}`. El token se propaga tal cual llegó y no se guarda en `localStorage` ni en `sessionStorage`.
- `mostrarEstado(status)` vuelve a un solo parámetro; el caso `checkout_confirmado_con_pedido` se reemplaza por `mostrarContinuarCompra()`.

### Tienda (`pages/tienda.html`, `styles/tienda.css`, `scripts/tienda.js`)

- Nueva sección hermana `#compra` con `role="status"` / `aria-live`, tabla de resumen, total y botón **Pagar** (`type="button"`); oculta por defecto, se levanta sólo cuando la URL trae `?token=`.
- `tienda.js` lee el token de la URL (sólo en memoria), llama a `obtenerPedidosVerificados()` y conserva `pedidoContinuar = {id, estado, items[]}` como única fuente de items para pagar: **el carrito de `sessionStorage` no se lee para continuar la compra** (sólo se vacía cuando el Pedido queda `PAGADO`, como hasta ahora).
- Resumen armado con cantidad, precio unitario, subtotal y total del Pedido; nombre y disponibilidad se resuelven con el catálogo (`identificacionDeProducto`), y se repinta cuando el catálogo termina de cargar.
- Estados de compra propios (`mostrarEstadoCompra`) con foco en errores: carga, sin Pedido `PEND_PAGO`, aprobado (importe + referencia), `PAGADO_STOCK_NO_AFECTADO`, rechazo con `Intento N de M` y **Reintentar pago**, corrección con repintado del resumen, errores de token y errores de transporte. Los códigos crudos del backend nunca se muestran.
- `aplicarCarritoCorregido()` ahora devuelve `{ok, items}` para que el reintento use los items corregidos del backend.
- Blindaje de doble envío con `pagoEnCurso`; sin `?token=` la tienda arranca igual que siempre (catálogo + carrito).

### Eliminado

- `obtenerItemsParaPago()` en `scripts/carrito.js` (los items del pago salen del Pedido del backend). `vaciarCarrito()` se mantiene.

### Validación

- 237/237 PASS / 0 fallos: 47 pruebas de `carrito.js` (las 6 de `obtenerItemsParaPago()` reemplazadas por una regresión de su eliminación), 63 de `tiendaClient.js` (48 previas + 15 nuevas de `obtenerPedidosVerificados()`), 12 de creación de Pedido, 13 escenarios de `resultado.js` (se retiraron los 17 de pago; el escenario de checkout ahora espera el enlace **Continuar compra** con `href = tienda.html?token=...`), 73 de UI de `tienda.js` y 29 nuevas de continuación/pago en `tiendaPago.test.mjs`.
- `node --check` OK para `scripts/resultado.js`, `scripts/carrito.js`, `scripts/tienda.js` y `scripts/api/tiendaClient.js`.

### Archivos

- Modificados: `scripts/resultado.js`, `scripts/carrito.js`, `scripts/api/tiendaClient.js`, `scripts/tienda.js`, `pages/resultado.html`, `pages/tienda.html`, `styles/tienda.css`

Estado:

CONTINUACIÓN DE COMPRA Y PAGO DESDE LA TIENDA — IMPLEMENTADO

# 2026-10-06

## Bloque 5 — Pago frontend

Se implementa el Bloque 5 (pago) del frontend de la Tienda en la rama `dev`, dentro de la etapa v1.3 — E-commerce (proyecto académico), cerrando el flujo `Email verificado → Continuar al pago → APROBADO/RECHAZADO → resultado`.

Sin cambios en el backend ni en `scripts/api/apiConfig.js`. No se despliega a PROD. Trabajo realizado en el working tree, sin commit.

### Cliente de pago

- Nueva función `iniciarPago(pedidoId, items, simulacion)` en `scripts/api/tiendaClient.js`: `POST /api/pedidos/{id}/pago` con `{accion: "iniciar_pago", proveedor_id: "DUMMY", items: [{producto_id, cantidad, precio_unitario}], simulacion: "APROBADO" | "RECHAZADO"}`, headers `Accept`/`Content-Type` JSON y timeout con `AbortSignal.timeout(TIENDA_API.TIMEOUT)`.
- Envelope uniforme `{ok, message, data, codigo}`: `ok: true` sólo para 200 con `resultado` ∈ `aprobado | rechazado | correccion` (no implica compra completada); `{"error"}` del backend ⇒ `codigo` crudo; timeout, sin conexión o configuración ausente ⇒ `data: null` con un `message` pensado para mostrarsele al usuario.
- Sin `pedidoId` no se arma la ruta: se devuelve error sin hacer `fetch`.

### Página de resultado

- `scripts/resultado.js` pasa a módulo (`<script type="module" src="../scripts/resultado.js">` en `pages/resultado.html`) e importa de `carrito.js` los helpers nuevos `obtenerItemsParaPago()` y `vaciarCarrito()`.
- `mostrarEstado(status, detalle)` acepta un segundo parámetro opcional para informar importe, referencia o intentos; las llamadas existentes del newsletter (un solo argumento) quedan intactas.
- Tras verificar el email, si la respuesta incluye un Pedido en `PEND_PAGO` se conserva su `id` y se muestra el botón **Continuar al pago**.

### Resultados del pago

- `aprobado` + `pedido.estado = PAGADO`: estado **Pago aprobado** con importe y referencia del proveedor, y único punto del flujo que ejecuta `vaciarCarrito()`.
- `aprobado` + `PAGADO_STOCK_NO_AFECTADO`: estado **Pago en revisión**; el carrito se conserva.
- `rechazado`: estado **Pago rechazado** con `Intento N de M` y botón **Reintentar pago** sólo si el Pedido sigue en `PEND_PAGO` y no se agotaron los intentos.
- `correccion`: se reutiliza `aplicarCorreccion(carrito_corregido)` (reemplazo del carrito, implementado en el Bloque 3) y se ofrece **Reintentar pago**; nunca se informa como aprobado.
- Errores reales con estado propio: `pedido_vencido`, `maximo_intentos_alcanzado`, `pago_ya_aprobado`, `pedido_inexistente` / `pedido_no_activo` / `pedido_no_pendiente_de_pago`. El resto cae en **No pudimos procesar el pago** mostrando el `message` del envelope: el código crudo del backend nunca se expone al usuario.
- Carrito vacío al pagar ⇒ estado **Tu carrito está vacío** sin realizar el request. La bandera `pagoEnCurso` descarta activaciones repetidas del botón (doble envío).

### Fuera de este bloque

- `EN_PROCESO`, cancelación de Pedido y finalización/confirmación posterior al pago.

### Validación

- 212/212 PASS / 0 fallos: 49 pruebas de `carrito.js` (43 previas + 6 nuevas de `obtenerItemsParaPago()` y `vaciarCarrito()`), 48 de `tiendaClient.js` (31 previas + 17 nuevas de `iniciarPago()`), 12 de creación de Pedido, 30 escenarios de `resultado.js` (13 de regresión del flujo newsletter/verificación + 17 de pago) y 73 de UI de `tienda.js`.
- `node --check` OK para `scripts/resultado.js`, `scripts/carrito.js` y `scripts/api/tiendaClient.js`.

### Archivos

- Modificados: `scripts/resultado.js`, `scripts/carrito.js`, `scripts/api/tiendaClient.js`, `pages/resultado.html`

Estado:

BLOQUE 5 — PAGO FRONTEND: IMPLEMENTADO

# 2026-10-02

## Bloque 3 — Inicio de checkout frontend

Se implementa el Bloque 3 (inicio de checkout) del frontend de la Tienda en la rama `dev`, dentro de la etapa v1.3 — E-commerce (proyecto académico).

Este bloque cubre el **inicio** del checkout: formulario guest, `POST /api/pedidos`, creación del Pedido en `PEND_VERIF`, correcciones comerciales y reintento de creación. **No** representa el checkout completo hasta `PAGADO`: el flujo continúa con la verificación de email (Bloque 4) y el pago (Bloque 5).

Sin cambios en el backend ni en `scripts/api/apiConfig.js`. No se despliega a PROD. Commit `24f8cf8` (`feat: implementar checkout frontend`) en `dev`.

### Formulario guest checkout

- Formulario "Tus datos" con nombre, apellido y email, sin registro ni login.
- Integración con `POST /api/pedidos` enviando email, nombre, apellido e items.
- Creación exitosa del Pedido en `PEND_VERIF`: se conservan `pedido.id` y `pedido.estado` en el estado del frontend (disponibles mediante `obtenerPedidoCreado()`).
- Mensaje de éxito que indica verificar el correo electrónico para continuar.
- En éxito se inhabilitan los campos y se oculta el botón de envío.

### Respuestas del backend

- Errores técnicos/estructurales (400, 404, 500, timeout, sin conexión): se muestra el mensaje devuelto y se conserva lo tipeado para reintentar.
- `200 / resultado "correccion"`: se informa que el Pedido todavía no se creó y se detalla, producto por producto, el motivo comercial (`motivos[]`).
- `carrito_corregido` se aplica como **reemplazo** del carrito y no como una fusión: los productos ausentes de la propuesta se eliminan, `[]` deja el carrito vacío y cantidad y precio unitario se toman tal cual.
- El catálogo se refresca con `GET /api/productos` después de aplicar la corrección; la disponibilidad visible sigue la regla existente `disponibilidad backend − cantidad cargada en carrito`.
- El carrito vuelve a ser editable con sus operaciones normales (+, − y eliminar).
- El botón de envío pasa a "Reintentar compra": el reintento se dispara con el carrito vigente y el ciclo corrección → reintento puede repetirse hasta obtener `creado`.
- Después de una creación exitosa el carrito queda intacto.

### Accesibilidad, responsive y scroll

- El foco se dirige al mensaje de estado en cada respuesta (enviando, éxito, corrección y error).
- Formulario y detalle de motivos verificados en mobile y desktop, sin overflow horizontal y con scroll del panel operativo.

### Fuera de este bloque

- Validación del token/email.
- Reenvío de verificación.
- Pago.
- Cancelación de Pedido.
- Finalización completa del flujo de compra.

Estos puntos continúan el mismo flujo de compra y quedan registrados en el ROADMAP como Bloque 4 — Verificación de email frontend, Bloque 5 — Pago frontend y finalización/confirmación del flujo de compra.

### Validación

- 430/430 PASS / 0 fallos: 147 pruebas unitarias/UI (73 de `tienda.js`, 43 de `carrito.js`, 31 de `tiendaClient.js`) y 283 verificaciones de navegador (134 motivos, 58 envío, 48 layout, 28 scroll, 15 teclado).
- `node --check` OK para `scripts/carrito.js` y `scripts/tienda.js`.

### Archivos

- Modificados: `scripts/tienda.js`, `scripts/carrito.js`, `scripts/api/tiendaClient.js`, `pages/tienda.html`, `styles/tienda.css`

Estado:

BLOQUE 3 — INICIO DE CHECKOUT FRONTEND: COMPLETADO

# 2026-10-01

## Bloque 2 — Carrito frontend

Se implementa el Bloque 2 (carrito) del frontend de la Tienda en la rama `dev`, dentro de la etapa v1.3 — E-commerce (proyecto académico).

Sin cambios en el backend ni en `scripts/api/apiConfig.js`. No se despliega a PROD.

### Parte 1 — Agregado al carrito

- Nuevo módulo `scripts/carrito.js` con estado y persistencia en `sessionStorage` (clave `incancelables_carrito`).
- Agregado de productos desde las tarjetas del catálogo.
- Badge de unidades en el botón del carrito de la cabecera.
- Sincronización del carrito con el catálogo de la API (nombre, precio y disponibilidad).
- Disponibilidad mostrada: `disponibilidad API − cantidad en carrito`, aplicada sólo a nivel de presentación.
- Estados de tarjeta: "Sin stock", "Máximo agregado" y "Agregar al carrito".
- Aviso breve de feedback al agregar un producto.

### Parte 2 — Drawer del carrito

- Drawer responsive: mobile a pantalla completa y desktop como panel lateral desde la derecha.
- Lista con nombre, precio unitario, controles − / +, subtotal y "Eliminar".
- Totales de unidades y monto con botón "Continuar compra", sin backend ni checkout (aviso "Checkout disponible próximamente.").
- Cantidades persistentes ante recarga de la página.
- Cierres mediante ×, clic fuera y Escape.
- Scroll del body bloqueado, foco contenido dentro del panel y devolución del foco al botón del carrito.
- Carrito vacío: "Tu carrito está vacío" con el pie oculto.
- Sin botón "Vaciar carrito".
- Las acciones +, − y Eliminar actualizan storage, badge, subtotales y disponibilidad sin cerrar el drawer.

### Corrección de layout del drawer

- Problema detectado: con productos en el carrito, la cabecera dejaba de verse como sección independiente y el `×` quedaba desplazado.
- Causa: `global.css` define `footer { grid-area: footer }` mediante selector de elemento; el pie del drawer heredaba un área inexistente en el panel y el grid del drawer pasaba de 1 columna × 3 filas a 2 columnas × 5 filas.
- Corrección en `styles/tienda.css`: `grid-area: auto` sobre `.carrito-cabecera`, `.carrito-lista` y `.carrito-pie`, más neutralización del `color` y la alineación heredados en el pie.
- El drawer mantiene siempre tres zonas independientes: cabecera (título + ×), lista con scroll propio y pie con totales + "Continuar compra".

### Validación

- 76/76 pruebas PASS: 38 unitarias de `carrito.js` y 38 de integración UI (catálogo, badge, drawer y estructura de las tres zonas).
- Verificación visual del drawer en mobile y desktop con 0, 1 y varios productos.

### Archivos

- Nuevo: `scripts/carrito.js`
- Modificados: `scripts/tienda.js`, `pages/tienda.html`, `styles/tienda.css`

Estado:

BLOQUE 2 — CARRITO FRONTEND: COMPLETADO

## Galerías históricas — evolución

Continúa el desarrollo de la versión 1.1 correspondiente a las galerías fotográficas de shows históricos.

El sistema cuenta actualmente con:

- Galerías asociadas a shows históricos.
- Visualización mediante modal.
- Apertura individual de fotografías.
- Retorno desde la fotografía hacia la galería.
- Conservación de la posición de scroll de la galería.
- Viewer de fotografía independiente.

## Visor avanzado de fotografías

Se inicia una evolución del visor de fotografías para mejorar la experiencia de visualización.

Arquitectura actual:

- `modoZoom` para controlar el estado del zoom.
- `escala` para controlar el nivel de ampliación.
- `desplazamientoX` y `desplazamientoY` para controlar el desplazamiento.
- `actualizarTransform()` como función central para aplicar transformaciones.
- Uso de `translate()` + `scale()`.

Comportamiento implementado:

- Click/tap para abrir una fotografía.
- Doble click en desktop para activar zoom.
- Doble tap en dispositivos táctiles para activar zoom.
- Zoom inicial a escala 2.
- Posicionamiento inicial del zoom según el punto seleccionado.
- Desplazamiento mediante arrastre.
- Limitación del desplazamiento para evitar mostrar el fondo del visor.
- Cursor dinámico según el estado del visor.
- Protección de eventos para que las acciones de zoom sólo funcionen cuando el visor está activo.

El visor mantiene:

- `transform-origin` centrado.
- Transformaciones controladas mediante `translate()` + `scale()`.

## Estado actual de la versión 1.1

### Galerías históricas

COMPLETADAS

### Visor de fotografías

EN DESARROLLO

### Próximo trabajo

Continuar la implementación del comportamiento avanzado del visor:

- Zoom mediante gesto de pinch en dispositivos táctiles.
- Zoom mediante rueda del mouse en desktop.
- Salida del modo zoom mediante doble click/doble tap.
- Salida del modo zoom al volver a escala 1.
- Ajuste final de límites de desplazamiento.
- Validación final en desktop y iPhone.

La implementación continuará de forma incremental, realizando y validando un cambio por vez.