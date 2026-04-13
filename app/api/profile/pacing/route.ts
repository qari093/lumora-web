export const dynamic = "force-dynamic";

export async function GET() {
  const data = { pace: "medium", tolerance: 0.65 };

  return new Response(JSON.stringify({
    ok: true,
    data,
    ts: Date.now()
  }), {
    headers: { "content-type": "application/json" }
  });
}
