// /////////////////////////////////////////////////////////////////////////////
// DISCOGRAFÍA OFICIAL
// Fuente única de datos para Home + Música
// /////////////////////////////////////////////////////////////////////////////

export const discografia = [
    {
        id: "live-at-mujica",

        // ----------------------------------------------------------------------
        // DATOS GENERALES DEL ÁLBUM
        // ----------------------------------------------------------------------

        titulo: "Live at Mujica",

        descripcionCorta:
            "Mirá y escuchá nuestro último disco 'Live at Mujica' filmado y grabado en vivo en nuestra sala.",

        descripcionHome:
            "Todos los meses vamos a ir subiendo 1 tema nuevo hasta completar los 11 grabados.",

        descripcionLarga:
            "El show que siempre quisimos dar, ahora grabado en vivo desde nuestra sala. Cada mes liberamos una nueva canción hasta completar el disco.",

        portada: "assets/musica/live-at-mujica.webp",

        enlace: "pages/musica.html",

        youtubePlaylist:
            "https://www.youtube.com/playlist?list=PLQEFwX0MhHFyOLqtELjoj4SJyTccZUqQI",

        spotifyPlaylist:
            "https://open.spotify.com/intl-es/album/269fg0y6CZLjYoWgTiIad0?si=f3f199ee9f1740f8",

        // ----------------------------------------------------------------------
        // TRACKS
        // ----------------------------------------------------------------------

        tracks: [

            {
                number: "01",
                title: "Invisible",
                release: "Publicado el 15 de Agosto de 2026",
                description: "Primer adelanto oficial de Live at Mujica.",
                released: true,
                youtube: "https://youtu.be/AJuXt10C3MM?si=_T6gNxzrnU9Fx8ro",
                spotify: "https://open.spotify.com/intl-es/track/0aVwclUm2FsksllwpJRlaX?si=c6a8df8707c04b92"
            },

            {
                number: "02",
                title: "En la ciudad de la furia",
                release: "Agosto 2026",
                description: "",
                released: true,
                youtube: "https://youtu.be/AWpA19OXPFk?si=5tHemFhlxpa2kzbY",
                spotify: "https://open.spotify.com/intl-es/track/3gA85qTCk7q2KU1bnDBfPs?si=6ba433d996684a06"
            },

            {
                number: "04",
                title: "Próximo lanzamiento",
                release: "Agosto 2026",
                description: "",
                released: false,
                youtube: "",
                spotify: ""
            }

        ]
    }
];