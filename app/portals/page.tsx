export const runtime = "edge";

const LINKS: { href: string; title: string; desc: string }[] = [
  { href: "/", title: "Home Hub", desc: "Single entry hub tiles" },
  { href: "/fyp", title: "FYP", desc: "Feed portal" },
  { href: "/watch/demo-1", title: "Watch", desc: "Watch demo video page" },
  { href: "/gmar", title: "GMAR", desc: "Games portal" },
  { href: "/videos", title: "Videos", desc: "Videos portal" },
  { href: "/nexa", title: "NEXA", desc: "NEXA portal" },
  { href: "/movies/portal", title: "Movies Portal", desc: "Movies hub" },
  { href: "/celebrations", title: "Celebrations", desc: "Celebrations portal" },
  { href: "/share", title: "Share", desc: "Share portal" },
  { href: "/live", title: "Live", desc: "Live portal" },
];

export default function PortalsIndexPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#070816", color: "#fff" }}>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: 18 }}>
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: 16,
            padding: 14,
            background: "rgba(255,255,255,0.06)",
            boxShadow: "0 18px 45px rgba(0,0,0,0.35)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>Lumora QA Hub</div>
              <h1 style={{ margin: "6px 0 0", fontSize: 22, letterSpacing: 0.2 }}>Portals Index</h1>
              <div style={{ marginTop: 6, fontSize: 13, opacity: 0.85 }}>
                One page with every portal link for iPhone testing.
              </div>
            </div>
            <a
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.18)",
                background: "rgba(0,0,0,0.25)",
                color: "#fff",
                textDecoration: "none",
                fontSize: 13,
                whiteSpace: "nowrap",
              }}
            >
              Back to Home
            </a>
          </div>

          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                style={{
                  textDecoration: "none",
                  color: "#fff",
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "rgba(255,255,255,0.05)",
                  padding: 14,
                  display: "block",
                }}
              >
                <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: 0.2 }}>{l.title}</div>
                <div style={{ marginTop: 6, fontSize: 12, opacity: 0.8 }}>{l.desc}</div>
                <div style={{ marginTop: 10, fontSize: 12, opacity: 0.65 }}>{l.href}</div>
              </a>
            ))}
          </div>

          <div style={{ marginTop: 12, fontSize: 12, opacity: 0.7 }}>
            Tip: open <code style={{ background: "rgba(0,0,0,0.35)", padding: "2px 6px", borderRadius: 8 }}>/portals</code> on iPhone, then tap through.
          </div>
        </div>
      </div>
    
      <div style={{ height: 12 }} />
      
        <a href="/lumexa" style={{ textDecoration: "none" }}>
          <div style={{ padding: 14, borderRadius: 14, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)" }}>
            <div style={{ fontWeight: 700 }}>Lumexa</div>
            <div style={{ opacity: 0.85, fontSize: 13 }}>AI assistant + search + open talk</div>
          </div>
        </a>



<a href="/lumen" style={{ textDecoration: "none" }}>
  <div style={{ padding: 14, borderRadius: 14, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)" }}>
    <div style={{ fontWeight: 700 }}>Lumen</div>
    <div style={{ opacity: 0.8, fontSize: 12 }}>Free test phase</div>
  </div>
</a>

</main>
  );
}
