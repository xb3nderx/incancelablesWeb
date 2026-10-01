// /////////////////////////////////////////////////////////////////////////////
// TIENDA — CATÁLOGO + CARRITO (Bloque 2 · parte 2)
//
// Fuente de datos:
// API REST del e-commerce separado (GET /api/productos)
// consumida mediante scripts/api/tiendaClient.js
//
// Carrito:
// scripts/carrito.js (persistido en sessionStorage).
// Cada clic en "Agregar al carrito" suma 1 unidad,
// sin superar la disponibilidad informativa.
// El botón del carrito abre un drawer responsive con
// cantidades (+ / −), eliminar y totales informativos.
//
// Este archivo solamente se encarga
// de renderizar pages/tienda.html
//
// Pendiente: checkout y pagos (por ahora solo un aviso).
// /////////////////////////////////////////////////////////////////////////////

import {
    agregarProducto,
    aumentarCantidad,
    disminuirCantidad,
    eliminarProducto,
    obtenerCarrito,
    obtenerDisponibilidadMostrada,
    obtenerTotales,
    obtenerTotalUnidades,
    sincronizarConCatalogo
} from "./carrito.js";

// /////////////////////////////////////////////////////////////////////////////
// ELEMENTOS
// /////////////////////////////////////////////////////////////////////////////

const catalogoContainer =
    document.querySelector("#catalogo");

const estadoContainer =
    document.querySelector("#catalogo-estado");

const botonCarrito =
    document.querySelector("#btn-carrito");

const badgeCarrito =
    document.querySelector("#carrito-badge");

const avisoContainer =
    document.querySelector("#tienda-aviso");

const drawerCarrito =
    document.querySelector("#carrito-drawer");

const panelCarrito =
    document.querySelector("#carrito-panel");

const listaCarrito =
    document.querySelector("#carrito-lista");

const pieCarrito =
    document.querySelector("#carrito-pie");

const unidadesCarrito =
    document.querySelector("#carrito-unidades");

const totalCarrito =
    document.querySelector("#carrito-total");

const botonCerrarCarrito =
    document.querySelector("#carrito-cerrar");

const botonContinuarCompra =
    document.querySelector("#carrito-continuar");

// Catálogo cargado en memoria (para resolver el clic por índice)
let catalogoActual = [];

// Estado del drawer
let carritoAbierto = false;

let focoAnterior = null;

// /////////////////////////////////////////////////////////////////////////////
// FORMATO DE PRECIO
// /////////////////////////////////////////////////////////////////////////////

const formatoPrecio =
    new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });

function aNumero(valor) {

    const numero = Number(valor);

    return Number.isFinite(numero)
        ? numero
        : 0;

}

// /////////////////////////////////////////////////////////////////////////////
// AVISO BREVE (FEEDBACK)
// /////////////////////////////////////////////////////////////////////////////

let avisoTimer = null;

function mostrarAviso(texto) {

    if (!avisoContainer) return;

    avisoContainer.textContent = texto;

    avisoContainer.hidden = false;

    clearTimeout(avisoTimer);

    avisoTimer = setTimeout(() => {

        if (avisoContainer) {

            avisoContainer.hidden = true;

            avisoContainer.textContent = "";

        }

    }, 2800);

}

// /////////////////////////////////////////////////////////////////////////////
// BADGE DEL CARRITO
// /////////////////////////////////////////////////////////////////////////////

function actualizarBadgeCarrito() {

    const total = obtenerTotalUnidades();

    if (badgeCarrito) {

        badgeCarrito.textContent = String(total);

        badgeCarrito.classList.toggle(
            "vacio",
            total === 0
        );

    }

    botonCarrito?.setAttribute(
        "aria-label",
        `Carrito, ${total} unidades`
    );

}

// /////////////////////////////////////////////////////////////////////////////
// AGREGAR AL CARRITO
// /////////////////////////////////////////////////////////////////////////////

