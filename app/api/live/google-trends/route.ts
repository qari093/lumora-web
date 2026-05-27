export const dynamic = "force-dynamic";

export async function GET() {
  const res = await fetch("https://trends.google.com/trends/api/dailytrends?hl=en-US&geo=US", {
    headers: { "User-Agent": "Mozilla/5.0" }
  });

  const text = await res.text();

  return Response.json({
    ok: true,
    live_status: "candidate_live",
    proof_status: res.ok ? "pending" : "failed",
    source_of_truth: "external_source",
    data: {
      fetched: res.ok,
      size: text.length
    },
    ts: Date.now()
  });
}
