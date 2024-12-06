import { useCallback, useMemo } from 'react';
import useCRUDApiFetch, { ICrudAPIFetchOptions } from '@/hooks/useApiFetch';
import config from '../config.json';
import { IMonkeh, IMonkehRequest, IMonkehResponse, parseMonkehResult, toMonkehRequest } from '@/shared/models/Monkeh';
import { IBaseAPIHook, IItemCache } from '@/shared/models/Data';

const MONKEH_ENDPOINT = 'api/monkeh';

export type MonkehAPIResult = IMonkehResponse | IMonkehResponse[] | void | undefined;

export interface IMonkehAPI extends IBaseAPIHook {
  fetchMonkehs: (filter: Partial<IMonkeh>) => Promise<IMonkeh | IMonkeh[] | undefined>;
  createMonkeh: (monkeh: Omit<IMonkeh, 'id'>) => Promise<IMonkeh | IMonkeh[] | undefined>;
  updateMonkeh: (monkeh: IMonkeh) => Promise<IMonkeh | IMonkeh[] | undefined>;
  deleteMonkehs: (filter: IMonkeh) => Promise<IMonkeh | IMonkeh[] | undefined>;
}

export default function useMonkehAPI(cache?: IItemCache<IMonkeh[]>): IMonkehAPI {
  const crudAPIOptions = useMemo<ICrudAPIFetchOptions<IMonkeh>>(() => ({
    cacheOpts: cache && { cache, getId: (m: IMonkeh) => m.id },
    parseResult: parseMonkehResult,
    url: config.calendarEventsUrl,
  }), [cache]);

  const { loading, error, ...crudOps } = useCRUDApiFetch<IMonkehRequest, IMonkehRequest, IMonkehResponse, IMonkeh>(crudAPIOptions);
  const { get, create, update, remove } = crudOps;

  const fetchMonkehs = useCallback(async (filter: Partial<IMonkeh>) => {
    return await get(MONKEH_ENDPOINT, toMonkehRequest(filter));
  }, [get]);

  const createMonkeh = useCallback(async (monkeh: Omit<IMonkeh, 'id'>) => {
    return await create(MONKEH_ENDPOINT, toMonkehRequest(monkeh));
  }, [create]);

  const updateMonkeh = useCallback(async (monkeh: IMonkeh) => {
    return await update(MONKEH_ENDPOINT, toMonkehRequest(monkeh));
  }, [update]);

  const deleteMonkehs = useCallback(async (filter: IMonkeh) => {
    return await remove(MONKEH_ENDPOINT, toMonkehRequest(filter));
  }, [remove]);

  return { fetchMonkehs, createMonkeh, updateMonkeh, deleteMonkehs, loading, error };
}