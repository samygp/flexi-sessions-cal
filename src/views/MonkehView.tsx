import MonkehList from "../components/DataDisplay/Lists/MonkehList";
import { defaultDummyMonkeh, IMonkeh } from "../shared/models/Monkeh";
import Face5Icon from '@mui/icons-material/Face5';
import { useCallback, useMemo, useState } from "react";
import BaseViewLayout from "./BaseViewLayout";
import { EditMonkehForm } from "../components/Inputs/Forms/MonkehForm";
import { Grid, IconButton, Tooltip } from "@mui/material";
import EventSnackbar, { IEventSnackProps } from "../components/DataDisplay/EventSnackbar";
import MonkehDetails from "../components/DataDisplay/Details/MonkehDetails";
import EditIcon from '@mui/icons-material/Edit';
import { useHeaderContext } from "../hooks/useCustomContext";

interface IMonkehViewContentProps {
    selectedMonkeh: IMonkeh;
    setSelectedMonkeh: React.Dispatch<React.SetStateAction<IMonkeh>>;
}

interface IEditMonkehButtonProps {
    toggleEditMonkeh: () => void;
    disabled?: boolean;
}
function EditMonkehButton({ toggleEditMonkeh, disabled }: IEditMonkehButtonProps) {
    return (
        <Tooltip title="Edit monkeh">
            <IconButton color="primary" disabled={disabled} onClick={toggleEditMonkeh}>
                <EditIcon />
            </IconButton>
        </Tooltip>
    );
}

function MonkehViewMainContent({ selectedMonkeh: monkeh, setSelectedMonkeh: setMonkeh }: IMonkehViewContentProps) {
    const [editMode, setEditMode] = useState<boolean>(false);
    const toggleEditMonkeh = useCallback(() => setEditMode(prev => !prev), [setEditMode]);

    const [eventMessage, setEventMessage] = useState<IEventSnackProps>({ message: '', severity: "success" });
    const editMonkehProps = useMemo(() => {
        return {
            monkeh,
            setMonkeh,
            onClose: () => setEditMode(false),
            onSuccess: () => setEventMessage({ message: 'Monkeh Updated!', severity: 'success' }),
            onError: (err: any) => setEventMessage({ message: `Failed to update monkeh: ${err}`, severity: 'error' }),
        };
    }, [monkeh, setMonkeh, setEventMessage]);

    const monkehDetailsProps = useMemo(() => {
        return { monkeh, setMonkeh, readOnly: !editMode, headerAction: <EditMonkehButton {...{ toggleEditMonkeh }} /> };
    }, [toggleEditMonkeh, monkeh, setMonkeh, editMode]);

    return (
        <Grid container>
            <EventSnackbar {...eventMessage} />
            <Grid item xs={12} >
                {editMode ? <EditMonkehForm {...editMonkehProps} /> : <MonkehDetails {...monkehDetailsProps} />}
            </Grid>
        </Grid>
    );
}

export default function MonkehView() {
    const [selectedMonkeh, setSelectedMonkeh] = useState<IMonkeh>(defaultDummyMonkeh);
    useHeaderContext().setTitle('Monkehs');

    return (
        <BaseViewLayout leftContent={<MonkehList onMonkehSelect={setSelectedMonkeh} />}>
            {!!selectedMonkeh.id
                ? <MonkehViewMainContent {...{ selectedMonkeh, setSelectedMonkeh }} />
                : <><Face5Icon />Where Monkeh? (select monkeh)</>}
        </BaseViewLayout>
    );
}