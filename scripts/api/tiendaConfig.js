// =======================================================
// TIENDA API CONFIG — v1.3 (proyecto académico, solo DEV)
// =======================================================
//
// Configuración de la API REST del e-commerce separado
// (Incancelables E-Commerce — backend PHP + MariaDB).
//
// Este archivo es independiente de apiConfig.js
// (Google Apps Script) y NO lo modifica.
//
// El e-commerce académico no tiene entorno PROD:
// no habrá ventas ni cobros reales.

const TIENDA_API = {

    // Virtual Host local (XAMPP)
    URL_DEV:
        "http://incancelables-ecommerce.local/api",

    // Aún no existe PROD para el e-commerce académico.
    URL_PROD: null,

    ENVIRONMENT: "DEV",

    TIMEOUT: 10000

};

TIENDA_API.URL =
    TIENDA_API.ENVIRONMENT === "PROD"
        ? TIENDA_API.URL_PROD
        : TIENDA_API.URL_DEV;
