import { useCallback, useEffect, useMemo, useState } from "react";
import moment, { Moment } from "moment";
import OpenModalButton from "../components/Inputs/Buttons/OpenModalButton";
import EventCalendar from "../components/DataDisplay/Calendars/EventCalendar";
import EventTable from "../components/DataDisplay/Tables/EventTable";
import CalendarEventModal, { ICalendarEventFormModalProps } from "../components/Layout/Modals/CalendarEventModal";
import { useEventsContext } from "../hooks/useCustomContext";
import BaseViewLayout from "./BaseViewLayout";
import { CalendarIcon } from "@mui/x-date-pickers";

export default function EventCalendarView() {
    const { loading, error, dateGroupedEventMap, eventsAPI: {fetchYear} } = useEventsContext();
    const [currYear, setCurrYear] = useState<number>(moment().year());
    const [currMonth, setCurrMonth] = useState<Moment>(moment());
    
    const onYearChange = useCallback(async (m: Moment) => {
        const year = m.year();
        setCurrYear(year);
        await fetchYear(year);
    }, [fetchYear]);

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
                modalProps={{title:  "Create Event", TitleIcon: CalendarIcon, operation: "create"}}
            />
            <EventTable rows={tableRows} />
        </BaseViewLayout>
    );
}