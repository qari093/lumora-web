import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

type MemSample = {
  ts: string;
  phase: "splash" | "post";
  usedMB?: number | null;
  totalMB?: number | null;
  limitMB?: number | null;
  ua?: string | null;
};

const FILE = path.join(process.cwd(), "branding/_validation/splash_memory.step42.ndjson");

export async function POST(req: Request) {
  try {
    const b = (await req.json()) as any;
    const safe: MemSample = {
      ts: new Date().toISOString(),
      phase: b?.phase === "post" ? "post" : "splash",
      usedMB: typeof b?.usedMB === "number" ? b.usedMB : null,
      totalMB: typeof b?.totalMB === "number" ? b.totalMB : null,
      limitMB: typeof b?.limitMB === "number" ? b.limitMB : null,
      ua: b?.ua ? String(b.ua).slice(0, 300) : null,
    };
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    fs.appendFileSync(FILE, JSON.stringify(safe) + "\n", "utf8");
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "memory_write_failed" }, { status: 500 });
  }
}

export async function GET() {
  try {
    if (!fs.existsSync(FILE)) return NextResponse.json({ ok: true, items: [] }, { status: 200 });
    const lines = fs.readFileSync(FILE, "utf8").trim().split("\n").filter(Boolean);
    const tail = lines.slice(-20).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
    return NextResponse.json({ ok: true, items: tail }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "memory_read_failed" }, { status: 500 });
  }
}
