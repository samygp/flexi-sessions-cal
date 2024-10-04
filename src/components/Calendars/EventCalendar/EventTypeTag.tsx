import { Avatar } from "@mui/material";
import { CalendarEvent, EventColorMap } from "../../../shared/models/CalendarEvents";

export default function EventTypeTag({eventType}: CalendarEvent) {
    return (
        <Avatar sx={{bgcolor: EventColorMap[eventType]}} variant='rounded'>
            {eventType}
        </Avatar>
    );
}