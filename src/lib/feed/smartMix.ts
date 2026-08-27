import { scoreWithEngagementCaps } from "@/lib/ranking/engagementCaps";
import { applyFairnessToScore, enforceResolutionCap } from "@/lib/fairness/guardrails";
import { missionDiscoveryHook } from "@/lib/discovery/hiddenGems";

export type ContentType = "ugc" | "trailer";

export type MixItem = {
  id: string;
  contentType: ContentType;
  baseScore: number;
  engagement?: { xpDelta?: number; missionBoost?: number; squadBoost?: number; harmonyBoost?: number };
  tags?: string[];
  createdAtMs?: number;
};

export type Lane = "event" | "mission" | "squad" | "baseline" | "hidden_gem";

export type MixResult =
  | {
      ok: true;
      lanes: { lane: Lane; label: string; count: number }[];
      items: (MixItem & { score: number; lane: Lane; laneLabel: string })[];
      meta: { tookMs: number; cache: "hit" | "miss"; escalation: "none" | "server"; note?: string };
    }
  | { ok: false; error: string; tookMs?: number };

function nowMs() {
  return Date.now();
}
function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function laneFor(item: MixItem): Lane {
  const e = item.engagement || {};
  if ((e.missionBoost || 0) > 0) return "mission";
  if ((e.squadBoost || 0) > 0) return "squad";
  if ((e.harmonyBoost || 0) > 0) return "event";

  const ageMs = item.createdAtMs ? nowMs() - item.createdAtMs : 999999999;
  if (item.baseScore < 0.35 && ageMs < 1000 * 60 * 60 * 24 * 7) return "hidden_gem";
  return "baseline";
}

function laneLabel(l: Lane): string {
  switch (l) {
    case "event":
      return "Pulse Event";
    case "mission":
      return "Mission";
    case "squad":
      return "Squad";
    case "hidden_gem":
      return "Hidden Gem";
    default:
      return "For You";
  }
}

export function buildSmartMix(input: MixItem[], opts?: { limit?: number; tookBudgetMs?: number }): MixResult {
  const t0 = nowMs();
  const limit = clamp(opts?.limit ?? 60, 1, 200);
  const budget = clamp(opts?.tookBudgetMs ?? 50, 10, 200);

  if (!Array.isArray(input)) return { ok: false, error: "input_not_array" };

  const items = input
    .filter((x) => x && typeof x.id === "string" && x.id.length > 0 && Number.isFinite(x.baseScore))
    .slice(0, 2000)
    .map((x) => {
      const lane = laneFor(x);
      const score0 = scoreWithEngagementCaps(x.baseScore, x.engagement);
      const fairness = enforceResolutionCap({ tier: (x as any).tier ?? "free", width: (x as any).width ?? 1280, height: (x as any).height ?? 720 });
      const score = applyFairnessToScore({ score: score0, fairness });
      const hg = missionDiscoveryHook({ views: (x as any).views ?? 0, likes: (x as any).likes ?? 0, reactions: (x as any).reactions ?? 0, comments: (x as any).comments ?? 0, shares: (x as any).shares ?? 0, ageHours: (x as any).ageHours ?? 0 });
      return { ...x, lane, laneLabel: laneLabel(lane), score, fairness, hiddenGemHint: hg.hint, hiddenGemRatio: hg.ratio };
    });

  items.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return (b.createdAtMs || 0) - (a.createdAtMs || 0);
  });

  const out = items.slice(0, limit);

  const laneCounts = new Map<Lane, number>();
  for (const it of out) laneCounts.set(it.lane, (laneCounts.get(it.lane) || 0) + 1);

  const lanes = (["event", "mission", "squad", "hidden_gem", "baseline"] as Lane[])
    .filter((l) => (laneCounts.get(l) || 0) > 0)
    .map((l) => ({ lane: l, label: laneLabel(l), count: laneCounts.get(l) || 0 }));

  const tookMs = nowMs() - t0;
  const escalation: "none" | "server" = tookMs > budget ? "server" : "none";
  const note = escalation === "server" ? `tookMs>${budget} (consider server escalation)` : undefined;

  return { ok: true, lanes, items: out, meta: { tookMs, cache: "miss", escalation, note } };
}


export type FeedItem = {
  id: string;
  kind: string;
  score: number;
};

export type SmartMixInput = {
  items: FeedItem[];
  expectedCpuMs: number;
  budgetMs?: number;
};

export type SmartMixResult = {
  ok: true;
  mode: "worker" | "origin";
  items: FeedItem[];
  remainingMs: number;
};

export function assembleSmartMix(input: SmartMixInput): SmartMixResult {
  const budgetMs = Number.isFinite(input.budgetMs) ? Math.max(0, Number(input.budgetMs)) : 50;
  const expectedCpuMs = Math.max(0, Number(input.expectedCpuMs || 0));
  const items = [...input.items].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.id.localeCompare(b.id);
  });

  return {
    ok: true,
    mode: expectedCpuMs <= budgetMs ? "worker" : "origin",
    items,
    remainingMs: Math.max(0, budgetMs - expectedCpuMs),
  };
}
