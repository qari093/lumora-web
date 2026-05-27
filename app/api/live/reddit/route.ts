export const dynamic = "force-dynamic";

export async function GET() {
  const res = await fetch("https://www.reddit.com/r/popular.json");
  const json = await res.json();

  return Response.json({
    ok: true,
    live_status: "candidate_live",
    proof_status: res.ok ? "pending" : "failed",
    source_of_truth: "external_source",
    data: {
      fetched: res.ok,
      posts: json?.data?.children?.length || 0
    },
    ts: Date.now()
  });
}
