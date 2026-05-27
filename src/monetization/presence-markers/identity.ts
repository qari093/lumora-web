export type PresenceMarkerIdentity = {
  sponsorId: string;
  sponsorName: string;
  markerType: "shimmer_line" | "soft_halo" | "quiet_badge";
  accent: string;
  disclosure: "Sponsored";
};

export function createPresenceMarkerIdentity(input: {
  sponsorId: string;
  sponsorName: string;
  markerType?: PresenceMarkerIdentity["markerType"];
  accent?: string;
}): PresenceMarkerIdentity {
  return {
    sponsorId: input.sponsorId,
    sponsorName: input.sponsorName,
    markerType: input.markerType || "shimmer_line",
    accent: input.accent || "lumora-soft",
    disclosure: "Sponsored",
  };
}
