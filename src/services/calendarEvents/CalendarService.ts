import {unix} from "moment";
import config from "../../config.json";
import { ICalendarEventQuery, CalendarEvent, ICalendarEventBody } from "../../shared/models/CalendarEvents";
import { IFetchOptions, IFetchResponse } from "../../shared/models/Rest";
import { apiFetch } from "../restService";

const eventsEndpoint = `${config.calendarEventsUrl}/api/events`;

export interface IEventsAPIFetchOptions extends Omit<IFetchOptions, 'params' | 'body' | 'method'> {
    params?: ICalendarEventQuery;
    body?: Partial<ICalendarEventBody>;
}

interface IAPICalendarEvent extends Omit<CalendarEvent, 'date'> {
    date: number;
}

export type EventAPICall<T> = (opts: IEventsAPIFetchOptions) => Promise<IFetchResponse<T>>;

const withTypeSafeDate = ({date, ...event}: IAPICalendarEvent): CalendarEvent => {
    return {...event, date: unix(date)};
}

const eventsAPIFetch = async <T>(options: IFetchOptions, callback?: (r: any) => T): Promise<IFetchResponse<T>> => {
    if (!options.authToken) throw new Error('Missing auth');
    return apiFetch<T>(eventsEndpoint, options).then(({result, ...response}) => {
        const r = (callback && result) ? callback(result) : result;
        return { ...response, result: r };
    });
}

const fetchEvents = async (opts: IEventsAPIFetchOptions) => {
    if (!opts.params) throw new Error('Query params required to fetch events');
    return eventsAPIFetch<CalendarEvent[]>({ ...opts, method: 'get',  }, r => r.map(withTypeSafeDate));
}

const updateEvent = async (opts: IEventsAPIFetchOptions) => {
    return eventsAPIFetch<CalendarEvent>({ ...opts, method: 'put' }, withTypeSafeDate);
}

const deleteEvent = async (opts: IEventsAPIFetchOptions) => {
    if (!opts.params) throw new Error('Query params required to delete event');
    return eventsAPIFetch({ ...opts, method: 'delete' });
}

const createEvent = async (opts: IEventsAPIFetchOptions) => {
    return eventsAPIFetch<CalendarEvent>({ ...opts, method: 'post', }, withTypeSafeDate);
}

export default Object.freeze({
    fetchEvents, updateEvent, deleteEvent, createEvent
});