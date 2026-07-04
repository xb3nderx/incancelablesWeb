import { proximoShow } from "./data/proximoShow.js";
document.querySelector("#upcoming-show-title").textContent = proximoShow.titulo;
document.querySelector("#upcoming-show-date").textContent = proximoShow.fecha;
document.querySelector("#upcoming-show-location").textContent = proximoShow.lugar;

document.querySelector("#upcoming-show-mobile").src = proximoShow.flyer.mobile;
document.querySelector("#upcoming-show-desktop").srcset = proximoShow.flyer.desktop;

document.querySelector("#upcoming-show-link").href = proximoShow.link;

renderProximoShow();