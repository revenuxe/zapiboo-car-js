/** Accept only a same-site path, including its query string and hash. */
export function safeRedirect(value: unknown, fallback = '/account'): string {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || value.includes('\\') || [...value].some(char => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127)) return fallback;
  try {
    const url = new URL(value, 'https://www.zapiboo.com');
    return url.origin === 'https://www.zapiboo.com' ? `${url.pathname}${url.search}${url.hash}` : fallback;
  } catch { return fallback; }
}
