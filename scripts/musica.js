// /////////////////////////////////////////////////////////////////////////////
// DATOS DEL ÁLBUM
// /////////////////////////////////////////////////////////////////////////////
import { discografia } from "./data/discografia.js";

const album = discografia[0];


// /////////////////////////////////////////////////////////////////////////////
// ELEMENTOS
// /////////////////////////////////////////////////////////////////////////////

const playlist = document.querySelector(".track-list");
const iframe = document.querySelector(".player-container iframe");
const currentTrack = document.querySelector(".current-track");

const featuredTitle = document.querySelector(".featured-title");
const featuredDate = document.querySelector(".release-date");
const featuredDescription = document.querySelector(".track-description");

const albumYoutube = document.querySelector(".album-youtube");
const albumSpotify = document.querySelector(".album-spotify");

let activeTrack = 0;

const comingSoon = document.querySelector(".album-coming-soon");

const musicSections = document.querySelectorAll(".music-content");

// /////////////////////////////////////////////////////////////////////////////
// CARGAR DATOS DEL ÁLBUM
// /////////////////////////////////////////////////////////////////////////////

function loadAlbumInfo() {

    const albumCover =
        document.querySelector(".album-cover");

    const albumTitle =
        document.querySelector(".album-info h1");

    const albumDescription =
        document.querySelector(".album-description");

    const playlistTitle =
        document.querySelector(".playlist h2");

    const storyTitle =
        document.querySelector(".album-story h2");

    const storyContent =
        document.querySelector(".album-story-content");

    // ------------------------------------------------------------------------
    // CABECERA
    // ------------------------------------------------------------------------

    albumCover.src = album.portada;
    albumCover.alt = `Portada ${album.titulo}`;

    albumTitle.textContent =
        album.titulo;

    albumDescription.textContent =
        album.descripcionLarga;

    document.querySelector(".coming-soon-title").textContent =
        album.titulo;

    // ------------------------------------------------------------------------
    // PLAYLIST
    // ------------------------------------------------------------------------

    playlistTitle.textContent =
        album.titulo;

    // ------------------------------------------------------------------------
    // HISTORIA
    // ------------------------------------------------------------------------

    storyTitle.textContent =
        `Acerca de ${album.titulo}`;

    storyContent.innerHTML = "";

    album.historia.forEach(parrafo => {

        storyContent.innerHTML += `
            <p>${parrafo}</p>
        `;

    });

}
// /////////////////////////////////////////////////////////////////////////////
// GENERAR PLAYLIST
// /////////////////////////////////////////////////////////////////////////////

function createPlaylist() {

    playlist.innerHTML = "";

    album.tracks.forEach((track, index) => {

        const li = document.createElement("li");
        li.className = "track";

        if (index === 0) {
            li.classList.add("active");
        }

        const number = document.createElement("span");
        number.className = "track-number";
        number.textContent = track.number;

        const info = document.createElement("div");
        info.className = "track-info";

        const title = document.createElement("h3");
        title.textContent = track.title;

        const release = document.createElement("p");
        release.textContent = track.release;

        info.appendChild(title);
        info.appendChild(release);

        li.appendChild(number);
        li.appendChild(info);

        if (track.released) {

            const playButton = document.createElement("button");
            playButton.className = "play-button";
            playButton.textContent = "▶";

            li.appendChild(playButton);

            li.addEventListener("click", () => {
                loadTrack(index);
            });

        } else {

            li.classList.add("disabled");

        }

        playlist.appendChild(li);

    });

}


// /////////////////////////////////////////////////////////////////////////////
// CARGAR TEMA
// /////////////////////////////////////////////////////////////////////////////

function loadTrack(index) {

    activeTrack = index;

    const track = album.tracks[index];

    const tracks = document.querySelectorAll(".track");

    tracks.forEach(trackElement => {
        trackElement.classList.remove("active");
    });

    tracks[index].classList.add("active");

    featuredTitle.textContent = track.title;
    featuredDate.textContent = track.release;
    featuredDescription.textContent = track.description;

    currentTrack.textContent = track.title;

    updatePlayer();

}


// /////////////////////////////////////////////////////////////////////////////
// CAMBIA URL NORMAL DE YOUTUBE A EMBED
// /////////////////////////////////////////////////////////////////////////////

function getYoutubeEmbedUrl(url) {

    if (!url) return "";

    // Si ya es una URL de embed
    if (url.includes("/embed/")) {
        return url;
    }

    // URLs cortas
    if (url.includes("youtu.be/")) {
        const id = url.split("youtu.be/")[1].split("?")[0];
        return `https://www.youtube.com/embed/${id}`;
    }

    // URLs normales
    if (url.includes("watch?v=")) {
        const id = new URL(url).searchParams.get("v");
        return `https://www.youtube.com/embed/${id}`;
    }

    return "";

}


// /////////////////////////////////////////////////////////////////////////////
// ACTUALIZAR REPRODUCTOR
// /////////////////////////////////////////////////////////////////////////////

function updatePlayer() {

    const track = album.tracks[activeTrack];

    iframe.src = getYoutubeEmbedUrl(track.youtube);

}

// /////////////////////////////////////////////////////////////////////////////
// MOSTRAR ESTADO "PRÓXIMAMENTE"
// /////////////////////////////////////////////////////////////////////////////

function showComingSoon() {

    comingSoon.classList.remove("hidden");

    musicSections.forEach(section => {

        section.classList.add("hidden");

    });

}

// /////////////////////////////////////////////////////////////////////////////
// INICIALIZACIÓN
// /////////////////////////////////////////////////////////////////////////////

loadAlbumInfo();

if (!album.publicado) {

    showComingSoon();

} else {

    albumYoutube.href =
        album.youtubePlaylist;

    albumSpotify.href =
        album.spotifyPlaylist;

    createPlaylist();

    loadTrack(0);

}