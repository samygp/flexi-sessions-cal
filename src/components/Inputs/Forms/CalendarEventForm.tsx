import { Box, Button, ButtonGroup, FormControl, TextField } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { Moment } from "moment";
import EventTypeDropdown from "../EventTypeDropdown";
import { DateTimePicker } from "@mui/x-date-pickers";
import { CalendarEvent, defaultDummyCalendarEvent, EventType } from "../../../shared/models/CalendarEvents";


interface ICalendarEventFormProps {
    originalEvent?: CalendarEvent;
    readOnly?: boolean;
    onSave?: (event: CalendarEvent) => Promise<any>;
    onDelete?: (event: CalendarEvent) => Promise<any>;
    onCancel?: () => void;
}

interface IFormFieldProps {
    readOnly?: boolean;
    fieldName: keyof CalendarEvent;
    event: CalendarEvent;
    updateEventValue: <K extends keyof CalendarEvent>(k: K, v: CalendarEvent[K]) => Promise<void>;
}

const eventFieldLabels: Record<keyof CalendarEvent, string> = {
    id: "ID",
    date: "Date",
    title: "Title",
    eventType: "Type",
    userEmail: "Email",
    userName: "Name(s)",
}

function CalendarEventFieldInput({ fieldName, event, updateEventValue }: IFormFieldProps) {
    const onChange = useCallback((v: any) => updateEventValue(fieldName, v), [fieldName, updateEventValue]);
    const label = useMemo(() => eventFieldLabels[fieldName], [fieldName]);

    switch (fieldName) {
        case "date":
            return <DateTimePicker {...{ onChange, label }} value={event[fieldName] as Moment} />;
        case "eventType":
            return <EventTypeDropdown value={event[fieldName] as EventType} setEventType={onChange} />;
        default:
            return <TextField value={event[fieldName]} fullWidth onChange={e => onChange(e.target.value)} {...{ label }} />
    }
}

function FormField(props: IFormFieldProps) {
    return (
        <FormControl required size="medium" fullWidth margin="normal" >
            <CalendarEventFieldInput {...props} />
        </FormControl>
    );
}

export default function CalendarEventForm({ originalEvent = defaultDummyCalendarEvent, ...props }: ICalendarEventFormProps) {
    const { readOnly, onSave, onDelete, onCancel } = props;
    const [event, setCalendarEvent] = useState<CalendarEvent>(originalEvent);
    const updateEventValue = useCallback(async (k: keyof CalendarEvent, v: CalendarEvent[keyof CalendarEvent]) => {
        setCalendarEvent((prev: CalendarEvent) => ({ ...prev, [k]: v }));
    }, [setCalendarEvent]);

    const fieldProps = useMemo(() => ({ readOnly, event, setCalendarEvent, updateEventValue }), [readOnly, event, setCalendarEvent, updateEventValue]);

    return (
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column'}} minWidth={window.innerWidth / 3}>
            {event.id && <FormField fieldName="id" {...fieldProps} />}
            <FormField fieldName="title" {...fieldProps} />
            <FormField fieldName="date" {...fieldProps} />
            <FormField fieldName="eventType" {...fieldProps} />
            <FormField fieldName="userName" {...fieldProps} />
            <FormField fieldName="userEmail" {...fieldProps} />
            <ButtonGroup variant="contained" size="large" fullWidth>
                {onSave && <Button disabled={readOnly} onClick={() => onSave(event)} color="primary">Save</Button>}
                {onDelete && <Button disabled={readOnly} onClick={() => onDelete(event)}>Delete</Button>}
                {onCancel && <Button onClick={onCancel} variant="outlined">Cancel</Button>}
            </ButtonGroup>
        </Box>
    );
}