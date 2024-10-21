import OpenModalButton from "../components/Inputs/Buttons/OpenModalButton";
import MonkehList from "../components/DataDisplay/Lists/MonkehList";
import MonkehModal, { IMonkehFormModalProps } from "../components/Layout/Modals/MonkehModal";
import { IMonkeh } from "../shared/models/Monkeh";
import Face5Icon from '@mui/icons-material/Face5';
import { useCallback, useState } from "react";
import BaseViewLayout from "./BaseViewLayout";
import MonkehForm from "../components/Inputs/Forms/MonkehForm";
import { Button, Grid } from "@mui/material";
import SubmitButtonGroup from "../components/Inputs/Buttons/SubmitButtonGroup";
import { useMonkehContext } from "../hooks/useCustomContext";
import EventSnackbar, { IEventSnackProps } from "../components/DataDisplay/EventSnackbar";

interface IMonkehViewContentProps {
    selectedMonkeh: IMonkeh | undefined;
    setSelectedMonkeh: React.Dispatch<React.SetStateAction<IMonkeh | undefined>>
}

function MonkehViewLeftContent({ selectedMonkeh, setSelectedMonkeh }: IMonkehViewContentProps) {
    return (
        <>
            <OpenModalButton<IMonkehFormModalProps>
                Modal={MonkehModal}
                label="New Monkeh"
                modalProps={{ operation: "create", title: "Add Monkeh" }}
            />
            <MonkehList onMonkehSelect={setSelectedMonkeh} />
        </>
    );
}

function MonkehViewMainContent({ selectedMonkeh, setSelectedMonkeh }: IMonkehViewContentProps) {
    const [editMode, setEditMode] = useState<boolean>(false);
    const { monkehAPI: { updateMonkeh }, loading } = useMonkehContext();

    const [eventMessage, setEventMessage] = useState<IEventSnackProps>({ message: '', severity: "success" });
    const onClose = useCallback(() => setEditMode(false), [setEditMode]);

    const onUpdate = useCallback(async () => {
        try {
            const monkehResult = await updateMonkeh(selectedMonkeh!);
            if (monkehResult) {
                setEventMessage({ message: 'Monkeh Updated!', severity: 'success' });
                onClose();
            }
        } catch (error) {
            setEventMessage({ message: `Failed to update monkeh: ${error}`, severity: 'error' });
        }
    }, [selectedMonkeh, updateMonkeh, onClose]);


    return (
        <Grid container>
            <EventSnackbar {...eventMessage} />
            <Grid item xs={9} />
            <Grid item xs={3} >
                <Button variant="contained" color="primary" disabled={editMode || loading} onClick={() => setEditMode(prev => !prev)}>
                    Edit Monkeh
                </Button>
            </Grid>
            <Grid item xs={12} >
                <MonkehForm monkeh={selectedMonkeh!} readOnly={!editMode} setMonkeh={setSelectedMonkeh as any} />
            </Grid>
            <Grid item xs={12} >
                {editMode && (<SubmitButtonGroup operation="update" submitButtonText="Save" {...{ onUpdate, loading, onClose }} />)}
            </Grid>
        </Grid>
    );
}

export default function MonkehView() {
    const [selectedMonkeh, setSelectedMonkeh] = useState<IMonkeh>();

    return (
        <BaseViewLayout title="Monkehs" leftContent={<MonkehViewLeftContent {...{ selectedMonkeh, setSelectedMonkeh }} />}>
            {selectedMonkeh
                ? <MonkehViewMainContent {...{ selectedMonkeh, setSelectedMonkeh }} />
                : <><Face5Icon />Where Monkeh? (select monkeh)</>}
        </BaseViewLayout>
    );
}