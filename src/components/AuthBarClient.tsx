"use client";

import { useState } from "react";

export default function AuthBarClient({ role, name }: { role: string; name: string }) {
  const [busy, setBusy] = useState(false);

  async function handleSignOut() {
    try {
      setBusy(true);
      // Works because you added the Pages API fallback; App Router route also fine.
      await fetch("/api/auth/sign-out", { method: "GET", cache: "no-store" });
    } catch (_) {
      // ignore
    } finally {
      window.location.href = "/login";
    }
  }

  return (
    <header
      style={{
        display: "flex",
        gap: 12,
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 16px",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        position: "sticky",
        top: 0,
        background: "white",
        zIndex: 10,
      }}
    >
      <nav style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <a href="/" style={{ textDecoration: "none", fontWeight: 600 }}>Lumora</a>
        <a href="/login">Login</a>
        <a href="/dash">Dash</a>
        <a href="/dash/mod">Mod</a>
        <a href="/dash/admin">Admin</a>
      </nav>

      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <span
          title="Current user & role"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 10px",
            borderRadius: 999,
            border: "1px solid rgba(0,0,0,0.12)",
            fontSize: 12,
          }}
        >
          <strong>{name}</strong>
          <span
            style={{
              padding: "2px 8px",
              borderRadius: 999,
              background: role === "admin" ? "rgba(255,0,0,0.08)" :
                         role === "mod"   ? "rgba(0,0,255,0.08)" :
                                            "rgba(0,0,0,0.06)",
              border: "1px solid rgba(0,0,0,0.12)",
              textTransform: "uppercase",
              letterSpacing: 0.3,
            }}
          >
            {role}
          </span>
        </span>

        <button
          onClick={handleSignOut}
          disabled={busy}
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid rgba(0,0,0,0.12)",
            background: busy ? "rgba(0,0,0,0.05)" : "white",
            cursor: busy ? "not-allowed" : "pointer",
          }}
        >
          {busy ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </header>
  );
}
