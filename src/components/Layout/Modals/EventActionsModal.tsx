import { useCallback, useEffect, useMemo, useState } from "react";
import BaseModal, { IBaseModalProps } from "@/components/Layout/Modals/BaseModal";
import { useEventsContext } from "@/hooks/useCustomContext";
import { CalendarEvent, defaultDummyCalendarEvent } from "@/shared/models/CalendarEvents";
import { EventRuleOrder, IConflictingEventsResult } from "@/shared/models/EventRules";
import useEventRules from "@/hooks/useEventRules";
import { Box, Typography } from "@mui/material";
import { readableDateTime } from "@/shared/utils/dateHelpers";
import EventTypeTag from "@/components/DataDisplay/Tags/EventTypeTag";
import { ArrowRight } from "@mui/icons-material";
import GenericList, { IListItemProps } from "@/components/DataDisplay/Lists/GenericList";
import { Moment } from "moment";
import SessionDatePicker from "@/components/Inputs/SessionDatePicker";
import { createGroupedEventMap } from "@/shared/utils/events";
import CalendarEventModal from "./CalendarEventModal";
import { firstToUpper } from "@/shared/utils/stringHelpers";

export interface IEventActionsConfirmModalProps extends Omit<IBaseModalProps, 'open' | 'title'> {
    targetEventId?: string;
    action: 'update' | 'delete' | 'reschedule' | 'swap';
}

interface IEventShiftStackDetailsProps {
    eventShiftStack: IConflictingEventsResult[];
    targetEvent: CalendarEvent;
}

interface IEventRescheduleProps extends IEventShiftStackDetailsProps {
    setEventShiftStack: React.Dispatch<React.SetStateAction<IConflictingEventsResult[]>>;
}


function EventShiftStackDetails({ eventShiftStack }: { eventShiftStack: IConflictingEventsResult[] }) {
    const { getEventDescription } = useEventsContext();
    const { parseEventConflictCheckDetails } = useEventRules();
    const items = useMemo<IListItemProps[]>(() => {
        if (!eventShiftStack) return [];
        return eventShiftStack?.map(e => {
            const { skips, overridingEvent } = parseEventConflictCheckDetails(e);
            return {
                icon: <EventTypeTag {...e.originalEvent} />,
                text: <Typography variant="body2" gap={2} display={"flex"} alignItems={"center"}>{getEventDescription(e.originalEvent)} <ArrowRight /> {readableDateTime(e.date)}</Typography>,
                subtext: !skips.length && !overridingEvent ? undefined : (
                    <>
                        {overridingEvent && <Typography variant="subtitle2">{overridingEvent}</Typography>}
                        {skips.length ? <Typography variant="subtitle2"> Skipping: {skips.join(' | ')} </Typography> : ''}
                    </>
                )
            }
        });
    }, [eventShiftStack]);

    return (
        <Box gap={1} display={"flex"} flexDirection={"column"} padding={2}>
            <Typography variant="h5">The following updates will be applied:</Typography>
            <GenericList {...{ items }} />
        </Box>
    );
}


function EventDeleteConfirmDetails({ deleteEvent }: { deleteEvent: CalendarEvent }) {
    const { getEventDescription } = useEventsContext();

    return (
        <Box gap={3} display={"flex"} flexDirection={"column"} padding={2}>
            <Typography variant="h5">Are you sure you want to delete this event?</Typography>
            <Typography variant="body1" gap={2} display={"flex"} alignItems={"center"}>
                <EventTypeTag {...deleteEvent} />
                {getEventDescription(deleteEvent)}
            </Typography>
        </Box>
    );
}


function EventShiftDetails({ targetEvent, eventShiftStack, order }: IEventShiftStackDetailsProps & { order: EventRuleOrder }) {
    const { getEventDescription } = useEventsContext();

    return (
        <Box gap={3} display={"flex"} flexDirection={"column"} padding={2}>
            <Typography variant="h5">
                Are you sure you want to shift this event to a {order === 'prev' ? 'n earlier' : 'later'} date?
                This will move {order === 'prev' ? 'forward' : 'backwards'} all future events:
            </Typography>
            <Typography variant="body1" gap={2} display={"flex"} alignItems={"center"}>
                <EventTypeTag {...targetEvent} />
                {getEventDescription(targetEvent)}
            </Typography>
            <EventShiftStackDetails eventShiftStack={eventShiftStack} />
        </Box>
    );
}

