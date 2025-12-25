"use client";

import { useMemo, useState } from "react";

export default function ShareActions({ shareUrl }: { shareUrl: string }) {
  const [copied, setCopied] = useState(false);

  const waUrl = useMemo(() => {
    const msg = `Lumora private preview: ${shareUrl}`;
    return `https://wa.me/?text=${encodeURIComponent(msg)}`;
  }, [shareUrl]);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // Fallback: prompt copy
      try {
        window.prompt("Copy this link:", shareUrl);
      } catch {
        // ignore
      }
    }
  }

  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      <a
        href={shareUrl}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "12px 14px",
          borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.18)",
          background: "rgba(80,180,255,0.18)",
          textDecoration: "none",
          color: "white",
          fontWeight: 600,
        }}
      >
        Open Lumora
      </a>

      <a
        href={waUrl}
        target="_blank"
        rel="noreferrer"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "12px 14px",
          borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.18)",
          background: "rgba(0,255,180,0.12)",
          textDecoration: "none",
          color: "white",
          fontWeight: 600,
        }}
      >
        Share via WhatsApp
      </a>

      <button
        type="button"
        onClick={onCopy}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "12px 14px",
          borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.18)",
          background: "rgba(255,255,255,0.08)",
          color: "white",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        {copied ? "Copied ✓" : "Copy link"}
      </button>
    </div>
  );
}
