import { Autocomplete, AutocompleteRenderInputParams, createFilterOptions, TextField } from "@mui/material";
import { SyntheticEvent, useCallback, useEffect, useMemo, useState } from "react";

interface ILookupProps<T> {
    value: string | string[];
    onChange: (v: string | string[]) => void;
    label: string;
    multiple?: boolean;
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
    const { entries, getOptionLabel, getOptionValue, getCategory, value, onChange: setValue, label, multiple } = props;

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

    const [optionValue, setOptionValue] = useState<IOption | IOption[] | undefined>(multiple ? options.filter(o => value === o.id) : options.find(o => o.id === value));
    const onChange = useCallback((event: SyntheticEvent<Element, Event>, value: IOption | IOption[] | null) => {
        event.preventDefault();
        setOptionValue(value || undefined);
      }, [setOptionValue]);

    useEffect(() => {
        if (optionValue) {
            setValue(multiple ? (optionValue as IOption[]).map(o => o.id) : (optionValue as IOption).id);
        }
    }, [optionValue, setValue, multiple]);

    const renderInput = useCallback((params: AutocompleteRenderInputParams) => <TextField {...{ ...params, label }} />, [label]);
    const groupBy = useCallback((o: IOption) => o.category ?? '', []);

    return (
        <Autocomplete value={optionValue}
            {...{ options, renderInput, filterOptions, groupBy, onChange, multiple }}
        />
    );
}