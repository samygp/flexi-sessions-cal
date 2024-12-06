import React, { useCallback, useMemo, useState } from "react";
import moment, { Moment } from "moment";
import OpenModalButton from "@/components/Inputs/Buttons/OpenModalButton";
import EventCalendar from "@/components/DataDisplay/Calendars/EventCalendar";
import EventTable from "@/components/DataDisplay/Tables/EventTable";
import CalendarEventModal, { ICalendarEventFormModalProps } from "@/components/Layout/Modals/CalendarEventModal";
import { useEventsContext } from "@/hooks/useCustomContext";
import BaseViewLayout from "@/views/BaseViewLayout";
import { CalendarIcon } from "@mui/x-date-pickers";
import { ButtonGroup, Divider, IconButton, Typography } from "@mui/material";
import { Refresh, AddCircleOutline } from "@mui/icons-material";
import { useLocale } from "@/hooks/useLocale";
import { HeaderLabels } from "@/shared/locale/appUI";
import { EventViewLabels } from "@/shared/locale/events";

interface IEventCalendarViewLeftContentProps {
    currMonth: Moment;
    setCurrMonth: React.Dispatch<React.SetStateAction<Moment>>;
}

function EventCalendarViewLeftContent(props: IEventCalendarViewLeftContentProps) {
    const { currMonth, setCurrMonth } = props;
    const { eventsAPI: { fetchYear }, loading, } = useEventsContext();
    const labels = useLocale<string>(EventViewLabels);

    const onYearChange = useCallback(async (m: Moment, force?: boolean) => {
        await fetchYear(m.year(), force);
    }, [fetchYear]);

    const calendarProps = useMemo(() => {
        return { onMonthChange: setCurrMonth, onYearChange, loading };
    }, [onYearChange, setCurrMonth, loading]);

    const onRefresh = useCallback(() => onYearChange(currMonth, true), [currMonth, onYearChange]);

    return (
        <>
            <ButtonGroup fullWidth sx={{ justifyContent: "space-evenly", marginBottom: '1ex' }}>
                <OpenModalButton<ICalendarEventFormModalProps>
                    disabled={loading}
                    startIcon={<AddCircleOutline />}
                    Modal={CalendarEventModal}
                    label={labels.AddEvent}
                    sx={{ width: "fit-content" }}
                    variant="text"
                    size="small"
                    modalProps={{ title: labels.AddEvent, TitleIcon: CalendarIcon, operation: "create" }}
                />
                <IconButton disabled={loading} onClick={onRefresh} size="small">
                    <Refresh color="primary" />
                    <Typography variant="body2" color={"primary"} >{labels.RefreshEvents}</Typography>
                </IconButton>
            </ButtonGroup>
            <Divider />
            <EventCalendar {...calendarProps} />
        </>
    );
}

export default function EventCalendarView() {
    const [currMonth, setCurrMonth] = useState<Moment>(moment());
    const { Calendar: calendarHeaderLabel } = useLocale<string>(HeaderLabels);
    const headerTitle = useMemo(() => `${calendarHeaderLabel} ${currMonth.year()}`, [currMonth, calendarHeaderLabel]);

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
        <BaseViewLayout {...{error, headerTitle}} leftContent={<EventCalendarViewLeftContent {...leftContentProps} />} >
            <EventTable rows={tableRows} />
        </BaseViewLayout>
    );
}