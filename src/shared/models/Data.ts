import { Moment } from "moment";

export interface ISerializerConfig<T> {
    serializer?: (value: T) => string;
    deserializer?: (value: string) => T;
}

export interface IBaseAPIHook {
    loading: boolean;
    error?: Error;
}

export interface IRecord {
    id: string;
}

export interface ISelectOption<T> {
    label?: string;
    value: T;
    category?: string;
}

export interface IItemCache<T> {
    value: T;
    setValue: React.Dispatch<React.SetStateAction<T | undefined>>;
    lastUpdated?: Moment;
    isOutdated: boolean;
}