import { IFetchOptions, IFetchResponse } from "../shared/models/Rest";
import axios, { AxiosHeaders, AxiosRequestConfig } from "axios";

const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
}

export const apiFetch = async <T>(url: string, options: IFetchOptions = { method: 'get' }): Promise<IFetchResponse<T>> => {
    try {
        const { authToken, method, body, params } = options;
        const headers = new AxiosHeaders({ ...defaultHeaders });
        if (authToken) headers.setAuthorization(`Bearer ${authToken}`);
        const cfg: AxiosRequestConfig = { headers, data: body, params, method, url };
        const { status, data: result } = await axios.request<T>(cfg);
        const { error } = result as any;
        return { status, result, error };
    } catch (ex) {
        return { status: 500, error: `${ex}` };
    }
}