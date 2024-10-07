import { createContext, PropsWithChildren, useMemo } from "react";
import { EventMap, CalendarEvent, ICalendarEventQuery, IPostEventRequest } from "../../shared/models/CalendarEvents";
import useCalendarEventFetch from "../../hooks/useCalendarEventFetch";
import { DateGroupedEntryMap } from "../../shared/models/DateGroupedEntryMap";

interface ICalendarEventAPI {
    fetchCalendarEvents: (filter: ICalendarEventQuery) => Promise<void>;
    createCalendarEvent: (evt: IPostEventRequest) => Promise<void>;
}

interface IEventCalendarContext {
    calendarEventMap: EventMap;
    api: ICalendarEventAPI;
    dateGroupedEventMap: DateGroupedEntryMap<CalendarEvent>;
    loading: boolean;
    error?: Error;
}

const createGroupedEventMap = (entries: Map<string, CalendarEvent>) => {
    return new DateGroupedEntryMap<CalendarEvent>(entries, e => e.date);
}

export const EventCalendarContext = createContext<IEventCalendarContext>({
    calendarEventMap: new Map<string, CalendarEvent>(),
    dateGroupedEventMap: createGroupedEventMap(new Map<string, CalendarEvent>()),
    api: {
        fetchCalendarEvents: async (_q: ICalendarEventQuery) => { },
        createCalendarEvent: async (_r: IPostEventRequest) => { },
    },
    loading: false,
});

export default function EventCalendarContextProvider({ children }: PropsWithChildren) {
    const { fetchCalendarEvents, createCalendarEvent, loading, error, calendarEventMap } = useCalendarEventFetch();
    const api = useMemo(() => ({ fetchCalendarEvents, createCalendarEvent }), [fetchCalendarEvents, createCalendarEvent]);
    const dateGroupedEventMap = useMemo(() => createGroupedEventMap(calendarEventMap), [calendarEventMap]);

    return (
        <EventCalendarContext.Provider value={{ calendarEventMap, dateGroupedEventMap, api, loading, error }}>
            {children}
        </EventCalendarContext.Provider>
    )
}