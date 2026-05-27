export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    ok: true,
    data: {
      classification: "active",
      statuses: ["scaffold", "live", "unknown"],
      rule: "every endpoint must be classified before activation can proceed"
    },
    ts: Date.now()
  });
}
