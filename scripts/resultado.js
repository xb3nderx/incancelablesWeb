// =====================================
// CARRITO (MÓDULO)
// =====================================
//
// resultado.js corre como módulo (igual que tienda.js) para
// reutilizar la infraestructura del carrito sin duplicar su
// persistencia en sessionStorage.

import {
    aplicarCorreccion,
    obtenerItemsParaPago,
    vaciarCarrito
} from "./carrito.js";


// =====================================
// PARÁMETROS URL
// =====================================

const params =
    new URLSearchParams(
        window.location.search
    );

const flow =
    params.get("flow");

const status =
    params.get("status");

const token =
    params.get("token");


// =====================================
// ELEMENTOS DOM
// =====================================

const titulo =
    document.getElementById(
        "titulo"
    );

const mensaje =
    document.getElementById(
        "mensaje"
    );

const acciones =
    document.getElementById(
        "acciones"
    );

const btnVolver =
    document.getElementById(
        "btnVolver"
    );


// =====================================
// HELPERS
// =====================================

/**
 * Crea un botón dinámicamente.
 *
 * @param {string} texto
 * @param {string} id
 * @returns {HTMLButtonElement}
 */
function crearBoton(
    texto,
    id
) {

    const button =
        document.createElement(
            "button"
        );

    button.textContent =
        texto;

    button.id =
        id;

    button.className =
        "btn";

    return button;

}


// =====================================
// MOSTRAR ESTADO
// =====================================

/**
 * Actualiza la interfaz según
 * el estado recibido.
 *
 * Se utiliza tanto para:
 *
 * - respuestas del backend
 * - parámetros status de URL
 *
 * @param {string} status
 * @param {string} [detalle] reemplaza al mensaje por
 * defecto del estado. Lo usan los estados de pago para
 * informar importe, referencia o intentos.
 */
