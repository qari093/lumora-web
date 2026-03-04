"use client";

import * as React from "react";

export default function PrivateAccessPage(): JSX.Element {
  const [email, setEmail] = React.useState("");
  const [token, setToken] = React.useState("");
  const [status, setStatus] = React.useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("authorizing…");
    try {
      const res = await fetch("/api/private-access", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, token }),
      });
      const j = await res.json().catch(() => ({} as any));
      if (!res.ok || !j?.ok) {
        setStatus(`failed: ${j?.error ?? res.status}`);
        return;
      }
      setStatus("ok — redirecting…");
      window.location.href = "/fyp";
    } catch (err: any) {
      setStatus(`failed: ${err?.message ?? "network_error"}`);
    }
  }

  return (
    <main style={{ padding: 24, fontFamily: "system-ui", maxWidth: 720 }}>
      <h1 style={{ margin: 0 }}>Private Access</h1>
      <p style={{ opacity: 0.85, lineHeight: 1.5 }}>
        Lumora is in <b>private launch</b>. Enter your approved email + access token.
      </p>

      <form onSubmit={submit} style={{ display: "grid", gap: 12, marginTop: 16 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ opacity: 0.85 }}>Email</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            style={{ padding: 10, borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)" }}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ opacity: 0.85 }}>Access token</span>
          <input
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="token from your invite"
            autoComplete="off"
            style={{ padding: 10, borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)" }}
          />
        </label>

        <button
          type="submit"
          style={{
            padding: 12,
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.18)",
            background: "black",
            color: "white",
            cursor: "pointer",
          }}
        >
          Request access
        </button>

        {status ? <p style={{ margin: 0, opacity: 0.85 }}>Status: {status}</p> : null}
      </form>

      <hr style={{ margin: "20px 0", opacity: 0.3 }} />

      <p style={{ opacity: 0.7 }}>
        If you are not approved yet, contact the Lumora team to be added to the allowlist.
      </p>
    </main>
  );
}
