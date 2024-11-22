import { EventType } from "@/shared/models/CalendarEvents";

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