function mostrarEstado(
    status,
    detalle
) {

    // Limpiar acciones dinámicas.
    acciones.innerHTML =
        "";

    // Mostrar nuevamente
    // el botón de volver.
    btnVolver.style.display =
        "";

    switch (status) {

        case "confirmado":

            document.title =
                "¡Suscripción confirmada!";

            titulo.textContent =
                "¡Suscripción confirmada!";

            mensaje.textContent =
                "Tu suscripción fue confirmada correctamente.";

            break;


        // --------------------------------
        // CHECKOUT (E-COMMERCE)
        // --------------------------------

        case "checkout_confirmado":

            document.title =
                "Email verificado";

            titulo.textContent =
                "Email verificado";

            mensaje.textContent =
                "Tu dirección de email fue verificada correctamente.";

            break;


        case "checkout_confirmado_con_pedido":

            document.title =
                "Email verificado";

            titulo.textContent =
                "Email verificado";

            mensaje.textContent =
                "Tu dirección de email fue verificada correctamente. Tu pedido quedó habilitado para continuar con el proceso de compra.";

            break;


        // --------------------------------
        // PAGO (E-COMMERCE)
        // --------------------------------

        case "pago_procesando":

            document.title =
                "Procesando tu pago";

            titulo.textContent =
                "Procesando tu pago";

            mensaje.textContent =
                "Estamos procesando tu pago. No cierres esta ventana.";

            // Mientras hay un request en vuelo no hay
            // acciones disponibles.
            btnVolver.style.display =
                "none";

            break;


        case "pago_aprobado":

            document.title =
                "Pago aprobado";

            titulo.textContent =
                "Pago aprobado";

            mensaje.textContent =
                detalle ||
                "Tu compra fue confirmada correctamente.";

            break;


        case "pago_rechazado":

            document.title =
                "Pago rechazado";

            titulo.textContent =
                "Pago rechazado";

            mensaje.textContent =
                detalle ||
                "Tu pago fue rechazado.";

            break;


        case "pago_revision":

            document.title =
                "Pago en revisión";

            titulo.textContent =
                "Pago en revisión";

            mensaje.textContent =
                "El pago fue registrado, pero la compra requiere revisión.";

            break;


        case "pago_correccion":

            document.title =
                "Tu carrito cambió";

            titulo.textContent =
                "Tu carrito cambió";

            mensaje.textContent =
                "El pago no se realizó: hubo cambios en tu carrito. Volvé a intentarlo con los productos actualizados.";

            break;


        case "pago_vencido":

            document.title =
                "Pedido vencido";

            titulo.textContent =
                "Pedido vencido";

            mensaje.textContent =
                "Este pedido ya no está disponible para pagar porque venció.";

            break;


        case "pago_maximo_intentos":

            document.title =
                "Intentos agotados";

            titulo.textContent =
                "Intentos agotados";

            mensaje.textContent =
                "Se alcanzó el máximo de intentos de pago de este pedido.";

            break;


        case "pago_ya_pagado":

            document.title =
                "Pedido ya pagado";

            titulo.textContent =
                "Este pedido ya está pagado";

            mensaje.textContent =
                "El pago de este pedido ya fue aprobado anteriormente.";

            break;


        case "pago_no_disponible":

            document.title =
                "Pedido no disponible";

            titulo.textContent =
                "Pedido no disponible";

            mensaje.textContent =
                "Este pedido no está disponible para pagar.";

            break;


        case "pago_sin_items":

            document.title =
                "Carrito vacío";

            titulo.textContent =
                "Tu carrito está vacío";

            mensaje.textContent =
                "No hay productos en tu carrito. Volvé a la tienda para agregar antes de pagar.";

            break;


        case "pago_error":

            document.title =
                "No pudimos procesar el pago";

            titulo.textContent =
                "No pudimos procesar el pago";

            mensaje.textContent =
                detalle ||
                "Ocurrió un error al procesar tu pago. Intentá nuevamente.";

            break;


        case "desuscripto":

            document.title =
                "Desuscripción realizada";

            titulo.textContent =
                "Desuscripción realizada";

            mensaje.textContent =
                "Ya no recibirás novedades de Incancelables.";

            break;


        case "ya_desuscripto":

            document.title =
                "Ya estabas desuscripto";

            titulo.textContent =
                "Ya estabas desuscripto";

            mensaje.textContent =
                "La dirección de email ya no recibía novedades.";

            break;


        case "token_invalido":

            document.title =
                "Enlace inválido";

            titulo.textContent =
                "Enlace inválido";

            mensaje.textContent =
                "El enlace utilizado no es válido o ya fue utilizado.";

            break;


        case "token_expirado":

            document.title =
                "Enlace expirado";

            titulo.textContent =
                "Enlace expirado";

            mensaje.textContent =
                "El enlace de confirmación ha expirado.";

            break;


        default:

            document.title =
                "Ocurrió un error";

            titulo.textContent =
                "Ocurrió un error";

            mensaje.textContent =
                "No pudimos procesar tu solicitud.";

    }

}


// =====================================
// PAGO (E-COMMERCE)
// =====================================

// El simulador MVP sólo admite APROBADO y RECHAZADO.
// EN_PROCESO queda fuera del alcance.
const SIMULACION_PAGO =
    "APROBADO";

const FORMATO_PAGO =
    new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });

// Códigos de error del backend => estado de la página.
const ESTADOS_DE_ERROR_DE_PAGO = {

    pedido_vencido: "pago_vencido",

    maximo_intentos_alcanzado: "pago_maximo_intentos",

    pago_ya_aprobado: "pago_ya_pagado",

    pedido_inexistente: "pago_no_disponible",

    pedido_no_activo: "pago_no_disponible",

    pedido_no_pendiente_de_pago: "pago_no_disponible"

};

// Evita doble envío mientras hay un pago en curso.
let pagoEnCurso =
    false;

/**
 * Agrega un botón de pago a #acciones.
 *
 * @param {string} texto
 * @param {string} id
 * @param {Function} alPagar
 * @returns {HTMLButtonElement}
 */
