import { Box, FormControl, TextField } from "@mui/material";
import { useCallback, useMemo } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import { firstToUpper } from "../../../shared/utils/stringHelpers";

type SupportedFieldTypes = "date" | "text" | "hidden" | "number" | "custom";

export interface IFieldMapping<T> {
    fieldType: SupportedFieldTypes;
    fieldName: keyof T
    label?: string;
    customProps?: any;
    CustomFieldComponent?: (props: any) => JSX.Element;
}

interface IGenericFormProps<T> {
    entry: T;
    setEntry: React.Dispatch<React.SetStateAction<T>>
    readOnly?: boolean;
    fieldMappings: IFieldMapping<T>[];
}

interface IFormFieldProps<T> extends Pick<IGenericFormProps<T>, "entry" | "readOnly"> {
    fieldMapping: IFieldMapping<T>;
    updateEntryValue: <K extends keyof T>(k: K, v: T[K]) => Promise<void>;
}

function GenericFieldInput<T>({ entry, updateEntryValue, fieldMapping, readOnly }: IFormFieldProps<T>) {
    const { fieldType, label, CustomFieldComponent, fieldName, customProps } = fieldMapping;
    const fieldLabel = useMemo(() => label ?? firstToUpper(fieldName.toString()), [fieldName, label]);
    const onChange = useCallback((v: any) => updateEntryValue(fieldName, v), [fieldName, updateEntryValue]);
    const fieldProps = useMemo(() => {
        return {
            readOnly,
            ...customProps,
            value: entry[fieldName],
            onChange,
            label: fieldLabel,
        }
    }, [fieldLabel, onChange, readOnly, customProps, entry, fieldName]);

    switch (fieldType) {
        case "date":
            return <DatePicker {...fieldProps} />;
        case "text":
        case "number":
            return <TextField  {...fieldProps} fullWidth type={fieldType} onChange={e => onChange(e.target.value)} />;
        case "custom":
            return CustomFieldComponent && <CustomFieldComponent {...fieldProps} />;
        default:
            return;
    }
}

export default function GenericForm<T>(props: IGenericFormProps<T>) {
    const { fieldMappings, readOnly, entry, setEntry } = props;

    const updateEntryValue = useCallback(async (k: keyof T, v: T[keyof T]) => {
        setEntry((prev: T) => ({ ...prev, [k]: v }));
    }, [setEntry]);

    const fieldProps = useMemo(() => ({ ...props, readOnly, entry, setEntry, updateEntryValue }), [props, readOnly, entry, setEntry, updateEntryValue]);

    return (
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column' }} minWidth={window.innerWidth / 3}>
            {Object.entries(fieldMappings).map(([k, fieldMapping]) => {
                return (
                    <FormControl key={String(fieldMapping.fieldName)} required size="medium" fullWidth margin="normal" >
                        <GenericFieldInput<T> {...{ ...fieldProps, fieldMapping }} />;
                    </FormControl>
                );
            })}
        </Box>
    );
}