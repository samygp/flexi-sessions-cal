import { CalendarEvent } from '@shared/models/CalendarEvents';
import { Moment } from 'moment';
import { readableDateTime } from '@shared/utils/dateHelpers';
import { useDataContext } from '@hooks/useCustomContext';
import Calendar from '@components/DataDisplay/Calendars/Calendar';
import EventTypeTag from '@components/DataDisplay/Tags/EventTypeTag';
import { useCallback } from 'react';

// types
interface IEventCalendarProps {
  onMonthChange?: (month: Moment) => void;
  onYearChange?: (year: Moment) => void;
  onDaySelect?: (day: Moment) => void;
};

export default function EventCalendar(props: IEventCalendarProps) {
  const { loading, dateGroupedEventMap, monkehMap } = useDataContext();

  const getDescription = useCallback((event: CalendarEvent): string => {
    const monkehName = monkehMap[event.monkehId].name;
    return `${readableDateTime(event.date)} | [${monkehName}] - ${event.title}`;
  }, [monkehMap]);


  return <Calendar<CalendarEvent>
    {...{ ...props, loading, getDescription }}
    entryMap={dateGroupedEventMap}
    getAvatar={EventTypeTag}
  />
}
