export async function GET() {
  return new Response(JSON.stringify({ ok:true, where:"app (root)" }), {
    headers: { "content-type": "application/json" }
  });
}
