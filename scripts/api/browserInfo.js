// =======================================================
// INFORMACIÓN DEL NAVEGADOR
// =======================================================

/**
 * Obtiene información básica del navegador y del dispositivo.
 */
function getBrowserInfo() {

    return {

        userAgent: navigator.userAgent,

        language: navigator.language,

        platform: navigator.platform,

        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,

        screen: `${screen.width}x${screen.height}`,

        viewport: `${window.innerWidth}x${window.innerHeight}`

    };

}