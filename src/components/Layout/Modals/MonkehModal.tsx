import { useMemo, useState } from "react";
import BaseModal, { IBaseModalProps } from "./BaseModal";
import { useMonkehContext } from "../../../hooks/useCustomContext";
import { defaultDummyMonkeh, IMonkeh } from "../../../shared/models/Monkeh";
import MonkehForm from "../../Inputs/Forms/MonkehForm";

export interface IMonkehFormModalProps extends IBaseModalProps {
    originalMonkeh?: IMonkeh
}

export default function MonkehModal({ originalMonkeh = defaultDummyMonkeh, readOnly, ...props }: IMonkehFormModalProps) {
    const [monkeh, setMonkeh] = useState<IMonkeh>(originalMonkeh);
    const { monkehAPI: { createMonkeh, updateMonkeh } } = useMonkehContext();

    const { onCreate, onUpdate } = useMemo(() => {
        return {
            onCreate: async () => await createMonkeh(monkeh),
            onUpdate: async () => await updateMonkeh(monkeh),
        }
    }, [monkeh, createMonkeh, updateMonkeh]);

    return (
        <BaseModal {...{ ...props, onCreate, onUpdate, }}>
            <MonkehForm {...{ monkeh, setMonkeh, readOnly }} />
        </BaseModal>
    )
}