import { CalendarEvent } from "@shared/models/CalendarEvents";
import EventTypeDropdown from "@components/Inputs/Dropdowns/EventTypeDropdown";
import GenericForm, { IFieldMapping } from "@components/Inputs/Forms/GenericForm";
import MonkehLookup from "@components/Inputs/Dropdowns/MonkehLookup";
import { CalendarEventFieldLabels } from "@shared/locale/events";
import { useLocale } from "@hooks/useLocale";

interface ICalendarEventFormProps {
    event: CalendarEvent;
    setCalendarEvent: React.Dispatch<React.SetStateAction<CalendarEvent>>
    readOnly?: boolean;
}

export default function CalendarEventForm({ setCalendarEvent, readOnly, event }: ICalendarEventFormProps) {
    const labels = useLocale<keyof CalendarEvent>(CalendarEventFieldLabels);
    const fieldMappings: IFieldMapping<CalendarEvent>[] = [
        { label: labels.date, fieldType: "date", fieldName: "date" },
        { label: labels.title, fieldType: "text", fieldName: "title" },
        { label: labels.eventType, fieldType: "custom", fieldName: "eventType", CustomFieldComponent: EventTypeDropdown },
        { label: labels.monkehId, fieldType: "custom", fieldName: "monkehId", CustomFieldComponent: MonkehLookup },
    ];

    return <GenericForm<CalendarEvent>
        readOnly={readOnly}
        entry={event}
        setEntry={setCalendarEvent}
        fieldMappings={fieldMappings}
    />
}