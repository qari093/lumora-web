import { guardedJson } from "@/lib/api/guardedJson";
import { moderateMotionFrameBatch, type MotionFrameInput } from "@/lib/safety/motion/moderation";

export const dynamic = "force-dynamic";

export async function GET() {
  const sample: MotionFrameInput[] = [
    {
      assetId: "sample_safe_motion",
      frameCount: 180,
      fps: 30,
      durationMs: 6000,
      title: "official teaser motion preview",
      summary: "cinematic preview sequence",
      tags: ["teaser", "movies"],
      source: "cineverse",
    },
    {
      assetId: "sample_risky_motion",
      frameCount: 240,
      fps: 30,
      durationMs: 8000,
      title: "explicit leaked clip",
      summary: "violent gore motion sequence",
      tags: ["nsfw", "leak"],
      source: "unknown",
    },
  ];

  const results = moderateMotionFrameBatch(sample);

  return guardedJson("api.safety.motion", {
    ok: true,
    checked: results.length,
    blocked: results.filter((r) => r.action === "block").length,
    review: results.filter((r) => r.action === "review").length,
    results,
    ts: Date.now(),
  });
}
