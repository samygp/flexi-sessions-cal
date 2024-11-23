import { EventType } from "@/shared/models/CalendarEvents";
import { DatePicker, PickersDay } from "@mui/x-date-pickers";
import { useCallback, useEffect, useMemo } from "react";
import { Moment } from "moment";
import { Badge, TextField, Tooltip } from "@mui/material";
import { isPastDate, readableDateTime } from "@/shared/utils/dateHelpers";
import moment from "moment";
import useEventRules from "@/hooks/useEventRules";

interface ISessionDatePickerProps {
    eventType: EventType;
    disabled?: boolean;
    value: Moment;
    onChange: (date: Moment) => void;
}

export default function SessionDatePicker({ eventType, value, onChange: setValue, disabled }: ISessionDatePickerProps) {
    const rules = useEventRules();
    const eventTypeDaysOfWeek = useMemo<number[]>(() => rules.getDaysOfWeekForEventType(eventType), [rules, eventType]);

    const handleDateChange = useCallback((date: Moment | null) => {
        if (!date) return
        const conflict = rules.checkEventTypeConflicts(eventType, date);
        if (!conflict) return setValue(date);
        alert(conflict);
    }, [setValue, rules, eventType]);

    useEffect(() => {
        const conflict = rules.checkEventTypeConflicts(eventType, value);
        if (!conflict) return;
        const nextDate = rules.getNextAvailableDateForEventType(eventType, value);
        setValue(nextDate);
    }, [eventType, setValue, rules, value]);


    return <DatePicker
        value={value}
        minDate={moment().startOf('day')}
        onChange={handleDateChange}
        disabled={disabled}
        slots={{
            textField: props => <TextField {...props} disabled value={readableDateTime(value)} />,
            day: props => {
                const { day } = props;
                if (isPastDate(day)) return <PickersDay {...props} disabled />
                const isFirstVisibleCell = day.day() === 1;
                const isLastVisibleCell = day.day() === day.daysInMonth();
                const conflict = rules.checkEventTypeConflicts(eventType, day);
                const disabled = !eventTypeDaysOfWeek.includes(day.weekday()) || !!conflict;
                const pickersDay = <PickersDay {...{ ...props, isFirstVisibleCell, isLastVisibleCell, disabled }} />;
                if (!conflict) return pickersDay;
                return (
                    <Tooltip title={conflict}>
                        <Badge color="error" overlap="circular">
                            {pickersDay}
                        </Badge>
                    </Tooltip>
                );
            }
        }} />;
}