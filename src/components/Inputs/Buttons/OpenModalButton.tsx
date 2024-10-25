import { Button, ButtonOwnProps } from "@mui/material";
import { ReactNode, useCallback, useMemo, useState } from "react";
import { IBaseModalProps } from "../../Layout/Modals/BaseModal";

interface IOpenModalButtonProps<T extends IBaseModalProps> extends ButtonOwnProps {
    label: ReactNode;
    Modal: (props: T) => JSX.Element;
    modalProps: Omit<T, "open" | "onClose">;
}

/**
 * A button that opens a modal window with a form to create a new calendar event.
 * 
 * @param {IOpenModalButtonProps<T>} props 
 * @param {string} props.label The label for the button.
 * @param {boolean} [props.disabled=false] Whether the button is disabled.
 * @param {ButtonOwnProps['color']} [props.color="primary"] The color of the button.
 * @param {React.ComponentType<T & IBaseModalProps>} props.Modal The modal component to render.
 * @param {T} props.modalProps Props to pass to the modal component.
 * @returns A button that opens a modal window with a form to create a new calendar event.
 */
export default function OpenModalButton<T extends IBaseModalProps>({ Modal, label, color = "primary", modalProps, ...buttonProps }: IOpenModalButtonProps<T>) {
    const [open, setOpen] = useState(false);
    const onClose = useCallback(() => setOpen(false), [setOpen]);
    const onClick = useCallback(() => setOpen(true), [setOpen]);
    const targetModalProps = useMemo<T>(() => ({ ...modalProps, open, onClose }) as T, [modalProps, open, onClose]);

    return (
        <>
            <Button variant="contained" sx={{ margin: '10px 0' }} {...{...buttonProps, onClick, color }} >
                {label}
            </Button>
            <Modal {...targetModalProps}/>
        </>
    )
}