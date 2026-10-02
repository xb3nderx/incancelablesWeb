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
// El drawer del carrito también presenta el checkout:
// formulario de datos del comprador y envío del pedido
// mediante crearPedido() (Bloque 3).
// Pendiente: verificación y reenvío de email, pago y cancelación.
// /////////////////////////////////////////////////////////////////////////////

import {
    agregarProducto,
    aplicarCorreccion,
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

// Zona del checkout dentro del mismo drawer (hermana de la lista)
const checkoutDatos =
    document.querySelector("#checkout-datos");

const checkoutVolver =
    document.querySelector("#checkout-volver");

const checkoutNombre =
    document.querySelector("#checkout-nombre");

const checkoutApellido =
    document.querySelector("#checkout-apellido");

const checkoutEmail =
    document.querySelector("#checkout-email");

const checkoutEnviar =
    document.querySelector("#checkout-enviar");

const checkoutEstado =
    document.querySelector("#checkout-estado");

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
// CHECKOUT — DATOS DEL COMPRADOR (Bloque 3 · paso 2)
// ---------------------------------------------------------------------------
//
// Sólo presentación: el clic en "Continuar compra" cambia la zona
// central del drawer del listado de ítems al formulario de datos.
//
// - El drawer, su cabecera, su foco atrapado y su cierre (×, overlay y
//   Escape) siguen siendo los mismos de siempre.
// - El carrito NO se escribe ni se vacía: sólo se oculta la zona de la
//   lista y se muestra la del formulario.

function mostrarCheckout() {

    restablecerCheckout();

    if (checkoutDatos) checkoutDatos.hidden = false;

    if (listaCarrito) listaCarrito.hidden = true;

    if (botonContinuarCompra) botonContinuarCompra.hidden = true;

    checkoutNombre?.focus();

}

function volverAlCarrito() {

    if (checkoutDatos) checkoutDatos.hidden = true;

    if (listaCarrito) listaCarrito.hidden = false;

    if (botonContinuarCompra) botonContinuarCompra.hidden = false;

    botonContinuarCompra?.focus();

}

// ---------------------------------------------------------------------------
// CHECKOUT — ENVÍO DEL PEDIDO (Bloque 3 · paso 3)
// ---------------------------------------------------------------------------
//
// Caminos implementados: 201 / resultado "creado" y
// 200 / resultado "correccion".
//
// - Se valida el formulario, se congela el botón mientras viaja la
//   petición y se arma items con el snapshot actual del carrito.
// - 200 "correccion" frena el flujo, explica el detalle real de motivos[]
//   y deja el carrito tal como lo propuso el backend
//   (aplicarCarritoCorregido()). El catálogo se refresca con
//   GET /api/productos y el botón pasa a "Reintentar compra": al volver
//   a enviar se relee el carrito vigente.
// - El alta con "creado" no vacía ni modifica el carrito.

// Último pedido creado. Vive en el módulo, así que sobrevive a los
// cambios de vista dentro de la misma carga de la página.
let pedidoCreado = null;

// Evita doble submit mientras crearPedido() está en curso.
let enviandoPedido = false;

export function obtenerPedidoCreado() {

    return pedidoCreado;

}

const EXPRESION_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Texto inicial del botón de envío, tomado del HTML. Tras una corrección
// el botón pasa a pedir la revalidación del carrito corregido y vuelve a
// su texto original al reingresar al formulario.
const ETIQUETA_ENVIAR =
    (checkoutEnviar?.textContent ?? "").trim() || "Realizar pedido";

const ETIQUETA_REINTENTAR = "Reintentar compra";

function mostrarEstadoCheckout(texto, tipo = "") {

    if (!checkoutEstado) return;

    checkoutEstado.className = `checkout-estado ${tipo}`.trim();

    if (texto === "") {

        checkoutEstado.hidden = true;

        checkoutEstado.textContent = "";

        return;

    }

    // Se muestra primero y se escribe después: así aria-live anuncia.
    checkoutEstado.hidden = false;

    checkoutEstado.textContent = texto;

}

// ---------------------------------------------------------------------------
// CHECKOUT — DETALLE DE motivos[] EN UNA CORRECCIÓN
// ---------------------------------------------------------------------------
//
// Sólo presentación: nunca se escribe el carrito ni el storage.
//
// El nombre se resuelve con lo que el frontend ya tiene (sin llamadas al
// backend): primero el catálogo en memoria y después el carrito, que sólo
// se LEE. Si no se puede resolver se usa una identificación neutra con el
// producto_id: el motivo jamás se oculta.

function nombreDeProducto(productoId) {

    if (productoId === undefined || productoId === null) return null;

    const clave = String(productoId);

    const enCatalogo = catalogoActual.find(
        producto => String(producto?.id) === clave
    );

    if (enCatalogo?.nombre) return String(enCatalogo.nombre);

    const enCarrito = obtenerCarrito().find(
        item => String(item?.producto_id) === clave
    );

    if (enCarrito?.nombre) return String(enCarrito.nombre);

    return null;

}

function identificacionDeProducto(productoId) {

    const nombre = nombreDeProducto(productoId);

    if (nombre) return nombre;

    if (productoId === undefined || productoId === null) return "Producto";

    return `Producto #${productoId}`;

}

// Una línea por entrada de motivos[]. Dos motivos para el mismo producto
// salen como dos líneas: nada se fusiona ni se descarta.
function textoDeMotivo(entrada) {

    // Entrada fuera de contrato (p. ej. un string): se muestra tal cual.
    if (entrada === null || typeof entrada !== "object") {

        const crudo = String(entrada ?? "").trim();

        return crudo === "" ? null : crudo;

    }

    const nombre = identificacionDeProducto(entrada.producto_id);

    switch (entrada.motivo) {

        case "precio_cambiado": {

            const precio = Number(entrada.precio_actual);

            return Number.isFinite(precio)
                ? `${nombre}: cambió el precio. Ahora cuesta ${formatoPrecio.format(precio)}.`
                : `${nombre}: cambió el precio.`;

        }

        case "disponibilidad_insuficiente": {

            const disponibles = Number(entrada.disponibilidad_actual);

            if (!Number.isFinite(disponibles)) {

                return `${nombre}: no hay suficiente disponibilidad.`;

            }

            return `${nombre}: no hay suficiente disponibilidad. Quedan ` +
                `${disponibles} ${disponibles === 1 ? "unidad" : "unidades"}.`;

        }

        case "producto_no_disponible":
            return `${nombre}: ya no está disponible.`;

        case "producto_inexistente":
            return `${nombre}: ya no está disponible en el catálogo.`;

        default:
            return `${nombre}: no se pudo crear el pedido por un cambio ` +
                `(${String(entrada.motivo ?? "sin detalle")}).`;

    }

}

// Agrega el detalle bajo el mensaje general. Va dentro de #checkout-estado
// (role="status") para que el lector de pantalla anuncie mensaje y lista
// juntos; el foco sigue cayendo en el propio estado.
function mostrarDetalleDeMotivos(motivos) {

    if (!checkoutEstado) return;

    const textos = (Array.isArray(motivos) ? motivos : [])

        .map(textoDeMotivo)

        .filter(texto => texto !== null);

    if (textos.length === 0) return;

    const lista = document.createElement("ul");

    lista.className = "checkout-motivos";

    textos.forEach(texto => {

        const item = document.createElement("li");

        item.textContent = texto;

        lista.appendChild(item);

    });

    checkoutEstado.appendChild(lista);

}

function restablecerCheckout() {

    // Sólo la vista: los valores tipeados no se tocan.
    mostrarEstadoCheckout("", "");

    [checkoutNombre, checkoutApellido, checkoutEmail].forEach(campo => {

        if (campo) campo.disabled = false;

    });

    if (checkoutEnviar) {

        checkoutEnviar.hidden = false;

        checkoutEnviar.disabled = false;

        checkoutEnviar.textContent = ETIQUETA_ENVIAR;

    }

    enviandoPedido = false;

}

function leerDatosCheckout() {

    const nombre = (checkoutNombre?.value ?? "").trim();

    const apellido = (checkoutApellido?.value ?? "").trim();

    const email = (checkoutEmail?.value ?? "").trim();

    if (nombre !== "" && apellido !== "" && EXPRESION_EMAIL.test(email)) {

        return { nombre, apellido, email };

    }

    // En el navegador ya frenó la validación nativa (required y
    // type=email); esto cubre el envío programático y los navegadores
    // que no interpretan type=email.
    if (nombre === "") checkoutNombre?.focus();
    else if (apellido === "") checkoutApellido?.focus();
    else checkoutEmail?.focus();

    mostrarEstadoCheckout("Revisá los datos del formulario.", "error");

    return null;

}

function construirItemsPedido() {

    // Snapshot del carrito: sólo los campos que espera el backend.
    return obtenerCarrito().map(item => ({

        producto_id: item.producto_id,

        cantidad: item.cantidad,

        precio_unitario: item.precio_unitario

    }));

}

// ---------------------------------------------------------------------------
// CHECKOUT — APLICACIÓN DE carrito_corregido
// ---------------------------------------------------------------------------
//
// El backend responde con el carrito que sí se puede validar: ese pasa a
// ser el carrito de la tienda (aplicarCorreccion() de carrito.js).
//
// Después sólo se refresca la presentación con la infraestructura
// existente: badge, lista/totales del drawer y catálogo (GET
// /api/productos + sincronizarConCatalogo), que es lo que sostiene la
// disponibilidad mostrada = disponibilidad_API - cantidad_en_carrito.

async function aplicarCarritoCorregido(corregido) {

    const aplicacion = aplicarCorreccion(corregido);

    // El refresco del catálogo puede completar nombre, precio y
    // disponibilidad de los ítems que venían sin ellos: la lista del
    // drawer se pinta después de la sincronización.
    await cargarCatalogo();

    if (aplicacion.ok) {

        actualizarBadgeCarrito();

        renderCarrito();

    }

}

async function manejarEnvioPedido(evento) {

    evento?.preventDefault?.();

    if (enviandoPedido) return;

    const datos = leerDatosCheckout();

    if (!datos) return;

    const items = construirItemsPedido();

    if (items.length === 0) {

        mostrarEstadoCheckout("Tu carrito está vacío.", "error");

        return;

    }

    enviandoPedido = true;

    if (checkoutEnviar) checkoutEnviar.disabled = true;

    // El foco no puede quedarse en un botón recién deshabilitado:
    // saldría del atrapado del panel.
    mostrarEstadoCheckout("Enviando tu pedido…", "");

    checkoutEstado?.focus();

    const respuesta = await crearPedido({

        email: datos.email,

        nombre: datos.nombre,

        apellido: datos.apellido,

        items

    });

    enviandoPedido = false;

    if (checkoutEnviar) checkoutEnviar.disabled = false;

    // ----------------------------------------------------------
    // 201 · resultado "creado": el pedido se dio de alta
    // ----------------------------------------------------------
    if (respuesta?.ok && respuesta.data?.resultado === "creado") {

        const pedido = respuesta.data.pedido ?? {};

        pedidoCreado = {

            id: pedido.id ?? null,

            estado: pedido.estado ?? null

        };

        mostrarEstadoCheckout(
            `Pedido creado. Te enviamos la verificación a ${datos.email}. Revisá tu correo para continuar.`,
            "exito"
        );

        [checkoutNombre, checkoutApellido, checkoutEmail].forEach(campo => {

            if (campo) campo.disabled = true;

        });

        if (checkoutEnviar) checkoutEnviar.hidden = true;

        checkoutEstado?.focus();

        return;

    }

    // ----------------------------------------------------------
    // 200 · resultado "correccion": no hubo alta y no se avanza.
    // Se explica qué cambió en cada producto (motivos[]) y el
    // carrito queda tal como lo propuso el backend.
    // ----------------------------------------------------------
    if (respuesta?.ok && respuesta.data?.resultado === "correccion") {

        mostrarEstadoCheckout(
            "El pedido todavía no se creó: hubo cambios en tu carrito. " +
            "Revisá el detalle y volvé a intentar.",
            ""
        );

        // Antes de aplicar la corrección: los nombres se resuelven con el
        // carrito previo, que es el que el usuario todavía conoce.
        mostrarDetalleDeMotivos(respuesta.data?.motivos);

        // La siguiente validación se dispara con el carrito corregido.
        if (checkoutEnviar) checkoutEnviar.textContent = ETIQUETA_REINTENTAR;

        checkoutEstado?.focus();

        await aplicarCarritoCorregido(respuesta.data?.carrito_corregido);

        return;

    }

    // ----------------------------------------------------------
    // Errores técnicos y de validación del backend (400, 404, 500,
    // timeout, sin conexión…): se muestra message y se permite
    // corregir/reintentar sin perder lo tipeado.
    // ----------------------------------------------------------
    mostrarEstadoCheckout(
        respuesta?.message || "No fue posible crear el pedido. Intentá nuevamente.",
        "error"
    );

    checkoutEstado?.focus();

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

    // Sólo los focoables visibles sirven como límites del atrapado: en
    // la vista de checkout la lista y el botón del pie están ocultos y,
    // si entraran en la lista, el Tab se saldría del panel.
    const foco = [...panelCarrito.querySelectorAll(FOCO_PANEL)]
        .filter(elemento => elemento.getClientRects().length > 0);

    if (foco.length === 0) return;

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

    // Checkout (Bloque 3): el clic presenta el formulario de datos
    // del comprador dentro del mismo drawer.
    botonContinuarCompra?.addEventListener("click", mostrarCheckout);

    checkoutVolver?.addEventListener("click", volverAlCarrito);

    // El envío es un submit del formulario: el pedido se crea en
    // manejarEnvioPedido().
    checkoutDatos?.addEventListener("submit", manejarEnvioPedido);

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
