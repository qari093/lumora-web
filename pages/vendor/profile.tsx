import React from "react";

type Biz = { id?:string; name:string; phone?:string; whatsapp?:string; addressText?:string };
export default function ProfilePage(){
  const [biz,setBiz]=React.useState<Biz>({name:""});
  const [msg,setMsg]=React.useState(""); const [err,setErr]=React.useState(""); const [saving,setSaving]=React.useState(false);

  React.useEffect(()=>{ (async()=>{
    try{
      const r = await fetch("/api/business"); const j = await r.json();
      if(j.ok && j.business) setBiz(j.business);
    }catch{}
  })(); },[]);

  async function save(){
    setSaving(true); setErr(""); setMsg("");
    try{
      const r = await fetch("/api/business", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(biz) });
      const j = await r.json();
      if(!j.ok) throw new Error(j.error||"Save failed");
      setBiz(j.business); setMsg("Saved ✓");
    }catch(e:any){ setErr(String(e.message||e)); }
    finally{ setSaving(false); }
  }

  return (
    <main style={S.main}>
      <div style={S.card}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <a href="/vendor/campaigns" style={S.btnGhost}>← Back</a>
          <h1 style={S.h1}>Business Profile</h1>
          <a href="/vendor/campaigns/new" style={{...S.btnPrimary, marginLeft:"auto"}}>+ Create Campaign</a>
        </div>
        <p style={S.sub}>This info shows on your LumaCard (Call/WhatsApp buttons).</p>

        {err && <div style={{color:"#ef4444"}}>Error: {err}</div>}
        {msg && <div style={{color:"#22c55e"}}>{msg}</div>}

        <div style={S.form}>
          <label style={S.label}>Business Name</label>
          <input value={biz.name||""} onChange={e=>setBiz({...biz, name:e.target.value})} style={S.input} placeholder="Lumora Pizza" />

          <label style={S.label}>Phone (for Call button)</label>
          <input value={biz.phone||""} onChange={e=>setBiz({...biz, phone:e.target.value})} style={S.input} placeholder="+49 160 000000" />

          <label style={S.label}>WhatsApp (digits only)</label>
          <input value={biz.whatsapp||""} onChange={e=>setBiz({...biz, whatsapp:e.target.value})} style={S.input} placeholder="49160000000" />

          <label style={S.label}>Address</label>
          <textarea value={biz.addressText||""} onChange={e=>setBiz({...biz, addressText:e.target.value})} style={S.textarea} placeholder="Street, City" />

          <div style={{display:"flex",gap:10, marginTop:12}}>
            <button onClick={save} disabled={saving} style={S.btnPrimary}>{saving? "Saving…" : "Save Profile"}</button>
            <a href="/vendor/campaigns" style={S.btnGhost}>Go to Campaigns →</a>
          </div>
        </div>
      </div>
    </main>
  );
}

const S:any={
  main:{minHeight:"100vh",background:"#0a0c10",color:"#e5e7eb",padding:"24px"},
  card:{maxWidth:900,margin:"0 auto",border:"1px solid #1f2937",borderRadius:14,background:"#0f1319",padding:18},
  h1:{fontSize:22,fontWeight:900,margin:0},
  sub:{margin:"6px 0 14px",color:"#94a3b8"},
  form:{display:"grid",gridTemplateColumns:"1fr",gap:10, maxWidth:520},
  label:{opacity:.8, fontSize:13},
  input:{background:"#0b0f12",border:"1px solid #222",borderRadius:8,color:"#e5e7eb",padding:"10px 12px"},
  textarea:{background:"#0b0f12",border:"1px solid #222",borderRadius:8,color:"#e5e7eb",padding:"10px 12px",minHeight:80},
  btnPrimary:{background:"linear-gradient(180deg,#22c55e,#16a34a)",border:"none",color:"#0b0f12",padding:"10px 14px",borderRadius:10,fontWeight:900,cursor:"pointer"},
  btnGhost:{textDecoration:"none",fontWeight:800,padding:"10px 12px",borderRadius:10,background:"transparent",color:"#cbd5e1",border:"1px solid #2b2f36"}
};
