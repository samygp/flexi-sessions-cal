import { Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, SvgIcon } from "@mui/material";
import { PropsWithChildren, useMemo } from "react";
import SubmitButtonGroup, { ISubmitButtonGroupProps } from "@/components/Inputs/Buttons/SubmitButtonGroup";

export interface IBaseModalProps extends PropsWithChildren, ISubmitButtonGroupProps, Omit<DialogProps, 'onClose' | 'onSubmit'> {
    open: boolean;
    TitleIcon?: typeof SvgIcon;
    readOnly?: boolean;
}

export default function BaseModal(props: IBaseModalProps) {
    const { children, title, readOnly, TitleIcon } = props;
    const submitDisabled = useMemo(() => props.submitDisabled ?? readOnly, [props, readOnly]);

    return (
        <Dialog maxWidth='lg' {...props}>
            <DialogTitle>
                {TitleIcon ? <TitleIcon sx={{ marginBottom: -0.4, paddingTop: 0.2, marginRight: 0.8 }} /> : ''}
                {title}
                </DialogTitle>
            <DialogContent dividers>
                {children}
            </DialogContent>
            <DialogActions sx={{ marginY: 1, marginX: 2 }}>
                <SubmitButtonGroup {...{ ...props, submitDisabled }} />
            </DialogActions>
        </Dialog>
    )
}
