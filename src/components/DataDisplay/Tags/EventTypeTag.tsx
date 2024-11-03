import { Avatar, Tooltip, Typography } from "@mui/material";
import { useMemo } from "react";
import { CalendarEvent, EventTypeCategoryMap} from "@shared/models/CalendarEvents";
import { EventTypeLabels } from "@shared/locale/events";
import { EventCategoryColorMap } from "@shared/models/CalendarEvents";

// TODO use actual locale
export default function EventTypeTag({eventType}: CalendarEvent) {
    const title = useMemo(() => EventTypeLabels[eventType], [eventType]);
    const eventCategory = useMemo(() => EventTypeCategoryMap[eventType], [eventType]);
    const bgcolor = useMemo(() => EventCategoryColorMap[eventCategory], [eventCategory]);
    return (
        <Avatar sx={{bgcolor}} variant='rounded'>
            <Tooltip title={title.en}>
                <Typography variant="h6">{title.en[0]}</Typography>
            </Tooltip>
        </Avatar>
    );
}