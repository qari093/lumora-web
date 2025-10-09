import { NextResponse } from "next/server";
import { videoEngine } from "../../../../video-gen/engine";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id") || "";
  const job = videoEngine.get(id);
  if (!job) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  return NextResponse.json({
    ok: true,
    id: job.id,
    status: job.status,
    outPath: job.outPath,
    plan: job.plan,
    lang: job.lang,
    error: job.error ?? null
  });
}
