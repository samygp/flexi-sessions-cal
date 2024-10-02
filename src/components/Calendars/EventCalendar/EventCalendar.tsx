import { CalendarEvent, EventMap } from '../../../models/CalendarEvents';
import EventTypeTag from './EventTypeTag';
import Calendar from '../Calendar';

// types
interface IEventCalendarProps {
  calendarEventMap: EventMap;
  loading?: boolean;
  onYearChange?: (year: number) => void;
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
    getAvatar={e => <EventTypeTag {...e} />}
  />
}
