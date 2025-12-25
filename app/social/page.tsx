export default function SocialPage() {
  return (
    <main style={{ padding: 24, maxWidth: 980, margin: "0 auto", fontFamily: "system-ui, -apple-system, Segoe UI, Roboto" }}>
      <h1 style={{ marginBottom: 10 }}>Social</h1>
      <p style={{ opacity: 0.9, lineHeight: 1.5 }}>
        Social interactions are enabled for Private Live testing.
      </p>
      <div style={{ marginTop: 16, padding: 16, border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12 }}>
        <p style={{ margin: 0, opacity: 0.85 }}>
          Wire likes/comments/follows here (with moderation + rate limits in later steps).
        </p>
      </div>
    </main>
  );
}
