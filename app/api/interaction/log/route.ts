import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const dir = path.join(process.cwd(), "data", "interaction_logs");
    fs.mkdirSync(dir, { recursive: true });

    const file = path.join(dir, "events.ndjson");
    fs.appendFileSync(file, JSON.stringify({ ...body, ts: Date.now() }) + "\n");

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "log_failed" }, { status: 500 });
  }
}
