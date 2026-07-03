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

const youtubeButton = document.querySelector('[data-platform="youtube"]');

const spotifyButton = document.querySelector('[data-platform="spotify"]');

const albumYoutube = document.querySelector(".album-youtube");

const albumSpotify = document.querySelector(".album-spotify");

let currentPlatform = "youtube";

let activeTrack = 0;


// /////////////////////////////////////////////////////////////////////////////
// GENERAR PLAYLIST
// /////////////////////////////////////////////////////////////////////////////

function createPlaylist() {

    playlist.innerHTML = "";

    album.tracks.forEach((track, index) => {

        const li = document.createElement("li");

        li.className = "track";

        if (index === 0)
            li.classList.add("active");


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


        if (track.released) {

            const playButton = document.createElement("button");

            playButton.className = "play-button";

            playButton.textContent = "▶";

            li.appendChild(playButton);

        }

        li.appendChild(number);

        li.appendChild(info);

        if (track.released) {

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

    document
        .querySelectorAll(".track")
        .forEach(item => item.classList.remove("active"));

    document
        .querySelectorAll(".track")
    [index]
        .classList.add("active");


    featuredTitle.textContent = track.title;

    featuredDate.textContent = track.release;

    featuredDescription.textContent = track.description;

    currentTrack.textContent = track.title;

    updatePlayer();

}

// /////////////////////////////////////////////////////////////////////////////
// CAMBIA URL NORMAL DE YOUTUBE A EMBEDED
// /////////////////////////////////////////////////////////////////////////////

function getYoutubeEmbedUrl(url) {

    if (!url) return "";

    // Si ya es una URL de embed
    if (url.includes("/embed/")) {
        return url;
    }

    // URLs cortas: https://youtu.be/XXXX
    if (url.includes("youtu.be/")) {

        const id = url.split("youtu.be/")[1].split("?")[0];

        return `https://www.youtube.com/embed/${id}`;
    }

    // URLs normales: https://www.youtube.com/watch?v=XXXX
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

    if (currentPlatform === "youtube") {

        iframe.src = getYoutubeEmbedUrl(track.youtube);

    } else {

        iframe.src = track.spotify;

    }
    console.log(iframe.src);

}


// /////////////////////////////////////////////////////////////////////////////
// CAMBIAR PLATAFORMA
// /////////////////////////////////////////////////////////////////////////////

youtubeButton.addEventListener("click", () => {

    currentPlatform = "youtube";

    youtubeButton.classList.add("active-platform");

    spotifyButton.classList.remove("active-platform");

    updatePlayer();

});


spotifyButton.addEventListener("click", () => {

    currentPlatform = "spotify";

    spotifyButton.classList.add("active-platform");

    youtubeButton.classList.remove("active-platform");

    updatePlayer();

});


// /////////////////////////////////////////////////////////////////////////////
// INICIALIZACIÓN
// /////////////////////////////////////////////////////////////////////////////

albumYoutube.href = album.youtubePlaylist;

albumSpotify.href = album.spotifyPlaylist;

createPlaylist();

loadTrack(0);