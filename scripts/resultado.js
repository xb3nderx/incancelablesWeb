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

    // Ocultar botón mientras
    // el usuario decide si desea
    // continuar con la desuscripción.
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
// ESTADOS RECIBIDOS POR URL
// =====================================

else {

    mostrarEstado(
        status
    );

}