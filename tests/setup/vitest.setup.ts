/**
 * Vitest setup — minimal, deterministic polyfills and resets.
 * - Adds a Node-safe localStorage polyfill only if missing.
 * - Provides a stable, JSON-only storage to simulate browser persist.
 */
declare global {
  // eslint-disable-next-line no-var
  var __MEM_STORAGE__: Record<string, string> | undefined;
}

if (typeof globalThis.localStorage === "undefined") {
  const mem = (globalThis.__MEM_STORAGE__ ||= {});
  const ls = {
    get length() {
      return Object.keys(mem).length;
    },
    key(n: number) {
      const k = Object.keys(mem)[n] ?? null;
      return k;
    },
    getItem(key: string) {
      return Object.prototype.hasOwnProperty.call(mem, key) ? mem[key] : null;
    },
    setItem(key: string, value: string) {
      mem[key] = String(value);
    },
    removeItem(key: string) {
      delete mem[key];
    },
    clear() {
      for (const k of Object.keys(mem)) delete mem[k];
    }
  };
  Object.defineProperty(globalThis, "localStorage", {
    value: ls,
    configurable: true,
    enumerable: true,
    writable: false
  });
}

export {};
