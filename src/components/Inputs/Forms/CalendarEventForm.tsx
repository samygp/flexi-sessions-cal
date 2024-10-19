import { Box, Button, ButtonGroup, FormControl, TextField } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { Moment } from "moment";
import { DatePicker } from "@mui/x-date-pickers";
import { CalendarEvent, defaultDummyCalendarEvent, EventType } from "../../../shared/models/CalendarEvents";
import EventTypeDropdown from "../Dropdowns/EventTypeDropdown";


interface ICalendarEventFormProps {
    event: CalendarEvent;
    setCalendarEvent: React.Dispatch<React.SetStateAction<CalendarEvent>>
    readOnly?: boolean;
}

interface IFormFieldProps<K extends keyof CalendarEvent> {
    readOnly?: boolean;
    fieldName: K;
    value: CalendarEvent[K];
    event: CalendarEvent;
    updateEventValue: <K extends keyof CalendarEvent>(k: K, v: CalendarEvent[K]) => Promise<void>;
}

const eventFieldLabels: Record<keyof CalendarEvent, string> = {
    id: "ID",
    date: "Date",
    title: "Title",
    eventType: "Type",
    monkehId: "Monkeh",
}

function CalendarEventFieldInput<K extends keyof CalendarEvent>({ fieldName, value, updateEventValue }: IFormFieldProps<K>) {
    const onChange = useCallback((v: any) => updateEventValue(fieldName, v), [fieldName, updateEventValue]);
    const label = useMemo(() => eventFieldLabels[fieldName as keyof CalendarEvent], [fieldName]);

    switch (fieldName) {
        case "date":
            return <DatePicker {...{ onChange, label, value }} />;
        case "eventType":
            return <EventTypeDropdown value={value as EventType} setEventType={onChange} />;
        default:
            return <TextField value={value} fullWidth onChange={e => onChange(e.target.value)} {...{ label }} />
    }
}

export default function CalendarEventForm({ setCalendarEvent, readOnly, event }: ICalendarEventFormProps) {

    const updateEventValue = useCallback(async (k: keyof CalendarEvent, v: CalendarEvent[keyof CalendarEvent]) => {
        setCalendarEvent((prev: CalendarEvent) => ({ ...prev, [k]: v }));
    }, [setCalendarEvent]);

    const fieldProps = useMemo(() => ({ readOnly, event, updateEventValue }), [readOnly, event, updateEventValue]);

    return (
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column' }} minWidth={window.innerWidth / 3}>
            <FormControl required size="medium" fullWidth margin="normal" >
                <CalendarEventFieldInput fieldName="title" {...fieldProps} value={event.title} />
            </FormControl>
            <FormControl required size="medium" fullWidth margin="normal" >
                <CalendarEventFieldInput fieldName="date" {...fieldProps} value={event.date} />
            </FormControl>
            <FormControl required size="medium" fullWidth margin="normal" >
                <CalendarEventFieldInput fieldName="eventType" {...fieldProps} value={event.eventType} />
            </FormControl>
            <FormControl required size="medium" fullWidth margin="normal" >
                <CalendarEventFieldInput fieldName="monkehId" {...fieldProps} value={event.monkehId} />
            </FormControl>
        </Box>
    );
}