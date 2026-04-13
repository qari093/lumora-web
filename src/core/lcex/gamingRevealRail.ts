import type { SafeSeedRegistryEntry } from "./safeSeedRegistry";

export const GAMING_REVEAL_RAIL_ID = "gaming-reveal-starter-rail" as const;

export type GamingRevealRail = {
  id: typeof GAMING_REVEAL_RAIL_ID;
  title: string;
  lane: "official-teasers";
  active: boolean;
  items: SafeSeedRegistryEntry[];
};

export const GAMING_REVEAL_RAIL: GamingRevealRail = {
  id: GAMING_REVEAL_RAIL_ID,
  title: "Gaming Reveal Starters",
  lane: "official-teasers",
  active: true,
  items: [
    {
      id: "gaming-reveal-001",
      bucket: "starter",
      priority: 140,
      active: true,
      tags: ["gaming", "reveal", "starter", "launch"],
      card: {
        id: "gaming-reveal-001",
        type: "teaser",
        title: "Game Reveal Spotlight",
        subtitle: "Curated reveal discovery seed",
        sourceName: "Lumora Editorial",
        category: "gaming",
        language: "en",
        region: "global",
        trustScore: 95,
      },
    },
    {
      id: "gaming-reveal-002",
      bucket: "starter",
      priority: 150,
      active: true,
      tags: ["gaming", "expansion", "starter", "event"],
      card: {
        id: "gaming-reveal-002",
        type: "teaser",
        title: "Expansion Teaser Drop",
        subtitle: "Curated expansion hype seed",
        sourceName: "Lumora Editorial",
        category: "gaming",
        language: "en",
        region: "global",
        trustScore: 94,
      },
    },
  ],
};

export function getActiveGamingRevealRail(): GamingRevealRail {
  return {
    ...GAMING_REVEAL_RAIL,
    items: GAMING_REVEAL_RAIL.items.filter((item) => item.active),
  };
}
