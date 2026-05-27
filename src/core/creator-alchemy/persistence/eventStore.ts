import type { CreatorAlchemyEvent } from "@/src/core/creator-alchemy/live";
import type { StoredCreatorEvent } from "./types";
import { validateCreatorAlchemyEvent } from "@/src/core/creator-alchemy/live";

const STORE: StoredCreatorEvent[] = [];

export function persistCreatorEvent(event: CreatorAlchemyEvent): StoredCreatorEvent | null {
  if (!validateCreatorAlchemyEvent(event)) {
    return null;
  }

  const stored: StoredCreatorEvent = {
    ...event,
    persistedAt: new Date().toISOString()
  };

  STORE.push(stored);

  return stored;
}

export function getCreatorEvents(creatorId: string): StoredCreatorEvent[] {
  return STORE.filter((event) => event.creatorId === creatorId);
}

export function getPersistedEventCount(): number {
  return STORE.length;
}
