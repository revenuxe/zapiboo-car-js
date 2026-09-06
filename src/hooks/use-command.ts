"use client";

import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';
import { createCommandRunner } from '@/lib/command-runner';

/** Runs a user-triggered write once at a time, with explicit completion handling. */
export function useCommand<T = void>({
  execute,
  onSuccess,
  onError,
}: {
  execute: (input: T) => Promise<unknown>;
  onSuccess?: () => unknown;
  onError?: (error: Error) => unknown;
}) {
  const [isPending, setPending] = useState(false);
  const runner = useRef(createCommandRunner());
  const run = useCallback((input: T) => {
    void runner.current(input, {
      execute,
      success: onSuccess,
      failure: onError ?? (error => toast.error(error.message)),
      pending: setPending,
    }).catch(error => console.error('Command completion handler failed', error));
  }, [execute, onSuccess, onError]);
  return { run, isPending };
}
