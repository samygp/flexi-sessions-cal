import { useCallback, useEffect, useState } from "react";
import EventCalendar from "../components/Calendars/EventCalendar/EventCalendar";
import useCalendarEvents from "../hooks/useCalendarEventFetch";
import { beginningOf, endOf } from "../shared/utils/dateHelpers";
import { Alert, Grid } from "@mui/material";
import moment, { Moment } from "moment";
import NewEventButton from "../components/Inputs/Buttons/NewEventButton";


export default function EventCalendarView() {
    const { loading, error, calendarEventMap, ...calendarAPI } = useCalendarEvents();
    const { fetchCalendarEvents, createCalendarEvent } = calendarAPI;
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
        <Grid container spacing={2} wrap="wrap">
            <Grid item xs={6} >
                <NewEventButton onSubmit={createCalendarEvent} disabled={loading} />
                <EventCalendar {...{ loading, calendarEventMap, onYearChange }} />
            </Grid>
            <Grid item xs={6}>
                
            </Grid>

            {errorMessage && <Alert severity="error" onClose={() => setErrorMessage("")}>{errorMessage}</Alert>}
        </Grid>
    );
}