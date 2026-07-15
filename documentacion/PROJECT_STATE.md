# INCANCELABLES - PROJECT STATE

Última actualización: 2026-07-13


# Objetivo del Proyecto

Sitio web oficial de la banda Incancelables.

Canales principales:

- Sitio web
- Newsletter
- Canal de WhatsApp

Sin dependencia de redes sociales tradicionales.


# Arquitectura General

## Frontend

- HTML
- CSS
- JavaScript ES Modules


## Backend

- Google Apps Script (Web App)


## Persistencia

- Google Sheets


# Hojas Utilizadas

## Comunidad

Suscriptores confirmados.


## Pendientes

Suscripciones pendientes de confirmación por email.


## Mensajes

Mensajes enviados desde el formulario de contacto.


## Campañas

Historial de newsletters enviados.


# Estado Actual


## Sistema de Contacto

Implementado.

Funcionalidades:

- Validación de datos.
- Sanitización.
- Honeypot anti-spam.
- Registro en Google Sheets.
- Notificación por email al administrador.

Estado:

COMPLETADO


---

## Sistema de Comunidad

Implementado.

Funcionalidades:

- Registro de usuarios.
- Verificación por email.
- Tokens de confirmación.
- Control de expiración.
- Prevención de duplicados.
- Reenvío controlado por cooldown.

Estado:

COMPLETADO


---

## Sistema de Confirmación

Implementado.

Flujo:

1. Usuario se registra.
2. Registro almacenado en Pendientes.
3. Se genera token.
4. Se envía email de validación.
5. Usuario confirma.
6. Registro pasa a Comunidad.

Estado:

COMPLETADO


---

## Sistema de Unsubscribe

Implementado.

Flujo:

1. Usuario recibe enlace de baja.
2. Accede mediante TOKEN_BAJA.
3. Registro permanece en Comunidad.
4. ESTADO cambia a BAJA.
5. Se registra FECHA_BAJA.

Estado:

COMPLETADO


---

## Re-suscripción

Implementado.

Comportamiento:

Un usuario con ESTADO=BAJA puede volver a suscribirse.

Proceso:

- Requiere nueva confirmación por email.
- Reactiva el registro existente.
- ESTADO pasa a ACTIVO.
- Se genera nuevo TOKEN_BAJA.
- Se actualizan NOMBRE y CIUDAD.
- FECHA_BAJA histórica se conserva.

Estado:

COMPLETADO


---

# Sistema Newsletter

Implementado Backend v1.

Funcionalidades:

- Obtención de suscriptores activos.
- Envío masivo de emails.
- Envío HTML.
- Inclusión automática de enlace unsubscribe.
- Registro histórico de campañas.

Funciones principales:

- getSuscriptoresActivos()
- sendNewsletterToSubscriber()
- sendNewsletter()
- guardarCampania()

Estado:

COMPLETADO


---

# Hoja Campañas

Implementada.

Columnas:

- ID
- FECHA
- ASUNTO
- CONTENIDO
- DESTINATARIOS
- ENVIADOS
- ESTADO


Estados posibles:

- ENVIADA
- PARCIAL
- ERROR


---

# Decisiones Técnicas Importantes


## ESTADO = BAJA

No implica eliminación del contacto.

Significa únicamente:

"Desuscripto del newsletter."


## Conservación de Historial

No se eliminan registros de Comunidad.

Las bajas se registran mediante:

- ESTADO
- FECHA_BAJA


## Tokens

Cada suscriptor activo posee:

- TOKEN_BAJA


Los registros pendientes poseen:

- TOKEN
- EXPIRACION


---

# Roadmap


## Versión 1.0

Estado:

EN PROCESO AVANZADO


Incluye:

- Sitio Web.
- Comunidad.
- Validación por email.
- Confirmación por token.
- Unsubscribe.
- Re-suscripción.
- Newsletter Backend v1.


Pendiente:

- Diseño visual de emails.
- Templates responsive.
- Logo.
- Imágenes.
- Mejoras UX.


---

## Versión 1.1

Pendiente:

- Galerías fotográficas de shows históricos.


---

## Versión 1.2

Pendiente:

- Refactor general.
- Auditoría SEO.
- Revisión CSS.
- Mejoras UX.


---

# Próximo Paso Recomendado

Finalizar Newsletter frontend/email:

- Diseño responsive mobile first.
- Plantillas HTML.
- Inclusión de logo.
- Soporte para imágenes.
- Mensajes visuales de confirmación.

Luego continuar con mejoras generales del sitio.