import { colors } from '@mui/material';
import moment from 'moment';

export enum EventType {
    Biblio = "biblio",
    Clinic = "clinic",
    Rotation = "rotation",
    Vacation = "vacation",
    Holiday = "holiday",
    Consultation = "consultation",
    Override = "override",
};

export enum EventCategory {
    Personal = "personal",
    Session = "session",
    Blocked = "blocked",
};

export const EventTypeCategoryMap: Record<EventType, EventCategory> = {
    [EventType.Biblio]: EventCategory.Session,
    [EventType.Clinic]: EventCategory.Session,
    [EventType.Consultation]: EventCategory.Personal,
    [EventType.Rotation]: EventCategory.Personal,
    [EventType.Vacation]: EventCategory.Personal,
    [EventType.Holiday]: EventCategory.Blocked,
    [EventType.Override]: EventCategory.Blocked,
}

export const EventCategoryColorMap: Record<EventCategory, string> = Object.freeze({
    [EventCategory.Session]: colors.green[300],
    [EventCategory.Blocked]:  colors.deepOrange[300],
    [EventCategory.Personal]: colors.deepPurple[200],
});

export type CalendarEvent = {
    id: string;
    date: moment.Moment;
    title: string;
    eventType: EventType;
    monkehId: string;
};

export interface ICachedEvent extends Omit<CalendarEvent, 'date'> {
    date: string;
}

export interface ICalendarEventBody extends Omit<CalendarEvent, 'date'> {
    date: number;
}

export interface ICalendarEventQuery extends Partial<Omit<CalendarEvent, 'date'>> {
    from?: number;
    to?: number;
};

export interface IPostEventRequest extends Partial<Omit<CalendarEvent, 'id' | 'date'>> {
    date: number;
    id?: string;
}

export type EventMap = Map<string, CalendarEvent>;

export const defaultDummyCalendarEvent: CalendarEvent = Object.freeze({
    id: "",
    date: moment(),
    title: "",
    eventType: EventType.Biblio,
    monkehId: "",
})

export const calendarEventKeys: readonly (keyof CalendarEvent)[] = Object.keys(defaultDummyCalendarEvent) as (keyof CalendarEvent)[];

export const deserializeCalendarEvent = (cacheString: string): CalendarEvent[] => {
    const events: ICachedEvent[] = JSON.parse(cacheString);
    return events.map(evt => ({ ...evt, date: moment(evt.date) }));
}