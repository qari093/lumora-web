import { NextResponse } from "next/server";
import { store } from "../_store";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = (searchParams.get("symbol") || "").toUpperCase();
  const limit = Math.max(1, Math.min(1000, Number(searchParams.get("limit") || 50)));

  if (!symbol) {
    const summary = Object.fromEntries(Object.entries(store.ticks).map(([sym, arr]) => [sym, arr.length]));
    return NextResponse.json({ ok: true, symbols: summary });
  }

  const arr = store.ticks[symbol] || [];
  const out = arr.slice(-limit).reverse();
  return NextResponse.json({ ok: true, symbol, count: out.length, ticks: out });
}
