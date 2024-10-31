import { useMemo } from "react";
import GenericList, { IListItemProps } from "./GenericList";
import MonkehTag from "../Tags/MonkehTag";
import { useMonkehContext } from "../../../hooks/useCustomContext";
import { IMonkeh } from "../../../shared/models/Monkeh";
import { groupBy, startCase } from "lodash";
import { ButtonGroup, IconButton, Typography } from "@mui/material";
import { AddCircleOutline, Refresh } from "@mui/icons-material";
import OpenModalButton from "../../Inputs/Buttons/OpenModalButton";
import MonkehModal, { IMonkehFormModalProps } from "../../Layout/Modals/MonkehModal";
import Face5Icon from '@mui/icons-material/Face5';

interface IMonkehListProps {
    onMonkehSelect: (monkeh: IMonkeh) => void;
}

function MonkehButtons() {
    const { monkehAPI: { fetchMonkehs } } = useMonkehContext();

    return (
        <ButtonGroup fullWidth sx={{justifyContent: "space-around"}}>
            <OpenModalButton<IMonkehFormModalProps>
                startIcon={<AddCircleOutline />}
                Modal={MonkehModal}
                label="Add Monkeh"
                sx={{ width: "fit-content" }}
                modalProps={{ operation: "create", title: "Add Monkeh", TitleIcon: Face5Icon }}
                variant="text"
            />
            <IconButton onClick={() => fetchMonkehs({})} size="small">
                <Refresh color="primary" />
                <Typography variant="body2" color={"primary"} >Refresh Monkeh List</Typography>
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