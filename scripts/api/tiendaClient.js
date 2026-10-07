// =======================================================
// TIENDA CLIENT — Catálogo y creación de Pedido
// =======================================================
//
// Consume la API REST del e-commerce separado.
//
// MVP de v1.3: lectura del catálogo (GET /productos) y,
// desde el Bloque 3, creación del Pedido
// (POST /pedidos). Desde el Bloque 4, validación del token
// de verificación de email del checkout
// (POST /email-verificaciones/validar) y recuperación de los
// Pedidos verificados (POST /email-verificaciones/pedidos);
// desde el Bloque 5, inicio del pago del Pedido
// (POST /pedidos/{id}/pago) y reemplazo del Pedido activo
// (POST /email-verificaciones/pedidos/reemplazo).
// Sin reenvío de email.
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

// =======================================================
// VALIDAR TOKEN DE CHECKOUT — POST /email-verificaciones/validar
// =======================================================
//
// Contrato real auditado del backend (Bloque 4):
//
//   POST ${TIENDA_API.URL}/email-verificaciones/validar
//   headers: Accept + Content-Type application/json
//   body: { token }
//
//   200 { resultado: "confirmado", email_verificacion_id,
//         pedidos: [ { id, estado } ] }
//        Idempotente: un token ya confirmado vuelve a
//        responder "confirmado", con pedidos [] o con uno o
//        más pedidos.
//   400 { error }  ("token_invalido" | "token_expirado" |
//                    errores de validación del body/token)
//   404 / 405 / 500 { error }
//
// Envelope { ok, message, data, codigo }:
//
//   ok: true  => 200 y data.resultado === "confirmado".
//                data => cuerpo plano de la respuesta
//                { resultado, email_verificacion_id,
//                  pedidos }.
//   ok: false => el backend respondió con error, la
//                respuesta no corresponde al contrato o
//                falló la conexión.
//   codigo     => código crudo del backend cuando existe
//                (p. ej. "token_invalido", "token_expirado");
//                null si no hay código identificable
//                (timeout, sin conexión, etc.).
//                Permite al llamador distinguir los errores
//                reales del backend de los fallos de red.
//   data       => cuerpo JSON crudo de la respuesta, o null
//                si no hubo cuerpo.
//
// No implementa reenvío de email.

async function validarTokenCheckout(token) {

    try {

        // Sin configuración (por ejemplo, si ENVIRONMENT
        // apunta a un PROD que todavía no existe).
        if (!TIENDA_API.URL) {

            return {

                ok: false,

                message: "La API de la tienda no está configurada en este entorno.",

                data: null,

                codigo: null

            };

        }

        const response = await fetch(
            `${TIENDA_API.URL}/email-verificaciones/validar`,
            {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ token }),
                signal: AbortSignal.timeout(TIENDA_API.TIMEOUT)
            }
        );

        const cuerpo = await response.json().catch(() => null);

        // --------------------------------------------------
        // 200 - token confirmado (idempotente)
        // --------------------------------------------------

        if (response.ok && cuerpo && typeof cuerpo === "object") {

            if (cuerpo.resultado === "confirmado") {

                return {

                    ok: true,

                    message: "",

                    data: cuerpo,

                    codigo: null

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

                data: cuerpo,

                codigo: cuerpo.error

            };

        }

        // --------------------------------------------------
        // HTTP error sin cuerpo JSON (p. ej. un 502 en HTML)
        // --------------------------------------------------

        if (!response.ok) {

            return {

                ok: false,

                message: `HTTP ${response.status}`,

                data: cuerpo,

                codigo: null

            };

        }

        // --------------------------------------------------
        // 2xx con un cuerpo que no corresponde al contrato
        // --------------------------------------------------

        return {

            ok: false,

            message: "Respuesta inesperada de la API",

            data: cuerpo,

            codigo: null

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

                data: null,

                codigo: null

            };

        }

        return {

            ok: false,

            message: "No fue posible conectar con la tienda. Intentá nuevamente.",

            data: null,

            codigo: null

        };

    }

}

