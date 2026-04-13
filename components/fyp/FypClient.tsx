"use client";

import { useEffect, useMemo, useRef } from "react";

type Category = "GMAR" | "NEXA" | "LIVE" | "MOVIES" | "SOCIAL";

type FeedItem = {
  id: string;
  creatorId: string;
  title: string;
  category: Category;
  text: string;
  finalScore?: number;
  portalBoost?: number;
  engagement?: number;
  completion?: number;
  shareVelocity?: number;
  creatorAffinity?: number;
  recency?: number;
  fatiguePenalty?: number;
  diversityPenalty?: number;
  explorationBoost?: number;
  ageMinutes?: number;
};

type Monetization = {
  adsReady: boolean;
  adsEnabled: boolean;
  sparkLayerReady: boolean;
};

async function postJson(url: string, body: unknown) {
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    });
  } catch {}
}

async function track(id: string, event: string) {
  await postJson("/api/fyp/track", { id, event });
}

function Chip({ label }: { label: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        height: 30,
        padding: "0 12px",
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.10)",
        background: "rgba(255,255,255,0.04)",
        color: "rgba(255,255,255,0.88)",
        fontSize: 13,
        letterSpacing: "0.02em",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

function MetaChip({
  label,
  tone = "default",
}: {
  label: string;
  tone?: "default" | "positive" | "negative";
}) {
  const toneStyle =
    tone === "positive"
      ? {
          border: "1px solid rgba(74,222,128,0.18)",
          background: "rgba(74,222,128,0.10)",
          color: "rgba(220,252,231,0.95)",
        }
      : tone === "negative"
        ? {
            border: "1px solid rgba(251,146,60,0.18)",
            background: "rgba(251,146,60,0.10)",
            color: "rgba(255,237,213,0.95)",
          }
        : {
            border: "1px solid rgba(132,204,255,0.14)",
            background: "rgba(56,189,248,0.08)",
            color: "rgba(196,231,255,0.92)",
          };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        height: 28,
        padding: "0 10px",
        borderRadius: 999,
        fontSize: 12,
        letterSpacing: "0.04em",
        whiteSpace: "nowrap",
        ...toneStyle,
      }}
    >
      {label}
    </span>
  );
}

function metric(
  value: number | undefined,
  label: string,
  tone: "default" | "positive" | "negative" = "default"
) {
  if (typeof value !== "number") return null;
  return <MetaChip label={`${label} ${value.toFixed(2)}`} tone={tone} />;
}

function FeedCard({ item }: { item: FeedItem }) {
  const ref = useRef<HTMLElement | null>(null);
  const seenRef = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || seenRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry || seenRef.current) return;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          seenRef.current = true;
          track(item.id, "impression");
          observer.disconnect();
        }
      },
      { threshold: [0.6] }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [item.id]);

  return (
    <article
      ref={ref}
      onClick={() => track(item.id, "click")}
      style={{
        borderRadius: 28,
        padding: 22,
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.035) 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow:
          "0 18px 50px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.03)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 14,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "rgba(132,204,255,0.92)",
              marginBottom: 8,
            }}
          >
            {item.category}
          </div>
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(20px, 3vw, 28px)",
              lineHeight: 1.08,
              color: "#ffffff",
            }}
          >
            {item.title}
          </h2>
        </div>

        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 18,
            background:
              "radial-gradient(circle at 35% 30%, rgba(56,189,248,0.95) 0%, rgba(99,102,241,0.55) 42%, rgba(15,23,42,0.18) 100%)",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow:
              "0 0 28px rgba(56,189,248,0.18), inset 0 1px 0 rgba(255,255,255,0.18)",
            flexShrink: 0,
          }}
        />
      </div>

      <p
        style={{
          margin: "0 0 14px",
          color: "rgba(255,255,255,0.78)",
          fontSize: 15,
          lineHeight: 1.65,
        }}
      >
        {item.text}
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {metric(item.finalScore, "Score")}
        {metric(item.recency, "Fresh")}
        {metric(item.portalBoost, "Portal")}
        {metric(item.engagement, "Engage")}
        {metric(item.completion, "Complete")}
        {metric(item.shareVelocity, "Share")}
        {metric(item.creatorAffinity, "Creator")}
        {metric(item.explorationBoost, "Explore", "positive")}
        {metric(item.fatiguePenalty, "Fatigue", "negative")}
        {metric(item.diversityPenalty, "Diversity", "negative")}
      </div>
    </article>
  );
}

