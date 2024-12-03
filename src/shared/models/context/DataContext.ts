import { createContext } from "react";
import { ICalendarEventAPI } from "@/hooks/useCalendarEventAPI";
import { IMonkehAPI } from "@/hooks/useMonkehAPI";
import { CalendarEvent, EventType } from "@/shared/models/CalendarEvents";
import { DateGroupedEntryMap } from "@/shared/models/DateGroupedEntryMap";
import { IMonkeh } from "@/shared/models/Monkeh";
import { IEventRule } from "@/shared/models/EventRules";
import { IEventRulesAPI } from "@/hooks/useEventRulesAPI";
import { IItemCache } from "@/shared/models/Data";

interface IBaseContext {
    loading: boolean;
    error?: Error;
    getEventDescription: (event: CalendarEvent) => string;
}
export interface IEventsContext extends IBaseContext {
    calendarEventMap: Record<string, CalendarEvent>;
    eventsAPI: ICalendarEventAPI;
    eventsCache: IItemCache<CalendarEvent[]>;
    dateGroupedEventMap: DateGroupedEntryMap<CalendarEvent>;
    
}

const defaultEventsContext: IEventsContext = {
    loading: false,
    calendarEventMap: {},
    eventsAPI: {} as ICalendarEventAPI,
    eventsCache: {} as IItemCache<CalendarEvent[]>,
    dateGroupedEventMap: new DateGroupedEntryMap<CalendarEvent>({}, e => e.date),
    getEventDescription: () => '',
} as const;

export interface IMonkehsContext extends IBaseContext {
    monkehMap: Record<string, IMonkeh>;
    monkehCache: IItemCache<IMonkeh[]>;
    monkehAPI: IMonkehAPI;
}

const defaultMonkehContext: IMonkehsContext = {
    loading: false,
    monkehMap: {},
    monkehCache: {} as IItemCache<IMonkeh[]>,
    monkehAPI: {} as IMonkehAPI,
    getEventDescription: () => '',
} as const;

export interface IEventRulesContext extends IBaseContext{
    eventRulesMap: Record<EventType, IEventRule>;
    eventRulesCache: IItemCache<IEventRule[]>;
    eventRulesAPI: IEventRulesAPI;
}

const defaultEventRulesContext: IEventRulesContext = {
    loading: false,
    eventRulesMap: {} as Record<EventType, IEventRule>,
    eventRulesCache: {} as IItemCache<IEventRule[]>,
    eventRulesAPI: {} as IEventRulesAPI,
    getEventDescription: () => '',
}

export interface IDataContext extends IMonkehsContext, IEventsContext, IEventRulesContext {}

export default createContext<IDataContext>({
    ...defaultMonkehContext,
    ...defaultEventsContext,
    ...defaultEventRulesContext,
});