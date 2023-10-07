interface CallApiOptions {
    method?: "GET" | "HEAD" | "POST" | "PUT" | "PATCH" | "DELETE",
    contentType?: "application/json" | "multipart/form-data",
    accessToken?: string
    body?: any
}

export default async function callAPI(endpoint: string, options?: CallApiOptions) {
    let headerContents = {};

    if (options?.contentType) {
        headerContents = {
            'Content-Type': options.contentType
        }
    }

    if (options?.accessToken) {
        headerContents = {
            ...headerContents,
            'Authorization': `Bearer ${options.accessToken}`
        }
    }

    return await fetch(endpoint, {
        method: options?.method ?? "GET",
        headers: headerContents,
        body: options?.body,
        cache: "no-store"
    });
}