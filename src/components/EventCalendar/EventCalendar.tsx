import { useMemo } from 'react';
import Badge from '@mui/material/Badge';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import moment, { Moment } from 'moment';
import useCalendarFetch from '../../hooks/useCalendarFetch';
import { Tooltip } from '@mui/material';
import { CalendarContext, useCalendarContext } from '../../hooks/useCalendarContext';
import { EventColorMap, EventType, EventTypeLabels } from '../../models/CalendarEvents';

function DayFormatter(props: PickersDayProps<Moment> & { highlightedDays?: Map<string, string> }) {
  const { highlightedDays, day, outsideCurrentMonth, ...other } = props;
  const ctx = useCalendarContext();
  
  const sessionTitle = useMemo<string|undefined>(() => {
    const title = highlightedDays?.get(props.day.toISOString());
    if(title) return `${EventTypeLabels[ctx.eventType]}: ${title}`;
  }, [highlightedDays, props, ctx.eventType]);

  return (
    <Badge
      key={day.toISOString()}
      overlap="circular"
      variant='dot'
      color={sessionTitle ? ctx.color: undefined}
    >
      <Tooltip placement='right-end' title={sessionTitle}>
        <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
      </Tooltip>
    </Badge>
  );
}
const initialValue = moment(new Date());

interface IEventCalendarProps {
  eventType: EventType,
};

export default function EventCalendar({eventType}: IEventCalendarProps) {  
  const { handleMonthChange, isLoading, highlightedDays } = useCalendarFetch(initialValue);
  const color = useMemo(() => EventColorMap[eventType], [eventType]);

  return (
    <CalendarContext.Provider value={{eventType, color}}>
      <DateCalendar
        defaultValue={initialValue}
        loading={isLoading}
        onMonthChange={handleMonthChange}
        renderLoading={() => <DayCalendarSkeleton />}
        slots={{
          day: DayFormatter,
        }}
        slotProps={{
          day: {
            highlightedDays,
          } as any,
        }}
        readOnly
      />
    </CalendarContext.Provider>
  );
}