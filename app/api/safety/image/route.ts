import { guardedJson } from "@/lib/api/guardedJson";
import { moderateImageBatch, type ImageModerationInput } from "@/lib/safety/image/moderation";

export const dynamic = "force-dynamic";

export async function GET() {
  const sample: ImageModerationInput[] = [
    {
      imageId: "sample_safe_poster",
      mimeType: "image/jpeg",
      width: 1080,
      height: 1600,
      filename: "movie-poster.jpg",
      altText: "official movie poster",
      source: "cineverse",
    },
    {
      imageId: "sample_risky_asset",
      mimeType: "image/png",
      width: 512,
      height: 512,
      filename: "nsfw-leak.png",
      altText: "explicit leaked still",
      source: "unknown",
    },
  ];

  const results = moderateImageBatch(sample);

  return guardedJson("api.safety.image", {
    ok: true,
    checked: results.length,
    blocked: results.filter((r) => r.action === "block").length,
    review: results.filter((r) => r.action === "review").length,
    results,
    ts: Date.now(),
  });
}