// Tras cada intento se vuelve a renderizar la tarjeta:
// la disponibilidad mostrada (API - cantidad en carrito) y el
// estado del botón se recalculan desde sessionStorage.

function refrescarCatalogo(indiceFoco = null) {

    // Si el catálogo todavía no cargó, no se pisa
    // el estado de carga / error con un render vacío.
    if (catalogoActual.length === 0) return;

    renderCatalogo(catalogoActual);

    if (indiceFoco === null) return;

    catalogoContainer
        ?.querySelector(`[data-agregar="${indiceFoco}"]`)
        ?.focus();

}

function manejarAgregar(producto, indice) {

    const resultado = agregarProducto(producto);

    actualizarBadgeCarrito();

    refrescarCatalogo(indice);

    // ---------------------------------------------------------
    // RECHAZOS: sin stock o límite alcanzado
    // ---------------------------------------------------------

    if (!resultado.ok) {

        if (resultado.motivo === "sin_stock") {

            mostrarAviso("Sin stock disponible.");

        } else if (resultado.motivo === "limite") {

            mostrarAviso(
                `Alcanzaste la disponibilidad máxima (${resultado.disponibilidad}).`
            );

        } else {

            mostrarAviso("No se pudo agregar el producto.");

        }

        return;

    }

    // ---------------------------------------------------------
    // OK: badge actualizado + feedback breve.
    // El carrito NO se abre en este bloque.
    // ---------------------------------------------------------

    mostrarAviso(
        `Agregado al carrito · ${resultado.item.nombre} (${resultado.item.cantidad} un.)`
    );

}

// /////////////////////////////////////////////////////////////////////////////
// DRAWER DEL CARRITO
// /////////////////////////////////////////////////////////////////////////////

// Selectores de los elementos enfocables dentro del panel.
const FOCO_PANEL =
    'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

// ---------------------------------------------------------------------------
// RENDER DEL DRAWER
// ---------------------------------------------------------------------------

function renderCarrito() {

    if (!listaCarrito) return;

    const items = obtenerCarrito();

    // ---------------------------------------------------------
    // VACÍO: sin totales ni botón de continuar
    // ---------------------------------------------------------

    if (items.length === 0) {

        listaCarrito.innerHTML = `
            <p class="carrito-vacio">Tu carrito está vacío</p>
        `;

        if (pieCarrito) pieCarrito.hidden = true;

        return;

    }

    // ---------------------------------------------------------
    // ÍTEMS: nombre, precio unitario, − cantidad +, subtotal
    // y acción Eliminar
    // ---------------------------------------------------------

    listaCarrito.innerHTML = items

        .map((item, indice) => {

            const cantidad = aNumero(item.cantidad);

            const enMaximo =
                cantidad >= aNumero(item.disponibilidad);

            const subtotal =
                cantidad * aNumero(item.precio_unitario);

            return `

                <article class="carrito-item">

                    <div class="carrito-item-datos">

                        <h3 class="carrito-item-nombre">
                            ${item.nombre}
                        </h3>

                        <p class="carrito-item-precio">
                            ${formatoPrecio.format(aNumero(item.precio_unitario))} c/u
                        </p>

                    </div>

                    <div class="carrito-item-controles">

                        <button
                            class="carrito-control"
                            type="button"
                            data-accion="restar"
                            data-indice="${indice}"
                            aria-label="Restar una unidad">
                            −
                        </button>

                        <span class="carrito-item-cantidad"
                            aria-label="Cantidad">${cantidad}</span>

                        <button
                            class="carrito-control"
                            type="button"
                            data-accion="sumar"
                            data-indice="${indice}"
                            aria-label="Agregar una unidad"${enMaximo ? " disabled" : ""}>
                            +
                        </button>

                        <button
                            class="carrito-eliminar"
                            type="button"
                            data-accion="eliminar"
                            data-indice="${indice}">
                            Eliminar
                        </button>

                    </div>

                    <p class="carrito-item-subtotal">
                        Subtotal: ${formatoPrecio.format(subtotal)}
                    </p>

                </article>

            `;

        })
        .join("");

    // ---------------------------------------------------------
    // TOTALES INFORMATIVOS
    // ---------------------------------------------------------

    if (pieCarrito) pieCarrito.hidden = false;

    const totales = obtenerTotales();

    if (unidadesCarrito) {

        unidadesCarrito.textContent =
            `${totales.unidades} ${totales.unidades === 1 ? "unidad" : "unidades"}`;

    }

    if (totalCarrito) {

        totalCarrito.textContent =
            formatoPrecio.format(totales.total);

    }

}

