import { NextResponse } from "next/server";
import { videoEngine } from "../../../../video-gen/engine";
import type { GenRequest } from "../../../../video-gen/types";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<GenRequest>;
    const job = videoEngine.createJob({
      prompt: body.prompt ?? "",
      categories: body.categories,
      language: body.language,
      targetDurationSec: body.targetDurationSec ?? 18,
      aspect: body.aspect ?? "9:16",
      allowAIStock: body.allowAIStock ?? true,
      voice: body.voice,
      captions: body.captions ?? true,
      music: body.music ?? "trend",
      userId: body.userId ?? "anon",
    });
    return NextResponse.json({ ok: true, id: job.id, status: job.status });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message ?? e) }, { status: 400 });
  }
}
