export const dynamic = "force-dynamic";
export async function GET() {
  return Response.json({ ok: true, data: { trend: "emerging" }, ts: Date.now() });
}
