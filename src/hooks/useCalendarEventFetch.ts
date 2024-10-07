import React, { useContext } from 'react';
import EventsAPI, { EventAPICall, IEventsAPIFetchOptions } from '../services/calendarEvents/CalendarService';
import { useAsyncFn } from 'react-use';
import { EventMap, CalendarEvent, ICalendarEventQuery, IPostEventRequest } from '../shared/models/CalendarEvents';
import { IFetchResponse } from '../shared/models/Rest';
import SessionContext from '../shared/models/SessionContext';

export default function useCalendarEventFetch() {
  const requestAbortController = React.useRef<AbortController | null>(null);
  const [calendarEventMap, setcalendarEventMap] = React.useState<EventMap>(new Map<string, CalendarEvent>());
  const { authState, accessToken } = useContext(SessionContext);

  const updateCalendarEventMap = React.useCallback((events: CalendarEvent[]) => {
    setcalendarEventMap(prev => {
      events.forEach(evt => prev.set(evt.id, evt));
      return prev;
    });
  }, [setcalendarEventMap]);

  const eventAPIFetch = React.useCallback(async <T>(opts: IEventsAPIFetchOptions, eventAPICall: EventAPICall<T>, callback?: (r: T) => any) => {
    if (authState !== 'authenticated' || !accessToken) return;
    if (requestAbortController.current) requestAbortController.current.abort();

    const controller = new AbortController();

    const fetchPromise = new Promise<IFetchResponse<T>>(
      async (resolve, reject) => {
        controller.signal.onabort = () => reject(new DOMException('aborted', 'AbortError'));
        eventAPICall({ ...opts, authToken: accessToken }).then(resolve);
      })
      .then(({ status, result, error }) => {
        if (error) throw new Error(`${status} - ${error}`);
        else if (callback && result) callback(result);
      })
      .catch((error) => { // ignore the error if it's caused by `controller.abort`
        if (error.name !== 'AbortError') throw error;
      });

    requestAbortController.current = controller;
    return fetchPromise;
  }, [authState, accessToken]);

  const [{ loading: fetchLoading, error: fetchError }, fetchCalendarEvents] = useAsyncFn(async (filter: ICalendarEventQuery) => {
    return await eventAPIFetch<CalendarEvent[]>({ params: filter }, EventsAPI.fetchEvents, updateCalendarEventMap);
  }, [eventAPIFetch, updateCalendarEventMap]);

  const [{ loading: postLoading, error: postError }, createCalendarEvent] = useAsyncFn(async (evt: IPostEventRequest) => {
    const body = { ...evt, date: evt.date?.unix() };
    return await eventAPIFetch<CalendarEvent>({ body }, EventsAPI.createEvent, e => updateCalendarEventMap([e]));
  }, [eventAPIFetch, updateCalendarEventMap]);

  const loading = React.useMemo<boolean>(() => fetchLoading || postLoading, [fetchLoading, postLoading]);
  const error = React.useMemo<Error | undefined>(() => fetchError || postError, [fetchError, postError]);

  return { fetchCalendarEvents, createCalendarEvent, loading, error, calendarEventMap };
}