import { createContext, PropsWithChildren, useMemo } from "react";
import { CalendarEvent, ICalendarEventQuery, IPostEventRequest } from "../../shared/models/CalendarEvents";
import useCalendarEventFetch from "../../hooks/useCalendarEventFetch";
import { DateGroupedEntryMap } from "../../shared/models/DateGroupedEntryMap";
import { keyBy } from "lodash";

interface ICalendarEventAPI {
    fetchCalendarEvents: (filter: ICalendarEventQuery) => Promise<void>;
    createCalendarEvent: (evt: IPostEventRequest) => Promise<void>;
}

interface IEventCalendarContext {
    calendarEventMap: Record<string, CalendarEvent>;
    api: ICalendarEventAPI;
    dateGroupedEventMap: DateGroupedEntryMap<CalendarEvent>;
    loading: boolean;
    error?: Error;
}

const createGroupedEventMap = (eventMap: Record<string, CalendarEvent>) => {
    return new DateGroupedEntryMap<CalendarEvent>(eventMap, e => e.date);
}

export const EventCalendarContext = createContext<IEventCalendarContext>({
    calendarEventMap: {},
    dateGroupedEventMap: createGroupedEventMap({}),
    api: {
        fetchCalendarEvents: async (_q: ICalendarEventQuery) => { },
        createCalendarEvent: async (_r: IPostEventRequest) => { },
    },
    loading: false,
});

export default function EventCalendarContextProvider({ children }: PropsWithChildren) {
    const { fetchCalendarEvents, createCalendarEvent, loading, error, calendarEvents } = useCalendarEventFetch();
    const api = useMemo(() => ({ fetchCalendarEvents, createCalendarEvent }), [fetchCalendarEvents, createCalendarEvent]);
    const {calendarEventMap, dateGroupedEventMap} = useMemo(() => {
        const calendarEventMap = keyBy(calendarEvents, 'id');
        const dateGroupedEventMap = createGroupedEventMap(calendarEventMap);

        return {calendarEventMap, dateGroupedEventMap};
    }, [calendarEvents]);

    return (
        <EventCalendarContext.Provider value={{ calendarEventMap, dateGroupedEventMap, api, loading, error }}>
            {children}
        </EventCalendarContext.Provider>
    )
}