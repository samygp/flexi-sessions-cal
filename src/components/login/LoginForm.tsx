import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { startCase } from "lodash";
import { Box, TextField, Button, TextFieldProps, Alert, Snackbar, AlertColor } from "@mui/material";
import useLoginActions from "../../hooks/useLoginActions"

import { useInterval } from "react-use";
import { Email } from "@mui/icons-material";
import SessionContext from "../../shared/models/SessionContext";
import { isValidEmail } from "../../shared/utils/stringHelpers";

type TextInputEvent = React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>;

function LoginTextField({ name, ...rest }: TextFieldProps) {
    const id = name!;
    const autoComplete = rest.autoComplete ?? name;
    const label = rest.label ?? startCase(name!);
    const props: TextFieldProps = { name, id, autoComplete, label };
    return <TextField margin="normal" required fullWidth {...rest} {...props} />
}

interface IVerifCodeProps {
    disabled?: boolean;
    sendResetPasswordCode: () => Promise<boolean>;
    setEventMessage: React.Dispatch<React.SetStateAction<IEventSnackProps>>;
    verificationCode: string;
    setVerificationCode: React.Dispatch<React.SetStateAction<string>>;
};

function VerifCodeButton({ disabled, sendResetPasswordCode, setEventMessage }: IVerifCodeProps) {
    const [coolDownCountDown, setCoolDownCountDown] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const coolDownTicking = useMemo(() => coolDownCountDown > 0 ? 1000 : null, [coolDownCountDown]);
    const isDisabled = useMemo(() => disabled || isSubmitting || !!coolDownTicking, [disabled, isSubmitting, coolDownTicking]);

    useInterval(() => setCoolDownCountDown(prev => prev - 1), coolDownTicking);

    const onClick = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setIsSubmitting(true);
        sendResetPasswordCode()
            .then(() => setCoolDownCountDown(15))
            .then(() => setEventMessage({ message: "A new verification code has been sent, please check your email.", severity: "info" }))
            .catch(console.error)
            .finally(() => setIsSubmitting(false));
    }, [sendResetPasswordCode, setEventMessage]);


    const buttonText = useMemo(() => {
        return (coolDownCountDown > 0) ? `Code sent (${coolDownCountDown})` : 'Send verification code to email';
    }, [coolDownCountDown]);

    return (
        <Button
            startIcon={<Email />}
            variant="outlined"
            color="secondary"
            sx={{ marginY: 1, textTransform: "initial" }}
            fullWidth
            disabled={isDisabled}
            onClick={onClick}>
            {buttonText}
        </Button>
    );
}

function VerifyCodeInput(props: IVerifCodeProps) {
    const { verificationCode, setVerificationCode } = props;
    const onVerifCodeChange = useCallback((e: TextInputEvent) => setVerificationCode(e.target.value), [setVerificationCode]);
    const [codeSent, setCodeSent] = useState<boolean>(false);
    const sendVerificationCode = useCallback(async () => {
        return props.sendResetPasswordCode().then(r => {
            setCodeSent(true);
            return r;
        });
    }, [setCodeSent, props]);

    return (
        <>
            <VerifCodeButton  {...props} sendResetPasswordCode={sendVerificationCode} />
            <>
                {codeSent && <Alert severity="info">Please enter the verification code sent to your email.</Alert>}
                <LoginTextField name="verification_code" value={verificationCode} disabled={!codeSent} onChange={onVerifCodeChange} />
            </>
        </>
    );
}

interface IEventSnackProps { message: string, severity: AlertColor };
function EventSnackbar({ message, severity }: IEventSnackProps) {
    const [open, setOpen] = useState<boolean>(true);
    const onClose = useCallback((_e: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    }, []);
    useEffect(() => setOpen(!!message), [message]);

    return (
        <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} autoHideDuration={7000} {...{ open, onClose }} >
            <Alert {...{ onClose, severity }} variant="filled" sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
}

export default function LoginForm() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [verificationCode, setVerificationCode] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [eventMessage, setEventMessage] = useState<IEventSnackProps>({ message: '', severity: "success" });
    const { clearSession } = useContext(SessionContext);

    const emailIsValid = useMemo(() => isValidEmail(email), [email]);

    const onEmailChange = useCallback((evt: TextInputEvent) => setEmail(evt.target.value), []);
    const onPasswordChange = useCallback((evt: TextInputEvent) => setPassword(evt.target.value), []);


    const { canSubmit, challengeRequired, resettingPassword, ...loginActions } = useLoginActions({ email, password, setPassword, verificationCode, setVerificationCode });

    const emailDisabled = useMemo(() => isSubmitting || !!challengeRequired, [isSubmitting, challengeRequired]);
    const passwordMessage = useMemo<string | undefined>(() => {
        if (challengeRequired) return 'Please enter a new password to replace your default-provided one.';
        else if (resettingPassword) return '';
        return;
    }, [challengeRequired, resettingPassword]);

    const handleSubmit = useCallback(async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            if (resettingPassword) {
                await loginActions.handleConfirmPasswordReset()
                    .then(() => setEventMessage({ message: "Password has been updated, you can now try to sign in again.", severity: "success" }));
            } else if (challengeRequired) {
                await loginActions.handleConfirmPasswordChallenge(challengeRequired)
                    .then(() => setEventMessage({ message: "Password confirmed.", severity: "success" }));
            } else {
                await loginActions.handleSignIn();
            }
        } catch (error) {
            console.error(error);
            clearSession();
        } finally {
            setIsSubmitting(false);
        }
    }, [loginActions, resettingPassword, challengeRequired, clearSession]);

    const onForgotPasswordClick = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        loginActions.toggleResettingPassword();
    }, [loginActions]);

    const verifyCodeProps = useMemo(() => {
        const { sendResetPasswordCode } = loginActions;
        const disabled = isSubmitting;
        return { setEventMessage, sendResetPasswordCode, email, disabled, verificationCode, setVerificationCode };
    }, [setEventMessage, loginActions, email, isSubmitting, verificationCode, setVerificationCode]);

    return (
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>

            <EventSnackbar {...eventMessage} />
            <LoginTextField label="Email" type="email" disabled={emailDisabled} name="username" value={email} onChange={onEmailChange} autoFocus />

            {resettingPassword && (emailIsValid
                ? <VerifyCodeInput {...verifyCodeProps} />
                : <Alert severity="info">Please enter email address.</Alert>
            )}


            <LoginTextField name="password" type="password" disabled={isSubmitting || !emailIsValid} value={password} onChange={onPasswordChange} autoComplete="current-password" />

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={!canSubmit}>
                {!passwordMessage ? 'Log In' : 'Update Password'}
            </Button>

            <Button variant="text" sx={{ float: "right", textTransform: 'none' }} onClick={onForgotPasswordClick}>
                {resettingPassword ? 'jk, I remembered my password' : 'forgot password?'}
            </Button>
        </Box>
    );
}
