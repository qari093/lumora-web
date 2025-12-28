export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  // Canonical fast marker used by Live contracts
  const ts = new Date().toISOString();
  return new Response(`STEP108_HEALTHZ ${ts}\n`, {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store, max-age=0",
      "x-lumora-marker": "STEP108_HEALTHZ",
    },
  });
}
