import { Autocomplete, AutocompleteRenderInputParams, createFilterOptions, TextField } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";

interface ILookupProps<T> {
    value: string;
    onChange: (v: string) => void;
    label: string;
    entries: T[] | Record<string, T>;
    getCategory?: (e: T) => string;
    getOptionLabel?: (e: T) => string;
    getOptionValue: (e: T) => string;
}

interface IOption {
    id: string;
    label: string;
    category?: string;
}

const filterOptions = createFilterOptions({
    stringify: ({ id, label }: IOption) => `${id}_${label}`,
});

export default function Lookup<T>(props: ILookupProps<T>) {
    const { entries, getOptionLabel, getOptionValue, getCategory, value, onChange: setValue, label } = props;

    const getOptionFromEntry = useCallback((e: T): IOption => {
        const id = getOptionValue(e);
        const label = getOptionLabel ? getOptionLabel(e) : id;
        const category = getCategory && getCategory(e);
        return { id, label, category };
    }, [getOptionValue, getOptionLabel, getCategory]);

    const options = useMemo<IOption[]>(() => {
        const entryList = Array.isArray(entries) ? entries : Object.values(entries);
        return entryList.map(getOptionFromEntry);
    }, [entries, getOptionFromEntry]);

    const [optionValue, setOptionValue] = useState<IOption | null>(options.find(o => o.id === value) ?? null);
    const onChange = useCallback((_e: any, v: IOption | null) => setOptionValue(v), [setOptionValue]);

    useEffect(() => {
        if (optionValue) setValue(optionValue.id);
    }, [optionValue, setValue]);

    const renderInput = useCallback((params: AutocompleteRenderInputParams) => <TextField {...{ ...params, label }} />, [label]);
    const groupBy = useCallback((o: IOption) => o.category ?? '', []);

    return (
        <Autocomplete<IOption> value={optionValue}
            {...{ options, renderInput, filterOptions, groupBy, onChange }}
        />
    );
}