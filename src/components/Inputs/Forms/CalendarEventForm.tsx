import { CalendarEvent } from "@/shared/models/CalendarEvents";
import EventTypeDropdown from "@/components/Inputs/Dropdowns/EventTypeDropdown";
import GenericForm, { IFieldMapping } from "@/components/Inputs/Forms/GenericForm";
import MonkehLookup from "@/components/Inputs/Dropdowns/MonkehLookup";
import { CalendarEventFieldLabels } from "@/shared/locale/events";
import { useLocale } from "@/hooks/useLocale";
import SessionDatePicker from "@/components/Inputs/SessionDatePicker";
import { useMemo } from "react";

interface ICalendarEventFormProps {
    event: CalendarEvent;
    setCalendarEvent: React.Dispatch<React.SetStateAction<CalendarEvent>>
    readOnly?: boolean;
}

export default function CalendarEventForm({ setCalendarEvent, readOnly, event }: ICalendarEventFormProps) {
    const labels = useLocale<keyof CalendarEvent>(CalendarEventFieldLabels);
    const fieldMappings: IFieldMapping<CalendarEvent>[] = useMemo(() => [
        { label: labels.title, fieldType: "text", fieldName: "title" },
        { label: labels.eventType, fieldType: "custom", fieldName: "eventType", CustomFieldComponent: EventTypeDropdown },
        { label: labels.monkehId, fieldType: "custom", fieldName: "monkehId", CustomFieldComponent: MonkehLookup },
        { label: labels.date, fieldType: "custom", fieldName: "date", CustomFieldComponent: SessionDatePicker, customProps: { eventType: event.eventType, disabled: !!event.id } },
    ], [labels, event]);

    return <GenericForm<CalendarEvent>
        readOnly={readOnly}
        entry={event}
        setEntry={setCalendarEvent}
        fieldMappings={fieldMappings}
    />
}