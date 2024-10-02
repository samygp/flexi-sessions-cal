import { useCallback, useEffect, useState } from "react";
import EventCalendar from "../components/Calendars/EventCalendar/EventCalendar";
import useCalendarEvents from "../hooks/useCalendarEventFetch";
import { beginningOf, endOf } from "../utils/dateHelpers";
import { Alert } from "@mui/material";


export default function EventCalendarView() {
    const { fetchCalendarEvents, loading, error, calendarEventMap } = useCalendarEvents();
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [fetchedYears, setFetchedYears] = useState<number[]>([]);

    const onYearChange = useCallback((year: number) => {
        if (fetchedYears.includes(year)) return;
        const query = { from: beginningOf.year(year), to: endOf.year(year) };
        fetchCalendarEvents(query).then(() => setFetchedYears(prev => [...prev, year]));
    }, [fetchCalendarEvents, fetchedYears]);

    useEffect(() => setErrorMessage(error?.message ?? ""), [error]);

    return (
        <>
            <EventCalendar {...{ loading, calendarEventMap, onYearChange }} />
            {errorMessage && <Alert severity="error" onClose={() => setErrorMessage("")}>{errorMessage}</Alert>}
        </>
    );
}