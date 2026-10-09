// ---------------------------------------------------------------------------
// tests/checkoutA.test.mjs
//
// Pruebas del flujo de checkout MVP en la pestaña A (scripts/tienda.js):
// verificación clásica por enlace de email, sin continuidad entre pestañas
// mediante BroadcastChannel.
//
// Cubren los 12 puntos pedidos:
//  1. Pedido creado => mensaje bloqueante visible.
//  2. El carrito permanece intacto mientras el mensaje se muestra.
//  3. No se puede interactuar con otros controles.
//  4. Escape, fondo y X no cierran el mensaje.
//  5. [OK] vacía el carrito y limpia el estado.
//  6. [OK] provoca actualización del catálogo desde el backend.
//  7. No se aplica doble descuento de disponibilidad.
//  8. Errores de checkout no vacían el carrito.
//  9. No se envía dos veces el mismo pedido por doble clic.
// 10. Recarga/restauración tras crear pedido no recupera el carrito anterior.
// 11. Recarga antes de crear pedido conserva el comportamiento normal.
// 12. B continúa con verificación por enlace y recuperación de pedido.
// 13. La marca de pedido creado usa sessionStorage (por pestaña).
// 14. Una pestaña C con carrito propio no resulta afectada por el
//     pedido creado en A, y A conserva su limpieza al recargar.
// 15. El mensaje muestra el email del comprador, insertado con
//     textContent (sin HTML) y sin persistirlo en ningún storage.
//
// tienda.js y carrito.js corren con un DOM / storage falsos. resultado.js se
// evalúa como script clásico con un documento falso. Node puro, sin
// frameworks ni dependencias.
//
// Ejecutar:  node tests/checkoutA.test.mjs
// Sale con código 1 si algún caso falla.
// ---------------------------------------------------------------------------

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const fuenteResultado = fs.readFileSync(
    path.join(RAIZ, "scripts", "resultado.js"),
    "utf8"
);

const fuenteTienda = fs.readFileSync(
    path.join(RAIZ, "scripts", "tienda.js"),
    "utf8"
);

const fuenteHtml = fs.readFileSync(
    path.join(RAIZ, "pages", "tienda.html"),
    "utf8"
);

// ---------------------------------------------------------------------------
// Mini framework de aserciones
// ---------------------------------------------------------------------------

let pasados = 0;
let fallidos = 0;

function ok(condicion, nombre) {

    if (condicion) {
        pasados += 1;
        console.log(`  PASS  ${nombre}`);
    } else {
        fallidos += 1;
        console.log(`  FAIL  ${nombre}`);
    }

}

function igual(obtenido, esperado, nombre) {

    const a = JSON.stringify(obtenido);
    const b = JSON.stringify(esperado);
    ok(a === b, `${nombre} -> esperado ${b}, obtenido ${a}`);

}

async function caso(nombre, fn) {

    console.log(`\n${nombre}`);
    console.log("-".repeat(nombre.length));

    try {
        await fn();
    } catch (error) {
        fallidos += 1;
        console.log(`  FAIL  excepcion: ${error?.stack ?? error}`);
    }

}

function resumen() {

    console.log(`\n${"=".repeat(60)}`);
    console.log(`RESULTADO: ${pasados} pasaron, ${fallidos} fallaron`);
    console.log("=".repeat(60));

    process.exit(fallidos > 0 ? 1 : 0);

}

// Las excepciones asíncronas de un handler no deben tumbar la suite.
process.on("uncaughtException", error => {

    fallidos += 1;
    console.log(`  FAIL  excepcion asincrona: ${error?.stack ?? error}`);

});

process.on("unhandledRejection", error => {

    fallidos += 1;
    console.log(`  FAIL  rechazo asincrono: ${error?.stack ?? error}`);

});

// ---------------------------------------------------------------------------
// Contexto de pestaña + timers con contexto
//
// Los handlers y timers de tienda.js corren FUERA de como(). Para que cada
// continuación vea el document / window / sessionStorage de SU pestaña (como
// en el navegador), se instala el contexto correcto antes de cada timer. El
// contexto es "pegajoso" para las microtasks de esa pestaña; como() sí
// restaura.
// ---------------------------------------------------------------------------

let pestanaActiva = null;

function conContextoDePestana(pane, fn) {

    if (pane) {

        pestanaActiva = pane;
        globalThis.document = pane.documento;
        globalThis.window = pane.ventana;
        globalThis.sessionStorage = pane.sessionStorage;

    }

    return fn();

}

const setTimeoutPropio = globalThis.setTimeout;

globalThis.setTimeout = function (cb, ms, ...args) {

    const pane = pestanaActiva;

    if (!pane) return setTimeoutPropio(cb, ms, ...args);

    return setTimeoutPropio((...a) => {

        conContextoDePestana(pane, () => cb(...a));

    }, ms, ...args);

};

// ---------------------------------------------------------------------------
// Fakes de la API (globals que en el HTML carga tienda.html como scripts)
// ---------------------------------------------------------------------------

const PRODUCTOS = [
    {
        id: 1,
        nombre: "Remera Negra",
        descripcion: "Algodon peinado",
        precio: 1000,
        disponibilidad: 10
    },
    {
        id: 2,
        nombre: "Gorra Azul",
        descripcion: "Gorra ajustable",
        precio: 500,
        disponibilidad: 5
    }
];

const DATOS_OK = {
    nombre: "Ana",
    apellido: "Perez",
    email: "ana@ejemplo.com"
};

const fakes = {};

const contador = {
    crear: 0,
    catalogo: 0
};

function restaurarFakes() {

    fakes.obtenerCatalogo = async () => ({
        ok: true,
        data: PRODUCTOS.map(producto => ({ ...producto }))
    });

    fakes.crearPedido = async () => ({
        ok: false,
        message: "crearPedido no configurado en el test"
    });

    fakes.obtenerPedidosVerificados = async () => ({
        ok: false,
        codigo: "token_invalido"
    });

    fakes.reemplazarPedido = async () => ({
        ok: false,
        codigo: "token_invalido"
    });

    fakes.iniciarPago = async () => ({
        ok: false,
        message: "iniciarPago no configurado en el test"
    });

}

