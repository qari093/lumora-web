export async function POST(request: Request) {
  const signal = await request.json().catch(() => ({}));
  return Response.json({ ok: true, accepted: true, signal });
}