// =======================================================
// PEDIDOS VERIFICADOS — POST /email-verificaciones/pedidos
// =======================================================
//
// Contrato real auditado del backend:
//
//   POST ${TIENDA_API.URL}/email-verificaciones/pedidos
//   headers: Accept + Content-Type application/json
//   body: { token }
//
//   200 { resultado: "ok", pedidos: [ {
//           id, estado,
//           items: [ { producto_id, cantidad,
//                      precio_unitario } ] } ] }
//        Endpoint de SÓLO LECTURA: devuelve los Pedidos
//        asociados al token de verificación de email, con
//        sus PedidoItem incluidos.
//   400 { error }  ("token_invalido" | "token_expirado" |
//                    "verificacion_pendiente" | errores de
//                    validación del body/token)
//   404 / 405 / 500 { error }
//
// Envelope { ok, message, data, codigo }:
//
//   ok: true  => 200 y data.resultado === "ok" con
//                data.pedidos un array. No implica que
//                haya un Pedido para pagar: eso lo decide
//                el llamador (estado "PEND_PAGO").
//   ok: false => el backend respondió con error, la
//                respuesta no corresponde al contrato o
//                falló la conexión. message es apto para
//                mostrarsele al usuario.
//   codigo     => código crudo del backend cuando existe
//                (p. ej. "token_invalido",
//                "verificacion_pendiente"); null si no hay
//                código identificable.
//   data       => cuerpo JSON crudo de la respuesta, o null
//                si no hubo cuerpo.
//
// No crea ni modifica Pedidos. Los items[] de cada Pedido
// son la fuente de verdad para continuar la compra: no se
// reconstruyen desde el carrito de sessionStorage.

async function obtenerPedidosVerificados(token) {

    try {

        // Sin configuración (por ejemplo, si ENVIRONMENT
        // apunta a un PROD que todavía no existe).
        if (!TIENDA_API.URL) {

            return {

                ok: false,

                message: "La API de la tienda no está configurada en este entorno.",

                data: null,

                codigo: null

            };

        }

        // Sin token no se arma la ruta: se evita un request
        // inválido al backend.
        if (
            token === null ||
            token === undefined ||
            token === ""
        ) {

            return {

                ok: false,

                message: "No pudimos identificar la verificación de tu email.",

                data: null,

                codigo: null

            };

        }

        const response = await fetch(
            `${TIENDA_API.URL}/email-verificaciones/pedidos`,
            {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ token }),
                signal: AbortSignal.timeout(TIENDA_API.TIMEOUT)
            }
        );

        const cuerpo = await response.json().catch(() => null);

        // --------------------------------------------------
        // 200 - token válido: pedidos con sus items
        // --------------------------------------------------

        if (
            response.ok &&
            cuerpo &&
            typeof cuerpo === "object" &&
            cuerpo.resultado === "ok" &&
            Array.isArray(cuerpo.pedidos)
        ) {

            return {

                ok: true,

                message: "",

                data: cuerpo,

                codigo: null

            };

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

                data: cuerpo,

                codigo: cuerpo.error

            };

        }

        // --------------------------------------------------
        // HTTP error sin cuerpo JSON (p. ej. un 502 en HTML)
        // --------------------------------------------------

        if (!response.ok) {

            return {

                ok: false,

                message: `HTTP ${response.status}`,

                data: cuerpo,

                codigo: null

            };

        }

        // --------------------------------------------------
        // 2xx con un cuerpo que no corresponde al contrato
        // --------------------------------------------------

        return {

            ok: false,

            message: "Respuesta inesperada de la API",

            data: cuerpo,

            codigo: null

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

                data: null,

                codigo: null

            };

        }

        return {

            ok: false,

            message: "No fue posible conectar con la tienda. Intentá nuevamente.",

            data: null,

            codigo: null

        };

    }

}

