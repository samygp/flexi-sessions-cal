import React, { useContext } from "react";
import { capitalize } from "lodash";
import { signIn } from "../../services/authService";
import { Box, TextField, Button, TextFieldProps } from "@mui/material";
import SessionContext from "../../models/SessionContext";


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
    const onEmailChange = React.useCallback((evt: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setEmail(evt.target.value);
    }, []);
    const onPasswordChange = React.useCallback((evt: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setPassword(evt.target.value);
    }, []);

    const handleSignIn = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            const session = await signIn(email, password);
            console.log('Sign in successful', session);
            if (session) {
                sessCtx.setAccessToken(session.AccessToken ?? '');
                sessCtx.setIdToken(session.IdToken ?? '');
                sessCtx.setRefreshToken(session.RefreshToken ?? '');
            }
        } catch (error) {
            alert(`Sign in failed: ${error}`);
            sessCtx.clearSession();
        }
    };

    return (
    <Box component="form" noValidate onSubmit={handleSignIn} sx={{ mt: 1 }}>
        <LoginTextField label="Email" name="username" value={email} onChange={onEmailChange} autoFocus />
        <LoginTextField  name="password" type="password" value={password} onChange={onPasswordChange} autoComplete="current-password" />
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Log In
        </Button>
    </Box>
    );
}
