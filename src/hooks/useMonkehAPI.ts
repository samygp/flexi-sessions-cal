import { useCallback } from 'react';
import useCRUDApiFetch from './useApiFetch';
import config from '../config.json';
import { IMonkeh, IMonkehRequest, IMonkehResponse, parseMonkehResult, toMonkehRequest } from '../shared/models/Monkeh';
import { IItemCache } from './useItemCache';

const MONKEH_ENDPOINT = 'api/monkeh';

export type MonkehAPIResult = IMonkehResponse | IMonkehResponse[] | void | undefined;

export interface IMonkehAPI {
  fetchMonkehs: (filter: Partial<IMonkeh>) => Promise<IMonkeh | IMonkeh[] | undefined>;
  createMonkeh: (monkeh: Omit<IMonkeh, 'id'>) => Promise<IMonkeh | IMonkeh[] | undefined>;
  updateMonkeh: (monkeh: IMonkeh) => Promise<IMonkeh | IMonkeh[] | undefined>;
  deleteMonkehs: (filter: IMonkeh) => Promise<IMonkeh | IMonkeh[] | undefined>;
  loading: boolean;
  error?: Error;
}

export default function useMonkehAPI(cache?: IItemCache<IMonkeh[]>): IMonkehAPI {
  const handleAPIResult = useCallback(<T extends (IMonkeh | IMonkeh[])>(result: MonkehAPIResult, remove?: boolean) => {
    if (!result) return;
    
    const isArrayResult = Array.isArray(result);
    const monkehResults: IMonkeh[] = (isArrayResult ? result : [result]).map(parseMonkehResult);

    if (cache) {
      const newIDs = new Set<string>(monkehResults.map(e => e.id));
      cache.setValue(prev => (prev ?? []).filter(e => !newIDs.has(e.id)).concat(remove ? [] : monkehResults));
    }

    return (isArrayResult ? monkehResults : monkehResults[0]) as T;
  }, [cache]);

  const { loading, error, get, create, update, remove } = useCRUDApiFetch<IMonkehRequest, IMonkehRequest>(config.calendarEventsUrl);

  const fetchMonkehs = useCallback(async (filter: Partial<IMonkeh>) => {
    return await get<MonkehAPIResult>(MONKEH_ENDPOINT, toMonkehRequest(filter)).then(handleAPIResult);
  }, [get, handleAPIResult]);

  const createMonkeh = useCallback(async (monkeh: Omit<IMonkeh, 'id'>) => {
    return await create<MonkehAPIResult>(MONKEH_ENDPOINT, toMonkehRequest(monkeh)).then(handleAPIResult);
  }, [create, handleAPIResult]);

  const updateMonkeh = useCallback(async (monkeh: IMonkeh) => {
    return await update<MonkehAPIResult>(MONKEH_ENDPOINT, toMonkehRequest(monkeh)).then(handleAPIResult);
  }, [update, handleAPIResult]);

  const deleteMonkehs = useCallback(async (filter: IMonkeh) => {
    return await remove<MonkehAPIResult>(MONKEH_ENDPOINT, toMonkehRequest(filter)).then(r => handleAPIResult(r, true));
  }, [remove, handleAPIResult]);

  return { fetchMonkehs, createMonkeh, updateMonkeh, deleteMonkehs, loading, error };
}