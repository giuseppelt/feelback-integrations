
async function get<T>(url: string, ...params: any[]) {
    if (params.length > 0) {
        url = `${url}?$p=${JSON.stringify(params)}`;
    }

    return await getResponse<T>(fetch(url, {
        method: "GET",
    }));
}

async function post<T>(url: string, ...params: any[]) {
    return await getResponse<T>(fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(params)
    }));
}

async function getResponse<T>(response: Promise<Response> | Response) {
    response = await response;

    if (response.status >= 400) {
        throw new Error("[feelback] API error");
    }

    if (response.status === 204) {
        return;
    }

    return await response.json() as T;
}


export default {
    get,
    post
};
