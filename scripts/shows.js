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




// Escala actual aplicada a la imagen.
//
// 1 representa el tamaño normal.
// Valores mayores representan
// distintos niveles de ampliación si escala >1 permite paneo, sino no
let escala = 1;


// Cantidad de dedos activos
// durante un gesto touch.
//
// Más adelante será utilizado para:
// - pinch zoom
// - distinguir gestos multitouch
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


    // Ocultar la galería para mostrar
    // únicamente la fotografía.
    modalGallery.style.display = "none";

    // El dialog deja temporalmente de comportarse como una ventana de galería y pasa a ocupar 
    // toda la pantalla.  La apariencia visual queda definida por la clase CSS:
    //
    // #my-modal.viewer-mode
    modal.classList.add("viewer-mode");

    // Mostrar el visor de fotografía.
    imageViewer.classList.add("active");


}

// /////////////////////////////////////////////////////////////////////////////
// ACTUALIZAR ESCALA
//
// Centraliza todos los cambios de zoom del visor.
//
// La escala puede modificarse desde:
//
// - mouse wheel (desktop)
// - pinch (mobile)
//
// Estados:
//
// escala = 1
// -> imagen en tamaño normal
// -> no permite paneo
//
// escala > 1
// -> imagen ampliada
// -> permite paneo
//
// La función actualiza:
// - escala
// - cursor
// - límites de desplazamiento
//
// El render final siempre pasa por:
// actualizarTransform()
//
// /////////////////////////////////////////////////////////////////////////////

function actualizarEscala(nuevaEscala) {


    // Guardar la nueva escala.
    escala = nuevaEscala;



    // La escala mínima permitida
    // es el tamaño original.
    if (escala < 1) {

        escala = 1;

    }



    // Si volvemos al tamaño original,
    // eliminamos completamente
    // cualquier paneo acumulado.
    if (escala === 1) {


        desplazamientoX = 0;

        desplazamientoY = 0;


        viewerImage.style.cursor =
            "zoom-in";


    } else {


        // Si la imagen está ampliada,
        // puede desplazarse.
        viewerImage.style.cursor =
            "grab";


        // Ajustar el paneo existente
        // al nuevo tamaño de imagen.
        //
        // Evita que al reducir escala
        // quede parte de la imagen fuera
        // del área visible.
        limitarDesplazamiento();


    }



    // Dibujar la transformación final.
    actualizarTransform();


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




    // /////////////////////////////////////////////////////////////////////////////
    // CONTROL DE GESTOS TOUCH
    //
    // Guarda la cantidad de dedos activos.
    //
    // Más adelante será utilizado para:
    // - pinch zoom
    // - distinguir gestos multitouch
    //
    // /////////////////////////////////////////////////////////////////////////////
    viewerImage.addEventListener(
        "touchstart",
        (event) => {

            //si no esta activo el visor de foto no toma el evento
            if (!imageViewer.classList.contains("active")) {
                return;
            }

            // Guardamos cantidad de dedos activos.
            //
            // Ejemplos:
            // 1 dedo  -> posible paneo
            // 2 dedos -> posible pinch zoom
            dedosActivos =
                event.touches.length;
        },
        {
            passive: true
        }
    );


    // Si el navegador cancela el gesto,
    // limpiamos el estado interno.
    viewerImage.addEventListener(
        "touchcancel",
        () => {

            dedosActivos = 0;

        }
    );

    // /////////////////////////////////////////////////////////////////////////////
    // ZOOM CON RUEDA DEL MOUSE (DESKTOP)
    //
    // La rueda modifica la escala.
    // El zoom se realiza manteniendo
    // como referencia el punto donde está
    // el cursor.
    //
    // /////////////////////////////////////////////////////////////////////////////

    viewerImage.addEventListener(
        "wheel",
        (event) => {


            // Solo funciona cuando el visor
            // está activo.
            if (!imageViewer.classList.contains("active")) {
                return;
            }


            // Evitar que la página haga scroll
            // mientras estamos sobre la imagen.
            event.preventDefault();



            // Obtener posición del cursor
            // dentro de la imagen.
            const rect =
                viewerImage.getBoundingClientRect();


            const x =
                event.clientX - rect.left;


            const y =
                event.clientY - rect.top;


            const escalaAnterior =
                escala;


            // Calcular cuánto cambia la escala
            // según la intensidad de la rueda.
            //
            // deltaY negativo = rueda arriba = zoom in
            // deltaY positivo = rueda abajo = zoom out

            const cambio =
                event.deltaY * -0.003;


            escala += cambio;



            // Limitar escala mínima.
            if (escala < 1) {

                escala = 1;

            }


            // Limitar escala máxima.
            if (escala > 5) {

                escala = 5;

            }



            // Actualizar cursor según estado.
            if (escala > 1) {

                viewerImage.style.cursor =
                    "grab";

            } else {

                desplazamientoX = 0;
                desplazamientoY = 0;

                viewerImage.style.cursor =
                    "zoom-in";

            }

            // Aplicar la nueva escala.
            actualizarTransform();


            // Obtener el centro actual de la imagen.
            // Usamos getBoundingClientRect porque
            // necesitamos la posición real en pantalla.

            const imagenRect =
                viewerImage.getBoundingClientRect();


            const centroImagenX =
                imagenRect.width / 2;


            const centroImagenY =
                imagenRect.height / 2;



            // Compensar el desplazamiento provocado
            // por cambiar la escala.
            //
            // Como transform-origin está fijo en el centro,
            // movemos la imagen en sentido contrario
            // para que el punto del cursor permanezca fijo.

            desplazamientoX +=
                (x - centroImagenX) *
                (1 - escala / escalaAnterior);


            desplazamientoY +=
                (y - centroImagenY) *
                (1 - escala / escalaAnterior);


            // Aplicar la nueva posición.
            actualizarTransform();

            // Evitar que aparezca fondo fuera
            // de la imagen.
            if (escala > 1) {

                limitarDesplazamiento();
                // Aplicar posición final.
                actualizarTransform();
            }

        },
        {
            passive: false
        }
    );

    // Detectar el inicio de un arrastre
    // sobre la imagen ampliada.
    viewerImage.addEventListener(
        "pointerdown",
        (event) => {

            // El paneo solamente está disponible
            // cuando la imagen está ampliada.
            //
            // La escala 1 representa la imagen normal.
            // Cuando la escala es mayor a 1,
            // existe zoom y se permite mover la imagen.
            if (escala <= 1) {
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
            // cuando la imagen continúa ampliada.
            //
            // Si la escala vuelve a 1,
            // no se permite desplazar la imagen.
            if (escala <= 1) {
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
            if (escala > 1) {

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


                // Ocultar el visor de fotografía.
                imageViewer.classList.remove("active");

                // El modal vuelve a comportarse
                // como una galería de imágenes.
                modal.classList.remove("viewer-mode");

                // Eliminar la fotografía cargada.
                viewerImage.src = "";

                // Restablecer completamente el
                // estado interno del visor.
                resetViewerZoom();

                // Volver a mostrar la galería.
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