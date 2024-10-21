import { CalendarEvent } from "../../../shared/models/CalendarEvents";
import EventTypeDropdown from "../Dropdowns/EventTypeDropdown";
import GenericForm, { IFieldMapping } from "./GenericForm";
import MonkehLookup from "../Dropdowns/MonkehLookup";

interface ICalendarEventFormProps {
    event: CalendarEvent;
    setCalendarEvent: React.Dispatch<React.SetStateAction<CalendarEvent>>
    readOnly?: boolean;
}

export default function CalendarEventForm({ setCalendarEvent, readOnly, event }: ICalendarEventFormProps) {
    const fieldMappings: IFieldMapping<CalendarEvent>[] = [
        { label: "Date", fieldType: "date", fieldName: "date" },
        { label: "Title", fieldType: "text", fieldName: "title" },
        { label: "Type", fieldType: "custom", fieldName: "eventType", CustomFieldComponent: EventTypeDropdown },
        { label: "Monkeh", fieldType: "custom", fieldName: "monkehId", CustomFieldComponent: MonkehLookup },
    ];

    return <GenericForm<CalendarEvent>
        readOnly={readOnly}
        entry={event}
        setEntry={setCalendarEvent}
        fieldMappings={fieldMappings}
    />
}