// /////////////////////////////////////////////////////////////////////////////
// CONFIGURACIÓN DE RUTAS
// /////////////////////////////////////////////////////////////////////////////

import { BASE_PATH } from "../config/paths.js";


// /////////////////////////////////////////////////////////////////////////////
// BASE DE DATOS DE SHOWS
//
// Fuente única para:
// - Próximo show (index.html)
// - Shows históricos (shows.html)
//
// La diferencia entre ambos es solamente el estado.
//
// estados posibles:
// PROXIMO   -> aparece en Home
// HISTORICO -> aparece en archivo de shows
//
// Cuando un show pasa, solo se cambia el estado.
// No hay que copiar ni mover datos.
// /////////////////////////////////////////////////////////////////////////////


export const showsListado = [

    // =========================================================================
    // PRÓXIMO SHOW
    // =========================================================================

    // {
    //     id: "strummer-22-08-26",

    //     estado: "PROXIMO",

    //     titulo: "Strummer Bar",

    //     fecha:
    //         "22 de Agosto · 23:00 hs",

    //     lugar:
    //         "Godoy Cruz 1631 · CABA",

    //     flyer: {

    //         mobile:
    //             `${BASE_PATH}assets/shows/Strummer-22-08-26-mobile.webp`,

    //         desktop:
    //             `${BASE_PATH}assets/shows/Strummer-22-08-26-desktop.webp`

    //     },

    //     alt:
    //         "Strummer Bar 22/08/26",

    //     link:
    //         `${BASE_PATH}pages/shows.html`

    // },


    // =========================================================================
    // SHOWS HISTÓRICOS
    // =========================================================================


    {
        id: "mamita-31-01-26",

        estado: "HISTORICO",

        titulo: "Mamita Bar",

        fecha:
            "31 de Enero de 2026",

        lugar:
            "Av. Alvarez Tomas 487 · CABA",

        flyer: {

            mobile:
                `${BASE_PATH}assets/shows/mamita 31-01-26.webp`,

            desktop:
                `${BASE_PATH}assets/shows/mamita 31-01-26.webp`

        },

        alt:
            "Mamita Bar 31/01/26",

        // =========================================================
        // GALERÍA DE FOTOS
        //
        // Actualmente vacía.
        //
        // En el futuro puede contener:
        //
        // - rutas locales
        // - URLs externas
        // - imágenes de un CMS
        // - API
        //
        // =========================================================

        fotos: []

    },


    {
        id: "rodney-26-04-25",

        estado: "HISTORICO",

        titulo: "Rodney Bar",

        fecha:
            "26 de Abril de 2025",

        lugar:
            "Rodney 400 · CABA",

        flyer: {

            mobile:
                `${BASE_PATH}assets/shows/rodney 26-04-25.webp`,

            desktop:
                `${BASE_PATH}assets/shows/rodney 26-04-25.webp`

        },

        alt:
            "Rodney Bar 26/04/25",

        // =========================================================
        // GALERÍA DE FOTOS
        //
        // Actualmente vacía.
        //
        // En el futuro puede contener:
        //
        // - rutas locales
        // - URLs externas
        // - imágenes de un CMS
        // - API
        //
        // =========================================================

        fotos: []

    },


    {
        id: "rodney-02-11-24",

        estado: "HISTORICO",

        titulo: "Rodney Bar",

        fecha:
            "02 de Noviembre de 2024",

        lugar:
            "Rodney 400 · CABA",

        flyer: {

            mobile:
                `${BASE_PATH}assets/shows/Rodney 02-11-24.webp`,

            desktop:
                `${BASE_PATH}assets/shows/Rodney 02-11-24.webp`

        },

        alt:
            "Rodney Bar 02/11/24",

        // =========================================================
        // GALERÍA DE FOTOS
        //
        // Actualmente vacía.
        //
        // En el futuro puede contener:
        //
        // - rutas locales
        // - URLs externas
        // - imágenes de un CMS
        // - API
        //
        // =========================================================

        fotos: []

    },


    {
        id: "kif-22-06-24",

        estado: "HISTORICO",

        titulo: "Kif Bar",

        fecha:
            "22 de Junio de 2024",

        lugar:
            "Av. Cordoba 5600 · CABA",

        flyer: {

            mobile:
                `${BASE_PATH}assets/shows/kif 22-06-24.webp`,

            desktop:
                `${BASE_PATH}assets/shows/kif 22-06-24.webp`

        },

        alt:
            "Kif Bar 22/06/24",

        // =========================================================
        // GALERÍA DE FOTOS
        //
        // Actualmente vacía.
        //
        // En el futuro puede contener:
        //
        // - rutas locales
        // - URLs externas
        // - imágenes de un CMS
        // - API
        //
        // =========================================================

        fotos: []

    }

];


// /////////////////////////////////////////////////////////////////////////////
// OBTENER PRÓXIMO SHOW
// /////////////////////////////////////////////////////////////////////////////

export function getProximoShow() {

    return showsListado.find(
        show => show.estado === "PROXIMO"
    );

}


// /////////////////////////////////////////////////////////////////////////////
// OBTENER SHOWS HISTÓRICOS
// /////////////////////////////////////////////////////////////////////////////

export function getShowsHistoricos() {

    return showsListado.filter(
        show => show.estado === "HISTORICO"
    );

}