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

const imageViewer =
    document.querySelector("#image-viewer");

const viewerImage =
    document.querySelector("#viewer-image");

const closeModal =
    document.querySelector("#close-modal");

//para guardar el punto de scroll de la galeria antes de ir a una foto
let modalScrollPosition = 0;

//para saber si la foto esta en modo zoom 
let zoomActivo = false;

//para llevar control del tap en mobile (reemplaza doble click)
let ultimoTap = 0;

//cantidad de dedos activos en el gesture
let dedosActivos = 0;

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
            data-show="${show.id}"
            aria-label="Ver fotos del show">

            📷 Ver fotos

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


        // Abrir visor al tocar la foto

        img.addEventListener(
            "click",
            () => {

                abrirVisor(img.src);

            }
        );


        modalGallery.appendChild(figure);


    });



    modal.showModal();


}

// /////////////////////////////////////////////////////////////////////////////
// ABRIR VISOR DE FOTO
//
// Muestra una imagen individual
// dentro del modal.
// /////////////////////////////////////////////////////////////////////////////

function abrirVisor(src) {


    if (!imageViewer || !viewerImage) return;

    modalScrollPosition = modal.scrollTop;

    viewerImage.src = src;

    zoomActivo = false;

    viewerImage.style.transform = "scale(1)";
    viewerImage.style.transformOrigin = "center center";
    viewerImage.style.cursor = "zoom-in";


    modalGallery.style.display = "none";


    imageViewer.classList.add("active");


}



function toggleZoom(x = 50, y = 50) {


    if (!viewerImage) return;



    zoomActivo = !zoomActivo;



    if (zoomActivo) {


        viewerImage.style.transformOrigin =
            `${x}% ${y}%`;



        viewerImage.style.transform =
            "scale(2)";



        viewerImage.style.cursor =
            "zoom-out";


    } else {


        viewerImage.style.transform =
            "scale(1)";



        viewerImage.style.transformOrigin =
            "center center";



        viewerImage.style.cursor =
            "zoom-in";


    }


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
// ZOOM BÁSICO
// /////////////////////////////////////////////////////////////////////////////

function activarZoom() {


    if (!viewerImage) return;



    // Desktop
    viewerImage.addEventListener(
        "dblclick",
        (event) => {

            //si no esta activo el visor de foto no toma el evento
            if (!imageViewer.classList.contains("active")) {
                return;
            }

            const rect =
                viewerImage.getBoundingClientRect();



            const x =
                ((event.clientX - rect.left) / rect.width) * 100;



            const y =
                ((event.clientY - rect.top) / rect.height) * 100;



            toggleZoom(x, y);


        }
    );



    // Detectar inicio de touch
    viewerImage.addEventListener(
        "touchstart",
        (event) => {

            //si no esta activo el visor de foto no toma el evento
            if (!imageViewer.classList.contains("active")) {
                return;
            }

            dedosActivos =
                event.touches.length;



        },
        {
            passive: true
        }
    );



    // Detectar doble tap mobile

    viewerImage.addEventListener(
        "touchend",
        (event) => {



            // Si hubo más de un dedo
            // durante el gesto ignoramos

            if (dedosActivos > 1) {


                ultimoTap = 0;

                dedosActivos = 0;


                return;

            }



            const ahora =
                Date.now();



            const diferencia =
                ahora - ultimoTap;



            if (diferencia < 300) {


                const touch =
                    event.changedTouches[0];


                const rect =
                    viewerImage.getBoundingClientRect();



                const x =
                    ((touch.clientX - rect.left) / rect.width) * 100;



                const y =
                    ((touch.clientY - rect.top) / rect.height) * 100;



                toggleZoom(x, y);



                ultimoTap = 0;


            } else {


                ultimoTap = ahora;


            }



            dedosActivos = 0;



        }
    );

    //si se cancela el gesto
    viewerImage.addEventListener(
        "touchcancel",
        () => {

            dedosActivos = 0;
            ultimoTap = 0;

        }
    );
}

// /////////////////////////////////////////////////////////////////////////////
// CERRAR MODAL
// /////////////////////////////////////////////////////////////////////////////

function activarCierreModal() {


    if (!modal || !closeModal) return;



    closeModal.addEventListener(
        "click",
        () => {


            // Si estamos en el visor de una foto
            if (imageViewer.classList.contains("active")) {


                imageViewer.classList.remove("active");


                viewerImage.src = "";


                zoomActivo = false;

                viewerImage.style.transform = "scale(1)";
                viewerImage.style.transformOrigin = "center center";
                viewerImage.style.cursor = "zoom-in";


                modalGallery.style.display = "";

                modal.scrollTop = modalScrollPosition;

                return;

            }



            // Si estamos en la galería
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

activarZoom();

activarCierreModal();