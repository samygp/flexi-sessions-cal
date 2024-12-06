import { EventBusy, PersonSearch, Biotech, Class, SvgIconComponent, RotateRight, BeachAccess, AcUnit } from '@mui/icons-material';
import { ChipOwnProps } from '@mui/material';
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

export const EventTypeIconMap: Record<EventType, SvgIconComponent> = {
    [EventType.Biblio]: Class,
    [EventType.Clinic]: Biotech,
    [EventType.Rotation]: RotateRight,
    [EventType.Vacation]: BeachAccess,
    [EventType.Holiday]: AcUnit,
    [EventType.Consultation]: PersonSearch,
    [EventType.Override]: EventBusy,
}

export const EventCategoryColorMap: Record<EventCategory, ChipOwnProps['color']> = Object.freeze({
    [EventCategory.Session]: "success",
    [EventCategory.Blocked]:  "warning",
    [EventCategory.Personal]: "secondary",
});

export type CalendarEvent = {
    id: string;
    date: moment.Moment;
    title: string;
    eventType: EventType;
    monkehIds: string[];
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
    monkehIds: [],
})

export const calendarEventKeys: readonly (keyof CalendarEvent)[] = Object.keys(defaultDummyCalendarEvent) as (keyof CalendarEvent)[];

export const deserializeCalendarEvent = (cacheString: string): CalendarEvent[] => {
    const events: ICachedEvent[] = JSON.parse(cacheString);
    return events.map(evt => ({ ...evt, date: moment(evt.date) }));
}

export const getCategoryEventTypes = (category: EventCategory): EventType[] => {
    return Object.values(EventType).filter(evt => EventTypeCategoryMap[evt] === category);
}