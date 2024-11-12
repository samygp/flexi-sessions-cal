import MonkehList from "@/components/DataDisplay/Lists/MonkehList";
import { defaultDummyMonkeh, IMonkeh } from "@/shared/models/Monkeh";
import Face5Icon from '@mui/icons-material/Face5';
import { useCallback, useEffect, useMemo, useState } from "react";
import BaseViewLayout from "@/views/BaseViewLayout";
import { EditMonkehForm } from "@/components/Inputs/Forms/MonkehForm";
import { Grid } from "@mui/material";
import EventSnackbar, { IEventSnackProps } from "@/components/DataDisplay/EventSnackbar";
import MonkehDetails from "@/components/DataDisplay/Details/MonkehDetails";

import { useEventsContext, useHeaderContext } from "@/hooks/useCustomContext";
import { CalendarEvent } from "@/shared/models/CalendarEvents";
import EventTable from "@/components/DataDisplay/Tables/EventTable";
import { useLocale } from "@/hooks/useLocale";
import { HeaderLabels } from "@/shared/locale/appUI";
import { MonkehViewLabels } from "@/shared/locale/monkeh";
import EditButton from "@/components/Inputs/Buttons/EditButton";

interface IMonkehViewContentProps {
    selectedMonkeh: IMonkeh;
    setSelectedMonkeh: React.Dispatch<React.SetStateAction<IMonkeh>>;
}

function MonkehViewMainContent({ selectedMonkeh: monkeh, setSelectedMonkeh: setMonkeh }: IMonkehViewContentProps) {
    const [editMode, setEditMode] = useState<boolean>(false);
    const toggleEditMonkeh = useCallback(() => setEditMode(prev => !prev), [setEditMode]);

    const { calendarEventMap } = useEventsContext();
    const monkehEvents = useMemo<CalendarEvent[]>((() => {
        return Object.values(calendarEventMap).filter(e => e.monkehId === monkeh.id);
    }), [calendarEventMap, monkeh]);

    const [eventMessage, setEventMessage] = useState<IEventSnackProps>({ message: '', severity: "success" });

    const sharedContentProps = useMemo(() => ({ monkeh, setMonkeh }), [monkeh, setMonkeh]);

    const editMonkehProps = useMemo(() => ({
        onError: (err: any) => setEventMessage({ message: `Failed to update monkeh: ${err}`, severity: 'error' }),
        onClose: () => setEditMode(false),
        onSuccess: () => setEventMessage({ message: 'Monkeh ok!', severity: 'success' }),
    }), [setEditMode, setEventMessage]);

    const headerActionProps =  useMemo(() => ({
        disabled: editMode,
        setEditValue: toggleEditMonkeh,
    }), [editMode, toggleEditMonkeh]);

    return (
        <Grid container gap={2}>
            <EventSnackbar {...eventMessage} />
            <Grid item xs={12} >
                {editMode 
                    ? <EditMonkehForm {...sharedContentProps} {...editMonkehProps} />
                    : <MonkehDetails {...sharedContentProps} headerAction={<EditButton {...headerActionProps} />} />
                    }
            </Grid>
            {!editMode && <Grid item xs={12}>
                <EventTable rows={monkehEvents} />
            </Grid>}
        </Grid>
    );
}

export default function MonkehView() {
    const [selectedMonkeh, setSelectedMonkeh] = useState<IMonkeh>(defaultDummyMonkeh);
    const { setTitle } = useHeaderContext();
    const { Monkeh: monkehHeaderLabel } = useLocale<string>(HeaderLabels);
    const { SelectMonkehPlaceholder } = useLocale<string>(MonkehViewLabels);
    useEffect(() => {
        setTitle(monkehHeaderLabel);
    }, [setTitle, monkehHeaderLabel]);

    return (
        <BaseViewLayout leftContent={<MonkehList onMonkehSelect={setSelectedMonkeh} />}>
            {!!selectedMonkeh.id
                ? <MonkehViewMainContent {...{ selectedMonkeh, setSelectedMonkeh }} />
                : <><Face5Icon sx={{ marginBottom: '-6px', marginRight: 1 }} />{SelectMonkehPlaceholder}</>}
        </BaseViewLayout>
    );
}