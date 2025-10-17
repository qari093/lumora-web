export const dynamic = "force-dynamic";
export async function GET() {
  return Response.json({
    ok: true,
    service: "whereami",
    ts: new Date().toISOString(),
    env: process.env.NODE_ENV,
    node: process.version
  });
}
