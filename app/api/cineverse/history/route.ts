export const dynamic = "force-dynamic";
export async function GET() {
  return Response.json({
    ok: true,
    data: {
      sourceId: "trailer_001",
      milestones: ["first-drop", "peak-hype", "reaction-wave"],
      enabled: true
    },
    ts: Date.now()
  });
}
