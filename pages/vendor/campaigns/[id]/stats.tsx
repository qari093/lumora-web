import React from "react";
import { useRouter } from "next/router";

type Campaign = {
  id:string; name:string; dailyBudgetCents:number;
  targetingRadiusMiles:number; status:"active"|"paused"|"ended"; createdAt:string;
};

export default function CampaignStatsPage(){
  const router = useRouter();
  const { id } = router.query as { id?:string };
  const [camp,setCamp]=React.useState<Campaign|null>(null);
  const [stats,setStats]=React.useState<{views:number;clicks:number;redemptions:number;ctr:number}|null>(null);
  const [err,setErr]=React.useState("");

  React.useEffect(()=>{ if(!id) return;
    (async()=>{
      try{
        const r = await fetch("/api/campaigns"); const j = await r.json();
        const c:Campaign|undefined = (j.items||[]).find((x:Campaign)=>x.id===id);
        if(!c) { setErr("Campaign not found"); return; }
        setCamp(c);
        const s = await fetch(`/api/stats/overview?campaignId=${encodeURIComponent(id)}`).then(r=>r.json());
        if(!s.ok) throw new Error(s.error||"stats failed");
        setStats({ views:s.views||0, clicks:s.clicks||0, redemptions:s.redemptions||0, ctr:s.ctr||0 });
      }catch(e:any){ setErr(String(e.message||e)); }
    })();
  },[id]);

  return (
    <main style={S.main}>
      <div style={S.card}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <a href="/vendor/campaigns" style={S.btnGhost}>← Back</a>
          <h1 style={S.h1}>Campaign Stats</h1>
          {camp && <a href={`/l/${camp.id}`} style={{...S.link, marginLeft:"auto"}}>Open LumaCard →</a>}
        </div>
        {camp && <p style={S.sub}>
          <b>{camp.name}</b> • Status: <b style={{textTransform:"capitalize"}}>{camp.status}</b> • Budget/day: €{(camp.dailyBudgetCents/100).toFixed(2)} • Radius: {camp.targetingRadiusMiles} mi
        </p>}
        {err && <div style={{color:"#ef4444"}}>Error: {err}</div>}

        {stats ? (
          <div style={S.kpiRow}>
            <div style={S.kpi}><div style={S.kpiVal}>{stats.views}</div><div style={S.kpiLbl}>Views</div></div>
            <div style={S.kpi}><div style={S.kpiVal}>{stats.clicks}</div><div style={S.kpiLbl}>Clicks</div></div>
            <div style={S.kpi}><div style={S.kpiVal}>{stats.ctr}%</div><div style={S.kpiLbl}>CTR</div></div>
            <div style={S.kpi}><div style={S.kpiVal}>{stats.redemptions}</div><div style={S.kpiLbl}>Redemptions</div></div>
          </div>
        ) : (
          <div style={{opacity:.8}}>Loading stats…</div>
        )}

        <div style={{marginTop:16, opacity:.85, fontSize:13}}>
          <div>• Views/Clicks come from live in-memory metrics (ad impressions/CTA presses).</div>
          <div>• Redemptions are persisted in the database.</div>
        </div>
      </div>
    </main>
  );
}

const S:any={
  main:{minHeight:"100vh",background:"#0a0c10",color:"#e5e7eb",padding:"24px"},
  card:{maxWidth:980,margin:"0 auto",border:"1px solid #1f2937",borderRadius:14,background:"#0f1319",padding:18},
  h1:{fontSize:22,fontWeight:900,margin:"0 6px 0 0"},
  sub:{margin:"6px 0 14px",color:"#94a3b8"},
  kpiRow:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12, marginTop:8},
  kpi:{border:"1px solid #222",borderRadius:12,padding:"12px 14px",background:"#0f1319",textAlign:"right"},
  kpiVal:{fontWeight:900,fontSize:22},
  kpiLbl:{opacity:.7,fontSize:12},
  btnGhost:{textDecoration:"none",fontWeight:800,padding:"8px 10px",borderRadius:10,background:"transparent",color:"#cbd5e1",border:"1px solid #2b2f36"},
  link:{textDecoration:"none",color:"#a7f3d0",fontWeight:800}
};
