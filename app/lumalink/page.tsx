import Link from "next/link";

const capabilities = [
  {
    title: "Human Connections",
    description: "Consent-first relationship requests and reciprocal connection states.",
  },
  {
    title: "Living Groups",
    description: "Private collaborative spaces with explicit membership boundaries.",
  },
  {
    title: "Calm Messaging",
    description: "Direct and group conversations without engagement-pressure mechanics.",
  },
  {
    title: "Quiet Presence",
    description: "Optional online, away, and offline signals controlled by each person.",
  },
  {
    title: "Language Bridge",
    description: "Translation controls powered by the existing LumaLink translation runtime.",
  },
];

export default function LumaLinkPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "clamp(24px, 5vw, 72px)",
        background:
          "radial-gradient(circle at top, rgba(109, 94, 252, 0.18), transparent 38%), #080811",
        color: "#f7f7fb",
      }}
    >
      <section style={{ maxWidth: 1040, margin: "0 auto" }}>
        <p
          style={{
            margin: 0,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            opacity: 0.66,
            fontSize: 12,
          }}
        >
          LumaLink 3.0
        </p>

        <h1
          style={{
            margin: "16px 0 12px",
            fontSize: "clamp(42px, 8vw, 88px)",
            lineHeight: 0.98,
            letterSpacing: "-0.055em",
          }}
        >
          Relationships without pressure.
        </h1>

        <p
          style={{
            maxWidth: 700,
            fontSize: "clamp(17px, 2vw, 22px)",
            lineHeight: 1.6,
            opacity: 0.76,
          }}
        >
          A consent-first social layer for meaningful connections, quiet groups,
          calm conversations, presence, and language bridges across Lumora.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            marginTop: 42,
          }}
        >
          {capabilities.map((capability) => (
            <article
              key={capability.title}
              style={{
                padding: 22,
                borderRadius: 22,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.045)",
                backdropFilter: "blur(18px)",
              }}
            >
              <h2 style={{ margin: 0, fontSize: 19 }}>{capability.title}</h2>
              <p style={{ margin: "10px 0 0", lineHeight: 1.55, opacity: 0.68 }}>
                {capability.description}
              </p>
            </article>
          ))}
        </div>

        <nav
          aria-label="LumaLink actions"
          style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 34 }}
        >
          <Link
            href="/inbox"
            style={{
              padding: "12px 18px",
              borderRadius: 999,
              background: "#f7f7fb",
              color: "#101018",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Open inbox
          </Link>

          <Link
            href="/lumaspace"
            style={{
              padding: "12px 18px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.16)",
              color: "#f7f7fb",
              textDecoration: "none",
            }}
          >
            Return to LumaSpace
          </Link>
        </nav>
      </section>
    </main>
  );
}
