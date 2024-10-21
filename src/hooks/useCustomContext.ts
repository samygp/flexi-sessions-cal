import { useContext } from "react";
import SessionContext from "../shared/models/SessionContext";
import DataContext, { IEventsContext, IMonkehsContext } from "../shared/models/DataContext";

export const useSessionContext = () => useContext(SessionContext);

export const useDataContext = () => useContext(DataContext);

export const useEventsContext = () => useDataContext() as IEventsContext;

export const useMonkehContext = () => useDataContext() as IMonkehsContext;