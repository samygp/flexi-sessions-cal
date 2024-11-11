import { createContext } from "react";
import { ICalendarEventAPI } from "@/hooks/useCalendarEventAPI";
import { IMonkehAPI } from "@/hooks/useMonkehAPI";
import { CalendarEvent, EventType } from "@/shared/models/CalendarEvents";
import { DateGroupedEntryMap } from "@/shared/models/DateGroupedEntryMap";
import { IMonkeh } from "@/shared/models/Monkeh";
import { IEventRule } from "@/shared/models/EventRules";
import { IEventRulesAPI } from "@/hooks/useEventRulesAPI";

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

export interface IEventRulesContext extends IBaseContext{
    eventRulesMap: Record<EventType, IEventRule>;
    eventRulesAPI: IEventRulesAPI;
}

export interface IDataContext extends IEventsContext, IMonkehsContext, IEventRulesContext {}

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
        loading: false
    },
    eventRulesMap: {} as Record<EventType, IEventRule>,
    eventRulesAPI: {
        fetchRules: noopPromise,
        updateRule: noopPromise,
        loading: false
    },
    monkehAPI: {
        fetchMonkehs: noopPromise,
        createMonkeh: noopPromise,
        updateMonkeh: noopPromise,
        deleteMonkehs: noopPromise,
        loading: false
    },
    loading: false,
});