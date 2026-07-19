// /////////////////////////////////////////////////////////////////////////////
// BASE PATH
// /////////////////////////////////////////////////////////////////////////////
import { BASE_PATH } from "../config/paths.js";


// /////////////////////////////////////////////////////////////////////////////
// DISCOGRAFÍA OFICIAL
// Fuente única de datos para Home + Música
// /////////////////////////////////////////////////////////////////////////////

export const discografia = [
    {
        // ----------------------------------------------------------------------
        // IDENTIFICACIÓN
        // ----------------------------------------------------------------------

        id: "live-at-mujica",

        // ----------------------------------------------------------------------
        // DATOS GENERALES DEL ÁLBUM
        // ----------------------------------------------------------------------

        titulo: "Live at Mujica",

        // Portada utilizada tanto en Home como en Música
        portada: `${BASE_PATH}assets/musica/live-at-mujica.webp`,

        // Página destino al hacer click desde Home
        enlace: "pages/musica.html",

        // ----------------------------------------------------------------------
        // HOME (index.html)
        // ----------------------------------------------------------------------

        descripcionCorta:
            "Mirá y escuchá nuestro último disco 'Live at Mujica' filmado y grabado en vivo en nuestra sala.",

        descripcionHome:
            "Todos los meses vamos a ir subiendo 1 tema nuevo hasta completar los 11 grabados.",

        // ----------------------------------------------------------------------
        // CABECERA DE MÚSICA (musica.html)
        // ----------------------------------------------------------------------

        descripcionLarga:
            "El show que siempre quisimos dar, ahora grabado en vivo desde nuestra sala. Cada mes liberamos una nueva canción hasta completar el disco.",

        // ----------------------------------------------------------------------
        // PLAYLISTS OFICIALES
        // ----------------------------------------------------------------------

        youtubePlaylist:
            "https://www.youtube.com/playlist?list=PLQEFwX0MhHFyOLqtELjoj4SJyTccZUqQI",

        spotifyPlaylist:
            "https://open.spotify.com/intl-es/album/269fg0y6CZLjYoWgTiIad0?si=f3f199ee9f1740f8",

        // ----------------------------------------------------------------------
        // SECCIÓN "ACERCA DE..."
        // Cada elemento del array genera un párrafo.
        // ----------------------------------------------------------------------

        historia: [

            "Ensayar, arreglar los temas, poner todo en hacer lo que más nos gusta, y después chocar contra la frustración de que por causas externas no podamos dar el show que preparamos.",

            "De todas esas ganas, de todas estas barreras, nace la idea de grabar el show con la calidad de sonido que siempre quisimos tener.",

            "Grabado en vivo en nuestra sala, para los que tantas veces vinieron, para los que todavía no nos conocen... para todos.",

            "Vamos a ir liberando de a un tema por mes, hasta completar el disco, el show, la experiencia...",

            "Sumate, como si estuvieras ahí."
        ],

        // ----------------------------------------------------------------------
        // TRACKS DEL ÁLBUM
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
                number: "03",
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