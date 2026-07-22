// =======================================================
// API CONFIG
// =======================================================

const API = {

    URL_DEV:
        "https://script.google.com/macros/s/AKfycbzMSx5lM48xVjKBwxpw-51y3unfKOXS8eb7EuqOrviNFSLnX1xQ36Jwvkpz1bbNwu0o/exec",

    URL_PROD:
        "https://script.google.com/macros/s/AKfycbwCdemjNBvYsy6MsqtEpfqjfctOGdxCK_S2ukxLQmCfM6TKXAwvPODOrruMngm9r5C8/exec",

    ENVIRONMENT: "DEV",

    TIMEOUT: 10000

};

API.URL =
    API.ENVIRONMENT === "PROD"
        ? API.URL_PROD
        : API.URL_DEV;