export type Reading = { slug: string; value: number; ts: number };
export type Tick = { symbol: string; price: number; volume?: number; ts: number };

type Store = { readings: Reading[]; ticks: Record<string, Tick[]> };

const g = globalThis as any;
if (!g.__EMML_STORE__) {
  g.__EMML_STORE__ = { readings: [], ticks: {} } as Store;
}
export const store: Store = g.__EMML_STORE__;
