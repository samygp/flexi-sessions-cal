import { PropsWithChildren, useCallback, useMemo, useState } from "react";
import { useAsync, useSessionStorage } from "react-use";
import AuthService from "@services/auth/AuthService";
import { IOAuthTokens, AuthState } from "@shared/models/Auth";
import SessionContext from "@shared/models/context/SessionContext";
import { SupportedLocale } from "@shared/locale";

const getDefaultLocale = (): SupportedLocale => {
    const navLocale = navigator.language.slice(0, 2);
    if (navLocale in SupportedLocale) return navLocale as SupportedLocale;
    return SupportedLocale.EN;
}

export default function SessionContextProvider({ children }: PropsWithChildren) {
    const [accessToken, setAccessToken] = useSessionStorage<string>('accessToken', '');
    const [, setIdToken] = useSessionStorage<string>('idToken', '');
    const [refreshToken, setRefreshToken] = useSessionStorage<string>('refreshToken', '');
    const [session, setSession] = useSessionStorage<string>('session', '');
    const [locale, setLocale] = useState<SupportedLocale>(getDefaultLocale());

    const setTokens = useCallback(({ accessToken, idToken, refreshToken }: IOAuthTokens) => {
        if (accessToken) setAccessToken(accessToken);
        if (idToken) setIdToken(idToken);
        if (refreshToken) setRefreshToken(refreshToken);
    }, [setAccessToken, setIdToken, setRefreshToken]);

    const clearSession = useCallback(() => { 
        setAccessToken('');
        setIdToken('');
        setRefreshToken('');
        setSession('');
    }, [setAccessToken, setIdToken, setRefreshToken, setSession]);

    const logout = useCallback(() => {
        clearSession();
    }, [clearSession]);
    
    const { loading: authLoading, value: sessionExp } = useAsync(async (): Promise<number|undefined> => {
        if (!accessToken) return 0;
        try {
            const payload = await AuthService.verify(accessToken);
            // console.log("Access Token is valid. Payload:", payload);
            return payload.exp;
        } catch (ex){
            console.log("Token not valid!");
            logout();
            console.error(ex);
        }
    }, [accessToken]);

    const refreshSession = useCallback(() => {
        if(!refreshToken) return;
        alert('syke, refresh not implemented yet');
    }, [refreshToken]);

    const authState = useMemo<AuthState>(() => {
        if(authLoading) return "loading";
        else if(!sessionExp) return "unauthenticated";
        return "authenticated";
    }, [sessionExp, authLoading]);

    const isAuthenticated = useMemo(() => authState === "authenticated", [authState]);

    return (
        <SessionContext.Provider value={{
            authState,
            accessToken,
            sessionExp,
            isAuthenticated,
            setTokens,
            session,
            setSession,
            clearSession,
            logout,
            refreshSession,
            locale,
            setLocale,
        }}>
            {children}
        </SessionContext.Provider>
    );
}