import { useCallback, useState } from 'react';
import { CalendarEvent, ICalendarEventQuery, IPostEventRequest } from '../shared/models/CalendarEvents';
import useCRUDApiFetch from './useApiFetch';
import config from '../config.json';
import { unix } from 'moment';
import { beginningOf, endOf } from '../shared/utils/dateHelpers';

interface IAPICalendarEvent extends Omit<CalendarEvent, 'date'> {
  date: number;
}
type EventsAPIResult = IAPICalendarEvent | IAPICalendarEvent[] | void | undefined;

const EVENTS_ENDPOINT = 'api/events';

const withTypeSafeDate = ({ date, ...event }: IAPICalendarEvent): CalendarEvent => {
  return { ...event, date: unix(date) };
}

const toPostEventRequest = (event: CalendarEvent): IPostEventRequest => {
  return { ...event, date: event.date.unix() };
}

const apiResultToCalendarEvent = <T>(result: EventsAPIResult) => {
  if (!result) return result;
  else if (Array.isArray(result)) return result.map(withTypeSafeDate) as T;
  return withTypeSafeDate(result) as T;
}

export interface ICalendarEventAPI {
  fetchCalendarEvents: (filter: ICalendarEventQuery) => Promise<CalendarEvent | CalendarEvent[] | undefined>;
  createCalendarEvent: (evt: Omit<CalendarEvent, 'id'>) => Promise<CalendarEvent | CalendarEvent[] | undefined>;
  updateCalendarEvent: (evt: CalendarEvent) => Promise<CalendarEvent | CalendarEvent[] | undefined>;
  removeCalendarEvents: (evt: ICalendarEventQuery) => Promise<CalendarEvent | CalendarEvent[] | undefined>;
  fetchYear: (year: number) => Promise<void>
}

interface ICalendarEventAPIHook extends ICalendarEventAPI {
  calendarEvents: CalendarEvent[];
  loading: boolean;
  error?: Error;
}

export default function useCalendarEventAPI(): ICalendarEventAPIHook {
  const [calendarEvents, setcalendarEvents] = useState<CalendarEvent[]>([]);
  const [fetchedYears, setFetchedYears] = useState<number[]>([]);

  const handleAPIResult = useCallback(<T extends (CalendarEvent | CalendarEvent[])>(result: EventsAPIResult, remove?: boolean) => {
    const typeSafeResult = apiResultToCalendarEvent<T>(result);
    if (!typeSafeResult) return;

    const events: CalendarEvent[] = Array.isArray(typeSafeResult) ? typeSafeResult : [typeSafeResult];
    const newIDs = new Set<string>(events.map(e => e.id));
    setcalendarEvents(prev => prev.filter(e => !newIDs.has(e.id)).concat(remove ? [] : events));

    return typeSafeResult;
  }, [setcalendarEvents]);

  const { loading, error, get, create, update, remove } = useCRUDApiFetch<IPostEventRequest, ICalendarEventQuery>(config.calendarEventsUrl);

  const fetchCalendarEvents = useCallback(async (filter: ICalendarEventQuery) => {
    return await get<EventsAPIResult>(EVENTS_ENDPOINT, filter).then(handleAPIResult);
  }, [get, handleAPIResult]);

  const createCalendarEvent = useCallback(async (evt: Omit<CalendarEvent, 'id'>) => {
    return await create<EventsAPIResult>(EVENTS_ENDPOINT, toPostEventRequest(evt as any)).then(handleAPIResult);
  }, [create, handleAPIResult]);

  const updateCalendarEvent = useCallback(async (evt: CalendarEvent) => {
    return await update<EventsAPIResult>(EVENTS_ENDPOINT, toPostEventRequest(evt)).then(handleAPIResult);
  }, [update, handleAPIResult]);

  const removeCalendarEvents = useCallback(async (filter: ICalendarEventQuery) => {
    return await remove<EventsAPIResult>(EVENTS_ENDPOINT, filter).then(r => handleAPIResult(r, true));
  }, [remove, handleAPIResult]);


  const fetchYear = useCallback(async (year: number) => {
    if (loading || fetchedYears.includes(year)) return;
    const query = { from: beginningOf.year(year), to: endOf.year(year) };
    await fetchCalendarEvents(query).then(() => setFetchedYears(prev => [...prev, year]));
  }, [fetchCalendarEvents, fetchedYears, loading]);


  return { fetchCalendarEvents, createCalendarEvent, updateCalendarEvent, removeCalendarEvents, fetchYear, loading, error, calendarEvents };
}