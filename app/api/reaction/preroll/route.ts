export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(JSON.stringify({
    ok: true,
    data: { buffer: ["pulse","echo"] },
    ts: Date.now()
  }), { headers: { "content-type": "application/json" } });
}
