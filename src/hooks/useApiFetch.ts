import { useCallback, useRef } from "react";
import { apiFetch } from "../services/restService";
import { IFetchOptions, IFetchResponse } from "../shared/models/Rest";
import { useAsyncFn } from "react-use";
import { useSessionContext } from "./useCustomContext";

export default function useCRUDApiFetch<BodyType, ParamsType>(url: string) {
    const requestAbortController = useRef<AbortController | null>(null);
    const { authState, accessToken: authToken } = useSessionContext();

    const handleFetch = useCallback(async <T>(endpoint: String, opts: IFetchOptions<BodyType, ParamsType>) => {
        if (authState !== 'authenticated' || !authToken) return;
        if (requestAbortController.current) requestAbortController.current.abort();

        const controller = new AbortController();

        const fetchPromise = new Promise<IFetchResponse<T>>(
            async (resolve, reject) => {
                controller.signal.onabort = () => reject(new DOMException('aborted', 'AbortError'));
                apiFetch<BodyType, ParamsType, T>(`${url}/${endpoint}`, { ...opts, authToken }).then(resolve);
            })
            .then(({ status, result, error }) => {
                if (error) throw new Error(`${status} - ${error}`);
                return result;
            })
            .catch((error) => { // ignore the error if it's caused by `controller.abort`
                if (error.name !== 'AbortError') throw error;
            });

        requestAbortController.current = controller;
        return fetchPromise;
    }, [authState, authToken, url]);

    const [{ loading, error }, callAPI] = useAsyncFn(async <T>(endpoint: string, options: IFetchOptions<BodyType, ParamsType>) => {
        return await handleFetch<T>(endpoint, options);
    }, [handleFetch]);
  
    const get = useCallback(async <T>(endpoint: string, filter: ParamsType) => {
      return await callAPI<T>(endpoint, { params: filter, method: 'get' });
    }, [callAPI]);
  
    const create = useCallback(async <T>(endpoint: string, body: BodyType) => {
      return await callAPI<T>(endpoint, { body, method: 'post' });
    }, [callAPI]);

    const update = useCallback(async <T>(endpoint: string, body: BodyType) => {
      return await callAPI<T>(endpoint, { body, method: 'put' });
    }, [callAPI]);

    const remove = useCallback(async <T>(endpoint: string, filter: ParamsType) => {
      return await callAPI<T>(endpoint, { params: filter, method: 'delete' });
    }, [callAPI]);
    
    return { get, create, update, remove, loading, error };
}