function agregarBotonDePago(
    texto,
    id,
    alPagar
) {

    const boton =
        crearBoton(texto, id);

    acciones.appendChild(
        boton
    );

    boton.addEventListener(
        "click",
        alPagar
    );

    return boton;

}

/**
 * Texto final de una compra aprobada: incluye importe
 * y referencia del pago cuando el backend los envía.
 *
 * @param {object} datos
 * @returns {string}
 */
function textoCompraAprobada(
    datos
) {

    const partes = [
        "Tu compra fue confirmada correctamente."
    ];

    const importe =
        Number(datos?.pago?.importe);

    if (
        Number.isFinite(importe) &&
        importe > 0
    ) {

        partes.push(
            `Importe: ${FORMATO_PAGO.format(importe)}.`
        );

    }

    const referencia =
        datos?.validacion?.referencia_proveedor;

    if (
        typeof referencia === "string" &&
        referencia !== ""
    ) {

        partes.push(
            `Referencia: ${referencia}.`
        );

    }

    return partes.join(" ");

}

/**
 * Estado de verificación correcta + botón para pagar.
 *
 * @param {object} pedido { id, estado }
 */
function mostrarContinuarAlPago(
    pedido
) {

    mostrarEstado(
        "checkout_confirmado_con_pedido"
    );

    agregarBotonDePago(
        "Continuar al pago",
        "btnContinuarPago",
        () => procesarPago(pedido.id)
    );

}

/**
 * Dispara el pago del Pedido conservado tras la
 * verificación del email.
 *
 * @param {number|string} pedidoId
 */
async function procesarPago(
    pedidoId
) {

    if (pagoEnCurso) return;

    // Única fuente de items: el carrito vigente en
    // sessionStorage. Sin items no hay request posible.
    const items =
        obtenerItemsParaPago();

    if (items.length === 0) {

        mostrarEstado(
            "pago_sin_items"
        );

        return;

    }

    pagoEnCurso = true;

    mostrarEstado(
        "pago_procesando"
    );

    const respuesta =
        await iniciarPago(
            pedidoId,
            items,
            SIMULACION_PAGO
        );

    pagoEnCurso = false;

    manejarRespuestaPago(
        respuesta,
        pedidoId
    );

}

/**
 * Traduce la respuesta real del backend a un estado de
 * la página. Único punto que decide si la compra está
 * confirmada.
 *
 * @param {object} respuesta
 * @param {number|string} pedidoId
 */
function manejarRespuestaPago(
    respuesta,
    pedidoId
) {

    // --------------------------------
    // ERRORES REALES / FALLOS DE RED
    // --------------------------------

    if (!respuesta.ok) {

        const estado =
            ESTADOS_DE_ERROR_DE_PAGO[
                respuesta.codigo
            ] || "pago_error";

        if (estado !== "pago_error") {

            mostrarEstado(estado);

            return;

        }

        // Sin cuerpo de respuesta: fallo de conexión,
        // timeout o configuración. Ese message ya está
        // pensado para mostrarsele al usuario.
        mostrarEstado(
            "pago_error",
            respuesta.data === null
                ? respuesta.message
                : null
        );

        return;

    }

    const datos =
        respuesta.data;

    const pedido =
        datos.pedido ?? {};

    // --------------------------------
    // APROBADO
    // --------------------------------

    if (datos.resultado === "aprobado") {

        // Único caso de compra confirmada: vacía el
        // carrito.
        if (pedido.estado === "PAGADO") {

            vaciarCarrito();

            mostrarEstado(
                "pago_aprobado",
                textoCompraAprobada(datos)
            );

            return;

        }

        // Pago registrado pero stock no afectado: no es
        // una compra normalmente confirmada y el carrito
        // se conserva.
        if (
            pedido.estado === "PAGADO_STOCK_NO_AFECTADO"
        ) {

            mostrarEstado(
                "pago_revision"
            );

            return;

        }

        mostrarEstado(
            "pago_error"
        );

        return;

    }

    // --------------------------------
    // RECHAZADO
    // --------------------------------

    if (datos.resultado === "rechazado") {

        mostrarRechazado(
            datos,
            pedidoId
        );

        return;

    }

    // --------------------------------
    // CORRECCIÓN: el pago NO se realizó
    // --------------------------------

    if (datos.resultado === "correccion") {

        mostrarCorreccionDePago(
            datos,
            pedidoId
        );

        return;

    }

    mostrarEstado(
        "pago_error"
    );

}

