"use client";

import * as React from "react";

type AssetsResp = { ok: boolean; avatars?: any[]; emojis?: any[]; error?: string };
type ProfileResp = { ok: boolean; profile?: any; error?: string };

function clsx(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export default function PersonaSelector() {
  const [loading, setLoading] = React.useState(true);
  const [avatars, setAvatars] = React.useState<Array<{ code: string; url: string }>>([]);
  const [selected, setSelected] = React.useState<string>("avatar_001");
  const [saving, setSaving] = React.useState(false);
  const [err, setErr] = React.useState<string>("");

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");

        const [a, p] = await Promise.all([
          fetch("/api/persona/assets?kind=avatars&emotion=neutral", { cache: "no-store" }).then((r) => r.json()) as Promise<AssetsResp>,
          fetch("/api/persona/profile", { cache: "no-store" }).then((r) => r.json()) as Promise<ProfileResp>,
        ]);

        if (!alive) return;

        if (!a?.ok) throw new Error(a?.error || "assets_failed");
        const list = (a.avatars || []).map((x: any) => ({ code: String(x.code), url: String(x.url) }));
        setAvatars(list);

        const pref = String(p?.profile?.code || "").trim();
        if (pref && /^avatar_\d{3}$/.test(pref)) setSelected(pref);
        else setSelected(list[0]?.code || "avatar_001");
      } catch (e: any) {
        if (!alive) return;
        setErr(String(e?.message || e));
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  async function save(code: string) {
    setSaving(true);
    setErr("");
    try {
      const r = await fetch("/api/persona/select", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j?.ok) throw new Error(j?.error || `save_failed_${r.status}`);
      // Optional: refresh profile endpoint cache (server may read cookie on next nav)
      setSelected(code);
    } catch (e: any) {
      setErr(String(e?.message || e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Persona Selector</h1>
          <p className="text-sm opacity-80">Pick your base avatar (saved for Live / badges).</p>
        </div>
        <button
          className={clsx(
            "rounded-md border px-3 py-2 text-sm",
            saving ? "opacity-60" : "hover:opacity-90"
          )}
          onClick={() => save(selected)}
          disabled={saving || loading}
        >
          {saving ? "Saving…" : "Save Selection"}
        </button>
      </div>

      {err ? (
        <div className="mt-4 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm">
          {err}
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 md:grid-cols-[280px_1fr]">
        <div className="rounded-xl border bg-black/10 p-4">
          <div className="text-sm font-medium">Selected</div>
          <div className="mt-3 aspect-square w-full overflow-hidden rounded-xl border bg-black/20">
            {avatars.find((a) => a.code === selected)?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt={selected}
                src={avatars.find((a) => a.code === selected)!.url}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm opacity-60">Loading…</div>
            )}
          </div>
          <div className="mt-3 text-xs opacity-70">Code: {selected}</div>
        </div>

        <div className="rounded-xl border bg-black/5 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">All Avatars</div>
            <div className="text-xs opacity-70">{loading ? "Loading…" : `${avatars.length} total`}</div>
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
            {avatars.map((a) => {
              const active = a.code === selected;
              return (
                <button
                  key={a.code}
                  type="button"
                  className={clsx(
                    "group relative aspect-square overflow-hidden rounded-lg border bg-black/10",
                    active ? "ring-2 ring-white/70" : "hover:opacity-90"
                  )}
                  onClick={() => setSelected(a.code)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt={a.code} src={a.url} className="h-full w-full object-cover" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-black/50 px-1 py-0.5 text-[10px] text-white/90 opacity-0 transition-opacity group-hover:opacity-100">
                    {a.code}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 text-xs opacity-70">
        Tip: open <code>/persona/live-preview</code> after saving to see this badge used.
      </div>
    </div>
  );
}
