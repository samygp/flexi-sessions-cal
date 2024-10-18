import { createContext } from "react";
import { ICalendarEventAPI } from "../../hooks/useCalendarEventAPI";
import { IMonkehAPI } from "../../hooks/useMonkehAPI";
import { CalendarEvent } from "./CalendarEvents";
import { DateGroupedEntryMap } from "./DateGroupedEntryMap";
import { IMonkeh } from "./Monkeh";

export interface IEventCalendarContext {
    calendarEventMap: Record<string, CalendarEvent>;
    monkehMap: Record<string, IMonkeh>;
    eventsAPI: ICalendarEventAPI;
    monkehAPI: IMonkehAPI;
    dateGroupedEventMap: DateGroupedEntryMap<CalendarEvent>;
    loading: boolean;
    error?: Error;
}

const noopPromise = () => Promise.resolve(undefined);

export default createContext<IEventCalendarContext>({
    calendarEventMap: {},
    monkehMap: {},
    dateGroupedEventMap: new DateGroupedEntryMap<CalendarEvent>({}, e => e.date),
    eventsAPI: {
        fetchCalendarEvents: noopPromise,
        createCalendarEvent: noopPromise,
        updateCalendarEvent: noopPromise,
        removeCalendarEvents: noopPromise,
    },
    monkehAPI: {
        fetchMonkehs: noopPromise,
        createMonkeh: noopPromise,
        updateMonkeh: noopPromise,
        deleteMonkehs: noopPromise,
    },
    loading: false,
});