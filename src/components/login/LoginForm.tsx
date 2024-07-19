import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { startCase } from "lodash";
import { Box, TextField, Button, TextFieldProps, Alert, Snackbar, AlertColor } from "@mui/material";
import useLoginActions from "../../hooks/useLoginActions";
import SessionContext from "../../models/SessionContext";
import { useInterval } from "react-use";
import { Email } from "@mui/icons-material";

type TextInputEvent = React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>;

function LoginTextField({ name, ...rest }: TextFieldProps) {
    const id = name!;
    const autoComplete = rest.autoComplete ?? name;
    const label = rest.label ?? startCase(name!);
    const props: TextFieldProps = { name, id, autoComplete, label };
    return <TextField margin="normal" required fullWidth {...rest} {...props} />
}

interface IVerifCodeButtonProps {
    email: string;
    sendResetPasswordCode: () => Promise<boolean>;
    setEventMessage: React.Dispatch<React.SetStateAction<IEventSnackProps>>;
};

function VerifCodeButton({ email, sendResetPasswordCode, setEventMessage }: IVerifCodeButtonProps) {
    const [coolDownCountDown, setCoolDownCountDown] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const coolDownTicking = useMemo(() => coolDownCountDown > 0 ? 1000 : null, [coolDownCountDown]);
    const isDisabled = useMemo(() => !email || isSubmitting || !!coolDownTicking, [email, isSubmitting, coolDownTicking]);

    useInterval(() => setCoolDownCountDown(prev => prev - 1), coolDownTicking);

    const onClick = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setIsSubmitting(true);
        sendResetPasswordCode()
            .then((_v: boolean) => setCoolDownCountDown(15))
            .then(() => setEventMessage({message: "A new verification code has been sent, please check your email.", severity: "info"}))
            .catch(console.error)
            .finally(() => setIsSubmitting(false));
    }, [sendResetPasswordCode, setEventMessage]);

    return (
        <Button startIcon={<Email />} variant="outlined" color="secondary" size="small" sx={{ textTransform: 'none', float: "right" }} disabled={isDisabled} onClick={onClick}>
            {coolDownTicking ? `Code sent (${coolDownCountDown})` : 'Get new verification code'}
        </Button>
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
            <Alert {...{onClose, severity}} variant="filled" sx={{ width: '100%' }}>
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
    const [eventMessage, setEventMessage] = useState<IEventSnackProps>({message: '', severity: "success"});
    const { clearSession } = useContext(SessionContext);

    const onEmailChange = useCallback((evt: TextInputEvent) => setEmail(evt.target.value), []);
    const onPasswordChange = useCallback((evt: TextInputEvent) => setPassword(evt.target.value), []);
    const onVerifCodeChange = useCallback((evt: TextInputEvent) => setVerificationCode(evt.target.value), []);

    const { canSubmit, challengeRequired, resettingPassword, ...loginActions } = useLoginActions({ email, password, setPassword, verificationCode, setVerificationCode });

    const emailDisabled = useMemo(() => isSubmitting || !!challengeRequired, [isSubmitting, challengeRequired]);
    const passwordMessage = useMemo<string | undefined>(() => {
        if (challengeRequired) return 'Please enter a new password to replace your default-provided one.';
        else if (resettingPassword) return 'Please enter your new password and the verification code sent to your email.';
        return;
    }, [challengeRequired, resettingPassword]);

    const handleSubmit = useCallback(async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            if (resettingPassword) {
                await loginActions.handleConfirmPasswordReset()
                    .then(() => setEventMessage({message: "Password has been updated, you can now try to sign in again.", severity: "success"}));
            } else if (challengeRequired) {
                await loginActions.handleConfirmPasswordChallenge(challengeRequired)
                    .then(() => setEventMessage({message: "Password confirmed.", severity: "success"}));
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

    return (
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>

            <EventSnackbar {...eventMessage} />
            <LoginTextField label="Email" type="email" disabled={emailDisabled} name="username" value={email} onChange={onEmailChange} autoFocus />

            {!!passwordMessage && <Alert severity="info">{passwordMessage}</Alert>}
            <LoginTextField name="password" type="password" value={password} onChange={onPasswordChange} autoComplete="current-password" />

            {resettingPassword && (
                <>
                    <LoginTextField name="verification_code" value={verificationCode} onChange={onVerifCodeChange} />
                    {!!email && <VerifCodeButton {...{email, setEventMessage}} sendResetPasswordCode={loginActions.sendResetPasswordCode} />}
                </>
            )}

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={!canSubmit}>
                {!passwordMessage ? 'Log In' : 'Update Password'}
            </Button>

            <Button variant="text" sx={{ float: "right", textTransform: 'none' }} onClick={onForgotPasswordClick}>
                {resettingPassword ? 'jk, I remembered my password' : 'forgot password?'}
            </Button>
        </Box>
    );
}
