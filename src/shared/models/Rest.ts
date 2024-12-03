export type RestMethod = 'get' | 'post' | 'put' | 'delete';

export interface IFetchOptions<BodyType, QueryType> {
    method: RestMethod;
    authToken?: string;
    body?: BodyType | BodyType[];
    params?: QueryType;
}

export interface IFetchResponse<T> {
    status: number;
    result?: T;
    error?: string;
}
