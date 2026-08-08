# Incancelables — Roadmap del proyecto

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
- Rama: `dev` (pendiente de merge a PROD)

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

# v1.3 — Auditoría técnica integral

**Estado: PENDIENTE**

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

- **DEV:** v1.2.1
- **PROD:** v1.1

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

## Pendiente

- [ ] Merge de v1.2.1 de DEV → PROD
- [ ] Publicación de v1.2.1 en producción
- [ ] Validación final de v1.2.1 en producción

## Git

### Rama dev

- `dd6c932` — Visor de fotos v1.2 - funcionalmente validado
- `ef6d7d8` — Visor de fotos v1.2.1 - proteger paneo durante pinch

> v1.2.1 todavía no fue mergeada a PROD: la rama master no contiene estos commits.

# Próxima prioridad

Orden recomendado:

1. Finalizar y organizar la documentación técnica.
2. Revisar la auditoría de calidad del visor.
3. Hacer merge de v1.2.1 de DEV → PROD cuando decidamos publicar.
4. Validar producción.
5. Continuar con la planificación de v1.3 — Auditoría técnica integral.

# Historial de versiones

## v1.0

Lanzamiento oficial del sitio.

## v1.1

Galerías históricas de fotografías.

## v1.2

Visor avanzado de fotografías con zoom, paneo y pinch.

## v1.2.1

Protección del paneo durante pinch.