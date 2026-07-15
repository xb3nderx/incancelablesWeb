# CHANGELOG


## 2026-07-13

### Newsletter Backend v1

Implementado sistema inicial de newsletter.


Agregado:

- Obtención de suscriptores activos.
- Envío de newsletters HTML.
- Inclusión automática de enlace unsubscribe.
- Registro histórico de campañas.


Nueva hoja:

Campañas


Columnas:

- ID
- FECHA
- ASUNTO
- CONTENIDO
- DESTINATARIOS
- ENVIADOS
- ESTADO



---

## Estado Base Documentado

Se crea la documentación formal del proyecto:

- PROJECT_STATE.md
- BACKEND_DOCUMENTATION.md
- CHANGELOG.md


Estos documentos pasan a ser la referencia oficial para futuros checkpoints.



---

## Sistema de Comunidad

Implementado:

- Registro de usuarios.
- Validación de datos.
- Normalización de información.
- Prevención de duplicados.
- Persistencia en Google Sheets.



---

## Sistema Pendientes

Implementado:

- Hoja Pendientes.
- Generación de token de confirmación.
- Expiración de token.
- Cooldown para reenvío de emails.
- Control de intentos.



---

## Confirmación por Email

Implementado:

- Envío de email de validación.
- Endpoint GET action=confirm.
- Función confirmarPendiente().
- Movimiento de registros desde Pendientes a Comunidad.


Decisiones:

- Se conserva ID original.
- Se conserva FECHA original.
- Se registra FECHA_CONFIRMACION.



---

## Refactor de Comunidad

Implementado:

- Uso de constantes CONFIG para columnas.
- Centralización de índices.
- Mejora de validaciones de email.



---

## Sistema Unsubscribe

Implementado:

- Endpoint GET action=unsubscribe.
- Función darDeBajaPorToken().
- Generación de TOKEN_BAJA.
- Registro de FECHA_BAJA.


Decisiones:

- ESTADO=BAJA no elimina contactos.
- El registro permanece en Comunidad.



---

## Re-suscripción

Implementado.


Decisiones:

- Permitida la re-suscripción.
- Requiere nueva confirmación por email.
- Reactiva registro existente.
- Actualiza NOMBRE y CIUDAD.
- Genera nuevo TOKEN_BAJA.
- Conserva FECHA_BAJA histórica.