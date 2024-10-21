import { useCallback, useEffect, useMemo, useState } from "react";
import { beginningOf, endOf } from "../shared/utils/dateHelpers";
import moment, { Moment } from "moment";
import OpenModalButton from "../components/Inputs/Buttons/OpenModalButton";
import EventCalendar from "../components/DataDisplay/Calendars/EventCalendar";
import EventTable from "../components/DataDisplay/Tables/EventTable";
import CalendarEventModal, { ICalendarEventFormModalProps } from "../components/Layout/Modals/CalendarEventModal";
import { useEventsContext } from "../hooks/useCustomContext";
import BaseViewLayout from "./BaseViewLayout";

export default function EventCalendarView() {
    const { loading, error, dateGroupedEventMap, eventsAPI: api } = useEventsContext();
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { onYearChange(moment()); }, []);

    const tableRows = useMemo(() => {
        const start = moment(currMonth).startOf("month");
        const end = moment(currMonth).endOf("month");
        return dateGroupedEventMap.getEntriesForDateRange(start, end);
    }, [currMonth, dateGroupedEventMap]);
    

    const title = useMemo(() => `Eventotes ${currYear}`, [currYear]);
    const calendarProps = useMemo(() => {
        return { onMonthChange: setCurrMonth, onYearChange, loading };
    }, [onYearChange, setCurrMonth, loading]);

    return (
        <BaseViewLayout {...{ title, error }} leftContent={<EventCalendar {...calendarProps} />} >
            <OpenModalButton<ICalendarEventFormModalProps>
                Modal={CalendarEventModal}
                label="New Event"
                modalProps={{title: "Create Event", operation: "create"}}
            />
            <EventTable rows={tableRows} />
        </BaseViewLayout>
    );
}