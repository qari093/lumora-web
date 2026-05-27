export const dynamic = "force-dynamic";
export async function GET() {
  return Response.json({ ok: true, data: { decay: 0.21 }, ts: Date.now() });
}
