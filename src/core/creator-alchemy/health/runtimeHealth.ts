import { getPersistedEventCount } from "@/src/core/creator-alchemy/persistence";

export interface RuntimeHealthSnapshot {
  ok: boolean;
  persistedEvents: number;
  checkedAt: string;
}

export function buildRuntimeHealthSnapshot(): RuntimeHealthSnapshot {
  return {
    ok: true,
    persistedEvents: getPersistedEventCount(),
    checkedAt: new Date().toISOString()
  };
}
