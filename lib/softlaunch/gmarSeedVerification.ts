export type GmarSeedItem = {
  id: string;
  portal: "GMAR";
  title: string;
  gameType: "challenge" | "event" | "match" | "reward";
  active: boolean;
  playerReady: boolean;
  score: number;
};

export type GmarSeedVerificationInput = {
  items?: GmarSeedItem[] | null;
};

export type GmarSeedVerificationResult =
  | {
      ok: true;
      verification: {
        total: number;
        active: number;
        playerReady: number;
        averageScore: number;
        ready: boolean;
      };
    }
  | { ok: false; reason: string };

const GAME_TYPES = new Set(["challenge", "event", "match", "reward"]);

function round2(v: number) {
  return Math.round(v * 100) / 100;
}

export function evaluateGmarSeedVerification(
  input: GmarSeedVerificationInput
): GmarSeedVerificationResult {
  const items = Array.isArray(input.items) ? input.items : [];
  if (items.length === 0) return { ok: false, reason: "missing_items" };

  const ids = new Set<string>();
  let active = 0;
  let playerReady = 0;
  let totalScore = 0;

  for (const item of items) {
    if (!item.id?.trim()) return { ok: false, reason: "missing_id" };
    if (ids.has(item.id)) return { ok: false, reason: "duplicate_id" };
    ids.add(item.id);

    if (item.portal !== "GMAR") return { ok: false, reason: "invalid_portal" };
    if (!item.title?.trim()) return { ok: false, reason: "missing_title" };
    if (!GAME_TYPES.has(item.gameType)) return { ok: false, reason: "invalid_game_type" };
    if (!Number.isFinite(item.score) || item.score < 0 || item.score > 1) {
      return { ok: false, reason: "invalid_score" };
    }

    if (item.active) active += 1;
    if (item.playerReady) playerReady += 1;
    totalScore += item.score;
  }

  const averageScore = round2(totalScore / items.length);

  return {
    ok: true,
    verification: {
      total: items.length,
      active,
      playerReady,
      averageScore,
      ready: active >= 3 && playerReady >= 3 && averageScore >= 0.65,
    },
  };
}
