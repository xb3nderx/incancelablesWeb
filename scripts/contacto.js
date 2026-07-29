// =======================================================
// CONTACTO
// =======================================================

document.addEventListener("DOMContentLoaded", init);

function init() {

    bindForm("community-form");
    bindForm("contact-form");

}

function bindForm(id) {

    const form = document.getElementById(id);

    const message = form.nextElementSibling;

    // Oculta el mensaje cuando el usuario modifica el formulario
    form.addEventListener("input", () => {

        message.hidden = true;
        message.textContent = "";
        message.className = "form-message";

    });

    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        const button = form.querySelector('button[type="submit"]');

        // Limpia mensaje anterior
        message.hidden = true;
        message.textContent = "";

        // Deshabilita el botón
        const originalText = button.textContent;

        button.disabled = true;
        button.textContent = "Enviando...";

        // Envía el formulario
        const result = await sendForm(form);

        // Muestra mensaje
        message.hidden = false;
        message.textContent = result.message;

        if (result.ok) {

            // Mensaje de éxito
            message.className = "form-message success";

            // Registrar evento en Google Analytics
            switch (form.id) {

                case "community-form":
                    Analytics.trackEvent("community_signup_requested");
                    break;

                case "contact-form":
                    Analytics.trackEvent("contact_form_submitted");
                    break;

            }

            // Limpiar formulario
            form.reset();

        } else {

            message.className = "form-message error";

        }
        // Restaura el botón
        button.disabled = false;
        button.textContent = originalText;

    });

}
