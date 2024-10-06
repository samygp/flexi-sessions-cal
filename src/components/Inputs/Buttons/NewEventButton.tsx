import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { CalendarEvent } from "../../../shared/models/CalendarEvents";
import { useCallback, useState } from "react";
import CalendarEventForm from "../Forms/CalendarEventForm";

interface INewEventButtonProps {
    disabled?: boolean;
    onSubmit: (e: CalendarEvent) => Promise<any>;
}

export default function NewEventButton({ disabled, onSubmit }: INewEventButtonProps) {
    const [open, setOpen] = useState(false);

    // eslint-disable-next-line
    const onClose = useCallback(() => setOpen(false), []);
    // eslint-disable-next-line
    const onClick = useCallback(() => setOpen(true), []);

    const onSave = useCallback(async (e: CalendarEvent) => await onSubmit(e).then(onClose), [onSubmit, onClose]);
    return (
        <>
            <Dialog maxWidth='lg'  {...{ onClose, open }}>
                <DialogTitle>New Event</DialogTitle>
                <DialogContent dividers>
                    <CalendarEventForm readOnly={disabled} onSave={onSave} onCancel={onClose} />
                </DialogContent>
            </Dialog>
            <Button variant="contained" color="primary" {...{ disabled, onClick }}>
                New Event
            </Button>
        </>
    )
}