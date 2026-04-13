export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(JSON.stringify({
    ok: true,
    data: { avgIntensity: 0.61, count: 12 },
    ts: Date.now()
  }), { headers: { "content-type": "application/json" } });
}
