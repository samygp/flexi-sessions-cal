import { EventType } from "@shared/models/CalendarEvents";


export interface IEventRule {
    eventType: EventType;
    daysOfWeek: number[];
}