/**
 * Pago rechazado. Ofrece reintento sólo si el Pedido
 * sigue en PEND_PAGO y quedan intentos.
 *
 * @param {object} datos
 * @param {number|string} pedidoId
 */
function mostrarRechazado(
    datos,
    pedidoId
) {

    const pedido =
        datos.pedido ?? {};

    const intentos =
        datos.intentos;

    const maximo =
        datos.maximo_intentos;

    const intentosAgotados =
        typeof intentos === "number" &&
        typeof maximo === "number" &&
        intentos >= maximo;

    const reintentoDisponible =
        pedido.estado === "PEND_PAGO" &&
        !intentosAgotados;

    let detalle =
        "Tu pago fue rechazado.";

    if (
        typeof intentos === "number" &&
        typeof maximo === "number"
    ) {

        detalle +=
            ` Intento ${intentos} de ${maximo}.`;

    }

    if (reintentoDisponible) {

        detalle +=
            " Podés volver a intentarlo.";

    }

    mostrarEstado(
        "pago_rechazado",
        detalle
    );

    if (reintentoDisponible) {

        agregarBotonDePago(
            "Reintentar pago",
            "btnReintentarPago",
            () => procesarPago(pedidoId)
        );

    }

}

/**
 * El backend pidió corregir el carrito antes de pagar.
 * Se reutiliza la corrección existente del checkout
 * (aplicarCorreccion reemplaza el carrito guardado) y el
 * Pedido sigue disponible para reintentar.
 *
 * @param {object} datos
 * @param {number|string} pedidoId
 */
function mostrarCorreccionDePago(
    datos,
    pedidoId
) {

    const aplicacion =
        aplicarCorreccion(
            datos.carrito_corregido
        );

    // Payload fuera de contrato: no se aplicó nada y un
    // reintento devolvería la misma corrección.
    if (!aplicacion.ok) {

        mostrarEstado(
            "pago_error"
        );

        return;

    }

    mostrarEstado(
        "pago_correccion"
    );

    agregarBotonDePago(
        "Reintentar pago",
        "btnReintentarPago",
        () => procesarPago(pedidoId)
    );

}


// =====================================
// FLUJO DESUSCRIPCIÓN
// =====================================

if (
    flow === "unsubscribe" &&
    token &&
    !status
) {

    btnVolver.style.display =
        "none";

    document.title =
        "Confirmar desuscripción";

    titulo.textContent =
        "Confirmar desuscripción";

    mensaje.textContent =
        "Estás a punto de dejar de recibir novedades de Incancelables.";

    const btnConfirmar =
        crearBoton(
            "Confirmar desuscripción",
            "btnConfirmarDesuscripcion"
        );

    acciones.appendChild(
        btnConfirmar
    );


    // =================================
    // CONFIRMAR DESUSCRIPCIÓN
    // =================================

    btnConfirmar.addEventListener(
        "click",
        () => {

            btnConfirmar.disabled =
                true;

            mensaje.textContent =
                "Procesando desuscripción...";


            fetch(

                API.URL +

                "?action=unsubscribe-json&token=" +

                encodeURIComponent(
                    token
                )

            )

                .then(
                    response =>
                        response.json()
                )

                .then(
                    data => {

                        mostrarEstado(
                            data.status
                        );

                    }
                )

                .catch(
                    error => {

                        console.error(
                            error
                        );

                        mostrarEstado(
                            "error"
                        );

                    }
                );

        }
    );

}


