import { BadgeOwnProps } from '@mui/material';

export enum EventType {
    Session = "session",
    TimeOff = "timeoff",
    OnCall = "oncall",
};

export const EventColorMap: Record<EventType, BadgeOwnProps["color"]> = Object.freeze({
    [EventType.Session]: "primary",
    [EventType.TimeOff]: "success",
    [EventType.OnCall]: "secondary",
});

export const EventTypeLabels: Record<EventType, string> = Object.freeze({
    [EventType.Session]: "Sesión",
    [EventType.TimeOff]: "Vacaciones",
    [EventType.OnCall]: "Guardia",
});