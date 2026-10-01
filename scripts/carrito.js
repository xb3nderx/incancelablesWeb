// /////////////////////////////////////////////////////////////////////////////
// CARRITO — ESTADO Y PERSISTENCIA (Bloque 2 · parte 2)
//
// Persistencia: sessionStorage (se limpia al cerrar la pestaña).
//
// Formato de cada ítem:
// { producto_id, nombre, precio_unitario, cantidad, disponibilidad }
//
// Alcance de esta parte:
// - agregar unidades desde el catálogo (1 por clic);
// - límite de unidades según la disponibilidad informativa;
// - total de unidades y total monetario;
// - disponibilidad mostrada = disponibilidad_API - cantidad en carrito;
// - editar cantidades (+ / -) y eliminar ítems desde el drawer;
// - sincronización de nombre, precio y disponibilidad contra la API.
//
// Fuera de alcance:
// checkout, pagos y llamadas al backend de pedidos.
// /////////////////////////////////////////////////////////////////////////////

// /////////////////////////////////////////////////////////////////////////////
// CLAVE DE PERSISTENCIA
// /////////////////////////////////////////////////////////////////////////////

const CARRITO_STORAGE_KEY = "incancelables_carrito";

// /////////////////////////////////////////////////////////////////////////////
// UTILIDADES
// /////////////////////////////////////////////////////////////////////////////

function aNumero(valor, respaldo = 0) {

    const numero = Number(valor);

    return Number.isFinite(numero)
        ? numero
        : respaldo;

}

function claveId(valor) {

    return String(valor);

}

function obtenerIdProducto(producto) {

    if (!producto) return null;

    const id =
        producto.producto_id ?? producto.id ?? producto._id;

    if (id === null || id === undefined || id === "") return null;

    return id;

}

// /////////////////////////////////////////////////////////////////////////////
// LECTURA / ESCRITURA
// /////////////////////////////////////////////////////////////////////////////

export function obtenerCarrito() {

    try {

        const crudo =
            sessionStorage.getItem(CARRITO_STORAGE_KEY);

        if (!crudo) return [];

        const items = JSON.parse(crudo);

        return Array.isArray(items)
            ? items
            : [];

    } catch (error) {

        // Storage inválido o dato corrupto: se arranca vacío.
        return [];

    }

}

function guardarCarrito(items) {

    try {

        sessionStorage.setItem(
            CARRITO_STORAGE_KEY,
            JSON.stringify(items)
        );

    } catch (error) {

        // sessionStorage no disponible: no hay dónde persistir.

    }

}

// /////////////////////////////////////////////////////////////////////////////
// TOTAL DE UNIDADES (BADGE)
// /////////////////////////////////////////////////////////////////////////////

export function obtenerTotalUnidades() {

    return obtenerCarrito().reduce(
        (total, item) => total + aNumero(item.cantidad, 0),
        0
    );

}

// Totales informativos del carrito (sin impuestos ni envío):
// unidades totales y suma de cantidad * precio_unitario.

export function obtenerTotales() {

    return obtenerCarrito().reduce(
        (totales, item) => {

            const cantidad = aNumero(item.cantidad, 0);

            totales.unidades += cantidad;

            totales.total +=
                cantidad * aNumero(item.precio_unitario, 0);

            return totales;

        },
        { unidades: 0, total: 0 }
    );

}

// /////////////////////////////////////////////////////////////////////////////
// DISPONIBILIDAD MOSTRADA (SOLO PRESENTACIÓN)
// /////////////////////////////////////////////////////////////////////////////

// Unidades que todavía puede agregar el usuario a SU carrito:
//
// disponibilidad_mostrada = disponibilidad_API - cantidad_en_carrito
//
// Ejemplo: API = 10, carrito = 3 => se muestran 7.
//
// No modifica la disponibilidad base del ítem ni la de la API:
// es un cálculo de lectura sobre sessionStorage, por lo que
// se reconstruye en cada render y vuelve a crecer si baja
// la cantidad en el carrito.

export function obtenerCantidadDeProducto(productoId) {

    if (
        productoId === null ||
        productoId === undefined ||
        productoId === ""
    ) return 0;

    const item = obtenerCarrito().find(
        i => claveId(i.producto_id) === claveId(productoId)
    );

    return item
        ? aNumero(item.cantidad, 0)
        : 0;

}

export function obtenerDisponibilidadMostrada(producto) {

    const base = aNumero(producto?.disponibilidad, 0);

    const enCarrito = obtenerCantidadDeProducto(
        obtenerIdProducto(producto)
    );

    // Nunca negativa: si la cantidad excede la base, se muestra 0.
    return Math.max(base - enCarrito, 0);

}

// /////////////////////////////////////////////////////////////////////////////
// AGREGAR AL CARRITO
// /////////////////////////////////////////////////////////////////////////////

// Cada clic suma 1 unidad. Nunca supera la disponibilidad informativa.
//
// Devuelve:
// { ok: true,  motivo: "",        item }
// { ok: false, motivo: "sin_stock" | "limite" | "sin_id", disponibilidad? }

