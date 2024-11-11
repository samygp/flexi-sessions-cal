import { Box, FormControl, FormControlOwnProps, SxProps, TextField } from "@mui/material";
import { useCallback, useMemo } from "react";
import { DateField, DatePicker } from "@mui/x-date-pickers";
import { firstToUpper } from "@/shared/utils/stringHelpers";
import MonthDayPicker from "@/components/Inputs/Dropdowns/MonthDayPicker";

type SupportedFieldTypes = "date" | "text" | "hidden" | "number" | "custom" | "monthday";

export interface IFieldMapping<T> {
    fieldType: SupportedFieldTypes;
    fieldName: keyof T
    label?: string;
    margin?: FormControlOwnProps['margin'];
    customProps?: any;
    CustomFieldComponent?: (props: any) => JSX.Element;
}

interface IGenericFormProps<T> {
    entry: T;
    setEntry: React.Dispatch<React.SetStateAction<T>>
    readOnly?: boolean;
    fieldMappings: IFieldMapping<T>[];
    layoutProps?: SxProps;
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
            onChange,
            disabled: readOnly,
            value: entry[fieldName],
            label: fieldLabel,
            ...customProps,
        }
    }, [fieldLabel, onChange, readOnly, customProps, entry, fieldName]);

    switch (fieldType) {
        case "date":
            return readOnly ? <DateField {...fieldProps} /> : <DatePicker {...fieldProps} />;
        case "monthday":
            return readOnly ? <DateField {...fieldProps} format="MMMM DD" /> : <MonthDayPicker {...fieldProps} />;
        case "text":
        case "number":
            return <TextField  {...fieldProps} fullWidth type={fieldType} onChange={e => onChange(e.target.value)} />;
        case "custom":
            return CustomFieldComponent! && <CustomFieldComponent {...fieldProps} />;
        default:
            return <></>;
    }
}

export default function GenericForm<T>(props: IGenericFormProps<T>) {
    const { layoutProps, fieldMappings, readOnly, entry, setEntry } = props;

    const updateEntryValue = useCallback(async (k: keyof T, v: T[keyof T]) => {
        setEntry((prev: T) => ({ ...prev, [k]: v }));
    }, [setEntry]);

    const fieldProps = useMemo(() => ({ ...props, readOnly, entry, setEntry, updateEntryValue }), [props, readOnly, entry, setEntry, updateEntryValue]);

    return (
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', ...layoutProps }} minWidth={window.innerWidth / 3}>
            {Object.entries(fieldMappings).map(([, fieldMapping]) => {
                const { fieldName, margin } = fieldMapping;
                return (
                    <FormControl key={String(fieldName)} required size="medium" fullWidth margin={margin ?? "normal"} >
                        <GenericFieldInput<T> {...{ ...fieldProps, fieldMapping }} />
                    </FormControl>
                );
            })}
        </Box>
    );
}