export type LumoraTeaserPayload = {
  teaserId: string;
  destination: "lumora-fyp";
  trackingEnabled: boolean;
  deepLink: string;
};

export function createLumoraTeaserPayload(teaserId = "teaser_1"): LumoraTeaserPayload {
  return {
    teaserId,
    destination: "lumora-fyp",
    trackingEnabled: true,
    deepLink: `/cineverse/open-teaser/${teaserId}`,
  };
}

export function trackLumoraImpression(userId: string) {
  return {
    userId,
    tracked: Boolean(userId),
  };
}
