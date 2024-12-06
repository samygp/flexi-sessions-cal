import GenericForm, { IFieldMapping } from "@/components/Inputs/Forms/GenericForm";
import SubmitButtonGroup from "@/components/Inputs/Buttons/SubmitButtonGroup";
import { useEventRulesContext } from "@/hooks/useCustomContext";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Divider, Grid, } from "@mui/material";
import { useLocale } from "@/hooks/useLocale";
import WeekDayButtonGroup from "@/components/Inputs/Buttons/WeekDayButtonGroup";
import { IEventRule } from "@/shared/models/EventRules";
import { EventRuleFieldLabels, EventTypeLabels } from "@/shared/locale/events";
import { EventCategory, EventCategoryColorMap, EventType, EventTypeCategoryMap } from "@/shared/models/CalendarEvents";
import CategoryChip from "@/components/DataDisplay/Tags/CategoryChip";
import EventSnackbar, { IEventSnackProps } from "@/components/DataDisplay/EventSnackbar";
import EditButton from "../Buttons/EditButton";

interface IEventRuleFormProps {
    eventType: EventType;
}

export default function EditEventRuleForm({ eventType }: IEventRuleFormProps) {
    const labels = useLocale<keyof IEventRule>(EventRuleFieldLabels);
    const eventTypeLabels = useLocale<EventType>(EventTypeLabels);
    const cat = useMemo<EventCategory>(() => EventTypeCategoryMap[eventType], [eventType]);
    const fieldMappings = useMemo<IFieldMapping<IEventRule>[]>(() => [
        { label: labels.maxDailyEvents, fieldType: "text", fieldName: "maxDailyEvents" },
        { label: labels.daysOfWeek, fieldType: "custom", fieldName: "daysOfWeek", CustomFieldComponent: WeekDayButtonGroup },
    ], [labels]);
    
    const { eventRulesAPI: { updateRule }, loading, eventRulesMap } = useEventRulesContext();
    const [eventRule, setEventRule] = useState<IEventRule>(eventRulesMap[eventType]);
    const eventRuleCurrState = useMemo(() => eventRulesMap[eventType], [eventType, eventRulesMap]);

    const [editMode, setEditMode] = useState<boolean>(false);
    const [eventMessage, setEventMessage] = useState<IEventSnackProps>({ message: '', severity: "success" });

    const resetReadOnly = useCallback(() => {
        setEditMode(false);
        setEventRule({...eventRulesMap[eventType]});
    }, [eventRulesMap, eventType]);
    
    useEffect(() => resetReadOnly() , [resetReadOnly]);

    const onUpdate = useCallback(async () => {
        try {
            const eventRuleResult = await updateRule(eventRule);
            if (eventRuleResult) {
                setEventMessage({ message: 'Success!', severity: 'success' });
            }
        } catch (error) {
            setEventMessage({ message: `${error}`, severity: 'error' });
        }
    }, [eventRule, updateRule]);

    const formProps = useMemo(() => ({
        readOnly: !editMode,
        entry: editMode ? eventRule: eventRuleCurrState,
        setEntry: setEventRule,
        layoutProps: { flexDirection: "row", gap: 6 },
        fieldMappings,
    }), [editMode, fieldMappings, eventRule, eventRuleCurrState, setEventRule]);

    return (
        <Grid container gap={1}>
            <Grid item xs={12} >
                <CategoryChip text={eventTypeLabels[eventType]} color={EventCategoryColorMap[cat]} />
                <EditButton disabled={editMode} setEditValue={setEditMode} />
            </Grid>
            <Grid item xs={12} >
            <EventSnackbar {...eventMessage}/>
            </Grid>
            <Grid item xs={12} >
                <GenericForm<IEventRule> {...formProps} />
            </Grid>
            {editMode && (<>
                <Grid item xs={12} mb={1}>
                    <Divider />
                </Grid>
                <Grid item xs={12} >
                    <SubmitButtonGroup operation="update" submitButtonText="Save" {...{ onClose: resetReadOnly, onUpdate, loading }} />
                </Grid>
            </>)}
        </Grid>
    );
}