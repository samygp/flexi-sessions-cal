import { colors } from '@mui/material';
import moment from 'moment';

export enum EventType {
    Session = "session",
    TimeOff = "timeoff",
    OnCall = "oncall",
};

export const EventColorMap: Record<EventType, string> = Object.freeze({
    [EventType.Session]: colors.green[300],
    [EventType.TimeOff]: colors.deepPurple[200],
    [EventType.OnCall]: colors.deepOrange[300],
});

export const EventTypeLabels: Record<EventType, string> = Object.freeze({
    [EventType.Session]: "Sesión",
    [EventType.TimeOff]: "Vacaciones",
    [EventType.OnCall]: "Guardia",
});

export interface IUser {
    name: string;
    email: string;
}

export type CalendarEvent = {
    id: string;
    date: moment.Moment;
    title: string;
    eventType: EventType;
    monkehId: string;
};

export interface ICalendarEventBody extends Omit<CalendarEvent, 'date'> {
    date: number;
}

export interface ICalendarEventQuery extends Partial<Omit<CalendarEvent, 'date'>> {
    from: number;
    to?: number;
};

export interface IPostEventRequest extends Partial<Omit<CalendarEvent, 'id'>> {
    id?: string;
}

export type EventMap = Map<string, CalendarEvent>;

export const defaultDummyCalendarEvent: CalendarEvent = Object.freeze({
    id: "",
    date: moment(),
    title: "",
    eventType: EventType.Session,
    monkehId: "",
})

export const calendarEventKeys: readonly (keyof CalendarEvent)[] = Object.keys(defaultDummyCalendarEvent) as (keyof CalendarEvent)[];