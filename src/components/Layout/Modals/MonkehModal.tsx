import { useCallback, useMemo, useState } from "react";
import BaseModal, { IBaseModalProps } from "@components/Layout/Modals/BaseModal";
import { useMonkehContext } from "@hooks/useCustomContext";
import { defaultDummyMonkeh, IMonkeh } from "@shared/models/Monkeh";
import MonkehForm from "@components/Inputs/Forms/MonkehForm";

export interface IMonkehFormModalProps extends IBaseModalProps {
    originalMonkeh?: IMonkeh
}

export default function MonkehModal({ originalMonkeh = defaultDummyMonkeh, readOnly, ...props }: IMonkehFormModalProps) {
    const [monkeh, setMonkeh] = useState<IMonkeh>(originalMonkeh);
    const { monkehAPI: { createMonkeh, updateMonkeh } } = useMonkehContext();

    const actions = useMemo(() => {
        return {
            onCreate: async () => await createMonkeh(monkeh),
            onUpdate: async () => await updateMonkeh(monkeh),
        }
    }, [monkeh, createMonkeh, updateMonkeh]);

    const onClose = useCallback(() => {
        setMonkeh(originalMonkeh);
        if (props.onClose) props.onClose();
    }, [setMonkeh, originalMonkeh, props]);

    return (
        <BaseModal {...{ ...props, ...actions, onClose }}>
            <MonkehForm {...{ monkeh, setMonkeh, readOnly }} />
        </BaseModal>
    )
}