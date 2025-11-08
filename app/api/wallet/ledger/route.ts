import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

type Entry = { id: string; ownerId: string; delta: number; reason?: string; meta?: any; ts: number; };
const DATA_FILE = path.join(process.cwd(), ".data", "ledger.json");

async function readAll(): Promise<Entry[]> {
  try {
    const buf = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(buf);
    return Array.isArray(parsed?.entries) ? parsed.entries as Entry[] : [];
  } catch { return []; }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const ownerId = searchParams.get("ownerId") || "";
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "20", 10) || 20));
    const after = parseInt(searchParams.get("after") || "0", 10) || 0;
    if (!ownerId) return NextResponse.json({ ok: false, error: "ownerId is required" }, { status: 400 });
    const items = (await readAll()).filter(e => e.ownerId === ownerId && e.ts > after).sort((a,b)=>b.ts-a.ts).slice(0, limit);
    return NextResponse.json({ ok: true, ownerId, items });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:String(e?.message||e) }, { status:500 });
  }
}
