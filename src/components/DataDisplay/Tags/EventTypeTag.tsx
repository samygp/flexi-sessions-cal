import { Chip, styled, Tooltip, Typography } from "@mui/material";
import { useMemo } from "react";
import { CalendarEvent, EventType, EventTypeCategoryMap} from "@shared/models/CalendarEvents";
import { EventTypeLabels } from "@shared/locale/events";
import { EventCategoryColorMap } from "@shared/models/CalendarEvents";
import { useLocale } from "@hooks/useLocale";

const ChipText = styled(Typography)(({ theme }) => ({
    cursor: "default",
    fontWeight: theme.typography.fontWeightBold
}))

export default function EventTypeTag({eventType}: CalendarEvent) {
    const labels = useLocale<EventType>(EventTypeLabels);
    const title = useMemo(() => labels[eventType], [labels, eventType]);
    const eventCategory = useMemo(() => EventTypeCategoryMap[eventType], [eventType]);
    const color = useMemo(() => EventCategoryColorMap[eventCategory], [eventCategory]);

    console.log('eventType', eventType);
    console.log('labels', labels);
    console.log('title', title);

    return (
        <Tooltip title={title}>
            <Chip label={<ChipText variant="h6">{title[0]}</ChipText>} color={color} />
        </Tooltip>
    );
}