export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const jobId = url.searchParams.get("jobId");
  if (!jobId) return NextResponse.json({ ok:false, error:"missing jobId" }, { status: 400 });

  const base = path.resolve(".data/render/progress");
  const file = path.join(base, `${jobId}.json`);
  if (!fs.existsSync(file)) {
    return NextResponse.json({ ok:true, jobId, pct:0, stage:"pending", updatedAt:new Date().toISOString() });
  }
  try {
    const data = JSON.parse(fs.readFileSync(file,"utf8"));
    return NextResponse.json({ ok:true, ...data });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:String(e?.message ?? e) }, { status: 500 });
  }
}
