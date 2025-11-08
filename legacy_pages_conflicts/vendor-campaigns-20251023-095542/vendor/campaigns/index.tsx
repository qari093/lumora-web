import React from "react";

type Campaign = {
  id:string;
  name:string;
  dailyBudgetCents:number;
  targetingRadiusMiles:number;
  status:"active"|"paused"|"ended";
  createdAt:string;
};
type RedemptionsRes = { ok:boolean; total?:number };

export default function VendorCampaigns(){
  const [items,setItems]=React.useState<Campaign[]>([]);
  const [totals,setTotals]=React.useState<Record<string,number>>({});
  const [loading,setLoading]=React.useState(true);
  const [busy,setBusy]=React.useState<string>("");

  async function load(){
    try{
      const r = await fetch("/api/campaigns");
      const j = await r.json();
      const list:Campaign[] = j.items||[];
      setItems(list);
      await Promise.all(list.map(async c=>{
        const rr = await fetch(`/api/redemptions?campaignId=${encodeURIComponent(c.id)}`);
        const jr:RedemptionsRes = await rr.json();
        setTotals(prev=>({ ...prev, [c.id]: (jr.total||0) }));
      }));
    } finally { setLoading(false); }
  }

  React.useEffect(()=>{ load(); },[]);

  async function toggle(c:Campaign){
    const next = c.status==="active" ? "paused" : "active";
    setBusy(c.id);
    try{
      const r = await fetch(`/api/campaigns/${c.id}/status`,{
        method:"PATCH", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ status: next })
      });
      const j = await r.json();
      if(!j.ok) throw new Error(j.error||"update failed");
      setItems(prev => prev.map(x => x.id===c.id ? { ...x, status: next } : x));
    }catch(e){ console.error(e); }
    finally{ setBusy(""); }
  }

  return (
    <main style={S.main}>
      <div style={S.card}>
        <div style={{display:"flex", alignItems:"center", gap:12}}>
          <h1 style={S.h1}>My Campaigns</h1>
          <a href="/vendor/campaigns/new" style={S.btnPrimary}>+ Create Campaign</a>
          <a href="/vendor/wallet" style={S.btnGhost}>Wallet →</a>
        </div>
        <p style={S.sub}>Manage, pause, and analyse performance.</p>

        {loading ? <div style={{opacity:.8}}>Loading…</div> : (
          items.length ? (
            <div style={{display:"flex", flexDirection:"column", gap:10}}>
              {items.map(c=>(
                <div key={c.id} style={S.row}>
                  <div>
                    <div style={{fontWeight:900}}>{c.name}</div>
                    <div style={{opacity:.7, fontSize:12}}>
                      Status: <b style={{textTransform:"capitalize"}}>{c.status}</b>
                      {" • "}Budget/day: €{(c.dailyBudgetCents/100).toFixed(2)}
                      {" • "}Radius: {c.targetingRadiusMiles} mi
                    </div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:10, marginLeft:"auto"}}>
                    <div style={S.kpi}>
                      <div style={S.kpiVal}>{totals[c.id] ?? 0}</div>
                      <div style={S.kpiLbl}>Redemptions</div>
                    </div>
                    <a href={`/l/${c.id}`} style={S.link}>LumaCard →</a>
                    <a href={`/vendor/campaigns/${c.id}/stats`} style={S.link}>Stats →</a>
                    <button onClick={()=>toggle(c)} disabled={!!busy}
                            style={c.status==="active" ? S.btnWarn : S.btnOk}
                            aria-busy={busy===c.id}>
                      {busy===c.id ? "…" : c.status==="active" ? "Pause" : "Resume"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : <div style={{opacity:.85}}>No campaigns yet. Create your first one.</div>
        )}
      </div>
    </main>
  );
}

const S:any={
  main:{minHeight:"100vh",background:"#0a0c10",color:"#e5e7eb",padding:"24px"},
  card:{maxWidth:980,margin:"0 auto",border:"1px solid #1f2937",borderRadius:14,background:"#0f1319",padding:18},
  h1:{fontSize:22,fontWeight:900,margin:"0 6px 0 0"},
  sub:{margin:"6px 0 14px",color:"#94a3b8"},
  row:{display:"flex",alignItems:"center",gap:12,border:"1px solid #222",borderRadius:12,padding:12,background:"#0f1319"},
  btnPrimary:{textDecoration:"none",fontWeight:900,padding:"10px 12px",borderRadius:10,
              background:"linear-gradient(180deg,#22c55e,#16a34a)",color:"#0b0f12",border:"none"},
  btnGhost:{textDecoration:"none",fontWeight:800,padding:"10px 12px",borderRadius:10,
            background:"transparent",color:"#cbd5e1",border:"1px solid #2b2f36"},
  btnOk:{fontWeight:900,padding:"8px 12px",borderRadius:10,background:"#16a34a",color:"#0b0f12",border:"none",cursor:"pointer"},
  btnWarn:{fontWeight:900,padding:"8px 12px",borderRadius:10,background:"#f59e0b",color:"#0b0f12",border:"none",cursor:"pointer"},
  link:{textDecoration:"none",color:"#a7f3d0",fontWeight:800},
  kpi:{border:"1px solid #222",borderRadius:12,padding:"8px 12px",background:"#0f1319",textAlign:"right",minWidth:92},
  kpiVal:{fontWeight:900,fontSize:18},
  kpiLbl:{opacity:.7,fontSize:12}
};
