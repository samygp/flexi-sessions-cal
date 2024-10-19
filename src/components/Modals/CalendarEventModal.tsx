import { useCallback, useMemo, useState } from "react";
import { CalendarEvent } from "../../shared/models/CalendarEvents";
import CalendarEventForm from "../Inputs/Forms/CalendarEventForm";
import BaseModal, { IBaseModalProps } from "./BaseModal";
import { useEventCalendarContext } from "../../hooks/useCustomContext";

export interface ICalendarEventFormModalProps extends IBaseModalProps {
    originalEvent: CalendarEvent;
    isDelete?: boolean;
    readOnly?: boolean;
}

export default function CalendarEventModal({ originalEvent, readOnly, open, title, onClose, ...props }: ICalendarEventFormModalProps) {
    const [event, setCalendarEvent] = useState<CalendarEvent>(originalEvent);
    const { eventsAPI: { createCalendarEvent, updateCalendarEvent } } = useEventCalendarContext();

    const onSubmit = useCallback(async () => {
        if (originalEvent.id) await createCalendarEvent(event);
        else await updateCalendarEvent(event);
    }, [originalEvent, event]);

    const submitButtonText = useMemo(() => {
        if (props.submitButtonText) return props.submitButtonText;
        else if (props.isDelete) return "Delete";
        return originalEvent.id ? "Update" : "Create";
    }, [props, originalEvent]);

    const submitButtonStyle = useMemo(() => {
        if (props.submitButtonStyle) return props.submitButtonStyle;
        else if (props.isDelete) return "error";
        return "primary";
    }, [props, originalEvent]);

    const submitDisabled = useMemo(() => props.submitDisabled ?? readOnly, [props, readOnly]);

    return (
        <BaseModal {...{ open, onClose, title, onSubmit, submitButtonStyle, submitButtonText, submitDisabled }}>
            <CalendarEventForm {...{ event, setCalendarEvent, readOnly }} />
        </BaseModal>
    )
}