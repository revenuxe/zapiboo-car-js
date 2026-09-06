"use client";

import { SWRConfig } from 'swr';
import type { ReactNode } from 'react';

export function ServerData({ fallback, children }: { fallback: Record<string, unknown>; children: ReactNode }) {
  return <SWRConfig value={{ fallback }}>{children}</SWRConfig>;
}
