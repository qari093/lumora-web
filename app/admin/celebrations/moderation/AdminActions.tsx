"use client";
import { useState } from "react";

type Status = "LIVE" | "PAUSED";

export default function AdminActions({ slug }: { slug: string }) {
  const [busy, setBusy] = useState<false | Status>(false);

  async function setStatus(status: Status) {
    try {
      setBusy(status);
      const url = `/api/celebrations/${encodeURIComponent(slug)}/admin/set-status`;
      await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status }),
        cache: "no-store",
      });
    } catch (e) {
      console.error("[admin-actions] setStatus error:", e);
    } finally {
      setBusy(false);
      try { location.reload(); } catch {}
    }
  }

  const btn: React.CSSProperties = {
    padding: "8px 12px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,.2)",
    background: "rgba(255,255,255,.06)",
    fontWeight: 800,
    cursor: busy ? "not-allowed" : "pointer",
    opacity: busy ? .6 : 1,
  };

  return (
    <div style={{ position: "fixed", top: 16, right: 16, display: "flex", gap: 10, zIndex: 30 }}>
      <button style={{ ...btn, background: "linear-gradient(90deg,#10b981,#34d399)" }}
              onClick={() => setStatus("LIVE")} disabled={!!busy}>Go LIVE</button>
      <button style={{ ...btn, background: "linear-gradient(90deg,#94a3b8,#64748b)" }}
              onClick={() => setStatus("PAUSED")} disabled={!!busy}>Pause</button>
    </div>
  );
}
