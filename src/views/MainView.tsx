import EventCalendarContextProvider from "@/components/ContextProviders/EventCalendarContextProvider";
import { Navigate, Route, Routes } from "react-router-dom";
import ElementOrLogin from "@/components/Other/ElementOrLogin";
import { PathName } from "@/shared/models/Routes";
import EventRulesView from "@/views/EventRulesView";
import CalendarView from "@/views/EventCalendarView";
import MonkehView from "@/views/MonkehView";

export default function MainView() {
    return (
        <EventCalendarContextProvider>
                <Routes>
                    <Route index element={<ElementOrLogin element={<Navigate to={PathName.calendar} />} />} />
                    <Route path={PathName.calendar} element={<ElementOrLogin element={<CalendarView />} />} />
                    <Route path={PathName.monkeh} element={<ElementOrLogin element={<MonkehView />} />} />
                    <Route path={PathName.eventRules} element={<ElementOrLogin element={<EventRulesView />} />} />
                </Routes>
        </EventCalendarContextProvider >
    );
}