import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Slide } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import React from "react";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

interface IRefreshDialogProps {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}
export default function RefreshDialog(props: IRefreshDialogProps) {
    const {open, onCancel, onConfirm} = props;
    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={onCancel}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>Your session is about to expire</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    Do you want to keep your session alive?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>No, logout</Button>
                <Button onClick={onConfirm}>Yes, refresh</Button>
            </DialogActions>
        </Dialog>
    );
}