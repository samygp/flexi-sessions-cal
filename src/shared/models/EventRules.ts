import { EventType } from "@shared/models/CalendarEvents";

export interface IEventRule {
    id: string;
    eventType: EventType;
    daysOfWeek: number[];
}
