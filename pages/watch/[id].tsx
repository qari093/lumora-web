import React, { useEffect } from "react";
import { useRouter } from "next/router";
export default function Watch(){
  const r = useRouter();
  const { id, t } = r.query as { id?: string; t?: string };
  useEffect(()=>{ if(typeof window!=="undefined" && t){ console.log("Seek to", Number(t)); }},[t]);
  return (
    <main style={{minHeight:"100vh",background:"#0a0c10",color:"#e5e7eb",padding:20}}>
      <div style={{marginBottom:12}}><a href="/fyp" style={{color:"#22c55e",textDecoration:"none"}}>← Back</a></div>
      <h1 style={{margin:"6px 0"}}>Watching: {id}</h1>
      <p style={{opacity:.75}}>Start at: {t ? `${t}s` : "0s"}</p>
      <div style={{marginTop:16,height:360,borderRadius:12,background:"#0f1319",border:"1px solid #222",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <span style={{opacity:.7}}>Player placeholder — hook your real player here</span>
      </div>
    </main>
  );
}
