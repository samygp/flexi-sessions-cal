import { Grid, Alert } from "@mui/material";
import { PropsWithChildren, useEffect, useState, ReactNode } from "react";
import RoundedCard from "@/components/DataDisplay/RoundedCard";
import { useHeaderContext } from "@/hooks/useCustomContext";

interface IBaseVewLayoutProps extends PropsWithChildren {
    error?: Error;
    leftContent?: ReactNode;
    headerTitle?: string;
}


export default function BaseViewLayout({ error, leftContent, children, headerTitle }: IBaseVewLayoutProps) {
    const { setTitle } = useHeaderContext();
    useEffect(() => {
        setTitle(headerTitle ?? '');
    }, [setTitle, headerTitle]);
    const [errorMessage, setErrorMessage] = useState<string>("");
    useEffect(() => setErrorMessage(error?.message ?? ""), [error]);

    return (
        <Grid container spacing={2} padding={2.5}>
            {!!leftContent && <Grid item xs={3}>
                <RoundedCard>
                    {leftContent}
                </RoundedCard>
            </Grid>}
            <Grid item xs={!!leftContent ? 9 : 12}>
                <RoundedCard>
                    {children}
                </RoundedCard>
            </Grid>

            {errorMessage && <Alert severity="error" onClose={() => setErrorMessage("")}>{errorMessage}</Alert>}
        </Grid>
    );
}