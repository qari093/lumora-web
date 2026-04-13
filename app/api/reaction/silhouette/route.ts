export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(JSON.stringify({
    ok: true,
    data: { shape: "human-outline", fidelity: "low" },
    ts: Date.now()
  }), { headers: { "content-type": "application/json" } });
}
