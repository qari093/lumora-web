import { NextResponse } from "next/server";
import { teaserPipelineStages } from "@/src/cineverse/teasers/pipeline";

export async function GET() {
  return NextResponse.json({
    ok: true,
    pipeline: teaserPipelineStages,
  });
}
