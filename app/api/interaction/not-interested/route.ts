import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const dir = path.join(process.cwd(), "data", "negative_feedback");
    fs.mkdirSync(dir, { recursive: true });

    const file = path.join(dir, "not_interested.ndjson");
    fs.appendFileSync(file, JSON.stringify({ ...body, ts: Date.now() }) + "\n");

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
