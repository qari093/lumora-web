import Link from "next/link";
import {
  fypActivationItems,
  getFypActivationSummary
} from "@/src/core/founder-activation/fypActivation";

type NativeFypItem = {
  id: string;
  title: string;
  playbackUrl?: string;
  videoUrl?: string;
  posterUrl?: string;
  creator?: string;
  sourceType?: string;
  rightsStatus?: string;
};

async function getNativeFypItems(): Promise<NativeFypItem[]> {
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL || "https://lumoraverse.io";
    const res = await fetch(`${base}/api/fyp/native-feed`, {
      cache: "no-store"
    });

    if (!res.ok) return [];

    const data = await res.json();
    return Array.isArray(data.items) ? data.items.slice(0, 6) : [];
  } catch {
    return [];
  }
}

export default async function FypPage() {
  const summary = getFypActivationSummary();
  const videoItems = await getNativeFypItems();

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(245,197,95,0.18), transparent 32%), #070914",
        color: "#fff7df",
        padding: "24px"
      }}
    >
      <section style={{ maxWidth: 1120, margin: "0 auto" }}>
        <header style={{ marginBottom: 28 }}>
          <p style={{ opacity: 0.72, letterSpacing: 2, fontSize: 12, margin: 0 }}>
            LUMORA FYP · FOUNDER ACTIVATION
          </p>
          <h1 style={{ fontSize: 42, lineHeight: 1.05, margin: "10px 0" }}>
            For You is now a living ecosystem gateway.
          </h1>
          <p style={{ maxWidth: 760, opacity: 0.82, fontSize: 17, lineHeight: 1.6 }}>
            This page renders real FYP video items from the native feed and provides
            founder-review pathways into Live, GMAR, Zendoro, and NEXA while keeping
            payments and tester access blocked.
          </p>
        </header>

        <section
          aria-label="Playable FYP video feed"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 16,
            marginBottom: 24
          }}
        >
          {videoItems.length > 0 ? (
            videoItems.map((item) => {
              const src = item.playbackUrl || item.videoUrl || "";
              return (
                <article key={item.id} style={portalCardStyle}>
                  <video
                    controls
                    muted
                    playsInline
                    preload="metadata"
                    poster={item.posterUrl}
                    src={src}
                    style={{
                      width: "100%",
                      borderRadius: 18,
                      background: "#000",
                      aspectRatio: "16 / 9",
                      objectFit: "cover"
                    }}
                  />
                  <h2 style={{ margin: "12px 0 6px", fontSize: 20 }}>{item.title}</h2>
                  <p style={{ margin: 0, opacity: 0.7, fontSize: 13 }}>
                    {item.sourceType || "native"} · {item.rightsStatus || "review"}
                  </p>
                </article>
              );
            })
          ) : (
            <article style={portalCardStyle}>
              <h2 style={{ marginTop: 0 }}>FYP feed fallback active</h2>
              <p style={{ opacity: 0.78 }}>
                No playable video items were returned. Fallback content remains safe,
                but founder approval requires playable media here.
              </p>
            </article>
          )}
        </section>

        <section
          aria-label="FYP activation summary"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 12,
            marginBottom: 22
          }}
        >
          <div style={cardStyle}>
            <strong>{videoItems.length}</strong>
            <span style={mutedStyle}>rendered videos</span>
          </div>
          <div style={cardStyle}>
            <strong>{summary.itemCount}</strong>
            <span style={mutedStyle}>activation cards</span>
          </div>
          <div style={cardStyle}>
            <strong>{summary.portalBridges}</strong>
            <span style={mutedStyle}>portal bridges</span>
          </div>
          <div style={cardStyle}>
            <strong>Safe</strong>
            <span style={mutedStyle}>payment mode</span>
          </div>
        </section>

        <section
          aria-label="Activated FYP cards"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(245px, 1fr))",
            gap: 16
          }}
        >
          {fypActivationItems.map((item) => (
            <article key={item.id} style={portalCardStyle}>
              <p style={{ margin: 0, opacity: 0.7, fontSize: 12, letterSpacing: 1.4 }}>
                {item.portal} · {item.type.toUpperCase()}
              </p>
              <h2 style={{ margin: "10px 0", fontSize: 22 }}>{item.title}</h2>
              <p style={{ opacity: 0.8, lineHeight: 1.55 }}>{item.description}</p>
              <Link href={item.href} style={actionStyle}>
                {item.action}
              </Link>
            </article>
          ))}
        </section>

        <footer style={{ marginTop: 28, opacity: 0.72, fontSize: 13 }}>
          Founder gate active · Tester invites blocked · Payment live mode off
        </footer>
      </section>
    </main>
  );
}

const cardStyle = {
  border: "1px solid rgba(255,247,223,0.14)",
  borderRadius: 18,
  padding: 16,
  background: "rgba(255,255,255,0.045)",
  display: "flex",
  flexDirection: "column" as const,
  gap: 6
};

const portalCardStyle = {
  border: "1px solid rgba(245,197,95,0.2)",
  borderRadius: 24,
  padding: 20,
  background: "linear-gradient(180deg, rgba(255,255,255,0.075), rgba(255,255,255,0.035))",
  boxShadow: "0 20px 70px rgba(0,0,0,0.24)"
};

const mutedStyle = {
  opacity: 0.68,
  fontSize: 13
};

const actionStyle = {
  display: "inline-flex",
  marginTop: 10,
  color: "#f5c55f",
  textDecoration: "none",
  border: "1px solid rgba(245,197,95,0.35)",
  borderRadius: 999,
  padding: "9px 13px",
  fontWeight: 700
};
