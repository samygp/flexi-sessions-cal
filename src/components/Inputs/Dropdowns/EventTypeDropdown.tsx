import { EventTypeLabels } from "@shared/locale/events";
import { EventType } from "@shared/models/CalendarEvents";
import { ISelectOption } from "@shared/models/Data";
import GenericDropdown from "@components/Inputs/Dropdowns/GenericDropdown";
import { useMemo } from "react";
import { useLocale } from "@hooks/useLocale";

interface IEventTypeDropdownProps {
    value: EventType;
    onChange: (e: EventType) => void;
}

const typeSafeValue = (v: string) => v as EventType;

export default function EventTypeDropdown({ value, onChange }: IEventTypeDropdownProps) {
    const labels = useLocale<EventType>(EventTypeLabels);

    const options: ISelectOption<EventType>[] = useMemo(() => {
        return Object.values(EventType).map(evtType => {
            return { value: evtType, label: labels[evtType] };
        });
    }, [labels]);
    
    return <GenericDropdown label="Event Type" {...{ options, value, onChange, typeSafeValue }} />
}