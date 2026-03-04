"use client";

import { useEffect, useMemo, useState } from "react";

type ApiOut = Record<string, any>;

function getDisplayMode(): string {
  try {
    if (typeof window === "undefined") return "unknown";
    if (window.matchMedia?.("(display-mode: standalone)")?.matches) return "standalone";
    if (window.matchMedia?.("(display-mode: minimal-ui)")?.matches) return "minimal-ui";
    if (window.matchMedia?.("(display-mode: fullscreen)")?.matches) return "fullscreen";
    return "browser";
  } catch {
    return "unknown";
  }
}

function getNavigatorStandalone(): boolean | null {
  try {
    // iOS Safari exposes navigator.standalone when launched from A2HS
    const n: any = navigator as any;
    if (typeof n?.standalone === "boolean") return n.standalone;
    return null;
  } catch {
    return null;
  }
}

function isStandaloneClient(): boolean {
  const dm = getDisplayMode();
  const ns = getNavigatorStandalone();
  return dm === "standalone" || ns === true;
}

export default function PwaDiagPage() {
  const [api, setApi] = useState<ApiOut | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const client = useMemo(() => {
    const displayMode = getDisplayMode();
    const navigatorStandalone = getNavigatorStandalone();
    const standalone = isStandaloneClient();
    return { displayMode, navigatorStandalone, standalone, href: typeof window !== "undefined" ? window.location.href : "" };
  }, []);

  useEffect(() => {
    const run = async () => {
      try {
        const qs = new URLSearchParams();
        qs.set("port", "3040");
        qs.set("clientStandalone", client.standalone ? "1" : "0");
        qs.set("clientDisplayMode", client.displayMode);
        if (client.navigatorStandalone !== null) qs.set("clientNavigatorStandalone", client.navigatorStandalone ? "1" : "0");

        const r = await fetch(`/api/pwa/diag?${qs.toString()}`, { cache: "no-store" });
        const j = await r.json();
        setApi({ httpStatus: r.status, ...j });
      } catch (e: any) {
        setErr(typeof e?.message === "string" ? e.message : "fetch_failed");
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const merged = useMemo(() => {
    return {
      client,
      api,
      error: err,
      expected:
        "If launched from Home Screen app on iPhone: client.standalone=true AND/OR client.displayMode=standalone AND/OR client.navigatorStandalone=true",
    };
  }, [api, client, err]);

  return (
    <main style={{ padding: 16, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 800 }}>Lumora PWA Diag</h1>
      <p style={{ margin: "0 0 12px", opacity: 0.85 }}>
        Open this page inside the <b>installed Home Screen app</b> to confirm standalone mode.
      </p>
      <pre
        style={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          padding: 14,
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,.12)",
          background: "rgba(10,12,20,.65)",
          color: "white",
          fontSize: 12,
          lineHeight: 1.35,
        }}
      >
        {JSON.stringify(merged, null, 2)}
      </pre>
    </main>
  );
}
