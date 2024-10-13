import { InputLabel, MenuItem, Select } from "@mui/material";
import { useCallback } from "react";
import { EventType, EventTypeLabels } from "../../shared/models/CalendarEvents";

interface IEventTypeDropdownProps {
    value: EventType;
    setEventType: (e: EventType) => void;
}

export default function EventTypeDropdown({value, setEventType}: IEventTypeDropdownProps) {
    const onChange = useCallback((e: any) => setEventType(e.target.value as EventType), [setEventType]);
    return (
        <>
        <InputLabel id="event-type-label" variant="outlined">Event Type</InputLabel>
        
        <Select {...{ value, onChange }} id="event-type-select" required label="Event Type">
            {Object.values(EventType).map(e => {
                return <MenuItem key={e} value={e}>{EventTypeLabels[e]}</MenuItem>
                })}
        </Select>
        </>
    );
}