restaurarFakes();

globalThis.obtenerCatalogo = (...a) => {
    contador.catalogo += 1;
    return fakes.obtenerCatalogo(...a);
};
globalThis.crearPedido = (...a) => {
    contador.crear += 1;
    return fakes.crearPedido(...a);
};
globalThis.obtenerPedidosVerificados = (...a) => fakes.obtenerPedidosVerificados(...a);
globalThis.reemplazarPedido = (...a) => fakes.reemplazarPedido(...a);
globalThis.iniciarPago = (...a) => fakes.iniciarPago(...a);

// ---------------------------------------------------------------------------
// Shims de storage (antes de importar carrito.js)
// ---------------------------------------------------------------------------

function crearStorageDummy() {

    const mapa = new Map();

    return {
        getItem: clave => (mapa.has(clave) ? mapa.get(clave) : null),
        setItem: (clave, valor) => { mapa.set(clave, String(valor)); },
        removeItem: clave => { mapa.delete(clave); },
        clear: () => { mapa.clear(); },
        key: i => [...mapa.keys()][i] ?? null,
        _claves: () => [...mapa.keys()],
        _valores: () => [...mapa.values()]
    };

}

// localStorage compartido entre pestañas del mismo perfil (sesión de tests).
globalThis.localStorage = crearStorageDummy();
globalThis.sessionStorage = crearStorageDummy();

const carritoMod = await import(
    pathToFileURL(path.join(RAIZ, "scripts", "carrito.js")).href
);

// ---------------------------------------------------------------------------
// Motor de eventos mínimo (capture / target / burbuja) sobre el DOM falso.
// Respetar stopPropagation / stopImmediatePropagation.
// ---------------------------------------------------------------------------

function despacharEvento(destino, tipo, props = {}) {

    const documento = globalThis.document;

    let detenido = false;
    let detenidoInmediato = false;

    const evento = {
        type: tipo,
        target: destino,
        key: props.key,
        shiftKey: props.shiftKey ?? false,
        defaultPrevented: false,
        preventDefault() { evento.defaultPrevented = true; },
        stopPropagation() { detenido = true; },
        stopImmediatePropagation() { detenido = true; detenidoInmediato = true; }
    };

    for (const clave of Object.keys(props)) {

        if (clave in evento) continue;

        evento[clave] = props[clave];

    }

    const cadena = [];

    let actual = destino;

    while (actual) {

        cadena.push(actual);
        actual = actual._padre ?? null;

    }

    function invocar(nodo, soloCaptura) {

        const lista = nodo?._oyentes?.get(tipo) ?? [];

        for (const entrada of [...lista]) {

            if (Boolean(entrada.captura) !== soloCaptura) continue;

            if (detenidoInmediato) return;

            entrada.fn(evento);

            if (detenidoInmediato) return;

        }

    }

    // Capture: documento y luego de afuera hacia adentro (sin el destino).
    invocar(documento, true);

    for (let i = cadena.length - 1; i >= 1 && !detenido; i -= 1) {

        invocar(cadena[i], true);

    }

    // Target: todos los listeners del destino.
    if (!detenido) invocar(destino, true);
    if (!detenido) invocar(destino, false);

    // Burbuja: del destino hacia el documento.
    for (let i = 1; i < cadena.length && !detenido; i += 1) {

        invocar(cadena[i], false);

    }

    if (!detenido) invocar(documento, false);

    return evento;

}

// ---------------------------------------------------------------------------
// Pestaña: DOM falso local (elementos, document, window, sessionStorage)
// ---------------------------------------------------------------------------

const IDS = [
    "#catalogo",
    "#catalogo-estado",
    "#btn-carrito",
    "#carrito-badge",
    "#tienda-aviso",
    "#carrito-drawer",
    "#carrito-panel",
    "#carrito-lista",
    "#carrito-pie",
    "#carrito-unidades",
    "#carrito-total",
    "#carrito-cerrar",
    "#carrito-continuar",
    "#checkout-datos",
    "#checkout-volver",
    "#checkout-nombre",
    "#checkout-apellido",
    "#checkout-email",
    "#checkout-enviar",
    "#checkout-estado",
    "#carrito-estado",
    "#pedido-creado-overlay",
    "#pedido-creado-email",
    "#pedido-creado-ok"
];

let pestanas = [];

