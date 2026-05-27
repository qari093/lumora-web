export const dynamic = "force-dynamic";
export async function GET() {
  return Response.json({
    ok: true,
    data: {
      id: "cv_timeline_001",
      segments: ["teaser", "reaction", "discussion"],
      enabled: true
    },
    ts: Date.now()
  });
}
