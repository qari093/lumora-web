export type SeedItem = {
  id: string;
  portal: "FYP" | "GMAR" | "NEXA" | "LIVE" | "MOVIES" | "MUSIC";
  title: string;
  kind: "video" | "post" | "room" | "drop" | "track";
  active: boolean;
};

export type SeedPlanInput = {
  items?: SeedItem[] | null;
};

export type SeedPlanResult =
  | {
      ok: true;
      summary: {
        total: number;
        active: number;
        byPortal: Record<string, number>;
      };
    }
  | { ok: false; reason: string };

const PORTALS = new Set(["FYP", "GMAR", "NEXA", "LIVE", "MOVIES", "MUSIC"]);
const KINDS = new Set(["video", "post", "room", "drop", "track"]);

export function validateSeedPlan(input: SeedPlanInput): SeedPlanResult {
  const items = Array.isArray(input.items) ? input.items : [];
  if (items.length === 0) return { ok: false, reason: "missing_items" };

  const ids = new Set<string>();
  const byPortal: Record<string, number> = {};
  let active = 0;

  for (const item of items) {
    if (!item?.id?.trim()) return { ok: false, reason: "missing_id" };
    if (ids.has(item.id)) return { ok: false, reason: "duplicate_id" };
    ids.add(item.id);

    if (!PORTALS.has(item.portal)) return { ok: false, reason: "invalid_portal" };
    if (!KINDS.has(item.kind)) return { ok: false, reason: "invalid_kind" };
    if (!item.title?.trim()) return { ok: false, reason: "missing_title" };

    byPortal[item.portal] = (byPortal[item.portal] || 0) + 1;
    if (item.active) active += 1;
  }

  return {
    ok: true,
    summary: {
      total: items.length,
      active,
      byPortal,
    },
  };
}
