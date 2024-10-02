import { CalendarEvent, ICalendarEventQuery } from "../../models/CalendarEvents"
import { apiFetch } from "../restService"
import config from "../../config.json";
import { IFetchOptions, IFetchResponse } from "../../models/Rest";

const eventsEndpoint = `${config.calendarEventsUrl}/api/events`;

export interface IEventsAPIFetchOptions extends Omit<IFetchOptions, 'params' | 'body' | 'method'> {
    params?: ICalendarEventQuery;
    body?: CalendarEvent;
}

export type EventAPICall<T> = (opts: IEventsAPIFetchOptions) => Promise<IFetchResponse<T>>;

const eventsAPIFetch = async <T>(options: IFetchOptions) => {
    if (!options.authToken) throw new Error('Missing auth');
    return apiFetch<T>(eventsEndpoint, options);
}

const fetchEvents = async (opts: IEventsAPIFetchOptions) => {
    if (!opts.params) throw new Error('Query params required to fetch events');
    return eventsAPIFetch<CalendarEvent[]>({ ...opts, method: 'get' });
}

const updateEvent = async (opts: IEventsAPIFetchOptions) => {
    return eventsAPIFetch<CalendarEvent>({ ...opts, method: 'put' });
}

const deleteEvent = async (opts: IEventsAPIFetchOptions) => {
    if (!opts.params) throw new Error('Query params required to delete event');
    return eventsAPIFetch({ ...opts, method: 'delete' });
}

const createEvent = async (opts: IEventsAPIFetchOptions) => {
    return eventsAPIFetch<CalendarEvent>({ ...opts, method: 'post' });
}

export default Object.freeze({
    fetchEvents, updateEvent, deleteEvent, createEvent
});