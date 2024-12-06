import { CalendarEvent, EventCategory, EventType, EventTypeCategoryMap } from "@/shared/models/CalendarEvents";
import { DateGroupedEntryMap } from "@/shared/models/DateGroupedEntryMap";
import { EventConflict, EventRuleOrder, IConflictingEventsResult, IEventConflictCheck, IEventRule, isNonNegotiableConflict } from "@/shared/models/EventRules";
import moment, { Moment } from "moment";
import { gt, lt } from 'lodash';
import { isPastDate } from "@/shared/utils/dateHelpers";

export class EventRuleService {
    constructor(
        private ruleMap: Record<EventType, IEventRule>,
        private groupedEvents: DateGroupedEntryMap<CalendarEvent>
    ) { }

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

    public getDaysOfWeekForEventType(eventType: EventType) {
        return this.ruleMap[eventType].daysOfWeek;
    }

    public checkEventTypeConflicts(eventType: EventType, targetDate: Moment, monkehIds?: string[]): IEventConflictCheck | undefined {
        if (isPastDate(targetDate)) return { conflict: EventConflict.PastDate };

        const { maxDailyEvents, daysOfWeek }: IEventRule = this.ruleMap[eventType];
        if (!daysOfWeek.includes(targetDate.weekday())) return { conflict: EventConflict.WeekDayNotAllowed };

        const eventCategory: EventCategory = EventTypeCategoryMap[eventType];
        const targetDateEvents: CalendarEvent[] = this.groupedEvents.getEntriesForDate(targetDate);

        if (!targetDateEvents.length) return;

        const blockedEvents = targetDateEvents.filter(e => EventTypeCategoryMap[e.eventType] === EventCategory.Blocked);
        if (blockedEvents.length) {
            return { conflict: EventConflict.BlockingEvent, conflictingEvents: blockedEvents };
        }
        const sessionEvents = targetDateEvents.filter(e => EventTypeCategoryMap[e.eventType] === EventCategory.Session);
        if (eventCategory === EventCategory.Blocked && sessionEvents.length) {
            return { conflict: EventConflict.PushesEntireDay, conflictingEvents: sessionEvents };
        }
        
        const monkehIdSet = new Set<string>(monkehIds);
        // For sessions
        if (eventCategory === EventCategory.Session) {
            // If the target date has more than the max daily events
            const sameTypeOnTargetDate = targetDateEvents.filter(e => e.eventType === eventType);
            if (maxDailyEvents > 0 && sameTypeOnTargetDate.length >= maxDailyEvents) {
                return { conflict: EventConflict.MaxDailyEvents, conflictingEvents: sameTypeOnTargetDate };
            }

            // If the target date has a personal event for the same monkeh
            const personalEvents = targetDateEvents.filter(e => {
                return (e.monkehIds.find(id => monkehIdSet.has(id))) && (EventTypeCategoryMap[e.eventType] === EventCategory.Personal);
            });
            if (personalEvents.length) {
                return { conflict: EventConflict.PersonalEvent, conflictingEvents: personalEvents };
            }
        }

        if (eventCategory === EventCategory.Personal) {
            const monkehEvents = targetDateEvents.filter(e => e.monkehIds.find(id => monkehIdSet.has(id)));
            if (monkehEvents.length) {
                return { conflict: EventConflict.PushesNextEvent, conflictingEvents: monkehEvents };
            }
        }
    }

    private subsequentDateConflictCheck = ({ eventType, date, monkehIds }: Pick<CalendarEvent, 'date' | 'eventType' | 'monkehIds'>, order: EventRuleOrder): Omit<IConflictingEventsResult, 'originalEvent'> => {
        const result: Omit<IConflictingEventsResult, 'originalEvent'> = { date, skippedDates: [] };
        let targetDate: Moment = moment(date);
        let keepSearching = true;
        let ctr = 0;

        while (keepSearching && ++ctr < 10) {
            // Move target date to prev/next weekday for rule
            targetDate = this.nextDateForEventType(targetDate, eventType, order);
            // Check for conflicts
            const dateConflict = this.checkEventTypeConflicts(eventType, targetDate, monkehIds);

            if (dateConflict && isNonNegotiableConflict(dateConflict.conflict)) {
                result.skippedDates.push(dateConflict);
            } else {
                keepSearching = false;
                result.dateConflict = dateConflict;
                result.date = targetDate;
            }
        }
        return result;
    }

    public shiftEventDateConflictCheck = (eventId: string, order: EventRuleOrder): IConflictingEventsResult => {
        const originalEvent = this.groupedEvents.getById(eventId);
        const conflictResult = this.subsequentDateConflictCheck(originalEvent, order);
        return { ...conflictResult, originalEvent };
    }

    public getNextAvailableDateForEventType(eventType: EventType, fromDate?: Moment) {
        let date = (fromDate ?? moment()).startOf('day');
        let conflict: EventConflict | undefined = undefined;
        do {
            const { dateConflict, date: nextDate } = this.subsequentDateConflictCheck({ eventType, date, monkehIds: [] }, 'next');
            conflict = dateConflict?.conflict;
            date = nextDate;
        } while (conflict);
        return date;
    }

}