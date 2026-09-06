type Command<T> = {
  execute: (input: T) => Promise<unknown>;
  success?: () => unknown;
  failure: (error: Error) => unknown;
  pending: (value: boolean) => void;
};

/** Serializes a form's writes without replaying destructive operations. */
export function createCommandRunner() {
  let running = false;
  return async <T>(input: T, command: Command<T>): Promise<void> => {
    if (running) return;
    running = true;
    command.pending(true);
    try {
      await command.execute(input);
      await command.success?.();
    } catch (cause) {
      await command.failure(cause instanceof Error ? cause : new Error('The change could not be saved.'));
    } finally {
      running = false;
      command.pending(false);
    }
  };
}
