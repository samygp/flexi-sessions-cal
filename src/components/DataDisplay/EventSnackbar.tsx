import { AlertColor, Snackbar, Alert } from "@mui/material";
import { useState, useCallback, useEffect } from "react";

export interface IEventSnackProps { message: string, severity: AlertColor };

export default function EventSnackbar({ message, severity }: IEventSnackProps) {
    const [open, setOpen] = useState<boolean>(true);
    
    const onClose = useCallback((_e: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    }, [setOpen]);

    useEffect(() => setOpen(!!message), [message]);

    return (
        <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} autoHideDuration={7000} {...{ open, onClose }} >
            <Alert {...{ onClose, severity }} variant="filled" sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
}