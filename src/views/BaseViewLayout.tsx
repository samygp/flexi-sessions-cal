import { Grid, Alert } from "@mui/material";
import { PropsWithChildren, useEffect, useState, ReactNode } from "react";
import RoundedCard from "@/components/DataDisplay/RoundedCard";

interface IBaseVewLayoutProps extends PropsWithChildren {
    error?: Error;
    leftContent?: ReactNode;
}


export default function BaseViewLayout({ error, leftContent, children }: IBaseVewLayoutProps) {
    const [errorMessage, setErrorMessage] = useState<string>("");
    useEffect(() => setErrorMessage(error?.message ?? ""), [error]);

    return (
        <Grid container spacing={2} padding={2.5}>
            <Grid item xs={3}>
                <RoundedCard>
                    {leftContent}
                </RoundedCard>
            </Grid>
            <Grid item xs={9}>
                <RoundedCard>
                    {children}
                </RoundedCard>
            </Grid>

            {errorMessage && <Alert severity="error" onClose={() => setErrorMessage("")}>{errorMessage}</Alert>}
        </Grid>
    );
}