import { Tooltip, IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { useCallback } from "react";

interface IEditButtonProps {
    setEditValue: (value: React.SetStateAction<boolean>) => void;
    disabled?: boolean;
}

export default function EditButton({ setEditValue, disabled }: IEditButtonProps) {
    const toggleEdit = useCallback(() => setEditValue(true), [setEditValue]);
    return (
        <Tooltip title="Edit ">
            <IconButton color="primary" disabled={disabled} onClick={toggleEdit}>
                <EditIcon />
            </IconButton>
        </Tooltip>
    );
}