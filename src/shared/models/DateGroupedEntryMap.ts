import { Moment } from "moment";
import { destructureDate } from "../utils/dateHelpers";
import moment from "moment";

export class DateGroupedEntryMap<T> {
    private entries: Map<string, T>;
    // ************************ year ****** month ***** day ****** entryIDs
    private groupedEntries: Map<number, Map<number, Map<number, Set<string>>>>;
    
    private hasYear = (year: number) => !!this.groupedEntries.has(year);
    private hasMonth = (year: number, month: number) => !!this.groupedEntries.get(year)?.has(month);
    private hasDay = (year: number, month: number, day: number) => !!this.groupedEntries.get(year)?.get(month)?.has(day);

    private initializeDate = (year: number, month: number, day: number) => {
        if (!this.hasYear(year)) this.groupedEntries.set(year, new Map<number, Map<number, Set<string>>>());
        if (!this.hasMonth(year, month)) this.groupedEntries.get(year)!.set(month, new Map<number, Set<string>>());
        if (!this.hasDay(year, month, day)) this.groupedEntries.get(year)!.get(month)!.set(day, new Set<string>());
    }
    
    public getIdsForDate = (date: Moment): string[] => {
        const { year, month, day } = destructureDate(date);
        if (!this.hasDay(year, month, day)) return [];
        return Array.from(this.groupedEntries.get(year)!.get(month)!.get(day)!);
    }

    public getEntriesForDate = (date: Moment): T[] => {
        return this.getIdsForDate(date).map(id => this.entries.get(id)!);
    }

    private getValuesForDateRange = <VT>(start: Moment, end: Moment, callback: (date: Moment) => VT[]): VT[] => {
        const result: VT[] = [];
        const date = moment(start).startOf('day');
        while(date.isSameOrBefore(end)) {
            result.push(...callback(date));
            date.add(1, 'day');
        }
        return result;
    }

    public getIdsForDateRange = (start: Moment, end: Moment): string[] => {
        return this.getValuesForDateRange<string>(start, end, this.getIdsForDate);
    }

    public getEntriesForDateRange = (start: Moment, end: Moment): T[] => {
        return this.getValuesForDateRange<T>(start, end, this.getEntriesForDate);        
    }

    constructor (entries: Map<string, T>, getEntryDate: (e: T) => Moment) {
        this.entries = entries;
        this.groupedEntries = new Map<number, Map<number, Map<number, Set<string>>>>();
        entries.forEach((entry, id) => {
            const { year, month, day } = destructureDate(getEntryDate(entry));
            this.initializeDate(year, month, day);
            this.groupedEntries.get(year)!.get(month)!.get(day)!.add(id);
        });
    }

}

