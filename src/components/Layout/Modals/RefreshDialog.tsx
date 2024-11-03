import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Slide } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import React, { useMemo, useState } from "react";
import { useInterval } from "react-use";
import { useSessionContext } from "@hooks/useCustomContext";

const BASE_INTERVAL = 5000;

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

export default function RefreshDialog() {
    const { isAuthenticated, sessionExp, logout, refreshSession } = useSessionContext();

    const [remainingTime, setRemainingTime] = useState<number>();
    const shouldRefresh = useMemo<boolean>(() => {
        if(!isAuthenticated || remainingTime === undefined) return false;
        return remainingTime < 20;
    }, [isAuthenticated, remainingTime]);
    
    const refreshCheckInterval = useMemo(() => isAuthenticated ? BASE_INTERVAL: null, [isAuthenticated]);
    useInterval(() => {
        const diff = (sessionExp ?? 0) - Math.floor(Date.now() / 1000);
        setRemainingTime(Math.max(0, diff));
        if (diff < 0) return logout();
    }, refreshCheckInterval);

    return (
        <Dialog
            open={shouldRefresh}
            TransitionComponent={Transition}
            keepMounted
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>Your session is about to expire</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    Do you want to keep your session alive?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={logout}>No, logout</Button>
                <Button onClick={refreshSession}>Yes, refresh</Button>
            </DialogActions>
        </Dialog>
    );
}