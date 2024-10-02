import { useCallback, useMemo, useState } from 'react';
import Badge from '@mui/material/Badge';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import moment, { Moment } from 'moment';
import { Dialog, DialogContent, DialogContentText, DialogTitle, List, ListItem, ListItemAvatar, ListItemText, ModalProps, Tooltip } from '@mui/material';
import { CalendarEvent, EventColorMap, EventMap, EventType, EventTypeLabels } from '../../models/CalendarEvents';


// types

interface ICalendarProps<T> {
    highlightedEntryMap: Map<string, T>,
    getEntryId: (e: T) => string | number;
    getEntryDate: (e: T) => Moment;
    getDescription: (e: T) => React.ReactNode;
    getAvatar: (v: T) => React.ReactNode;
    onYearChange?: (year: number) => void;
    loading?: boolean,
};

interface IDayFormatterProps<T> extends ICalendarProps<T>, PickersDayProps<Moment> {
    groupedEntriesByDay?: Map<string, string[]>;
    onDayClick?: (day: Moment, entries: T[]) => void;
}

interface IDayEntriesModalProps<T> extends Omit<ICalendarProps<T>, 'highlightedEntryMap' | 'loading'> {
    entries: T[];
    onClose: ModalProps['onClose'];
    open: boolean;
    title: string;
}


// constants
const ymdFormat = 'YYY-MM-dd';

// helpers
const getDayID = (date: Moment) => date.format(ymdFormat);

// components

function DayDetailsModal<T>({ entries, open, title, onClose, getAvatar, getEntryId, getDescription }: IDayEntriesModalProps<T>) {
    return (
        <Dialog maxWidth='lg' {...{ onClose, open }}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <List>
                    {entries.map(entry => {
                        return (
                            <ListItem key={getEntryId(entry)} divider>
                                <ListItemAvatar> {getAvatar(entry)} </ListItemAvatar>
                                <ListItemText> {getDescription(entry)} </ListItemText>
                            </ListItem>
                        );
                    })}
                </List>
            </DialogContent>
        </Dialog>
    );
}

function DayFormatter<T>({ highlightedEntryMap, groupedEntriesByDay, onDayClick, ...props }: IDayFormatterProps<T>) {
    const { day, getEntryDate } = props;
    const dayID = useMemo<string>(() => getDayID(day), [day]);

    const entries = useMemo<T[] | undefined>(() => {
        const evtIDList = groupedEntriesByDay?.get(dayID);
        if (!evtIDList || !highlightedEntryMap) return;
        return evtIDList.map(id => highlightedEntryMap.get(id)!)
            .sort((a, b) => getEntryDate(a).isAfter(getEntryDate(b)) ? 1 : -1);
    }, [highlightedEntryMap, groupedEntriesByDay, dayID]);

    const onClick = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (!entries?.length || !onDayClick) return;
        e.preventDefault();
        onDayClick(day, entries);
    }, [onDayClick, day, entries]);

    if (!entries?.length) return <PickersDay {...props} />;

    return (
        <Badge key={dayID} overlap="circular" variant='dot' color="primary">
            <Tooltip placement='right-end' title={`${entries.length} events`}>
                <PickersDay {...props} onClick={onClick} />
            </Tooltip>
        </Badge>
    );
}

export default function Calendar<T>(props: ICalendarProps<T>) {
    const initialValue = useMemo(() => moment(new Date()), []);
    const { highlightedEntryMap, getEntryDate } = props;

    const [entries, setEntries] = useState<T[]>([]);
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const onModalClose = useCallback(() => setOpen(false), []);
    const modalProps = useMemo<IDayEntriesModalProps<T>>(() => {
        return { entries, onClose: onModalClose, open, title, ...props };
    }, [entries, open, title, props]);

    const onDayClick = useCallback((day: Moment, entries: T[]) => {
        setEntries(entries);
        setTitle(getDayID(day));
        setOpen(true);
    }, []);

    const groupedEntriesByDay = useMemo(() => {
        const groupedEntriesByDay = new Map<string, string[]>();
        highlightedEntryMap.forEach((entry, id) => {
            const date = getEntryDate(entry);
            const k = getDayID(date);
            if (!groupedEntriesByDay.has(k)) groupedEntriesByDay.set(k, []);
            groupedEntriesByDay.get(k)?.push(id);
        });
        return groupedEntriesByDay;
    }, [highlightedEntryMap]);

    const DayFormatterWrapper = useCallback((formatterProps: PickersDayProps<Moment>) => {
        return <DayFormatter<T> {...formatterProps} {...props} />;
    }, [props]);

    return (
        <>
            <DayDetailsModal<T> {...modalProps} />
            <DateCalendar
                defaultValue={initialValue}
                loading={props.loading}
                // onYearChange={}
                renderLoading={() => <DayCalendarSkeleton />}
                slots={{ day: DayFormatterWrapper }}
                slotProps={{
                    day: { ...props, groupedEntriesByDay, onDayClick } as any,
                }}
                readOnly
            />
        </>
    );
}