import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { PropsWithChildren, useMemo } from "react";
import SubmitButtonGroup, { ISubmitButtonGroupProps } from "../../Inputs/Buttons/SubmitButtonGroup";

export interface IBaseModalProps extends PropsWithChildren, ISubmitButtonGroupProps {
    open: boolean;
    title: string;
    readOnly?: boolean;
}

export default function BaseModal(props: IBaseModalProps) {
    const { open, children, title, readOnly } = props;
    const submitDisabled = useMemo(() => props.submitDisabled ?? readOnly, [props, readOnly]);

    return (
        <Dialog maxWidth='lg' open={open}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent dividers>
                {children}
                <SubmitButtonGroup {...{...props, submitDisabled}} />
            </DialogContent>
        </Dialog>
    )
}