function EventPushDetails(props: IEventRescheduleProps) {
    const { targetEvent, setEventShiftStack } = props;
    const { id: targetEventId } = targetEvent;
    const { shiftEventConflictCheck } = useEventRules();
    useEffect(() => {
        setEventShiftStack(shiftEventConflictCheck(targetEventId, 'next'));
    }, [targetEventId, shiftEventConflictCheck, setEventShiftStack]);

    return (
        <Box gap={3} display={"flex"} flexDirection={"column"} padding={2}>
            <EventShiftDetails {...props} order={'next'} />
        </Box>
    );
}

function EventRescheduleDetails({ targetEvent, setEventShiftStack, ...props }: IEventRescheduleProps) {
    const { date: originalDate } = targetEvent;
    const { shiftEventConflictCheck } = useEventRules();
    const { calendarEventMap, dateGroupedEventMap } = useEventsContext();
    const [targetDate, setTargetDate] = useState<Moment>(originalDate);

    const order = useMemo(() => {
        if (targetDate.isSame(originalDate)) return;
        return targetDate.isBefore(originalDate) ? 'next' : 'prev';
    }, [targetDate, originalDate]);

    useEffect(() => {
        if (!order) return;
        const eventShift = { date: targetDate, originalEvent: targetEvent, skippedDates: [] };
        const eventToDisplace = dateGroupedEventMap.getEntriesForDate(targetDate).find(e => e.id !== targetEvent.id && e.eventType === targetEvent.eventType);
        if (!eventToDisplace) return setEventShiftStack([eventShift]);
        
        const modifiedEvent = { ...targetEvent, date: targetDate };
        const tempDateGroupedEventMap = createGroupedEventMap({ ...calendarEventMap, [targetEvent.id]: modifiedEvent });
        const invertedOrder = order === 'next' ? 'prev' : 'next';
        const eventShiftStack =  shiftEventConflictCheck(eventToDisplace.id, invertedOrder, { dateGroupedEventMap: tempDateGroupedEventMap });
        setEventShiftStack([eventShift, ...eventShiftStack]);
    }, [targetDate, order]);

    return (
        <Box gap={3} display={"flex"} flexDirection={"column"} padding={2}>
            <SessionDatePicker eventType={targetEvent.eventType} value={targetDate} onChange={setTargetDate} skipConflictCheck />
            {!!order && <EventShiftDetails {...{ ...props, targetEvent, order }} />}
        </Box>
    );
}

export default function EventActionsConfirmModal(props: IEventActionsConfirmModalProps) {
    const { targetEventId, action, onClose: onModalClose } = props;
    const { calendarEventMap, eventsAPI: { removeCalendarEvents, updateCalendarEvents }, loading } = useEventsContext();
    const targetEvent = useMemo(() => targetEventId && calendarEventMap[targetEventId] || defaultDummyCalendarEvent, [targetEventId]);

    const [eventShiftStack, setEventShiftStack] = useState<IConflictingEventsResult[]>([]);
    
    const eventsToUpdate = useMemo(() => {
        if (!eventShiftStack) return [];
        return eventShiftStack.map(e => ({...e.originalEvent, date: e.date}));
    }, [eventShiftStack]);

    const open = useMemo(() => !!action && !!targetEventId, [action, targetEventId]);

    const onClose = useCallback(() => {
        setEventShiftStack([]);
        if (onModalClose) onModalClose();
    }, [onModalClose, setEventShiftStack]);

    const onSubmit = useCallback(async () => {
        if (action !== 'swap' && action !== 'reschedule') return;
        return await updateCalendarEvents(eventsToUpdate).then(() => onClose());
    }, [action, targetEvent, eventsToUpdate, removeCalendarEvents, updateCalendarEvents, onClose]);

    const title = useMemo(() => `${firstToUpper(action)} Event`, [action]);

    return action === 'update' || action === 'delete'
    ? <CalendarEventModal {...props} {...{open, title}} operation={action} excludeFields={action === 'update' ? ["monkehId", "date", "eventType", "id"]: []}/>: (
        <BaseModal {...props} {...{ open: !!targetEventId, title, onSubmit }} submitDisabled={loading} submitButtonText="Confirm">
            {action === 'reschedule' && <EventRescheduleDetails {...{ targetEvent, eventShiftStack, setEventShiftStack }} />}
        </BaseModal>
    );
}