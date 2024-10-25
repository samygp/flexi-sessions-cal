import GenericForm, { IFieldMapping } from "./GenericForm";
import { IMonkeh } from "../../../shared/models/Monkeh";
import ErreDropdown from "../Dropdowns/ErreDropdown";

interface IMonkehFormProps {
    monkeh: IMonkeh;
    setMonkeh: React.Dispatch<React.SetStateAction<IMonkeh>>
    readOnly?: boolean;
}

export default function MonkehForm({ setMonkeh, readOnly, monkeh }: IMonkehFormProps) {
    const fieldMappings: IFieldMapping<IMonkeh>[] = [
        { label: "Name", fieldType: "text", fieldName: "name" },
        { label: "Email", fieldType: "text", fieldName: "email" },
        { label: "Level", fieldType: "custom", fieldName: "level", CustomFieldComponent: ErreDropdown },
        { label: "Birthday", fieldType: "monthday", fieldName: "birthday" },
    ];

    return <GenericForm<IMonkeh>
        readOnly={readOnly}
        entry={monkeh}
        setEntry={setMonkeh}
        fieldMappings={fieldMappings}
    />
}