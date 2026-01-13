export const runtime = "nodejs";

export async function GET() {
  return Response.json(
    { ok: true, ready: true, ts: Date.now(), service: "lumora" },
    { status: 200, headers: { "cache-control": "no-store" } }
  );
}
