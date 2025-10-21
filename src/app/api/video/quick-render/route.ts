// Hardened quick-render route: accepts raw plan JSON or { planPath }, no unsafe path.resolve on undefined.
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { render } from "@/video-gen/ffmpeg-worker";
import { writeProgress } from "@/video-gen/progress";

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const jobId = url.searchParams.get("jobId") || crypto.randomUUID();

    let body: any = null;
    try { body = await req.json(); } catch { body = null; }

    let planPath: string | undefined;

    if (body && typeof body === "object" && typeof body.planPath === "string" && fs.existsSync(body.planPath)) {
      planPath = path.resolve(body.planPath);
    } else if (typeof body === "string" && fs.existsSync(body)) {
      planPath = path.resolve(body);
    } else if (body && typeof body === "object") {
      const tmp = `.data/render/plan-${jobId}.json`;
      fs.mkdirSync(path.dirname(tmp), { recursive: true });
      fs.writeFileSync(tmp, JSON.stringify(body, null, 2));
      planPath = tmp;
    }

    if (!planPath) {
      return NextResponse.json(
        { ok:false, error:"No plan provided. Send a raw plan object or { planPath } that exists." },
        { status: 400 }
      );
    }

    writeProgress({ jobId, pct: 1, stage: "queued" });
    await render(planPath, { jobId });
    return NextResponse.json({ ok: true, jobId });
  } catch (e: any) {
    return NextResponse.json({ ok:false, error:String(e?.message ?? e) }, { status: 500 });
  }
}
