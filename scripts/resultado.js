// =====================================
// PÁGINA DE RESULTADO
// =====================================
//
// resultado.js corre como script clásico (se carga con
// <script src>) y sólo presenta el resultado de la
// verificación de email del checkout.
//
// La compra NO continúa acá: el token se propaga a la
// tienda, que recupera el Pedido desde el backend.

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


/**
 * Crea un enlace con aspecto de botón.
 *
 * @param {string} texto
 * @param {string} href
 * @param {string} id
 * @returns {HTMLAnchorElement}
 */
function crearEnlace(
    texto,
    href,
    id
) {

    const enlace =
        document.createElement(
            "a"
        );

    enlace.textContent =
        texto;

    enlace.href =
        href;

    enlace.id =
        id;

    enlace.className =
        "btn";

    return enlace;

}


/**
 * Salida del flujo de verificación de checkout.
 *
 * Sólo informa el éxito y continúa la compra en la
 * tienda: esta página no recupera items ni ejecuta el
 * pago. El token se propaga tal cual llegó en la URL
 * actual (sin persistirlo en storage).
 */
function mostrarContinuarCompra() {

    mostrarEstado(
        "checkout_confirmado"
    );

    // Este estado sólo ofrece continuar la compra
    // en la tienda: "Volver a Incancelables" queda
    // oculto (mostrarEstado() lo restaura para el
    // resto de los estados de esta página).
    btnVolver.style.display =
        "none";

    acciones.appendChild(
        crearEnlace(
            "Continuar compra",
            `tienda.html?token=${encodeURIComponent(token)}`,
            "btnContinuarCompra"
        )
    );

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
 */
function mostrarEstado(
    status
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
                    // Esta página sólo informa el
                    // éxito de la verificación: la
                    // compra continúa en la tienda,
                    // que recupera el Pedido desde el
                    // backend con el mismo token.

                    if (
                        datos &&
                        datos.resultado === "confirmado"
                    ) {

                        mostrarContinuarCompra();

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