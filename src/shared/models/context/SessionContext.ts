import { createContext } from "react";
import { IOAuthTokens, AuthState } from "@shared/models/Auth";
import { SupportedLocale } from "@shared/locale";

interface ISessionContext {
    accessToken?: string,
    setTokens: (t: IOAuthTokens) => void;
    session?: string;
    setSession: (v: string) => void;
    sessionExp?: number;
    clearSession: () => void;
    authState: AuthState;
    isAuthenticated: boolean;
    logout: () => void;
    refreshSession: () => void;
    locale: SupportedLocale;
    setLocale: (l: SupportedLocale) => void;
}

export default createContext<ISessionContext>({
    setTokens: (_t: IOAuthTokens) => {},
    setSession: (_v: string) => {},
    authState: "unauthenticated",
    isAuthenticated: false,
    clearSession: () => {},
    logout: () => {},
    refreshSession: () => {},
    locale: SupportedLocale.EN,
    setLocale: (_l: SupportedLocale) => {}
});