export type VideosPortalSeedItem = {
  id: string;
  portal: "MOVIES" | "MUSIC";
  title: string;
  mediaType: "video" | "trailer" | "track";
  active: boolean;
  durationSec: number;
  score: number;
};

export type VideosPortalSeedVerificationInput = {
  items?: VideosPortalSeedItem[] | null;
};

export type VideosPortalSeedVerificationResult =
  | {
      ok: true;
      verification: {
        total: number;
        active: number;
        portalsCovered: number;
        averageScore: number;
        ready: boolean;
      };
    }
  | { ok: false; reason: string };

const PORTALS = new Set(["MOVIES", "MUSIC"]);
const MEDIA_TYPES = new Set(["video", "trailer", "track"]);

function round2(v: number) {
  return Math.round(v * 100) / 100;
}

export function evaluateVideosPortalSeedVerification(
  input: VideosPortalSeedVerificationInput
): VideosPortalSeedVerificationResult {
  const items = Array.isArray(input.items) ? input.items : [];
  if (items.length === 0) return { ok: false, reason: "missing_items" };

  const ids = new Set<string>();
  const covered = new Set<string>();
  let active = 0;
  let totalScore = 0;

  for (const item of items) {
    if (!item.id?.trim()) return { ok: false, reason: "missing_id" };
    if (ids.has(item.id)) return { ok: false, reason: "duplicate_id" };
    ids.add(item.id);

    if (!PORTALS.has(item.portal)) return { ok: false, reason: "invalid_portal" };
    if (!MEDIA_TYPES.has(item.mediaType)) return { ok: false, reason: "invalid_media_type" };
    if (!item.title?.trim()) return { ok: false, reason: "missing_title" };
    if (!Number.isFinite(item.durationSec) || item.durationSec <= 0) {
      return { ok: false, reason: "invalid_duration" };
    }
    if (!Number.isFinite(item.score) || item.score < 0 || item.score > 1) {
      return { ok: false, reason: "invalid_score" };
    }

    covered.add(item.portal);
    if (item.active) active += 1;
    totalScore += item.score;
  }

  const averageScore = round2(totalScore / items.length);

  return {
    ok: true,
    verification: {
      total: items.length,
      active,
      portalsCovered: covered.size,
      averageScore,
      ready: covered.size === PORTALS.size && active >= 3 && averageScore >= 0.6,
    },
  };
}
