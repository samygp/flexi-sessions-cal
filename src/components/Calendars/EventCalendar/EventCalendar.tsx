
import EventTypeTag from './EventTypeTag';
import Calendar from '../Calendar';
import { CalendarEvent } from '../../../shared/models/CalendarEvents';
import { Moment } from 'moment';
import { useContext } from 'react';
import { EventCalendarContext } from '../../ContextProviders/CalendarEventContextProvider';

// types
interface IEventCalendarProps {
  onMonthChange?: (month: Moment) => void;
  onYearChange?: (year: Moment) => void;
  onDaySelect?: (day: Moment) => void;
};

// helpers
const getDescription = (event: CalendarEvent): string => {
  return `${event.date.format('hh:mm A')} | [${event.userName}-${event.userEmail}] - ${event.title}`;
}

export default function EventCalendar({ onYearChange, onDaySelect }: IEventCalendarProps) {
  const { loading, dateGroupedEventMap } = useContext(EventCalendarContext);

  return <Calendar<CalendarEvent>
    {...{ onDaySelect, onYearChange, loading, getDescription }}
    entryMap={dateGroupedEventMap}
    getAvatar={EventTypeTag}
  />
}
