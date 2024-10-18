import { IFetchOptions, IFetchResponse } from "../shared/models/Rest";
import axios, { AxiosHeaders, AxiosRequestConfig } from "axios";
const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
}

export const apiFetch = async <BodyType, QueryType, ResponseType>(url: string, options: IFetchOptions<BodyType, QueryType> = { method: 'get' }): Promise<IFetchResponse<ResponseType>> => {
    try {
        const { authToken, method, body, params } = options;
        const headers = new AxiosHeaders({ ...defaultHeaders });
        if (!authToken) throw new Error('Missing auth');
        headers.setAuthorization(`Bearer ${authToken}`);
        const cfg: AxiosRequestConfig = { headers, data: body, params, method, url };
        const { status, data: result } = await axios.request<ResponseType>(cfg);
        const { error } = result as any;
        return { status, result, error };
    } catch (ex) {
        return { status: 500, error: `${ex}` };
    }
}