import { Avatar, Typography } from "@mui/material";
import { ErreLevel, MonkehLevelColor } from "@shared/models/Monkeh";
import { useMemo } from "react";

export default function MonkehTag({ level, compact }: { level: ErreLevel, compact?: boolean }) {
    const size = useMemo(() => {
        return compact ? {height: "1.1em", width: "1.1em", marginX: "0.5ex"}: {height: "3.4ex", width: "3.4ex"};
    }, [compact]);
    return (
        <Avatar sx={{ bgcolor: MonkehLevelColor[level], ...size }} variant='rounded'>
            <Typography variant={compact ? "body2" : "h6"}>R{level}</Typography>
        </Avatar>
    );
}