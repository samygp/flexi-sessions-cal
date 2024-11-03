import React, { useCallback, useEffect, useMemo, useState } from "react";
import moment, { Moment } from "moment";
import OpenModalButton from "@components/Inputs/Buttons/OpenModalButton";
import EventCalendar from "@components/DataDisplay/Calendars/EventCalendar";
import EventTable from "@components/DataDisplay/Tables/EventTable";
import CalendarEventModal, { ICalendarEventFormModalProps } from "@components/Layout/Modals/CalendarEventModal";
import { useEventsContext, useHeaderContext } from "@hooks/useCustomContext";
import BaseViewLayout from "@views/BaseViewLayout";
import { CalendarIcon } from "@mui/x-date-pickers";
import { ButtonGroup, Divider, IconButton, Typography } from "@mui/material";
import { Refresh, AddCircleOutline } from "@mui/icons-material";

interface IEventCalendarViewLeftContentProps {
    currMonth: Moment;
    setCurrMonth: React.Dispatch<React.SetStateAction<Moment>>;
}

function EventCalendarViewLeftContent(props: IEventCalendarViewLeftContentProps) {
    const { currMonth, setCurrMonth } = props;
    const { eventsAPI: { fetchYear }, loading } = useEventsContext();

    const onYearChange = useCallback(async (m: Moment) => {
        await fetchYear(m.year());
    }, [fetchYear]);

    const calendarProps = useMemo(() => {
        return { onMonthChange: setCurrMonth, onYearChange, loading };
    }, [onYearChange, setCurrMonth, loading]);

    return (
        <>
            <ButtonGroup fullWidth sx={{ justifyContent: "space-evenly", marginBottom: '1ex' }}>
                <OpenModalButton<ICalendarEventFormModalProps>
                    startIcon={<AddCircleOutline />}
                    Modal={CalendarEventModal}
                    label="New Event"
                    sx={{ width: "fit-content" }}
                    variant="text"
                    modalProps={{ title: "Create Event", TitleIcon: CalendarIcon, operation: "create" }}
                />
                <IconButton onClick={() => onYearChange(currMonth)} size="small">
                    <Refresh color="primary" />
                    <Typography variant="body2" color={"primary"} >Refresh Events</Typography>
                </IconButton>
            </ButtonGroup>
            <Divider />
            <EventCalendar {...calendarProps} />
        </>
    );
}

export default function EventCalendarView() {
    const [currMonth, setCurrMonth] = useState<Moment>(moment());
    const { setTitle } = useHeaderContext();

    const currYear = useMemo(() => currMonth.year(), [currMonth]);

    useEffect(() => setTitle(`Eventotes ${currYear}`), [currYear, setTitle]);

    const { error, dateGroupedEventMap } = useEventsContext();
    const tableRows = useMemo(() => {
        const start = moment(currMonth).startOf("month");
        const end = moment(currMonth).endOf("month");
        return dateGroupedEventMap.getEntriesForDateRange(start, end);
    }, [currMonth, dateGroupedEventMap]);

    const leftContentProps = useMemo<IEventCalendarViewLeftContentProps>(() => {
        return {
            currMonth,
            setCurrMonth,
        };
    }, [currMonth]);

    return (
        <BaseViewLayout error={error} leftContent={<EventCalendarViewLeftContent {...leftContentProps} />} >
            <EventTable rows={tableRows} />
        </BaseViewLayout>
    );
}