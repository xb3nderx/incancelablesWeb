// =======================================================
// TIENDA CLIENT — Catálogo
// =======================================================
//
// Consume la API REST del e-commerce separado.
//
// MVP de v1.3: únicamente lectura del catálogo.
// Sin carrito, checkout ni pagos.
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
