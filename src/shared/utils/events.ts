import { CalendarEvent } from "@/shared/models/CalendarEvents";
import { DateGroupedEntryMap } from "@/shared/models/DateGroupedEntryMap";

export const createGroupedEventMap = (eventMap: Record<string, CalendarEvent>) => {
    return new DateGroupedEntryMap<CalendarEvent>(eventMap, e => e.date);
}