import GenericForm, { IFieldMapping } from "./GenericForm";
import { IMonkeh } from "../../../shared/models/Monkeh";
import ErreDropdown from "../Dropdowns/ErreDropdown";
import SubmitButtonGroup from "../Buttons/SubmitButtonGroup";
import { useMonkehContext } from "../../../hooks/useCustomContext";
import { useCallback } from "react";

interface IMonkehFormProps {
    monkeh: IMonkeh;
    setMonkeh: React.Dispatch<React.SetStateAction<IMonkeh>>
    readOnly?: boolean;
}

interface IEditMonkehFormProps extends IMonkehFormProps {
    onClose: () => void;
    onSuccess?: (monkehResult?: IMonkeh | IMonkeh[] | undefined) => void;
    onError?: (error: any) => void;
}

export function EditMonkehForm({ monkeh, onClose, onError, onSuccess, ...props }: IEditMonkehFormProps) {
    const { monkehAPI: { updateMonkeh }, loading } = useMonkehContext();

    const onUpdate = useCallback(async () => {
        try {
            const monkehResult = await updateMonkeh(monkeh);
            if (monkehResult) {
                onSuccess?.(monkehResult);
                onClose?.();
            }
        } catch (error) {
            onError?.(error);
            
        }
    }, [monkeh, updateMonkeh, onClose]);
    return (
        <>
            <MonkehForm {...{ monkeh, ...props}} />
            <SubmitButtonGroup operation="update" submitButtonText="Save" {...{onClose, onUpdate, loading}}/>
        </>
    );
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