function crearPestana(busqueda = "") {

    const mapaSesion = new Map();
    let foco = null;

    const oyentesDocumento = new Map();
    const oyentesVentana = new Map();
    const elementos = new Map();

    const sessionStoragePane = {
        getItem: clave => (mapaSesion.has(clave) ? mapaSesion.get(clave) : null),
        setItem: (clave, valor) => { mapaSesion.set(clave, String(valor)); },
        removeItem: clave => { mapaSesion.delete(clave); },
        clear: () => { mapaSesion.clear(); },
        key: i => [...mapaSesion.keys()][i] ?? null,
        _claves: () => [...mapaSesion.keys()],
        _valores: () => [...mapaSesion.values()]
    };

    function crearElemento(nombre) {

        const oyentes = new Map();
        const clases = new Set();
        let texto = "";

        const el = {
            nombre,
            id: "",
            className: "",
            hidden: false,
            disabled: false,
            value: "",
            type: "",
            innerHTML: "",
            style: {},
            dataset: {},
            children: [],
            attributes: {},
            _padre: null,
            _oyentes: oyentes,
            classList: {
                add: (...cs) => { cs.forEach(c => clases.add(c)); },
                remove: (...cs) => { cs.forEach(c => clases.delete(c)); },
                toggle: c => (clases.has(c) ? (clases.delete(c), false) : (clases.add(c), true)),
                contains: c => clases.has(c)
            }
        };

        Object.defineProperty(el, "textContent", {
            get() {
                return texto + el.children.map(h => h.textContent).join("");
            },
            set(valor) {
                texto = String(valor);
                el.children = [];
            }
        });

        el.focus = () => { foco = el; };
        el.blur = () => { if (foco === el) foco = null; };
        el.getClientRects = () => [];
        el.addEventListener = (tipo, fn, opciones) => {
            if (!oyentes.has(tipo)) oyentes.set(tipo, []);
            oyentes.get(tipo).push({
                fn,
                captura: Boolean(opciones?.captura ?? opciones)
            });
        };
        el.removeEventListener = (tipo, fn, opciones) => {
            const captura = Boolean(opciones?.captura ?? opciones);
            const lista = oyentes.get(tipo) ?? [];
            const i = lista.findIndex(
                entrada => entrada.fn === fn && Boolean(entrada.captura) === captura
            );
            if (i >= 0) lista.splice(i, 1);
        };
        el.dispatch = (tipo, props) => despacharEvento(el, tipo, props ?? {});
        el.appendChild = hijo => {
            hijo._padre = el;
            el.children.push(hijo);
            return hijo;
        };
        el.contains = nodo => {
            let actual = nodo;
            while (actual) {
                if (actual === el) return true;
                actual = actual._padre ?? null;
            }
            return false;
        };
        el.querySelector = () => null;
        el.querySelectorAll = () => [];
        el.closest = () => null;
        el.setAttribute = (clave, valor) => { el.attributes[clave] = String(valor); };
        el.getAttribute = clave => el.attributes[clave] ?? null;

        return el;

    }

    for (const id of IDS) {
        elementos.set(id, crearElemento(id));
    }

    // Estructura real del mensaje bloqueante (como en pages/tienda.html).
    const overlay = elementos.get("#pedido-creado-overlay");
    overlay.hidden = true;

    const dialogo = crearElemento("div");
    const titulo = crearElemento("h2");
    const texto = crearElemento("p");
    const emailSpan = elementos.get("#pedido-creado-email");
    const okBoton = elementos.get("#pedido-creado-ok");

    // Copia del párrafo como en pages/tienda.html: el email se inserta
    // en un <span> dedicado (textContent en tienda.js), no en HTML.
    const textoAntes = crearElemento("span");
    const textoDespues = crearElemento("span");

    titulo.textContent = "Pedido creado";
    textoAntes.textContent =
        "Te enviamos un correo electrónico a ";
    emailSpan.textContent = "";
    textoDespues.textContent =
        " para verificar tu compra. " +
        "Abrí el enlace recibido para verificar tu dirección " +
        "de correo y continuar con el pago en una nueva pestaña.";
    okBoton.textContent = "OK";

    texto.appendChild(textoAntes);
    texto.appendChild(emailSpan);
    texto.appendChild(textoDespues);

    dialogo.appendChild(titulo);
    dialogo.appendChild(texto);
    dialogo.appendChild(okBoton);
    overlay.appendChild(dialogo);

    elementos.get("#carrito-drawer").hidden = true;
    elementos.get("#checkout-enviar").textContent = "Realizar pedido";
    elementos.get("#carrito-continuar").textContent = "Continuar compra";

    const documento = {
        hidden: false,
        get activeElement() { return foco; },
        set activeElement(valor) { foco = valor; },
        hasFocus() { return true; },
        querySelector: selector => elementos.get(selector) ?? null,
        querySelectorAll: () => [],
        createElement: etiqueta => crearElemento(etiqueta),
        addEventListener(tipo, fn, opciones) {
            if (!oyentesDocumento.has(tipo)) oyentesDocumento.set(tipo, []);
            oyentesDocumento.get(tipo).push({
                fn,
                captura: Boolean(opciones?.captura ?? opciones)
            });
        },
        removeEventListener(tipo, fn, opciones) {
            const captura = Boolean(opciones?.captura ?? opciones);
            const lista = oyentesDocumento.get(tipo) ?? [];
            const i = lista.findIndex(
                entrada => entrada.fn === fn && Boolean(entrada.captura) === captura
            );
            if (i >= 0) lista.splice(i, 1);
        }
    };

    documento.body = crearElemento("body");

    // El motor de eventos lee los listeners por _oyentes: el documento
    // expone los suyos con la misma convención que los elementos.
    documento._oyentes = oyentesDocumento;

    const ventana = {
        location: { search: busqueda },
        addEventListener(tipo, fn) {
            if (!oyentesVentana.has(tipo)) oyentesVentana.set(tipo, []);
            oyentesVentana.get(tipo).push(fn);
        },
        dispatch(tipo, evento) {
            for (const fn of oyentesVentana.get(tipo) ?? []) fn(evento);
        }
    };

    const pane = {
        id: `P${pestanas.length + 1}`,
        busqueda,
        sessionStorage: sessionStoragePane,
        documento,
        ventana,
        elementos
    };

    pestanas.push(pane);

    return pane;

}

// ---------------------------------------------------------------------------
// Ejecución con los globals de una pestaña concreta
// ---------------------------------------------------------------------------

const dormir = ms => new Promise(resolver => setTimeout(resolver, ms));

async function hasta(condicion, limite = 3000) {

    const inicio = Date.now();

    while (!condicion()) {

        if (Date.now() - inicio > limite) return false;

        await dormir(10);

    }

    return true;

}

async function como(pane, fn) {

    const previo = {
        pane: pestanaActiva,
        d: globalThis.document,
        w: globalThis.window,
        s: globalThis.sessionStorage,
        l: globalThis.localStorage
    };

    pestanaActiva = pane;
    globalThis.document = pane.documento;
    globalThis.window = pane.ventana;
    globalThis.sessionStorage = pane.sessionStorage;

    try {
        return await fn();
    } finally {
        pestanaActiva = previo.pane;
        globalThis.document = previo.d;
        globalThis.window = previo.w;
        globalThis.sessionStorage = previo.s;
        globalThis.localStorage = previo.l;
    }

}

let contadorMontajes = 0;

async function montarTienda(pane) {

    return como(pane, async () => {

        const url =
            pathToFileURL(path.join(RAIZ, "scripts", "tienda.js")).href +
            "?montaje=" + (++contadorMontajes);

        const modulo = await import(url);

        // Deja terminar cargarCatalogo() y la limpieza de init.
        await dormir(150);

        return modulo;

    });

}

