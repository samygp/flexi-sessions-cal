import { createContext } from "react";
import { AuthState, IOAuthTokens } from "./Auth";

interface ISessionContext {
    setTokens: (t: IOAuthTokens) => void;
    session?: string;
    setSession: (v: string) => void;
    sessionExp?: number;
    clearSession: () => void;
    authState: AuthState;
    logout: () => void;
    refreshSession: () => void;
}

export default createContext<ISessionContext>({
    setTokens: (_t: IOAuthTokens) => {},
    setSession: (_v: string) => {},
    authState: "unauthenticated",
    clearSession: () => {},
    logout: () => {},
    refreshSession: () => {},
});