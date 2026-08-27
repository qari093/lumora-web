"use client";

import { useEffect, useState } from "react";

type TrendItem = {
  id: string;
  title: string;
  url?: string;
  rank?: number;
};

export default function TrendingPage() {
  const [items, setItems] = useState<TrendItem[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "degraded">("loading");

  useEffect(() => {
    let active = true;

    fetch("/api/live/google-trends", { cache: "no-store" })
      .then(async (response) => {
        const payload = await response.json().catch(() => ({}));
        if (!active) return;

        const nextItems = Array.isArray(payload?.items) ? payload.items : [];
        setItems(nextItems);
        setState(response.ok && nextItems.length > 0 ? "ready" : "degraded");
      })
      .catch(() => {
        if (active) setState("degraded");
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <main
      data-trending-production-state={state}
      style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}
    >
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>Trending</h1>

      <p style={{ marginTop: 8, opacity: 0.75 }}>
        Live public trend signals powering Lumora discovery.
      </p>

      {state === "loading" ? <p style={{ marginTop: 20 }}>Loading trends…</p> : null}

      {state === "degraded" ? (
        <p style={{ marginTop: 20 }}>
          Live trend data is temporarily unavailable. Lumora remains operational.
        </p>
      ) : null}

      {items.length > 0 ? (
        <ol style={{ marginTop: 20, display: "grid", gap: 10 }}>
          {items.slice(0, 25).map((item, index) => (
            <li
              key={item.id || `${index}`}
              style={{
                padding: 12,
                border: "1px solid rgba(255,255,255,.12)",
                borderRadius: 12,
              }}
            >
              <span style={{ marginRight: 8, opacity: 0.6 }}>
                {item.rank || index + 1}.
              </span>
              {item.url ? (
                <a href={item.url} target="_blank" rel="noreferrer">
                  {item.title}
                </a>
              ) : (
                item.title
              )}
            </li>
          ))}
        </ol>
      ) : null}

      <div id="LUMORA_TRENDING_PRODUCTION_REALITY" style={{ display: "none" }}>
        google-trends-runtime
      </div>
    </main>
  );
}