export function agregarProducto(producto) {

    const id = obtenerIdProducto(producto);

    if (id === null) {

        return { ok: false, motivo: "sin_id" };

    }

    const disponibilidad =
        aNumero(producto.disponibilidad, 0);

    if (disponibilidad <= 0) {

        return {
            ok: false,
            motivo: "sin_stock",
            disponibilidad: 0
        };

    }

    const carrito = obtenerCarrito();

    const existente = carrito.find(
        item => claveId(item.producto_id) === claveId(id)
    );

    // ---------------------------------------------------------
    // ÍTEM NUEVO
    // ---------------------------------------------------------

    if (!existente) {

        const item = {
            producto_id: id,
            nombre: producto.nombre,
            precio_unitario: aNumero(producto.precio),
            cantidad: 1,
            disponibilidad
        };

        carrito.push(item);

        guardarCarrito(carrito);

        return { ok: true, motivo: "", item };

    }

    // ---------------------------------------------------------
    // ÍTEM EXISTENTE
    // Se refrescan los datos informativos y se valida el límite.
    // ---------------------------------------------------------

    existente.nombre = producto.nombre;
    existente.precio_unitario = aNumero(
        producto.precio,
        existente.precio_unitario
    );
    existente.disponibilidad = disponibilidad;

    if (existente.cantidad >= disponibilidad) {

        guardarCarrito(carrito);

        return {
            ok: false,
            motivo: "limite",
            disponibilidad,
            item: existente
        };

    }

    existente.cantidad += 1;

    guardarCarrito(carrito);

    return { ok: true, motivo: "", item: existente };

}

// /////////////////////////////////////////////////////////////////////////////
// EDICIÓN DEL CARRITO (DRAWER: + / − / ELIMINAR)
// /////////////////////////////////////////////////////////////////////////////

function encontrarItem(carrito, productoId) {

    if (
        productoId === null ||
        productoId === undefined ||
        productoId === ""
    ) return null;

    return carrito.find(
        item => claveId(item.producto_id) === claveId(productoId)
    ) ?? null;

}

// +1 unidad. Respeta la disponibilidad base conocida del ítem.
//
// Devuelve:
// { ok: true,  motivo: "actualizado", item }
// { ok: false, motivo: "limite" | "no_encontrado", disponibilidad? }

export function aumentarCantidad(productoId) {

    const carrito = obtenerCarrito();

    const item = encontrarItem(carrito, productoId);

    if (!item) {

        return { ok: false, motivo: "no_encontrado" };

    }

    const cantidad = aNumero(item.cantidad, 0);

    const base = aNumero(item.disponibilidad, 0);

    if (cantidad >= base) {

        return {
            ok: false,
            motivo: "limite",
            disponibilidad: base,
            item
        };

    }

    item.cantidad = cantidad + 1;

    guardarCarrito(carrito);

    return { ok: true, motivo: "actualizado", item };

}

// −1 unidad. Si la cantidad es 1, el ítem se elimina.
//
// Devuelve:
// { ok: true, motivo: "actualizado" | "eliminado", item }
// { ok: false, motivo: "no_encontrado" }

export function disminuirCantidad(productoId) {

    const carrito = obtenerCarrito();

    const item = encontrarItem(carrito, productoId);

    if (!item) {

        return { ok: false, motivo: "no_encontrado" };

    }

    if (aNumero(item.cantidad, 0) <= 1) {

        return eliminarProducto(productoId);

    }

    item.cantidad = aNumero(item.cantidad, 0) - 1;

    guardarCarrito(carrito);

    return { ok: true, motivo: "actualizado", item };

}

// Quita el ítem del carrito directamente.

export function eliminarProducto(productoId) {

    const carrito = obtenerCarrito();

    if (!encontrarItem(carrito, productoId)) {

        return { ok: false, motivo: "no_encontrado" };

    }

    guardarCarrito(
        carrito.filter(
            item => !(claveId(item.producto_id) === claveId(productoId))
        )
    );

    return { ok: true, motivo: "eliminado" };

}

// /////////////////////////////////////////////////////////////////////////////
// SINCRONIZACIÓN CONTRA LA API
// /////////////////////////////////////////////////////////////////////////////

// Al cargar el catálogo se refrescan nombre, precio_unitario y
// disponibilidad de cada ítem guardado.
//
// La cantidad NUNCA se reduce sola: si supera la disponibilidad
// vigente, el ítem queda marcado como excedido y no se pueden
// agregar más unidades hasta corregirlo.

export function sincronizarConCatalogo(productos) {

    const resultado = {
        actualizados: 0,
        excedidos: 0
    };

    if (!Array.isArray(productos)) return resultado;

    const carrito = obtenerCarrito();

    if (carrito.length === 0) return resultado;

    const porId = new Map();

    productos.forEach(producto => {

        const id = obtenerIdProducto(producto);

        if (id !== null) {

            porId.set(claveId(id), producto);

        }

    });

    let huboCambios = false;

    carrito.forEach(item => {

        const producto =
            porId.get(claveId(item.producto_id));

        // Producto ausente del catálogo: se conserva el dato tal cual.
        if (!producto) return;

        const nombre =
            producto.nombre ?? item.nombre;

        const precioUnitario = aNumero(
            producto.precio,
            item.precio_unitario
        );

        const disponibilidad = aNumero(
            producto.disponibilidad,
            item.disponibilidad
        );

        const cambio =
            item.nombre !== nombre ||
            item.precio_unitario !== precioUnitario ||
            item.disponibilidad !== disponibilidad;

        if (cambio) {

            huboCambios = true;

            resultado.actualizados += 1;

        }

        item.nombre = nombre;
        item.precio_unitario = precioUnitario;
        item.disponibilidad = disponibilidad;

    });

    if (huboCambios) {

        guardarCarrito(carrito);

    }

    resultado.excedidos = carrito.filter(
        item => aNumero(item.cantidad, 0) > aNumero(item.disponibilidad, 0)
    ).length;

    return resultado;

}
