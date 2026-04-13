import type { SafeSeedRegistryEntry } from "./safeSeedRegistry";

export const MUSIC_TEASER_RAIL_ID = "music-teaser-starter-rail" as const;

export type MusicTeaserRail = {
  id: typeof MUSIC_TEASER_RAIL_ID;
  title: string;
  lane: "official-teasers";
  active: boolean;
  items: SafeSeedRegistryEntry[];
};

export const MUSIC_TEASER_RAIL: MusicTeaserRail = {
  id: MUSIC_TEASER_RAIL_ID,
  title: "Music Teaser Starters",
  lane: "official-teasers",
  active: true,
  items: [
    {
      id: "music-teaser-001",
      bucket: "starter",
      priority: 120,
      active: true,
      tags: ["music", "teaser", "starter", "soundtrack"],
      card: {
        id: "music-teaser-001",
        type: "teaser",
        title: "Music Drop Preview",
        subtitle: "Curated soundtrack discovery seed",
        sourceName: "Lumora Editorial",
        category: "music",
        language: "en",
        region: "global",
        trustScore: 95,
      },
    },
    {
      id: "music-teaser-002",
      bucket: "starter",
      priority: 130,
      active: true,
      tags: ["music", "teaser", "starter", "artist"],
      card: {
        id: "music-teaser-002",
        type: "teaser",
        title: "Artist Comeback Teaser",
        subtitle: "Curated artist reveal seed",
        sourceName: "Lumora Editorial",
        category: "music",
        language: "en",
        region: "global",
        trustScore: 94,
      },
    },
  ],
};

export function getActiveMusicTeaserRail(): MusicTeaserRail {
  return {
    ...MUSIC_TEASER_RAIL,
    items: MUSIC_TEASER_RAIL.items.filter((item) => item.active),
  };
}
