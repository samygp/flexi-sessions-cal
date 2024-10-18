import { Autocomplete, AutocompleteRenderInputParams, TextField } from "@mui/material";
import { useCallback, useMemo } from "react";

export interface ILookupEntry {
    id: string;
}

interface ILookupProps<T extends ILookupEntry> {
    value: string;
    setValue: (v: string | null) => void;
    label: string;
    entries: T[] | Record<string, T>;
    getOptionLabel?: (e: T) => string;
    getOptionValue?: (e: T) => string;
}

interface IOption {
    id: string;
    label: string;
}

export default function Lookup<T extends ILookupEntry>(props: ILookupProps<T>) {
    const { entries, getOptionLabel, getOptionValue, value, setValue, label } = props;

    const getOptionFromEntry = useCallback((e: T): IOption => {
        const id = getOptionValue ? getOptionValue(e) : e.id;
        const label = getOptionLabel ? getOptionLabel(e) : e.id;
        return { id, label };
    }, [getOptionValue, getOptionLabel]);

    const options = useMemo<IOption[]>(() => {
        const entryList = Array.isArray(entries) ? entries : Object.values(entries);
        return entryList.map(getOptionFromEntry);
    }, [entries, getOptionFromEntry]);

    const onChange = useCallback((_e: any, v: IOption|null) => setValue(v && v.id), [setValue]);
    const optionValue = useMemo(() => options.find(o => o.id === value), [options, value]);

    const renderInput = useCallback((params: AutocompleteRenderInputParams) => <TextField {...{...params, label}} />, [label]);

    return (
        <>
            {/* <InputLabel id="event-type-label" variant="outlined">Event Type</InputLabel> */}
            <Autocomplete disablePortal {...{ options, renderInput, onChange }} value={optionValue}/>

        </>
    );
}