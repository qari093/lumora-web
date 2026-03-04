import { NextResponse } from "next/server";
import { ttlGet, ttlSet } from "@/lib/cache/ttl";
import { applyEngagementBoost } from "@/lib/ranking/score";

// Best-effort prisma import: do not fail build if prisma path differs
let prisma: any = null;
try {
  // common in this repo
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  prisma = require("@/lib/prisma").prisma ?? require("@/lib/prisma").default ?? require("@/lib/prisma");
} catch {
  prisma = null;
}

export const runtime = "nodejs";

type FeedItem = {
  id: string;
  contentType: "ugc" | "trailer";
  createdAt: string;
  title?: string | null;
  caption?: string | null;
  // precomputed base score
  baseScore: number;
  lane: "event" | "mission" | "standard";
  score: number;
  boostApplied: number;
};

function json(data: any, status = 200) {
  return NextResponse.json(data, { status, headers: { "cache-control": "no-store" } });
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const limit = Math.max(1, Math.min(50, Number(url.searchParams.get("limit") || "20")));
    const contentType = (url.searchParams.get("contentType") || "ugc") as "ugc" | "trailer";
    const lane = (url.searchParams.get("lane") || "standard") as "event" | "mission" | "standard";
    const userId = url.searchParams.get("userId") || ""; // optional for engagement boosts

    const cacheKey = `rank:feed:v1:${contentType}:${lane}:${limit}:${userId || "-"}`;
    const cached = await ttlGet<{ ok: boolean; items: FeedItem[] }>(cacheKey);
    if (cached?.ok && Array.isArray(cached.items)) {
      return json({ ...cached, cached: true }, 200);
    }

    // If prisma isn't available, still return a deterministic stub (keeps portal alive)
    if (!prisma) {
      const now = new Date().toISOString();
      const stub: FeedItem[] = Array.from({ length: Math.min(5, limit) }).map((_, i) => {
        const baseScore = 100 - i;
        const { score, boostApplied } = applyEngagementBoost({
          baseScore,
          isMissionLane: lane === "mission",
          engagement: { xpBalance: 0, harmonyLevel: 0, squadScore: 0 },
        });
        return {
          id: `stub_${contentType}_${lane}_${i}`,
          contentType,
          createdAt: now,
          title: contentType === "trailer" ? "Trailer" : "UGC",
          caption: "Ranking feed stub (prisma unavailable)",
          baseScore,
          lane,
          score,
          boostApplied,
        };
      });
      const out = { ok: true, items: stub, degraded: true };
      await ttlSet(cacheKey, out, 2500);
      return json({ ...out, cached: false }, 200);
    }

    // Engagement snapshot: tiny single-row lookup (no joins)
    let engagement: any = null;
    if (userId) {
      try {
        engagement = await prisma.userEngagement.findUnique({
          where: { userId },
          select: { xpBalance: true, harmonyLevel: true, squadScore: true },
        });
      } catch {
        engagement = null;
      }
    }

    // Content fetch: minimal select, no joins; supports multiple possible models
    const itemsRaw: any[] = await fetchContent(prisma, contentType, limit);

    const items: FeedItem[] = itemsRaw.map((r, idx) => {
      const createdAt = new Date(r.createdAt ?? Date.now()).toISOString();
      const ageMin = Math.max(0, (Date.now() - new Date(createdAt).getTime()) / 60000);
      const recency = 1 / (1 + ageMin / 30); // decays after ~30m
      const likes = Number(r.likes ?? r.likeCount ?? 0);
      const views = Number(r.views ?? r.viewCount ?? 0);

      // base score: recency + lightweight signals, bounded
      const baseScore = clamp(10, 1000, 200 * recency + Math.sqrt(likes) * 10 + Math.log10(1 + views) * 30 - idx);

      const { score, boostApplied } = applyEngagementBoost({
        baseScore,
        isMissionLane: lane === "mission",
        engagement,
      });

      return {
        id: String(r.id),
        contentType,
        createdAt,
        title: r.title ?? null,
        caption: r.caption ?? r.description ?? null,
        baseScore,
        lane,
        score,
        boostApplied,
      };
    }).sort((a, b) => b.score - a.score);

    const out = { ok: true, items };
    await ttlSet(cacheKey, out, 2500); // cache-first: short TTL keeps it fresh without DB hammer
    return json({ ...out, cached: false }, 200);
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "internal_error";
    return json({ ok: false, error: msg, ts: Date.now() }, 500);
  }
}

async function fetchContent(prisma: any, contentType: "ugc" | "trailer", limit: number) {
  // Try likely models without joins
  const candidates = contentType === "trailer"
    ? ["Trailer", "Video", "Media"]
    : ["Video", "Post", "Media"];

  for (const modelName of candidates) {
    const model = prisma[lowerFirst(modelName)];
    if (!model?.findMany) continue;
    try {
      return await model.findMany({
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          createdAt: true,
          title: true,
          caption: true,
          description: true,
          likes: true,
          likeCount: true,
          views: true,
          viewCount: true,
        },
      });
    } catch {
      // next candidate
    }
  }
  return [];
}

function lowerFirst(s: string) {
  return s.slice(0, 1).toLowerCase() + s.slice(1);
}
function clamp(min: number, max: number, v: number) {
  if (!Number.isFinite(v)) return min;
  return Math.max(min, Math.min(max, v));
}
