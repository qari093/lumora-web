import { NextResponse } from "next/server";
import { store, Reading, Tick } from "../_store";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const now = Date.now();

    if (Array.isArray(body.readings)) {
      for (const r of body.readings) {
        if (r && typeof r.slug === "string" && typeof r.value === "number") {
          store.readings.push({ slug: r.slug, value: r.value, ts: now } as Reading);
        }
      }
      if (store.readings.length > 5000) store.readings.splice(0, store.readings.length - 5000);
    }

    if (Array.isArray(body.ticks)) {
      for (const t of body.ticks) {
        if (t && typeof t.symbol === "string" && typeof t.price === "number") {
          const key = t.symbol.toUpperCase();
          const arr = (store.ticks[key] ||= []);
          arr.push({ symbol: key, price: t.price, volume: typeof t.volume === "number" ? t.volume : undefined, ts: now } as Tick);
          if (arr.length > 2000) arr.splice(0, arr.length - 2000);
        }
      }
    }

    return NextResponse.json({
      ok: true,
      counts: { readings: store.readings.length, symbols: Object.keys(store.ticks).length },
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
