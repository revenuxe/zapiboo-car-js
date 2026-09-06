"use client";

import { useCallback } from 'react';
import { useSWRConfig } from 'swr';

export function useDataCache() {
  const { mutate } = useSWRConfig();
  const refresh = useCallback((prefix: readonly unknown[]) => mutate(
    key => Array.isArray(key) && prefix.every((part, index) => key[index] === part),
  ), [mutate]);
  const clear = useCallback(() => mutate(() => true, undefined, { revalidate: false }), [mutate]);
  return { refresh, clear };
}
