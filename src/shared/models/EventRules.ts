import { CalendarEvent, EventType } from "@/shared/models/CalendarEvents";
import { Moment } from "moment";

export type EventRuleOrder = 'next' | 'prev';

export interface IEventRule {
    id: string;
    maxDailyEvents: number;
    eventType: EventType;
    daysOfWeek: number[];
}

export enum EventConflict {
    PastDate,
    MaxDailyEvents,
    BlockingEvent,
    PushesEntireDay,
    PushesNextEvent,
    PersonalEvent,
    WeekDayNotAllowed,
}

export interface IEventConflictCheck {
    conflict: EventConflict;
    conflictingEvents?: CalendarEvent[];
}

export interface IConflictingEventsResult {
    originalEvent: CalendarEvent;
    date: Moment;
    dateConflict?: IEventConflictCheck;
    skippedDates: IEventConflictCheck[];
}

const nonNegotiableConflictSet = new Set([EventConflict.BlockingEvent, EventConflict.PersonalEvent]);
export const isNonNegotiableConflict = (conflict: EventConflict) => nonNegotiableConflictSet.has(conflict);