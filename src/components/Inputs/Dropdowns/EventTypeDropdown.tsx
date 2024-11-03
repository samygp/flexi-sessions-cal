import { EventTypeLabels } from "@shared/locale/events";
import { EventType } from "@shared/models/CalendarEvents";
import { ISelectOption } from "@shared/models/Data";
import GenericDropdown from "@components/Inputs/Dropdowns/GenericDropdown";

interface IEventTypeDropdownProps {
    value: EventType;
    onChange: (e: EventType) => void;
}

const options: ISelectOption<EventType>[] = Object.values(EventType).map(e => {
    return { value: e, label: EventTypeLabels[e].en };
});
const typeSafeValue = (v: string) => v as EventType;

export default function EventTypeDropdown({ value, onChange }: IEventTypeDropdownProps) {
    return <GenericDropdown label="Event Type" {...{ options, value, onChange, typeSafeValue }} />
}