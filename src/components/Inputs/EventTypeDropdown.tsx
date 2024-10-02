import { MenuItem, Select } from "@mui/material";
import { EventType, EventTypeLabels } from "../../models/CalendarEvents";
import { useCallback } from "react";

const EventTypeOption = ({ value }: { value: EventType }) => (
    <MenuItem value={value}>{EventTypeLabels[value]}</MenuItem>
);

interface IEventTypeDropdownProps {
    value: EventType;
    setEventType: (e: EventType) => void;
}

export default function EventTypeDropdown({value, setEventType}: IEventTypeDropdownProps) {
    const onChange = useCallback((e: any) => setEventType(e.target.value as EventType), [setEventType]);
    return (
        <Select {...{ value, onChange }} id="event-type-select" label="Event Type">
            {Object.values(EventType).map(e => <EventTypeOption key={e} value={e} />)}
        </Select>
    );
}