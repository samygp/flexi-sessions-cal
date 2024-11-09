import { EventType } from "@/shared/models/CalendarEvents";

export interface IEventRule {
    id: string;
    maxDailyEvents: number;
    eventType: EventType;
    daysOfWeek: number[];
}
