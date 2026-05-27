export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    ok: true,
    data: {
      proofGate: true,
      requiredProofs: [
        "live_fetch",
        "data_persisted",
        "ranking_changes",
        "feed_changes",
        "user_variation"
      ],
      rule: "engine is live only if all required proofs pass"
    },
    ts: Date.now()
  });
}
