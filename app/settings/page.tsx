"use client";

import * as React from "react";

export default function SettingsPage() {
  const [name, setName] = React.useState("");
  const [msg, setMsg] = React.useState<string | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(`Saved: ${name || "Anonymous"}`);
  }

  return (
    <main style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <h1>Settings</h1>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <label>
          <div style={{ marginBottom: 6 }}>Display name</div>
          <input
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            placeholder="Your name"
            style={{
              padding: 8,
              width: "100%",
              border: "1px solid #222",
              borderRadius: 6,
            }}
          />
        </label>

        <button
          type="submit"
          style={{
            padding: "8px 12px",
            border: "1px solid #222",
            borderRadius: 6,
          }}
        >
          Save
        </button>
      </form>
      {msg && <p style={{ color: "green" }}>{msg}</p>}
    </main>
  );
}
