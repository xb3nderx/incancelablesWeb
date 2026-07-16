const params =
    new URLSearchParams(
        window.location.search
    );

const status =
    params.get("status");

const titulo =
    document.getElementById(
        "titulo"
    );

const mensaje =
    document.getElementById(
        "mensaje"
    );

switch (status) {

    case "confirmado":

        document.title =
            "¡Suscripción confirmada!";

        titulo.textContent =
            "¡Suscripción confirmada!";

        mensaje.textContent =
            "Tu suscripción fue confirmada correctamente.";

        break;


    case "baja":

        document.title =
            "Suscripción cancelada";

        titulo.textContent =
            "Suscripción cancelada";

        mensaje.textContent =
            "Tu suscripción fue cancelada correctamente.";

        break;


    case "expirado":

        document.title =
            "Enlace expirado";

        titulo.textContent =
            "Enlace expirado";

        mensaje.textContent =
            "El enlace de confirmación ha expirado.";

        break;


    case "error":

        document.title =
            "Ocurrió un error";

        titulo.textContent =
            "Ocurrió un error";

        mensaje.textContent =
            "No pudimos procesar tu solicitud.";

        break;


    default:

        document.title =
            "Incancelables";

        titulo.textContent =
            "Incancelables";

        mensaje.textContent =
            "La operación solicitada no es válida.";

}

console.log(
    "window.innerWidth:",
    window.innerWidth
);

console.log(
    "screen.width:",
    screen.width
);