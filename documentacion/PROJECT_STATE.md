# ESTADO DEL PROYECTO — CHECKPOINT v1.2.1

`PROJECT_STATE.md` es el **estado oficial y actualizado del proyecto INCANCELABLES WEB**, con checkpoint en **v1.2.1**.

Este documento es público y puede subirse al repositorio GitHub. No contiene credenciales, tokens, secretos, IDs privados ni información sensible de infraestructura.

---

# ESTADO REAL CONFIRMADO

El proyecto tiene completadas las siguientes etapas:

- v1.0 — Lanzamiento oficial
- v1.1 — Galerías de fotografías
- v1.2 — Visor avanzado de fotografías
- v1.2.1 — Protección del paneo durante pinch

La versión actual del código es:

**v1.2.1**

Commit:

`ef6d7d8`

Mensaje:

`Visor de fotos v1.2.1 - proteger paneo durante pinch`

El commit `ef6d7d8` está contenido en:

- `dev`
- `master`

La comprobación Git realizada fue:

`git merge-base --is-ancestor ef6d7d8 master`

con resultado verdadero.

---

# SEPARACIÓN DEV / PROD

La separación entre DEV y PROD es un diseño intencional del proyecto.

`apiConfig.js` utiliza un parámetro de entorno:

- DEV → `ENVIRONMENT: "DEV"`
- PROD → `ENVIRONMENT: "PROD"`

El código selecciona automáticamente la API correspondiente según ese parámetro.

Existe además una excepción en el proceso de merge para preservar esta diferencia entre DEV y PROD.

Este mecanismo:

- funciona correctamente;
- es intencional;
- no debe considerarse un problema;
- no requiere cambios.

Los detalles operativos y de infraestructura permanecen en la documentación privada almacenada fuera del repositorio público.

---

# HISTORIAL DE VERSIONES

## v1.0 — Lanzamiento oficial

ESTADO: **COMPLETADO**

Principales elementos incorporados:

- sitio web oficial;
- frontend responsive;
- arquitectura frontend Vanilla HTML/CSS/JavaScript;
- backend Google Apps Script;
- persistencia mediante Google Sheets;
- formularios de contacto;
- comunidad/newsletter;
- doble opt-in;
- gestión de tokens;
- confirmación y baja;
- sistema de campañas;
- separación DEV/PROD;
- integración de Google Analytics 4;
- SEO y metadatos base;
- sitemap;
- robots.txt;
- dominio personalizado;
- Cloudflare;
- GitHub Pages;
- página 404 personalizada.

v1.0 constituye la base estable del proyecto.

---

## v1.1 — Galerías de fotografías

ESTADO: **COMPLETADO**

Se incorporaron:

- galerías históricas de shows;
- botón "Ver fotos";
- visor/modal responsive;
- separación entre flyers y fotografías;
- estructura de galerías por show;
- datos de galerías desacoplados del HTML;
- generación automática de datos de galerías;
- integración de las galerías con los shows históricos.

---

## v1.2 — Visor avanzado de fotografías

ESTADO: **COMPLETADO**

Se incorporó un visor individual de fotografías con:

- apertura individual de fotografías;
- zoom mediante rueda del mouse;
- zoom táctil mediante pinch;
- paneo;
- límites de desplazamiento;
- zoom centrado en el punto de interacción;
- zoom progresivo;
- escala mínima y máxima;
- cursor dinámico;
- restauración de posición de scroll;
- reset del estado al abrir una nueva fotografía;
- uso de Pointer Events.

La arquitectura del visor utiliza un estado centralizado para escala y desplazamiento.

La funcionalidad fue validada mediante pruebas automatizadas.

---

## v1.2.1 — Protección del paneo durante pinch

ESTADO: **COMPLETADO**

Commit:

`ef6d7d8`

Objetivo:

Evitar que un tercer puntero inicie accidentalmente el paneo mientras existe un gesto de pinch activo.

La implementación fue validada con:

**29/29 pruebas PASS**

v1.2.1 constituye el último checkpoint funcional confirmado del proyecto.

---

# ESTADO ACTUAL

## VERSIÓN PRODUCTIVA

**v1.2.1 — estable en `master`**

`master` es la rama productiva y contiene la versión estable **v1.2.1**.

Todas las funcionalidades previstas hasta v1.2.1 se consideran terminadas y validadas.

No existen tareas funcionales pendientes correspondientes a v1.0, v1.1, v1.2 o v1.2.1.

## DESARROLLO EN CURSO

**v1.3 — E-Commerce (proyecto académico) en `dev`**

v1.3 se desarrolla en la rama `dev` como parte de un trabajo académico sobre e-commerce.

El alcance definitivo se determinará a partir de los requisitos de dicho trabajo.

### Despliegue a PROD

El e-commerce **no se desplegará a PROD por ahora**: no habrá ventas ni cobros reales.

## AUDITORÍA TÉCNICA INTEGRAL

**POSTERGADA**

La auditoría técnica integral, originalmente prevista como v1.3, queda postergada. Según el roadmap vigente pasa a **v1.5**, después de la etapa de e-commerce (v1.3) y de estabilización y migración (v1.4).

Estas tareas todavía no deben considerarse realizadas.

---

# PRÓXIMOS OBJETIVOS

## v1.3 — E-commerce e infraestructura

ESTADO: **EN DESARROLLO EN `dev`**

Etapa en curso, desarrollada como proyecto académico. El alcance se define a partir de los requisitos del trabajo académico y podrá incluir catálogo, detalle de producto, carrito, gestión de pedidos, base de datos y API propia (ver `documentacion/ROADMAP.md`).

El e-commerce no se desplegará a PROD por ahora: no habrá ventas ni cobros reales.

