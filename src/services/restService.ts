import axios from "axios";
import { IFetchOptions, IFetchResponse } from "../models/Rest";

const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
}

export const apiFetch = async <T>(url: string, options: IFetchOptions = { method: 'get' }): Promise<IFetchResponse<T>> => {
    try {
        const { authToken, method, body, params } = options;
        const Authorization = authToken ? `Beared ${authToken}` : undefined;
        const headers = { ...defaultHeaders, Authorization };
        const { status, data: result } = await axios[method](url, { headers, body, params });
        const { error } = result;
        return { status, result, error };
    } catch (ex) {
        return { status: 500, error: `${ex}` };
    }
}