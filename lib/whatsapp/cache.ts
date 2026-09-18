const TTL_MS = 24 * 60 * 60 * 1000;

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const store = new Map<string, CacheEntry<unknown>>();

export function get<T>(number: string): T | null {
  const entry = store.get(number);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(number);
    return null;
  }
  return entry.data as T;
}

export function set<T>(number: string, data: T): void {
  store.set(number, { data, expiresAt: Date.now() + TTL_MS });
}
