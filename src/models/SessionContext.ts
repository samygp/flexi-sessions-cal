import { createContext } from "react";
import { IOAuthTokens } from "./Auth";

interface ISessionContext extends IOAuthTokens {
    setTokens: (t: IOAuthTokens) => void;
    setAccessToken: (v: string) => void;
    setIdToken: (v: string) => void;
    setRefreshToken: (v: string) => void;
    session: string;
    setSession: (v: string) => void;
    clearSession: () => void;
}

export default createContext<ISessionContext>({
    accessToken: '',
    setAccessToken: (_v: string) => {},
    idToken: '',
    setIdToken: (_v: string) => {},
    refreshToken: '',
    setRefreshToken: (_v: string) => {},
    setTokens: (_t: IOAuthTokens) => {},
    session: '',
    setSession: (_v: string) => {},
    clearSession: () => {},
});