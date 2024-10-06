import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Badge from '@mui/material/Badge';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import moment, { Moment } from 'moment';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ModalProps,
    Tooltip,
} from '@mui/material';
import { getDayID } from '../../shared/utils/dateHelpers';



// types
interface ICalendarEntryFormatters<T> {
    getEntryId: (e: T) => string | number;
    getEntryDate: (e: T) => Moment;
    getDescription: (e: T) => React.ReactNode;
    getAvatar?: (v: T) => React.ReactNode;
}

interface ICalendarProps<T> extends ICalendarEntryFormatters<T> {
    loading?: boolean;
    highlightedEntryMap: Map<string, T>;
    onYearChange?: (year: Moment) => void;
}

interface IDayEntriesModalProps<T> extends ICalendarEntryFormatters<T> {
    entries: T[];
    onClose: ModalProps['onClose'];
    open: boolean;
    title: string;
}

// components

function DayDetailListItem<T>({ entry, getAvatar, getDescription }: ICalendarEntryFormatters<T> & { entry: T }) {
    const avatarRef = useRef<React.ReactNode>();
    const descriptionRef = useRef<React.ReactNode>();

    useEffect(() => {
        if (getAvatar) avatarRef.current = getAvatar(entry);
        descriptionRef.current = getDescription(entry);
    }, [getAvatar, entry, getDescription]);
    return (
        <ListItem divider>
            {avatarRef.current ? <ListItemAvatar>{avatarRef.current}</ListItemAvatar> : ''}
            <ListItemText> {descriptionRef.current} </ListItemText>
        </ListItem>
    );
}

function DayDetailsModal<T>(props: IDayEntriesModalProps<T>) {
    const {entries, open, title, onClose, getEntryId} = props;
    return (
        <Dialog maxWidth='lg' {...{ onClose, open }}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <List>
                    {entries.map(entry => <DayDetailListItem<T> key={getEntryId(entry)} {...{ entry, ...props}} />)}
                </List>
            </DialogContent>
        </Dialog>
    );
}

export default function Calendar<T>(props: ICalendarProps<T>) {
    const initialValue = useMemo(() => moment(new Date()), []);

    const [entries, setEntries] = useState<T[]>([]);
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const onModalClose = useCallback(() => setOpen(false), []);
    const modalProps = useMemo<IDayEntriesModalProps<T>>(() => {
        return { entries, onClose: onModalClose, open, title, ...props };
    }, [entries, open, title, props, onModalClose]);

    const {highlightedEntryMap, getEntryDate, onYearChange} = props;

    const groupedEntriesByDay = useMemo<Map<string, string[]>>(() => {
        const groupedEntriesByDay = new Map<string, string[]>();
        highlightedEntryMap.forEach((entry, id) => {
            const date = getEntryDate(entry);
            const k = getDayID(date);
            if (!groupedEntriesByDay.has(k)) groupedEntriesByDay.set(k, []);
            groupedEntriesByDay.get(k)?.push(id);
        });
        return groupedEntriesByDay;
    }, [highlightedEntryMap, getEntryDate]);

    const onDaySelect = useCallback((day: Moment) => {
        const dayID = getDayID(day);
        const entryIDs = groupedEntriesByDay.get(dayID) ?? [];
        
        setEntries(entryIDs.map(id => highlightedEntryMap.get(id)!));
        setTitle(dayID);
        setOpen(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <>
            <DayDetailsModal<T> {...modalProps} />
            <DateCalendar
                defaultValue={initialValue}
                loading={props.loading}
                onYearChange={onYearChange}
                slots={{
                    day: props => {
                        const { day } = props;
                        const isFirstVisibleCell = day.day() === 1;
                        const isLastVisibleCell = day.day() === day.daysInMonth();
                        const pickerDayProps = {...props, isFirstVisibleCell, isLastVisibleCell, onDaySelect};

                        if (!entries?.length) return <PickersDay {...pickerDayProps} />;

                        return (
                            <Badge key={getDayID(day)} overlap="circular" variant='dot' color="primary">
                                <Tooltip placement='right-end' title={`${entries.length} events`}>
                                    <PickersDay {...pickerDayProps} />
                                </Tooltip>
                            </Badge>
                        );
                    }
                }}
                renderLoading={() => <DayCalendarSkeleton />}
                readOnly
            />
        </>
    );
}