export const observabilityDomains = [
  "fyp-impressions",
  "watch-conversion",
  "civilization-energy",
  "memory-saves",
  "rights-incidents",
] as const;

export function trackWatchConversion(impressions: number, watches: number) {
  if (impressions <= 0) return 0;
  return watches / impressions;
}

export function createFypEvent(event: {
  teaserId: string;
  userId: string;
}) {
  return {
    tracked: true,
    firstParty: true,
    ...event,
  };
}

export function buildHealthSeal() {
  return {
    analytics: "healthy",
    firehose: "healthy",
    rights: "healthy",
  };
}
