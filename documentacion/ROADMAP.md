# Incancelables — Roadmap del proyecto

## Cambio de orden evolutivo — septiembre 2026

A partir de septiembre de 2026 se modifica temporalmente el orden previsto para las siguientes etapas de evolución del sitio.

Las versiones **v1.0, v1.1, v1.2 y v1.2.1 permanecen cerradas y funcionalmente validadas**.

La etapa de **auditoría técnica integral**, originalmente prevista como v1.3, queda **postergada** hasta después de la etapa de e-commerce y de su estabilización.

### Nuevo orden

**v1.3 — E-commerce e infraestructura**

Esta etapa surge a partir de un trabajo académico sobre e-commerce y se utilizará, en la medida de lo posible, para avanzar simultáneamente en la evolución real del sitio de Incancelables.

#### Estado de v1.3

* **Diseño técnico y funcional:** definido.
* **Backend MVP (PHP + MariaDB):** implementado.
* **Frontend del e-commerce:** en desarrollo en la rama `dev`. Bloque 2 (carrito) y Bloque 3 (checkout) completados.
* **Entorno académico:** no habrá ventas ni cobros reales.

#### Arquitectura y alcance

* Incancelables Web y Incancelables E-Commerce son **proyectos separados**, que se integran mediante **API REST**.
* El alcance del MVP incluye: catálogo de productos, detalle de producto, carrito, gestión de pedidos, clientes/usuarios (si corresponde), persistencia en base de datos y API propia en PHP.
* Google Apps Script y Google Sheets del sitio/newsletter **no se reemplazan ni se migran como parte del MVP**. Cualquier reemplazo o migración queda fuera del alcance del MVP y sujeto a decisión futura.

#### Relación con PROD

* `master` continúa siendo **PROD v1.2.1**.
* `master` **no incorpora por ahora el e-commerce académico**.
* El desarrollo de v1.3 continúa en la rama `dev`.

### v1.4 — Estabilización y migración

Etapa futura. Una vez implementado el frontend del e-commerce, se realizará la estabilización de la arquitectura resultante.

Esta etapa incluirá las pruebas necesarias para garantizar que las funcionalidades existentes continúen operativas.

Si se decide reemplazar o migrar funcionalidades que actualmente dependen de Google Apps Script y Google Sheets, su alcance se definirá en su momento; por ahora esa migración **no está decidida**.

### v1.5 — Auditoría técnica integral

La auditoría originalmente prevista como v1.3 pasa a esta etapa.

Incluirá:

* SEO avanzado;
* performance;
* Core Web Vitals;
* accesibilidad;
* Lighthouse;
* optimización de assets;
* limpieza de CSS;
* consolidación/refactor de código;
* revisión técnica general de la arquitectura resultante.

### Criterio para este cambio de orden

No se considera conveniente realizar una auditoría profunda de la arquitectura actual antes de completar la nueva arquitectura.

La incorporación de una API en PHP y una base de datos puede producir modificaciones importantes en el frontend, backend, modelo de datos y flujo de la aplicación. Por lo tanto, la auditoría integral se realizará sobre la arquitectura **ya evolucionada y estabilizada**, evitando optimizar anticipadamente componentes que posteriormente podrían ser reemplazados.

### Estado actual

**Última etapa cerrada:** v1.2.1
**PROD (master):** v1.2.1 — no incorpora el e-commerce académico
**Etapa en curso:** v1.3 — E-commerce e infraestructura (rama `dev`)
**Próximo trabajo:** continuar el frontend del e-commerce en `dev` — Bloques 2 (carrito) y 3 (checkout) completados; siguiente: gestión de pedidos
**Auditoría técnica integral:** postergada a v1.5
**v2.x:** evolución futura de la plataforma, a definir posteriormente.


# Backend v1.0

**Estado: COMPLETADO**

## Comunidad

- [x] Formulario de suscripción
- [x] Doble opt-in
- [x] Gestión de tokens
- [x] Expiración de tokens
- [x] Reenvío controlado
- [x] Normalización de datos
- [x] Detección de duplicados
- [x] Gestión de pendientes

## Contacto

- [x] Formulario de contacto
- [x] Notificaciones por email

## Newsletter

- [x] Envío de newsletters
- [x] Registro de campañas
- [x] Logging de campañas

## Gestión de suscriptores

- [x] Confirmación de suscripción
- [x] Unsubscribe
- [x] Resubscribe

## Refactor del backend

