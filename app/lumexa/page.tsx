export const dynamic = "force-dynamic";

export default function LumexaPage() {
  return (
    <main style={{ padding: 24, maxWidth: 980, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, margin: "0 0 8px" }}>Lumexa</h1>
      <p style={{ margin: "0 0 16px", opacity: 0.85 }}>
        AI-first assistant + search + open talk + shopping help (scaffold).
      </p>

      <section style={{ display: "grid", gap: 12 }}>
        <a href="/lumexa/chat" style={cardStyle}>Open Talk</a>
        <a href="/lumexa/search" style={cardStyle}>Search</a>
        <a href="/lumexa/shop" style={cardStyle}>Shopping Helper</a>
        <a href="/nexa" style={cardStyle}>Go to NEXA</a>
      </section>

      <div style={{ height: 18 }} />

      <details>
        <summary style={{ cursor: "pointer" }}>Developer Notes</summary>
        <pre style={{ whiteSpace: "pre-wrap", marginTop: 10, opacity: 0.85 }}>
{[
  "- This is a minimal portal shell so Lumexa is visible + reachable.",
  "- Next step is wiring real Lumexa services/APIs and UI.",
].join("\n")}
        </pre>
      </details>
    </main>
  );
}

const cardStyle: React.CSSProperties = {
  display: "block",
  padding: 16,
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.04)",
  textDecoration: "none",
};
