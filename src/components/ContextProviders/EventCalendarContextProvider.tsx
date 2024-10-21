import { PropsWithChildren, useMemo } from "react";
import { CalendarEvent } from "../../shared/models/CalendarEvents";
import useCalendarEventAPI from "../../hooks/useCalendarEventAPI";
import { DateGroupedEntryMap } from "../../shared/models/DateGroupedEntryMap";
import { keyBy } from "lodash";
import useMonkehAPI from "../../hooks/useMonkehAPI";
import EventCalendarContext from "../../shared/models/DataContext";

const createGroupedEventMap = (eventMap: Record<string, CalendarEvent>) => {
    return new DateGroupedEntryMap<CalendarEvent>(eventMap, e => e.date);
}

export default function EventCalendarContextProvider({ children }: PropsWithChildren) {
    const { loading: eventLoading, error: eventError, calendarEvents, ...eventsAPI } = useCalendarEventAPI();
    const {calendarEventMap, dateGroupedEventMap} = useMemo(() => {
        const calendarEventMap = keyBy(calendarEvents, 'id');
        const dateGroupedEventMap = createGroupedEventMap(calendarEventMap);

        return {calendarEventMap, dateGroupedEventMap};
    }, [calendarEvents]);

    const { loading: monkehLoading, error: monkehError, monkehs, ...monkehAPI } = useMonkehAPI();
    const monkehMap = useMemo(() =>  keyBy(monkehs, 'id'), [monkehs]);

    const loading = useMemo(() => eventLoading || monkehLoading, [eventLoading, monkehLoading]);
    const error = useMemo(() => eventError || monkehError, [eventError, monkehError]);

    return (
        <EventCalendarContext.Provider value={{ calendarEventMap, dateGroupedEventMap, monkehMap, eventsAPI, monkehAPI, loading, error }}>
            {children}
        </EventCalendarContext.Provider>
    )
}