import { ChipOwnProps, Chip, Typography } from "@mui/material";

interface ICategoryDividerChipProps extends ChipOwnProps {
    text: string;
}

export default function CategoryChip({ text, ...props }: ICategoryDividerChipProps){
    return <Chip {...props} label={<Typography variant="h6" margin={"1ex"}>{text}</Typography>} />;
}