
const basePath = window.location.pathname.includes("/pages/")
    ? "../"
    : "";

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

export function renderProximoShow() {

    document.querySelector("#upcoming-show-title").textContent = proximoShow.titulo;
    document.querySelector("#upcoming-show-date").textContent = proximoShow.fecha;
    document.querySelector("#upcoming-show-location").textContent = proximoShow.lugar;
    document.querySelector("#upcoming-show-mobile").src = proximoShow.flyer.mobile;
    document.querySelector("#upcoming-show-desktop").srcset = proximoShow.flyer.desktop;
    document.querySelector("#upcoming-show-link").href = proximoShow.link;

}