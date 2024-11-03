import GenericForm, { IFieldMapping } from "@components/Inputs/Forms/GenericForm";
import { IMonkeh } from "@shared/models/Monkeh";
import ErreDropdown from "@components/Inputs/Dropdowns/ErreDropdown";
import SubmitButtonGroup from "@components/Inputs/Buttons/SubmitButtonGroup";
import { useMonkehContext } from "@hooks/useCustomContext";
import { useCallback } from "react";
import { Divider, Grid } from "@mui/material";

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
    }, [monkeh, updateMonkeh, onClose, onError, onSuccess]);
    return (
        <Grid container gap={1}>
            <Grid item xs={12} >
                <MonkehForm {...{ monkeh, ...props }} />
            </Grid>
            <Grid item xs={12} mb={1}>
                <Divider />
            </Grid>
            <Grid item xs={12} >
                <SubmitButtonGroup operation="update" submitButtonText="Save" {...{ onClose, onUpdate, loading }} />
            </Grid>
        </Grid>
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