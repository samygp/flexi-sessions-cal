
import EventTypeTag from './EventTypeTag';
import Calendar from '../Calendar';
import { EventMap, CalendarEvent } from '../../../shared/models/CalendarEvents';
import { Moment } from 'moment';

// types
interface IEventCalendarProps {
  calendarEventMap: EventMap;
  loading?: boolean;
  onYearChange?: (year: Moment) => void;
};

// helpers
const getEventDescription = (event: CalendarEvent): string => {
  return `${event.date.format('hh:mm')} | [${event.userName}-${event.userEmail}] - ${event.title}`;
}

export default function EventCalendar({ calendarEventMap, loading, onYearChange }: IEventCalendarProps) {
  return <Calendar<CalendarEvent>
    highlightedEntryMap={calendarEventMap}
    onYearChange={onYearChange}
    loading={loading}
    getEntryId={e => e.id}
    getEntryDate={e => e.date}
    getDescription={getEventDescription}
    getAvatar={EventTypeTag}
  />
}
