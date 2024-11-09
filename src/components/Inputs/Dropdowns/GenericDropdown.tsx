import { FormControl, InputLabel, ListSubheader, MenuItem, Select, SelectChangeEvent, SelectProps } from "@mui/material";
import { useCallback, useMemo } from "react";
import { ISelectOption } from "@/shared/models/Data";
import { groupBy } from "lodash";

interface IGenericDropdownProps<T extends string | number> extends Omit<SelectProps, "onChange" | "defaultValue"> {
    options: ISelectOption<T>[];
    value: T;
    label?: string;
    onChange: (v: T) => void;
    typeSafeValue?: (v: any) => T;
}

export default function GenericDropdown<T extends string | number>(props: IGenericDropdownProps<T>) {
    const { label, options, value, onChange: setValue, typeSafeValue, ...rest } = props;

    const onChange = useCallback(({ target: { value } }: SelectChangeEvent<T>) => {
        setValue(typeSafeValue ? typeSafeValue(value) : value as T);
    }, [typeSafeValue, setValue]);

    const groupedOptions = useMemo(() => groupBy(options, 'category'), [options]);

    return (
        <FormControl>
            {label && <InputLabel id={`${label}-label`} variant="outlined">{label}</InputLabel>}

            <Select<T> {...{ ...rest, value, onChange }} label={label} required>
                {
                    Object.entries(groupedOptions).flatMap(([category, options]) => {
                        return [
                            <ListSubheader sx={{cursor: 'default'}}>{category === 'undefined' ? '' : category}</ListSubheader>,
                            ...options.map(({ label: l, value }) => {
                                return <MenuItem key={value} value={value}>{l ?? value}</MenuItem>
                            })
                        ];
                    })
                }
            </Select>
        </FormControl>
    );
}