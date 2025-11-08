// DB-first heat summary with strict filtering
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

type Row = { emotion: string; count: number; avg: number };

async function fromDB(): Promise<Row[]> {
  try {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();
    const rows = await (prisma as any).emotionEvent.groupBy({
      by: ["emotion"],
      _count: { emotion: true },
      _avg: { intensity: true },
    });
    await prisma.$disconnect().catch(() => {});
    return rows
      .filter((r: any) => !!r.emotion && (r._count?.emotion ?? 0) > 0)
      .map((r: any) => ({
        emotion: r.emotion,
        count: r._count?.emotion ?? 0,
        avg: Number.isFinite(r._avg?.intensity) ? Math.round(Number(r._avg.intensity) * 100) / 100 : 0,
      }))
      .sort((a: Row, b: Row) => b.count - a.count);
  } catch {
    return [];
  }
}

async function fromFile(): Promise<Row[]> {
  try {
    const { readFile } = await import("fs/promises");
    const raw = await readFile(".data/emml_events.json", "utf8").catch(() => "[]");
    const arr = JSON.parse(raw);
    const m = new Map<string, { c: number; s: number }>();
    for (const e of arr) {
      const emo = String(e?.emotion ?? "");
      if (!emo) continue;
      const inten = Number(e?.intensity ?? 0);
      const v = m.get(emo) ?? { c: 0, s: 0 };
      v.c++; v.s += Number.isFinite(inten) ? inten : 0;
      m.set(emo, v);
    }
    return Array.from(m, ([emotion, v]) => ({
      emotion,
      count: v.c,
      avg: v.c ? Math.round((v.s / v.c) * 100) / 100 : 0,
    })).filter(r => r.count > 0).sort((a, b) => b.count - a.count);
  } catch {
    return [];
  }
}

export async function GET() {
  const db = await fromDB();
  if (db.length) return NextResponse.json({ ok: true, data: db });
  const file = await fromFile();
  return NextResponse.json({ ok: true, data: file });
}
