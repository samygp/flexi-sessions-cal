import { useMemo } from 'react';
import Badge, {BadgeOwnProps} from '@mui/material/Badge';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import moment, { Moment } from 'moment';
import useCalendarFetch from '../../hooks/useCalendarFetch';
import { Tooltip } from '@mui/material';

function DayFormatter(props: PickersDayProps<Moment> & { highlightedDays?: Map<string, string> }) {
  const { highlightedDays, day, outsideCurrentMonth, ...other } = props;
  
  const sessionTitle = useMemo<string|undefined>(() => {
    return highlightedDays?.get(props.day.toISOString());
  }, [highlightedDays, props]);

  return (
    <Badge
      key={day.toISOString()}
      overlap="circular"
      variant='dot'
      color={sessionTitle ? 'secondary': undefined}
    >
      <Tooltip placement='right-end' title={sessionTitle}>
        <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
      </Tooltip>
    </Badge>
  );
}
const initialValue = moment('2022-04-17');

export default function CalendarioPerron() {
  
  const { handleMonthChange, isLoading, highlightedDays } = useCalendarFetch(initialValue);

  return (
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
  );
}