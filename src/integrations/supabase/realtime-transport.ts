/**
 * Supabase creates a Realtime client whenever a Supabase client is created.
 * Amplify Compute can run Node versions without a native WebSocket even when
 * the build image is Node 22+. SSR does not use Realtime channels, so provide
 * a transport placeholder there and keep the native browser transport client-side.
 */
class ServerOnlyWebSocket {
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSING = 2;
  static readonly CLOSED = 3;

  readonly CONNECTING = ServerOnlyWebSocket.CONNECTING;
  readonly OPEN = ServerOnlyWebSocket.OPEN;
  readonly CLOSING = ServerOnlyWebSocket.CLOSING;
  readonly CLOSED = ServerOnlyWebSocket.CLOSED;
  readonly readyState = ServerOnlyWebSocket.CLOSED;
  readonly url = "";
  readonly protocol = "";
  onopen = null;
  onmessage = null;
  onclose = null;
  onerror = null;

  constructor() {
    throw new Error("Supabase Realtime is unavailable during server rendering.");
  }

  close() {}
  send() {}
  addEventListener() {}
  removeEventListener() {}
}

export function realtimeTransportOptions() {
  if (typeof WebSocket !== "undefined") return {};
  return { transport: ServerOnlyWebSocket as unknown as typeof WebSocket };
}
