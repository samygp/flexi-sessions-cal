import React, { PropsWithChildren, useCallback } from "react";
import SessionContext from "../../models/SessionContext";
import { useSessionStorage } from "react-use";
import { IOAuthTokens } from "../../models/Auth";


export default function SessionContextProvider({ children }: PropsWithChildren) {
    const [accessToken, setAccessToken] = useSessionStorage<string>('accessToken', '');
    const [idToken, setIdToken] = useSessionStorage<string>('idToken', '');
    const [refreshToken, setRefreshToken] = useSessionStorage<string>('refreshToken', '');
    const [session, setSession] = useSessionStorage<string>('session', '');

    const setTokens = React.useCallback(({ accessToken, idToken, refreshToken }: IOAuthTokens) => {
        if (accessToken) setAccessToken(accessToken);
        if (idToken) setIdToken(idToken);
        if (refreshToken) setRefreshToken(refreshToken);
    }, [setAccessToken, setIdToken, setRefreshToken]);

    const clearSession = useCallback(() => { sessionStorage.clear() }, []);

    return (
        <SessionContext.Provider value={{
            accessToken,
            setAccessToken,
            idToken,
            setIdToken,
            refreshToken,
            setRefreshToken,
            setTokens,
            session,
            setSession,
            clearSession,
        }}>
            {children}
        </SessionContext.Provider>
    );
}