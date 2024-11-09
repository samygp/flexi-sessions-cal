import MonkehList from "@/components/DataDisplay/Lists/MonkehList";
import { defaultDummyMonkeh, IMonkeh } from "@/shared/models/Monkeh";
import Face5Icon from '@mui/icons-material/Face5';
import { useCallback, useEffect, useMemo, useState } from "react";
import BaseViewLayout from "@/views/BaseViewLayout";
import { EditMonkehForm } from "@/components/Inputs/Forms/MonkehForm";
import { Grid, IconButton, Tooltip } from "@mui/material";
import EventSnackbar, { IEventSnackProps } from "@/components/DataDisplay/EventSnackbar";
import MonkehDetails from "@/components/DataDisplay/Details/MonkehDetails";
import EditIcon from '@mui/icons-material/Edit';
import { useEventsContext, useHeaderContext } from "@/hooks/useCustomContext";
import { CalendarEvent } from "@/shared/models/CalendarEvents";
import EventTable from "@/components/DataDisplay/Tables/EventTable";
import { useLocale } from "@/hooks/useLocale";
import { HeaderLabels } from "@/shared/locale/appUI";
import { MonkehViewLabels } from "@/shared/locale/monkeh";

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

    const { calendarEventMap } = useEventsContext();
    const monkehEvents = useMemo<CalendarEvent[]>((() => {
        return Object.values(calendarEventMap).filter(e => e.monkehId === monkeh.id);
    }), [calendarEventMap, monkeh]);

    const [eventMessage, setEventMessage] = useState<IEventSnackProps>({ message: '', severity: "success" });
    const editMonkehProps = useMemo(() => {
        return {
            monkeh,
            setMonkeh,
            onClose: () => setEditMode(false),
            onSuccess: () => setEventMessage({ message: 'Monkeh ok!', severity: 'success' }),
            onError: (err: any) => setEventMessage({ message: `Failed to update monkeh: ${err}`, severity: 'error' }),
        };
    }, [monkeh, setMonkeh, setEventMessage]);

    const monkehDetailsProps = useMemo(() => {
        return { monkeh, setMonkeh, readOnly: !editMode, headerAction: <EditMonkehButton {...{ toggleEditMonkeh }} /> };
    }, [toggleEditMonkeh, monkeh, setMonkeh, editMode]);

    return (
        <Grid container gap={2}>
            <EventSnackbar {...eventMessage} />
            <Grid item xs={12} >
                {editMode ? <EditMonkehForm {...editMonkehProps} /> : <MonkehDetails {...monkehDetailsProps} />}
            </Grid>
            {!editMode && <Grid item xs={12}>
                <EventTable rows={monkehEvents} />
            </Grid>}
        </Grid>
    );
}

export default function MonkehView() {
    const [selectedMonkeh, setSelectedMonkeh] = useState<IMonkeh>(defaultDummyMonkeh);
    const {setTitle} = useHeaderContext();
    const { Monkeh: monkehHeaderLabel } = useLocale<string>(HeaderLabels);
    const { SelectMonkehPlaceholder } = useLocale<string>(MonkehViewLabels);
    useEffect(() => {
        setTitle(monkehHeaderLabel);
    }, [setTitle, monkehHeaderLabel]);

    return (
        <BaseViewLayout leftContent={<MonkehList onMonkehSelect={setSelectedMonkeh} />}>
            {!!selectedMonkeh.id
                ? <MonkehViewMainContent {...{ selectedMonkeh, setSelectedMonkeh }} />
                : <><Face5Icon sx={{marginBottom: '-6px', marginRight: 1}}/>{SelectMonkehPlaceholder}</>}
        </BaseViewLayout>
    );
}