- [x] emailTemplates.gs
- [x] responseTemplates.gs
- [x] Separación de lógica y presentación

# Frontend

**Estado: COMPLETADO**

## Sitio

- [x] Home
- [x] Música
- [x] Shows
- [x] Banda
- [x] Contacto

## Responsive

- [x] Mobile First
- [x] Tablet
- [x] Desktop

## Páginas de resultado

- [x] Confirmación exitosa
- [x] Usuario ya confirmado
- [x] Token inválido
- [x] Token vencido
- [x] Baja realizada
- [x] Usuario ya dado de baja

## Integración Frontend ↔ Backend

- [x] confirm-json
- [x] unsubscribe-json
- [x] resultado.js
- [x] Separación SITE_URL / BACKEND_URL

## Templates visuales

- [x] Email de confirmación final
- [x] Newsletter final
- [x] Páginas de respuesta finales

# Arquitectura de datos

**Estado: COMPLETADA**

Datos desacoplados del HTML, centralizados bajo `scripts/data/`:

- [x] `scripts/data/discografia.js`
- [x] `scripts/data/showsListado.js`
- [x] `scripts/data/galerias.js`

Galerías generadas mediante:

- [x] `tools/generarGalerias.js`

## Detalle

- [x] Discografía desacoplada del HTML
- [x] Próximo show desacoplado del HTML
- [x] Shows históricos desacoplados del HTML
- [x] Próximo show y shows históricos centralizados en showsListado.js
- [x] Música renderizada dinámicamente desde datos
- [x] Shows renderizados dinámicamente desde datos
- [x] Estados dinámicos de Música implementados
- [x] Estados dinámicos de Shows implementados
- [x] Galerías administradas mediante datos desacoplados del HTML

# v1.0 — Lanzamiento oficial

**Estado: COMPLETADO**

## Objetivo

Publicar una versión estable, funcional y operativa utilizando dominio propio.

## Completado

- [x] Centralización de datos de música
- [x] Centralización de datos de shows
- [x] Estados dinámicos de contenido
- [x] Meta tags principales
- [x] Open Graph
- [x] Imágenes Open Graph en formato PNG
- [x] sitemap.xml
- [x] robots.txt
- [x] Dominio propio configurado
- [x] Delegación DNS completada
- [x] Cloudflare configurado
- [x] GitHub Pages Custom Domain configurado
- [x] Archivo CNAME configurado
- [x] HTTPS configurado
- [x] Redirección y configuración del dominio verificadas
- [x] Google Analytics 4 implementado
- [x] Google Analytics 4 activado únicamente en PROD
- [x] Google Analytics 4 desactivado en DEV
- [x] Medición validada en DEV mediante Live Server
- [x] Recepción de datos validada en PROD mediante Realtime

## Dominio

- [x] Dominio de producción: https://incancelables.com.ar

## Google Analytics 4

- [x] Measurement ID: `G-6P3NGNP8XZ`

Arquitectura:

- DEV: `API.ENVIRONMENT = "DEV"` → Google Analytics desactivado
- PROD: `API.ENVIRONMENT = "PROD"` → Google Analytics activado
- Archivo: `scripts/analytics.js`

## Eventos personalizados GA4

- [x] contact_form_submitted
- [x] community_signup_requested
- [x] community_signup_confirmed

## Validación GA4

- [x] Eventos enviados correctamente desde DEV
- [x] Eventos recibidos en GA4 Realtime
- [x] Eventos visibles en reportes de GA4

# Página 404

**Estado: COMPLETADO**

## Archivos

- [x] `404.html`
- [x] `styles/404.css`

## Completado

- [x] Página 404 creada
- [x] Mensaje amigable
- [x] Botón para volver al inicio
- [x] Integración visual con el sitio
- [x] Diseño responsive
- [x] Rutas absolutas configuradas
- [x] Integración con Google Analytics
- [x] Probada localmente en DEV
- [x] Integrada en rama dev
- [x] Mergeada de dev → master
- [x] Publicada en PROD
- [x] Validada en producción
- [x] Verificada desde URLs inexistentes en la raíz
- [x] Verificada desde URLs inexistentes dentro de /pages/

# Backup y documentación

**Estado: EN PROGRESO**

La documentación está siendo organizada dentro de `Documentacion/`.

No se marcan como completados los datos que todavía no están documentados.

## Frontend

- [ ] Repositorio GitHub
- [ ] Estructura del proyecto
- [ ] Ramas de trabajo
- [ ] Flujo DEV → PROD

