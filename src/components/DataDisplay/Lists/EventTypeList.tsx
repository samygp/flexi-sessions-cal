import { EventCategoryLabels, EventRuleViewLabels, EventTypeLabels } from "@/shared/locale/events";
import { EventCategory, EventCategoryColorMap, EventType, EventTypeIconMap, getCategoryEventTypes } from "@/shared/models/CalendarEvents";
import { useCallback, useMemo } from "react";
import { useLocale } from "@/hooks/useLocale";
import GenericList, { IListItemProps } from "@/components/DataDisplay/Lists/GenericList";
import { IconButton, Typography } from "@mui/material";
import { Refresh } from "@mui/icons-material";
import { useEventRulesContext } from "@/hooks/useCustomContext";
import CategoryChip from "@/components/DataDisplay/Tags/CategoryChip";

interface IEventTypeListProps {
    value: EventType;
    onChange: (e: EventType) => void;
}



const EventTypeText = ({ text }: { text: string }) => {
    return <Typography variant="h6" margin={"1ex"}>{text}</Typography>
};

export default function EventTypeList({ onChange }: IEventTypeListProps) {
    const typeLabels = useLocale<EventType>(EventTypeLabels);
    const categoryLabels = useLocale<EventCategory>(EventCategoryLabels);
    const viewLabels = useLocale<string>(EventRuleViewLabels);
    const { eventRulesAPI: { fetchRules }, loading } = useEventRulesContext();

    const getEventTypeEntry = useCallback((evtType: EventType): IListItemProps => {
        const EventIcon = EventTypeIconMap[evtType];
        return {
            text: <EventTypeText text={typeLabels[evtType]} />,
            onClick: () => onChange(evtType),
            icon: <EventIcon />,
        };
    }, [typeLabels, onChange]);

    const getCategoryEntries = useCallback((cat: EventCategory): IListItemProps[] => {
        const text = categoryLabels[cat];
        const color = EventCategoryColorMap[cat];
        return [
            { divider: true, icon: <CategoryChip {...{ text, color }} /> },
            ...getCategoryEventTypes(cat).map(getEventTypeEntry),
        ];
    }, [categoryLabels, getEventTypeEntry]);

    const items = useMemo<IListItemProps[]>(() => {
        return Object.values(EventCategory).flatMap(getCategoryEntries);
    }, [getCategoryEntries]);

    return <>
        <IconButton onClick={() => fetchRules({}, true)} size="small">
            <Refresh color="primary" />
            <Typography variant="body2" color={"primary"} >{viewLabels.RefreshEventrules}</Typography>
        </IconButton>
        <GenericList loading={loading} items={items} />
    </>;
}