import { PropsWithChildren, useCallback, useMemo } from "react";
import { CalendarEvent, deserializeCalendarEvent, EventType } from "@/shared/models/CalendarEvents";
import useCalendarEventAPI from "@/hooks/useCalendarEventAPI";
import { keyBy } from "lodash";
import useMonkehAPI from "@/hooks/useMonkehAPI";
import EventCalendarContext from "@/shared/models/context/DataContext";
import { useMount } from "react-use";
import useItemCache from "@/hooks/useItemCache";
import { deserializeMonkehs, IMonkeh } from "@/shared/models/Monkeh";
import { IEventRule } from "@/shared/models/EventRules";
import useEventRulesAPI from "@/hooks/useEventRulesAPI";
import { readableDateTime } from "@/shared/utils/dateHelpers";
import { createGroupedEventMap } from "@/shared/utils/events";

// cache lives for 12 hours before being outdated
const CACHE_TTL = 3600 * 12;

export default function DataContextProvider({ children }: PropsWithChildren) {
    const monkehCache = useItemCache<IMonkeh[]>("monkehs", CACHE_TTL, { deserializer: deserializeMonkehs });
    const monkehAPI = useMonkehAPI(monkehCache);
    const monkehMap = useMemo(() => keyBy(monkehCache.value, 'id'), [monkehCache]);

    const eventRulesCache = useItemCache<IEventRule[]>("eventRules", CACHE_TTL);
    const eventRulesAPI = useEventRulesAPI(eventRulesCache);
    const eventRulesMap = useMemo<Record<EventType, IEventRule>>(() =>{
        return keyBy(eventRulesCache.value, 'eventType') as Record<EventType, IEventRule>;
    }, [eventRulesCache]);

    const eventsCache = useItemCache<CalendarEvent[]>("events", CACHE_TTL, { deserializer: deserializeCalendarEvent });
    const eventsAPI = useCalendarEventAPI(eventsCache);
    const { calendarEventMap, dateGroupedEventMap } = useMemo(() => {
        const calendarEventMap = keyBy(eventsCache.value, 'id');
        const dateGroupedEventMap = createGroupedEventMap(calendarEventMap);

        return { calendarEventMap, dateGroupedEventMap };
    }, [eventsCache]);

    const loading = useMemo(() => eventsAPI.loading || monkehAPI.loading, [eventsAPI.loading, monkehAPI.loading]);
    const error = useMemo(() => eventsAPI.error || monkehAPI.error, [eventsAPI.error, monkehAPI.error]);

    const getEventDescription = useCallback((event: CalendarEvent): string => {
        const monkehNames = event.monkehIds.map(id => monkehMap[id]?.name).join(', ');
        return `[${monkehNames}] - ${event.title} | ${readableDateTime(event.date)}`;
    }, [monkehMap]);

    useMount(async () => {
        // only required to be awaited are monkehs
        if (monkehCache.isOutdated) await monkehAPI.fetchMonkehs({});
        if (eventsCache.isOutdated) eventsAPI.fetchYear(new Date().getUTCFullYear());
        if (eventRulesCache.isOutdated) eventRulesAPI.fetchRules({});
    });

    return (
        <EventCalendarContext.Provider value={{
            calendarEventMap,
            dateGroupedEventMap,
            monkehMap,
            monkehCache,
            eventsCache,
            eventRulesCache,
            eventRulesMap,
            eventsAPI,
            monkehAPI,
            getEventDescription,
            eventRulesAPI,
            loading,
            error
        }}
        >
            {children}
        </EventCalendarContext.Provider>
    )
}