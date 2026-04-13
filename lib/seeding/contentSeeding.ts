export type SeedPortal =
  | "fyp"
  | "gmar"
  | "nexa"
  | "live"
  | "cineverse"
  | "videos";

export type SeedItem = {
  id: string;
  portal: SeedPortal;
  title: string;
  score?: number;
  createdAt: number;
};

export type SeedConfig = {
  enabled: boolean;
  portalCaps?: Partial<Record<SeedPortal, number>>;
};

const DEFAULT_CAPS: Record<SeedPortal, number> = {
  fyp: 5,
  gmar: 3,
  nexa: 3,
  live: 2,
  cineverse: 3,
  videos: 4
};

export function buildSeedFeed(
  items: SeedItem[],
  config: SeedConfig
): SeedItem[] {
  if (!config.enabled) return [];
  if (!Array.isArray(items) || items.length === 0) return [];

  const caps = { ...DEFAULT_CAPS, ...(config.portalCaps ?? {}) };
  const byPortalCount: Partial<Record<SeedPortal, number>> = {};

  const sorted = [...items].sort((a, b) => {
    const scoreDiff = (b.score ?? 0) - (a.score ?? 0);
    if (scoreDiff !== 0) return scoreDiff;
    return b.createdAt - a.createdAt;
  });

  const out: SeedItem[] = [];

  for (const item of sorted) {
    const used = byPortalCount[item.portal] ?? 0;
    const cap = caps[item.portal] ?? 0;
    if (used >= cap) continue;
    byPortalCount[item.portal] = used + 1;
    out.push(item);
  }

  return out;
}
