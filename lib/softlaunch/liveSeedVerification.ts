export type LiveSeedItem = {
  id: string;
  portal: "LIVE";
  title: string;
  roomType: "audio" | "video" | "community" | "event";
  active: boolean;
  joinable: boolean;
  hostReady: boolean;
  score: number;
};

export type LiveSeedVerificationInput = {
  items?: LiveSeedItem[] | null;
};

export type LiveSeedVerificationResult =
  | {
      ok: true;
      verification: {
        total: number;
        active: number;
        joinable: number;
        hostReady: number;
        averageScore: number;
        ready: boolean;
      };
    }
  | { ok: false; reason: string };

const ROOM_TYPES = new Set(["audio", "video", "community", "event"]);

function round2(v: number) {
  return Math.round(v * 100) / 100;
}

export function evaluateLiveSeedVerification(
  input: LiveSeedVerificationInput
): LiveSeedVerificationResult {
  const items = Array.isArray(input.items) ? input.items : [];
  if (items.length === 0) return { ok: false, reason: "missing_items" };

  const ids = new Set<string>();
  let active = 0;
  let joinable = 0;
  let hostReady = 0;
  let totalScore = 0;

  for (const item of items) {
    if (!item.id?.trim()) return { ok: false, reason: "missing_id" };
    if (ids.has(item.id)) return { ok: false, reason: "duplicate_id" };
    ids.add(item.id);

    if (item.portal !== "LIVE") return { ok: false, reason: "invalid_portal" };
    if (!item.title?.trim()) return { ok: false, reason: "missing_title" };
    if (!ROOM_TYPES.has(item.roomType)) return { ok: false, reason: "invalid_room_type" };
    if (!Number.isFinite(item.score) || item.score < 0 || item.score > 1) {
      return { ok: false, reason: "invalid_score" };
    }

    if (item.active) active += 1;
    if (item.joinable) joinable += 1;
    if (item.hostReady) hostReady += 1;
    totalScore += item.score;
  }

  const averageScore = round2(totalScore / items.length);

  return {
    ok: true,
    verification: {
      total: items.length,
      active,
      joinable,
      hostReady,
      averageScore,
      ready: active >= 3 && joinable >= 3 && hostReady >= 3 && averageScore >= 0.65,
    },
  };
}
