"use client";

import { useMemo, useState } from "react";
import { useRuntimeState } from "./useRuntimeState";

type Tab = "overview" | "moment" | "memory" | "echo" | "circle";

export default function CreatorDashboardClient() {
  const runtime = useRuntimeState();
  const [tab, setTab] = useState<Tab>("overview");
  const [lightPresence, setLightPresence] = useState(false);
  const [silentOvation, setSilentOvation] = useState(0);

  const hasActivity = Boolean(runtime?.hasActivity);

  const panel = useMemo(() => {
    if (!hasActivity) return "No real interaction yet. Open FYP and watch for a few seconds.";
    if (tab === "moment") return `Your Moment: ${runtime?.strongestMoment?.type || "present"} at ${runtime?.strongestMoment?.timestampMs || 0}ms`;
    if (tab === "memory") return `Memory Shelf: ${runtime?.summary || "A quiet trace remained"}`;
    if (tab === "echo") return `Echo: Silent ovations ${silentOvation}`;
    if (tab === "circle") return "Next Circle: queued for the daily Anchor Circle";
    return runtime?.summary || "You were witnessed.";
  }, [tab, runtime, hasActivity, silentOvation]);

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <p style={styles.kicker}>{hasActivity ? "Live Runtime Active" : "At Rest"}</p>
        <h1 style={styles.title}>Creator Dashboard</h1>

        <div style={styles.status}>
          <span>{hasActivity ? "● Synced" : "○ Waiting"}</span>
          <span>{runtime?.totalSignals ?? 0} signals</span>
        </div>

        <div style={styles.actions}>
          {(["overview", "moment", "memory", "echo", "circle"] as Tab[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              style={{ ...styles.button, ...(tab === item ? styles.buttonActive : {}) }}
            >
              {item === "overview" ? "Overview" : item[0].toUpperCase() + item.slice(1)}
            </button>
          ))}
        </div>

        <article style={styles.card}>
          <strong>{panel}</strong>
          <p style={styles.muted}>
            {hasActivity
              ? "Real FYP behavior is now persisted and synced into this dashboard."
              : "Go to FYP, play a clip, wait 3 seconds, then return here."}
          </p>

          <div style={styles.actions}>
            <button type="button" onClick={() => setSilentOvation((v) => v + 1)} style={styles.primary}>
              Silent Ovation
            </button>

            <button type="button" onClick={() => setLightPresence((v) => !v)} style={styles.button}>
              {lightPresence ? "Light Presence On" : "Enable Light Presence"}
            </button>

            <a href="/fyp" style={styles.link}>
              Open FYP
            </a>
          </div>
        </article>

        {lightPresence && <div style={styles.notice}>Light Presence active — your silhouette is softly dimmed.</div>}
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    padding: 28,
    color: "#fff",
    background: "radial-gradient(circle at top, rgba(170,185,255,0.25), rgba(6,8,18,1) 56%)",
  },
  hero: { maxWidth: 1180, margin: "0 auto" },
  kicker: { opacity: 0.75, marginBottom: 10 },
  title: { fontSize: 36, margin: "0 0 18px" },
  status: {
    display: "flex",
    gap: 12,
    marginBottom: 22,
    opacity: 0.85,
  },
  actions: { display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 22 },
  button: {
    cursor: "pointer",
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    borderRadius: 999,
    padding: "10px 16px",
    fontWeight: 700,
  },
  buttonActive: {
    background: "rgba(140,160,255,0.35)",
    border: "1px solid rgba(190,205,255,0.65)",
  },
  primary: {
    cursor: "pointer",
    border: 0,
    background: "linear-gradient(135deg, #8fa7ff, #d7b6ff)",
    color: "#090b18",
    borderRadius: 999,
    padding: "10px 16px",
    fontWeight: 800,
  },
  link: {
    color: "#dfe7ff",
    textDecoration: "none",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: 999,
    padding: "10px 16px",
    fontWeight: 700,
  },
  card: {
    borderRadius: 28,
    padding: 22,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.14)",
    boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
  },
  muted: { opacity: 0.75 },
  notice: {
    marginTop: 18,
    padding: 16,
    borderRadius: 18,
    background: "rgba(143,167,255,0.16)",
    border: "1px solid rgba(143,167,255,0.28)",
  },
};
