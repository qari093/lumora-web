import { guardedJson } from "@/lib/api/guardedJson";
import { applySafeRatingBatch, type SafeRatingInput } from "@/lib/safety/rating/safeRating";

export const dynamic = "force-dynamic";

export async function GET() {
  const sample: SafeRatingInput[] = [
    {
      assetId: "safe_g_asset",
      rating: "G",
      source: "trusted_catalog",
      title: "Family animation teaser",
    },
    {
      assetId: "safe_pg_asset",
      rating: "PG",
      source: "trusted_catalog",
      title: "Adventure trailer",
    },
    {
      assetId: "blocked_r_asset",
      rating: "R",
      source: "third_party",
      title: "Restricted trailer",
    },
    {
      assetId: "review_unknown_asset",
      rating: "unknown",
      source: "third_party",
      title: "Unknown-rated preview",
    },
  ];

  const results = applySafeRatingBatch(sample);

  return guardedJson("api.safety.rating", {
    ok: true,
    checked: results.length,
    allowed: results.filter((r) => r.action === "allow").length,
    review: results.filter((r) => r.action === "review").length,
    blocked: results.filter((r) => r.action === "block").length,
    results,
    ts: Date.now(),
  });
}
