export const remoteConfig = {
  modes: {
    chill: { enabled: true },
    focus: { enabled: true },
    surge: { enabled: true },
  },
  ads: {
    enabled: true,
    internalOnly: true,
    sponsoredSlots: 1,
  },
  surge: {
    duels: false,
    predictions: false,
    flashChallenges: false,
  },
  safety: {
    cooldownMinutes: 5,
    fatigueThreshold: 0.8,
    sessionBreaks: true,
  },
} as const;

export type RemoteConfig = typeof remoteConfig;