## Backend

- [ ] ID Apps Script PROD
- [ ] URL Deploy PROD
- [ ] ID Apps Script DEV
- [ ] URL Deploy DEV
- [ ] Configuración de entornos
- [ ] Procedimiento clasp pull
- [ ] Procedimiento clasp push
- [ ] Procedimiento de deploy
- [ ] Relación entre ramas Git y proyectos Apps Script

## Base de datos

- [ ] ID Spreadsheet PROD
- [ ] ID Spreadsheet DEV
- [ ] Estructura de hojas

## Analytics

- [x] Google Analytics 4 implementado
- [ ] Documentar Measurement ID
- [ ] Documentar propiedad y Web Stream
- [ ] Documentación completa de GA4
- [ ] Procedimiento de recuperación/configuración de GA4

## Objetivo

Capacidad de recuperación rápida ante incidentes.

# v1.1 — Galerías de fotos

**Estado: COMPLETADO**

## Funcionalidades

- [x] Botón "Ver fotos"
- [x] Modal / Lightbox responsive
- [x] Cierre mediante X
- [x] Visualización optimizada de imágenes
- [x] Carga dinámica de galerías
- [x] Separación entre flyers e imágenes de galerías
- [x] Estructura de carpetas por show

## Estructura implementada

```
assets/
└── shows/
    ├── flyers/
    └── galerias/
        └── {show-id}/
```

## Arquitectura

- [x] Datos desacoplados del HTML
- [x] Generación automática preparada para futuras galerías

## Estado

- [x] Galerías históricas implementadas
- [x] Datos desacoplados
- [x] Generador automático de galerías
- [x] Integrado en rama dev
- [x] Mergeado a master
- [x] Publicado en producción

# v1.2 — Visor avanzado de fotografías

**Estado: COMPLETADO**

## Funcionalidades implementadas

- [x] Visor individual de fotografías dentro del modal
- [x] Apertura de una fotografía desde la galería
- [x] Restauración de la posición de scroll al volver a la galería
- [x] Reset del visor al abrir una nueva fotografía
- [x] Zoom mediante rueda del mouse en desktop
- [x] Zoom mediante pinch en dispositivos táctiles
- [x] Paneo de la fotografía ampliada
- [x] Límites de desplazamiento para impedir mostrar fondo fuera de la imagen
- [x] Zoom in anclado a la posición del puntero
- [x] Zoom out progresivo hacia el centro
- [x] Escala mínima 1
- [x] Escala máxima 5
- [x] Cursor dinámico: zoom-in / grab / grabbing

## Arquitectura

- [x] Transformación centralizada mediante `escala`, `desplazamientoX`, `desplazamientoY` y `actualizarTransform()`
- [x] `transform-origin` fijo en el centro
- [x] Pointer Events para paneo y pinch
- [x] Protección contra paneo durante pinch
- [x] Reset completo al cerrar/reabrir

## Decisiones técnicas

- [x] Sin doble click
- [x] Sin doble tap
- [x] Sin modoZoom
- [x] Sin toggleZoom
- [x] Sin transform-origin dinámico

## Validación

- [x] Implementación validada mediante pruebas automatizadas en Chrome/Playwright

# v1.2.1 — Protección del paneo durante pinch

**Estado: COMPLETADO**

- [x] Se agregó protección para impedir que un tercer puntero inicie un paneo mientras existe un pinch activo
- [x] Validación mediante `test-visor4.js`
- [x] 29/29 pruebas PASS

## Commit

- Commit: `ef6d7d8`
- Mensaje: "Visor de fotos v1.2.1 - proteger paneo durante pinch"
- Rama: `dev` — mergeada a `master`

# Testing del visor

**Estado: COMPLETADO**

## Validado

- [x] Apertura centrada
- [x] Zoom in con rueda en diferentes posiciones
- [x] Paneo
- [x] Límites de desplazamiento
- [x] Zoom out después de panear
- [x] Retorno progresivo a escala 1
- [x] Pinch zoom mobile
- [x] Pinch hasta escala 1
- [x] Paneo después del pinch
- [x] Cierre y reapertura
- [x] Restauración del scroll
- [x] Ausencia de errores JS

## Resultado

- 29/29 PASS

Algunas fallas iniciales fueron identificadas como artefactos del entorno de prueba y no como bugs reales del visor.

# v1.3 — Frontend e-commerce (rama `dev`)

