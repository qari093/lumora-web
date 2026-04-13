export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(JSON.stringify({
    ok: true,
    data: { sync: true, drift: 0 },
    ts: Date.now()
  }), { headers: { "content-type": "application/json" } });
}
