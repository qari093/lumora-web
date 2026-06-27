"use client";

import FypOmegaIdentity from "@/src/components/fyp/FypOmegaIdentity";
import CelestialGlyph from "@/src/components/fyp/CelestialGlyph";

type FypItem = {
  id?: string;
  title?: string;
  lane?: string;
  media?: {
    videoUrl?: string;
    posterUrl?: string;
  };
};

export default function FypOmegaPlayer({
  initialFeed = [],
  source = "lumora_genesis_fyp_v1"
}: {
  initialFeed?: FypItem[];
  source?: string;
}) {
  const item = initialFeed[0] || {
    title: "Nebula",
    lane: "wonder",
    media: {
      videoUrl: "/genesis/videos/trace01.mp4",
      posterUrl: "/genesis/posters/trace01.jpg"
    }
  };

  const title = item.title || "Nebula";
  const lane = item.lane ? item.lane.charAt(0).toUpperCase() + item.lane.slice(1) : "Wonder";
  const videoUrl = item.media?.videoUrl || "/genesis/videos/trace01.mp4";
  const posterUrl = item.media?.posterUrl || "/genesis/posters/trace01.jpg";

  return (
    <main
      data-testid="fyp-omega-depthcanvas"
      data-source={source}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2147483647,
        width: "100vw",
        height: "100svh",
        overflow: "hidden",
        background: "#000",
        color: "#fff",
        isolation: "isolate",
        fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
      }}
    >
      <video
        data-testid="fyp-omega-video"
        src={videoUrl}
        poster={posterUrl}
        autoPlay
        muted
        loop
        playsInline
        controls={false}
        preload="auto"
        style={{
          position: "absolute",
          inset: 0,
          width: "100vw",
          height: "100svh",
          objectFit: "cover",
          objectPosition: "center",
          zIndex: 1,
          background: "#000"
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          background:
            "radial-gradient(circle at 80% 80%, rgba(34,211,238,.20), transparent 42%), radial-gradient(circle at 20% 20%, rgba(168,85,247,.14), transparent 36%), linear-gradient(180deg, rgba(0,0,0,.18) 0%, rgba(0,0,0,.02) 38%, rgba(0,0,0,.72) 75%, rgba(0,0,0,.96) 100%)"
        }}
      />

      <FypOmegaIdentity lane={lane} count="1/10" />

<aside
        data-testid="fyp-right-rail"
        style={{
          position: "absolute",
          right: 24,
          top: "calc(env(safe-area-inset-top) + 120px)",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14
        }}
      >
        {[
          ["curiosity", ""],
          ["deep", "Deep"],
          ["board", "Board"],
          ["share", "Share"],
          ["space", "LumaSpace"]
        ].map(([icon, label]) => (
          <button
            key={icon + label}
            type="button"
            style={{
              width: 60,
              height: 60,
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,.18)",
              background: "rgba(0,0,0,.50)",
              color: "#fff",
              backdropFilter: "blur(18px)",
              boxShadow: "0 0 28px rgba(34,211,238,.24)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              fontSize: label ? 14 : 18,
              fontWeight: label === "LumaSpace" ? 700 : 800
            }}
            aria-label={label || "Curiosity"}
             data-lumaspace-star-portal-slot={label === "LumaSpace" ? "ready" : undefined}
          >
            {icon === "curiosity" ? (
              <>
                <svg width="50" height="50" viewBox="0 0 60 60" style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="30" cy="30" r="22" fill="none" stroke="rgba(255,255,255,.16)" strokeWidth="4" />
                  <circle cx="30" cy="30" r="22" fill="none" stroke="#22d3ee" strokeWidth="4" strokeLinecap="round" strokeDasharray="138.2" strokeDashoffset="96.7" />
                </svg>
                <span style={{ position: "absolute", fontSize: 15, fontWeight: 950 }}>30%</span>
              </>
            ) : (
              <CelestialGlyph name={String(icon) as any} size={23} />
            )}
            {label ? <span style={{ fontSize: label === "LumaSpace" ? 8 : 9, opacity: .78 }}>{label}</span> : null}
          </button>
        ))}
      </aside>

      <section
        data-testid="fyp-hero-info"
        style={{
          position: "absolute",
          left: 24,
          right: 120,
          bottom: "calc(env(safe-area-inset-bottom) + 176px)",
          zIndex: 10
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 54,
            lineHeight: 1,
            fontWeight: 950,
            letterSpacing: "-.05em",
            textShadow: "0 0 34px rgba(0,0,0,.95)"
          }}
        >
          {title}
        </h1>

        <button
          type="button"
          style={{
            marginTop: 18,
            border: "1px solid rgba(34,211,238,.48)",
            borderRadius: 999,
            padding: "12px 18px",
            background: "rgba(0,0,0,.46)",
            color: "rgba(240,249,255,.95)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 0 24px rgba(34,211,238,.24)",
            fontSize: 15,
            fontWeight: 600
          }}
        >
          Genesis Collection · 1 of 10 ›
        </button>
      </section>

      <div
        style={{
          position: "absolute",
          right: 28,
          bottom: "calc(env(safe-area-inset-bottom) + 152px)",
          zIndex: 10,
          fontSize: 10,
          color: "rgba(255,255,255,.25)",
          textShadow: "0 0 18px rgba(0,0,0,.9)"
        }}
      >
        Lumora Genesis · CC0 · 4K
      </div>

      <nav
        data-testid="fyp-bottom-nav"
        style={{
          position: "absolute",
          left: 18,
          right: 18,
          bottom: "calc(env(safe-area-inset-bottom) + 92px)",
          zIndex: 11,
          height: 78,
          borderRadius: 34,
          border: "1px solid rgba(255,255,255,.14)",
          background: "rgba(0,0,0,.58)",
          backdropFilter: "blur(26px)",
          boxShadow: "0 14px 44px rgba(0,0,0,.85), inset 0 0 24px rgba(255,255,255,.04)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around"
        }}
      >
        {[
          ["home", "Home", false],
          ["flow", "Flow", true],
          ["live", "Live", false],
          ["trace", "Trace", false],
          ["space", "Space", false]
        ].map(([icon, label, active]) => (
          <button
            key={String(label)}
            type="button"
            style={{
              width: 60,
              height: 62,
              borderRadius: 26,
              border: "1px solid transparent",
              background: "transparent",
              boxShadow: "none",
              color: "rgba(255,255,255,.78)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
              fontSize: 16
            }}
          >
            <CelestialGlyph name={String(icon) as any} size={23} />
            <span style={{ fontSize: 11, fontWeight: 600 }}>{label}</span>
          </button>
        ))}
      </nav>
    </main>
  );
}
