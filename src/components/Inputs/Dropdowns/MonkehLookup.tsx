import { useCallback, useMemo } from "react";
import { IMonkeh } from "../../../shared/models/Monkeh";
import Lookup from "./Lookup";
import { useMonkehContext } from "../../../hooks/useCustomContext";

interface IMonkehLookupProps {
    value: string;
    onChange: (monkehId: string) => void;
}

export default function MonkehLookup({value, onChange: setMonkehId}: IMonkehLookupProps) {
    const { monkehMap } = useMonkehContext();
    const monkehs = useMemo(() => Object.values(monkehMap), [monkehMap]);

    const onChange = useCallback((e: any) => setMonkehId(e.target.value as string), [setMonkehId]);
    return (
        <Lookup<IMonkeh>
            label="Monkeh"
            value={value}
            onChange={onChange}
            entries={monkehs}
            getOptionLabel={m => m.name}
            getOptionValue={m => m.id}
        />
    );
}