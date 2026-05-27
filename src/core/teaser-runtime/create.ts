import type { TeaserAsset, TeaserPlatform } from "./types";

export function createTeaserAsset(input: { sourceId: string; platform: TeaserPlatform }): TeaserAsset {
  return {
    id: `teaser-${input.platform}-${input.sourceId}`,
    sourceId: input.sourceId,
    platform: input.platform,
    durationSeconds: 27,
  };
}
