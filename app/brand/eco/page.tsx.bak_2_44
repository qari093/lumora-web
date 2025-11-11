import Link from "next/link";
import prisma from "@/lib/prisma";
import { loadEcoFactors, estimateFromCounts } from "@/lib/eco";

const fmt = (n:number)=> n.toLocaleString(undefined, { maximumFractionDigits: 1 });
const money = (c:number)=> new Intl.NumberFormat(undefined,{style:"currency",currency:"EUR"}).format((c||0)/100);

async function computeWindow(days=7) {
  const since = new Date(Date.now() - days*86400000);
  const [evs, convs, vws] = await Promise.all([
    prisma.adEvent.findMany({ where:{ createdAt:{ gte: since } }, select:{ action:true, campaignId:true } }),
    prisma.adConversion.findMany({ where:{ createdAt:{ gte: since } }, select:{ campaignId:true } }),
    prisma.cpvView.findMany({ where:{ createdAt:{ gte: since } }, select:{ campaignId:true, costCents:true } }),
  ]);
  const group = new Map<string, {views:number;hovers:number;clicks:number;conversions:number;spendCents:number;}>();
  const key = (cid:any)=> String(cid || "ALL");
  const ensure = (k:string)=> group.get(k) ?? (group.set(k, {views:0,hovers:0,clicks:0,conversions:0,spendCents:0}), group.get(k)!);

  for (const e of evs) { const g=ensure(key(e.campaignId)); if (e.action==="view") g.views++; else if (e.action==="hover") g.hovers++; else if (e.action==="click") g.clicks++; }
  for (const c of convs) { const g=ensure(key(c.campaignId)); g.conversions++; }
  for (const v of vws) { const g=ensure(key(v.campaignId)); g.spendCents += Number(v.costCents||0); }

  const f = loadEcoFactors();
  let totalCo2 = 0, totalWh = 0;
  const rows = Array.from(group.entries()).map(([campaignId, counts]) => {
    const est = estimateFromCounts(f, counts);
    totalCo2 += est.co2g; totalWh += est.energyWh;
    return { campaignId, ...counts, ...est };
  }).sort((a,b)=> b.co2g - a.co2g);

  return { days, totalCo2, totalWh, rows };
}

export default async function EcoPage() {
  const { days, totalCo2, totalWh, rows } = await computeWindow(7);
  return (
    <div style={{maxWidth:1080, margin:"24px auto", padding:"0 16px", fontFamily:"ui-sans-serif, system-ui"}}>
      <h1 style={{fontSize:26, fontWeight:700, marginBottom:8}}>Eco Impact Tracker</h1>
      <p style={{color:"#555"}}>Estimated emissions & energy for the last {days} days.</p>

      <div style={{display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:12, marginTop:12}}>
        <div style={card}><div style={label}>Total CO₂</div><div style={val}>{fmt(totalCo2/1000)} kg</div></div>
        <div style={card}><div style={label}>Total Energy</div><div style={val}>{fmt(totalWh/1000)} kWh</div></div>
        <div style={card}><div style={label}>Campaigns</div><div style={val}>{rows.length}</div></div>
        <div style={card}><div style={label}>Avg CO₂ / View</div>
          <div style={val}>
            {(() => {
              const views = rows.reduce((s,r)=>s+r.views,0);
              return views ? fmt(totalCo2/views) + " g" : "—";
            })()}
          </div>
        </div>
      </div>

      <h2 style={{marginTop:24, marginBottom:8, fontWeight:700}}>By Campaign</h2>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%", borderCollapse:"collapse"}}>
          <thead>
            <tr>
              <th style={th}>Campaign</th>
              <th style={th}>Views</th>
              <th style={th}>Clicks</th>
              <th style={th}>Conversions</th>
              <th style={th}>Spend</th>
              <th style={th}>CO₂ (g)</th>
              <th style={th}>Energy (Wh)</th>
              <th style={th}>CO₂ / Conv (g)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r=>(
              <tr key={r.campaignId}>
                <td style={td}><code>{r.campaignId}</code></td>
                <td style={tdNum}>{r.views}</td>
                <td style={tdNum}>{r.clicks}</td>
                <td style={tdNum}>{r.conversions}</td>
                <td style={tdNum}>{money(r.spendCents)}</td>
                <td style={tdNum}>{fmt(r.co2g)}</td>
                <td style={tdNum}>{fmt(r.energyWh)}</td>
                <td style={tdNum}>{r.conversions ? fmt(r.co2g / r.conversions) : "—"}</td>
              </tr>
            ))}
            {rows.length===0 && <tr><td style={{...td, padding:"16px"}} colSpan={8}>No data yet.</td></tr>}
          </tbody>
        </table>
      </div>

      <div style={{marginTop:20, color:"#666"}}>
        <Link href="/api/eco/summary">API: eco summary</Link>{" · "}
        <Link href="/api/eco/timeseries">API: eco timeseries</Link>{" · "}
        <Link href="/api/eco/rollup/run">API: eco rollup</Link>
      </div>
    </div>
  );
}

const card: React.CSSProperties = { background:"#fff", border:"1px solid #eee", borderRadius:10, padding:"12px 14px" };
const label: React.CSSProperties = { fontSize:12, textTransform:"uppercase", letterSpacing:".06em", color:"#666" };
const val: React.CSSProperties = { fontSize:22, fontWeight:700, marginTop:4 };
const th: React.CSSProperties = { textAlign:"left", padding:"10px 8px", borderBottom:"1px solid #eee", fontSize:13, color:"#666" };
const td: React.CSSProperties = { padding:"8px", borderBottom:"1px dashed #eee", fontSize:14 };
const tdNum: React.CSSProperties = { ...td, textAlign:"right" };
