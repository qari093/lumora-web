export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { render } from "../../../../src/video-gen/ffmpeg-worker";

// Minimal inline progress writer (avoids import path issues)
function writeProgress(jobId: string, partial: any) {
  try {
    const base = path.resolve(".data/render/progress");
    fs.mkdirSync(base, { recursive: true });
    const file = path.join(base, `${jobId}.json`); // ✅ correct template literal
    const prev = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : {};
    const now  = new Date().toISOString();
    const merged = { jobId, pct: 0, stage: "queued", updatedAt: now, ...prev, ...partial, updatedAt: now };
    fs.writeFileSync(file, JSON.stringify(merged));
  } catch {}
}

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const jobId = url.searchParams.get("jobId") || crypto.randomUUID();

  try {
    let body: any = null;
    try { body = await req.json(); } catch { body = null; }

    // Accept { planPath } or raw plan JSON
    let planPath: string | undefined;
    if (typeof body === "string" && fs.existsSync(body)) {
      planPath = path.resolve(body);
    } else if (body?.planPath && typeof body.planPath === "string" && fs.existsSync(body.planPath)) {
      planPath = path.resolve(body.planPath);
    } else if (body && typeof body === "object") {
      const tmp = `.data/render/plan-${jobId}.json`;
      fs.mkdirSync(path.dirname(tmp), { recursive: true });
      fs.writeFileSync(tmp, JSON.stringify(body, null, 2));
      planPath = tmp;
    }

    if (!planPath) {
      return NextResponse.json(
        { ok:false, error:"No plan provided. Send raw plan JSON or an existing { planPath }." },
        { status: 400 }
      );
    }

    writeProgress(jobId, { pct: 1, stage: "queued" });
    await render(planPath, { jobId });

    const outPath = (() => { try { return JSON.parse(fs.readFileSync(planPath, "utf8"))?.outPath; } catch { return undefined; }})();
    writeProgress(jobId, { pct: 100, stage: "done", ok: true, outPath });

    return NextResponse.json({ ok: true, jobId });
  } catch (e: any) {
    writeProgress(jobId, { pct: 100, stage: "failed", ok: false, error: String(e?.message ?? e) });
    return NextResponse.json({ ok:false, error:String(e?.message ?? e) }, { status: 500 });
  }
}
