// ===============================================
// COMPONENTES COMPARTIDOS
// ===============================================

// ¿La página actual está dentro de /pages/?
const IS_IN_PAGES = window.location.pathname.includes("/pages/");

// Prefijo para todas las rutas
const BASE = IS_IN_PAGES ? "../" : "";

// ===============================================
// CARGAR COMPONENTE
// ===============================================

async function loadComponent(selector, file) {

    try {

        const response = await fetch(`${BASE}components/${file}`);

        if (!response.ok) {
            throw new Error(`No se pudo cargar ${file}`);
        }

        const html = await response.text();

        const element = document.querySelector(selector);

        if (element) {
            element.innerHTML = html;
        }

    } catch (error) {

        console.error(error);

    }

}

// ===============================================
// CORREGIR RUTAS
// ===============================================

function fixLinks() {

    // Links
    document.querySelectorAll("[data-link]").forEach(link => {

        link.href = BASE + link.dataset.link;

    });

    // Imágenes
    document.querySelectorAll("[data-src]").forEach(img => {

        img.src = BASE + img.dataset.src;

    });

}

// ===============================================
// INICIALIZACIÓN
// ===============================================

document.addEventListener("DOMContentLoaded", async () => {

    await loadComponent(".header", "header.html");

    await loadComponent(".footer", "footer.html");

    fixLinks();
    if (typeof initMain === "function") {

        initMain();

    }
});
