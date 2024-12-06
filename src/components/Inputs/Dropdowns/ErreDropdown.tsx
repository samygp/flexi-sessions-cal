import { ErreLevel } from "@/shared/models/Monkeh";
import { ISelectOption } from "@/shared/models/Data";
import { isNumber } from "lodash";
import GenericDropdown from "@/components/Inputs/Dropdowns/GenericDropdown";

interface IErreDropdownProps {
    value: ErreLevel;
    onChange: (e: ErreLevel) => void;
}

const options: ISelectOption<ErreLevel>[] = Object.values(ErreLevel).filter(isNumber).map(v => ({ value: v, label: `R${v}` }));
const typeSafeValue = (v: string|number) => Number(v) as ErreLevel;

export default function ErreDropdown({ value, onChange }: IErreDropdownProps) {
    return <GenericDropdown label="Erre" {...{ options, value, onChange, typeSafeValue }} />;
}