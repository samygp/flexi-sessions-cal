import { createContext } from "react";

interface ISessionContext {
    accessToken: string;
    setAccessToken: (v: string) => void;
    idToken: string;
    setIdToken: (v: string) => void;
    refreshToken: string;
    setRefreshToken: (v: string) => void;
    clearSession: () => void;
}

export default createContext<ISessionContext>({
    accessToken: '',
    setAccessToken: (_v: string) => {},
    idToken: '',
    setIdToken: (_v: string) => {},
    refreshToken: '',
    setRefreshToken: (_v: string) => {},
    clearSession: () => {},
});