**Estado: EN DESARROLLO**

## Alcance implementado hasta ahora

- [x] Página de Tienda (`pages/tienda.html`)
- [x] Catálogo de productos consumido desde la API
- [x] Bloque 2 — Carrito frontend
- [x] Bloque 3 — Checkout frontend

## Bloque 2 — Carrito frontend

**Estado: COMPLETADO**

### Parte 1 — Agregado al carrito

- [x] Módulo de estado y persistencia (`scripts/carrito.js`, `sessionStorage`)
- [x] Agregar producto desde la tarjeta del catálogo
- [x] Badge de unidades en el botón del carrito de la cabecera
- [x] Sincronización del carrito con el catálogo de la API (nombre, precio y disponibilidad)
- [x] Disponibilidad mostrada: `disponibilidad API − cantidad en carrito`, sólo a nivel de presentación
- [x] Estados de tarjeta: "Sin stock", "Máximo agregado" y "Agregar al carrito"
- [x] Aviso breve de feedback al agregar un producto

### Parte 2 — Drawer del carrito

- [x] Drawer responsive: mobile a pantalla completa y desktop como panel lateral
- [x] Ítems con nombre, precio unitario, controles − / +, subtotal y "Eliminar"
- [x] Totales de unidades y monto con botón "Continuar compra", sin backend ni checkout
- [x] Cantidades persistentes ante recarga de la página
- [x] Cierres mediante ×, clic fuera y Escape
- [x] Scroll del body bloqueado, foco contenido dentro del panel y devolución al botón del carrito
- [x] Carrito vacío: "Tu carrito está vacío" y pie oculto
- [x] Sin botón "Vaciar carrito"

### Corrección de layout del drawer

- [x] Tres zonas independientes: cabecera (título + ×), lista con scroll propio y pie con totales
- [x] Anulado el `grid-area` heredado del selector global `footer { grid-area: footer }`
- [x] Verificado con 0, 1 y varios productos en mobile y desktop

### Validación

- [x] 76/76 pruebas PASS: 38 unitarias de `carrito.js` y 38 de integración UI
- [x] Sin cambios en el backend ni en `scripts/api/apiConfig.js`

### Archivos

- [x] `scripts/carrito.js` (nuevo)
- [x] `scripts/tienda.js`
- [x] `pages/tienda.html`
- [x] `styles/tienda.css`

## Bloque 3 — Checkout frontend

**Estado: COMPLETADO**

### Formulario guest checkout

- [x] Formulario "Tus datos" con nombre, apellido y email (sin registro ni login)
- [x] Integración con `POST /api/pedidos` enviando email, nombre, apellido e items
- [x] Creación exitosa del Pedido: se conservan `pedido.id` y `pedido.estado` en el estado del frontend
- [x] Mensaje de éxito que indica verificar el correo electrónico para continuar
- [x] En éxito: campos inhabilitados y botón de envío oculto

### Respuestas del backend

- [x] Errores técnicos/estructurales (400, 404, 500, timeout, sin conexión): se muestra el mensaje y se conserva lo tipeado
- [x] `200 / resultado "correccion"`: aviso de que el Pedido no se creó y detalle por producto de los motivos comerciales (`motivos[]`)
- [x] `carrito_corregido` aplicado como **reemplazo** del carrito (ausentes eliminados, `[]` deja el carrito vacío)
- [x] Catálogo refrescado con `GET /api/productos` después de aplicar la corrección
- [x] Disponibilidad visible: `disponibilidad backend − cantidad cargada en carrito` (regla existente, sin cambios)
- [x] Carrito nuevamente editable con sus operaciones normales (+, − y eliminar)
- [x] Reintento explícito con el carrito vigente (botón "Reintentar compra")
- [x] Ciclo corrección → reintento repetible hasta obtener `creado`
- [x] Carrito intacto después de una creación exitosa

### Accesibilidad, responsive y scroll

- [x] Foco dirigido al mensaje de estado en cada respuesta (enviando, éxito, corrección y error)
- [x] Formulario y detalle de motivos verificados en mobile y desktop, sin overflow horizontal y con scroll del panel operativo

### Fuera de este bloque

- [ ] Validación del token/email
- [ ] Reenvío de verificación
- [ ] Pago
- [ ] Cancelación de Pedido
- [ ] Finalización completa del flujo de compra

### Validación

