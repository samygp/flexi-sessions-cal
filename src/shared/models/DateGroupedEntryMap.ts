import { Moment } from "moment";
import { destructureDate } from "@shared/utils/dateHelpers";

type GroupedEntryMap = Map<number, Map<number, Map<number, Set<string>>>>;

const hasYear = (groupedEntries: GroupedEntryMap, year: number) => !!groupedEntries.has(year);
const hasMonth = (groupedEntries: GroupedEntryMap, year: number, month: number) => !!groupedEntries.get(year)?.has(month);
const hasDay = (groupedEntries: GroupedEntryMap, year: number, month: number, day: number) => !!groupedEntries.get(year)?.get(month)?.has(day);

const initializeDate = (entryMap: GroupedEntryMap, year: number, month: number, day: number) => {
    if (!hasYear(entryMap, year)) entryMap.set(year, new Map<number, Map<number, Set<string>>>());
    if (!hasMonth(entryMap, year, month)) entryMap.get(year)!.set(month, new Map<number, Set<string>>());
    if (!hasDay(entryMap, year, month, day)) entryMap.get(year)!.get(month)!.set(day, new Set<string>());
}

export class DateGroupedEntryMap<T> {
    private entries: Record<string, T>;
    // ************************ year ****** month ***** day ****** entryIDs
    private groupedEntries: GroupedEntryMap;

    public getIdsForDate = (date: Moment): string[] => {
        const { year, month, day } = destructureDate(date);
        if (!hasDay(this.groupedEntries, year, month, day)) return [];
        return Array.from(this.groupedEntries.get(year)!.get(month)!.get(day)!);
    }

    public getEntriesForDate = (date: Moment): T[] => {
        return this.getIdsForDate(date).map(id => this.entries[id]);
    }

    private getValuesForDateRange = <VT>(start: Moment, end: Moment, callback: (date: Moment) => VT[]): VT[] => {
        const result: VT[] = [];
        let date = start.startOf('day');
        let iter = 0;
        while (date.isSameOrBefore(end) && iter < 40) {
            result.push(...callback(date));
            date = date.add(1, 'day');
            iter++;
        }
        return result;
    }

    public getIdsForDateRange = (start: Moment, end: Moment): string[] => {
        return this.getValuesForDateRange<string>(start, end, this.getIdsForDate);
    }

    public getEntriesForDateRange = (start: Moment, end: Moment): T[] => {
        return this.getValuesForDateRange<T>(start, end, this.getEntriesForDate);
    }


    constructor(entries: Record<string, T>, getEntryDate: (e: T) => Moment) {
        this.entries = entries;
        const groupedEntries = new Map<number,
            Map<number,
                Map<number, Set<string>>
            >
        >();

        Object.keys(entries).forEach(id => {
            const entry = entries[id]!;
            const { year, month, day } = destructureDate(getEntryDate(entry));
            initializeDate(groupedEntries, year, month, day);
            groupedEntries.get(year)!.get(month)!.get(day)!.add(id);
        });

        this.groupedEntries = groupedEntries;
    }

}