// ---------------------------------------------------------------------------
// Sesión: storage y fakes limpios por escenario
// ---------------------------------------------------------------------------

function nuevaSesion() {

    pestanas = [];
    pestanaActiva = null;

    globalThis.localStorage = crearStorageDummy();
    globalThis.sessionStorage = crearStorageDummy();

    carritoMod.limpiarCompromisoDelPedido();
    restaurarFakes();

    contador.crear = 0;
    contador.catalogo = 0;

}

// ---------------------------------------------------------------------------
// Flujos de usuario
// ---------------------------------------------------------------------------

async function sembrar(items) {

    const pane = crearPestana("");

    await como(pane, async () => {
        for (const item of items) {
            const producto = PRODUCTOS.find(p => p.id === item.id);
            for (let i = 0; i < item.cantidad; i += 1) {
                carritoMod.agregarProducto(producto);
            }
        }
    });

    const mod = await montarTienda(pane);

    return { pane, mod };

}

async function abrirCheckout(pane) {

    await como(pane, async () => {
        pane.elementos.get("#btn-carrito").dispatch("click", {});
        pane.elementos.get("#carrito-continuar").dispatch("click", {});
    });

}

async function enviarPedido(pane, datos = DATOS_OK) {

    await como(pane, async () => {
        pane.elementos.get("#checkout-nombre").value = datos.nombre;
        pane.elementos.get("#checkout-apellido").value = datos.apellido;
        pane.elementos.get("#checkout-email").value = datos.email;
        pane.elementos.get("#checkout-datos").dispatch("submit", {});
        await dormir(80);
    });

}

async function carritoDe(pane) {
    return como(pane, async () => carritoMod.obtenerCarrito());
}

function configurarCreacion(ids) {

    const cola = [...ids];

    fakes.crearPedido = async () => ({
        ok: true,
        data: {
            resultado: "creado",
            pedido: { id: cola.shift() ?? 101, estado: "PEND_VERIF" }
        }
    });

}

function configurarErrorRed() {

    fakes.crearPedido = async () => ({
        ok: false,
        message: "No fue posible crear el pedido. Intentá nuevamente."
    });

}

function configurarCorreccion() {

    fakes.crearPedido = async () => ({
        ok: true,
        data: {
            resultado: "correccion",
            pedido: { id: 101, estado: "PEND_VERIF" },
            carrito_corregido: [
                { producto_id: 1, cantidad: 1, precio_unitario: 1000 }
            ],
            disponibilidad: [
                { producto_id: 1, disponibilidad: 1 }
            ],
            motivos: [
                { producto_id: 1, motivo: "disponibilidad_insuficiente" }
            ],
            catalogo: PRODUCTOS.map(producto => ({ ...producto }))
        }
    });

}

function overlayDe(pane) {
    return pane.elementos.get("#pedido-creado-overlay");
}

function okDe(pane) {
    return pane.elementos.get("#pedido-creado-ok");
}

function badgeDe(pane) {
    return pane.elementos.get("#carrito-badge");
}

function flagEn(pane) {
    return como(pane, async () =>
        globalThis.sessionStorage.getItem("incancelables_pedido_creado")
    );
}

async function crearCompraTipica() {

    configurarCreacion([101]);

    const creada = await sembrar([{ id: 1, cantidad: 2 }]);

    await abrirCheckout(creada.pane);
    await enviarPedido(creada.pane);

    return creada;

}

// Simula recarga / restauración de la MISMA pestaña: se conserva su
// sessionStorage (y el localStorage compartido del perfil), pero el DOM y
// el módulo arrancan de cero.
async function recargarPestana(pane) {

    const nueva = crearPestana(pane.busqueda);

    for (const clave of pane.sessionStorage._claves()) {

        nueva.sessionStorage.setItem(clave, pane.sessionStorage.getItem(clave));

    }

    const mod = await montarTienda(nueva);

    return { pane: nueva, mod };

}

// ===========================================================================
// T01 · pedido creado => mensaje bloqueante visible con foco en [OK]
// ===========================================================================

await caso(
    "T01 · tras crear el pedido aparece el mensaje bloqueante con foco en [OK]",
    async () => {

        nuevaSesion();

        const creada = await crearCompraTipica();
        const A = creada.pane;

        await hasta(() => overlayDe(A).hidden === false);

        ok(!overlayDe(A).hidden, "T01 el overlay del mensaje NO está oculto");

        const dialogo = overlayDe(A).children[0];
        const titulo = dialogo?.children[0];
        const texto = dialogo?.children[1];

        ok(
            titulo?.textContent.includes("Pedido creado"),
            "T01 titulo del mensaje"
        );
        ok(
            texto?.textContent.includes("verificar tu compra"),
            "T01 texto: aviso del correo de verificación"
        );
        ok(
            texto?.textContent.includes("nueva pestaña"),
            "T01 texto: continúa en la nueva pestaña"
        );
        ok(
            texto?.textContent.includes("Abrí el enlace recibido"),
            "T01 texto: instrucción de abrir el enlace"
        );
        ok(
            A.documento.activeElement === okDe(A),
            "T01 el foco queda en el botón [OK]"
        );

    }
);

// ===========================================================================
// T02 · el carrito permanece intacto mientras el mensaje se muestra
// ===========================================================================

await caso(
    "T02 · con el mensaje visible el carrito, el badge y la marca siguen intactos",
    async () => {

        nuevaSesion();

        const creada = await crearCompraTipica();
        const A = creada.pane;

        await hasta(() => overlayDe(A).hidden === false);

        igual(
            (await carritoDe(A)).length,
            1,
            "T02 el carrito NO se vacía al crear el Pedido"
        );
        igual(badgeDe(A).textContent, "2", "T02 badge con las 2 unidades");
        igual(
            await flagEn(A),
            "101",
            "T02 la marca en sessionStorage conserva el id del Pedido"
        );

    }
);