// =======================================================
// REEMPLAZAR PEDIDO — POST /email-verificaciones/pedidos/reemplazo
// =======================================================
//
// Contrato real auditado del backend:
//
//   POST ${TIENDA_API.URL}/email-verificaciones/pedidos/reemplazo
//   headers: Accept + Content-Type application/json
//   body: {
//     token,
//     items: [ { producto_id, cantidad, precio_unitario } ]
//   }
//
//   200 { resultado: "reemplazado",
//         pedido_anterior: { id, estado: "NO_PAGADO" },
//         pedido: { id, estado } }
//        El Pedido anterior pasa a NO_PAGADO y el nuevo hereda el
//        estado (PEND_PAGO). Los reemplazos encadenados
//        A -> B -> C... son comportamiento válido.
//   200 { resultado: "correccion", pedido: { id, estado },
//         carrito_corregido, disponibilidad, motivos, catalogo }
//        NO se crea un Pedido nuevo: hay que aplicar la corrección
//        al carrito y volver a intentar.
//   400 / 404 / 409 / 500 { error }
//        ("token_invalido" | "token_expirado" |
//         "verificacion_pendiente" | "pedido_no_activo" |
//         "varios_pedidos_activos" | "pedido_inexistente" |
//         "pedido_vencido" | "carrito_vacio" |
//         errores de validación del body/token)
//
// Envelope { ok, message, data, codigo }:
//
//   ok: true  => 200 y data.resultado vale "reemplazado" o
//                "correccion"; ambos son salidas válidas del
//                endpoint, sólo "reemplazado" deja un Pedido nuevo.
//   ok: false => el backend respondió con error, la respuesta no
//                corresponde al contrato o falló la conexión.
//   codigo     => código crudo del backend cuando existe; null si
//                no hay código identificable.
//   data       => cuerpo JSON crudo, o null si no hubo cuerpo.
//
// No aplica carrito_corregido ni inicia pagos: el llamador decide
// (misma separación que crearPedido()).

async function reemplazarPedido(token, items) {

    try {

        // Sin configuración (por ejemplo, si ENVIRONMENT
        // apunta a un PROD que todavía no existe).
        if (!TIENDA_API.URL) {

            return {

                ok: false,

                message: "La API de la tienda no está configurada en este entorno.",

                data: null,

                codigo: null

            };

        }

        // Sin token no se arma la ruta: se evita un request
        // inválido al backend.
        if (
            token === null ||
            token === undefined ||
            token === ""
        ) {

            return {

                ok: false,

                message: "No pudimos identificar la verificación de tu email.",

                data: null,

                codigo: null

            };

        }

        // Sin items no hay Pedido que reemplazar.
        if (
            !Array.isArray(items) ||
            items.length === 0
        ) {

            return {

                ok: false,

                message: "Tu carrito está vacío.",

                data: null,

                codigo: null

            };

        }

        const response = await fetch(
            `${TIENDA_API.URL}/email-verificaciones/pedidos/reemplazo`,
            {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ token, items }),
                signal: AbortSignal.timeout(TIENDA_API.TIMEOUT)
            }
        );

        const cuerpo = await response.json().catch(() => null);

        // --------------------------------------------------
        // 200 - salida válida: Pedido reemplazado o corrección
        // --------------------------------------------------

        if (
            response.ok &&
            cuerpo &&
            typeof cuerpo === "object" &&
            (
                cuerpo.resultado === "reemplazado" ||
                cuerpo.resultado === "correccion"
            )
        ) {

            return {

                ok: true,

                message: "",

                data: cuerpo,

                codigo: null

            };

        }

        // --------------------------------------------------
        // Errores del backend: 400 / 404 / 409 / 500 { error }
        // --------------------------------------------------

        if (
            cuerpo &&
            typeof cuerpo.error === "string" &&
            cuerpo.error !== ""
        ) {

            return {

                ok: false,

                message: cuerpo.error,

                data: cuerpo,

                codigo: cuerpo.error

            };

        }

        // --------------------------------------------------
        // HTTP error sin cuerpo JSON (p. ej. un 502 en HTML)
        // --------------------------------------------------

        if (!response.ok) {

            return {

                ok: false,

                message: `HTTP ${response.status}`,

                data: cuerpo,

                codigo: null

            };

        }

        // --------------------------------------------------
        // 200 con un cuerpo que no corresponde al contrato
        // --------------------------------------------------

        return {

            ok: false,

            message: "Respuesta inesperada de la API",

            data: cuerpo,

            codigo: null

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

                data: null,

                codigo: null

            };

        }

        return {

            ok: false,

            message: "No fue posible conectar con la tienda. Intentá nuevamente.",

            data: null,

            codigo: null

        };

    }

}

