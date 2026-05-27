import type {
  SessionEvent
} from "../types";

export class SessionStore {
  private readonly events: SessionEvent[] = [];

  push(
    event: SessionEvent
  ): number {
    this.events.push(event);
    return this.events.length;
  }

  all(): SessionEvent[] {
    return [...this.events];
  }

  count(): number {
    return this.events.length;
  }
}

export function createSessionStore() {
  return new SessionStore();
}
