import React from 'react';
import moment, { Moment } from "moment";

function getRandomNumber(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min);
}

function fakeFetch(date: Moment, { signal }: { signal: AbortSignal }) {
  return new Promise<{ daysToHighlight: Map<string, string> }>((resolve, reject) => {
    const timeout = setTimeout(() => {
      const daysToHighlight = new Map<string, string>();
      const daysInMonth = date.daysInMonth();
      const uniqueDaysInMonth = new Set<number>([...Array(getRandomNumber(2, 6))].map(_n => getRandomNumber(1, daysInMonth)));

      uniqueDaysInMonth.forEach(d => {
        const dString = `${d}-${date.month()+1}-${date.year()}`;
        const newDate = moment(dString, "DD-MM-YYYY");
        daysToHighlight.set(newDate.toISOString(), "evento de Fulanito");
      });
      console.log(daysToHighlight);
      resolve({ daysToHighlight });
    }, 500);

    signal.onabort = () => {
      clearTimeout(timeout);
      reject(new DOMException('aborted', 'AbortError'));
    };
  });
}

export default function useCalendarFetch(initialValue: Moment) {
  const requestAbortController = React.useRef<AbortController | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [highlightedDays, setHighlightedDays] = React.useState<Map<string, string>>(new Map<string, string>());

  const fetchHighlightedDays = (date: Moment) => {
    const controller = new AbortController();
    fakeFetch(date, {
      signal: controller.signal,
    })
      .then(({ daysToHighlight }) => {
        setHighlightedDays(daysToHighlight);
        setIsLoading(false);
      })
      .catch((error) => {
        // ignore the error if it's caused by `controller.abort`
        if (error.name !== 'AbortError') {
          throw error;
        }
      });

    requestAbortController.current = controller;
  }

  // fetch on load
  React.useEffect(() => {
    fetchHighlightedDays(initialValue);
    // abort request on unmount
    return () => requestAbortController.current?.abort();
  }, []);

  const handleMonthChange = (date: Moment) => {
    if (requestAbortController.current) {
      // make sure that you are aborting useless requests
      // because it is possible to switch between months pretty quickly
      requestAbortController.current.abort();
    }

    setIsLoading(true);
    setHighlightedDays(prev => {
      prev.clear();
      return prev;
    });
    fetchHighlightedDays(date);
  };

  return { handleMonthChange, isLoading, highlightedDays };
}