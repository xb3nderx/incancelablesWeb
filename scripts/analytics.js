// =======================================================
// GOOGLE ANALYTICS 4
// =======================================================
//
// Este archivo centraliza toda la integración con Google
// Analytics 4.
//
// REGLA DE ARQUITECTURA:
//
// Ningún otro archivo del proyecto debe llamar a gtag().
// Todos los eventos deben enviarse mediante:
//
//      Analytics.trackEvent(...)
//
//
// En entorno DEV:
// - NO se envían eventos a Google.
// - Se muestran por consola.
//
// En entorno PROD:
// - Se cargan las librerías de GA4.
// - Los eventos se envían normalmente.
// =======================================================


// -------------------------------------------------------
// CONFIGURACIÓN
// -------------------------------------------------------

window.Analytics = {

    // Indica si Analytics está habilitado
    enabled: false,

    // Measurement ID de la propiedad GA4 de PRODUCCIÓN
    measurementId: "G-6P3NGNP8XZ",

    /**
     * Indica si Analytics está activo.
     *
     * @returns {boolean}
     */
    isEnabled() {

        return this.enabled;

    },

    /**
     * Envía un evento personalizado.
     *
     * @param {string} eventName
     * @param {Object} params
     */
    trackEvent(eventName, params = {}) {

        // Validar nombre del evento
        if (!eventName || typeof eventName !== "string") {

            console.warn("[GA4] Nombre de evento inválido.");

            return;

        }

        // -------------------------------
        // MODO DESARROLLO
        // -------------------------------

        if (!this.enabled) {

            console.debug("[GA4 DEV]", eventName, params);

            return;

        }

        // -------------------------------
        // MODO PRODUCCIÓN
        // -------------------------------

        gtag("event", eventName, params);

    }

};



// =======================================================
// INICIALIZACIÓN DE GOOGLE ANALYTICS
// =======================================================

if (typeof API !== "undefined" && API.ENVIRONMENT === "PROD") {

    // Activar Analytics
    Analytics.enabled = true;

    // Crear dataLayer
    window.dataLayer = window.dataLayer || [];

    /**
     * Función oficial de Google Analytics.
     * (Uso interno únicamente)
     */
    function gtag() {

        window.dataLayer.push(arguments);

    }

    // Inicializar Google Analytics
    gtag("js", new Date());

    gtag("config", Analytics.measurementId);

    // Cargar la librería oficial de Google Analytics
    const script = document.createElement("script");

    script.async = true;

    script.src =
        `https://www.googletagmanager.com/gtag/js?id=${Analytics.measurementId}`;

    document.head.appendChild(script);

}