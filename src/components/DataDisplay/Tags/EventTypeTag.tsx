import { Avatar, Tooltip, Typography } from "@mui/material";
import { useMemo } from "react";
import { CalendarEvent, EventType, EventTypeCategoryMap} from "@shared/models/CalendarEvents";
import { EventTypeLabels } from "@shared/locale/events";
import { EventCategoryColorMap } from "@shared/models/CalendarEvents";
import { useLocale } from "@hooks/useLocale";

export default function EventTypeTag({eventType}: CalendarEvent) {
    const labels = useLocale<EventType>(EventTypeLabels);
    const title = useMemo(() => labels[eventType], [labels, eventType]);
    const eventCategory = useMemo(() => EventTypeCategoryMap[eventType], [eventType]);
    const bgcolor = useMemo(() => EventCategoryColorMap[eventCategory], [eventCategory]);

    console.log('eventType', eventType);
    console.log('labels', labels);
    console.log('title', title);

    return (
        <Avatar sx={{bgcolor}} variant='rounded'>
            <Tooltip title={title}>
                <Typography variant="h6">{title[0]}</Typography>
            </Tooltip>
        </Avatar>
    );
}