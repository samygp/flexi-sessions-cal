import { EventType } from "@/shared/models/CalendarEvents";
import { DatePicker, PickersDay } from "@mui/x-date-pickers";
import { useEventRulesContext, useEventsContext } from "@/hooks/useCustomContext";
import { EventRuleService } from "@/services/eventRules";
import { useCallback, useEffect, useMemo } from "react";
import { Moment } from "moment";
import { Badge, TextField, Tooltip } from "@mui/material";
import { isPastDate, readableDateTime } from "@/shared/utils/dateHelpers";
import moment from "moment";

interface ISessionDatePickerProps {
    eventType: EventType;
    value: Moment;
    onChange: (date: Moment) => void;
}

export default function SessionDatePicker({ eventType, value, onChange: setValue }: ISessionDatePickerProps) {
    const { eventRulesMap } = useEventRulesContext();
    const { dateGroupedEventMap } = useEventsContext();
    const rulesService = useMemo<EventRuleService>(() => new EventRuleService(eventRulesMap, dateGroupedEventMap), [eventRulesMap, dateGroupedEventMap]);
    const eventTypeDaysOfWeek = useMemo<number[]>(() => eventRulesMap[eventType].daysOfWeek, [eventRulesMap, eventType]);

    const handleDateChange = useCallback((date: Moment | null) => {
        if (!date) return
        const conflict = rulesService.checkEventTypeConflicts(eventType, date);
        if (!conflict) return setValue(date);
        alert(conflict);
    }, [setValue, rulesService, eventType]);

    useEffect(() => {
        const conflict = rulesService.checkEventTypeConflicts(eventType, value);
        if (!conflict) return;
        const nextDate = rulesService.getNextAvailableDateForEventType(eventType, value);
        setValue(nextDate);
    }, [eventType, setValue, rulesService, value]);


    return <DatePicker
        value={value}
        minDate={moment().startOf('day')}
        onChange={handleDateChange}
        slots={{
            textField: props => <TextField {...props} disabled value={readableDateTime(value)} />,
            day: props => {
                const { day } = props;
                if (isPastDate(day)) return <PickersDay {...props} disabled />
                const isFirstVisibleCell = day.day() === 1;
                const isLastVisibleCell = day.day() === day.daysInMonth();
                const conflict = rulesService.checkEventTypeConflicts(eventType, day);
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