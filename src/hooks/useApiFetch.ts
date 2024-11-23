import { useCallback, useRef } from "react";
import { apiFetch } from "../services/restService";
import { IFetchOptions, IFetchResponse } from "@/shared/models/Rest";
import { useAsyncFn } from "react-use";
import { useSessionContext } from "./useCustomContext";
import { IItemCache } from "@/shared/models/Data";

interface ICacheOptions<T> {
  getId: (v: T) => string;
  cache: IItemCache<T[]>;
}

interface IUpdateCacheOptions {
  removeOperation?: boolean;
  clearCache?: boolean;
}

type APIResult<T> = T | T[] | void | undefined;
type APIResultParser<T> = (v: any) => T;

export interface ICrudAPIFetchOptions<SourceModel> {
  url: string;
  cacheOpts?: ICacheOptions<SourceModel>;
  parseResult?: APIResultParser<SourceModel>;
}

export default function useCRUDApiFetch<BodyType, ParamsType, APIResponseType, SourceModel>({ url, cacheOpts, parseResult }: ICrudAPIFetchOptions<SourceModel>) {
  const requestAbortController = useRef<AbortController | null>(null);
  const { authState, accessToken: authToken } = useSessionContext();

  const {cache, getId: getItemId} = cacheOpts ?? {};
  const updateCache = useCallback((items: SourceModel[], { removeOperation, clearCache }: IUpdateCacheOptions = {}) => {
    if (!cache || !getItemId) return;
    const updatedIds = new Set<string>(items.map(getItemId));
    const initCacheValue = (!clearCache && cache.value) || [];
    const newValue = initCacheValue.filter(r => !updatedIds.has(getItemId(r))).concat(removeOperation ? [] : items);
    cache.setValue(newValue);
  }, [cache, getItemId]);

  const handleFetch = useCallback(async (endpoint: String, opts: IFetchOptions<BodyType, ParamsType>): Promise<APIResult<APIResponseType>> => {
    if (authState !== 'authenticated' || !authToken) return;
    if (requestAbortController.current) requestAbortController.current.abort();

    const controller = new AbortController();

    const fetchPromise = new Promise<IFetchResponse<APIResponseType>>(
      async (resolve, reject) => {
        controller.signal.onabort = () => reject(new DOMException('aborted', 'AbortError'));
        apiFetch<BodyType, ParamsType, APIResponseType>(`${url}/${endpoint}`, { ...opts, authToken }).then(resolve);
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

  const handleAPIResult = useCallback((result: APIResult<APIResponseType>, updateCacheOpts?: IUpdateCacheOptions) => {
    if (!result) return;

    const isArrayResult = Array.isArray(result);
    const apiResults: APIResponseType[] = (isArrayResult ? result : [result]);
    const parsedResults: SourceModel[] = apiResults.map(v => parseResult?.(v) ?? v) as unknown as SourceModel[];

    updateCache(parsedResults, updateCacheOpts);

    return isArrayResult ? parsedResults : parsedResults[0];
  }, [parseResult, updateCache]);

  const [{ loading, error }, callAPI] = useAsyncFn(async (endpoint: string, options: IFetchOptions<BodyType, ParamsType>, updateCacheOpts?: IUpdateCacheOptions) => {
    return await handleFetch(endpoint, options).then(r => handleAPIResult(r, updateCacheOpts));
  }, [handleFetch, handleAPIResult]);

  const get = useCallback(async (endpoint: string, filter: ParamsType, clearCache?: boolean) => {
    return await callAPI(endpoint, { params: filter, method: 'get' }, { clearCache });
  }, [callAPI]);

  const create = useCallback(async (endpoint: string, body: BodyType) => {
    return await callAPI(endpoint, { body, method: 'post' });
  }, [callAPI]);

  const update = useCallback(async (endpoint: string, body: BodyType) => {
    return await callAPI(endpoint, { body, method: 'put' });
  }, [callAPI]);

  const remove = useCallback(async (endpoint: string, filter: ParamsType) => {
    return await callAPI(endpoint, { params: filter, method: 'delete' }, { removeOperation: true });
  }, [callAPI]);

  return { get, create, update, remove, loading, error };
}
