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