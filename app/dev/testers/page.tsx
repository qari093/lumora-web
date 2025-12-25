export const dynamic = "force-dynamic";

async function postReset(base: string) {
  try {
    const res = await fetch(new URL("/api/dev/testers/reset", base), { method: "POST", cache: "no-store" });
    return { ok: res.ok, status: res.status, json: await res.json().catch(() => ({})) };
  } catch (e: any) {
    return { ok: false, status: 0, json: { error: String(e?.message || e) } };
  }
}

export default async function DevTestersPage() {
  // Server component: render a simple page; use a tiny inline form to trigger POST.
  const base =
    process.env.NEXT_PUBLIC_APP_ORIGIN ||
    "http://127.0.0.1:3000";

  const preview = await postReset(base); // harmless in dev; ensures endpoint wired (idempotent)

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-semibold">Dev • Testers</h1>
      <p className="mt-2 text-white/70">
        Local dev helper for resetting anonymous tester identity + clearing dev-only caches.
      </p>

      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
        <h2 className="text-lg font-semibold">Reset tester identity</h2>
        <p className="mt-1 text-white/70 text-sm">
          This calls <code className="text-white/90">POST /api/dev/testers/reset</code> and clears known tester cookies.
        </p>

        <form
          className="mt-4"
          action="/api/dev/testers/reset"
          method="post"
        >
          <button
            type="submit"
            className="rounded-lg bg-white/15 px-4 py-2 hover:bg-white/25 transition"
          >
            Reset now
          </button>
        </form>

        <div className="mt-4 text-xs text-white/60">
          <div>Endpoint smoke result (server-side):</div>
          <pre className="mt-2 overflow-auto rounded-lg bg-black/40 p-3">
{JSON.stringify(preview, null, 2)}
          </pre>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <a className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition" href="/share">
          <div className="font-semibold">/share</div>
          <div className="text-sm text-white/70">Logo share page</div>
        </a>
        <a className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition" href="/fyp">
          <div className="font-semibold">/fyp</div>
          <div className="text-sm text-white/70">Demo “For You” page</div>
        </a>
        <a className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition" href="/admin/testers">
          <div className="font-semibold">/admin/testers</div>
          <div className="text-sm text-white/70">Tester analytics dashboard</div>
        </a>
        <a className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition" href="/dev/routes">
          <div className="font-semibold">/dev/routes</div>
          <div className="text-sm text-white/70">Route registry helper</div>
        </a>
      </div>

      <div className="mt-8 text-xs text-white/50">
        Note: if your tester id is also stored in localStorage, use an incognito window or clear site data.
      </div>
    </main>
  );
}
