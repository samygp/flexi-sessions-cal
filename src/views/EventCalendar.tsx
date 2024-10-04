import { useCallback, useEffect, useState } from "react";
import EventCalendar from "../components/Calendars/EventCalendar/EventCalendar";
import useCalendarEvents from "../hooks/useCalendarEventFetch";
import { beginningOf, endOf } from "../shared/utils/dateHelpers";
import { Alert } from "@mui/material";
import moment, { Moment } from "moment";


export default function EventCalendarView() {
    const { fetchCalendarEvents, loading, error, calendarEventMap } = useCalendarEvents();
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [fetchedYears, setFetchedYears] = useState<number[]>([]);

    const onYearChange = useCallback(async (m: Moment) => {
        const year = m.year();
        if (loading || fetchedYears.includes(year)) return;
        const query = { from: beginningOf.year(year), to: endOf.year(year) };
        await fetchCalendarEvents(query).then(() => setFetchedYears(prev => [...prev, year]));
    }, [fetchCalendarEvents, fetchedYears, loading]);

    useEffect(() => setErrorMessage(error?.message ?? ""), [error]);

    // eslint-disable-next-line
    useEffect(() => { onYearChange(moment()); }, []);

    return (
        <>
            <EventCalendar {...{ loading, calendarEventMap, onYearChange }} />
            {errorMessage && <Alert severity="error" onClose={() => setErrorMessage("")}>{errorMessage}</Alert>}
        </>
    );
}