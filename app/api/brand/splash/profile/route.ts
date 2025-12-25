import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

type Sample = {
  ts: string;
  mode: "splash" | "post";
  avgFrameMs?: number | null;
  p95FrameMs?: number | null;
  longFrames?: number | null;
  memUsedMB?: number | null;
  ua?: string | null;
};

const FILE = path.join(process.cwd(), "branding/_validation/splash_profile.step40.ndjson");

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Sample;
    const safe: Sample = {
      ts: new Date().toISOString(),
      mode: body?.mode === "post" ? "post" : "splash",
      avgFrameMs: typeof body?.avgFrameMs === "number" ? body.avgFrameMs : null,
      p95FrameMs: typeof body?.p95FrameMs === "number" ? body.p95FrameMs : null,
      longFrames: typeof body?.longFrames === "number" ? body.longFrames : null,
      memUsedMB: typeof body?.memUsedMB === "number" ? body.memUsedMB : null,
      ua: body?.ua ? String(body.ua).slice(0, 300) : null,
    };
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    fs.appendFileSync(FILE, JSON.stringify(safe) + "\n", "utf8");
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "profile_write_failed" }, { status: 500 });
  }
}

export async function GET() {
  try {
    if (!fs.existsSync(FILE)) return NextResponse.json({ ok: true, items: [] }, { status: 200 });
    const lines = fs.readFileSync(FILE, "utf8").trim().split("\n").filter(Boolean);
    const tail = lines.slice(-20).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
    return NextResponse.json({ ok: true, items: tail }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "profile_read_failed" }, { status: 500 });
  }
}
