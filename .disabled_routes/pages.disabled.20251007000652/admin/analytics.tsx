import type { GetServerSideProps } from "next";
import prisma from "@/lib/db";

type Row = { day: string; type: string; count: number };
type Props = { rows: Row[] };

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  // Postgres-friendly aggregation
  const rs = await prisma.$queryRawUnsafe<Row[]>(
    `SELECT to_char(date_trunc(day, "ts"), YYYY-MM-DD) as day, "type", count(*)::int as count
     FROM "AnalyticsEvent"
     GROUP BY 1,2
     ORDER BY 1 DESC, 3 DESC
     LIMIT 500`
  );
  return { props: { rows: rs } };
};

export default function AnalyticsPage({ rows }: Props){
  const byDay: Record<string, { type: string; count: number }[]> = {};
  for (const r of rows) {
    byDay[r.day] = byDay[r.day] || [];
    byDay[r.day].push({ type: r.type, count: r.count });
  }
  return (
    <div style={{ padding: 20 }}>
      <h1>📊 Analytics (DB)</h1>
      {Object.keys(byDay).length===0 && <div>No data yet. Trigger some events.</div>}
      {Object.entries(byDay).map(([day, arr])=>(
        <div key={day} style={{ marginTop: 16, border:"1px solid #333", borderRadius:10, padding:12 }}>
          <div style={{ fontWeight:800, marginBottom:8 }}>{day}</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
            {arr.map((x,i)=>(
              <div key={i} style={{ background:"#0b0f12", color:"#e5e7eb", padding:10, borderRadius:8, border:"1px solid #222" }}>
                <div style={{ fontSize:12, opacity:.8 }}>{x.type}</div>
                <div style={{ fontSize:24, fontWeight:900 }}>{x.count}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div style={{ marginTop:16, opacity:.8 }}>POST to <code>/api/analytics/stream</code> or use <code>track()</code> from <code>src/lib/analytics.ts</code>.</div>
    </div>
  );
}
