import { Avatar, Tooltip, Typography } from "@mui/material";
import { CalendarEvent, EventColorMap, EventTypeLabels } from "../../../shared/models/CalendarEvents";
import { useMemo } from "react";

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