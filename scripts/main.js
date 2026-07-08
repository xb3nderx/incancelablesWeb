// /////////////////////////////////////////////////////////////////////////////
// ICONOS
// /////////////////////////////////////////////////////////////////////////////
//cambia el path segun la pagina esta dentro de pages o no
const iconPath = window.location.pathname.includes("/pages/")
    ? "../assets/icons/"
    : "assets/icons/";


// /////////////////////////////////////////////////////////////////////////////
// MENÚ
// /////////////////////////////////////////////////////////////////////////////

function initMenu() {

    //obtiene los elementos menuBtn y nav
    const menuBtn = document.querySelector(".menu-btn");
    const nav = document.querySelector(".nav");

    //si no existe alguno de los dos sale de la funcion
    if (!menuBtn || !nav) return;

    //aagrega un listener y ejecuta togle con el click 
    menuBtn.addEventListener("click", () => {

        nav.classList.toggle("active");

    });

}


// /////////////////////////////////////////////////////////////////////////////
// TEMA
// /////////////////////////////////////////////////////////////////////////////

function updateThemeIcon(theme) {

    const themeIcon = document.querySelector("#theme-icon");

    if (!themeIcon) return;

    themeIcon.src =
        theme === "dark"
            ? `${iconPath}sun.svg`
            : `${iconPath}moon.svg`;

}

function setTheme(theme) {

    document.body.classList.toggle("light", theme === "light");

    localStorage.setItem("theme", theme);

    updateThemeIcon(theme);

}

function initTheme() {

    const themeToggle = document.querySelector("#theme-toggle");

    const saved = localStorage.getItem("theme");

    if (saved) {

        setTheme(saved);

    } else {

        setTheme("dark");

    }

    if (!themeToggle) return;

    themeToggle.addEventListener("click", () => {

        const isLight =
            document.body.classList.contains("light");

        setTheme(isLight ? "dark" : "light");

    });

}


// /////////////////////////////////////////////////////////////////////////////
// INICIALIZACIÓN
// /////////////////////////////////////////////////////////////////////////////

function initMain() {

    initMenu();

    initTheme();

}
