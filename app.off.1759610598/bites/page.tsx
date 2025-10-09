"use client";
import React, { useState } from "react";

export default function BitesPage(){
  const [location,setLocation]=useState("New York, Times Square");
  const [style,setStyle]=useState("Cinematic Vlog");
  const [duration,setDuration]=useState(12);
  const [musicMood,setMusicMood]=useState("Energetic");
  const [language,setLanguage]=useState("English");
  const [tier,setTier]=useState<"clean"|"fashion"|"spicy-safe">("fashion");
  const [busy,setBusy]=useState(false);
  const [resp,setResp]=useState<any>(null);
  const [err,setErr]=useState<string | null>(null);

  async function gen(){
    setBusy(true); setErr(null); setResp(null);
    try{
      const r = await fetch("/api/bites/plan",{ method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ scenario:{ location, style, durationSec: duration }, creative:{ musicMood, language }, safetyTier: tier })
      });
      if(!r.ok){ throw new Error(await r.text()); }
      setResp(await r.json());
    }catch(e:any){ setErr(e?.message || "failed"); }
    finally{ setBusy(false); }
  }

  return (
    <div style={{maxWidth:840,margin:"24px auto",padding:16,fontFamily:"-apple-system, Inter, Segoe UI, Roboto, Helvetica, Arial"}}>
      <h1 style={{margin:"0 0 12px"}}>Bites — AI Video Studio</h1>
      <p style={{marginTop:0,opacity:.75}}>Fill the fields and generate a plan via App Router API.</p>

      <div style={{display:"grid",gap:12,gridTemplateColumns:"1fr 1fr"}}>
        <div>
          <label>Location<input value={location} onChange={e=>setLocation(e.target.value)} style={{width:"100%",padding:10,marginTop:6}}/></label>
          <label style={{display:"block",marginTop:10}}>Style<input value={style} onChange={e=>setStyle(e.target.value)} style={{width:"100%",padding:10,marginTop:6}}/></label>
          <label style={{display:"block",marginTop:10}}>Duration (5–60)
            <input type="number" min={5} max={60} value={duration} onChange={e=>setDuration(parseInt(e.target.value||"12",10))} style={{width:120,padding:10,marginTop:6}}/>
          </label>
          <label style={{display:"block",marginTop:10}}>Music mood<input value={musicMood} onChange={e=>setMusicMood(e.target.value)} style={{width:"100%",padding:10,marginTop:6}}/></label>
          <label style={{display:"block",marginTop:10}}>Language<input value={language} onChange={e=>setLanguage(e.target.value)} style={{width:"100%",padding:10,marginTop:6}}/></label>
          <label style={{display:"block",marginTop:10}}>Safety tier
            <select value={tier} onChange={e=>setTier(e.target.value as any)} style={{width:"100%",padding:10,marginTop:6}}>
              <option value="clean">Clean</option>
              <option value="fashion">Fashion</option>
              <option value="spicy-safe">Spicy-Safe</option>
            </select>
          </label>
          <button onClick={gen} disabled={busy} style={{marginTop:12,padding:"12px 16px"}}>{busy?"Generating…":"Generate Plan"}</button>
          {err && <div style={{color:"#b00020",marginTop:8}}>⚠ {err}</div>}
        </div>

        <div style={{border:"1px solid #eaeaea",borderRadius:10,padding:12,minHeight:220,background:"#fff"}}>
          {!resp ? <div style={{opacity:.7}}>No plan yet.</div> :
            <pre style={{whiteSpace:"pre-wrap",wordBreak:"break-word",margin:0,fontSize:12}}>{JSON.stringify(resp,null,2)}</pre>}
        </div>
      </div>
    </div>
  );
}