// ---------------------------------------------------------------------------
// FOCO TRAS MODIFICAR UN ÍTEM
// ---------------------------------------------------------------------------

function restaurarFocoTrasCambio(resultado, accion, indice) {

    if (!listaCarrito) return;

    const controlActualizado =
        resultado.ok && resultado.motivo === "actualizado"
            ? listaCarrito.querySelector(
                `[data-accion="${accion}"][data-indice="${indice}"]`
            )
            : null;

    if (controlActualizado && !controlActualizado.disabled) {

        controlActualizado.focus();

        return;

    }

    // Ítem eliminado o control inhabilitado: el foco pasa
    // al primer control del listado (nunca a otro "Eliminar").
    const primero =
        listaCarrito.querySelector(
            '[data-accion="restar"][data-indice="0"]'
        ) ?? listaCarrito.querySelector("[data-accion]");

    if (primero && !primero.disabled) {

        primero.focus();

        return;

    }

    botonCerrarCarrito?.focus();

}

// ---------------------------------------------------------------------------
// ACCIONES DEL DRAWER (+ / − / ELIMINAR)
// ---------------------------------------------------------------------------

function manejarAccionCarrito(evento) {

    const boton =
        evento.target.closest?.("[data-accion]");

    if (!boton) return;

    const accion = boton.dataset.accion;

    const indice = Number(boton.dataset.indice);

    const item = obtenerCarrito()[indice];

    if (!item) return;

    const productoId = item.producto_id;

    let resultado;

    if (accion === "sumar") {

        resultado = aumentarCantidad(productoId);

    } else if (accion === "restar") {

        resultado = disminuirCantidad(productoId);

    } else if (accion === "eliminar") {

        resultado = eliminarProducto(productoId);

    } else {

        return;

    }

    // ---------------------------------------------------------
    // La escritura en sessionStorage ya la hizo carrito.js:
    // se refrescan badge, drawer y disponibilidad del catálogo.
    // ---------------------------------------------------------

    actualizarBadgeCarrito();

    renderCarrito();

    refrescarCatalogo();

    if (!resultado.ok && resultado.motivo === "limite") {

        mostrarAviso(
            `Alcanzaste la disponibilidad máxima (${resultado.disponibilidad}).`
        );

    }

    restaurarFocoTrasCambio(resultado, accion, indice);

}

// ---------------------------------------------------------------------------
// APERTURA / CIERRE
// ---------------------------------------------------------------------------

function abrirCarrito() {

    if (carritoAbierto || !drawerCarrito) return;

    carritoAbierto = true;

    focoAnterior = document.activeElement;

    renderCarrito();

    drawerCarrito.hidden = false;

    document.body.classList.add("carrito-abierto");

    botonCarrito?.setAttribute("aria-expanded", "true");

    botonCerrarCarrito?.focus();

}

function cerrarCarrito() {

    if (!carritoAbierto || !drawerCarrito) return;

    carritoAbierto = false;

    drawerCarrito.hidden = true;

    document.body.classList.remove("carrito-abierto");

    botonCarrito?.setAttribute("aria-expanded", "false");

    // El foco vuelve al elemento que abrió el drawer.
    const destino =
        focoAnterior && focoAnterior !== document.body
            ? focoAnterior
            : botonCarrito;

    destino?.focus?.();

    focoAnterior = null;

}

// ---------------------------------------------------------------------------
// TECLADO: Escape cierra / Tab atrapado en el panel
// ---------------------------------------------------------------------------

