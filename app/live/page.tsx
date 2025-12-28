export const runtime = "nodejs";

function Card(props: { title: string; desc: string; href: string; cta: string; badge?: string }) {
  return (
    <a
      href={props.href}
      style={{
        display: "block",
        textDecoration: "none",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: 16,
        padding: 16,
        background: "rgba(255,255,255,0.92)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
        transition: "transform 120ms ease, box-shadow 120ms ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#0b1220" }}>{props.title}</div>
        {props.badge ? (
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: 999,
              border: "1px solid rgba(0,0,0,0.10)",
              background: "rgba(0,0,0,0.03)",
              color: "#0b1220",
              whiteSpace: "nowrap",
            }}
          >
            {props.badge}
          </span>
        ) : null}
      </div>

      <div style={{ marginTop: 8, color: "rgba(11,18,32,0.78)", lineHeight: 1.45 }}>{props.desc}</div>

      <div
        style={{
          marginTop: 14,
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          fontWeight: 700,
          color: "#0b1220",
        }}
      >
        <span
          style={{
            display: "inline-block",
            padding: "10px 14px",
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,0.10)",
            background: "rgba(0,0,0,0.02)",
          }}
        >
          {props.cta}
        </span>
        <span aria-hidden="true">→</span>
      </div>
    </a>
  );
}

export default function LivePortalPage() {
  // NOTE: counts reflect Persona pack behavior in Live: 480 emojis + 840 avatars (120 base × 7 emotions).
  // Keep copy simple and deterministic for operator checks.
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "28px 18px 40px",
        background:
          "radial-gradient(1200px 700px at 20% 0%, rgba(70,125,255,0.14), transparent 65%), radial-gradient(1100px 700px at 80% 20%, rgba(255,70,180,0.12), transparent 60%), linear-gradient(180deg, #fbfcff 0%, #f4f7ff 100%)",
      }}
    >
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h1 style={{ fontSize: 44, margin: 0, letterSpacing: -0.6, color: "#0b1220" }}>Lumora Live</h1>
            <div style={{ marginTop: 10, color: "rgba(11,18,32,0.78)", fontSize: 15, lineHeight: 1.5 }}>
              Low-latency Live portal wired to Portal Spec v2 + Persona + Portal Hubs.
              <span style={{ display: "inline-block", marginLeft: 10, fontWeight: 700, color: "#0b1220" }}>
                Persona OK (emojis 480 / avatars 840)
              </span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <a
              href="/live/room/demo-room"
              style={{
                textDecoration: "none",
                fontWeight: 800,
                color: "#ffffff",
                padding: "12px 14px",
                borderRadius: 14,
                background: "linear-gradient(135deg, rgba(70,125,255,1) 0%, rgba(255,70,180,1) 100%)",
                boxShadow: "0 10px 30px rgba(70,125,255,0.22)",
              }}
            >
              Join Demo Room
            </a>
            <a
              href="/live/hubs"
              style={{
                textDecoration: "none",
                fontWeight: 800,
                color: "#0b1220",
                padding: "12px 14px",
                borderRadius: 14,
                border: "1px solid rgba(0,0,0,0.10)",
                background: "rgba(255,255,255,0.86)",
              }}
            >
              Open Portal Hubs
            </a>
          </div>
        </div>

        <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
          <Card
            title="Demo Room"
            badge="Realtime"
            desc="Try persona pickers + mic meter + realtime events."
            href="/live/room/demo-room"
            cta="Open /live/room/demo-room"
          />
          <Card
            title="Portal Hubs"
            badge="Store"
            desc="Post-live hub list (demo store) with last activity & persona."
            href="/live/hubs"
            cta="Open /live/hubs"
          />
          <Card
            title="Portal Spec"
            badge="Read-only"
            desc="Spec v2 bound to UI + persona assets + hub wiring."
            href="/live/spec"
            cta="Open /live/spec"
          />
        </div>

        <div style={{ marginTop: 18, padding: 16, borderRadius: 16, border: "1px solid rgba(0,0,0,0.08)", background: "rgba(255,255,255,0.86)" }}>
          <div style={{ fontWeight: 800, color: "#0b1220" }}>Debug endpoints (read-only)</div>
          <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
            <a href="/api/live/portal-spec" style={{ textDecoration: "none", fontWeight: 700, color: "#0b1220" }}>/api/live/portal-spec</a>
            <a href="/api/persona/manifest" style={{ textDecoration: "none", fontWeight: 700, color: "#0b1220" }}>/api/persona/manifest</a>
            <a href="/api/live/portal-hubs" style={{ textDecoration: "none", fontWeight: 700, color: "#0b1220" }}>/api/live/portal-hubs</a>
          </div>
        </div>

        <div style={{ marginTop: 18, padding: 16, borderRadius: 16, border: "1px solid rgba(0,0,0,0.08)", background: "rgba(255,255,255,0.86)" }}>
          <div style={{ fontWeight: 800, color: "#0b1220" }}>Manual QA checklist</div>
          <ul style={{ marginTop: 10, marginBottom: 0, color: "rgba(11,18,32,0.80)", lineHeight: 1.55 }}>
            <li>/live shows expanded badge and never crashes.</li>
            <li>Room: emoji grid 480 tiles; avatar grid 120 per emotion; selection persists after refresh.</li>
            <li>Toggle mic: mic meter updates and SSE “Last event” updates.</li>
            <li>/live/hubs shows last activity + last persona for demo-room after interactions.</li>
          </ul>
          <div style={{ marginTop: 12, fontSize: 12, color: "rgba(11,18,32,0.62)" }}>STEP131_LIVE_PORTAL_UI</div>
        </div>
      </div>
    </main>
  );
}
