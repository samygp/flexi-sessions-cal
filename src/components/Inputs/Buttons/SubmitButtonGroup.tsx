import { ButtonGroup, ButtonOwnProps } from "@mui/material";
import { useMemo } from "react";
import { firstToUpper } from "../../../shared/utils/stringHelpers";
import LoadingButton from "./LoadingButton";

type SubmitOperation = "create" | "update" | "delete" | "submit";
export interface ISubmitButtonGroupProps {
    onClose: () => void;
    onSubmit?: () => Promise<any>;
    onUpdate?: () => Promise<any>;
    onCreate?: () => Promise<any>;
    onDelete?: () => Promise<any>;
    submitButtonStyle?: ButtonOwnProps["color"];
    submitButtonText?: string;
    submitDisabled?: boolean;
    operation?: SubmitOperation;
    loading?: boolean;
}

const operationStyleMap: Record<SubmitOperation, ButtonOwnProps["color"]> = {
    create: "primary",
    update: "primary",
    delete: "error",
    submit: "primary"
};

export default function SubmitButtonGroup(props: ISubmitButtonGroupProps) {
    const { operation = "submit", submitDisabled, loading, onClose } = props;
    const { submitButtonStyle: submitButtonStyleOverride, submitButtonText: submitButtonTextOverride } = props;

    const onSubmit = useMemo(() => {
        switch (operation) {
            case "create":
                return props.onCreate;
            case "update":
                return props.onUpdate;
            case "delete":
                return props.onDelete;
            case "submit":
                return props.onSubmit;
            default:
                return undefined;
        }
    }, [props, operation]);

    const closeText = useMemo(() => onSubmit ? "Cancel" : "Close", [onSubmit]);

    const submitButtonText = useMemo<string>(() => {
        if (submitButtonTextOverride) return submitButtonTextOverride;
        return firstToUpper(operation);
    }, [operation, submitButtonTextOverride]);

    const submitButtonStyle = useMemo<ButtonOwnProps["color"]>(() => {
        if (submitButtonStyleOverride) return submitButtonStyleOverride;
        return operationStyleMap[operation];
    }, [submitButtonStyleOverride, operation]);

    return (
        <ButtonGroup variant="contained" size="large" fullWidth>
            {onSubmit && <LoadingButton onClick={onSubmit} loading={loading} disabled={submitDisabled} color={submitButtonStyle} >{submitButtonText}</LoadingButton>}
            <LoadingButton onClick={onClose} loading={loading} variant="outlined">{closeText}</LoadingButton>
        </ButtonGroup>
    );
}