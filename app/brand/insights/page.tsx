import { prisma } from "@/lib/prisma";
import Link from "next/link";

// Minimal inline sparkline as SVG (no deps)
function Sparkline({ points }: { points: number[] }) {
  const w = 120, h = 32, pad = 2;
  const max = Math.max(1, ...points);
  const step = (w - pad*2) / Math.max(1, points.length-1);
  const path = points.map((v,i)=>{
    const x = pad + i*step;
    const y = h - pad - (v/max)*(h - pad*2);
    return `${i===0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  return (
    <svg width={w} height={h} style={{display:"block"}}>
      <path d={path} fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

async function getBrandData(days = 7) {
  // Server-side, call DB directly for quick totals
  const since = new Date(Date.now() - days*24*60*60*1000);

  const [evs, convs, vws] = await Promise.all([
    prisma.adEvent.groupBy({ by:["action"], where:{ createdAt:{ gte: since } }, _count:{ _all:true } }),
    prisma.adConversion.findMany({ where:{ createdAt:{ gte: since } }, select:{ rewardCents:true } }),
    prisma.cpvView.findMany({ where:{ createdAt:{ gte: since } }, select:{ costCents:true } }),
  ]);

  const k = { views:0, hovers:0, clicks:0 };
  for (const r of evs) {
    const c = Number(r._count._all || 0);
    if (r.action==="view") k.views += c;
    else if (r.action==="hover") k.hovers += c;
    else if (r.action==="click") k.clicks += c;
  }
  const conversions = 0 + (await prisma.adConversion.count({ where:{ createdAt:{ gte: since } } }));
  const rewardsCents = convs.reduce((s,x)=>s + (x.rewardCents||0), 0);
  const spendCents = vws.reduce((s,x)=>s + (x.costCents||0), 0);

  // Tiny timeseries for sparkline (views per minute over last 20)
  const points = 20;
  const stepMs = 60_000;
  const start = new Date(Date.now() - points*stepMs);
  const ev = await prisma.adEvent.findMany({
    where:{ createdAt:{ gte: start } },
    select:{ action:true, createdAt:true }
  });
  const arr = new Array(points).fill(0);
  ev.forEach(e=>{
    if (e.action!=="view") return;
    const idx = Math.floor((new Date(e.createdAt).getTime() - start.getTime())/stepMs);
    if (idx>=0 && idx<points) arr[idx]++;
  });

  const ctr = k.views>0 ? k.clicks/k.views : 0;
  const cvr = k.clicks>0 ? conversions/k.clicks : 0;

  return {
    days,
    kpis: { ...k, conversions, spendCents, rewardsCents, ctr, cvr },
    spark: arr
  };
}

export default async function BrandInsightsPage() {
  const days = 7;
  const data = await getBrandData(days);
  const fmtMoney = (c:number)=> `€${(c/100).toFixed(2)}`;
  const pct = (v:number)=> (v*100).toFixed(1)+"%";

  // Fetch per-campaign table by calling the API internally
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/ads/analytics/brands?days=${days}`, { cache:"no-store" })
    .catch(()=>null);
  let table: any[] = [];
  try { table = (await res?.json())?.rows ?? []; } catch {}

  return (
    <div style={{maxWidth:1080, margin:"24px auto", padding:"0 16px", fontFamily:"ui-sans-serif, system-ui"}}>
      <h1 style={{fontSize:26, fontWeight:700, marginBottom:8}}>Brand Insights</h1>
      <p style={{color:"#555", marginBottom:20}}>Last {days} days · consolidated across campaigns</p>

      <div style={{display:"grid", gridTemplateColumns:"repeat(6, 1fr)", gap:12}}>
        <div style={card}><div style={label}>Views</div><div style={val}>{data.kpis.views}</div></div>
        <div style={card}><div style={label}>Hovers</div><div style={val}>{data.kpis.hovers}</div></div>
        <div style={card}><div style={label}>Clicks</div><div style={val}>{data.kpis.clicks}</div></div>
        <div style={card}><div style={label}>Conversions</div><div style={val}>{data.kpis.conversions}</div></div>
        <div style={card}><div style={label}>Spend</div><div style={val}>{fmtMoney(data.kpis.spendCents)}</div></div>
        <div style={card}><div style={label}>Rewards</div><div style={val}>{fmtMoney(data.kpis.rewardsCents)}</div></div>
      </div>

      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginTop:18}}>
        <div style={cardBig}>
          <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
            <div>
              <div style={label}>CTR</div>
              <div style={val}>{pct(data.kpis.ctr)}</div>
            </div>
            <Sparkline points={data.spark} />
          </div>
        </div>
        <div style={cardBig}>
          <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
            <div>
              <div style={label}>CVR</div>
              <div style={val}>{pct(data.kpis.cvr)}</div>
            </div>
            <Sparkline points={data.spark} />
          </div>
        </div>
      </div>

      <h2 style={{marginTop:28, marginBottom:8, fontWeight:700}}>Campaign Breakdown</h2>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%", borderCollapse:"collapse"}}>
          <thead>
            <tr>
              <th style={th}>Campaign</th>
              <th style={th}>Views</th>
              <th style={th}>Hovers</th>
              <th style={th}>Clicks</th>
              <th style={th}>Conversions</th>
              <th style={th}>CTR</th>
              <th style={th}>CVR</th>
              <th style={th}>Spend</th>
              <th style={th}>Rewards</th>
            </tr>
          </thead>
          <tbody>
            {table.map((r:any)=>(
              <tr key={r.campaignId}>
                <td style={td}><code>{r.campaignId}</code></td>
                <td style={tdNum}>{r.views}</td>
                <td style={tdNum}>{r.hovers}</td>
                <td style={tdNum}>{r.clicks}</td>
                <td style={tdNum}>{r.conversions}</td>
                <td style={tdNum}>{pct(r.ctr)}</td>
                <td style={tdNum}>{pct(r.cvr)}</td>
                <td style={tdNum}>{fmtMoney(r.spendCents)}</td>
                <td style={tdNum}>{fmtMoney(r.rewardsCents)}</td>
              </tr>
            ))}
            {table.length===0 && (
              <tr><td style={{...td, padding:"16px"}} colSpan={9}>No data yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{marginTop:24, color:"#666"}}>
        <Link href="/api/ads/analytics/summary">API: summary</Link>{" · "}
        <Link href="/api/ads/analytics/timeseries">API: timeseries</Link>{" · "}
        <Link href="/api/ads/analytics/brands">API: brands</Link>
      </div>
    </div>
  );
}

const card: React.CSSProperties = { background:"#fff", border:"1px solid #eee", borderRadius:10, padding:"12px 14px" };
const cardBig: React.CSSProperties = { ...card, padding:"14px 16px" };
const label: React.CSSProperties = { fontSize:12, textTransform:"uppercase", letterSpacing:".06em", color:"#666" };
const val: React.CSSProperties = { fontSize:22, fontWeight:700, marginTop:4 };
const th: React.CSSProperties = { textAlign:"left", padding:"10px 8px", borderBottom:"1px solid #eee", fontSize:13, color:"#666" };
const td: React.CSSProperties = { padding:"8px", borderBottom:"1px dashed #eee", fontSize:14 };
const tdNum: React.CSSProperties = { ...td, textAlign:"right" };
