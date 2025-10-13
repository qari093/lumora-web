import { NextResponse } from "next/server";
import { pickLocale } from "../../../lib/locale";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Quote = {
  symbol: string;
  exchange?: string | null;
  date?: string | null;
  time?: string | null;
  open?: number | null;
  high?: number | null;
  low?: number | null;
  close?: number | null;
  volume?: number | null;
};

function toUS(t: string): string {
  // If it already has a suffix like ".us" or ".pk", keep it; else default to US.
  const s = t.trim().toLowerCase();
  return s.includes(".") ? s : `${s}.us`;
}

function toNum(v: string | undefined): number | null {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function parseCSV(csv: string): Quote[] {
  // stooq "l" endpoint returns CSV like:
  // Symbol,Date,Time,Open,High,Low,Close,Volume
  const lines = csv.trim().split(/\r?\n/);
  if (lines.length <= 1) return [];
  const out: Quote[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",");
    if (cols.length < 8) continue;
    const symbolFull = (cols[0] || "").toUpperCase();
    const [symbol, exchange] = symbolFull.split(".");
    out.push({
      symbol: symbol || symbolFull,
      exchange: exchange || null,
      date: cols[1] || null,
      time: cols[2] || null,
      open: toNum(cols[3]),
      high: toNum(cols[4]),
      low: toNum(cols[5]),
      close: toNum(cols[6]),
      volume: toNum(cols[7]),
    });
  }
  return out;
}

export async function GET(req: Request) {
  try {
    const locale = pickLocale(req);
    const url = new URL(req.url);
    const raw = (url.searchParams.get("symbols") || "AAPL,MSFT,GOOG")
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);
    const symbols = raw.map(toUS);
    const qs = new URLSearchParams({ s: symbols.join(","), i: "d" });
    const r = await fetch(`https://stooq.com/q/l/?${qs.toString()}`, { cache: "no-store" });
    if (!r.ok) throw new Error("finance fetch failed");
    const text = await r.text();
    const quotes = parseCSV(text);

    return NextResponse.json(
      { ok: true, locale, symbols: raw, quotes, count: quotes.length },
      { headers: { "Cache-Control": "private, max-age=60, stale-while-revalidate=300" } }
    );
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
