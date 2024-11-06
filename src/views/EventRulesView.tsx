import { useHeaderContext } from "@hooks/useCustomContext";
import { useLocale } from "@hooks/useLocale";
import { HeaderLabels } from "@shared/locale/appUI";
import { EventType } from "@shared/models/CalendarEvents";
import { useState } from "react";
import { useMount } from "react-use";
import BaseViewLayout from "@views/BaseViewLayout";
import EventTypeList from "@components/DataDisplay/Lists/EventTypeList";

export default function EventRulesView() {
    const [selectedEventType, setSelectedEventType] = useState<EventType>(EventType.Biblio);
    const {setTitle} = useHeaderContext();
    const { EventRules: eventRulesHeaderLabel } = useLocale<string>(HeaderLabels);
    useMount(() => {
        setTitle(eventRulesHeaderLabel);
    });

    return (
        <BaseViewLayout leftContent={<EventTypeList value={selectedEventType} onChange={setSelectedEventType} />}>
            <>{selectedEventType}</>
        </BaseViewLayout>
    );
}