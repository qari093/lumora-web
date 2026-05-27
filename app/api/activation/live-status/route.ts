export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    ok: true,
    data: {
      contractVersion: "live-status-v1",
      requiredFields: [
        "classification",
        "live_status",
        "proof_status",
        "source_of_truth"
      ],
      enums: {
        classification: ["scaffold", "live", "unknown"],
        live_status: ["not_live", "partial", "live"],
        proof_status: ["missing", "pending", "passed", "failed"]
      }
    },
    ts: Date.now()
  });
}
