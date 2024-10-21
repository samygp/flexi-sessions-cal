import { useMemo } from "react";
import GenericList, { IListItemProps } from "./GenericList";
import MonkehTag from "../Tags/MonkehTag";
import { useMonkehContext } from "../../../hooks/useCustomContext";
import { IMonkeh } from "../../../shared/models/Monkeh";
import { groupBy } from "lodash";

interface IMonkehListProps {
    onMonkehSelect: (monkeh: IMonkeh) => void;
}

export default function MonkehList({ onMonkehSelect }: IMonkehListProps) {
    const { monkehMap } = useMonkehContext();
    
    const items = useMemo<IListItemProps[]>(() => {
        const grouped = groupBy(monkehMap, 'level');

        return Object.entries(grouped).flatMap(([, monkehs]) => {
            return [
                { divider: true, icon: <MonkehTag {...monkehs[0]} />},
                ...monkehs.map(m => ({ text: m.name, icon: <MonkehTag {...m} />, onClick: () => onMonkehSelect(m) })),
            ];
        })
    }, [monkehMap, onMonkehSelect]);

    return <GenericList items={items} />;
}