export const dynamic = "force-dynamic";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LumaSpace Debug State",
};

type LumaSpaceMode = "demo" | "beta" | "live";

interface LumaSpaceSection {
  id: string;
  label: string;
  enabled: boolean;
  weight: number;
}

interface LumaSpaceStatePayload {
  ok: boolean;
  mode: LumaSpaceMode;
  version: string;
  updatedAt: string;
  sections: LumaSpaceSection[];
}

async function getLumaSpaceState(): Promise<LumaSpaceStatePayload | null> {
  const base =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://127.0.0.1:3000";

  try {
    const res = await fetch(`${base}/api/lumaspace/state`, {
      cache: "no-store",
      headers: { accept: "application/json" },
    });

    if (!res.ok) {
      // Non-fatal: show error block in UI
      console.error(
        "LumaSpace debug: state fetch failed",
        res.status,
        res.statusText
      );
      return null;
    }

    const json = (await res.json()) as LumaSpaceStatePayload;
    if (!json || typeof json !== "object" || !("ok" in json) || !json.ok) {
      console.error("LumaSpace debug: invalid payload", json);
      return null;
    }

    return json;
  } catch (err) {
    console.error("LumaSpace debug: fetch error", err);
    return null;
  }
}

export default async function LumaSpaceDebugPage() {
  const payload = await getLumaSpaceState();

  return (
    <main className="min-h-screen bg-black text-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <header className="mb-6 border-b border-slate-800 pb-4">
          <h1 className="text-2xl font-semibold tracking-tight">
            LumaSpace Debug State
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Server-side view of{" "}
            <code className="font-mono">/api/lumaspace/state</code> for
            integration and QA.
          </p>
        </header>

        {!payload && (
          <section className="rounded-lg border border-rose-900 bg-rose-950/60 p-4 text-sm">
            <h2 className="text-sm font-semibold text-rose-200">
              Unable to load LumaSpace state
            </h2>
            <p className="mt-1 text-xs text-rose-200/90">
              The API did not return a valid state payload. Check{" "}
              <code className="font-mono">/api/lumaspace/state</code> logs and
              environment configuration.
            </p>
          </section>
        )}

        {payload && (
          <section className="space-y-4">
            <div className="rounded-lg border border-emerald-900 bg-emerald-950/60 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300">
                    LumaSpace Mode
                  </p>
                  <p className="text-lg font-semibold text-emerald-100">
                    {payload.mode.toUpperCase()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-emerald-300">
                    Version {payload.version}
                  </p>
                  <p className="text-[11px] text-emerald-200/80">
                    Updated:{" "}
                    {new Date(payload.updatedAt).toLocaleString("de-DE", {
                      hour12: false,
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
              <h2 className="text-sm font-semibold text-slate-100">
                Sections
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                These flags control which LumaSpace modules are active.
              </p>

              <div className="mt-3 space-y-2">
                {payload.sections.map((section) => (
                  <div
                    key={section.id}
                    className="flex items-center justify-between rounded-md border border-slate-800/80 bg-slate-950/80 px-3 py-2 text-xs"
                  >
                    <div>
                      <p className="font-medium text-slate-50">
                        {section.label}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        id:{" "}
                        <code className="font-mono text-[11px]">
                          {section.id}
                        </code>
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={
                          "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold " +
                          (section.enabled
                            ? "bg-emerald-900/70 text-emerald-200 border border-emerald-700/70"
                            : "bg-slate-900 text-slate-300 border border-slate-700/70")
                        }
                      >
                        {section.enabled ? "ENABLED" : "DISABLED"}
                      </p>
                      <p className="mt-1 text-[10px] text-slate-400">
                        weight:{" "}
                        {Number.isFinite(section.weight)
                          ? section.weight.toFixed(2)
                          : "n/a"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <section className="rounded-lg border border-slate-800 bg-slate-950/80 p-3 text-xs text-slate-300">
              <h2 className="text-[11px] font-semibold text-slate-200">
                Raw payload
              </h2>
              <pre className="mt-2 max-h-80 overflow-auto rounded bg-black/60 p-2 text-[11px] leading-snug">
                {JSON.stringify(payload, null, 2)}
              </pre>
            </section>
          </section>
        )}
      </div>
    </main>
  );
}
