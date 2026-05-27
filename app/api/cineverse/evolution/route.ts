export const dynamic = "force-dynamic";
export async function GET() {
  return Response.json({
    ok: true,
    data: {
      stages: ["seed", "surge", "stabilize"],
      current: "surge",
      enabled: true
    },
    ts: Date.now()
  });
}
