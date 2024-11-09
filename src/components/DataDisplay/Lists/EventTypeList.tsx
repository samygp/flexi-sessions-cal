import { EventCategoryLabels, EventTypeLabels } from "@/shared/locale/events";
import { EventCategory, EventCategoryColorMap, EventType, EventTypeIconMap, getCategoryEventTypes } from "@/shared/models/CalendarEvents";
import { useCallback, useMemo } from "react";
import { useLocale } from "@/hooks/useLocale";
import GenericList, { IListItemProps } from "@/components/DataDisplay/Lists/GenericList";
import { Chip, ChipOwnProps, Typography } from "@mui/material";

interface IEventTypeListProps {
    value: EventType;
    onChange: (e: EventType) => void;
}

interface ICategoryDividerChipProps extends ChipOwnProps {
    text: string;
}

const EventTypeText = ({text}: {text: string}) => {
    return <Typography variant="h6" margin={"1ex"}>{text}</Typography>
}
const CategoryChip = ({ text, ...props }: ICategoryDividerChipProps) => {
    return <Chip {...props} label={<EventTypeText text={text} />} />;
}

export default function EventTypeList({ value, onChange }: IEventTypeListProps) {
    const typeLabels = useLocale<EventType>(EventTypeLabels);
    const categoryLabels = useLocale<EventCategory>(EventCategoryLabels);

    const getEventTypeEntry = useCallback((evtType: EventType): IListItemProps=> {
        const EventIcon = EventTypeIconMap[evtType];
        return {
            text: <EventTypeText text={typeLabels[evtType]} />,
            onClick: () => onChange(evtType),
            icon: <EventIcon/>,
        };
    }, [typeLabels, onChange]);

    const getCategoryEntries = useCallback((cat: EventCategory): IListItemProps[] => {
        const text = categoryLabels[cat];
        const color = EventCategoryColorMap[cat];
        return [
            { divider: true, icon: <CategoryChip {...{text, color}} /> },
            ...getCategoryEventTypes(cat).map(getEventTypeEntry),
        ];
    }, [categoryLabels, getEventTypeEntry]);

    const items = useMemo<IListItemProps[]>(() => {
        return Object.values(EventCategory).flatMap(getCategoryEntries);
    }, [getCategoryEntries]);

    return <GenericList loading={false} items={items} />;
}