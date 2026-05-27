export const dynamic = "force-dynamic";
export async function GET() {
  return Response.json({ ok: true, data: { score: 0.82 }, ts: Date.now() });
}
