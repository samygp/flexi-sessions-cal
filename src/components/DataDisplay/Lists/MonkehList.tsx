import { useMemo } from "react";
import MonkehTag from "@components/DataDisplay/Tags/MonkehTag";
import { useMonkehContext } from "@hooks/useCustomContext";
import { IMonkeh } from "@shared/models/Monkeh";
import { groupBy, startCase } from "lodash";
import { ButtonGroup, IconButton, Typography } from "@mui/material";
import { AddCircleOutline, Refresh } from "@mui/icons-material";
import OpenModalButton from "@components/Inputs/Buttons/OpenModalButton";
import MonkehModal, { IMonkehFormModalProps } from "@components/Layout/Modals/MonkehModal";
import Face5Icon from '@mui/icons-material/Face5';
import GenericList, { IListItemProps } from "./GenericList";
import { useLocale } from "@hooks/useLocale";
import { MonkehViewLabels } from "@shared/locale/monkeh";

interface IMonkehListProps {
    onMonkehSelect: (monkeh: IMonkeh) => void;
}

function MonkehButtons() {
    const { monkehAPI: { fetchMonkehs } } = useMonkehContext();
    const labels = useLocale<string>(MonkehViewLabels);

    return (
        <ButtonGroup fullWidth sx={{justifyContent: "space-around"}}>
            <OpenModalButton<IMonkehFormModalProps>
                startIcon={<AddCircleOutline />}
                Modal={MonkehModal}
                label={labels.AddMonkeh}
                sx={{ width: "fit-content" }}
                size="small"
                modalProps={{ operation: "create", title: labels.AddMonkeh, TitleIcon: Face5Icon }}
                variant="text"
            />
            <IconButton onClick={() => fetchMonkehs({})} size="small">
                <Refresh color="primary" />
                <Typography variant="body2" color={"primary"} >{labels.RefreshMonkehs}</Typography>
            </IconButton>
        </ButtonGroup>
    );
}

function MonkehText({ monkeh }: { monkeh: IMonkeh }) {
    return (
        <Typography variant="h6" color={"text.primary"} margin={"1ex"}>{startCase(monkeh.name)}</Typography>
    );
}

export default function MonkehList({ onMonkehSelect }: IMonkehListProps) {
    const { monkehMap, loading } = useMonkehContext();

    const items = useMemo<IListItemProps[]>(() => {
        const grouped = groupBy(monkehMap, 'level');

        return Object.entries(grouped).flatMap(([, monkehs]) => {
            return [
                { divider: true, icon: <MonkehTag {...monkehs[0]} /> },
                ...monkehs.map(m => ({ text: <MonkehText monkeh={m} />, icon: <MonkehTag {...m} />, onClick: () => onMonkehSelect(m) })),
            ];
        })
    }, [monkehMap, onMonkehSelect]);

    return (
        <>
            <MonkehButtons />
            <GenericList loading={loading} items={items} />
        </>
    );
}