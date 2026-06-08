import React from "react";
import { createLafsCommandHearthModel } from "../../src/core/lafs/dashboard";

export default function LafsPage() {
  const model = createLafsCommandHearthModel();

  return (
    <main style={{ minHeight: "100vh", padding: 24, background: "#080A12", color: "#F7F0DC" }}>
      <section style={{ maxWidth: 1180, margin: "0 auto" }}>
        <header style={{ display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 20 }}>
          <div>
            <p style={{ margin: 0, opacity: 0.72, letterSpacing: 2, fontSize: 12 }}>LUMORA AUTONOMOUS FINANCE SYSTEM</p>
            <h1 style={{ margin: "8px 0 0", fontSize: 34 }}>{model.layout.title}</h1>
          </div>
          <div style={{ textAlign: "right" }}>
            <strong>State: {model.snapshot.state}</strong>
            <p style={{ margin: "6px 0 0", opacity: 0.72 }}>Lumora Lens: {model.snapshot.lensDefault}</p>
          </div>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 14 }}>
          {model.snapshot.panels.map((panel) => (
            <article
              key={panel}
              style={{
                border: "1px solid rgba(247,240,220,0.18)",
                borderRadius: 18,
                padding: 18,
                background: "rgba(255,255,255,0.045)",
                minHeight: 120,
              }}
            >
              <h2 style={{ margin: 0, fontSize: 18 }}>{panel}</h2>
              <p style={{ opacity: 0.72, lineHeight: 1.55 }}>
                Read-only pre-beta financial control panel. No money movement is available from this dashboard.
              </p>
            </article>
          ))}
        </div>

        <footer style={{ marginTop: 18, opacity: 0.7, fontSize: 13 }}>
          Payment live mode: {String(model.snapshot.paymentLiveMode)} · Human approval required:{" "}
          {String(model.snapshot.guards.humanApprovalRequired)}
        </footer>
      </section>
    </main>
  );
}
