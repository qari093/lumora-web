export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    ok: true,
    data: {
      rule: "non-live endpoints must not claim connected, active, or ready unless proven",
      bannedClaims: ["connected", "live", "active", "ready"],
      enforcement: "documentation-and-runtime-contract"
    },
    ts: Date.now()
  });
}
