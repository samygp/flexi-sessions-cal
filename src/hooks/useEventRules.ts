import { EventRuleService } from "@/services/eventRules";
import { useCallback, useMemo } from "react";
import { useEventRulesContext, useEventsContext } from "@/hooks/useCustomContext";
import { CalendarEvent, EventType } from "@/shared/models/CalendarEvents";
import { EventConflict, EventRuleOrder, IConflictingEventsResult, IEventRule } from "@/shared/models/EventRules";
import { DateConflictLabels } from "@/shared/locale/dateConflicts";
import { readableDateTime } from "@/shared/utils/dateHelpers";
import { useLocale } from "@/hooks/useLocale";
import { EventTypeLabels } from "@/shared/locale/events";
import { DateGroupedEntryMap } from "@/shared/models/DateGroupedEntryMap";

interface IShiftEventConflictCheckOptions {
    eventRulesMap?: Record<EventType, IEventRule>;
    dateGroupedEventMap?: DateGroupedEntryMap<CalendarEvent>;
}

export default function useEventRules() {
    const { eventRulesMap } = useEventRulesContext();
    const { dateGroupedEventMap } = useEventsContext();
    const conflictLabels = useLocale(DateConflictLabels);
    const eventTypeLabels = useLocale<EventType>(EventTypeLabels);

    const rules = useMemo(() => new EventRuleService(eventRulesMap, dateGroupedEventMap), [eventRulesMap, dateGroupedEventMap]);

    const parseEventConflictCheckDetails = useCallback(({ originalEvent, dateConflict, date, skippedDates }: IConflictingEventsResult) => {
        const eventShift = `${originalEvent.title} on ${readableDateTime(originalEvent.date)} -> ${readableDateTime(date)}`;
        const skips = skippedDates.map(({ conflictingEvents, conflict }) => {
            const { date, eventType } = conflictingEvents![0]!;
            return `Skipped ${date} due to ${eventTypeLabels[eventType]} (${conflictLabels[conflict]})`;
        });
        if (dateConflict) {
            const conflict = conflictLabels[dateConflict.conflict];
            const conflictingEvent = dateConflict.conflictingEvents?.[0];
            const overridingEvent = conflictingEvent ? `Overriding ${conflictingEvent.title} on ${readableDateTime(conflictingEvent.date)}` : undefined;
            return { eventShift, skips, conflict, overridingEvent };
        }
        return { eventShift, skips };
    }, [conflictLabels, eventTypeLabels]);

    const shiftEventConflictCheck = useCallback((originalEventId: string, order: EventRuleOrder, opts?: IShiftEventConflictCheckOptions) => {
        const rulesMap = opts?.eventRulesMap ?? eventRulesMap;
        const dateMap = opts?.dateGroupedEventMap ?? dateGroupedEventMap;
        
        const tempRules = new EventRuleService(rulesMap, dateMap);
        let eventId = originalEventId;
        const eventShiftStack: IConflictingEventsResult[] = [];
        let keepChecking: boolean = true;
        let ctr = 0;
        while (keepChecking && ++ctr < 10) {
            const conflictCheck = tempRules.shiftEventDateConflictCheck(eventId, order);
            eventShiftStack.push(conflictCheck);
            const {dateConflict} = conflictCheck;
            const conflictingEvent = dateConflict?.conflictingEvents?.[0];
            keepChecking = !!conflictingEvent && dateConflict.conflict !== EventConflict.PastDate;
            if (keepChecking) {
                eventId = conflictingEvent!.id;
            }
        }
        return eventShiftStack;

    }, [eventRulesMap, dateGroupedEventMap, parseEventConflictCheckDetails]);

    return {shiftEventConflictCheck, parseEventConflictCheckDetails, eventRulesMap, dateGroupedEventMap, rules };
}