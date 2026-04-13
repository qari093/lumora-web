export const LumoraGlobalConfig = {
  modes: ["chill", "focus", "surge"] as const,

  surge: {
    enabled: true,
    duel: true,
    prediction: true,
    flashChallenges: true
  },

  ads: {
    enabled: true,
    internalOnly: true,
    maxSlotsPerFeed: 2
  },

  economy: {
    zencoinEnabled: true,
    dailyCap: 100,
    transactionFeePercent: 5
  },

  safety: {
    cooldownMinutes: 5,
    maxSessionsBeforeBreak: 3,
    fatigueThreshold: 0.8
  }
} as const;
