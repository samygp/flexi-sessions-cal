import { Grid, Typography, Alert } from "@mui/material";
import { PropsWithChildren, useEffect, useState, ReactNode } from "react";

interface IBaseVewLayoutProps extends PropsWithChildren {
    title: string;
    error?: Error;
    leftContent?: ReactNode;
}


export default function BaseViewLayout({ title, error, leftContent, children }: IBaseVewLayoutProps) {
    const [errorMessage, setErrorMessage] = useState<string>("");
    useEffect(() => setErrorMessage(error?.message ?? ""), [error]);

    return (
        <Grid container spacing={2} padding={'3vh'}>
            <Grid item xs={12}>
                <Typography variant="h1" gutterBottom>
                    {title}
                </Typography>
            </Grid>
            <Grid item xs={3} >
                {leftContent}
            </Grid>
            <Grid item xs={9}>
                {children}
            </Grid>

            {errorMessage && <Alert severity="error" onClose={() => setErrorMessage("")}>{errorMessage}</Alert>}
        </Grid>
    );
}