# INCANCELABLES BACKEND DOCUMENTATION

Última actualización: 2026-07-13


# Tecnología

Backend implementado mediante Google Apps Script desplegado como Web App.

Persistencia mediante Google Sheets.


# Estructura de Archivos

- config.gs
- api.gs
- sheet.gs
- mail.gs
- validator.gs
- utils.gs
- useragent.gs


# Flujo General

Frontend
↓
doPost()
↓
Validación
↓
Persistencia
↓
Respuesta JSON


# Endpoints


## POST


### tipo=contacto

Responsabilidades:

- Validar datos.
- Sanitizar.
- Guardar mensaje.
- Notificar administrador.

Destino:

Hoja Mensajes


---

### tipo=comunidad

Responsabilidades:

- Validar datos.
- Verificar duplicados.
- Verificar estado de suscripción.
- Gestionar Pendientes.
- Enviar email de validación.

Destino:

Hoja Pendientes


---

## GET


### action=confirm

Responsabilidades:

- Validar token.
- Confirmar suscripción.
- Mover registro a Comunidad.

Función principal:

confirmarPendiente()


---

### action=unsubscribe

Responsabilidades:

- Validar TOKEN_BAJA.
- Cambiar ESTADO.
- Registrar FECHA_BAJA.

Función principal:

darDeBajaPorToken()


# Newsletter


## Objetivo

Enviar comunicaciones a usuarios suscriptos.

Ejemplos:

- Nuevos shows.
- Nuevas canciones.
- Nuevos videos.
- Nuevas funcionalidades.


## Flujo

1. Obtener suscriptores activos.
2. Crear contenido HTML.
3. Enviar emails individuales.
4. Agregar enlace unsubscribe.
5. Registrar campaña.


## Funciones principales


### getSuscriptoresActivos()

Obtiene registros de Comunidad con:

ESTADO = ACTIVO


---

### sendNewsletterToSubscriber()

Envía un newsletter individual.

Incluye:

- Email destino.
- Contenido HTML.
- Enlace de baja.


---

### sendNewsletter()

Controla el envío masivo.

Registra:

- Cantidad destinatarios.
- Cantidad enviados.
- Estado final.


---

### guardarCampania()

Guarda historial de campañas.


# Hojas


## Comunidad

Columnas:

ID
FECHA
FECHA_CONFIRMACION
NOMBRE
EMAIL
CIUDAD
BROWSER
BROWSER VER
OS
DEVICE
LANGUAGE
TIMEZONE
SCREEN
VIEWPORT
USERAGENTRAW
ESTADO
FECHA_BAJA
TOKEN_BAJA
IP


## Pendientes

Columnas:

ID
FECHA
NOMBRE
EMAIL
CIUDAD
BROWSER
BROWSER VER
OS
DEVICE
LANGUAGE
TIMEZONE
SCREEN
VIEWPORT
USERAGENTRAW
IP
TOKEN
EXPIRACION
ULTIMO_ENVIO_EMAIL
INTENTOS_CONFIRMACION


## Mensajes

Columnas:

ID
FECHA
NOMBRE
EMAIL
MENSAJE
BROWSER
BROWSER VER
OS
DEVICE
LANGUAGE
TIMEZONE
SCREEN
VIEWPORT
USERAGENT
IP


## Campañas

Columnas:

ID
FECHA
ASUNTO
CONTENIDO
DESTINATARIOS
ENVIADOS
ESTADO


# Reglas de Negocio


## Email activo

Un email se considera activo cuando:

ESTADO = ACTIVO


## Email dado de baja

Un email se considera dado de baja cuando:

ESTADO = BAJA


## Re-suscripción

Permitida.

Requiere nueva confirmación por email.


# Seguridad

Implementado:

- Validación de entrada.
- Sanitización.
- Honeypot.
- Tokens aleatorios.
- Expiración de tokens.
- Cooldown de reenvío.


# Historial de Cambios

2026-07

Implementado:

- Flujo Pendientes.
- Email de validación.
- Confirmación por token.
- Unsubscribe.
- Re-suscripción.
- Newsletter Backend v1.
- Registro histórico de campañas.