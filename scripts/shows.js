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

// Indica si el visor se encuentra
// en modo zoom.
//
// En este modo se habilitan:
//
// - paneo
// - zoom continuo
//
// Se activa con doble click/tap
// y finaliza con:
//
// - doble click/tap
// - zoom hasta escala 1.
let modoZoom = false;


// Escala actual aplicada a la imagen.
//
// 1 representa el tamaño normal.
// Valores mayores representan
// distintos niveles de ampliación.
let escala = 1;

//para llevar control del tap en mobile (reemplaza doble click)
let ultimoTap = 0;

//cantidad de dedos activos en el gesture
let dedosActivos = 0;

// Desplazamiento actual de la imagen
// cuando está ampliada.
let desplazamientoX = 0;
let desplazamientoY = 0;

// /////////////////////////////////////////////////////////////////////////////
// CONTROL DEL PANEO
//
// Guarda la posición inicial del puntero
// cuando comienza un arrastre.
//
// También guarda el desplazamiento inicial
// de la imagen.
//
// El movimiento se calcula siempre desde
// esa posición inicial.
//
// Esto evita acumulación de errores cuando
// existen muchos eventos pointermove.
//
// /////////////////////////////////////////////////////////////////////////////


let inicioX = 0;
let inicioY = 0;


// Desplazamiento que tenía la imagen
// antes de comenzar el arrastre.
let inicioDesplazamientoX = 0;
let inicioDesplazamientoY = 0;


// Indica si el usuario está arrastrando
// la imagen ampliada.
let arrastrando = false;

// /////////////////////////////////////////////////////////////////////////////
// RESETEAR ZOOM
//
// Restablece el visor al estado inicial.
// Se utiliza al:
//
// - abrir una nueva foto
// - salir del modo zoom
// - cerrar el visor
//
//
// /////////////////////////////////////////////////////////////////////////////

function resetViewerZoom() {

    // Salir del modo zoom.
    modoZoom = false;

    // Restaurar la escala inicial.
    escala = 1;
    // Restablecer el desplazamiento de la imagen.
    desplazamientoX = 0;
    desplazamientoY = 0;

    // Restaurar el origen de la transformación
    // al centro de la imagen.
    // viewerImage.style.transformOrigin =
    //     "center center";

    // Aplicar la transformación inicial.
    actualizarTransform();

    // Mostrar nuevamente el cursor
    // para ingresar al modo zoom.
    viewerImage.style.cursor =
        "zoom-in";

}

// /////////////////////////////////////////////////////////////////////////////
// ACTUALIZAR TRANSFORMACIÓN
//
// Aplica el estado visual actual
// del visor.
//
// La transformación siempre se calcula
// a partir de:
//
// - desplazamiento horizontal
// - desplazamiento vertical
// - escala actual
//
// Todas las modificaciones visuales del
// visor deben pasar por esta función.
//
// /////////////////////////////////////////////////////////////////////////////

function actualizarTransform() {

    viewerImage.style.transform =
        `translate(${desplazamientoX}px, ${desplazamientoY}px) scale(${escala})`;

}

// /////////////////////////////////////////////////////////////////////////////
// LIMITAR DESPLAZAMIENTO
//
// Corrige el desplazamiento para que la
// imagen nunca deje ver el fondo del visor.
//
// La función trabaja siempre sobre el estado
// realmente renderizado por el navegador.
//
// Si al corregir un eje modifica el otro,
// vuelve a medir antes de continuar.
//
// /////////////////////////////////////////////////////////////////////////////

function limitarDesplazamiento() {

    // Aplicar primero el desplazamiento
    // actual para medir la posición real
    // de la imagen.
    actualizarTransform();


    // Obtener el área visible del visor.
    const visor =
        imageViewer.getBoundingClientRect();


    // Obtener la posición real de la imagen
    // ya transformada.
    let imagen =
        viewerImage.getBoundingClientRect();


    // =====================================================
    // EJE X
    // =====================================================

    // Si aparece fondo por la izquierda.
    if (imagen.left > visor.left) {

        desplazamientoX -=
            imagen.left - visor.left;

    }

    // Si aparece fondo por la derecha.
    if (imagen.right < visor.right) {

        desplazamientoX +=
            visor.right - imagen.right;

    }


    // Como acabamos de modificar X,
    // volvemos a aplicar la transformación
    // antes de medir nuevamente.
    actualizarTransform();

    imagen =
        viewerImage.getBoundingClientRect();


    // =====================================================
    // EJE Y
    // =====================================================

    // Si aparece fondo arriba.
    if (imagen.top > visor.top) {

        desplazamientoY -=
            imagen.top - visor.top;

    }

    // Si aparece fondo abajo.
    if (imagen.bottom < visor.bottom) {

        desplazamientoY +=
            visor.bottom - imagen.bottom;

    }

}

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

    // Guarda la posición actual de la galería
    // para restaurarla al volver del visor.
    modalScrollPosition = modal.scrollTop;

    viewerImage.src = src;

    // Siempre abrir una nueva imagen
    // con el zoom reiniciado.
    resetViewerZoom();


    modalGallery.style.display = "none";


    imageViewer.classList.add("active");


}