// ===========================================================================
// T03 · no se puede interactuar con otros controles
// ===========================================================================

await caso(
    "T03 · con el mensaje visible no se agregan productos ni se abre el drawer",
    async () => {

        nuevaSesion();

        // Montaje limpio con 1 remera sembrada.
        const creada = await sembrar([{ id: 1, cantidad: 1 }]);
        const A = creada.pane;

        // Botón real del catálogo (delegación por [data-agregar]).
        const botonCatalogo = A.documento.createElement("button");
        botonCatalogo.setAttribute("data-agregar", "0");
        botonCatalogo.dataset.agregar = "0";
        botonCatalogo.closest = selector =>
            selector === "[data-agregar]" ? botonCatalogo : null;
        A.elementos.get("#catalogo").appendChild(botonCatalogo);

        // Control previo SIN mensaje: el clic en el catálogo funciona.
        await como(A, async () => {
            botonCatalogo.dispatch("click", {});
            await dormir(30);
        });

        igual(badgeDe(A).textContent, "2", "T03 control previo: el clic agrega (badge 2)");

        // Crear el pedido => mensaje visible.
        configurarCreacion([101]);
        await abrirCheckout(A);
        await enviarPedido(A);

        await hasta(() => overlayDe(A).hidden === false);

        // Mismo clic con el mensaje visible: no debe surtir efecto.
        await como(A, async () => {
            botonCatalogo.dispatch("click", {});
            await dormir(30);
        });

        igual(badgeDe(A).textContent, "2", "T03 el clic en catálogo NO agrega");
        igual(
            (await carritoDe(A)).length,
            1,
            "T03 el carrito no cambia con clics en catálogo"
        );

        // Clic en el botón del carrito: el drawer no se abre.
        await como(A, async () => {
            A.elementos.get("#btn-carrito").dispatch("click", {});
            await dormir(30);
        });

        ok(A.elementos.get("#carrito-drawer").hidden, "T03 el drawer NO se abre");

        // Reenvío del formulario: no se crea otro Pedido.
        await enviarPedido(A);
        igual(contador.crear, 1, "T03 no se vuelve a enviar el pedido");

    }
);

// ===========================================================================
// T04 · Escape, fondo y X no cierran el mensaje
// ===========================================================================

await caso(
    "T04 · Escape, el fondo y otros controles no cierran el mensaje",
    async () => {

        nuevaSesion();

        const creada = await crearCompraTipica();
        const A = creada.pane;

        await hasta(() => overlayDe(A).hidden === false);

        // Escape con foco en [OK].
        await como(A, async () => {
            okDe(A).dispatch("keydown", { key: "Escape" });
            await dormir(20);
        });

        ok(!overlayDe(A).hidden, "T04 Escape NO cierra el mensaje");

        // Clic en el fondo (el propio overlay) y en el diálogo.
        await como(A, async () => {
            overlayDe(A).dispatch("click", {});
            overlayDe(A).children[0].dispatch("click", {});
            await dormir(20);
        });

        ok(!overlayDe(A).hidden, "T04 el clic en el fondo NO cierra el mensaje");

        // El foco que escapa vuelve a [OK] (focusin en el documento).
        await como(A, async () => {
            A.elementos.get("#btn-carrito").dispatch("focusin", {});
            await dormir(20);
        });

        igual(
            A.documento.activeElement === okDe(A),
            true,
            "T04 el foco se retiene en [OK]"
        );

        // Markup real: el mensaje tiene un único botón ([OK]); sin X.
        const seccion = fuenteHtml.slice(
            fuenteHtml.indexOf("pedido-creado-overlay")
        );
        const botones = seccion.match(/<button/g) ?? [];

        igual(
            botones.length,
            1,
            "T04 el markup del mensaje tiene un solo <button> ([OK]), sin X"
        );

    }
);

// ===========================================================================
// T05 · [OK] vacía el carrito y limpia el estado
// ===========================================================================

await caso(
    "T05 · [OK] vacía el carrito, limpia la marca y deja la tienda habilitada",
    async () => {

        nuevaSesion();

        const creada = await crearCompraTipica();
        const A = creada.pane;

        await hasta(() => overlayDe(A).hidden === false);

        await como(A, async () => {
            okDe(A).dispatch("click", {});
            await dormir(250);
        });

        ok(overlayDe(A).hidden, "T05 [OK] oculta el mensaje");
        igual(
            (await carritoDe(A)).length,
            0,
            "T05 [OK] vacía el carrito con vaciarCarrito()"
        );
        igual(badgeDe(A).textContent, "0", "T05 badge en 0");
        igual(await flagEn(A), null, "T05 la marca en sessionStorage se limpia");
        ok(
            A.documento.activeElement === A.elementos.get("#btn-carrito"),
            "T05 el foco vuelve al botón del carrito"
        );
        ok(
            A.elementos.get("#carrito-drawer").hidden,
            "T05 el drawer queda cerrado"
        );

        // El guard quedó libre y la tienda permite una compra nueva:
        // se agregan productos y se crea otro Pedido.
        await como(A, async () => {
            carritoMod.agregarProducto(PRODUCTOS[0]);
        });

        configurarCreacion([102]);
        await abrirCheckout(A);
        await enviarPedido(A);

        igual(contador.crear, 2, "T05 tras [OK] se puede crear otro Pedido");
        await hasta(() => overlayDe(A).hidden === false);
        igual(await flagEn(A), "102", "T05 la nueva marca corresponde al Pedido 102");

    }
);

// ===========================================================================
// T06 · [OK] recarga el catálogo desde el backend
// ===========================================================================

await caso(
    "T06 · [OK] vuelve a consultar el catálogo a la API",
    async () => {

        nuevaSesion();

        const creada = await crearCompraTipica();
        const A = creada.pane;

        await hasta(() => overlayDe(A).hidden === false);

        igual(contador.catalogo, 1, "T06 una sola consulta de catálogo hasta el mensaje");

        await como(A, async () => {
            okDe(A).dispatch("click", {});
            await dormir(250);
        });

        igual(contador.catalogo, 2, "T06 [OK] dispara una nueva consulta del catálogo");
        ok(
            !A.elementos.get("#catalogo-estado").className.includes("error"),
            "T06 el catálogo queda renderizado sin estado de error"
        );

    }
);

