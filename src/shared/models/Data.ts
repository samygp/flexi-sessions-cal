export interface ISerializerConfig<T> {
    serializer?: (value: T) => string;
    deserializer?: (value: string) => T;
}

export interface IRecord {
    id: string;
}

export interface ISelectOption<T> {
    label?: string;
    value: T;
}
