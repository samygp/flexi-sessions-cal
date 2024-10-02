import React, { useContext } from 'react';
import { CalendarEvent, EventMap, ICalendarEventQuery } from '../models/CalendarEvents';
import EventsAPI, { EventAPICall, IEventsAPIFetchOptions } from '../services/calendarEvents/CalendarService';
import _ from 'lodash';
import SessionContext from '../models/SessionContext';
import { IFetchResponse } from '../models/Rest';
import { useAsyncFn } from 'react-use';


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
    if (requestAbortController.current) requestAbortController.current.abort();
    if (authState !== 'authenticated' || !accessToken) return;

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

  const [{ loading: fetchLoading, error: fetchError }, fetchCalendarEvents] = useAsyncFn((filter: ICalendarEventQuery) => {
    return eventAPIFetch<CalendarEvent[]>({ params: filter }, EventsAPI.fetchEvents, updateCalendarEventMap);
  }, [eventAPIFetch, updateCalendarEventMap]);

  const loading = React.useMemo<boolean>(() => fetchLoading, [fetchLoading]);
  const error = React.useMemo<Error | undefined>(() => fetchError, [fetchError]);

  return { fetchCalendarEvents, loading, error, calendarEventMap };
}