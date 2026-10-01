// /////////////////////////////////////////////////////////////////////////////
// TIENDA — CATÁLOGO (v1.3)
//
// Fuente de datos:
// API REST del e-commerce separado (GET /api/productos)
// consumida mediante scripts/api/tiendaClient.js
//
// Este archivo solamente se encarga
// de renderizar pages/tienda.html
//
// MVP: catálogo de lectura.
// Sin carrito, checkout ni pagos.
// /////////////////////////////////////////////////////////////////////////////

// /////////////////////////////////////////////////////////////////////////////
// ELEMENTOS
// /////////////////////////////////////////////////////////////////////////////

const catalogoContainer =
    document.querySelector("#catalogo");

const estadoContainer =
    document.querySelector("#catalogo-estado");

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
// RENDER CARGA
// /////////////////////////////////////////////////////////////////////////////

function renderCatalogo(productos) {

    if (!catalogoContainer) return;

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

    productos.forEach(producto => {

        const disponible =
            producto.disponibilidad > 0;

        const disponibilidadTexto = disponible

            ? `Disponibilidad: ${producto.disponibilidad}`

            : `Disponibilidad: ${producto.disponibilidad} (agotado)`;

        catalogoContainer.innerHTML += `

            <article class="producto-card">

                <h2>${producto.nombre}</h2>

                <p class="producto-descripcion">
                    ${producto.descripcion}
                </p>

                <p class="producto-precio">
                    ${formatoPrecio.format(producto.precio)}
                </p>

                <p class="producto-disponibilidad${disponible ? "" : " agotado"}">
                    ${disponibilidadTexto}
                </p>

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

        return;

    }

    renderCatalogo(resultado.data);

}

// /////////////////////////////////////////////////////////////////////////////
// INICIALIZACIÓN
// /////////////////////////////////////////////////////////////////////////////

cargarCatalogo();
