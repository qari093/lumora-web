import Link from "next/link";
import {
  getLiveActivationSummary,
  liveActivationRooms
} from "@/src/core/founder-activation/liveActivation";

export default function LivePage() {
  const summary = getLiveActivationSummary();

  return (
    <>
      {/* LUMORA_PORTAL_ALIVE_LIVE */}

    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top right, rgba(125,249,255,0.16), transparent 34%), #050816",
        color: "#eefcff",
        padding: "24px"
      }}
    >
      <section style={{ maxWidth: 1120, margin: "0 auto" }}>
        <header style={{ marginBottom: 28 }}>
          <p style={{ opacity: 0.72, letterSpacing: 2, fontSize: 12, margin: 0 }}>
            LUMORA LIVE · FOUNDER ACTIVATION
          </p>
          <h1 style={{ fontSize: 42, lineHeight: 1.05, margin: "10px 0" }}>
            Live is now a visible pulse layer, not an empty room.
          </h1>
          <p style={{ maxWidth: 780, opacity: 0.82, fontSize: 17, lineHeight: 1.6 }}>
            This founder-review surface shows active room cards, live runtime bridges,
            visible participation signals, and trust-review access while keeping public
            broadcast and tester invitations blocked.
          </p>
        </header>

        <section
          aria-label="Live activation summary"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 12,
            marginBottom: 22
          }}
        >
          <div style={statCard}>
            <strong>{summary.roomCount}</strong>
            <span style={muted}>visible rooms</span>
          </div>
          <div style={statCard}>
            <strong>{summary.visibleParticipants}</strong>
            <span style={muted}>preview signals</span>
          </div>
          <div style={statCard}>
            <strong>Off</strong>
            <span style={muted}>public broadcast</span>
          </div>
          <div style={statCard}>
            <strong>Safe</strong>
            <span style={muted}>founder mode</span>
          </div>
        </section>

        <section
          aria-label="Activated Live rooms"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(245px, 1fr))",
            gap: 16
          }}
        >
          {liveActivationRooms.map((room) => (
            <article key={room.id} style={roomCard}>
              <p style={{ margin: 0, opacity: 0.72, fontSize: 12, letterSpacing: 1.4 }}>
                {room.mode.toUpperCase()} · {room.status.toUpperCase()}
              </p>
              <h2 style={{ margin: "10px 0", fontSize: 22 }}>{room.title}</h2>
              <p style={{ opacity: 0.8, lineHeight: 1.55 }}>{room.description}</p>
              <p style={{ opacity: 0.72, fontSize: 13 }}>
                Visible signals: {room.participants}
              </p>
              <Link href={room.href} style={action}>
                Open signal
              </Link>
            </article>
          ))}
        </section>

        <footer style={{ marginTop: 28, opacity: 0.72, fontSize: 13 }}>
          Founder gate active · Public broadcast off · Tester invites blocked
        </footer>
      </section>
    </main>
    </>
  );
}

const statCard = {
  border: "1px solid rgba(238,252,255,0.14)",
  borderRadius: 18,
  padding: 16,
  background: "rgba(255,255,255,0.045)",
  display: "flex",
  flexDirection: "column" as const,
  gap: 6
};

const roomCard = {
  border: "1px solid rgba(125,249,255,0.22)",
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
  color: "#7df9ff",
  textDecoration: "none",
  border: "1px solid rgba(125,249,255,0.35)",
  borderRadius: 999,
  padding: "9px 13px",
  fontWeight: 700
};
