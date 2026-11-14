export const pollDelay = (failures: number) => Math.min(30000, 6000 * 2 ** failures);

export function createReadCache() {
  const entries = new Map<string, { value: Promise<unknown>; expires: number }>();
  return {
    invalidate(key: string) { entries.delete(key); },
    get<T>(key: string, ttl: number, load: () => Promise<T>, now = Date.now()): Promise<T> {
      const current = entries.get(key);
      if (current && current.expires > now) return current.value as Promise<T>;
      const value = load().catch(error => {
        if (entries.get(key)?.value === value) entries.delete(key);
        throw error;
      });
      entries.set(key, { value, expires: now + ttl });
      return value;
    },
  };
}
