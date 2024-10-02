export interface IFetchOptions {
    method: 'get' | 'post' | 'put' | 'delete';
    authToken?: string;
    body?: any;
    params?: Record<string, any>;
}

export interface IFetchResponse<T> {
    status: number;
    result?: T;
    error?: string;
}