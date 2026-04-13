export const dynamic = "force-dynamic";

export async function GET() {
  const data = { region: "EU", language: "en" };

  return new Response(JSON.stringify({
    ok: true,
    data,
    ts: Date.now()
  }), {
    headers: { "content-type": "application/json" }
  });
}
