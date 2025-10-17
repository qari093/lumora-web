import React from "react";
type Tx = { id:string; type:"topup"|"spend"|"refund"; amount:number; desc?:string; created_at:string };
export default function WalletPage(){
  const [bal,setBal]=React.useState(0); const [cur,setCur]=React.useState("EUR");
  const [tx,setTx]=React.useState<Tx[]>([]); const [amt,setAmt]=React.useState<number>(100);
  const [loading,setLoading]=React.useState(false); const [err,setErr]=React.useState("");
  async function load(){ try{ const r=await fetch("/api/wallet"); const j=await r.json();
    if(!j.ok) throw new Error(j.error||"failed"); setBal(j.balance); setCur(j.currency); setTx(j.tx||[]); }catch(e:any){ setErr(String(e.message||e)); } }
  React.useEffect(()=>{ load(); },[]);
  async function topup(a:number){ setLoading(true); setErr(""); try{
    const r=await fetch("/api/wallet/topup",{ method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ amount:a, desc:"Test mode top-up" })});
    const j=await r.json(); if(!j.ok) throw new Error(j.error||"failed"); await load();
  }catch(e:any){ setErr(String(e.message||e)); } finally{ setLoading(false); } }
  return (<main style={S.main}><div style={S.card}>
    <h1 style={S.h1}>Wallet & Billing (Test-mode)</h1>
    <p style={S.sub}>This updates an in-memory balance for quick end-to-end testing.</p>
    <div style={{display:"flex",gap:12,alignItems:"center",margin:"10px 0 16px"}}>
      <div style={S.kpi}><div style={S.kpiVal}>{cur} {bal.toFixed(2)}</div><div style={S.kpiLbl}>Balance</div></div>
      <button onClick={()=>topup(100)} disabled={loading} style={S.btnPrimary}>{loading?"Adding…":"Add €100 (test)"}</button>
      <div style={{display:"flex",alignItems:"center",gap:6,marginLeft:8}}>
        <input type="number" min={1} value={amt} onChange={e=>setAmt(Number(e.target.value||0))} style={S.input}/>
        <button onClick={()=>topup(amt)} disabled={loading||amt<=0} style={S.btnGhost}>Add custom</button>
      </div>
      <a href="/vendor/campaigns/new" style={{marginLeft:"auto",...S.link}}>Create Campaign →</a>
    </div>
    {err && <div style={{color:"#ef4444",marginBottom:10}}>Error: {err}</div>}
    <h3 style={{margin:"10px 0 8px"}}>Recent Transactions</h3>
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      {(tx||[]).length ? tx.map(t=>(
        <div key={t.id} style={{border:"1px solid #222",borderRadius:10,padding:10,background:"#0f1319"}}>
          <div style={{display:"flex",gap:8}}>
            <div style={{fontWeight:800,minWidth:70}}>{t.type.toUpperCase()}</div>
            <div>{t.desc||"Top up"}</div>
            <div style={{marginLeft:"auto"}}>+€{t.amount.toFixed(2)}</div>
          </div>
          <div style={{opacity:.7,fontSize:12,marginTop:4}}>{new Date(t.created_at).toLocaleString()}</div>
        </div>
      )) : <div style={{opacity:.8}}>No transactions yet.</div>}
    </div>
  </div></main>);}
const S:any={ main:{minHeight:"100vh",background:"#0a0c10",color:"#e5e7eb",padding:"24px"},
  card:{maxWidth:900,margin:"0 auto",border:"1px solid #1f2937",borderRadius:14,background:"#0f1319",padding:18},
  h1:{fontSize:22,fontWeight:900,margin:0}, sub:{margin:"6px 0 14px",color:"#94a3b8"},
  input:{background:"#0b0f12",border:"1px solid #222",borderRadius:8,color:"#e5e7eb",padding:"8px 10px",width:110},
  btnPrimary:{background:"linear-gradient(180deg,#22c55e,#16a34a)",border:"none",color:"#0b0f12",padding:"10px 14px",borderRadius:10,fontWeight:900,cursor:"pointer"},
  btnGhost:{background:"transparent",border:"1px solid #2b2f36",color:"#cbd5e1",padding:"10px 10px",borderRadius:10,cursor:"pointer"},
  kpi:{border:"1px solid #222",borderRadius:12,padding:"10px 14px",background:"#0f1319"},
  kpiVal:{fontWeight:900,fontSize:18}, kpiLbl:{opacity:.7,fontSize:12},
  link:{color:"#a7f3d0",textDecoration:"none",fontWeight:800} };
