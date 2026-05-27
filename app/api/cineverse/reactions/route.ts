export const dynamic = "force-dynamic";
export async function GET() {
  return Response.json({
    ok: true,
    data: {
      anchors: [0, 15, 42],
      density: "medium",
      enabled: true
    },
    ts: Date.now()
  });
}
