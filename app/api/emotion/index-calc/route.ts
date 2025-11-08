import { NextResponse } from "next/server";

type Row = { emotion: string | null; count: number; sum: number };

async function rollupLast5m() {
  const now = Date.now();
  const since = new Date(now - 5 * 60 * 1000);

  try {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();

    const recent = await (prisma as any).emotionEvent.findMany({
      where: { createdAt: { gte: since } },
      orderBy: { createdAt: "desc" },
      take: 2000,
    });

    const map = new Map<string, Row>();
    for (const e of recent) {
      const emo = (e.emotion ?? null) as string | null;
      const key = emo ?? "null";
      const prev = map.get(key) ?? { emotion: emo, count: 0, sum: 0 };
      const inten =
        typeof e.intensity === "number" && isFinite(e.intensity) ? e.intensity : 0;
      prev.count += 1;
      prev.sum += inten;
      map.set(key, prev);
    }

    const per = Array.from(map.values())
      .map((r) => ({
        emotion: r.emotion,
        count: r.count,
        avg: r.count ? r.sum / r.count : 0,
      }))
      .filter((r) => r.count > 0);

    const globalEi = per.length
      ? per.reduce((a, b) => a + b.avg, 0) / per.length
      : 0;

    try {
      await (prisma as any).emotionMarketTick.create({
        data: {
          emotion: null,
          ei: globalEi,
          globalEi,
          zenMultiplier: null,
        },
      });

      const today = new Date();
      const day = new Date(
        Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
      );
      for (const r of per) {
        if (!r.emotion) continue;
        const cur = await (prisma as any).emotionIndexDaily.findUnique({
          where: { day_emotion: { day, emotion: r.emotion } },
        });
        if (!cur) {
          await (prisma as any).emotionIndexDaily.create({
            data: {
              day,
              emotion: r.emotion,
              ei: r.avg,
              count: r.count,
              avgIntensity: r.avg,
            },
          });
        } else {
          const newCount = (cur.count ?? 0) + r.count;
          const newSum =
            (cur.avgIntensity ?? 0) * (cur.count ?? 0) + r.avg * r.count;
          const newAvg = newCount ? newSum / newCount : 0;
          await (prisma as any).emotionIndexDaily.update({
            where: { day_emotion: { day, emotion: r.emotion } },
            data: { count: newCount, avgIntensity: newAvg, ei: newAvg },
          });
        }
      }

      await prisma.$disconnect().catch(() => {});
      return {
        ok: true,
        windowStart: since.toISOString(),
        events: recent.length,
        globalEi,
        per,
      };
    } catch (e: any) {
      await prisma.$disconnect().catch(() => {});
      return {
        ok: true,
        windowStart: since.toISOString(),
        events: recent.length,
        globalEi,
        per,
        note: "persist skipped",
        error: String(e?.message || e),
      };
    }
  } catch {
    try {
      const { readFile } = await import("fs/promises");
      const raw = await readFile(".data/emml_events.json", "utf8").catch(() => "[]");
      const arr = JSON.parse(raw);
      const recent = Array.isArray(arr)
        ? arr.filter((e: any) => Number(e.ts || 0) >= since.getTime())
        : [];
      const map = new Map<string, Row>();
      for (const e of recent) {
        const emo = (e.emotion ?? null) as string | null;
        const key = emo ?? "null";
        const prev = map.get(key) ?? { emotion: emo, count: 0, sum: 0 };
        const inten =
          typeof e.intensity === "number" && isFinite(e.intensity) ? e.intensity : 0;
        prev.count += 1;
        prev.sum += inten;
        map.set(key, prev);
      }
      const per = Array.from(map.values())
        .map((r) => ({
          emotion: r.emotion,
          count: r.count,
          avg: r.count ? r.sum / r.count : 0,
        }))
        .filter((r) => r.count > 0);
      const globalEi = per.length
        ? per.reduce((a, b) => a + b.avg, 0) / per.length
        : 0;
      return {
        ok: true,
        windowStart: since.toISOString(),
        source: "file",
        events: recent.length,
        globalEi,
        per,
      };
    } catch (e: any) {
      return { ok: false, error: String(e?.message || e) };
    }
  }
}

export async function POST() {
  const result = await rollupLast5m();
  return NextResponse.json(result);
}

export async function GET() {
  return NextResponse.json({ ok: true, hint: "POST to compute a 5-minute rollup" });
}
