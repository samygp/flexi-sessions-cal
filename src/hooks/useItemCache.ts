import { useMemo } from "react";
import { useLocalStorage, useUpdateEffect } from "react-use";
import { nowSeconds, secondsSince } from "../shared/utils/dateHelpers";
import { Moment, unix } from "moment";
import { ISerializerConfig } from "../shared/models/Data";

export interface IItemCache<T> {
    value: T;
    setValue: React.Dispatch<React.SetStateAction<T | undefined>>;
    lastUpdated?: Moment;
    isOutdated: boolean;
}

const getSerializerOptions = <T>(opts?: ISerializerConfig<T>) => {
    return {
        raw: false,
        serializer: opts?.serializer ?? JSON.stringify,
        deserializer: opts?.deserializer ?? JSON.parse,
    };
}

/**
 * @param key The key to use for the localStorage entry
 * @param initialValue The value to return if the key is not present in localStorage
 * @returns An object with three properties: `value`, `setValue`, and `lastUpdated`.
 *   - `value` is the current value of the item in localStorage
 *   - `setValue` is a function to update the value in localStorage
 *   - `lastUpdated` is the timestamp (in seconds) of when the value was last updated
 */
export default function useItemCache<T>(key: string, ttl: number = 3600, opts?: ISerializerConfig<T>): IItemCache<T> {
    const [value, setValue] = useLocalStorage<T>(key, undefined, getSerializerOptions<T>(opts));
    const [lastUpdatedSeconds, setLastUpdated] = useLocalStorage<number>(`${key}_lastUpdated`);

    const lastUpdated = useMemo(() => {
        if (lastUpdatedSeconds) return unix(lastUpdatedSeconds);
    }, [lastUpdatedSeconds]);

    const isOutdated = useMemo(() => {
        return !lastUpdated || secondsSince(lastUpdated) > ttl;
    }, [lastUpdated, ttl]);

    useUpdateEffect(() => {
        if (value) setLastUpdated(nowSeconds);
    }, [value]);

    return { value: value!, setValue, lastUpdated, isOutdated };
}