// ===========================================================================
// T07 · no se aplica doble descuento de disponibilidad
// ===========================================================================

await caso(
    "T07 · la disponibilidad visible usa la fórmula existente y sin compromiso residual",
    async () => {

        nuevaSesion();

        const creada = await crearCompraTipica();
        const A = creada.pane;

        await hasta(() => overlayDe(A).hidden === false);

        const mostradaAntes = await como(A, async () =>
            carritoMod.obtenerDisponibilidadMostrada(PRODUCTOS[0])
        );

        igual(
            mostradaAntes,
            8,
            "T07 con 2 en el carrito: visible = API(10) - carrito(2)"
        );

        await como(A, async () => {
            okDe(A).dispatch("click", {});
            await dormir(250);
        });

        const mostradaDespues = await como(A, async () =>
            carritoMod.obtenerDisponibilidadMostrada(PRODUCTOS[0])
        );

        igual(
            mostradaDespues,
            10,
            "T07 tras [OK]: visible = API(10), sin descuento doble ni residual"
        );

    }
);

// ===========================================================================
// T08 · errores de checkout no vacían el carrito
// ===========================================================================

await caso(
    "T08 · error de red y corrección comercial conservan el carrito y no muestran el mensaje",
    async () => {

        nuevaSesion();

        // (i) Error de red / validación del backend.
        configurarErrorRed();

        const creada = await sembrar([{ id: 1, cantidad: 2 }]);
        const A = creada.pane;

        await abrirCheckout(A);
        await enviarPedido(A);

        ok(overlayDe(A).hidden, "T08 error de red: no aparece el mensaje bloqueante");
        igual(
            (await carritoDe(A)).length,
            1,
            "T08 error de red: el carrito queda intacto"
        );
        igual(await flagEn(A), null, "T08 error de red: sin marca en sessionStorage");
        ok(
            A.elementos.get("#checkout-estado").textContent
                .includes("No fue posible crear el pedido"),
            "T08 error de red: mensaje de error en el checkout"
        );

        // (ii) Corrección comercial.
        configurarCorreccion();

        await enviarPedido(A);

        ok(overlayDe(A).hidden, "T08 corrección: no aparece el mensaje bloqueante");
        ok(
            (await carritoDe(A)).length >= 1,
            "T08 corrección: el carrito NO se vacía"
        );
        igual(await flagEn(A), null, "T08 corrección: sin marca en sessionStorage");

    }
);

// ===========================================================================
// T09 · doble clic / doble submit no crea dos pedidos
// ===========================================================================

await caso(
    "T09 · doble clic y reenvío posterior no crean un segundo Pedido",
    async () => {

        nuevaSesion();

        let resolverCreacion;

        fakes.crearPedido = () => new Promise(resolver => {
            resolverCreacion = resolver;
        });

        const creada = await sembrar([{ id: 1, cantidad: 2 }]);
        const A = creada.pane;

        await abrirCheckout(A);

        // Doble clic: dos submits casi simultáneos.
        await como(A, async () => {
            A.elementos.get("#checkout-nombre").value = DATOS_OK.nombre;
            A.elementos.get("#checkout-apellido").value = DATOS_OK.apellido;
            A.elementos.get("#checkout-email").value = DATOS_OK.email;
            A.elementos.get("#checkout-datos").dispatch("submit", {});
            A.elementos.get("#checkout-datos").dispatch("submit", {});
            await dormir(20);
        });

        igual(contador.crear, 1, "T09 el doble clic dispara UNA sola creación");

        await como(A, async () => {
            resolverCreacion({
                ok: true,
                data: {
                    resultado: "creado",
                    pedido: { id: 101, estado: "PEND_VERIF" }
                }
            });
            await dormir(120);
        });

        await hasta(() => overlayDe(A).hidden === false);

        // Tercer intento tras el alta: lo frena el guard `pedidoCreado`.
        await enviarPedido(A);

        igual(contador.crear, 1, "T09 el guard impide un segundo Pedido");
        ok(
            A.elementos.get("#checkout-estado").textContent
                .includes("ya fue creado"),
            "T09 mensaje informativo de pedido ya creado"
        );

    }
);

// ===========================================================================
// T10 · recarga tras crear: no reaparece el carrito del pedido
// ===========================================================================

await caso(
    "T10 · recarga con la marca presente vacía el carrito heredado",
    async () => {

        nuevaSesion();

        const creada = await crearCompraTipica();
        const A = creada.pane;

        await hasta(() => overlayDe(A).hidden === false);

        // El usuario cierra/restaura la pestaña SIN presionar [OK].
        const recarga = await recargarPestana(A);
        const R = recarga.pane;

        ok(overlayDe(R).hidden, "T10 tras recargar no reaparece el mensaje");
        igual(
            (await carritoDe(R)).length,
            0,
            "T10 no reaparece el carrito del Pedido ya creado"
        );
        igual(badgeDe(R).textContent, "0", "T10 badge en 0 tras la recarga");
        igual(await flagEn(R), null, "T10 la marca se limpia en la recarga");

        // La tienda arranca normal: catálogo y compra nueva posibles.
        await como(R, async () => {
            carritoMod.agregarProducto(PRODUCTOS[0]);
        });

        configurarCreacion([102]);
        await abrirCheckout(R);
        await enviarPedido(R);

        igual(contador.crear, 2, "T10 tras recargar se puede crear otra compra");

    }
);

// ===========================================================================
// T11 · recarga antes de crear: comportamiento normal (carrito conservado)
// ===========================================================================

