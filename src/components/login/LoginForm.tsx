import React, { useContext } from "react";
import { capitalize } from "lodash";
import { Box, TextField, Button, TextFieldProps, Alert } from "@mui/material";
import SessionContext from "../../models/SessionContext";
import AuthService from "../../services/AuthService";

function LoginTextField({name, ...rest}: TextFieldProps){
    const id = name!;
    const autoComplete = rest.autoComplete ?? name;
    const label = rest.label ?? capitalize(name!);
    const props: TextFieldProps = {name, id, autoComplete, label};
    return <TextField  margin="normal" required fullWidth {...rest} {...props} />
}

export default function LoginForm() {
    const sessCtx = useContext(SessionContext);
    const [email, setEmail] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const challengeRequired = React.useRef<string>();

    const onEmailChange = React.useCallback((evt: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setEmail(evt.target.value);
    }, []);
    const onPasswordChange = React.useCallback((evt: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setPassword(evt.target.value);
    }, []);

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            const challengeType = challengeRequired.current;
            const {requiresChallenge, session, tokens} = await (!challengeType
                ? AuthService.signIn(email, password)
                : AuthService.respondToChallenge({
                    challengeType,
                    values: {
                        userName: email,
                        newPassword: password,
                        session: sessCtx.session,
                    },
                })
            );

            challengeRequired.current = requiresChallenge;
            if (session) sessCtx.setSession(session);
            if (tokens) sessCtx.setTokens(tokens);
            // Clear password if password reset challenge is required
            if(requiresChallenge) setPassword('');
        } catch (error) {
            alert(`Sign in failed: ${error}`);
            sessCtx.clearSession();
        }
    };

    return (
    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <LoginTextField label="Email" disabled={!!challengeRequired.current} name="username" value={email} onChange={onEmailChange} autoFocus />
        {!!challengeRequired.current && <Alert severity="info">Please enter a new password to replace your default-provided one.</Alert>}
        <LoginTextField name="password" type="password" value={password} onChange={onPasswordChange} autoComplete="current-password" />
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            {!challengeRequired.current ? 'Log In' : 'Update Password'}
        </Button>
    </Box>
    );
}
