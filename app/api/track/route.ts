export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { slug, campaign } = body;
  console.log("[API TRACK]", { slug, campaign, ts: Date.now() });
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "content-type": "application/json" },
    status: 200,
  });
}
