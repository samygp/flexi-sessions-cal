import { Box, FormControl, TextField } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { CalendarEvent, calendarEventKeys, defaultDummyCalendarEvent, EventType } from "../../../models/CalendarEvents";
import moment, { Moment } from "moment";
import EventTypeDropdown from "../EventTypeDropdown";
import { DateTimePicker } from "@mui/x-date-pickers";


interface ICalendarEventFormProps {
    originalEvent?: CalendarEvent;
    readOnly?: boolean;
    onSave?: (event: CalendarEvent) => Promise<CalendarEvent>;
    onDelete?: (event: CalendarEvent) => Promise<CalendarEvent>;
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
    const value = useMemo(() => event[fieldName], [event[fieldName]]);

    switch (fieldName) {
        case "date":
            return <DateTimePicker {...{ onChange, label }} value={value as Moment}/>;
        case "eventType":
            return <EventTypeDropdown value={value as EventType} setEventType={onChange} />;
        default:
            return <TextField fullWidth={fieldName === "title"} onChange={e => onChange(e.target.value)} {...{label, value}} />
    }
}

function FormField(props: IFormFieldProps) {
    return (
        <FormControl>
            <CalendarEventFieldInput {...props} />
        </FormControl>
    )
}

export default function CalendarEventForm({ readOnly, originalEvent = defaultDummyCalendarEvent }: ICalendarEventFormProps) {
    const [event, setCalendarEvent] = useState<CalendarEvent>(originalEvent);
    const updateEventValue = useCallback(async (k: keyof CalendarEvent, v: CalendarEvent[keyof CalendarEvent]) => {
        setCalendarEvent(prev => ({...prev, [k]: v}));
    }, [setCalendarEvent]);

    return (
        <Box component="form" >
            {event.id && <FormField fieldName="id" {...{ event, setCalendarEvent, readOnly, updateEventValue}} />}
            <FormField fieldName="title" {...{ event, setCalendarEvent, readOnly, updateEventValue}} />
            <FormField fieldName="date" {...{ event, setCalendarEvent, readOnly, updateEventValue}} />
            <FormField fieldName="eventType" {...{ event, setCalendarEvent, readOnly, updateEventValue}} />
            <FormField fieldName="userName" {...{ event, setCalendarEvent, readOnly, updateEventValue}} />
            <FormField fieldName="userEmail" {...{ event, setCalendarEvent, readOnly, updateEventValue}} />
        </Box>
    );
}