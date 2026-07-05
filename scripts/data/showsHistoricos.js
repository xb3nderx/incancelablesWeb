const basePath = window.location.pathname.includes("/pages/")
    ? "../"
    : "";

export const showsHistoricos = [

    {
        titulo: "Mamita Bar",
        fecha: "31 de Enero de 2026",
        lugar: "Av. Alvarez Tomas 487 · CABA",
        flyer: `${basePath}assets/shows/mamita 31-01-26.jpeg`,
        alt: "Mamita Bar 31/01/26"
    },

    {
        titulo: "Rodney Bar",
        fecha: "26 de Abril de 2025",
        lugar: "Rodney 400 · CABA",
        flyer: `${basePath}assets/shows/rodney 26-04-25.jpeg`,
        alt: "Rodney Bar 26/04/25"
    },

    {
        titulo: "Rodney Bar",
        fecha: "02 de Noviembre de 2024",
        lugar: "Rodney 400 · CABA",
        flyer: `${basePath}assets/shows/Rodney 02-11-24.jpeg`,
        alt: "Rodney Bar 02/11/24"
    },

    {
        titulo: "Kif Bar",
        fecha: "22 de Junio de 2024",
        lugar: "Av. Cordoba 5600 · CABA",
        flyer: `${basePath}assets/shows/kif 22-06-24.jpeg`,
        alt: "Kif Bar 22/06/24"
    }

];

export function renderShowsHistoricos() {

    const container = document.querySelector("#shows-history");

    if (!container) return;

    container.innerHTML = "";

    showsHistoricos.forEach(show => {

        container.innerHTML += `
            <section class="show-card">
                <img src="${show.flyer}" alt="${show.alt}">

                <div class="show-info">
                    <h2>${show.titulo}</h2>
                    <p>${show.fecha}</p>
                    <p>${show.lugar}</p>
                </div>
            </section>
        `;
    });

}