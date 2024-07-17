import EventCalendar from "../components/EventCalendar/EventCalendar";
import { EventType } from "../models/CalendarEvents";


export default function Calendar() {
    return <EventCalendar eventType={EventType.Session}/>;
}