- [x] 430/430 PASS / 0 fallos: 147 pruebas unitarias/UI y 283 verificaciones de navegador
- [x] `node --check` OK para `scripts/carrito.js` y `scripts/tienda.js`
- [x] Sin cambios en el backend ni en `scripts/api/apiConfig.js`

### Archivos

- [x] `scripts/tienda.js`
- [x] `scripts/carrito.js`
- [x] `scripts/api/tiendaClient.js`
- [x] `pages/tienda.html`
- [x] `styles/tienda.css`

> Cambios en el working tree de `dev`, todavía sin commit.

### Pendiente de la etapa

- [ ] Gestión de pedidos

# v1.5 — Auditoría técnica integral

**Estado: POSTERGADA**

## Objetivo

Optimización completa del sitio.

## Alcance

- [ ] SEO avanzado
- [ ] Performance
- [ ] Core Web Vitals
- [ ] Accesibilidad
- [ ] Lighthouse
- [ ] Optimización de assets
- [ ] Limpieza CSS
- [ ] Consolidación de código

# v2.0 — Plataforma de comercio y gestión de eventos

**Estado: ROADMAP FUTURO**

## Objetivo

Transformar Incancelables en una plataforma de relación con la audiencia, venta de entradas y merchandising.

### v2.1 — Core de comercio electrónico

- [ ] Clientes
- [ ] Productos
- [ ] Pedidos
- [ ] Pagos
- [ ] Mercado Pago

### v2.2 — Sistema de verificación de email reutilizable

Desacoplar la verificación de email del sistema Newsletter para reutilizarla en futuras funcionalidades.

### v2.3 — Venta de entradas

- [ ] Eventos
- [ ] Entradas digitales
- [ ] QR
- [ ] Envío automático por email

### v2.4 — Check-in y control de acceso

- [ ] Escaneo QR
- [ ] Validación de entradas
- [ ] Registro de asistencia

### v2.5 — Tienda de merchandising

- [ ] Remeras
- [ ] Gorras
- [ ] Posters
- [ ] Discos
- [ ] Stickers
- [ ] Gestión de stock
- [ ] Gestión de envíos

### v2.6 — CRM y analítica de audiencia

- [ ] Conversión Newsletter → Compra
- [ ] Compradores recurrentes
- [ ] Asistencia a eventos
- [ ] Productos más vendidos
- [ ] Efectividad de campañas

# Estado real del proyecto

## Versión funcional actual

- **DEV (rama `dev`):** v1.2.1 + v1.3 en desarrollo (frontend e-commerce)
- **PROD (rama `master` → GitHub Pages):** v1.2.1 — sin e-commerce académico

## Completado

- [x] Backend v1.0
- [x] Frontend base
- [x] Separación DEV / PROD
- [x] GA4
- [x] Página 404
- [x] Galerías históricas v1.1
- [x] Visor avanzado v1.2
- [x] Protección de paneo durante pinch v1.2.1
- [x] Testing automatizado del visor
- [x] Merge de v1.2.1 de DEV → PROD
- [x] Publicación de v1.2.1 en producción
- [x] Frontend e-commerce v1.3 en `dev`: catálogo de la Tienda, Bloque 2 (carrito) y Bloque 3 (checkout)

## Pendiente

- [ ] Validación final de v1.2.1 en producción
- [ ] Frontend e-commerce v1.3 — gestión de pedidos

## Git

### Rama dev

- `dd6c932` — Visor de fotos v1.2 - funcionalmente validado
- `ef6d7d8` — Visor de fotos v1.2.1 - proteger paneo durante pinch

> `ef6d7d8` (v1.2.1) está contenido en `master` (verificado con `git merge-base --is-ancestor ef6d7d8 master`).
> `dev` y `master` solo difieren en `scripts/api/apiConfig.js` (`ENVIRONMENT: "DEV"` vs `"PROD"`).
> Último deploy de GitHub Pages: `c4e7d20` (master), 2026-08-08, estado `success` → https://incancelables.com.ar/.

# Próxima prioridad

Orden recomendado:

1. Finalizar y organizar la documentación técnica.
2. Revisar la auditoría de calidad del visor.
3. Validar la publicación de v1.2.1 en producción.
4. Continuar con la implementación del frontend de v1.3 — E-commerce en la rama dev.

# Historial de versiones

## v1.0

Lanzamiento oficial del sitio.

## v1.1

Galerías históricas de fotografías.

## v1.2

Visor avanzado de fotografías con zoom, paneo y pinch.

## v1.2.1

Protección del paneo durante pinch.