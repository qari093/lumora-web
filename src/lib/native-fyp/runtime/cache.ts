type CacheEntry<T> = { value: T; ts: number };

export function createCache<T>() {
  const store = new Map<string, CacheEntry<T>>();

  return {
    set(key: string, value: T) {
      store.set(key, { value, ts: Date.now() });
    },
    get(key: string): T | null {
      const v = store.get(key);
      return v ? v.value : null;
    },
    clear() {
      store.clear();
    },
    size() {
      return store.size;
    }
  };
}
