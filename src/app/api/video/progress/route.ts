import { NextRequest, NextResponse } from "next/server";
import { readProgress } from "@/src/video-gen/progress";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const jobId = url.searchParams.get("jobId");
  if (!jobId) return NextResponse.json({ ok:false, error:"missing jobId" }, { status: 400 });
  const p = readProgress(jobId);
  return NextResponse.json({ ok:true, ...p });
}