// =======================================================
// INICIAR PAGO — POST /pedidos/{id}/pago (Bloque 5 · MVP)
// =======================================================
//
// Contrato real auditado del backend:
//
//   POST ${TIENDA_API.URL}/pedidos/{id}/pago
//   headers: Accept + Content-Type application/json
//   body: {
//     accion: "iniciar_pago",
//     proveedor_id: "DUMMY",
//     items: [ { producto_id, cantidad, precio_unitario } ],
//     simulacion: "APROBADO" | "RECHAZADO"   (opcional)
//   }
//
//   200 { resultado: "aprobado",  pago, validacion, pedido }
//   200 { resultado: "rechazado", pedido, intentos,
//         maximo_intentos, pago, validacion }
//   200 { resultado: "correccion", carrito_corregido,
//         motivos, disponibilidad, catalogo, ... }
//   400 / 404 / 409 / 500 { error }
//        ("pedido_vencido" | "pedido_no_activo" |
//         "pedido_no_pendiente_de_pago" | "pago_ya_aprobado" |
//         "maximo_intentos_alcanzado" | "pedido_inexistente" |
//         errores de request/proveedor)
//
// Envelope { ok, message, data, codigo }:
//
//   ok: true  => 200 y data.resultado vale "aprobado",
//                "rechazado" o "correccion". NO significa
//                compra completada: eso sólo se cumple con
//                data.resultado === "aprobado" &&
//                data.pedido.estado === "PAGADO".
//   ok: false => el backend respondió con error, la
//                respuesta no corresponde al contrato o
//                falló la conexión.
//   codigo     => código crudo del backend cuando existe
//                (p. ej. "pedido_vencido"); null si no hay
//                código identificable (timeout, sin
//                conexión, etc.).
//   data       => cuerpo JSON crudo, o null si no hubo
//                cuerpo.
//
// El simulador MVP sólo admite "APROBADO" y "RECHAZADO";
// "EN_PROCESO" queda fuera del alcance.

async function iniciarPago(pedidoId, items, simulacion) {

    try {

        // Sin configuración (por ejemplo, si ENVIRONMENT
        // apunta a un PROD que todavía no existe).
        if (!TIENDA_API.URL) {

            return {

                ok: false,

                message: "La API de la tienda no está configurada en este entorno.",

                data: null,

                codigo: null

            };

        }

        // Sin identificador de Pedido no se arma la ruta:
        // se evita un request inválido al backend.
        if (
            pedidoId === null ||
            pedidoId === undefined ||
            pedidoId === ""
        ) {

            return {

                ok: false,

                message: "No pudimos identificar el pedido a pagar.",

                data: null,

                codigo: null

            };

        }

        const cuerpoRequest = {

            accion: "iniciar_pago",

            proveedor_id: "DUMMY",

            items: Array.isArray(items) ? items : []

        };

        if (
            typeof simulacion === "string" &&
            simulacion !== ""
        ) {

            cuerpoRequest.simulacion = simulacion;

        }

        const response = await fetch(
            `${TIENDA_API.URL}/pedidos/${pedidoId}/pago`,
            {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(cuerpoRequest),
                signal: AbortSignal.timeout(TIENDA_API.TIMEOUT)
            }
        );

        const cuerpo = await response.json().catch(() => null);

        // --------------------------------------------------
        // 200 - salida válida del simulador de pago
        // --------------------------------------------------

        if (
            response.ok &&
            cuerpo &&
            typeof cuerpo === "object" &&
            (
                cuerpo.resultado === "aprobado" ||
                cuerpo.resultado === "rechazado" ||
                cuerpo.resultado === "correccion"
            )
        ) {

            return {

                ok: true,

                message: "",

                data: cuerpo,

                codigo: null

            };

        }

        // --------------------------------------------------
        // Errores del backend: 400 / 404 / 409 / 500 { error }
        // --------------------------------------------------

        if (
            cuerpo &&
            typeof cuerpo.error === "string" &&
            cuerpo.error !== ""
        ) {

            return {

                ok: false,

                message: cuerpo.error,

                data: cuerpo,

                codigo: cuerpo.error

            };

        }

        // --------------------------------------------------
        // HTTP error sin cuerpo JSON (p. ej. un 502 en HTML)
        // --------------------------------------------------

        if (!response.ok) {

            return {

                ok: false,

                message: `HTTP ${response.status}`,

                data: cuerpo,

                codigo: null

            };

        }

        // --------------------------------------------------
        // 200 con un cuerpo que no corresponde al contrato
        // --------------------------------------------------

        return {

            ok: false,

            message: "Respuesta inesperada de la API",

            data: cuerpo,

            codigo: null

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

                data: null,

                codigo: null

            };

        }

        return {

            ok: false,

            message: "No fue posible conectar con la tienda. Intentá nuevamente.",

            data: null,

            codigo: null

        };

    }

}
