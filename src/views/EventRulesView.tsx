import { useLocale } from "@/hooks/useLocale";
import { HeaderLabels } from "@/shared/locale/appUI";
import { EventType } from "@/shared/models/CalendarEvents";
import { useState } from "react";
import BaseViewLayout from "@/views/BaseViewLayout";
import EventTypeList from "@/components/DataDisplay/Lists/EventTypeList";
import EditEventRuleForm from "@/components/Inputs/Forms/EventRuleForm";

export default function EventRulesView() {
    const [selectedEventType, setSelectedEventType] = useState<EventType>(EventType.Biblio);
    const { EventRules: eventRulesHeaderLabel } = useLocale<string>(HeaderLabels);

    return (
        <BaseViewLayout headerTitle={eventRulesHeaderLabel} leftContent={<EventTypeList value={selectedEventType} onChange={setSelectedEventType} />}>
            <EditEventRuleForm eventType={selectedEventType} />
        </BaseViewLayout>
    );
}