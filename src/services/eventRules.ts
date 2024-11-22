import { CalendarEvent, EventCategory, EventType, EventTypeCategoryMap } from "@/shared/models/CalendarEvents";
import { DateGroupedEntryMap } from "@/shared/models/DateGroupedEntryMap";
import { EventConflict, EventRuleOrder, IEventRule } from "@/shared/models/EventRules";
import moment, { Moment } from "moment";
import { gt, lt } from 'lodash';
import { isPastDate } from "@/shared/utils/dateHelpers";

const containsEventCategory = (events: CalendarEvent[], eventCategory: EventCategory) => {
    return events.some(e => EventTypeCategoryMap[e.eventType] === eventCategory);
}

export class EventRuleService {
    constructor(
        private ruleMap: Record<EventType, IEventRule>,
        private groupedEvents: DateGroupedEntryMap<CalendarEvent>
    ) { }

    public getDaysOfWeekForEventType(eventType: EventType) {
        return this.ruleMap[eventType].daysOfWeek;
    }

    public checkEventTypeConflicts(eventType: EventType, targetDate: Moment, monkehId?: string) {
        if (isPastDate(targetDate)) return EventConflict.PastDate;

        const { maxDailyEvents, daysOfWeek }: IEventRule = this.ruleMap[eventType];
        if (!daysOfWeek.includes(targetDate.weekday())) return EventConflict.WeekDayNotAllowed;
        
        const eventCategory: EventCategory = EventTypeCategoryMap[eventType];
        const targetDateEvents: CalendarEvent[] = this.groupedEvents.getEntriesForDate(targetDate);

        if (!targetDateEvents.length) return;

        if (containsEventCategory(targetDateEvents, EventCategory.Blocked)) return EventConflict.BlockingEvent;
        if (eventCategory === EventCategory.Blocked && containsEventCategory(targetDateEvents, EventCategory.Session)) {
            return EventConflict.PushesEntireDay;
        }

        // For sessions
        if (eventCategory === EventCategory.Session) {
            // If the target date has more than the max daily events
            const sameTypeOnTargetDate = targetDateEvents.filter(e => e.eventType === eventType);
            if (maxDailyEvents > 0 &&sameTypeOnTargetDate.length >= maxDailyEvents) return EventConflict.MaxDailyEvents;

            // If the target date has a personal event for the same monkeh
            const hasPersonalEvent = !!targetDateEvents.find(e => {
                return (e.monkehId !== monkehId) && (EventTypeCategoryMap[e.eventType] === EventCategory.Personal);
            });
            if (hasPersonalEvent) return EventConflict.PersonalEvent;
        }

        if (eventCategory === EventCategory.Personal) {
            const monkehHasUpcomingEvent = targetDateEvents.some(e => e.monkehId === monkehId);
            if (monkehHasUpcomingEvent) return EventConflict.PushesNextEvent;
        }
    }

    private getDaysToAdd = (currDate: Moment, { daysOfWeek }: IEventRule, order: EventRuleOrder): number => {
        // order asc if looking for next day, desc otherwise
        const days = daysOfWeek.sort((a, b) => order === 'next' ? a - b : b - a);
        const currentDayOfWeek = currDate.weekday();
        // find the next/previous day
        const compareOp = order === 'next' ? gt : lt;
        const nextDayOfWeek = days.find(d => compareOp(d, currentDayOfWeek));
        if (nextDayOfWeek) return nextDayOfWeek - currentDayOfWeek;
        // If not found, use first element from days (first/last day of next/prev week)
        const targetDay = days[0];
        return order === 'next'
            ? 7 - currentDayOfWeek + targetDay
            : targetDay - 7 - currentDayOfWeek;
    }

    private nextDateForEventType = (currentDate: Moment, eventType: EventType, order: EventRuleOrder) => {
        const rule = this.ruleMap[eventType];
        const daysToAdd = this.getDaysToAdd(currentDate, rule, order);
        return currentDate.add(daysToAdd, "days");
    }

    private nextTargetDateConflictCheck = ({eventType, date, monkehId}: Partial<CalendarEvent>, order: EventRuleOrder) => {     
        const nextDate = this.nextDateForEventType(date!, eventType!, order);

        const dateConflict = this.checkEventTypeConflicts(eventType!, nextDate, monkehId);
        return { dateConflict, nextDate };
    }

    public pushEventLaterCheck = (eventId: string) => this.nextTargetDateConflictCheck(this.groupedEvents.getById(eventId), 'next');

    public pullEventEarlierCheck = (eventId: string) => this.nextTargetDateConflictCheck(this.groupedEvents.getById(eventId), 'prev');

    public getNextAvailableDateForEventType(eventType: EventType, fromDate?: Moment) {
        let date = (fromDate ?? moment()).startOf('day');
        let conflict: EventConflict | undefined = undefined;
        do{
            const conflictCheck = this.nextTargetDateConflictCheck({ eventType, date }, 'next');
            conflict = conflictCheck.dateConflict;
            date = conflictCheck.nextDate;
        } while(conflict);
        return date;
    }

}