// /////////////////////////////////////////////////////////////////////////////
// ALTERNAR MODO ZOOM
//
// Permite entrar o salir del modo zoom.
//
// Nuevo comportamiento:
//
// Al ingresar:
//
// - mantiene el centro como origen.
// - aplica escala 2.
// - calcula un desplazamiento inicial.
// - mueve la imagen para que la zona
//   seleccionada quede centrada.
//
// Ya no utiliza transform-origin.
//
// El posicionamiento se controla únicamente
// mediante:
//
// translate()
// scale()
//
// Al salir:
//
// - vuelve al estado inicial.
// /////////////////////////////////////////////////////////////////////////////

function toggleZoom(x = 0, y = 0) {


    if (!viewerImage) return;



    // =========================================================
    // ENTRAR EN ZOOM
    // =========================================================

    if (!modoZoom) {

        // Activar el modo zoom.
        modoZoom = true;

        // Escala inicial del visor.
        //
        // Más adelante podrá modificarse
        // mediante wheel o pinch.
        escala = 2;

        // Comenzar el modo zoom sin
        // desplazamiento.
        //
        // Primero queremos que el navegador
        // dibuje únicamente la imagen ampliada.
        desplazamientoX = 0;
        desplazamientoY = 0;

        // Aplicar solamente la nueva escala.
        //
        // Todavía no calculamos la posición
        // inicial de la imagen.
        actualizarTransform();

        // Esperar al siguiente repaint.
        //
        // Recién en ese momento el navegador
        // habrá terminado de dibujar la imagen
        // ampliada y podremos medir su tamaño
        // real para calcular correctamente
        // el desplazamiento inicial.
        requestAnimationFrame(() => {

            // Obtener el tamaño visible
            // del visor.
            const visorRect =
                imageViewer.getBoundingClientRect();

            // Obtener el tamaño real de la
            // imagen ya ampliada.
            const imagenRect =
                viewerImage.getBoundingClientRect();

            // Centro del visor.
            const centroVisorX =
                visorRect.width / 2;

            const centroVisorY =
                visorRect.height / 2;

            // Centro de la imagen ampliada.
            const centroImagenX =
                imagenRect.width / 2;

            const centroImagenY =
                imagenRect.height / 2;

            // Calcular cuánto se encuentra
            // el punto seleccionado respecto
            // del centro de la imagen.
            const diferenciaX =
                (x * escala) -
                centroImagenX;

            const diferenciaY =
                (y * escala) -
                centroImagenY;

            // Desplazar la imagen para que
            // el punto seleccionado quede
            // centrado dentro del visor.
            desplazamientoX =
                -diferenciaX;

            desplazamientoY =
                -diferenciaY;

            // Corregir el desplazamiento
            // para evitar mostrar fondo
            // fuera de la imagen.
            limitarDesplazamiento();

            // Aplicar la posición final.
            actualizarTransform();

        });

        // Cambiar el cursor indicando
        // que ahora la imagen puede
        // desplazarse mediante paneo.
        viewerImage.style.cursor =
            "grab";

        return;

    }



    // =========================================================
    // SALIR DEL ZOOM
    // =========================================================


    resetViewerZoom();


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
// ACTIVAR ZOOM
//
// Desktop:
// - doble click
//
// Mobile:
// - doble tap personalizado
//
// El zoom utiliza transform-origin para
// ampliar desde el punto seleccionado.
//
// También ignora gestos multitáctiles.
//
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

            // Obtener el área visible actual
            // de la imagen.
            // Como el zoom inicial siempre ocurre
            // desde escala 1, estas coordenadas
            // representan correctamente el punto
            // donde el usuario hizo click.
            const rect =
                viewerImage.getBoundingClientRect();

            // Calcular la posición del doble click
            // dentro de la imagen.
            //
            // A diferencia de la versión anterior,
            // ahora trabajaremos en píxeles y no
            // en porcentajes, ya que el origen de
            // la transformación permanecerá fijo.
            const x =
                event.clientX - rect.left;

            const y =
                event.clientY - rect.top;


            // ======================================
            // DEBUG
            // ======================================

            console.log("hola mundo");
            console.log({

                x,
                y,

                rectWidth: rect.width,
                rectHeight: rect.height,

                clientWidth: viewerImage.clientWidth,
                clientHeight: viewerImage.clientHeight,

                naturalWidth: viewerImage.naturalWidth,
                naturalHeight: viewerImage.naturalHeight

            });

            // Entrar o salir del modo zoom.
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

            // Guardamos cantidad de dedos.
            //
            // Esto permite ignorar gestos
            // multitouch como pinch zoom.
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


                // Obtener el área visible actual
                // de la imagen.
                const rect =
                    viewerImage.getBoundingClientRect();

                // Calcular la posición del doble tap
                // dentro de la imagen.
                const x =
                    touch.clientX - rect.left;

                const y =
                    touch.clientY - rect.top;

                // Entrar o salir del modo zoom.
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

    // Detectar el inicio de un arrastre
    // sobre la imagen ampliada.
    viewerImage.addEventListener(
        "pointerdown",
        (event) => {

            // El paneo solamente está disponible
            // cuando el visor se encuentra
            // en modo zoom.
            if (!modoZoom) {
                return;
            }

            // Guardar la posición inicial
            // del puntero.
            inicioX = event.clientX;
            inicioY = event.clientY;

            // Guardamos la posición actual
            // de la imagen antes del movimiento.
            //
            // Después pointermove calculará:
            // desplazamiento inicial
            // +
            // movimiento realizado
            //
            // Esto evita acumulación de errores.
            inicioDesplazamientoX =
                desplazamientoX;

            inicioDesplazamientoY =
                desplazamientoY;

            // Indicar que comenzó un arrastre.
            arrastrando = true;

            // Indicar visualmente que la imagen
            // está siendo tomada para moverla.
            viewerImage.style.cursor =
                "grabbing";

            // Mantener la captura del puntero
            // aunque salga de la imagen.
            viewerImage.setPointerCapture(event.pointerId);

        }
    );

    // Desplazar la imagen mientras
    // el usuario la está arrastrando.
    viewerImage.addEventListener(
        "pointermove",
        (event) => {

            // Solo permitir el paneo cuando
            // existe un arrastre en curso.
            if (!arrastrando) {
                return;
            }

            // El paneo solamente está disponible
            // cuando la imagen está ampliada.
            if (!modoZoom) {
                return;
            }

            // Calculamos cuánto se movió
            // desde el inicio del gesto.
            const movimientoX =
                event.clientX - inicioX;


            const movimientoY =
                event.clientY - inicioY;

            // La posición final sale de:
            //
            // posición inicial
            // +
            // movimiento actual
            //
            desplazamientoX =
                inicioDesplazamientoX +
                movimientoX;


            desplazamientoY =
                inicioDesplazamientoY +
                movimientoY;


            // Mantener el desplazamiento dentro
            // de los límites permitidos.
            limitarDesplazamiento();

            // Aplicamos:
            //
            // translate()
            // scale()
            // Aplicar la nueva transformación.
            actualizarTransform();

        }
    );

    // Finalizar el arrastre cuando
    // el usuario suelta el puntero.
    viewerImage.addEventListener(
        "pointerup",
        (event) => {

            // Ya no hay un arrastre activo.
            arrastrando = false;

            // Solo cambiar el cursor si la imagen
            // continúa ampliada.
            if (modoZoom) {

                viewerImage.style.cursor =
                    "grab";

            }
            // Liberar la captura del puntero.
            if (
                viewerImage.hasPointerCapture(
                    event.pointerId
                )
            ) {

                viewerImage.releasePointerCapture(
                    event.pointerId
                );

            }

        }
    );

    // Cancelar el arrastre si el navegador
    // interrumpe el gesto.
    viewerImage.addEventListener(
        "pointercancel",
        () => {

            // Finalizar cualquier arrastre activo.
            arrastrando = false;

            // console.log("pointercancel");

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


                // Restablecer el visor antes de volver
                // a la galería de imágenes.
                resetViewerZoom();


                modalGallery.style.display = "";

                // Restaurar la posición donde el usuario
                // estaba recorriendo la galería.
                modal.scrollTop = modalScrollPosition;

                return;

            }

            // Si estamos en la galería

            // Al abrir nuevamente una galería,
            // comenzar siempre desde el inicio.
            modal.scrollTop = 0;

            // Vaciar la galería para que se regenere
            // en la próxima apertura.
            modalGallery.innerHTML = "";

            // Cerrar el modal.
            modal.close();



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