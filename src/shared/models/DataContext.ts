import { createContext } from "react";
import { ICalendarEventAPI } from "../../hooks/useCalendarEventAPI";
import { IMonkehAPI } from "../../hooks/useMonkehAPI";
import { CalendarEvent } from "./CalendarEvents";
import { DateGroupedEntryMap } from "./DateGroupedEntryMap";
import { IMonkeh } from "./Monkeh";

interface IBaseContext {
    loading: boolean;
    error?: Error;
}
export interface IEventsContext extends IBaseContext {
    calendarEventMap: Record<string, CalendarEvent>;
    eventsAPI: ICalendarEventAPI;
    dateGroupedEventMap: DateGroupedEntryMap<CalendarEvent>;
}

export interface IMonkehsContext extends IBaseContext {
    monkehMap: Record<string, IMonkeh>;
    monkehAPI: IMonkehAPI;
}

export interface IDataContext extends IEventsContext, IMonkehsContext {}

const noopPromise = () => Promise.resolve(undefined);

export default createContext<IDataContext>({
    calendarEventMap: {},
    monkehMap: {},
    dateGroupedEventMap: new DateGroupedEntryMap<CalendarEvent>({}, e => e.date),
    eventsAPI: {
        fetchCalendarEvents: noopPromise,
        createCalendarEvent: noopPromise,
        updateCalendarEvent: noopPromise,
        removeCalendarEvents: noopPromise,
        fetchYear: noopPromise,
    },
    monkehAPI: {
        fetchMonkehs: noopPromise,
        createMonkeh: noopPromise,
        updateMonkeh: noopPromise,
        deleteMonkehs: noopPromise,
    },
    loading: false,
});