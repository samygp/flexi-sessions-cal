import { Avatar, Tooltip, Typography } from "@mui/material";
import { useMemo } from "react";
import { CalendarEvent, EventTypeLabels, EventColorMap } from "../../../shared/models/CalendarEvents";

export default function EventTypeTag({eventType}: CalendarEvent) {
    const title = useMemo(() => EventTypeLabels[eventType], [eventType]);
    return (
        <Avatar sx={{bgcolor: EventColorMap[eventType]}} variant='rounded'>
            <Tooltip title={title}>
                <Typography variant="h6">{title[0]}</Typography>
            </Tooltip>
        </Avatar>
    );
}