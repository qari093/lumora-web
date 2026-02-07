import React from "react";
import { getPortalStatusGrid } from "@/lib/portals/status";

export default async function PortalStatusGrid() {
  const rows = await getPortalStatusGrid();

  return (
    <section
      style={{
        border: "1px solid #1f2937",
        borderRadius: 16,
        padding: 14,
        background: "#070b14",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <h2 style={{ margin: 0, fontSize: 16 }}>Portal Status</h2>
        <span style={{ opacity: 0.7, fontSize: 12 }}>
          live probes (server-side) • no-store
        </span>
      </div>

      <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
        {rows.map((r) => (
          <a
            key={r.key}
            href={r.url}
            style={{
              display: "block",
              padding: 12,
              borderRadius: 14,
              border: "1px solid #1f2937",
              textDecoration: "none",
              background: r.ok ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <strong style={{ fontSize: 13 }}>{r.label}</strong>
              <span style={{ fontSize: 12, opacity: 0.75 }}>
                {r.status === 0 ? "ERR" : r.status}
              </span>
            </div>
            <div style={{ marginTop: 6, fontSize: 12, opacity: 0.78 }}>
              {r.url} • {r.ms}ms
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
