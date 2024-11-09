import { useState, useCallback, useMemo } from "react";
import AuthService from "../services/auth/AuthService";
import { IAuthResponse } from "@/shared/models/Auth";
import { useSessionContext } from "./useCustomContext";

interface ILoginActionParams {
    email: string;
    password: string;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
    verificationCode: string;
    setVerificationCode: React.Dispatch<React.SetStateAction<string>>;
}

export default function useLoginActions(params: ILoginActionParams) {
    const { session, setSession, setTokens, authState } = useSessionContext();
    const { email, password, setPassword, verificationCode, setVerificationCode } = params;
    const [challengeRequired, setChallengeRequired] = useState<string>();
    const [resettingPassword, setResettingPassword] = useState<boolean>(false);

    const canSubmit = useMemo(() => {
        if(authState === "loading") return false;
        if(!email || !password) return false;
        if(resettingPassword && !verificationCode) return false;
        return true;
    }, [authState, password, email, resettingPassword, verificationCode]);
    
    const toggleResettingPassword = useCallback(() => {
        setPassword('');
        setVerificationCode('');
        setChallengeRequired(undefined);
        setResettingPassword(prev => !prev);
    }, [setPassword, setVerificationCode, setChallengeRequired, setResettingPassword]);    

    const handleTokenResponse = useCallback(({ requiresChallenge, session, tokens }: IAuthResponse) => {
        setChallengeRequired(requiresChallenge);
        if (session) setSession(session);
        if (tokens) setTokens(tokens);
        // Clear password if password reset challenge is required
        if (requiresChallenge) setPassword('');
    }, [setChallengeRequired, setSession, setTokens, setPassword]);

    const handleSignIn = useCallback(async () => AuthService.signIn(email, password).then(handleTokenResponse), [email, password, handleTokenResponse]);

    const handleConfirmPasswordChallenge = useCallback(async (challengeType: string) => {
        return AuthService.respondToChallenge({
            challengeType,
            values: {
                userName: email,
                newPassword: password,
                session,
            },
        }).then(handleTokenResponse);
    }, [email, password, session, handleTokenResponse]);

    const sendResetPasswordCode = useCallback(async () => AuthService.forgotPassword(email), [email]);

    const handleConfirmPasswordReset = useCallback(async () => {
        await AuthService.updateForgottenPassword(email, password, verificationCode);
        toggleResettingPassword();
    }, [email, password, verificationCode, toggleResettingPassword]);

    return {canSubmit, challengeRequired, resettingPassword, toggleResettingPassword, handleSignIn, handleConfirmPasswordChallenge, handleConfirmPasswordReset, sendResetPasswordCode };
}