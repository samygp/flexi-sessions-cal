import { BadgeOwnProps } from '@mui/material';
import { createContext } from 'react';

export interface ICalendarContext {
    color: BadgeOwnProps["color"],
}

export const CalendarContext = createContext({color: 'primary'});