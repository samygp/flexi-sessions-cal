import { PropsWithChildren, useMemo } from "react";
import { CalendarEvent, deserializeCalendarEvent } from "@shared/models/CalendarEvents";
import useCalendarEventAPI from "@hooks/useCalendarEventAPI";
import { DateGroupedEntryMap } from "@shared/models/DateGroupedEntryMap";
import { keyBy } from "lodash";
import useMonkehAPI from "@hooks/useMonkehAPI";
import EventCalendarContext from "@shared/models/context/DataContext";
import { useMount } from "react-use";
import useItemCache from "@hooks/useItemCache";
import { deserializeMonkehs, IMonkeh } from "@shared/models/Monkeh";

const createGroupedEventMap = (eventMap: Record<string, CalendarEvent>) => {
    return new DateGroupedEntryMap<CalendarEvent>(eventMap, e => e.date);
}

// cache lives for 12 hours before being outdated
const CACHE_TTL = 3600 * 12;

export default function EventCalendarContextProvider({ children }: PropsWithChildren) {
    const monkehCache = useItemCache<IMonkeh[]>("monkehs", CACHE_TTL, { deserializer: deserializeMonkehs });
    const monkehAPI = useMonkehAPI(monkehCache);
    const monkehMap = useMemo(() => keyBy(monkehCache.value, 'id'), [monkehCache]);

    const eventsCache = useItemCache<CalendarEvent[]>("events", CACHE_TTL, { deserializer: deserializeCalendarEvent });
    const eventsAPI = useCalendarEventAPI(eventsCache);
    const { calendarEventMap, dateGroupedEventMap } = useMemo(() => {
        const calendarEventMap = keyBy(eventsCache.value, 'id');
        const dateGroupedEventMap = createGroupedEventMap(calendarEventMap);

        return { calendarEventMap, dateGroupedEventMap };
    }, [eventsCache]);

    const loading = useMemo(() => eventsAPI.loading || monkehAPI.loading, [eventsAPI.loading, monkehAPI.loading]);
    const error = useMemo(() => eventsAPI.error || monkehAPI.error, [eventsAPI.error, monkehAPI.error]);

    useMount(() => {
        if (monkehCache.isOutdated) monkehAPI.fetchMonkehs({});
        if (eventsCache.isOutdated) eventsAPI.fetchYear(new Date().getUTCFullYear());
    });

    return (
        <EventCalendarContext.Provider value={{
            calendarEventMap,
            dateGroupedEventMap,
            monkehMap,
            eventsAPI,
            monkehAPI,
            loading,
            error
        }}
        >
            {children}
        </EventCalendarContext.Provider>
    )
}