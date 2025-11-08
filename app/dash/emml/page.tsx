import EmmlSparks from "@/app/_client/emml-sparks";
import EmmlLive from "@/app/_client/emml-live";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";

type Row = {
  id: number;
  createdAt: Date;
  type: string;
  emotion: string | null;
  intensity: number | null;
  userId: string | null;
  source: string | null;
  meta: any | null;
};

export default async function EmmlDashboard() {
  const events: Row[] = await prisma.emmlEvent.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const byType = await prisma.emmlEvent.groupBy({
    by: ["type"],
    where: { createdAt: { gte: since } },
    _count: { _all: true },
  });

  const byEmotion = await prisma.emmlEvent.groupBy({
    by: ["emotion"],
    where: { createdAt: { gte: since }, NOT: { emotion: null } },
    _count: { _all: true },
  });

  const avg = await prisma.emmlEvent.aggregate({
    where: { createdAt: { gte: since }, intensity: { not: null } },
    _avg: { intensity: true },
  });

  return (
    <main style={{ padding: "28px 24px" }}>
      <EmmlSparks />
      <EmmlLive />
      <h1 style={{ fontWeight: 800, fontSize: 22, marginBottom: 6 }}>
        EMML — Latest Events
      </h1>
      <div style={{ display:"flex", justifyContent:"flex-end", gap:12, margin:"8px 0 16px" }}>
        <a href="/api/emotion/export?hours=24&limit=1000" style={{ padding:"8px 12px", border:"1px solid #ddd", borderRadius:8, textDecoration:"none" }}>
          Export CSV (24h)
        </a>
        <a href="/api/emotion/export?limit=5000" style={{ padding:"8px 12px", border:"1px solid #ddd", borderRadius:8, textDecoration:"none" }}>
          Export CSV (all*)
        </a>
      </div>
      <div style={{ opacity: 0.75, marginBottom: 14 }}>
        Total loaded: {events.length}
      </div>

      {/* Summary */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 16,
          marginBottom: 18,
        }}
      >
        <div
          style={{
            border: "1px solid rgba(0,0,0,.08)",
            borderRadius: 10,
            padding: 12,
            background: "rgba(255,255,255,.6)",
            backdropFilter: "blur(6px)",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Last 24h — by type</div>
          {byType.length === 0 ? (
            <div style={{ opacity: 0.7 }}>No events in last 24h.</div>
          ) : (
            <table style={{ width: "100%", fontSize: 13 }}>
              <tbody>
                {byType
                  .sort((a, b) => b._count._all - a._count._all)
                  .map((r) => (
                    <tr key={r.type}>
                      <td style={{ padding: "4px 6px" }}>{r.type}</td>
                      <td style={{ padding: "4px 6px", textAlign: "right" }}>
                        {r._count._all}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>

        <div
          style={{
            border: "1px solid rgba(0,0,0,.08)",
            borderRadius: 10,
            padding: 12,
            background: "rgba(255,255,255,.6)",
            backdropFilter: "blur(6px)",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 8 }}>
            Last 24h — by emotion
          </div>
          {byEmotion.length === 0 ? (
            <div style={{ opacity: 0.7 }}>No events in last 24h.</div>
          ) : (
            <table style={{ width: "100%", fontSize: 13 }}>
              <tbody>
                {byEmotion
                  .sort((a, b) => b._count._all - a._count._all)
                  .map((r) => (
                    <tr key={r.emotion ?? "null"}>
                      <td style={{ padding: "4px 6px" }}>{r.emotion}</td>
                      <td style={{ padding: "4px 6px", textAlign: "right" }}>
                        {r._count._all}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>

        <div
          style={{
            border: "1px solid rgba(0,0,0,.08)",
            borderRadius: 10,
            padding: 12,
            background: "rgba(255,255,255,.6)",
            backdropFilter: "blur(6px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Avg intensity (24h)</div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>
            {avg._avg.intensity !== null && avg._avg.intensity !== undefined
              ? avg._avg.intensity.toFixed(2)
              : "—"}
          </div>
        </div>
      </section>

      {/* Events table */}
      <div
        style={{
          border: "1px solid rgba(0,0,0,.08)",
          borderRadius: 12,
          overflow: "hidden",
          background: "rgba(255,255,255,.75)",
          backdropFilter: "blur(6px)",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead style={{ background: "rgba(0,0,0,.04)" }}>
            <tr>
              <th style={{ textAlign: "left", padding: "10px 12px" }}>Time</th>
              <th style={{ textAlign: "left", padding: "10px 12px" }}>Type</th>
              <th style={{ textAlign: "left", padding: "10px 12px" }}>Emotion</th>
              <th style={{ textAlign: "left", padding: "10px 12px" }}>Intensity</th>
              <th style={{ textAlign: "left", padding: "10px 12px" }}>User</th>
              <th style={{ textAlign: "left", padding: "10px 12px" }}>Source</th>
              <th style={{ textAlign: "left", padding: "10px 12px" }}>Meta</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: 14, opacity: 0.7 }}>
                  No events yet. POST to <code>/api/emotion/ingest</code> to populate.
                </td>
              </tr>
            ) : (
              events.map((e) => (
                <tr key={e.id} style={{ borderTop: "1px solid rgba(0,0,0,.06)" }}>
                  <td style={{ padding: "10px 12px" }}>
                    {new Date(e.createdAt).toLocaleString()}
                  </td>
                  <td style={{ padding: "10px 12px" }}>{e.type}</td>
                  <td style={{ padding: "10px 12px" }}>{e.emotion ?? "—"}</td>
                  <td style={{ padding: "10px 12px" }}>
                    {e.intensity ?? "—"}
                  </td>
                  <td style={{ padding: "10px 12px" }}>{e.userId ?? "—"}</td>
                  <td style={{ padding: "10px 12px" }}>{e.source ?? "—"}</td>
                  <td style={{ padding: "10px 12px", whiteSpace: "pre-wrap" }}>
                    {e.meta ? JSON.stringify(e.meta, null, 2) : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
