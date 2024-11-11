import { useContext } from "react";

import DataContext, { IEventRulesContext, IEventsContext, IMonkehsContext } from "@/shared/models/context/DataContext";
import SessionContext from "@/shared/models/context/SessionContext";
import HeaderContext from "@/shared/models/context/HeaderContext";

export const useSessionContext = () => useContext(SessionContext);

export const useHeaderContext = () => useContext(HeaderContext)

export const useDataContext = () => useContext(DataContext);

export const useEventsContext = (): IEventsContext => {
    const {eventsAPI, calendarEventMap, dateGroupedEventMap} = useDataContext();
    return {eventsAPI, calendarEventMap, dateGroupedEventMap, loading: eventsAPI.loading, error: eventsAPI.error};

}

export const useMonkehContext = (): IMonkehsContext => {
    const {monkehAPI, monkehMap} = useDataContext();
    return {monkehAPI, monkehMap, loading: monkehAPI.loading, error: monkehAPI.error};
}

export const useEventRulesContext = (): IEventRulesContext => {
    const {eventRulesAPI, eventRulesMap} = useDataContext();
    return {eventRulesAPI, eventRulesMap, loading: eventRulesAPI.loading, error: eventRulesAPI.error};
}