// /////////////////////////////////////////////////////////////////////////////
// MÚSICA
// /////////////////////////////////////////////////////////////////////////////

const tracks = document.querySelectorAll(".track");

const iframe = document.querySelector(".player-container iframe");

const currentTrack = document.querySelector(".current-track");

const youtubeButton = document.querySelector(".active-platform");

const spotifyButton = document.querySelector(".secondary");

let currentPlatform = "youtube";


// /////////////////////////////////////////////////////////////////////////////
// CAMBIAR TEMA
// /////////////////////////////////////////////////////////////////////////////

function loadTrack(track) {

    tracks.forEach(item => item.classList.remove("active"));

    track.classList.add("active");

    currentTrack.textContent =
        track.querySelector("h3").textContent;

    updatePlayer(track);

}


// /////////////////////////////////////////////////////////////////////////////
// ACTUALIZAR REPRODUCTOR
// /////////////////////////////////////////////////////////////////////////////

function updatePlayer(track) {

    let url = "";

    if (currentPlatform === "youtube") {

        url = track.dataset.youtube;

    } else {

        url = track.dataset.spotify;

    }

    iframe.src = url;

}


// /////////////////////////////////////////////////////////////////////////////
// EVENTOS PLAYLIST
// /////////////////////////////////////////////////////////////////////////////

tracks.forEach(track => {

    track.addEventListener("click", () => {

        loadTrack(track);

    });

});


// /////////////////////////////////////////////////////////////////////////////
// BOTÓN YOUTUBE
// /////////////////////////////////////////////////////////////////////////////

youtubeButton.addEventListener("click", () => {

    currentPlatform = "youtube";

    youtubeButton.classList.add("active-platform");

    spotifyButton.classList.remove("active-platform");

    updatePlayer(document.querySelector(".track.active"));

});


// /////////////////////////////////////////////////////////////////////////////
// BOTÓN SPOTIFY
// /////////////////////////////////////////////////////////////////////////////

spotifyButton.addEventListener("click", () => {

    currentPlatform = "spotify";

    spotifyButton.classList.add("active-platform");

    youtubeButton.classList.remove("active-platform");

    updatePlayer(document.querySelector(".track.active"));

});


// /////////////////////////////////////////////////////////////////////////////
// INICIALIZACIÓN
// /////////////////////////////////////////////////////////////////////////////

const firstTrack = document.querySelector(".track.active");

if (firstTrack) {

    loadTrack(firstTrack);

}