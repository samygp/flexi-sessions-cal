import { useCallback, useState } from 'react';
import useCRUDApiFetch from './useApiFetch';
import config from '../config.json';
import { IMonkeh } from '../shared/models/Monkeh';

const MONKEH_ENDPOINT = 'api/monkehs';
interface IMonkehRequest extends Partial<Omit<IMonkeh, 'id'>> {
  id?: string;
}

type MonkehAPIResult = IMonkeh | IMonkeh[] | void | undefined;

export interface IMonkehAPI {
  fetchMonkehs: (filter: Partial<IMonkeh>) => Promise<IMonkeh | IMonkeh[] | undefined>;
  createMonkeh: (monkeh: Omit<IMonkeh, 'id'>) => Promise<IMonkeh | IMonkeh[] | undefined>;
  updateMonkeh: (monkeh: IMonkeh) => Promise<IMonkeh | IMonkeh[] | undefined>;
  deleteMonkehs: (filter: IMonkeh) => Promise<IMonkeh | IMonkeh[] | undefined>;
}

export default function useMonkehAPI() {
  const [monkehs, setMonkehs] = useState<IMonkeh[]>([]);

  const handleAPIResult = useCallback(<T extends (IMonkeh | IMonkeh[])>(result: MonkehAPIResult, remove?: boolean) => {
    if (!result) return;

    const monkehResult: IMonkeh[] = Array.isArray(result) ? result : [result];
    const newIDs = new Set<string>(monkehResult.map(e => e.id));
    setMonkehs(prev => prev.filter(e => !newIDs.has(e.id)).concat(remove ? [] : monkehResult));

    return result as T;
  }, [setMonkehs]);

  const { loading, error, get, create, update, remove } = useCRUDApiFetch<IMonkehRequest, IMonkehRequest>(config.calendarEventsUrl);

  const fetchMonkehs = useCallback(async (filter: Partial<IMonkeh>) => {
    return await get<MonkehAPIResult>(MONKEH_ENDPOINT, filter).then(handleAPIResult);
  }, [get, handleAPIResult]);

  const createMonkeh = useCallback(async (monkeh: Omit<IMonkeh, 'id'>) => {
    return await create<MonkehAPIResult>(MONKEH_ENDPOINT, monkeh).then(handleAPIResult);
  }, [create, handleAPIResult]);

  const updateMonkeh = useCallback(async (monkeh: IMonkeh) => {
    return await update<MonkehAPIResult>(MONKEH_ENDPOINT, monkeh).then(handleAPIResult);
  }, [update, handleAPIResult]);

  const deleteMonkehs = useCallback(async (filter: IMonkeh) => {
    return await remove<MonkehAPIResult>(MONKEH_ENDPOINT, filter).then(r => handleAPIResult(r, true));
  }, [remove, handleAPIResult]);

  return { fetchMonkehs, createMonkeh, updateMonkeh, deleteMonkehs, loading, error, monkehs };
}