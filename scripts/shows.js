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
// CONTROL DEL PINCH ZOOM
//
// El pinch utiliza Pointer Events.
//
// pointers: punteros activos sobre la imagen.
//
// pinchInicio: guarda el estado al comenzar
// el gesto de dos dedos:
//
// - distancia entre los dedos
// - punto medio entre los dedos
// - escala inicial
// - desplazamiento inicial
// - centro de la imagen en pantalla
//
// Todo el cálculo del gesto se hace desde
// ese estado inicial, sin acumular errores.
//
// /////////////////////////////////////////////////////////////////////////////

const pointers = new Map();

let pinchActivo = false;

let pinchInicio = null;

// Distancia entre dos punteros.
function distanciaEntre(a, b) {

    return Math.hypot(
        a.x - b.x,
        a.y - b.y
    );

}

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
// Casos:
//
// - Si la imagen es más grande que el visor
//   en un eje, no debe quedar fondo visible.
//
// - Si la imagen entra completa en un eje,
//   se mantiene centrada en ese eje.
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
    const imagen =
        viewerImage.getBoundingClientRect();


    // =====================================================
    // EJE X
    // =====================================================

    if (imagen.width >= visor.width) {

        // La imagen es más ancha que el visor.
        //
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

    } else {

        // La imagen entra completa en el ancho
        // del visor: se mantiene centrada.
        const centroVisor =
            visor.left + (visor.width / 2);


        const centroImagen =
            imagen.left + (imagen.width / 2);


        desplazamientoX +=
            centroVisor - centroImagen;

    }


    // =====================================================
    // EJE Y
    // =====================================================

    if (imagen.height >= visor.height) {

        // La imagen es más alta que el visor.
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

    } else {

        // La imagen entra en el alto del visor:
        // se mantiene centrada.
        const centroVisorY =
            visor.top + (visor.height / 2);


        const centroImagenY =
            imagen.top + (imagen.height / 2);


        desplazamientoY +=
            centroVisorY - centroImagenY;

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
// El zoom se controla exclusivamente con:
//
// - rueda del mouse (desktop)
// - pinch con dos dedos (mobile)
//
// Ambos terminan en actualizarEscala().
//
// El paneo con un puntero
// solamente está disponible cuando escala > 1.
//
// /////////////////////////////////////////////////////////////////////////////

function activarZoom() {


    if (!viewerImage) return;




    // /////////////////////////////////////////////////////////////////////////////
    // ZOOM CON RUEDA DEL MOUSE (DESKTOP)
    //
    // Comportamiento asimétrico:
    //
    // ZOOM IN (rueda arriba)
    // -> el punto donde está el cursor
    //   permanece aproximadamente bajo el cursor.
    //
    // ZOOM OUT (rueda abajo)
    // -> el puntero no controla el centro.
    // -> el desplazamiento se reduce proporcional
    //   a la escala, por lo que la imagen vuelve
    //   al centro de forma gradual.
    // -> al llegar a escala 1 queda perfectamente
    //   centrada.
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


            const escalaAnterior =
                escala;

            // deltaY negativo = rueda arriba = zoom in
            // deltaY positivo = rueda abajo = zoom out

            let nuevaEscala =
                escalaAnterior + event.deltaY * -0.003;

            // Límites de la escala.
            nuevaEscala =
                Math.min(5, Math.max(1, nuevaEscala));

            // Si la escala no cambia,
            // no hay nada que redibujar.
            if (nuevaEscala === escalaAnterior) {
                return;
            }


            const factor =
                nuevaEscala / escalaAnterior;


            if (nuevaEscala > escalaAnterior) {

                // =========================================
                // ZOOM IN
                //
                // La zona sobre el cursor permanece
                // aproximadamente bajo el cursor.
                // =========================================

                const rect =
                    viewerImage.getBoundingClientRect();


                const punteroX =
                    event.clientX - (rect.left + rect.width / 2);


                const punteroY =
                    event.clientY - (rect.top + rect.height / 2);


                desplazamientoX +=
                    punteroX * (1 - factor);


                desplazamientoY +=
                    punteroY * (1 - factor);

            } else {

                // =========================================
                // ZOOM OUT
                //
                // El puntero no controla el centro.
                //
                // El desplazamiento se multiplica por el
                // factor de escala: mientras la imagen
                // se achica, vuelve al centro de forma
                // gradual. Al llegar a escala 1
                // ya es exactamente 0.
                // =========================================

                desplazamientoX *= factor;
                desplazamientoY *= factor;

            }


            // Centralizar el cambio:
            // - cursor
            // - límites de desplazamiento
            // - transformación final
            actualizarEscala(nuevaEscala);

        },
        {
            passive: false
        }
    );

    // /////////////////////////////////////////////////////////////////////////////
    // PANEO Y PINCH ZOOM (POINTER EVENTS)
    //
    // Un puntero (dedo o mouse):
    // -> paneo cuando escala > 1
    //
    // Dos punteros (dos dedos):
    // -> pinch zoom
    // -> el paneo se cancela mientras dura el gesto
    // -> al soltar un dedo, el paneo puede retomar
    //   desde el dedo restante
    //
    // /////////////////////////////////////////////////////////////////////////////

    // Registrar el inicio de un puntero.
    viewerImage.addEventListener(
        "pointerdown",
        (event) => {

            pointers.set(
                event.pointerId,
                {
                    x: event.clientX,
                    y: event.clientY
                }
            );

            // Mantener la captura del puntero
            // aunque salga de la imagen.
            viewerImage.setPointerCapture(event.pointerId);


            // Dos punteros activos: comienza el pinch.
            if (pointers.size === 2) {

                // Cancelar cualquier paneo en curso.
                arrastrando = false;

                // Guardar el estado inicial del gesto.
                const [p1, p2] =
                    [...pointers.values()];

                const rect =
                    viewerImage.getBoundingClientRect();

                pinchInicio = {

                    // Distancia entre los dos dedos.
                    distancia:
                        distanciaEntre(p1, p2),

                    // Punto medio entre los dos dedos.
                    medioX:
                        (p1.x + p2.x) / 2,

                    medioY:
                        (p1.y + p2.y) / 2,

                    // Estado de la imagen al comenzar.
                    escala: escala,

                    desplazamientoX: desplazamientoX,
                    desplazamientoY: desplazamientoY,

                    // Centro de la imagen en pantalla.
                    centroX:
                        rect.left + rect.width / 2,

                    centroY:
                        rect.top + rect.height / 2

                };

                pinchActivo = true;

                return;

            }


            // Un puntero sobre la imagen ampliada:
            // comienza el paneo.
            //
            // Si ya hay un pinch en curso (tercer dedo),
            // no se inicia ningún paneo.
            if (escala > 1 && !pinchActivo) {

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

            }

        }
    );

    // Mover punteros y aplicar gestos.
    viewerImage.addEventListener(
        "pointermove",
        (event) => {

            // Solo punteros registrados sobre la imagen.
            if (!pointers.has(event.pointerId)) {
                return;
            }

            // Actualizar la posición del puntero.
            pointers.set(
                event.pointerId,
                {
                    x: event.clientX,
                    y: event.clientY
                }
            );


            // =========================================
            // PINCH ZOOM
            // =========================================

            if (pinchActivo && pointers.size === 2) {

                const [p1, p2] =
                    [...pointers.values()];

                const distancia =
                    distanciaEntre(p1, p2);

                const medioX =
                    (p1.x + p2.x) / 2;

                const medioY =
                    (p1.y + p2.y) / 2;

                // La escala sigue la distancia de los
                // dedos respecto del inicio del gesto.
                let nuevaEscala =
                    pinchInicio.escala *
                    (distancia / pinchInicio.distancia);

                nuevaEscala =
                    Math.min(5, Math.max(1, nuevaEscala));

                if (nuevaEscala === escala) {
                    return;
                }

                const factor =
                    nuevaEscala / pinchInicio.escala;

                // El punto medio de los dedos actúa como
                // referencia del zoom: la zona entre los
                // dedos permanece aproximadamente fija.
                //
                // desplazamiento final =
                //   desplazamiento inicial
                //   + movimiento del punto medio
                //   + compensación por cambio de escala
                desplazamientoX =
                    pinchInicio.desplazamientoX +
                    (medioX - pinchInicio.medioX) +
                    (pinchInicio.centroX - pinchInicio.medioX) * (factor - 1);

                desplazamientoY =
                    pinchInicio.desplazamientoY +
                    (medioY - pinchInicio.medioY) +
                    (pinchInicio.centroY - pinchInicio.medioY) * (factor - 1);

                actualizarEscala(nuevaEscala);

                return;

            }


            // =========================================
            // PANEO
            // =========================================

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
            desplazamientoX =
                inicioDesplazamientoX +
                movimientoX;

            desplazamientoY =
                inicioDesplazamientoY +
                movimientoY;

            // Mantener el desplazamiento dentro
            // de los límites permitidos.
            limitarDesplazamiento();

            // Aplicar la nueva transformación.
            actualizarTransform();

        }
    );

    // Finalizar el gesto cuando
    // el usuario suelta un puntero.
    viewerImage.addEventListener(
        "pointerup",
        (event) => {

            pointers.delete(event.pointerId);

            // Si quedan menos de dos punteros,
            // el pinch termina.
            if (pointers.size < 2) {
                pinchActivo = false;
                pinchInicio = null;
            }

            // Queda un dedo sobre la imagen ampliada:
            // retomar el paneo desde ese punto.
            if (pointers.size === 1 && escala > 1) {

                const [p] =
                    [...pointers.values()];

                arrastrando = true;

                inicioX = p.x;
                inicioY = p.y;

                inicioDesplazamientoX =
                    desplazamientoX;

                inicioDesplazamientoY =
                    desplazamientoY;

                viewerImage.style.cursor =
                    "grabbing";

            } else if (pointers.size === 0) {

                // Ya no hay punteros activos.
                arrastrando = false;

                // Solo cambiar el cursor si la imagen
                // continúa ampliada.
                if (escala > 1) {

                    viewerImage.style.cursor =
                        "grab";

                }

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

    // Cancelar el gesto si el navegador
    // interrumpe los punteros.
    viewerImage.addEventListener(
        "pointercancel",
        () => {

            // Finalizar cualquier arrastre o pinch activo.
            arrastrando = false;

            pinchActivo = false;
            pinchInicio = null;

            pointers.clear();

            // Devolver el cursor correcto
            // según el estado de la escala.
            if (escala > 1) {

                viewerImage.style.cursor =
                    "grab";

            } else {

                viewerImage.style.cursor =
                    "zoom-in";

            }

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