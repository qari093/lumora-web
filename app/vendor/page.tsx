import Link from "next/link";
import { prisma } from "@/lib/prisma";

const money = (c:number) => "€" + (c/100).toFixed(2);
const pct = (v:number) => (v*100).toFixed(1) + "%";

function Sparkline({ points }: { points:number[] }) {
  const w=160, h=40, p=3;
  const max = Math.max(1, ...points);
  const step = points.length>1 ? (w - p*2) / (points.length-1) : 0;
  const d = points.map((v,i)=>{
    const x = p + i*step;
    const y = h - p - (v/max)*(h - p*2);
    return (i===0 ? "M" : "L") + x.toFixed(1) + "," + y.toFixed(1);
  }).join(" ");
  return <svg width={w} height={h}><path d={d} fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>;
}

async function getSummary(ownerId="OWNER_A", days=30) {
  // Wallet
  const wallet = await prisma.wallet.findUnique({
    where: { ownerId_currency: { ownerId, currency: "EUR" } },
  });
  const since = new Date(Date.now() - days*86400000);

  // Vendor conversions (credited to this owner)
  const convs = await prisma.adConversion.findMany({
    where: { userId: ownerId, createdAt: { gte: since } },
    select: { rewardCents:true, createdAt:true },
    orderBy: { createdAt: "asc" }
  });
  const conversions = convs.length;
  const rewardsCents = convs.reduce((s,x)=>s + Number(x.rewardCents||0), 0);

  // Lightweight engagement totals (global window)
  const evs = await prisma.adEvent.groupBy({
    by: ["action"],
    where: { createdAt: { gte: since } },
    _count: { _all: true }
  });
  let views=0, hovers=0, clicks=0;
  for (const r of evs) {
    const c = Number(r._count._all || 0);
    if (r.action==="view") views += c;
    else if (r.action==="hover") hovers += c;
    else if (r.action==="click") clicks += c;
  }
  const ctr = views>0 ? clicks/views : 0;
  const cvr = clicks>0 ? conversions/clicks : 0;

  // Sparkline: rewards per day (last 14d)
  const daysN = 14;
  const start = new Date(Date.now() - daysN*86400000);
  const arr = new Array(daysN).fill(0);
  for (const c of convs) {
    const idx = Math.floor((new Date(c.createdAt).getTime() - start.getTime())/86400000);
    if (idx>=0 && idx<daysN) arr[idx] += Number(c.rewardCents||0);
  }

  return {
    ownerId,
    wallet: { currency:"EUR", balanceCents: wallet?.balanceCents ?? 0 },
    metrics: { views, hovers, clicks, conversions, rewardsCents, ctr, cvr },
    spark: arr
  };
}

export default async function VendorPage() {
  const ownerId = "OWNER_A";
  const data = await getSummary(ownerId, 30);

  return (
    <div style={{maxWidth:1080, margin:"24px auto", padding:"0 16px", fontFamily:"ui-sans-serif, system-ui"}}>
      <h1 style={{fontSize:26, fontWeight:700, marginBottom:6}}>Vendor Dashboard</h1>
      <p style={{color:"#555"}}>Owner <code>{ownerId}</code> · last 30 days overview</p>

      <div style={{display:"grid", gridTemplateColumns:"repeat(6, 1fr)", gap:12, marginTop:12}}>
        <div style={card}><div style={label}>Wallet</div><div style={val}>{money(data.wallet.balanceCents)}</div></div>
        <div style={card}><div style={label}>Rewards</div><div style={val}>{money(data.metrics.rewardsCents)}</div></div>
        <div style={card}><div style={label}>Conversions</div><div style={val}>{data.metrics.conversions}</div></div>
        <div style={card}><div style={label}>Views</div><div style={val}>{data.metrics.views}</div></div>
        <div style={card}><div style={label}>CTR</div><div style={val}>{pct(data.metrics.ctr)}</div></div>
        <div style={card}><div style={label}>CVR</div><div style={val}>{pct(data.metrics.cvr)}</div></div>
      </div>

      <div style={{...cardBig, marginTop:16}}>
        <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
          <div>
            <div style={label}>Rewards (last 14 days)</div>
            <div style={{fontSize:12, color:"#666"}}>Daily total (EUR cents)</div>
          </div>
          <Sparkline points={data.spark} />
        </div>
      </div>

      <h2 style={{marginTop:24, marginBottom:8, fontWeight:700}}>APIs</h2>
      <div style={{color:"#666"}}>
        <Link href={"/api/vendor/summary?ownerId="+ownerId}>/api/vendor/summary</Link>{" · "}
        <Link href={"/api/vendor/timeseries?ownerId="+ownerId}>/api/vendor/timeseries</Link>
      </div>
    </div>
  );
}

const card: React.CSSProperties = { background:"#fff", border:"1px solid #eee", borderRadius:10, padding:"12px 14px" };
const cardBig: React.CSSProperties = { ...card, padding:"14px 16px" };
const label: React.CSSProperties = { fontSize:12, textTransform:"uppercase", letterSpacing:".06em", color:"#666" };
const val: React.CSSProperties = { fontSize:22, fontWeight:700, marginTop:4 };
