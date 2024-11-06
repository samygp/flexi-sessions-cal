import { EventCategoryLabels, EventTypeLabels } from "@shared/locale/events";
import { EventCategory, EventType, EventTypeCategoryMap } from "@shared/models/CalendarEvents";
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
    const typeLabels = useLocale<EventType>(EventTypeLabels);
    const categoryLabels = useLocale<EventCategory>(EventCategoryLabels);
    

    const options: ISelectOption<EventType>[] = useMemo(() => {
        return Object.values(EventType).map(evtType => {
            const cat = EventTypeCategoryMap[evtType];
            return { value: evtType, label: typeLabels[evtType], category: categoryLabels[cat] };
        });
    }, [typeLabels, categoryLabels]);
    
    return <GenericDropdown label="Event Type" {...{ options, value, onChange, typeSafeValue }} />
}