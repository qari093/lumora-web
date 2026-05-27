export const dynamic = "force-dynamic";
export async function GET() {
  return Response.json({ ok: true, data: { velocity: "fast" }, ts: Date.now() });
}