await caso(
    "T11 · recarga sin marca conserva el carrito de una compra aún no creada",
    async () => {

        nuevaSesion();

        const creada = await sembrar([{ id: 1, cantidad: 2 }]);
        const A = creada.pane;

        igual(await flagEn(A), null, "T11 sin creación no hay marca");

        const recarga = await recargarPestana(A);
        const R = recarga.pane;

        igual(
            (await carritoDe(R)).length,
            1,
            "T11 el carrito de la compra en curso se conserva"
        );
        igual(badgeDe(R).textContent, "2", "T11 badge conservado");

        // Y el checkout sigue funcionando.
        configurarCreacion([101]);
        await abrirCheckout(R);
        await enviarPedido(R);

        await hasta(() => overlayDe(R).hidden === false);
        igual(contador.crear, 1, "T11 se puede crear el pedido tras la recarga");

    }
);

// ===========================================================================
// T12 · B: verificación por enlace y recuperación del pedido
// ===========================================================================

// --- DOM falso para resultado.js (guion clásico: getElementById) ---

function crearDocumentoResultado() {

    const elementosPorId = new Map();

    function crearElemento(etiqueta) {

        const hijos = [];
        const oyentes = new Map();
        let texto = "";
        let id = "";

        const el = {
            etiqueta,
            className: "",
            href: "",
            disabled: false,
            hidden: false,
            style: {},
            children: hijos,

            get id() {
                return id;
            },
            set id(valor) {
                id = String(valor);
                if (id) elementosPorId.set(id, el);
            },

            get textContent() {
                return texto + hijos.map(h => h.textContent).join("");
            },
            set textContent(valor) {
                texto = String(valor);
                hijos.length = 0;
            },

            get innerHTML() {
                return "";
            },
            set innerHTML(valor) {
                texto = "";
                hijos.length = 0;
            },

            appendChild(hijo) {
                hijos.push(hijo);
                return hijo;
            },

            addEventListener(tipo, fn) {
                if (!oyentes.has(tipo)) oyentes.set(tipo, []);
                oyentes.get(tipo).push(fn);
            },

            dispatch(tipo, evento = {}) {
                for (const fn of oyentes.get(tipo) ?? []) {
                    fn({ type: tipo, target: el, ...evento });
                }
            }
        };

        return el;

    }

    const documento = {
        title: "",

        getElementById(idBuscado) {
            return elementosPorId.get(idBuscado) ?? null;
        },

        createElement(etiqueta) {
            return crearElemento(etiqueta);
        }
    };

    for (const id of ["titulo", "mensaje", "acciones", "btnVolver"]) {
        const el = crearElemento("div");
        el.id = id;
        documento[id] = el;
    }

    return documento;

}

function montarResultado() {

    const documento = crearDocumentoResultado();

    const navegaciones = [];
    let hrefActual = "";

    const location = { search: "?flow=checkout&token=tok-prueba-1" };

    Object.defineProperty(location, "href", {
        get: () => hrefActual,
        set: valor => {
            hrefActual = String(valor);
            navegaciones.push(hrefActual);
        }
    });

    const ventana = { location };

    const validarTokenCheckout = async () => ({
        ok: true,
        data: {
            resultado: "confirmado",
            pedidos: [
                {
                    id: 101,
                    estado: "PEND_PAGO",
                    items: [{ producto_id: 1, cantidad: 2, precio_unitario: 1000 }]
                }
            ]
        }
    });

    const nombres = [
        "window",
        "document",
        "API",
        "validarTokenCheckout",
        "setTimeout",
        "clearTimeout"
    ];

    const cuerpo = new Function(...nombres, fuenteResultado);

    cuerpo(
        ventana,
        documento,
        { URL: "https://api.test/" },
        validarTokenCheckout,
        setTimeout,
        clearTimeout
    );

    return { documento, navegaciones };

}

