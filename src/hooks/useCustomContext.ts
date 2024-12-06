import { useContext } from "react";

import DataContext, { IEventRulesContext, IEventsContext, IMonkehsContext } from "@/shared/models/context/DataContext";
import SessionContext from "@/shared/models/context/SessionContext";
import HeaderContext from "@/shared/models/context/HeaderContext";

export const useSessionContext = () => useContext(SessionContext);

export const useHeaderContext = () => useContext(HeaderContext)

export const useDataContext = () => useContext(DataContext);

export const useEventsContext = (): IEventsContext => {
    const { eventsAPI, calendarEventMap, dateGroupedEventMap, eventsCache, getEventDescription } = useDataContext();
    return { eventsAPI, calendarEventMap, dateGroupedEventMap, eventsCache, loading: eventsAPI.loading, error: eventsAPI.error, getEventDescription };

}

export const useMonkehContext = (): IMonkehsContext => {
    const { monkehAPI, monkehMap, monkehCache, getEventDescription } = useDataContext();
    return { monkehAPI, monkehMap, monkehCache, loading: monkehAPI.loading, error: monkehAPI.error, getEventDescription };
}

export const useEventRulesContext = (): IEventRulesContext => {
    const { eventRulesAPI, eventRulesMap, eventRulesCache, getEventDescription } = useDataContext();
    return { eventRulesAPI, eventRulesMap, eventRulesCache, loading: eventRulesAPI.loading, error: eventRulesAPI.error, getEventDescription };
}