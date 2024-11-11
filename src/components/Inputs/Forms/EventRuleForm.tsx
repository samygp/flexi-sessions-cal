import GenericForm, { IFieldMapping } from "@/components/Inputs/Forms/GenericForm";
import SubmitButtonGroup from "@/components/Inputs/Buttons/SubmitButtonGroup";
import { useEventRulesContext } from "@/hooks/useCustomContext";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Divider, Grid } from "@mui/material";
import { useLocale } from "@/hooks/useLocale";
import WeekDayButtonGroup from "@/components/Inputs/Buttons/WeekDayButtonGroup";
import { IEventRule } from "@/shared/models/EventRules";
import { EventRuleFieldLabels, EventTypeLabels } from "@/shared/locale/events";
import { EventCategory, EventCategoryColorMap, EventType, EventTypeCategoryMap } from "@/shared/models/CalendarEvents";
import CategoryChip from "@/components/DataDisplay/Tags/CategoryChip";

interface IEventRuleFormProps {
    eventType: EventType;
    readOnly?: boolean;
    onClose: () => void;
    onSuccess?: (eventRuleResult?: IEventRule | IEventRule[] | undefined) => void;
    onError?: (error: any) => void;
}

export default function EditEventRuleForm({ onClose, onError, onSuccess, readOnly, eventType }: IEventRuleFormProps) {
    const labels = useLocale<keyof IEventRule>(EventRuleFieldLabels);
    const eventTypeLabels = useLocale<EventType>(EventTypeLabels);
    const cat = useMemo<EventCategory>(() => EventTypeCategoryMap[eventType], [eventType]);
    const fieldMappings = useMemo<IFieldMapping<IEventRule>[]>(() => [
        { label: labels.maxDailyEvents, fieldType: "text", fieldName: "maxDailyEvents" },
        { label: labels.daysOfWeek, fieldType: "custom", fieldName: "daysOfWeek", CustomFieldComponent: WeekDayButtonGroup },
    ], [labels]);
    const { eventRulesAPI: { updateRule }, loading, eventRulesMap } = useEventRulesContext();

    const [eventRule, setEventRule] = useState<IEventRule>(eventRulesMap[eventType]);
    useEffect(() => {
        setEventRule(eventRulesMap[eventType]);
    }, [eventRulesMap, eventType, setEventRule]);

    const onUpdate = useCallback(async () => {
        try {
            const eventRuleResult = await updateRule(eventRule);
            if (eventRuleResult) {
                onSuccess?.(eventRuleResult);
                onClose();
            }
        } catch (error) {
            onError?.(error);
        }
    }, [eventRule, updateRule, onClose, onError, onSuccess]);

    const formProps = useMemo(() => ({
        readOnly: readOnly,
        entry: eventRule,
        setEntry: setEventRule,
        layoutProps: { flexDirection: "row", gap: 6 },
        fieldMappings,
    }), [readOnly, fieldMappings, eventRule, setEventRule]);

    return (
        <Grid container gap={1}>
            <Grid item xs={12} >
                <CategoryChip text={eventTypeLabels[eventType]} color={EventCategoryColorMap[cat]} />
            </Grid>
            <Grid item xs={12} >
                <GenericForm<IEventRule> {...formProps} />
            </Grid>
            {!readOnly && (<>
                <Grid item xs={12} mb={1}>
                    <Divider />
                </Grid>
                <Grid item xs={12} >
                    <SubmitButtonGroup operation="update" submitButtonText="Save" {...{ onClose, onUpdate, loading }} />
                </Grid>
            </>)}
        </Grid>
    );
}