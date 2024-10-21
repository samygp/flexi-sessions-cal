import { Avatar, Typography } from "@mui/material";
import { IMonkeh, MonkehLevelColor } from "../../../shared/models/Monkeh";

export default function MonkehTag({ level }: IMonkeh) {
    return (
        <Avatar sx={{ bgcolor: MonkehLevelColor[level] }} variant='rounded'>
            <Typography variant="h6">R{level}</Typography>
        </Avatar>
    );
}