## v1.4 — Estabilización y migración

ESTADO: **PENDIENTE**

Estabilización de la arquitectura una vez implementado el nuevo backend/API y, si corresponde, migración de las funcionalidades que hoy dependen de Google Apps Script y Google Sheets.

## v1.5 — Auditoría técnica integral

ESTADO: **POSTERGADA**

El alcance previsto comprende:

- SEO avanzado;
- Performance;
- Core Web Vitals;
- Accesibilidad;
- Lighthouse;
- optimización de assets;
- limpieza CSS;
- consolidación de código.

Estas tareas todavía no deben considerarse realizadas.

La auditoría deberá realizarse sobre la arquitectura ya evolucionada y estabilizada, y no debe reabrir funcionalidades ya cerradas salvo que aparezca evidencia concreta de un problema.

---

# FUTURAS VERSIONES

Las siguientes etapas pertenecen al roadmap futuro y quedan fuera del alcance actual. Parte de los conceptos de comercio podrá avanzar de forma acotada durante la etapa académica v1.3; el alcance completo de v2.x queda a definir:

## v2.0 — Plataforma de comercio y gestión de eventos

Concepto general:

Evolucionar progresivamente el sitio hacia una plataforma de gestión de comercio, entradas, merchandising y audiencia.

### v2.1 — Core de comercio electrónico

- clientes;
- productos;
- pedidos;
- pagos;
- Mercado Pago.

### v2.2 — Verificación de email reutilizable

Sistema reutilizable de verificación de correo electrónico.

### v2.3 — Venta de entradas

- entradas digitales;
- QR;
- envío por email.

### v2.4 — Check-in y control de acceso

- lectura de QR;
- control de acceso;
- registro de asistencia.

### v2.5 — Merchandising

- catálogo;
- stock;
- pedidos;
- logística/envíos.

### v2.6 — CRM y analítica de audiencia

- gestión de audiencia;
- segmentación;
- analítica;
- evolución de la comunidad.

Estas funcionalidades son FUTURAS y no forman parte del trabajo actual.

---

# ARQUITECTURA ACTUAL

## Frontend

Tecnologías principales:

- HTML;
- CSS;
- JavaScript Vanilla.

El proyecto NO utiliza:

- React;
- Vue;
- Angular;
- Vite.

La arquitectura frontend está orientada a un sitio estático, responsive y modular, con datos desacoplados de las páginas HTML.

---

## Backend

El backend utiliza:

- Google Apps Script;
- Google Sheets;
- API mediante Web App;
- sistema de emails;
- configuración separada DEV/PROD.

La documentación detallada del backend y los procedimientos operativos sensibles se mantienen en documentación privada fuera del repositorio público.

---

## Hosting

El frontend se publica mediante:

- GitHub Pages;
- dominio personalizado;
- Cloudflare.

---

## Analytics

Google Analytics 4 está integrado de forma centralizada y se utiliza únicamente en producción.

La implementación se encuentra centralizada en:

`scripts/analytics.js`

Eventos principales implementados:

- `contact_form_submitted`
- `community_signup_requested`
- `community_signup_confirmed`

---

# DATOS Y CONTENIDOS

Los datos principales del sitio se encuentran desacoplados de las páginas HTML.

Entre ellos:

- discografía;
- shows;
- galerías.

Archivos principales:

- `scripts/data/discografia.js`
- `scripts/data/showsListado.js`
- `scripts/data/galerias.js`

Las galerías utilizan una estructura organizada por show.

---

# VISOR DE FOTOGRAFÍAS

El visor avanzado implementado durante v1.2/v1.2.1 utiliza:

- zoom;
- paneo;
- pinch;
- límites de movimiento;
- Pointer Events;
- estado centralizado de transformación.

La funcionalidad está considerada cerrada para el checkpoint v1.2.1.

---

# CONTROL DE VERSIONES

El desarrollo utiliza ramas separadas:

- `dev`
- `master`

El flujo DEV/PROD preserva deliberadamente las diferencias de configuración necesarias entre ambos entornos.

El estado del código se controla mediante Git.

IMPORTANTE:

El hecho de que un commit exista en Git no implica por sí mismo que una versión determinada esté actualmente publicada en producción.

Los estados de:

- Git;
- GitHub Pages;
- backend Apps Script;
- documentación

deben considerarse independientes.

---

# DOCUMENTACIÓN

La documentación pública del proyecto se mantiene dentro del repositorio cuando no contiene información sensible.

La documentación operativa o de infraestructura que pueda exponer información sensible se mantiene fuera del repositorio público.

Entre ella se encuentran los documentos privados relacionados con:

- backend;
- configuración operativa;
- backup;
- recuperación;
- infraestructura.

---

# CHECKPOINT

## Último checkpoint funcional confirmado

**v1.2.1**

## Commit

`ef6d7d8`

## Estado

**COMPLETADO**

## Próximo checkpoint

**v1.3 — E-commerce e infraestructura** (en desarrollo en `dev`, proyecto académico)

## Estado de v1.3

**EN DESARROLLO**

## Auditoría técnica integral

**POSTERGADA — v1.5**

---

# REGLA PARA FUTURAS ACTUALIZACIONES

Este documento debe actualizarse cuando se cierre una nueva versión significativa del proyecto.

No utilizar este documento para registrar cada cambio menor.

El objetivo de `PROJECT_STATE.md` es permitir identificar rápidamente:

1. dónde está el proyecto;
2. qué versiones están terminadas;
3. cuál es el próximo objetivo;
4. qué funcionalidades pertenecen al futuro;
5. cuál es la arquitectura general vigente.

---

# FIN DEL CHECKPOINT v1.2.1