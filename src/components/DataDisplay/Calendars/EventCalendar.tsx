import { CalendarEvent } from '@shared/models/CalendarEvents';
import { Moment } from 'moment';
import { readableDateTime } from '@shared/utils/dateHelpers';
import { useEventsContext } from '@hooks/useCustomContext';
import Calendar from '@components/DataDisplay/Calendars/Calendar';
import EventTypeTag from '@components/DataDisplay/Tags/EventTypeTag';

// types
interface IEventCalendarProps {
  onMonthChange?: (month: Moment) => void;
  onYearChange?: (year: Moment) => void;
  onDaySelect?: (day: Moment) => void;
};

// helpers
const getDescription = (event: CalendarEvent): string => {
  return `${readableDateTime(event.date)} | [${event.monkehId}] - ${event.title}`;
}

export default function EventCalendar(props: IEventCalendarProps) {
  const { loading, dateGroupedEventMap } = useEventsContext();

  return <Calendar<CalendarEvent>
    {...{ ...props, loading, getDescription }}
    entryMap={dateGroupedEventMap}
    getAvatar={EventTypeTag}
  />
}
