export async function GET() {
  return Response.json({
    ok: true,
    version: Date.now(),
    state: { runtime: "active", fyp: true },
  });
}
