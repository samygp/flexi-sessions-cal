import React, { PropsWithChildren, useCallback } from "react";
import SessionContext from "../../models/SessionContext";
import { useSessionStorage } from "react-use";


export default function ({ children }: PropsWithChildren) {
    const [accessToken, setAccessToken] = useSessionStorage<string>('accessToken', '');
    const [idToken, setIdToken] = useSessionStorage<string>('idToken', '');
    const [refreshToken, setRefreshToken] = useSessionStorage<string>('refreshToken', '');
    const clearSession = useCallback(() => { sessionStorage.clear() }, []);
    return (
        <SessionContext.Provider value={{ accessToken, setAccessToken, idToken, setIdToken, refreshToken, setRefreshToken, clearSession }}>
            {children}
        </SessionContext.Provider>
    );
}