function manejarTecladoCarrito(evento) {

    if (!carritoAbierto) return;

    if (evento.key === "Escape") {

        cerrarCarrito();

        return;

    }

    if (evento.key !== "Tab" || !panelCarrito) return;

    const foco = panelCarrito.querySelectorAll(FOCO_PANEL);

    if (!foco || foco.length === 0) return;

    const primero = foco[0];

    const ultimo = foco[foco.length - 1];

    const actual = document.activeElement;

    if (evento.shiftKey && actual === primero) {

        evento.preventDefault?.();

        ultimo.focus();

    } else if (!evento.shiftKey && actual === ultimo) {

        evento.preventDefault?.();

        primero.focus();

    }

}

// /////////////////////////////////////////////////////////////////////////////
// ESTADOS (CARGA / ERROR / VACÍO)
// /////////////////////////////////////////////////////////////////////////////

function mostrarEstado(texto, tipo = "", conReintento = false) {

    if (!estadoContainer) return;

    estadoContainer.className =
        `catalogo-estado ${tipo}`.trim();

    estadoContainer.innerHTML = conReintento

        ? `
            <p>${texto}</p>

            <button
                id="btn-reintentar"
                class="btn"
                type="button">
                Reintentar
            </button>
        `

        : `
            <p>${texto}</p>
        `;

    estadoContainer.hidden = false;

    if (conReintento) {

        const boton =
            document.querySelector("#btn-reintentar");

        boton?.addEventListener(
            "click",
            cargarCatalogo
        );

    }

}

function ocultarEstado() {

    if (!estadoContainer) return;

    estadoContainer.hidden = true;

    estadoContainer.innerHTML = "";

}

// /////////////////////////////////////////////////////////////////////////////
// PRESENTACIÓN DE LA DISPONIBILIDAD
// /////////////////////////////////////////////////////////////////////////////

// Lo que se muestra es lo que al usuario le falta agregar a SU carrito:
//
// disponibilidad_mostrada = disponibilidad_API - cantidad_en_carrito
//
// Ejemplo: API = 10, carrito = 3 => "Disponibilidad: 7".
//
// Es solo presentación: no se toca la disponibilidad base del ítem,
// ni la de la API, ni el stock. El valor se recalcula en cada render
// desde sessionStorage, por lo que vuelve a crecer si baja la
// cantidad en el carrito.

function obtenerEstadoProducto(producto) {

    const base = Number(producto.disponibilidad);

    const sinStock = !(base > 0);

    const mostrada = obtenerDisponibilidadMostrada(producto);

    // API con stock pero el carrito ya llegó al máximo.
    const maximoAlcanzado = !sinStock && mostrada <= 0;

    const sinUnidades = sinStock || maximoAlcanzado;

    const disponibilidadTexto = sinStock

        ? `Disponibilidad: ${producto.disponibilidad} (agotado)`

        : maximoAlcanzado

            ? `Disponibilidad: 0 (máximo en carrito)`

            : `Disponibilidad: ${mostrada}`;

    const textoBoton = sinStock

        ? "Sin stock"

        : maximoAlcanzado

            ? "Máximo agregado"

            : "Agregar al carrito";

    return {
        sinUnidades,
        disponibilidadTexto,
        textoBoton
    };

}

// /////////////////////////////////////////////////////////////////////////////
// RENDER CARGA
// /////////////////////////////////////////////////////////////////////////////

