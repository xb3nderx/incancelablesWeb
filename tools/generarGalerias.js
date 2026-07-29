/*
    generarGalerias.js
    ------------------

    Generador de módulos ES6 para las galerías fotográficas
    del sitio web Incancelables.

    Uso:
        node tools/generarGalerias.js


    Lee:

        assets/shows/galerias/


    Genera:

        scripts/data/galerias.js


    El archivo generado será importado desde:

        scripts/shows.js


    Ejemplo:

        import {
            galerias
        } from "./data/galerias.js";


*/


const fs = require("fs");
const path = require("path");


// /////////////////////////////////////////////////////////////////////////////
// RUTAS DEL PROYECTO
// /////////////////////////////////////////////////////////////////////////////


// Carpeta raíz del proyecto

const ROOT = path.join(
    __dirname,
    ".."
);


// Carpeta donde viven las galerías

const GALERIAS_DIR = path.join(
    ROOT,
    "assets",
    "shows",
    "galerias"
);


// Archivo JavaScript generado

const OUTPUT_FILE = path.join(
    ROOT,
    "scripts",
    "data",
    "galerias.js"
);



// /////////////////////////////////////////////////////////////////////////////
// EXTENSIONES DE IMAGEN SOPORTADAS
// /////////////////////////////////////////////////////////////////////////////


const IMAGE_EXTENSIONS = [

    ".webp",
    ".jpg",
    ".jpeg",
    ".png"

];



// /////////////////////////////////////////////////////////////////////////////
// VALIDAR CARPETA DE GALERÍAS
// /////////////////////////////////////////////////////////////////////////////


if (!fs.existsSync(GALERIAS_DIR)) {


    console.error(
        "❌ No existe la carpeta:",
        GALERIAS_DIR
    );


    process.exit(1);

}



// /////////////////////////////////////////////////////////////////////////////
// OBTENER SHOWS DISPONIBLES
//
// Cada carpeta representa un show histórico.
//
// Ejemplo:
//
// assets/shows/galerias/
//      rodney-26-04-25/
//      kif-22-06-24/
//
// /////////////////////////////////////////////////////////////////////////////


const folders = fs.readdirSync(

    GALERIAS_DIR,

    {
        withFileTypes: true
    }

)

    .filter(item => item.isDirectory())

    .map(item => item.name);



// Objeto donde se almacenarán las galerías

const galerias = {};



// /////////////////////////////////////////////////////////////////////////////
// PROCESAR CADA GALERÍA
// /////////////////////////////////////////////////////////////////////////////


folders.forEach(folder => {


    const folderPath = path.join(

        GALERIAS_DIR,

        folder

    );


    // Leer contenido de la carpeta

    const images = fs.readdirSync(

        folderPath

    )


        // Mantener solamente archivos de imagen

        .filter(file => {


            const ext = path.extname(file)

                .toLowerCase();


            return IMAGE_EXTENSIONS.includes(ext);


        })


        // Orden alfabético
        //
        // Importante:
        //
        // 001.webp
        // 002.webp
        // 003.webp
        //
        // aparecerán en ese orden en el modal

        .sort();



    // Guardar información del show

    galerias[folder] = {


        // Indica si hay imágenes disponibles

        tieneGaleria:
            images.length > 0,


        // Lista de imágenes

        imagenes:
            images


    };


});



// /////////////////////////////////////////////////////////////////////////////
// ORDENAR SHOWS
//
// Mantiene el archivo generado ordenado.
//
// /////////////////////////////////////////////////////////////////////////////


const galeriasOrdenadas = Object.keys(galerias)

    .sort()

    .reduce(

        (obj, key) => {


            obj[key] = galerias[key];


            return obj;


        },

        {}

    );



// /////////////////////////////////////////////////////////////////////////////
// GENERAR CONTENIDO DEL MÓDULO ES6
// /////////////////////////////////////////////////////////////////////////////


const fileContent = `
// /////////////////////////////////////////////////////////////////////////////
// ARCHIVO GENERADO AUTOMÁTICAMENTE
//
// NO EDITAR MANUALMENTE
//
// Generado por:
// tools/generarGalerias.js
//
// Contiene la información de imágenes disponibles
// para los shows históricos.
//
// /////////////////////////////////////////////////////////////////////////////


export const galerias = ${JSON.stringify(

    galeriasOrdenadas,

    null,

    4

)};

`;



// /////////////////////////////////////////////////////////////////////////////
// ESCRIBIR ARCHIVO
// /////////////////////////////////////////////////////////////////////////////


fs.writeFileSync(

    OUTPUT_FILE,

    fileContent,

    "utf8"

);



// /////////////////////////////////////////////////////////////////////////////
// RESULTADO
// /////////////////////////////////////////////////////////////////////////////


console.log(
    "✅ galerias.js generado correctamente"
);


console.log(
    "📁 Archivo:",
    OUTPUT_FILE
);


console.log(
    "📸 Galerías procesadas:",
    folders.length
);