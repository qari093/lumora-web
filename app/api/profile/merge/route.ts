export const dynamic = "force-dynamic";

export async function GET() {
  const data = {
    emotion: "calm",
    pacing: "medium",
    interests: ["film","music"],
    locale: "EU"
  };

  return new Response(JSON.stringify({
    ok: true,
    data,
    ts: Date.now()
  }), {
    headers: { "content-type": "application/json" }
  });
}
