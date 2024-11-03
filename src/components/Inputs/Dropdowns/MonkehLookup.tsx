import { useCallback, useMemo } from "react";
import { IMonkeh } from "@shared/models/Monkeh";
import Lookup from "@components/Inputs/Dropdowns/Lookup";
import { useMonkehContext } from "@hooks/useCustomContext";

interface IMonkehLookupProps {
    value: string;
    onChange: (monkehId: string) => void;
}

export default function MonkehLookup({value, onChange}: IMonkehLookupProps) {
    const { monkehMap } = useMonkehContext();
    const entries = useMemo(() => Object.values(monkehMap).sort((a, b) => a.level - b.level), [monkehMap]);
    const getCategory = useCallback((m: IMonkeh) => `R${m.level}`, []);
    const getOptionValue = useCallback((m: IMonkeh) => m.id, []);
    const getOptionLabel = useCallback((m: IMonkeh) => m.name, []);

    return (
        <Lookup<IMonkeh> label="Monkeh" {...{value, onChange, getCategory, getOptionValue, getOptionLabel, entries}}/>
    );
}