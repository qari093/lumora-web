"use client";

import React, { useEffect, useState } from "react";

type Health = {
  providers: string[];
  defaults: { emoji: string; avatar: string };
  flags: { freeDaily: number; rollover: boolean; mirrorAI: boolean; renderX: boolean };
  time: string;
};

type StatusResp = {
  ok: boolean;
  health?: Health;
  time?: string;
  env?: { MIRRORAI_API_KEY: boolean; RENDERX_API_KEY: boolean };
};

export default function StatusBadge() {
  const [data, setData] = useState<StatusResp | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let on = true;
    (async () => {
      try {
        const r = await fetch("/api/hybrid/status", { cache: "no-store" });
        const j: StatusResp = await r.json();
        if (on) setData(j);
      } catch (e: any) {
        if (on) setErr(String(e?.message || e));
      }
    })();
    return () => { on = false; };
  }, []);

  const ok = data?.ok;
  const flags = data?.health?.flags;
  const providers = data?.health?.providers || [];
  const defaults = data?.health?.defaults;

  const pill = (label: string, value: string | number | boolean, onColor = "#9f9") => (
    <span
      key={label}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 10px",
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.18)",
        background: "rgba(255,255,255,0.06)",
        color: "#fff",
        fontSize: 12,
      }}
    >
      <span style={{
        width: 8, height: 8, borderRadius: 99,
        background: (typeof value === "boolean" ? (value ? onColor : "#f99") : onColor)
      }} />
      <strong style={{ opacity: 0.85 }}>{label}:</strong>
      <code style={{ opacity: 0.9 }}>{String(value)}</code>
    </span>
  );

  return (
    <div
      style={{
        marginTop: 12,
        padding: 12,
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.18)",
        background: "rgba(255,255,255,0.06)",
        color: "#fff",
      }}
      aria-live="polite"
    >
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        {pill("status", ok ? "ok" : "fail", ok ? "#9f9" : "#f99")}
        {pill("freeDaily", flags?.freeDaily ?? "—")}
        {pill("rollover", flags?.rollover ?? false)}
        {pill("mirrorAI", flags?.mirrorAI ?? false)}
        {pill("renderX", flags?.renderX ?? false)}
        {pill("emojiDefault", defaults?.emoji ?? "—")}
        {pill("avatarDefault", defaults?.avatar ?? "—")}
        {pill("providers", providers.join(","))}
      </div>
      {err && <div style={{ marginTop: 8, color: "#ff8899", fontSize: 12 }}>⚠️ {err}</div>}
    </div>
  );
}