// =====================================
// FLUJO SUSCRIPCIÓN
// =====================================

else if (
    flow === "subscribe" &&
    token &&
    !status
) {

    // Ocultar botón mientras
    // se procesa la confirmación.
    btnVolver.style.display =
        "none";

    document.title =
        "Confirmando suscripción";

    titulo.textContent =
        "Confirmando suscripción";

    mensaje.textContent =
        "Estamos validando tu suscripción.";

    // Consultar al backend
    // utilizando el token recibido.
    fetch(

        API.URL +

        "?action=confirm-json&token=" +

        encodeURIComponent(
            token
        )

    )

        // Convertir respuesta
        // a JSON.
        .then(
            response =>
                response.json()
        )

        // Actualizar interfaz
        // según resultado.
        .then(
            data => {

                // Registrar el evento únicamente
                // cuando el backend confirma
                // exitosamente la suscripción.
                if (data.status === "confirmado") {

                    Analytics.trackEvent(
                        "community_signup_confirmed"
                    );

                }

                // Actualizar la interfaz.
                mostrarEstado(
                    data.status
                );

            }
        )

        // Error inesperado
        // o de red.
        .catch(
            error => {

                console.error(
                    error
                );

                mostrarEstado(
                    "error"
                );

            }
        );

}


// =====================================
// FLUJO CHECKOUT (E-COMMERCE)
// =====================================

else if (
    flow === "checkout"
) {

    // Sin token no hay nada que validar:
    // se muestra el error sin consultar al backend.
    if (!token) {

        mostrarEstado(
            "token_invalido"
        );

    }
    else {

        // Ocultar botón mientras
        // se procesa la verificación.
        btnVolver.style.display =
            "none";

        document.title =
            "Verificando email";

        titulo.textContent =
            "Verificando email";

        mensaje.textContent =
            "Estamos validando tu dirección de email.";

        // Consultar al backend e-commerce
        // utilizando el token recibido.
        validarTokenCheckout(
            token
        )

            // Actualizar interfaz
            // según la respuesta real.
            .then(
                respuesta => {

                    const datos =
                        respuesta.ok
                            ? respuesta.data
                            : null;

                    // --------------------------------
                    // RESULTADO CONFIRMADO
                    // --------------------------------
                    // Con pedidos o sin ellos, un
                    // resultado "confirmado" siempre
                    // es un éxito.

                    if (
                        datos &&
                        datos.resultado === "confirmado"
                    ) {

                        const pedidos =
                            Array.isArray(datos.pedidos)
                                ? datos.pedidos
                                : [];

                        // Pedido listo para pagar: se
                        // conserva su id para el request
                        // de pago.
                        const pedidoAPagar =
                            pedidos.find(
                                pedido =>
                                    pedido &&
                                    pedido.estado === "PEND_PAGO"
                            ) ?? null;

                        if (pedidoAPagar) {

                            mostrarContinuarAlPago(
                                pedidoAPagar
                            );

                            return;

                        }

                        mostrarEstado(
                            pedidos.length > 0
                                ? "checkout_confirmado_con_pedido"
                                : "checkout_confirmado"
                        );

                        return;

                    }

                    // --------------------------------
                    // ERRORES REALES DEL BACKEND
                    // --------------------------------

                    if (
                        respuesta.codigo === "token_invalido" ||
                        respuesta.codigo === "token_expirado"
                    ) {

                        mostrarEstado(
                            respuesta.codigo
                        );

                        return;

                    }

                    // Resto de errores de validación,
                    // técnicos o de conexión.
                    mostrarEstado(
                        "error"
                    );

                }
            )

            // Error inesperado
            // o de red.
            .catch(
                error => {

                    console.error(
                        error
                    );

                    mostrarEstado(
                        "error"
                    );

                }
            );

    }

}


// =====================================
// ESTADOS RECIBIDOS POR URL
// =====================================

else {

    mostrarEstado(
        status
    );

}