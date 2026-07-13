// =======================================================
// FORMULARIOS
// =======================================================

async function sendForm(form) {

    try {

        const data = new FormData(form);

        const browser = getBrowserInfo();

        Object.entries(browser).forEach(([key, value]) => {

            data.append(key, value);

        });
        const response = await fetch(API.URL, {
            method: "POST",
            body: data
        });

        const json = await response.json();

        return {

            ok: json.success,

            code: json.code ?? null,

            message: json.message,

            data: json.data ?? null

        };

    }
    catch (error) {

        return {

            ok: false,

            message: "No fue posible conectar con el servidor.",

            data: null

        };

    }

}