import React from "react";
import { useRouter } from "next/router";

type Campaign = { id:string; name:string; dailyBudgetCents:number; targetingRadiusMiles:number; status:string };
type Biz = { name:string; phone?:string; whatsapp?:string; addressText?:string };

export default function LumaCard(){
  const router = useRouter();
  const { id } = router.query as { id?:string };
  const [camp,setCamp]=React.useState<Campaign|null>(null);
  const [biz,setBiz]=React.useState<Biz|null>(null);
  const [code,setCode]=React.useState<string>(""); const [busy,setBusy]=React.useState(false);
  const [err,setErr]=React.useState("");

  React.useEffect(()=>{ (async()=>{
    try{
      const c = await fetch("/api/campaigns").then(r=>r.json());
      const found = (c.items||[]).find((x:Campaign)=>x.id===id);
      if(found) setCamp(found);
      const b = await fetch("/api/business").then(r=>r.json());
      if(b.ok) setBiz(b.business||null);
    }catch(e:any){ setErr(String(e.message||e)); }
  })(); },[id]);

  async function genCode(){
    if(!id) return;
    setBusy(true); setErr(""); setCode("");
    try{
      const r = await fetch("/api/redemptions",{method:"POST",headers:{ "Content-Type":"application/json" },body: JSON.stringify({ campaignId: id })});
      const j = await r.json();
      if(!j.ok) throw new Error(j.error||"failed");
      setCode(j.code);
    }catch(e:any){ setErr(String(e.message||e)); }
    finally{ setBusy(false); }
  }

  const telHref = biz?.phone ? `tel:${encodeURIComponent(biz.phone)}` : undefined;
  const waHref  = biz?.whatsapp ? `https://wa.me/${encodeURIComponent(biz.whatsapp)}` : undefined;

  return (
    <main style={S.main}>
      <div style={S.card}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <h1 style={S.h1}>{camp?.name || "Offer"}</h1>
          <a href="/fyp" style={{...S.btnGhost, marginLeft:"auto"}}>Home →</a>
        </div>
        {biz && (
          <div style={S.bizBox}>
            <div style={{fontWeight:900}}>{biz.name}</div>
            {biz.addressText && <div style={{opacity:.8, fontSize:13}}>{biz.addressText}</div>}
            <div style={{display:"flex", gap:10, marginTop:10}}>
              {telHref && <a href={telHref} style={S.btnPrimary}>Call Now</a>}
              {waHref  && <a href={waHref}  style={S.btnGhost}>Message on WhatsApp</a>}
            </div>
          </div>
        )}

        <div style={{marginTop:14}}>
          <button onClick={genCode} disabled={busy} style={S.btnPrimary}>{busy? "Generating…" : "Get Redeem Code"}</button>
          {code && (
            <div style={S.redeemBox}>
              <div style={{opacity:.8, marginBottom:6}}>Show this code at the shop:</div>
              <div style={S.code}>{code}</div>
            </div>
          )}
          {err && <div style={{color:"#ef4444", marginTop:10}}>Error: {err}</div>}
        </div>
      </div>
    </main>
  );
}

const S:any={
  main:{minHeight:"100vh",background:"#0a0c10",color:"#e5e7eb",padding:"24px"},
  card:{maxWidth:900,margin:"0 auto",border:"1px solid #1f2937",borderRadius:14,background:"#0f1319",padding:18},
  h1:{fontSize:22,fontWeight:900,margin:0},
  btnPrimary:{textDecoration:"none",fontWeight:900,padding:"10px 12px",borderRadius:10,background:"linear-gradient(180deg,#22c55e,#16a34a)",color:"#0b0f12",border:"none"},
  btnGhost:{textDecoration:"none",fontWeight:800,padding:"10px 12px",borderRadius:10,background:"transparent",color:"#cbd5e1",border:"1px solid #2b2f36"},
  bizBox:{marginTop:8, border:"1px solid #222", borderRadius:12, padding:12, background:"#0f1319"},
  redeemBox:{marginTop:14, border:"1px dashed #2b2f36", borderRadius:12, padding:12, background:"#0b0f12"},
  code:{fontFamily:"ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace", fontSize:20, fontWeight:900, letterSpacing:1, background:"#0a0c10", border:"1px solid #222", borderRadius:10, padding:"10px 12px", display:"inline-block"}
};
