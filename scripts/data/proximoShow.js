
// constante que se usa para ver si 
const basePath = window.location.pathname.includes("/pages/")
    ? "../"
    : "";

// estructura de datos que contiene el proximo show de la banda    
export const proximoShow = {
    titulo: "Strummer Bar",
    fecha: "22 de Agosto · 23:00 hs",
    lugar: "Godoy Cruz 1631 · CABA",
    flyer: {
        mobile: `${basePath}assets/shows/Strummer-22-08-26-mobile.png`,
        desktop: `${basePath}assets/shows/Strummer-22-08-26-desktop.png`
    },
    link: `${basePath}pages/shows.html`
}

//funcion que renderiza en la pagina los datos del proximo show
export function renderProximoShow() {

    const title = document.querySelector("#upcoming-show-title");
    const date = document.querySelector("#upcoming-show-date");
    const location = document.querySelector("#upcoming-show-location");
    const mobile = document.querySelector("#upcoming-show-mobile");
    const desktop = document.querySelector("#upcoming-show-desktop");
    const link = document.querySelector("#upcoming-show-link");

    if (title) title.textContent = proximoShow.titulo;
    if (date) date.textContent = proximoShow.fecha;
    if (location) location.textContent = proximoShow.lugar;
    if (mobile) mobile.src = proximoShow.flyer.mobile;
    if (desktop) desktop.srcset = proximoShow.flyer.desktop;

    // Solo existe en index.html
    if (link) {
        link.href = proximoShow.link;
    }
}