import { useContext } from "react";
import SessionContext from "../shared/models/SessionContext";
import EventCalendarContext from "../shared/models/EventCalendarContext";

export const useSessionContext = () => useContext(SessionContext);

export const useEventCalendarContext = () => useContext(EventCalendarContext);