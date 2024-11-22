import { EventRuleService } from "@/services/eventRules";
import { useMemo } from "react";
import { useEventRulesContext, useEventsContext } from "@/hooks/useCustomContext";

export default function useEventRules() {
    const { eventRulesMap } = useEventRulesContext();
    const { dateGroupedEventMap } = useEventsContext();
    const rulesService = useMemo<EventRuleService>(() => new EventRuleService(eventRulesMap, dateGroupedEventMap), [eventRulesMap, dateGroupedEventMap]);
    
    return rulesService;
}