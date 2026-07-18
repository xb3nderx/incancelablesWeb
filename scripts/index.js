// /////////////////////////////////////////////////////////////////////////////
// DATOS
// /////////////////////////////////////////////////////////////////////////////

import { discografia } from "./data/discografia.js";
import { getProximoShow } from "./data/showsListado.js";


// /////////////////////////////////////////////////////////////////////////////
// ÚLTIMO LANZAMIENTO
// /////////////////////////////////////////////////////////////////////////////

function renderUltimoLanzamiento() {

    const container = document.querySelector("#latest-release-container");

    if (!container) return;

    const album = discografia[0];

    container.innerHTML = `
        <h2>${album.titulo}</h2>
        <div class="lanzamiento-texto">

            <p>${album.descripcionCorta}</p>

            <p>${album.descripcionHome}</p>

        </div>

        <a href="${album.enlace}" class="lanzamiento-disco">

            <img
                src="${album.portada}"
                alt="${album.titulo} cover de disco">

        </a>
    `;
}

// /////////////////////////////////////////////////////////////////////////////
// PRÓXIMO SHOW
//
// Fuente:
// data/showsListado.js
//
// Si existe un show con estado PROXIMO:
// carga la información.
//
// Si no existe:
// elimina la sección completa.
// /////////////////////////////////////////////////////////////////////////////

function renderProximoShow() {


    const show =
        getProximoShow();



    const section =
        document.querySelector(".proximo-show");



    // -------------------------------------------------------------------------
    // NO HAY PRÓXIMO SHOW
    // -------------------------------------------------------------------------

    if (!show) {


        if (section) {

            section.remove();

        }


        return;

    }



    // -------------------------------------------------------------------------
    // ELEMENTOS
    // -------------------------------------------------------------------------

    const title =
        document.querySelector("#upcoming-show-title");


    const date =
        document.querySelector("#upcoming-show-date");


    const location =
        document.querySelector("#upcoming-show-location");


    const mobile =
        document.querySelector("#upcoming-show-mobile");


    const desktop =
        document.querySelector("#upcoming-show-desktop");


    const link =
        document.querySelector("#upcoming-show-link");



    // -------------------------------------------------------------------------
    // CARGAR DATOS
    // -------------------------------------------------------------------------

    if (title) {

        title.textContent =
            show.titulo;

    }


    if (date) {

        date.textContent =
            show.fecha;

    }


    if (location) {

        location.textContent =
            show.lugar;

    }



    // -------------------------------------------------------------------------
    // FLYERS
    // -------------------------------------------------------------------------

    if (mobile && show.flyer?.mobile) {

        mobile.src =
            show.flyer.mobile;

    }


    if (desktop && show.flyer?.desktop) {

        desktop.srcset =
            show.flyer.desktop;

    }



    // -------------------------------------------------------------------------
    // LINK
    // -------------------------------------------------------------------------

    if (link && show.link) {

        link.href =
            show.link;

    }

}

// /////////////////////////////////////////////////////////////////////////////
// INICIALIZACIÓN
// /////////////////////////////////////////////////////////////////////////////

renderUltimoLanzamiento();
renderProximoShow();