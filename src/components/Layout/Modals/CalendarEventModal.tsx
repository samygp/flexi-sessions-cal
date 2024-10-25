import { useCallback, useMemo, useState } from "react";
import BaseModal, { IBaseModalProps } from "./BaseModal";
import { useEventsContext } from "../../../hooks/useCustomContext";
import { CalendarEvent, defaultDummyCalendarEvent } from "../../../shared/models/CalendarEvents";
import CalendarEventForm from "../../Inputs/Forms/CalendarEventForm";


export interface ICalendarEventFormModalProps extends IBaseModalProps {
    originalEvent?: CalendarEvent;
}

export default function CalendarEventModal({ originalEvent = defaultDummyCalendarEvent, readOnly, ...props }: ICalendarEventFormModalProps) {
    const [event, setCalendarEvent] = useState<CalendarEvent>(originalEvent);
    const { eventsAPI: { createCalendarEvent, updateCalendarEvent, removeCalendarEvents } } = useEventsContext();

    const actions = useMemo(() => {
        return {
            onCreate: async () => await createCalendarEvent(event),
            onUpdate: async () => await updateCalendarEvent(event),
            onDelete: async () => await removeCalendarEvents(event),
        }
    }, [event, createCalendarEvent, updateCalendarEvent, removeCalendarEvents]);

    const onClose = useCallback(() => {
        setCalendarEvent(originalEvent);
        if (props.onClose) props.onClose();
    }, [setCalendarEvent, originalEvent, props]);

    return (
        <BaseModal {...{ ...props, ...actions, onClose }}>
            <CalendarEventForm {...{ event, setCalendarEvent, readOnly }} />
        </BaseModal>
    )
}