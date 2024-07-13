import React, { useContext, useState } from "react";
import { useInterval, useAsyncFn } from "react-use";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { clientId, userPoolId } from '../config.json';
import { isNil } from "lodash";
import { useNavigate } from "react-router-dom";
import SessionContext from "../models/SessionContext";

interface IAuthState {
    expiresAt?: number;
    isAuthenticated: boolean;
}
const verifier = CognitoJwtVerifier.create({ userPoolId, clientId, tokenUse: "access" });

export default function useAuthSession() {
    const {accessToken, clearSession} = useContext(SessionContext);
    const [shouldRefresh, setShouldRefresh] = useState<boolean>(false);
    const navigate = useNavigate();
    
    const [{ loading: authLoading, value: authState }, verifyAuth] = useAsyncFn(async (): Promise<IAuthState> => {
        const response: IAuthState = {isAuthenticated: false};
        if (!accessToken) return response;
        try {
            const payload = await verifier.verify(accessToken);
            console.log("Token is valid. Payload:", payload);
            response.isAuthenticated = true;
            response.expiresAt = payload.exp;
        } catch (ex){
            console.log("Token not valid!");
            clearSession();
            console.error(ex);
        }
        return response;
    }, [accessToken]);

    const refreshSession = React.useCallback(() => {
        // TODO
        // verifyAuth();
    }, [accessToken, verifyAuth]);

    const logout = React.useCallback(() => {
        clearSession();
        navigate('/');
    }, []);

    const refreshCheckInterval = React.useMemo<number|null>(() => {
        if(authLoading || isNil(authState) || !authState.isAuthenticated) return null;
        // every 10 sec
        return 10000;
    }, [authState, authLoading]);

    useInterval(() => {
        if(authLoading || isNil(authState) || !authState.isAuthenticated) return;
        
        const diff = authState.expiresAt! - Math.floor(Date.now() / 1000);

        console.log('Remaining session time:', diff);
        if(diff < 0) return logout();

        // set to refresh if < 2 min remaining
        setShouldRefresh(diff < 120);
    }, refreshCheckInterval);

    return {shouldRefresh, authLoading, refreshSession, logout, ...authState};
}