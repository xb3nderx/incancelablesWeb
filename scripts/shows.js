// /////////////////////////////////////////////////////////////////////////////
// DATOS DE SHOWS
//
// Fuente única:
// scripts/data/showsListado.js
//
// Contiene:
// - próximo show
// - shows históricos
//
// Este archivo solamente se encarga
// de renderizar shows.html
// /////////////////////////////////////////////////////////////////////////////

import {
    getProximoShow,
    getShowsHistoricos
} from "./data/showsListado.js";



// /////////////////////////////////////////////////////////////////////////////
// ELEMENTOS
// /////////////////////////////////////////////////////////////////////////////

const proximoTitulo =
    document.querySelector("#upcoming-show-title");

const proximoFecha =
    document.querySelector("#upcoming-show-date");

const proximoLugar =
    document.querySelector("#upcoming-show-location");

const proximoMobile =
    document.querySelector("#upcoming-show-mobile");

const proximoDesktop =
    document.querySelector("#upcoming-show-desktop");

const historialContainer =
    document.querySelector("#shows-history");



// /////////////////////////////////////////////////////////////////////////////
// RENDER PRÓXIMO SHOW
// /////////////////////////////////////////////////////////////////////////////

function renderProximoShow() {


    const show =
        getProximoShow();



    // Si no existe próximo show
    // ocultamos sección

    if (!show) {

        const section =
            document.querySelector(".proximo-show");

        if (section) {
            section.remove();
        }

        return;

    }



    if (proximoTitulo) {

        proximoTitulo.textContent =
            show.titulo;

    }



    if (proximoFecha) {

        proximoFecha.textContent =
            show.fecha;

    }



    if (proximoLugar) {

        proximoLugar.textContent =
            show.lugar;

    }



    if (proximoMobile) {

        proximoMobile.src =
            show.flyer.mobile;

    }



    if (proximoDesktop) {

        proximoDesktop.srcset =
            show.flyer.desktop;

    }

}



// /////////////////////////////////////////////////////////////////////////////
// RENDER SHOWS HISTÓRICOS
// /////////////////////////////////////////////////////////////////////////////

function renderShowsHistoricos() {


    if (!historialContainer) return;



    const shows =
        getShowsHistoricos();



    historialContainer.innerHTML = "";



    shows.forEach(show => {


        historialContainer.innerHTML += `

            <section class="show-card">


                <img
                    src="${show.flyer.mobile}"
                    alt="${show.alt}"
                >



                <div class="show-info">

                    <h2>
                        ${show.titulo}
                    </h2>


                    <p>
                        ${show.fecha}
                    </p>


                    <p>
                        ${show.lugar}
                    </p>


                </div>



                <!--
                =================================================
                GALERÍA FUTURA

                Se activará cuando:

                show.fotos.length > 0

                =================================================
                -->


            </section>

        `;


    });


}



// /////////////////////////////////////////////////////////////////////////////
// INICIALIZACIÓN
// /////////////////////////////////////////////////////////////////////////////

renderProximoShow();

renderShowsHistoricos();