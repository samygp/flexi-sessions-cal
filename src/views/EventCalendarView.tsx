import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import EventCalendar from "../components/Calendars/EventCalendar/EventCalendar";
import { beginningOf, endOf } from "../shared/utils/dateHelpers";
import { Alert, Grid, Typography } from "@mui/material";
import moment, { Moment } from "moment";
import NewEventButton from "../components/Inputs/Buttons/NewEventButton";
import EventTable from "../components/Tables/EventTable";
import EventCalendarContextProvider, { EventCalendarContext } from "../components/ContextProviders/CalendarEventContextProvider";


function EventCalendarViewWrapper() {
    const { loading, error, dateGroupedEventMap, api } = useContext(EventCalendarContext);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [fetchedYears, setFetchedYears] = useState<number[]>([]);
    const [currYear, setCurrYear] = useState<number>(moment().year());
    const [currMonth, setCurrMonth] = useState<Moment>(moment());

    const onYearChange = useCallback(async (m: Moment) => {
        const year = m.year();
        if (loading || fetchedYears.includes(year)) return;
        setCurrYear(year);
        const query = { from: beginningOf.year(year), to: endOf.year(year) };
        await api.fetchCalendarEvents(query).then(() => setFetchedYears(prev => [...prev, year]));
    }, [api, fetchedYears, loading]);

    const tableRows = useMemo(() => {
        const start = moment(currMonth).startOf("month");
        const end = moment(currMonth).endOf("month");
        return dateGroupedEventMap.getEntriesForDateRange(start, end);
    }, [currMonth, dateGroupedEventMap]);
    

    useEffect(() => setErrorMessage(error?.message ?? ""), [error]);

    // eslint-disable-next-line
    useEffect(() => { onYearChange(moment()); }, []);

    return (
        <Grid container spacing={2} padding={'3vh'}>
            <Grid item xs={12}>
                <Typography variant="h1" gutterBottom>
                    Eventotes {currYear}
                </Typography>
            </Grid>
            <Grid item xs={3} >
                <EventCalendar {...{ loading, onYearChange }} onMonthChange={setCurrMonth} />
            </Grid>
            <Grid item xs={9}>
                <NewEventButton onSubmit={api.createCalendarEvent} disabled={loading} />
                <EventTable rows={tableRows} />
            </Grid>

            {errorMessage && <Alert severity="error" onClose={() => setErrorMessage("")}>{errorMessage}</Alert>}
        </Grid>
    );
}

export default function EventCalendarView() {
    return (
        <EventCalendarContextProvider>
            <EventCalendarViewWrapper />
        </EventCalendarContextProvider>);
}