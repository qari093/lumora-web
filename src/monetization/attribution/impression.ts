export type AdImpression = {
  impressionId: string;
  adId: string;
  campaignId: string;
  userId: string;
  contentId?: string;
  shownAt: number;
  state: "green" | "yellow" | "red";
  valid: boolean;
};

export function createAdImpression(input: Omit<AdImpression, "valid">): AdImpression {
  return {
    ...input,
    valid: input.state !== "red" && input.shownAt > 0,
  };
}
