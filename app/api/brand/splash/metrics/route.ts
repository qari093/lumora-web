import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

type Metric = {
  ts: string;
  phase: string;
  reason?: string | null;
  t0?: number | null;
  tReady?: number | null;
  elapsedMs?: number | null;
  ua?: string | null;
};

const FILE = path.join(process.cwd(), "branding/_validation/splash_metrics.step39.ndjson");

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Metric;
    const safe: Metric = {
      ts: new Date().toISOString(),
      phase: String(body?.phase ?? "unknown"),
      reason: body?.reason ? String(body.reason) : null,
      t0: typeof body?.t0 === "number" ? body.t0 : null,
      tReady: typeof body?.tReady === "number" ? body.tReady : null,
      elapsedMs: typeof body?.elapsedMs === "number" ? body.elapsedMs : null,
      ua: body?.ua ? String(body.ua).slice(0, 300) : null,
    };
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    fs.appendFileSync(FILE, JSON.stringify(safe) + "\n", "utf8");
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "metrics_write_failed" }, { status: 500 });
  }
}

export async function GET() {
  // Return last 20 lines (best-effort)
  try {
    if (!fs.existsSync(FILE)) return NextResponse.json({ ok: true, items: [] }, { status: 200 });
    const lines = fs.readFileSync(FILE, "utf8").trim().split("\n").filter(Boolean);
    const tail = lines.slice(-20).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
    return NextResponse.json({ ok: true, items: tail }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "metrics_read_failed" }, { status: 500 });
  }
}
