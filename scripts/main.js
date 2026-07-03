const menuBtn = document.querySelector(".menu-btn");
const nav = document.querySelector(".nav");

const themeToggle = document.querySelector("#theme-toggle");
const themeIcon = document.querySelector("#theme-icon");

const iconPath = window.location.pathname.includes("/pages/")
    ? "../assets/icons/"
    : "assets/icons/";


// /////////////////////////////////////////////////////////////////////////////
// MENÚ
// /////////////////////////////////////////////////////////////////////////////

menuBtn?.addEventListener("click", () => {
    nav.classList.toggle("active");
});


// /////////////////////////////////////////////////////////////////////////////
// TEMA
// /////////////////////////////////////////////////////////////////////////////

themeToggle?.addEventListener("click", () => {

    const isLight = document.body.classList.contains("light");

    setTheme(isLight ? "dark" : "light");

});

function updateThemeIcon(theme) {

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

    const saved = localStorage.getItem("theme");

    if (saved) {

        setTheme(saved);

        return;

    }

    setTheme("dark");

}

initTheme();