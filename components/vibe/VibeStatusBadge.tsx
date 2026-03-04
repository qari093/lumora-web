"use client";

import * as React from "react";

type Status = {
  ok: boolean;
  enabled: boolean;
  source?: string;
  ts?: number;
  env?: Record<string, string | undefined>;
};

function cls(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export default function VibeStatusBadge({
  className,
  debug = false,
  pollMs = 0,
}: {
  className?: string;
  debug?: boolean;
  pollMs?: number;
}) {
  const [st, setSt] = React.useState<Status | null>(null);
  const [err, setErr] = React.useState<string>("");

  const load = React.useCallback(async () => {
    try {
      setErr("");
      const url = debug ? "/api/vibe/status?debug=1" : "/api/vibe/status";
      const res = await fetch(url, { cache: "no-store" });
      const json = (await res.json()) as Status;
      setSt(json);
    } catch (e: any) {
      setErr(typeof e?.message === "string" ? e.message : "status_fetch_failed");
      setSt(null);
    }
  }, [debug]);

  React.useEffect(() => {
    void load();
    if (pollMs && pollMs > 0) {
      const id = window.setInterval(() => void load(), pollMs);
      return () => window.clearInterval(id);
    }
  }, [load, pollMs]);

  const enabled = !!st?.enabled;
  const label = enabled ? "VIBE ON" : "VIBE OFF";

  return (
    <div
      className={cls(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs border",
        enabled ? "border-emerald-400/50 bg-emerald-500/10" : "border-zinc-500/50 bg-zinc-500/10",
        className
      )}
      role="status"
      aria-label="vibe-status"
      title={st?.source ? `source: ${st.source}` : "vibe status"}
    >
      <span
        className={cls(
          "inline-block h-2.5 w-2.5 rounded-full",
          enabled ? "bg-emerald-400" : "bg-zinc-400"
        )}
        aria-hidden="true"
      />
      <span className="font-medium">{label}</span>
      {err ? <span className="opacity-80">({err})</span> : null}
    </div>
  );
}
