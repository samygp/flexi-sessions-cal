import { useCallback, useContext, useMemo, useState } from "react";
import SessionContext from "../models/SessionContext";
import { useInterval } from "react-use";
import RefreshDialog from './login/RefreshDialog';
import { AppBar, Button, Toolbar, Typography } from "@mui/material";

const BASE_INTERVAL = 5000;

export default function Header() {
    const { authState, sessionExp, logout, refreshSession } = useContext(SessionContext);
    const [remainingTime, setRemainingTime] = useState<number>();
    const refreshCheckInterval = useMemo(() => authState === "authenticated" ? BASE_INTERVAL: null, [authState]);
    const shouldRefresh = useMemo<boolean>(() => {
        if(authState !== "authenticated" || remainingTime === undefined) return false;
        return remainingTime < 20;
    }, [authState, remainingTime]);

    useInterval(() => {
        const diff = (sessionExp ?? 0) - Math.floor(Date.now() / 1000);
        setRemainingTime(Math.max(0, diff));
        if (diff < 0) return logout();
    }, refreshCheckInterval);

    const onLogoutClick = useCallback((e: any) => {
        e.preventDefault();
        if(window.confirm("logout?")) logout();
    }, [logout]);

    return (
        <AppBar position="static" color="transparent" >
            <RefreshDialog open={shouldRefresh} onConfirm={refreshSession} onCancel={logout} />
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Calendarios medicosos
                </Typography>
                {authState === "authenticated" && <Button variant="contained" onClick={onLogoutClick}>Logout</Button>}
            </Toolbar>
        </AppBar >
    );
}