function renderCatalogo(productos) {

    if (!catalogoContainer) return;

    catalogoActual = productos;

    // ---------------------------------------------------------
    // CATÁLOGO VACÍO
    // ---------------------------------------------------------

    if (productos.length === 0) {

        catalogoContainer.innerHTML = "";

        mostrarEstado(
            "No hay productos disponibles por el momento."
        );

        return;

    }

    ocultarEstado();

    catalogoContainer.innerHTML = "";

    // ---------------------------------------------------------
    // TARJETAS DE PRODUCTO
    // ---------------------------------------------------------

    productos.forEach((producto, indice) => {

        const estado = obtenerEstadoProducto(producto);

        // Sin unidades disponibles para este carrito:
        // "Sin stock" o "Máximo agregado", deshabilitado.
        const botonAgregar = estado.sinUnidades

            ? `
                <button
                    class="btn producto-agregar"
                    type="button"
                    disabled>
                    ${estado.textoBoton}
                </button>
            `

            : `
                <button
                    class="btn producto-agregar"
                    type="button"
                    data-agregar="${indice}">
                    ${estado.textoBoton}
                </button>
            `;

        catalogoContainer.innerHTML += `

            <article class="producto-card">

                <h2>${producto.nombre}</h2>

                <p class="producto-descripcion">
                    ${producto.descripcion}
                </p>

                <p class="producto-precio">
                    ${formatoPrecio.format(producto.precio)}
                </p>

                <p class="producto-disponibilidad${estado.sinUnidades ? " agotado" : ""}">
                    ${estado.disponibilidadTexto}
                </p>

                ${botonAgregar}

            </article>

        `;

    });

}

// /////////////////////////////////////////////////////////////////////////////
// CARGA
// /////////////////////////////////////////////////////////////////////////////

async function cargarCatalogo() {

    if (catalogoContainer) {

        catalogoContainer.innerHTML = "";

    }

    mostrarEstado("Cargando catálogo...");

    const resultado =
        await obtenerCatalogo();

    if (!resultado.ok) {

        mostrarEstado(
            resultado.message,
            "error",
            true
        );

        actualizarBadgeCarrito();

        return;

    }

    // Los ítems guardados se refrescan con los datos de la API.
    const sincronizacion =
        sincronizarConCatalogo(resultado.data);

    if (sincronizacion.excedidos > 0) {

        mostrarAviso(
            "Hay ítems del carrito que superan la disponibilidad actual."
        );

    }

    renderCatalogo(resultado.data);

    actualizarBadgeCarrito();

}

// /////////////////////////////////////////////////////////////////////////////
// CARRITO — ACCESO, DRAWER Y AGREGADO
// /////////////////////////////////////////////////////////////////////////////

function initCarrito() {

    actualizarBadgeCarrito();

    botonCarrito?.setAttribute("aria-expanded", "false");

    // ---------------------------------------------------------
    // DRAWER: apertura y cierre
    // ---------------------------------------------------------

    botonCarrito?.addEventListener("click", abrirCarrito);

    botonCerrarCarrito?.addEventListener("click", cerrarCarrito);

    // Clic fuera: sólo cierra si el clic salió del overlay real.
    // Ojo con delegar por ".carrito-panel": al re-renderizar la lista
    // el nodo queda desenganchado y closest() devolvería null.
    drawerCarrito?.addEventListener("click", evento => {

        const sobreFondo =
            evento.target.closest?.(".carrito-fondo");

        if (sobreFondo) cerrarCarrito();

    });

    document.addEventListener("keydown", manejarTecladoCarrito);

    // ---------------------------------------------------------
    // ÍTEMS: + / − / eliminar
    // ---------------------------------------------------------

    listaCarrito?.addEventListener("click", manejarAccionCarrito);

    // Checkout fuera de alcance: solo feedback, sin backend.
    botonContinuarCompra?.addEventListener("click", () => {

        mostrarAviso("Checkout disponible próximamente.");

    });

    // ---------------------------------------------------------
    // CATÁLOGO: un clic = 1 unidad (delegación)
    // ---------------------------------------------------------

    catalogoContainer?.addEventListener("click", evento => {

        const boton =
            evento.target.closest?.("[data-agregar]");

        if (!boton) return;

        const indice = Number(boton.dataset.agregar);

        const producto = catalogoActual[indice];

        if (!producto) return;

        manejarAgregar(producto, indice);

    });

}

// /////////////////////////////////////////////////////////////////////////////
// INICIALIZACIÓN
// /////////////////////////////////////////////////////////////////////////////

initCarrito();

cargarCatalogo();
