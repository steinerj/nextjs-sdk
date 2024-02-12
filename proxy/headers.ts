export function getProxyHeaders() {
    let headers: { [key: string]: string }  = {};
    if (process.env.SF_CLOUD_KEY && process.env.PORT) {
        // for Sitefinity cloud
        headers['X-SF-BYPASS-HOST'] = `localhost:${process.env.PORT}`;
        headers['X-SF-BYPASS-HOST-VALIDATION-KEY'] = process.env.SF_CLOUD_KEY;
    } else if (process.env.PORT) {
        // when using a custom port
        const originalHost = process.env.PROXY_ORIGINAL_HOST || 'localhost';
        headers['X-ORIGINAL-HOST'] = `${originalHost}:${process.env.PORT}`;
    }

    return headers;
}
