import EventCalendarContextProvider from "../components/ContextProviders/EventCalendarContextProvider";
import { Navigate, Route, Routes } from "react-router-dom";
import CalendarView from "./EventCalendarView";
import MonkehView from "./MonkehView";
import ElementOrLogin from "../components/Other/ElementOrLogin";
import { PathName } from "../shared/models/Routes";

export default function MainView() {
    return (
        <EventCalendarContextProvider>
                <Routes>
                    <Route index element={<ElementOrLogin element={<Navigate to={PathName.calendar} />} />} />
                    <Route path={PathName.calendar} element={<ElementOrLogin element={<CalendarView />} />} />
                    <Route path={PathName.monkeh} element={<ElementOrLogin element={<MonkehView />} />} />
                </Routes>
        </EventCalendarContextProvider >
    );
}