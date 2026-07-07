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
            message.className = "form-message success";
            form.reset();
        } else {
            message.className = "form-message error";
        }

        // Restaura el botón
        button.disabled = false;
        button.textContent = originalText;

    });

}