await caso(
    "T12 · pestaña B: enlace clásico de verificación y recuperación sin dependencias de A",
    async () => {

        // (i) Funcional: tras verificar, queda el enlace clásico a la tienda.
        const b = montarResultado();

        await hasta(() => b.documento.getElementById("acciones").children.length === 1);

        const enlace = b.documento.getElementById("acciones").children[0];

        igual(enlace.etiqueta, "a", "T12 queda un enlace (no un botón de transferencia)");
        igual(enlace.id, "btnContinuarCompra", "T12 id del enlace clásico");
        igual(
            enlace.href,
            "tienda.html?token=tok-prueba-1",
            "T12 href del enlace clásico"
        );
        igual(
            enlace.textContent,
            "Continuar compra",
            "T12 texto del enlace clásico"
        );
        igual(b.documento.title, "Email verificado", "T12 título de la página");
        ok(b.navegaciones.length === 0, "T12 sin navegación automática");

        // (ii) Estático: flujo clásico conservado, sin BroadcastChannel.
        ok(
            !/BroadcastChannel/.test(fuenteResultado),
            "T12 resultado.js sin BroadcastChannel"
        );
        ok(
            !/BroadcastChannel/.test(fuenteTienda),
            "T12 tienda.js sin BroadcastChannel"
        );
        ok(
            /mostrarContinuarCompra/.test(fuenteResultado),
            "T12 resultado.js conserva mostrarContinuarCompra()"
        );
        ok(
            /initContinuacionDeCompra/.test(fuenteTienda),
            "T12 tienda.js conserva la recuperación con ?token="
        );
        ok(
            /obtenerPedidosVerificados/.test(fuenteTienda) &&
                /reemplazarPedido/.test(fuenteTienda) &&
                /iniciarPago/.test(fuenteTienda),
            "T12 tienda.js conserva recuperación, reemplazo y pago"
        );

        // (iii) La marca de A vive en sessionStorage de su pestaña, sólo
        // con la clave del pedido (sin tokens ni datos de la compra).
        ok(
            /sessionStorage\.setItem\(\s*CLAVE_PEDIDO_CREADO/.test(fuenteTienda),
            "T12 la escritura de la marca usa sessionStorage"
        );
        ok(
            !/localStorage/.test(fuenteTienda),
            "T12 tienda.js no referencia localStorage"
        );
        ok(
            !/sessionStorage[^\n]*token/i.test(fuenteTienda) &&
                !/localStorage[^\n]*token/i.test(fuenteTienda),
            "T12 no se persiste ningún token en storage"
        );

    }
);

// ===========================================================================
// T13 · la marca de pedido creado usa sessionStorage (por pestaña)
// ===========================================================================

await caso(
    "T13 · la marca vive en sessionStorage de la pestaña, no en localStorage",
    async () => {

        nuevaSesion();

        const creada = await crearCompraTipica();
        const A = creada.pane;

        await hasta(() => overlayDe(A).hidden === false);

        igual(
            A.sessionStorage.getItem("incancelables_pedido_creado"),
            "101",
            "T13 la marca está en el sessionStorage de la pestaña A"
        );
        igual(
            await como(A, async () =>
                globalThis.localStorage.getItem("incancelables_pedido_creado")
            ),
            null,
            "T13 la marca NO está en localStorage"
        );

        // Aerciones de fuente: setItem / getItem / removeItem sobre
        // sessionStorage y cero referencias a localStorage en tienda.js.
        ok(
            /sessionStorage\.setItem\(\s*CLAVE_PEDIDO_CREADO/.test(fuenteTienda),
            "T13 setItem usa sessionStorage"
        );
        ok(
            /sessionStorage\.getItem\(\s*CLAVE_PEDIDO_CREADO/.test(fuenteTienda),
            "T13 getItem usa sessionStorage"
        );
        ok(
            /sessionStorage\.removeItem\(\s*CLAVE_PEDIDO_CREADO/.test(fuenteTienda),
            "T13 removeItem usa sessionStorage"
        );
        ok(
            !/localStorage/.test(fuenteTienda),
            "T13 tienda.js no contiene la cadena localStorage"
        );

    }
);

// ===========================================================================
// T14 · aislamiento entre pestañas: C no ve la marca de A
// ===========================================================================

await caso(
    "T14 · una pestaña C con carrito propio no resulta afectada por el pedido de A",
    async () => {

        nuevaSesion();

        // A crea el pedido y deja la marca visible en su pestaña.
        const creada = await crearCompraTipica();
        const A = creada.pane;

        await hasta(() => overlayDe(A).hidden === false);

        // C: pestaña independiente con su propio carrito, sin pedido.
        const creadaC = await sembrar([{ id: 2, cantidad: 1 }]);
        const C = creadaC.pane;

        igual(
            (await carritoDe(C)).length,
            1,
            "T14 C arranca con su propio carrito"
        );
        igual(
            C.sessionStorage.getItem("incancelables_pedido_creado"),
            null,
            "T14 la marca de A no aparece en el sessionStorage de C"
        );

        // C recarga (F5): sin marca propia, su carrito debe conservarse.
        const recargaC = await recargarPestana(C);
        const RC = recargaC.pane;

        igual(
            (await carritoDe(RC)).length,
            1,
            "T14 el carrito de C se conserva tras recargar"
        );
        igual(badgeDe(RC).textContent, "1", "T14 badge de C intacto");
        igual(
            RC.sessionStorage.getItem("incancelables_pedido_creado"),
            null,
            "T14 la recarga de C no hereda la marca de A"
        );

        // La marca y el carrito de A siguen intactos (C no las tocó).
        igual(
            A.sessionStorage.getItem("incancelables_pedido_creado"),
            "101",
            "T14 la marca de A sigue intacta tras la actividad de C"
        );
        igual(
            (await carritoDe(A)).length,
            1,
            "T14 el carrito de A no se ve afectado por C"
        );

        // A sí conserva su limpieza al recargar: su propia marca vacía
        // el carrito del pedido creado.
        const recargaA = await recargarPestana(A);
        const RA = recargaA.pane;

        igual(
            (await carritoDe(RA)).length,
            0,
            "T14 al recargar A sí se vacía el carrito del pedido creado"
        );
        igual(await flagEn(RA), null, "T14 la marca de A se limpia en su recarga");

    }
);

// ===========================================================================
// T15 · el mensaje muestra el email del comprador de forma segura
// ===========================================================================

await caso(
    "T15 · el mensaje incluye el email (textContent) y no lo persiste en storage",
    async () => {

        nuevaSesion();

        configurarCreacion([101]);

        const creada = await sembrar([{ id: 1, cantidad: 2 }]);
        const A = creada.pane;

        await abrirCheckout(A);

        // Email con caracteres especiales: si se insertara con innerHTML
        // se interpretarían como HTML; con textContent queda como texto.
        const emailRiesgoso = "<b>inyeccion</b>@evil.com";

        await enviarPedido(A, { ...DATOS_OK, email: emailRiesgoso });

        await hasta(() => overlayDe(A).hidden === false);

        const span = A.elementos.get("#pedido-creado-email");

        igual(
            span.textContent,
            emailRiesgoso,
            "T15 el email se muestra tal cual, como texto plano"
        );
        igual(
            span.innerHTML,
            "",
            "T15 el email NO se insertó con innerHTML"
        );
        igual(
            span.children.length,
            0,
            "T15 el span del email no contiene elementos inyectados"
        );

        const dialogo = overlayDe(A).children[0];
        const texto = dialogo?.children[1];

        ok(
            texto?.textContent.includes(emailRiesgoso),
            "T15 el párrafo del mensaje incluye el email del comprador"
        );
        ok(
            texto?.textContent.includes("verificar tu compra"),
            "T15 el párrafo conserva el resto del copy"
        );

        // El email no se persiste en ningún storage: sólo la marca con
        // el id del pedido.
        ok(
            !A.sessionStorage._claves().some(clave => /email/i.test(clave)),
            "T15 ninguna clave de sessionStorage contiene el email"
        );
        ok(
            !A.sessionStorage._valores().some(valor => valor.includes(emailRiesgoso)),
            "T15 el email no está almacenado en sessionStorage"
        );
        igual(
            await como(A, async () =>
                globalThis.localStorage.getItem("incancelables_pedido_creado")
            ),
            null,
            "T15 localStorage sigue sin usarse"
        );
        igual(
            A.sessionStorage.getItem("incancelables_pedido_creado"),
            "101",
            "T15 la única marca persistida es la del id del pedido"
        );

    }
);

resumen();
