import { useCallback, useMemo } from 'react';
import { CalendarEvent, ICalendarEventQuery, IPostEventRequest } from '@/shared/models/CalendarEvents';
import useCRUDApiFetch, { ICrudAPIFetchOptions } from '@/hooks/useApiFetch';
import config from '@/config.json';
import { unix } from 'moment';
import { beginningOf, endOf } from '@/shared/utils/dateHelpers';
import { IBaseAPIHook, IItemCache } from '@/shared/models/Data';

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

export interface ICalendarEventAPI extends IBaseAPIHook {
  fetchCalendarEvents: (filter: ICalendarEventQuery) => Promise<CalendarEvent | CalendarEvent[] | undefined>;
  createCalendarEvent: (evt: Omit<CalendarEvent, 'id'>) => Promise<CalendarEvent | CalendarEvent[] | undefined>;
  updateCalendarEvent: (evt: CalendarEvent) => Promise<CalendarEvent | CalendarEvent[] | undefined>;
  removeCalendarEvents: (evt: ICalendarEventQuery) => Promise<CalendarEvent | CalendarEvent[] | undefined>;
  fetchYear: (year: number, force?: boolean) => Promise<void>;
}

const getDistinctYearSet = (calendarEvents: CalendarEvent[]) => {
  const yearSet = new Set<number>();
  for (const { date } of calendarEvents) {
    yearSet.add(date.year());
  }
  return yearSet;
}

export default function useCalendarEventAPI(cache?: IItemCache<CalendarEvent[]>): ICalendarEventAPI {
  const fetchedYears = useMemo(() => getDistinctYearSet(cache?.value ?? []), [cache]);
  const crudAPIOptions = useMemo<ICrudAPIFetchOptions<CalendarEvent>>(() => ({
    cacheOpts: cache && { cache, getId: (evt: CalendarEvent) => evt.id },
    parseResult: withTypeSafeDate,
    url: config.calendarEventsUrl,
  }), [cache])

  const { loading, error, ...crudOps } = useCRUDApiFetch<IPostEventRequest, ICalendarEventQuery, EventsAPIResult, CalendarEvent>(crudAPIOptions);
  const { get, create, update, remove } = crudOps;

  const fetchCalendarEvents = useCallback(async (filter: ICalendarEventQuery, noCache?: boolean) => {
    return await get(EVENTS_ENDPOINT, filter, noCache);
  }, [get]);

  const createCalendarEvent = useCallback(async (evt: Omit<CalendarEvent, 'id'>) => {
    return await create(EVENTS_ENDPOINT, toPostEventRequest(evt as any));
  }, [create]);

  const updateCalendarEvent = useCallback(async (evt: CalendarEvent) => {
    return await update(EVENTS_ENDPOINT, toPostEventRequest(evt));
  }, [update]);

  const removeCalendarEvents = useCallback(async (filter: ICalendarEventQuery) => {
    return await remove(EVENTS_ENDPOINT, filter);
  }, [remove]);


  const fetchYear = useCallback(async (year: number, force?: boolean) => {
    const skip = !force && fetchedYears.has(year);
    if (loading || skip) return;
    const query = { from: beginningOf.year(year), to: endOf.year(year) };
    await fetchCalendarEvents(query, force);
  }, [fetchCalendarEvents, fetchedYears, loading]);


  return { fetchCalendarEvents, createCalendarEvent, updateCalendarEvent, removeCalendarEvents, fetchYear, loading, error };
}