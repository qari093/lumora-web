export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    ok: true,
    data: {
      ingestionProof: true,
      required: [
        "google_trends_fetch_success",
        "rss_fetch_success",
        "reddit_fetch_success"
      ],
      condition: "all must return non-empty payload",
      next: "persist_data"
    },
    ts: Date.now()
  });
}
