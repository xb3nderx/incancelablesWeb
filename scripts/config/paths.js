/*constante que ayuda a corregir paths dsde cualquier lugar del sistio*/
export const BASE_PATH =
    window.location.pathname.includes("/pages/")
        ? "../"
        : "";