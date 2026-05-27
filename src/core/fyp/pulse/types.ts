import type { AtmosphereMode, FeedItem } from "../core/types";

export type PulseModeSession = {
  sessionId: string;
  userId: string;
  mode: AtmosphereMode;
  startedAt: number;
  expiresAt: number;
  active: boolean;
};

export type PulseInjection = {
  contentId: string;
  mode: AtmosphereMode;
  voltage: number;
  injectedAt: number;
};

export type PulseSequence = {
  sequenceId: string;
  mode: AtmosphereMode;
  durationSeconds: number;
  items: FeedItem[];
};
