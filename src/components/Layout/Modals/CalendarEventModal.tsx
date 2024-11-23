import { useCallback, useMemo, useState } from "react";
import BaseModal, { IBaseModalProps } from "@/components/Layout/Modals/BaseModal";
import { useEventsContext } from "@/hooks/useCustomContext";
import { CalendarEvent, defaultDummyCalendarEvent } from "@/shared/models/CalendarEvents";
import CalendarEventForm from "@/components/Inputs/Forms/CalendarEventForm";
import EventSnackbar, { IEventSnackProps } from "@/components/DataDisplay/EventSnackbar";


export interface ICalendarEventFormModalProps extends IBaseModalProps {
    originalEvent?: CalendarEvent;
}

const mandatoryFields: (keyof CalendarEvent)[] = ["title", "date", "eventType", "monkehId"];
const hasMissingValues = (event: Partial<CalendarEvent>) => mandatoryFields.some(field => !event[field]);

export default function CalendarEventModal({ originalEvent = defaultDummyCalendarEvent, readOnly, ...props }: ICalendarEventFormModalProps) {
    const [eventMessage, setEventMessage] = useState<IEventSnackProps>({ message: '', severity: "success" });
    const [event, setCalendarEvent] = useState<CalendarEvent>(originalEvent);
    const { eventsAPI: { createCalendarEvent, updateCalendarEvent, removeCalendarEvents }, loading } = useEventsContext();

    const onSuccess = useCallback((event: CalendarEvent|CalendarEvent[], action: string) => {
        const message = Array.isArray(event) ? `Events ${action}` : `Event ${event.title} ${action}`;
        setEventMessage({ message, severity: "success" });
    }, [setEventMessage]);

    const actions = useMemo(() => {
        const submitDisabled = readOnly || hasMissingValues(event);
        return {
            submitDisabled,
            onCreate: async () => await createCalendarEvent(event).then(evt => onSuccess(evt!, "created")),
            onUpdate: async () => await updateCalendarEvent(event).then(evt => onSuccess(evt!, "updated")),
            onDelete: async () => await removeCalendarEvents(event).then(evt => onSuccess(evt!, "deleted")),
        }
    }, [event, createCalendarEvent, updateCalendarEvent, removeCalendarEvents, readOnly, onSuccess]);

    const onClose = useCallback(() => {
        setCalendarEvent(originalEvent);
        if (props.onClose) props.onClose();
    }, [setCalendarEvent, originalEvent, props]);

    return (
        <BaseModal {...{ ...props, ...actions, onClose, loading }}>
            <EventSnackbar {...eventMessage}/>
            <CalendarEventForm {...{ event, setCalendarEvent, readOnly }} />
        </BaseModal>
    )
}