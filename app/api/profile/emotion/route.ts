export const dynamic = "force-dynamic";

export async function GET() {
  const data = { mood: "calm", variance: 0.2 };

  return new Response(JSON.stringify({
    ok: true,
    data,
    ts: Date.now()
  }), {
    headers: { "content-type": "application/json" }
  });
}
