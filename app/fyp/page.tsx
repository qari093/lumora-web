import Link from "next/link";
import {
  fypActivationItems,
  getFypActivationSummary
} from "@/src/core/founder-activation/fypActivation";

export default function FypPage() {
  const summary = getFypActivationSummary();

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
            This page is no longer an empty shell. It presents real founder-review
            pathways into video discovery, live rooms, GMAR missions, Zendoro commerce,
            and NEXA guidance while keeping payments and tester access blocked.
          </p>
        </header>

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
            <strong>{summary.itemCount}</strong>
            <span style={mutedStyle}>active cards</span>
          </div>
          <div style={cardStyle}>
            <strong>{summary.portalBridges}</strong>
            <span style={mutedStyle}>portal bridges</span>
          </div>
          <div style={cardStyle}>
            <strong>{summary.videoSignals}</strong>
            <span style={mutedStyle}>video signal</span>
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
