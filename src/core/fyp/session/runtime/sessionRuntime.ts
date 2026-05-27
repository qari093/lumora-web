import type {
  SessionEvent,
  SessionSnapshot
} from "../types";

import { validateSessionEvent } from "../contracts/sessionContract";
import { createSessionStore } from "./sessionStore";
import { createSessionSnapshot } from "./sessionSnapshot";

export class SessionRuntime {
  private readonly store =
    createSessionStore();

  track(
    event: SessionEvent
  ): number {
    if (!validateSessionEvent(event)) {
      throw new Error(
        "invalid_session_event"
      );
    }

    return this.store.push(event);
  }

  snapshot(
    sessionId: string,
    userId: string
  ): SessionSnapshot {
    const events =
      this.store
        .all()
        .filter(
          (event) =>
            event.sessionId === sessionId
        );

    return createSessionSnapshot(
      sessionId,
      userId,
      events
    );
  }
}

export function createSessionRuntime() {
  return new SessionRuntime();
}
