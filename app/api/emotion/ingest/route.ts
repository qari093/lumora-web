import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

const G: any = globalThis as any;
G.__emmlRate = G.__emmlRate || new Map();
G.__emmlSeen = G.__emmlSeen || new Map();

const ONE_MIN = 60_000;
const LIMIT_PER_MIN = 60;

const ipOf = (req: NextRequest) => {
  const xf = req.headers.get("x-forwarded-for");
  return xf ? xf.split(",")[0].trim() : "unknown";
};

const rateOk = (key: string) => {
  const now = Date.now();
  const slot = Math.floor(now / ONE_MIN);
  const rec = G.__emmlRate.get(key);
  if (!rec || rec.ts !== slot) {
    G.__emmlRate.set(key, { ts: slot, count: 1 });
    return true;
  }
  if (rec.count >= LIMIT_PER_MIN) return false;
  rec.count++;
  return true;
};

const ALLOWED = new Set(["joy","calm","focus","love","stress","anxious","bored","excited","confident","tired","neutral"]);
const KINDS = new Set(["mood","celebration","check-in","party","stream","stream_reaction","stream-reaction"]);

function normalize(e: any) {
  const k = String(e?.type ?? e?.kind ?? "mood").toLowerCase();
  const kind = KINDS.has(k) ? k : "mood";
  const emo = String(e?.emotion ?? "").toLowerCase();
  const emotion = ALLOWED.has(emo) ? (emo as any) : null;
  let intensity = Number(e?.intensity);
  if (!Number.isFinite(intensity)) intensity = null as any;
  if (intensity != null) {
    if (intensity < 0) intensity = 0;
    if (intensity > 1) intensity = 1;
  }
  const userId = typeof e?.userId === "string" ? e.userId : null;
  const source = typeof e?.source === "string" ? e.source : null;
  const meta = (e?.meta && typeof e.meta === "object") ? e.meta : {};
  return { kind, emotion, intensity, userId, source, meta };
}

const dedupeKey = (n: any) => {
  const slot = Math.floor(Date.now() / ONE_MIN);
  const inten = n.intensity == null ? "n" : Math.round(n.intensity * 100) / 100;
  return [n.kind, n.emotion ?? "null", n.userId ?? "anon", inten, slot].join("|");
};

async function persistDB(list: any[]) {
  try {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();
    const data = list.map(v => ({
      kind: v.kind,
      emotion: v.emotion,
      intensity: v.intensity as any,
      userId: v.userId,
      source: v.source,
      meta: v.meta as any,
    }));
    let inserted = 0;
    // chunk to be safe
    for (let i = 0; i < data.length; i += 100) {
      const slice = data.slice(i, i + 100);
      const r: any = await (prisma as any).emotionEvent.createMany({ data: slice });
      inserted += Number(r?.count || 0);
    }
    await prisma.$disconnect().catch(() => {});
    return { ok: true, inserted };
  } catch (e: any) {
    return { ok: false, error: String(e?.message || e) };
  }
}

export async function POST(req: NextRequest) {
  try {
    const expected = process.env.EMML_API_KEY || "DEMO_KEY";
    const api = req.headers.get("x-api-key") || "";
    if (!expected || api !== expected) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const ip = ipOf(req);
    if (!rateOk(`ip:${ip}`)) {
      return new NextResponse("Rate limit exceeded", { status: 429 });
    }

    const body = await req.json().catch(() => null as any);
    const events = Array.isArray(body?.events) ? body.events : [];
    if (!events.length) {
      return NextResponse.json({ ok: false, error: "No events" }, { status: 400 });
    }

    // prune old dedupe keys
    const now = Date.now();
    for (const [k, ts] of Array.from(G.__emmlSeen.entries())) {
      if (now - Number(ts) > 3 * ONE_MIN) G.__emmlSeen.delete(k);
    }

    const accepted: any[] = [];
    let deduped = 0;
    for (const raw of events) {
      const n = normalize(raw);
      const dk = dedupeKey(n);
      if (G.__emmlSeen.has(dk)) {
        deduped++;
        continue;
      }
      G.__emmlSeen.set(dk, now);
      accepted.push(n);
    }

    if (!accepted.length) {
      return NextResponse.json({ ok: true, stored: "db", inserted: 0, accepted: 0, deduped });
    }

    const db = await persistDB(accepted);
    if (!db.ok) {
      return NextResponse.json({ ok: false, error: db.error }, { status: 500 });
    }
    return NextResponse.json({ ok: true, stored: "db", inserted: db.inserted, accepted: accepted.length, deduped });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, route: "/api/emotion/ingest", hint: "POST with x-api-key" });
}
