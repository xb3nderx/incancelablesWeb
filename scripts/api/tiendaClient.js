// =======================================================
// TIENDA CLIENT — Catálogo y creación de Pedido
// =======================================================
//
// Consume la API REST del e-commerce separado.
//
// MVP de v1.3: lectura del catálogo (GET /productos) y,
// desde el Bloque 3, creación del Pedido
// (POST /pedidos). Sin verificación de email, pagos ni
// cancelación.
//
// Misma forma de respuesta que forms.js:
// { ok, message, data }

async function obtenerCatalogo() {

    try {

        // Sin configuración (por ejemplo, si ENVIRONMENT
        // apunta a un PROD que todavía no existe).
        if (!TIENDA_API.URL) {

            return {

                ok: false,

                message: "La API de la tienda no está configurada en este entorno.",

                data: null

            };

        }

        const response = await fetch(
            `${TIENDA_API.URL}/productos`,
            {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                },
                signal: AbortSignal.timeout(TIENDA_API.TIMEOUT)
            }
        );

        if (!response.ok) {

            throw new Error(`HTTP ${response.status}`);

        }

        const productos = await response.json();

        if (!Array.isArray(productos)) {

            throw new Error("Respuesta inesperada de la API");

        }

        return {

            ok: true,

            message: "",

            data: productos

        };

    }
    catch (error) {

        return {

            ok: false,

            message: "No fue posible conectar con la tienda. Intentá nuevamente.",

            data: null

        };

    }

}

// =======================================================
// CREAR PEDIDO — POST /api/pedidos (Bloque 3 · paso 1)
// =======================================================
//
// Contrato real auditado del backend:
//
//   POST ${TIENDA_API.URL}/pedidos
//   headers: Accept + Content-Type application/json
//   body: { email, nombre, apellido, items[] }
//          donde cada item es
//          { producto_id, cantidad, precio_unitario }
//
//   201 { resultado: "creado", pedido: { id, estado } }
//   200 { resultado: "correccion", carrito_corregido,
//         disponibilidad, motivos }
//   400 { error }  (errores estructurales del request)
//   404 / 405 / 500 { error }
//
// Envelope { ok, message, data }:
//
//   ok: true  => la API respondió conforme al contrato.
//                El resultado concreto está en
//                data.resultado ("creado" | "correccion"):
//                ambos son salidas válidas del endpoint,
//                sólo "creado" deja un Pedido creado.
//   ok: false => el backend respondió con error, la
//                respuesta no corresponde al contrato o
//                falló la conexión. message es apto para
//                mostrarle al usuario.
//
//   data => cuerpo JSON de la respuesta, o null si no
//           hubo cuerpo (fallos de conexión/timeout).
//
// No aplica carrito_corregido ni ejecuta ningún flujo
// posterior: eso corresponde a pasos siguientes.

async function crearPedido(datos) {

    try {

        // Sin configuración (por ejemplo, si ENVIRONMENT
        // apunta a un PROD que todavía no existe).
        if (!TIENDA_API.URL) {

            return {

                ok: false,

                message: "La API de la tienda no está configurada en este entorno.",

                data: null

            };

        }

        const response = await fetch(
            `${TIENDA_API.URL}/pedidos`,
            {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datos),
                signal: AbortSignal.timeout(TIENDA_API.TIMEOUT)
            }
        );

        const cuerpo = await response.json().catch(() => null);

        // --------------------------------------------------
        // Contrato cumplido: 201 "creado" / 200 "correccion"
        // --------------------------------------------------

        if (response.ok && cuerpo && typeof cuerpo.resultado === "string") {

            if (
                response.status === 201 &&
                cuerpo.resultado === "creado"
            ) {

                return {

                    ok: true,

                    message: "",

                    data: cuerpo

                };

            }

            if (
                response.status === 200 &&
                cuerpo.resultado === "correccion"
            ) {

                return {

                    ok: true,

                    message: "",

                    data: cuerpo

                };

            }

        }

        // --------------------------------------------------
        // Errores del backend: 400 y demás { error }
        // --------------------------------------------------

        if (
            cuerpo &&
            typeof cuerpo.error === "string" &&
            cuerpo.error !== ""
        ) {

            return {

                ok: false,

                message: cuerpo.error,

                data: cuerpo

            };

        }

        // --------------------------------------------------
        // HTTP error sin cuerpo JSON (p. ej. un 502 en HTML)
        // --------------------------------------------------

        if (!response.ok) {

            return {

                ok: false,

                message: `HTTP ${response.status}`,

                data: cuerpo

            };

        }

        // --------------------------------------------------
        // 2xx con un cuerpo que no corresponde al contrato
        // --------------------------------------------------

        return {

            ok: false,

            message: "Respuesta inesperada de la API",

            data: cuerpo

        };

    }
    catch (error) {

        // Timeout del AbortSignal: el backend no respondió
        // dentro de TIENDA_API.TIMEOUT.
        if (
            error &&
            (error.name === "TimeoutError" || error.name === "AbortError")
        ) {

            return {

                ok: false,

                message: "La tienda tardó en responder. Intentá nuevamente.",

                data: null

            };

        }

        return {

            ok: false,

            message: "No fue posible conectar con la tienda. Intentá nuevamente.",

            data: null

        };

    }

}
