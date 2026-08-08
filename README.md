# INCANCELABLES

Sitio web oficial de **Incancelables**, banda de rock argentina.

🌐 **Sitio oficial:** https://incancelables.com.ar

---

## Sobre el proyecto

Incancelables utiliza su sitio web como canal principal de comunicación con su comunidad.

El proyecto incluye:

- Sitio web oficial.
- Información de la banda.
- Música y contenido multimedia.
- Shows históricos.
- Galerías fotográficas.
- Formulario de contacto.
- Sistema de comunidad.
- Newsletter.
- Canal de WhatsApp.
- Google Analytics 4.

El proyecto prioriza el sitio web y los canales propios por sobre las redes sociales tradicionales.

---

# Arquitectura

La arquitectura general del proyecto está basada en una separación entre frontend y servicios backend.

Flujo general:

USUARIO
↓
CLOUDFLARE
↓
GITHUB PAGES
↓
FRONTEND
HTML / CSS / JAVASCRIPT
↓
WEB APP API
↓
GOOGLE APPS SCRIPT
↓
GOOGLE SHEETS
↓
SERVICIOS DE EMAIL

## Frontend

Tecnologías principales:

- HTML5
- CSS3
- JavaScript Vanilla
- JavaScript modular
- Diseño responsive
- Arquitectura mobile-first

El frontend se publica mediante GitHub Pages.

## Backend

El backend está implementado mediante:

- Google Apps Script
- Google Apps Script Web App
- Google Sheets
- Servicio de email de Google Apps Script

El backend proporciona servicios para:

- Contacto.
- Comunidad.
- Confirmación por email.
- Unsubscribe.
- Re-suscripción.
- Newsletter.

La implementación y documentación interna del backend se mantienen separadas del repositorio público.

## Persistencia

Google Sheets se utiliza como sistema de persistencia para:

- Comunidad.
- Suscripciones pendientes.
- Mensajes de contacto.
- Historial de campañas.

---

# Entornos

El proyecto utiliza dos entornos independientes.

## DEV

Frontend local
↓
Backend DEV
↓
Google Sheet DEV

Utilizado para:

- Desarrollo.
- Pruebas.
- Validación de nuevas funcionalidades.

## PROD

GitHub Pages
↓
Backend PROD
↓
Google Sheet PROD

Utilizado para:

- Sitio público.
- Usuarios reales.
- Datos reales.

La separación entre DEV y PROD es una regla fundamental de la arquitectura.

Los datos y servicios de desarrollo no deben mezclarse con producción.

---

# Analítica

Google Analytics 4 está integrado mediante una capa centralizada de medición.

La analítica se encuentra activa únicamente en producción.

Los eventos personalizados se gestionan mediante una interfaz centralizada para evitar llamadas directas a la implementación de Analytics desde los distintos componentes del frontend.

Eventos actualmente implementados:

- `contact_form_submitted`
- `community_signup_requested`
- `community_signup_confirmed`

---

# Funcionalidades

## Sitio web

El frontend incluye:

- Inicio.
- Música.
- Shows.
- Integrantes.
- Contacto.
- Página 404.
- Diseño responsive.
- Metadatos Open Graph.
- Sitemap.
- Robots.txt.

## Comunidad

El sistema de comunidad permite:

- Registro.
- Confirmación por email.
- Tokens de validación.
- Expiración de tokens.
- Reenvío controlado.
- Unsubscribe.
- Re-suscripción.

## Newsletter

El sistema permite:

- Gestionar suscriptores activos.
- Enviar newsletters.
- Utilizar contenido HTML.
- Incorporar enlaces individuales de baja.
- Registrar campañas.
- Realizar envíos de prueba.

## Galerías

Los shows históricos pueden incluir galerías fotográficas.

El sistema utiliza generación automática de datos para asociar las imágenes con cada show.

---

# Versionado

El frontend utiliza Git para controlar el desarrollo del proyecto.

Las ramas principales son:

- `dev` → desarrollo y pruebas.
- `master` → producción.

La configuración específica de los entornos se mantiene separada para evitar mezclar DEV y PROD.

El backend se versiona y administra de forma independiente del repositorio público del frontend.

---

# Documentación

La documentación pública disponible incluye:

- `CHANGELOG.md`
- `SCALING_ROADMAP.md`

La documentación interna y operativa no forma parte del repositorio público.

Entre la documentación mantenida de forma privada se encuentran:

- Estado detallado del proyecto.
- Documentación interna del backend.
- Procedimientos de backup y recuperación.
- Configuraciones específicas de entorno.
- Información operativa y de infraestructura.

---

# Estado del proyecto

## Versión 1.0

La versión 1.0 fue completada y publicada.

Incluye:

- Sitio web oficial.
- Frontend responsive.
- Sistema de contacto.
- Sistema de comunidad.
- Confirmación por email.
- Unsubscribe.
- Re-suscripción.
- Newsletter.
- Página 404.
- SEO técnico básico.
- Open Graph.
- Dominio personalizado.
- HTTPS.
- Cloudflare.
- GitHub Pages.
- Google Analytics 4.
- Separación DEV / PROD.

## Versión 1.1

Actualmente en desarrollo.

Objetivos principales:

- Galerías fotográficas de shows históricos.
- Mejoras de contenido.
- Mejoras de experiencia de usuario.

---

# Roadmap

El proyecto mantiene un roadmap de evolución basado en:

- Nuevas funcionalidades.
- Mejoras de experiencia de usuario.
- Evolución del frontend.
- Optimización progresiva.
- Escalabilidad de backend.
- Evolución del sistema de contenidos.

Para conocer el estado y evolución del proyecto:

- `CHANGELOG.md`
- `SCALING_ROADMAP.md`

---

# Escalabilidad

La arquitectura actual está diseñada para las necesidades presentes del proyecto.

La estrategia es evolucionar los componentes individualmente cuando sea necesario, evitando migraciones prematuras.

Posibles evoluciones futuras:

Google Sheets
↓
Base de datos dedicada

Google Apps Script
↓
API dedicada

Apps Script Mail
↓
Proveedor especializado de email

GitHub Pages
↓
CDN / almacenamiento especializado para imágenes

Las migraciones se realizarán únicamente cuando el volumen, rendimiento o necesidades funcionales lo justifiquen.

---

# Tecnologías

| Área | Tecnología |
| --- | --- |
| Frontend | HTML / CSS / JavaScript |
| Diseño | Responsive / Mobile-first |
| Hosting | GitHub Pages |
| DNS / CDN | Cloudflare |
| Backend | Google Apps Script |
| API | Google Apps Script Web App |
| Persistencia | Google Sheets |
| Email | Google Apps Script |
| Analytics | Google Analytics 4 |
| Control de versiones | Git |

---

# Estado

**Proyecto activo**

**Versión actual: 1.1**

La versión 1.0 se encuentra cerrada y publicada.

El desarrollo continúa con mejoras progresivas del frontend, contenido y experiencia de usuario.

---

# Autor

Proyecto oficial de **Incancelables**.

https://incancelables.com.ar