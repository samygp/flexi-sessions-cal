import { BadgeOwnProps } from '@mui/material';
import { createContext, useContext } from 'react';
import { EventType } from '../models/CalendarEvents';

interface ICalendarContext {
    color: BadgeOwnProps["color"],
    eventType: EventType,
};

const defaultCtx: ICalendarContext = {
    color: 'primary',
    eventType: EventType.Session,
};

export const CalendarContext = createContext(defaultCtx);

export const useCalendarContext = () => {
    const ctx = useContext(CalendarContext);
    return ctx;
}