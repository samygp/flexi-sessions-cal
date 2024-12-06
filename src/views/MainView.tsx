import DataContextProvider from "@/components/ContextProviders/DataContextProvider";
import { Navigate, Route, Routes } from "react-router-dom";
import ElementOrLogin from "@/components/Other/ElementOrLogin";
import { getPath, PathName } from "@/shared/models/Routes";
import EventRulesView from "@/views/EventRulesView";
import CalendarView from "@/views/Events/EventCalendarView";
import MonkehView from "@/views/Monkehs/MonkehView";
import MonkehBirthdaysView from "./Monkehs/MonkehBirthdaysView";

export default function MainView() {
    return (
        <DataContextProvider>
                <Routes>
                    <Route index element={<ElementOrLogin element={<Navigate to={PathName.calendar} />} />} />
                    <Route path={PathName.calendar} element={<ElementOrLogin element={<CalendarView />} />} />
                    <Route path={PathName.monkeh} element={<ElementOrLogin element={<MonkehView />} />} />
                    <Route path={getPath(PathName.birthdays, PathName.app)} element={<ElementOrLogin element={<MonkehBirthdaysView />} />} />
                    <Route path={PathName.eventRules} element={<ElementOrLogin element={<EventRulesView />} />} />
                </Routes>
        </DataContextProvider >
    );
}