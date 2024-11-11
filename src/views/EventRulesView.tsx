import { useHeaderContext } from "@/hooks/useCustomContext";
import { useLocale } from "@/hooks/useLocale";
import { HeaderLabels } from "@/shared/locale/appUI";
import { EventType } from "@/shared/models/CalendarEvents";
import { useCallback, useEffect, useState } from "react";
import BaseViewLayout from "@/views/BaseViewLayout";
import EventTypeList from "@/components/DataDisplay/Lists/EventTypeList";
import EditEventRuleForm from "@/components/Inputs/Forms/EventRuleForm";
import EventSnackbar, { IEventSnackProps } from "@/components/DataDisplay/EventSnackbar";

export default function EventRulesView() {
    const [readOnly, setReadOnly] = useState<boolean>(true);
    const [eventMessage, setEventMessage] = useState<IEventSnackProps>({ message: '', severity: "success" });
    const [selectedEventType, setSelectedEventType] = useState<EventType>(EventType.Biblio);
    const {setTitle} = useHeaderContext();
    const { EventRules: eventRulesHeaderLabel } = useLocale<string>(HeaderLabels);
    useEffect(() => {
        setTitle(eventRulesHeaderLabel);
    }, [setTitle, eventRulesHeaderLabel]);

    const onClose = useCallback(() => setReadOnly(true), [setReadOnly]);
    const onSuccess = useCallback(() => {
        setEventMessage({ message: 'Success!', severity: 'success' });
    }, []);
    const onError = useCallback((error: any) => {
        setEventMessage({ message: `${error}`, severity: 'error' });
    }, []);

    return (
        <BaseViewLayout leftContent={<EventTypeList value={selectedEventType} onChange={setSelectedEventType} />}>
            <EventSnackbar {...eventMessage}/>
            <EditEventRuleForm eventType={selectedEventType} {...{readOnly, onClose, onSuccess, onError}}/>
        </BaseViewLayout>
    );
}