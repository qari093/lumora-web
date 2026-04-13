export type StarterSeedItem = {
  id: string;
  portal: "FYP" | "GMAR" | "NEXA" | "LIVE" | "MOVIES" | "MUSIC";
  title: string;
  category: string;
  active: boolean;
};

export type StarterContentSeedInput = {
  items?: StarterSeedItem[] | null;
};

export type StarterContentSeedResult =
  | {
      ok: true;
      seed: {
        total: number;
        active: number;
        portalsCovered: number;
        ready: boolean;
      };
    }
  | { ok: false; reason: string };

const PORTALS = new Set(["FYP", "GMAR", "NEXA", "LIVE", "MOVIES", "MUSIC"]);

export function evaluateStarterContentSeed(
  input: StarterContentSeedInput
): StarterContentSeedResult {
  const items = Array.isArray(input.items) ? input.items : [];
  if (items.length === 0) return { ok: false, reason: "missing_items" };

  const ids = new Set<string>();
  const covered = new Set<string>();
  let active = 0;

  for (const item of items) {
    if (!item.id?.trim()) return { ok: false, reason: "missing_id" };
    if (ids.has(item.id)) return { ok: false, reason: "duplicate_id" };
    ids.add(item.id);

    if (!PORTALS.has(item.portal)) return { ok: false, reason: "invalid_portal" };
    if (!item.title?.trim()) return { ok: false, reason: "missing_title" };
    if (!item.category?.trim()) return { ok: false, reason: "missing_category" };

    covered.add(item.portal);
    if (item.active) active += 1;
  }

  return {
    ok: true,
    seed: {
      total: items.length,
      active,
      portalsCovered: covered.size,
      ready: covered.size === PORTALS.size && active >= PORTALS.size,
    },
  };
}
