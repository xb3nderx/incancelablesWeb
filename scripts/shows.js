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

import {
    galerias
} from "./data/galerias.js";

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
// MODAL GALERÍA
// /////////////////////////////////////////////////////////////////////////////

const modal =
    document.querySelector("#my-modal");


const modalGallery =
    document.querySelector("#modal-gallery");

const closeModal =
    document.querySelector("#close-modal");

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


        // =========================================================
        // GALERÍA
        //
        // Solo se consulta porque este listado
        // contiene únicamente shows HISTORICO.
        //
        // La información viene de:
        //
        // scripts/data/galerias.js
        //
        // =========================================================


        const galeria =
            galerias[show.id];



        const botonGaleria =
            galeria?.tieneGaleria

                ?

                `
                <button
                    class="btn-galeria"
                    data-show="${show.id}">
                    
                    Ver imágenes
                    
                </button>
            `

                :

                "";



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



                    ${botonGaleria}


                </div>



            </section>

        `;


    });


}

// /////////////////////////////////////////////////////////////////////////////
// ABRIR GALERÍA
//
// Recibe el id del show.
// Busca sus imágenes en galerias.js.
// Genera las imágenes dentro del dialog.
//
// /////////////////////////////////////////////////////////////////////////////

function abrirGaleria(showId) {


    if (!modal || !modalGallery) return;



    const galeria =
        galerias[showId];



    if (!galeria?.tieneGaleria) return;



    modalGallery.innerHTML = "";



    galeria.imagenes.forEach(imagen => {


        const figure =
            document.createElement("figure");


        const img =
            document.createElement("img");



        img.src =
            `../assets/shows/galerias/${showId}/${imagen}`;


        img.alt =
            `Galería ${showId}`;


        img.loading =
            "lazy";



        figure.appendChild(img);


        modalGallery.appendChild(figure);


    });



    modal.showModal();


}

// /////////////////////////////////////////////////////////////////////////////
// EVENTOS GALERÍA
// /////////////////////////////////////////////////////////////////////////////

function activarBotonesGaleria() {


    const botones =
        document.querySelectorAll(".btn-galeria");



    botones.forEach(boton => {


        boton.addEventListener(
            "click",
            () => {


                const showId =
                    boton.dataset.show;


                abrirGaleria(showId);


            }
        );


    });


}

// /////////////////////////////////////////////////////////////////////////////
// CERRAR MODAL
// /////////////////////////////////////////////////////////////////////////////

function activarCierreModal() {


    if (!modal || !closeModal) return;



    closeModal.addEventListener(
        "click",
        () => {

            modal.close();

            modalGallery.innerHTML = "";

        }
    );

}

// /////////////////////////////////////////////////////////////////////////////
// INICIALIZACIÓN
// /////////////////////////////////////////////////////////////////////////////

renderProximoShow();

renderShowsHistoricos();

activarBotonesGaleria();

activarCierreModal();