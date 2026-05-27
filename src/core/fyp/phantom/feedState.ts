import type {
  PhantomFeedAccess,
  PhantomFeedState
} from "./types";

import { assertPhantomAccess } from "./access";

export function createPhantomFeedState(input: {
  access: PhantomFeedAccess;
  now: number;
}): PhantomFeedState {
  assertPhantomAccess({
    access: input.access,
    now: input.now
  });

  return {
    userId: input.access.userId,
    active: true,
    anonymousMode: true,
    visibleMetrics: false,
    undergroundRankOnly: true
  };
}
