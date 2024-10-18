import { Box, Button, ButtonGroup, FormControl, TextField } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { Moment } from "moment";
import { DatePicker } from "@mui/x-date-pickers";
import EventTypeDropdown from "../Dropdowns/EventTypeDropdown";
import Lookup, { ILookupEntry } from "../Dropdowns/Lookup";
import { firstToUpper } from "../../../shared/utils/stringHelpers";
import { EventType } from "../../../shared/models/CalendarEvents";

type SupportedFieldTypes = "date" | "eventType" | "lookup" | "text";
interface IFieldMapping {
    fieldType: SupportedFieldTypes;
    label?: string;
}

interface IGenericFormProps<T extends ILookupEntry> {
    originalEntry?: T;
    readOnly?: boolean;
    fieldMappings: Record<keyof T, IFieldMapping>;
    onSave?: (entry: T) => Promise<any>;
    onDelete?: (entry: T) => Promise<any>;
    onCancel?: () => void;
}

interface IFormFieldProps<T extends ILookupEntry> {
    readOnly?: boolean;
    fieldName: keyof T;
    fieldMapping: IFieldMapping;
    lookupEntries?: T[] | Record<string, T>;
    entry: T;
    updateEntryValue: <K extends keyof T>(k: K, v: T[K]) => Promise<void>;
}

function GenericFieldInput<T extends ILookupEntry>({ fieldName, lookupEntries, entry, updateEntryValue, fieldMapping }: IFormFieldProps<T>) {
    const { fieldType, label } = fieldMapping;
    const fieldLabel = useMemo(() => label ?? firstToUpper(fieldName.toString()), [fieldName, label]);
    const onChange = useCallback((v: any) => updateEntryValue(fieldName, v), [fieldName, updateEntryValue]);

    switch (fieldType) {
        case "date":
            return <DatePicker {...{ onChange, label }} value={entry[fieldName] as Moment} />;
        case "eventType":
            return <EventTypeDropdown value={entry[fieldName] as EventType} setEventType={onChange} />;
        case "lookup":
            return <Lookup entries={lookupEntries!} value={entry[fieldName] as string} setValue={onChange} label={fieldLabel} />;
        default:
            return <TextField value={entry[fieldName]} fullWidth onChange={e => onChange(e.target.value)} label={fieldLabel} />
    }
}

function FormField<T extends ILookupEntry>(props: IFormFieldProps<T>) {
    return (
        <FormControl required size="medium" fullWidth margin="normal" >
            <GenericFieldInput {...props} />
        </FormControl>
    );
}

export default function GenericForm<T extends ILookupEntry>({ originalEntry, ...props }: IGenericFormProps<T>) {
    const { fieldMappings, readOnly, onSave, onDelete, onCancel } = props;

    const [entry, setEntry] = useState<T>(originalEntry ?? {} as T);

    const updateEntryValue = useCallback(async (k: keyof T, v: T[keyof T]) => {
        setEntry((prev: T) => ({ ...prev, [k]: v }));
    }, [setEntry]);

    const fieldProps = useMemo(() => ({ ...props, readOnly, entry, setEntry, updateEntryValue }), [props, readOnly, entry, setEntry, updateEntryValue]);

    return (
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column' }} minWidth={window.innerWidth / 3}>
            {Object.entries(fieldMappings).map(([k, fieldMapping]) => {
                return <FormField<T> key={k} fieldName={k as keyof T} {...{...fieldProps, fieldMapping}} />;
            })}
            <ButtonGroup variant="contained" size="large" fullWidth>
                {onSave && <Button disabled={readOnly} onClick={() => onSave(entry)} color="primary">Save</Button>}
                {onDelete && <Button disabled={readOnly} onClick={() => onDelete(entry)}>Delete</Button>}
                {onCancel && <Button onClick={onCancel} variant="outlined">Cancel</Button>}
            </ButtonGroup>
        </Box>
    );
}