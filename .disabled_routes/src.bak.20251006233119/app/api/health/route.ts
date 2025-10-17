export const dynamic = "force-dynamic";
export async function GET() {
  return Response.json({ ok: true, service: "health", ts: new Date().toISOString() });
}
