import { useCallback, useMemo } from 'react';
import useCRUDApiFetch, { ICrudAPIFetchOptions } from './useApiFetch';
import config from '../config.json';
import { IEventRule } from '@/shared/models/EventRules';
import { IItemCache } from '@/shared/models/Data';

const RULES_ENDPOINT = 'api/eventRules';

export type EventRuleAPIResult = IEventRule | IEventRule[] | void | undefined;

export interface IEventRulesAPI {
  fetchRules: (filter: Partial<IEventRule>) => Promise<IEventRule | IEventRule[] | undefined>;
  updateRule: (rule: IEventRule) => Promise<IEventRule | IEventRule[] | undefined>;
  loading: boolean;
  error?: Error;
}

export default function useEventRulesAPI(cache?: IItemCache<IEventRule[]>): IEventRulesAPI {
  const crudAPIOptions = useMemo<ICrudAPIFetchOptions<IEventRule>>(() => ({
    cacheOpts: cache && { cache, getId: (m: IEventRule) => m.id },
    url: config.calendarEventsUrl,
  }), [cache]);

  const { loading, error, get, update } = useCRUDApiFetch<IEventRule, Partial<IEventRule>, IEventRule, IEventRule>(crudAPIOptions);

  const fetchRules = useCallback(async (filter: Partial<IEventRule>) => {
    return await get(RULES_ENDPOINT, filter);
  }, [get]);

  const updateRule = useCallback(async (rule: IEventRule) => {
    return await update(RULES_ENDPOINT, rule);
  }, [update]);

  return { fetchRules, updateRule, loading, error };
}