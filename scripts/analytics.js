// =======================================================
// GOOGLE ANALYTICS 4
// =======================================================

// Google Analytics se activa únicamente en PROD

if (typeof API !== "undefined" && API.ENVIRONMENT === "PROD") {

    // Measurement ID de Google Analytics 4
    const GA_MEASUREMENT_ID = "G-6P3NGNP8XZ";

    // Crear dataLayer
    window.dataLayer = window.dataLayer || [];

    // Función global de Google Analytics
    function gtag() {

        window.dataLayer.push(arguments);

    }

    // Inicializar Google Analytics
    gtag("js", new Date());

    gtag("config", GA_MEASUREMENT_ID);

    // Cargar la librería oficial de Google Analytics
    const script = document.createElement("script");

    script.async = true;

    script.src =
        `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;

    document.head.appendChild(script);

}