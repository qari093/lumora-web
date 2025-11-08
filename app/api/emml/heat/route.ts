import { NextResponse } from "next/server";

// Lazy Prisma to avoid edge-bundle issues in dev
let prisma: any;
function getPrisma() {
  if (!prisma) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { PrismaClient } = require("@prisma/client");
    prisma = new PrismaClient();
  }
  return prisma;
}

// Try to find a model that stores emotion events, regardless of naming.
// We wont rely on types – access dynamically and guard at runtime.
async function fetchRecentEmotionEvents(hours = 24) {
  const p = getPrisma();

  // candidate model names commonly used in your repo history
  const modelNames = [
    "emotionEvent",
    "EmotionEvent",
    "emotion_log",
    "emotionLogs",
    "moodEvent",
    "MoodEvent",
    "emotion",
    "Emotion",
  ];

  // for time field candidates
  const timeFields = ["createdAt", "ts", "at", "time", "timestamp"];

  const since = new Date(Date.now() - hours * 3600 * 1000);

  for (const name of modelNames) {
    const model: any = (p as any)[name];
    if (!model || typeof model.findMany !== "function") continue;

    // Try to build a query using the first time field that works
    for (const tf of timeFields) {
      try {
        // Try a minimal query to see if the field exists
        const rows = await model.findMany({
          where: { [tf]: { gte: since } },
          select: { emotion: true, intensity: true, [tf]: true },
          take: 1000,
          orderBy: { [tf]: "desc" as const },
        });
        if (Array.isArray(rows)) return rows;
      } catch {
        // try next time field
      }
    }

    // Fallback: no time filter (last 1000 rows). Not ideal, but better than empty
    try {
      const rows = await model.findMany({
        select: { emotion: true, intensity: true },
        take: 1000,
        orderBy: { id: "desc" as const },
      });
      if (Array.isArray(rows)) return rows;
    } catch {
      // try next model
    }
  }

  // Nothing matched
  return [];
}

type HeatGroup = { emotion: string; count: number; avgIntensity: number };

function aggregate(events: Array<{ emotion?: string | null; intensity?: number | null }>): HeatGroup[] {
  const acc = new Map<string, { c: number; s: number }>();
  for (const e of events) {
    const emo = (e.emotion || "").toString().trim().toLowerCase();
    if (!emo) continue;
    const x = typeof e.intensity === "number" ? e.intensity : null;
    if (x == null || Number.isNaN(x)) continue;
    const cur = acc.get(emo) || { c: 0, s: 0 };
    cur.c += 1;
    cur.s += x;
    acc.set(emo, cur);
  }
  return Array.from(acc.entries())
    .map(([emotion, v]) => ({
      emotion,
      count: v.c,
      avgIntensity: v.c ? +(v.s / v.c).toFixed(2) : 0,
    }))
    // sort by count desc, then emotion
    .sort((a, b) => (b.count - a.count) || a.emotion.localeCompare(b.emotion));
}

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await fetchRecentEmotionEvents(24);
    const groups = aggregate(rows);
    return NextResponse.json({ ok: true, groups }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
