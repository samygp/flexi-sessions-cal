import { useCallback, useState } from 'react';
import useCRUDApiFetch from './useApiFetch';
import config from '../config.json';
import { IMonkeh } from '../shared/models/Monkeh';
import { unix } from 'moment';

const MONKEH_ENDPOINT = 'api/monkeh';
export interface IMonkehRequest extends Partial<Omit<IMonkeh, 'id' | 'birthday'>> {
  id?: string;
  birthday?: number;
}

interface IMonkehResult extends Omit<IMonkeh, 'birthday'> {
  birthday: number;
}

const toMonkehRequest = (monkeh: Partial<IMonkeh>): IMonkehRequest => {
  return {...monkeh, birthday: monkeh.birthday?.unix()};
}

const parseMonkehResult = (monkeh: IMonkehResult): IMonkeh => {
  return {...monkeh, birthday: unix(monkeh.birthday!)};
}

export type MonkehAPIResult = IMonkehResult | IMonkehResult[] | void | undefined;

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
    const isArrayResult = Array.isArray(result);

    const monkehResults: IMonkeh[] = (isArrayResult ? result : [result]).map(parseMonkehResult);
    const newIDs = new Set<string>(monkehResults.map(e => e.id));
    setMonkehs(prev => prev.filter(e => !newIDs.has(e.id)).concat(remove ? [] : monkehResults));

    return (isArrayResult ? monkehResults : monkehResults[0]) as T;
  }, [setMonkehs]);

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

  return { fetchMonkehs, createMonkeh, updateMonkeh, deleteMonkehs, loading, error, monkehs };
}