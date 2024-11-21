import { useCallback, useMemo, useState } from "react";
import BaseModal, { IBaseModalProps } from "@/components/Layout/Modals/BaseModal";
import { useEventsContext } from "@/hooks/useCustomContext";
import { CalendarEvent, defaultDummyCalendarEvent } from "@/shared/models/CalendarEvents";
import CalendarEventForm from "@/components/Inputs/Forms/CalendarEventForm";


export interface ICalendarEventFormModalProps extends IBaseModalProps {
    originalEvent?: CalendarEvent;
}

const mandatoryFields: (keyof CalendarEvent)[] = ["title", "date", "eventType", "monkehId"];
const hasMissingValues = (event: Partial<CalendarEvent>) => mandatoryFields.some(field => !event[field]);

export default function CalendarEventModal({ originalEvent = defaultDummyCalendarEvent, readOnly, ...props }: ICalendarEventFormModalProps) {
    const [event, setCalendarEvent] = useState<CalendarEvent>(originalEvent);
    const { eventsAPI: { createCalendarEvent, updateCalendarEvent, removeCalendarEvents }, loading } = useEventsContext();

    const actions = useMemo(() => {
        const submitDisabled = readOnly || hasMissingValues(event);
        return {
            submitDisabled,
            onCreate: async () => await createCalendarEvent(event),
            onUpdate: async () => await updateCalendarEvent(event),
            onDelete: async () => await removeCalendarEvents(event),
        }
    }, [event, createCalendarEvent, updateCalendarEvent, removeCalendarEvents, readOnly]);

    const onClose = useCallback(() => {
        setCalendarEvent(originalEvent);
        if (props.onClose) props.onClose();
    }, [setCalendarEvent, originalEvent, props]);

    return (
        <BaseModal {...{ ...props, ...actions, onClose, loading }}>
            <CalendarEventForm {...{ event, setCalendarEvent, readOnly }} />
        </BaseModal>
    )
}