export default function FypClient({
  feed,
  monetization,
}: {
  feed: FeedItem[];
  monetization?: Monetization;
}) {
  const sessionId = useMemo(
    () => `fyp_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
    []
  );

  const feedIds = useMemo(() => feed.map((item) => item.id), [feed]);
  const impressionsRef = useRef(0);
  const clicksRef = useRef(0);
  const startRef = useRef<number>(Date.now());

  useEffect(() => {
    const originalFetch = window.fetch.bind(window);

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      try {
        const url =
          typeof input === "string"
            ? input
            : input instanceof URL
              ? input.toString()
              : input.url;

        if (url.includes("/api/fyp/track") && init?.body && typeof init.body === "string") {
          const body = JSON.parse(init.body);
          if (body?.event === "impression") impressionsRef.current += 1;
          if (body?.event === "click") clicksRef.current += 1;
        }
      } catch {}

      return originalFetch(input as any, init);
    };

    const flush = () => {
      const dwellMs = Date.now() - startRef.current;
      postJson("/api/fyp/session", {
        sessionId,
        impressions: impressionsRef.current,
        clicks: clicksRef.current,
        dwellMs,
        feedIds,
      });
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") flush();
    };

    window.addEventListener("beforeunload", flush);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      flush();
      window.fetch = originalFetch;
      window.removeEventListener("beforeunload", flush);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [sessionId, feedIds]);

  return (
    <>
      <span style={{ display: "none" }}>LUMORA_PORTAL_ALIVE_FYP</span>

      <main
        style={{
          minHeight: "100dvh",
          background:
            "radial-gradient(circle at top, rgba(15,23,42,0.98) 0%, rgba(2,6,23,1) 52%, #020617 100%)",
          color: "#fff",
        }}
      >
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            padding: "20px 16px 40px",
          }}
        >
          <header
            style={{
              position: "sticky",
              top: 0,
              zIndex: 20,
              marginBottom: 18,
              padding: "14px 0 10px",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              background: "linear-gradient(180deg, rgba(2,6,23,0.92), rgba(2,6,23,0.55))",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                marginBottom: 14,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: "0.16em",
                    color: "rgba(132,204,255,0.88)",
                    marginBottom: 8,
                  }}
                >
                  Lumora
                </div>
                <h1
                  style={{
                    margin: 0,
                    fontSize: "clamp(28px, 5vw, 44px)",
                    lineHeight: 1,
                    color: "#ffffff",
                  }}
                >
                  For You
                </h1>
              </div>

              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background:
                    "radial-gradient(circle at 35% 30%, rgba(56,189,248,0.95) 0%, rgba(99,102,241,0.52) 50%, rgba(15,23,42,0.12) 100%)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  boxShadow:
                    "0 0 24px rgba(56,189,248,0.16), inset 0 1px 0 rgba(255,255,255,0.18)",
                  flexShrink: 0,
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                overflowX: "auto",
                paddingBottom: 4,
                marginBottom: 12,
              }}
            >
              <Chip label="Featured" />
              <Chip label="Gaming" />
              <Chip label="Wellness" />
              <Chip label="Movies" />
              <Chip label="Live" />
              <Chip label="Creators" />
              {monetization ? (
                <Chip label={`Ads ${monetization.adsEnabled ? "On" : "Off"}`} />
              ) : null}
            </div>
          </header>

          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 16,
            }}
          >
            {feed.length > 0 ? (
              feed.map((item) => <FeedCard key={item.id} item={item} />)
            ) : (
              <article
                style={{
                  borderRadius: 28,
                  padding: 22,
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.035) 100%)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.78)",
                }}
              >
                FYP tracking surface is wired but no feed items were returned.
              </article>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
