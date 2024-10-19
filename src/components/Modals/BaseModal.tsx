import { Button, ButtonGroup, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { PropsWithChildren, useMemo } from "react";

export interface IBaseModalProps extends PropsWithChildren {
    open: boolean;
    onClose: () => void;
    onSubmit?: () => Promise<any>;
    submitButtonStyle?: "primary" | "secondary" | "error" | "warning" | "info" | "success";
    submitButtonText?: string;
    submitDisabled?: boolean;
    title: string;
}

export default function BaseModal({ open, onClose, onSubmit, children, ...props }: IBaseModalProps) {
    const { submitButtonStyle, submitButtonText, submitDisabled, title } = props;

    const { submitText, closeText } = useMemo(() => {
        const submitText = onSubmit ? (submitButtonText || "Submit") : undefined;
        const closeText = onSubmit ? "Cancel" : "Close";
        return { submitText, closeText };
    }, [submitButtonText, onSubmit]);

    const submitProps = useMemo(() => {
        if (!onSubmit) return {};
        return {
            color: submitButtonStyle,
            onClick: onSubmit,
            disabled: submitDisabled,
        }
    }, [onSubmit, submitButtonStyle, submitDisabled]);

    return (
        <Dialog maxWidth='lg' open={open}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent dividers>
                {children}
                <ButtonGroup variant="contained" size="large" fullWidth>
                    {onSubmit && <Button {...submitProps} >{submitText}</Button>}
                    <Button onClick={onClose} variant="outlined">{closeText}</Button>
                </ButtonGroup>
            </DialogContent>
        </Dialog>
    )
}
