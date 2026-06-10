import Link from "next/link";
import {
  getNexaActivationSummary,
  nexaActivationModules
} from "@/src/core/founder-activation/nexaActivation";

export default function NexaPage() {
  const summary = getNexaActivationSummary();

  return (
    <main style={{
      minHeight: "100vh",
      background: "radial-gradient(circle at top left, rgba(176,141,255,0.2), transparent 34%), #080714",
      color: "#f7f1ff",
      padding: "24px"
    }}>
      <section style={{ maxWidth: 1120, margin: "0 auto" }}>
        <header style={{ marginBottom: 28 }}>
          <p style={{ opacity: 0.72, letterSpacing: 2, fontSize: 12, margin: 0 }}>
            LUMORA NEXA · FOUNDER ACTIVATION
          </p>
          <h1 style={{ fontSize: 42, lineHeight: 1.05, margin: "10px 0" }}>
            NEXA is now a visible guidance and wellbeing layer.
          </h1>
          <p style={{ maxWidth: 780, opacity: 0.82, fontSize: 17, lineHeight: 1.6 }}>
            This founder-review surface makes NEXA visible as a calm companion layer
            for guidance, wellbeing, creation, and trust explanations while keeping
            AI autonomy, medical claims, and tester access blocked.
          </p>
        </header>

        <section style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 12,
          marginBottom: 22
        }}>
          <div style={statCard}><strong>{summary.moduleCount}</strong><span style={muted}>visible modules</span></div>
          <div style={statCard}><strong>Off</strong><span style={muted}>AI autonomy</span></div>
          <div style={statCard}><strong>Off</strong><span style={muted}>medical claims</span></div>
          <div style={statCard}><strong>Safe</strong><span style={muted}>founder mode</span></div>
        </section>

        <section style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(245px, 1fr))",
          gap: 16
        }}>
          {nexaActivationModules.map((module) => (
            <article key={module.id} style={moduleCard}>
              <p style={{ margin: 0, opacity: 0.72, fontSize: 12, letterSpacing: 1.4 }}>
                {module.mode.toUpperCase()} · {module.status.toUpperCase()}
              </p>
              <h2 style={{ margin: "10px 0", fontSize: 22 }}>{module.title.replace('NEXA Guidance Core', 'Guidance Core')}</h2>
              <p style={{ opacity: 0.8, lineHeight: 1.55 }}>{module.description}</p>
              <Link href={module.href} style={action}>
                Open module
              </Link>
            </article>
          ))}
        </section>

        <footer style={{ marginTop: 28, opacity: 0.72, fontSize: 13 }}>
          Founder gate active · AI autonomy off · Medical claims off · Tester invites blocked
        </footer>
      </section>
    </main>
  );
}

const statCard = {
  border: "1px solid rgba(247,241,255,0.14)",
  borderRadius: 18,
  padding: 16,
  background: "rgba(255,255,255,0.045)",
  display: "flex",
  flexDirection: "column" as const,
  gap: 6
};

const moduleCard = {
  border: "1px solid rgba(176,141,255,0.24)",
  borderRadius: 24,
  padding: 20,
  background: "linear-gradient(180deg, rgba(255,255,255,0.075), rgba(255,255,255,0.035))",
  boxShadow: "0 20px 70px rgba(0,0,0,0.24)"
};

const muted = {
  opacity: 0.68,
  fontSize: 13
};

const action = {
  display: "inline-flex",
  marginTop: 10,
  color: "#c6a6ff",
  textDecoration: "none",
  border: "1px solid rgba(198,166,255,0.4)",
  borderRadius: 999,
  padding: "9px 13px",
  fontWeight: 700
};
