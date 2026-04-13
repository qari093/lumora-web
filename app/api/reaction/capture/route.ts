export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(JSON.stringify({
    ok: true,
    data: { intensity: 0.72, motion: "medium" },
    ts: Date.now()
  }), { headers: { "content-type": "application/json" } });
}
