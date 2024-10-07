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
import { DateGroupedEntryMap } from '../../shared/models/DateGroupedEntryMap';
import { get } from 'lodash';

// types
interface ICalendarEntryFormatters<T> {
    getEntryId?: (e: T) => string | number;
    getDescription: (e: T) => React.ReactNode;
    getAvatar?: (v: T) => React.ReactNode;
}

interface ICalendarProps<T> extends ICalendarEntryFormatters<T> {
    loading?: boolean;
    entryMap: DateGroupedEntryMap<T>;
    onYearChange?: (year: Moment) => void;
    onDaySelect?: (day: Moment) => void;
    onDaySelectOverride?: (day: Moment) => void;
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
    const { entries, open, title, onClose, getEntryId } = props;
    const getId = useCallback((e: T) => getEntryId ? getEntryId(e) : get(e, 'id'), [getEntryId]);
    return (
        <Dialog maxWidth='lg' {...{ onClose, open }}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <List>
                    {entries.map(entry => <DayDetailListItem<T> key={getId(entry)} entry={entry} {...props } />)}
                </List>
            </DialogContent>
        </Dialog>
    );
}

export default function Calendar<T>(props: ICalendarProps<T>) {
    const { entryMap, onYearChange } = props;
    const onDaySelectProps = useMemo(() => {
        return { onDaySelect: props.onDaySelect, onDaySelectOverride: props.onDaySelectOverride };
    }, [props.onDaySelect, props.onDaySelectOverride]);
    const initialValue = useMemo(() => moment(new Date()), []);

    const [open, setOpen] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('');
    const onModalClose = useCallback(() => setOpen(false), []);
    const [selectedDay, setSelectedDay] = useState<Moment>(initialValue);

    const modalProps = useMemo<IDayEntriesModalProps<T>>(() => {
        const entries = entryMap.getEntriesForDate(selectedDay);
        return { entries, onClose: onModalClose, open, title, ...props };
    }, [open, title, props, onModalClose, selectedDay, entryMap]);


    const onDaySelect = useCallback((day: Moment) => {
        setSelectedDay(day);
        const { onDaySelectOverride, onDaySelect } = onDaySelectProps;
        if (onDaySelectOverride) return onDaySelectOverride(day);
        else if (onDaySelect) return onDaySelect(day);

        setTitle(getDayID(day));
        setOpen(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [entryMap, onDaySelectProps]);


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
                        const pickerDayProps = { ...props, isFirstVisibleCell, isLastVisibleCell, onDaySelect };
                        const count = entryMap.getEntriesForDate(day).length;

                        if (!count) return <PickersDay {...pickerDayProps} />;

                        return (
                            <Badge key={getDayID(day)} overlap="circular" variant='dot' color="primary">
                                <Tooltip placement='right-end' title={`${count} events`}>
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