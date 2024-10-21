import GenericForm, { IFieldMapping } from "./GenericForm";
import { IMonkeh } from "../../../shared/models/Monkeh";

interface IMonkehFormProps {
    monkeh: IMonkeh;
    setMonkeh: React.Dispatch<React.SetStateAction<IMonkeh>>
    readOnly?: boolean;
}

export default function CalendarEventForm({ setMonkeh, readOnly, monkeh }: IMonkehFormProps) {
    const fieldMappings: IFieldMapping<IMonkeh>[] = [
        { label: "Name", fieldType: "text", fieldName: "name" },
        { label: "Email", fieldType: "text", fieldName: "email" },
        { label: "Level", fieldType: "number", fieldName: "level" },
        { label: "Birthday", fieldType: "date", fieldName: "birthday", customProps: {views:['month', 'year']} },
    ];

    return <GenericForm<IMonkeh>
        readOnly={readOnly}
        entry={monkeh}
        setEntry={setMonkeh}
        fieldMappings={fieldMappings}
    />
}