# INCANCELABLES — SCALING ROADMAP

## Capacidad actual y estrategia de evolución

**Última actualización:** 2026-07-27

# 1. Arquitectura actual

USUARIO
   ↓
Cloudflare
   ↓
GitHub Pages
   ↓
Frontend HTML/CSS/JS
   ↓
Google Apps Script Web App
   ↓
Google Sheets
   ↓
Google Mail Service
Componentes:

| **Componente** | **Tecnología actual** |
| --- | --- |
| Hosting frontend | GitHub Pages |
| CDN / DNS | Cloudflare |
| Backend API | Google Apps Script |
| Base de datos | Google Sheets |
| Email | Apps Script Mail |
| Analytics | Google Analytics 4 |

# 2. Estado actual (v1.0)

## Capacidad esperada actual

## Frontend

### Tecnología:

GitHub Pages + Cloudflare
### Soporta cómodamente:

| **Métrica** | **Capacidad esperada** |
| --- | --- |
| Visitas diarias | 10.000+ |
| Usuarios simultáneos | cientos |
| Archivos estáticos | miles |
| Imágenes optimizadas | miles |

### Estado:

✅ Sin necesidad de migración.

# 3. Usuarios de comunidad

Actualmente:
Google Sheets
        ↓
Comunidad
## Nivel actual recomendado

| **Usuarios activos** | **Estado** |
| --- | --- |
| 0 - 5.000 | Óptimo |
| 5.000 - 10.000 | Correcto |
| 10.000 - 25.000 | Requiere optimización |
| 25.000+ | Evaluar migración |

# Primer punto de alerta

Cuando la hoja Comunidad supere:
10.000 registros
Revisar:
- tiempos de búsqueda.
- cantidad de lecturas.
- escrituras simultáneas.
- tiempos de respuesta API.

# 4. Backend Google Apps Script

## Operaciones actuales

Consume backend:
- Registro comunidad.
- Confirmación email.
- Contacto.
- Unsubscribe.
- Re-suscripción.

## Capacidad aproximada

| **Operaciones API** | **Estado** |
| --- | --- |
| 0 - 1.000 / día | Normal |
| 1.000 - 5.000 / día | Observar |
| 5.000 - 10.000 / día | Optimizar |
| 10.000+ / día | Evaluar migración |

# Indicadores críticos

No mirar solamente cantidad.
Mirar:
## Tiempo de respuesta API

| **Tiempo** | **Estado** |
| --- | --- |
| < 2 segundos | Correcto |
| 2-5 segundos | Revisar |
| > 5 segundos | Optimizar |
| > 10 segundos | Migrar componente |

# 5. Google Sheets como base de datos

## Capacidad práctica

Aunque Sheets soporta mucho volumen, no es una base de datos.

## Comunidad

| **Registros** | **Acción** |
| --- | --- |
| 0-5.000 | Sin problema |
| 5.000-20.000 | Optimizar búsquedas |
| 20.000-50.000 | Evaluar migración |
| 50.000+ | Migrar |

## Migración recomendada

De:
Google Sheets
a:
PostgreSQL
o:
Supabase
o:
Firestore
# 6. Newsletter

Este es probablemente el primer límite real.
Actualmente:
Comunidad
      ↓
Apps Script
      ↓
Email individual

## Cantidad de destinatarios

| **Suscriptores** | **Estado** |
| --- | --- |
| 0-1.000 | Perfecto |
| 1.000-5.000 | Correcto |
| 5.000-10.000 | Optimizar |
| 10.000+ | Migrar sistema email |

# Migración newsletter

De:
Apps Script Mail
a:
Mailgun
o:
SendGrid
o:
Amazon SES
Ventajas:
- mayor volumen.
- estadísticas.
- rebotes.
- reputación.
- automatización.
# 7. Galerías fotográficas (v1.1)

## Sistema elegido

assets/galerias
        ↓
generador automático
        ↓
galerias.json
        ↓
frontend

## Capacidad

| **Fotos** | **Estado** |
| --- | --- |
| 0-1.000 | Correcto |
| 1.000-10.000 | Correcto con optimización |
| 10.000-50.000 | Evaluar CDN |
| 50.000+ | Migrar almacenamiento |

# Migración futura imágenes

De:
GitHub Pages
a:
Cloudflare R2
o:
Amazon S3
manteniendo:
Frontend
    ↓
CDN imágenes

# 8. Tráfico web

## Usuarios mensuales

| **Usuarios/mes** | **Estado** |
| --- | --- |
| 0-10.000 | Arquitectura actual |
| 10.000-100.000 | Correcto |
| 100.000-500.000 | Optimizar CDN |
| 500.000+ | Evaluar arquitectura avanzada |

# 9. Punto de migración global

La arquitectura actual debería mantenerse hasta aproximadamente:
## Escenario cómodo

10.000 usuarios registrados
+
50.000 visitas mensuales

## Primera migración probable

No sería todo el sistema.
Sería por componentes:
### Paso 1

Mantener:
GitHub Pages
Cloudflare
Frontend
Migrar:
Google Sheets
        ↓
Base de datos real

### Paso 2

Migrar:
Apps Script
        ↓
API propia
Ejemplo:
Cloud Run
Node.js
Python

### Paso 3

Migrar email:
Apps Script Mail
        ↓
Proveedor email profesional

# Roadmap resumido

| **Fase** | **Usuarios** | **Acción** |
| --- | --- | --- |
| Actual | 0-5.000 | Mantener arquitectura |
| Crecimiento | 5.000-10.000 | Medir rendimiento |
| Escala media | 10.000-25.000 | Optimizar Sheets/API |
| Escala alta | 25.000-50.000 | Migrar base de datos |
| Profesional | 50.000+ | API propia + servicios especializados |

# Parámetros que debemos monitorear desde ahora

Crear una métrica mensual:
## Web

- Usuarios GA4.
- Sesiones.
- Picos diarios.
- Tiempo de carga.
## Backend

- Tiempo API.
- Errores.
- Ejecuciones Apps Script.
## Comunidad

- Total usuarios.
- Activos.
- Bajas.
- Pendientes.
## Newsletter

- Destinatarios.
- Tiempo de envío.
- Errores.