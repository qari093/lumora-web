"use client";

import React from "react";
import HomeButton from "./HomeButton";

type FypApiItem = {
  id: string;
  kind?: string;
  title?: string;
  text?: string;
  category?: string;
  portal?: string;
  targetRoute?: string;
  slotType?: string;
  media?: {
    mediaId?: string;
    videoUrl?: string;
    posterUrl?: string;
    source?: "viral" | "teaser";
  };
};

type FeedCard = {
  id: string;
  title: string;
  text: string;
  category: string;
  videoUrl?: string;
  posterUrl?: string;
  targetRoute?: string;
  kind: "organic" | "sponsored";
};

function normalizeFeed(raw: FypApiItem[]): FeedCard[] {
  return raw
    .map((item, index) => {
      const category = String(item.category ?? item.portal ?? "").toUpperCase().trim();
      if (!["MOVIES", "SOCIAL"].includes(category)) return null;

      const videoUrl = item.media?.videoUrl;
      const posterUrl = item.media?.posterUrl;
      if (!videoUrl) return null;

      return {
        id: String(item.id ?? ("fyp-" + index)),
        title: String(item.title ?? "Lumora Drop"),
        text: String(item.text ?? "Live feed item"),
        category: category === "MOVIES" ? "TRAILER" : "VIRAL",
        videoUrl,
        posterUrl,
        targetRoute: undefined,
        kind: "organic",
      } satisfies FeedCard;
    })
    .filter((item): item is FeedCard => !!item);
}

function FeedVideoCard({
  item,
  active,
}: {
  item: FeedCard;
  active: boolean;
}) {
  const ref = React.useRef<HTMLVideoElement | null>(null);

  React.useEffect(() => {
    const v = ref.current;
    if (!v) return;

    if (active) {
      v.currentTime = 0;
      v.load();
      v.currentTime = 0;
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [active]);

  return (
    <section
      data-fyp-card="1"
      style={{
        height: "100dvh",
        width: "100%",
        position: "relative",
        scrollSnapAlign: "start",
        overflow: "hidden",
        background: "#000",
      }}
    >
      <video
        ref={ref}
        src={item.videoUrl}
        poster={item.posterUrl}
        muted
        loop
        playsInline
        preload="metadata"
        controls={false}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          background: "#000",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.22) 35%, rgba(0,0,0,0.68) 100%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 16,
          right: 16,
          bottom: 28,
          zIndex: 2,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 16,
          color: "#fff",
        }}
      >
        <div style={{ maxWidth: "78%" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 10,
              padding: "6px 10px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.14)",
              fontSize: 12,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            <span>{item.category}</span>
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: "clamp(24px, 5vw, 34px)",
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
              textShadow: "0 6px 30px rgba(0,0,0,0.35)",
            }}
          >
            {item.title}
          </h2>

          <p
            style={{
              margin: "10px 0 0",
              fontSize: 15,
              lineHeight: 1.55,
              color: "rgba(255,255,255,0.88)",
              textShadow: "0 4px 18px rgba(0,0,0,0.30)",
            }}
          >
            {item.text}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gap: 12,
            justifyItems: "center",
            paddingBottom: 4,
          }}
        >
          {["♥️", "↗️", "⋯"].map((x, i) => (
            <button
              key={item.id + "-" + i}
              type="button"
              style={{
                width: 52,
                height: 52,
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.16)",
                background: "rgba(0,0,0,0.28)",
                color: "#fff",
                fontSize: 20,
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
              }}
            >
              {x}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function FypPage() {
  const [items, setItems] = React.useState<FeedCard[]>([]);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [status, setStatus] = React.useState<"loading" | "live" | "fallback">("loading");
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const res = await fetch("/api/fyp", { cache: "no-store" });
        const data = await res.json();
        const feed = Array.isArray(data?.feed) ? data.feed : [];
        const normalized = normalizeFeed(feed);

        if (!alive) return;

        if (normalized.length > 0) {
          setItems(normalized);
          setStatus("live");
        } else {
          setItems([
            {
              id: "fallback-social-1",
              title: "Viral Creator Moment",
              text: "Fallback viral clip while richer sources are being attached.",
              category: "VIRAL",
              videoUrl: "/videos/test-2.mp4",
              posterUrl: "/videos/poster.png",
              kind: "organic",
            },
            {
              id: "fallback-movies-1",
              title: "CineVerse Trailer Drop",
              text: "Fallback movie teaser while teaser resolver is being attached.",
              category: "TRAILER",
              videoUrl: "/videos/intro.mp4",
              posterUrl: "/videos/poster.png",
              kind: "organic",
            },
          ]);
          setStatus("fallback");
        }
      } catch {
        if (!alive) return;
        setItems([
          {
            id: "fallback-social-1",
            title: "Viral Creator Moment",
            text: "Fallback viral clip while richer sources are being attached.",
            category: "VIRAL",
            videoUrl: "/videos/test-2.mp4",
            posterUrl: "/videos/poster.png",
            kind: "organic",
          },
          {
            id: "fallback-movies-1",
            title: "CineVerse Trailer Drop",
            text: "Fallback movie teaser while teaser resolver is being attached.",
            category: "TRAILER",
            videoUrl: "/videos/intro.mp4",
            posterUrl: "/videos/poster.png",
            kind: "organic",
          },
        ]);
        setStatus("fallback");
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  React.useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-fyp-card="1"]'));
    if (!cards.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;
        const idx = cards.indexOf(visible.target as HTMLElement);
        if (idx >= 0) setActiveIndex(idx);
      },
      { threshold: [0.55, 0.7, 0.85] }
    );

    cards.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, [items]);

  return (
    <>

      <main
        style={{
          height: "100dvh",
          width: "100%",
          background: "#000",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "fixed",
            top: 12,
            left: 0,
            right: 0,
            zIndex: 20,
            display: "flex",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              pointerEvents: "auto",
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 14px",
              borderRadius: 999,
              background: "rgba(8,12,20,0.62)",
              border: "1px solid rgba(255,255,255,0.10)",
              color: "#fff",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              fontSize: 13,
            }}
          >
            <strong style={{ letterSpacing: "0.08em" }}>FYP</strong>
            <span style={{ opacity: 0.7 }}>•</span>
            <span>{status === "loading" ? "Loading..." : status === "live" ? "Live Runtime" : "Fallback Runtime"}</span>
            <span style={{ opacity: 0.7 }}>•</span>
            <span>{items.length} items</span>
            <span style={{ opacity: 0.7 }}>•</span>
            <span>{activeIndex + 1}/{Math.max(1, items.length)}</span>
          </div>
        </div>

        <div
          ref={containerRef}
          style={{
            height: "100dvh",
            overflowY: "auto",
            scrollSnapType: "y mandatory",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {items.map((item, idx) => (
            <FeedVideoCard key={item.id} item={item} active={idx === activeIndex} />
          ))}
        </div>
        <HomeButton />
      </main>
    </>
  );
}