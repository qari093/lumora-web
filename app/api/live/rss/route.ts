export const dynamic = "force-dynamic";

export async function GET() {
  const res = await fetch("https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml");
  const xml = await res.text();

  return Response.json({
    ok: true,
    live_status: "candidate_live",
    proof_status: res.ok ? "pending" : "failed",
    source_of_truth: "external_source",
    data: {
      fetched: res.ok,
      size: xml.length
    },
    ts: Date.now()
  });
}
