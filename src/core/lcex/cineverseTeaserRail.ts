import type { SafeSeedRegistryEntry } from "./safeSeedRegistry";

export const CINEVERSE_TEASER_RAIL_ID = "cineverse-teaser-rail" as const;

export type CineverseTeaserRail = {
  id: typeof CINEVERSE_TEASER_RAIL_ID;
  title: string;
  lane: "official-teasers";
  active: boolean;
  items: SafeSeedRegistryEntry[];
};

export const CINEVERSE_TEASER_RAIL: CineverseTeaserRail = {
  id: CINEVERSE_TEASER_RAIL_ID,
  title: "CineVerse Teasers",
  lane: "official-teasers",
  active: true,
  items: [
    {
      id: "cineverse-teaser-001",
      bucket: "starter",
      priority: 100,
      active: true,
      tags: ["cineverse", "movie", "teaser", "starter"],
      card: {
        id: "cineverse-teaser-001",
        type: "teaser",
        title: "CineVerse Launch Teaser",
        subtitle: "Curated film discovery seed",
        sourceName: "Lumora Editorial",
        category: "movie",
        language: "en",
        region: "global",
        trustScore: 95,
      },
    },
    {
      id: "cineverse-teaser-002",
      bucket: "starter",
      priority: 110,
      active: true,
      tags: ["cineverse", "series", "teaser", "starter"],
      card: {
        id: "cineverse-teaser-002",
        type: "teaser",
        title: "CineVerse Series Spotlight",
        subtitle: "Curated series reveal seed",
        sourceName: "Lumora Editorial",
        category: "series",
        language: "en",
        region: "global",
        trustScore: 94,
      },
    },
  ],
};

export function getActiveCineverseTeaserRail(): CineverseTeaserRail {
  return {
    ...CINEVERSE_TEASER_RAIL,
    items: CINEVERSE_TEASER_RAIL.items.filter((item) => item.active),
  };
}
