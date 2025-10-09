"use client";
import React from "react";
type Profile = { username?:string; bio?:string; avatar?:string; featured?:string[]; followers?:number; following?:string[]; invites?:string[] };
export default function UPage(){
  const [p,setP]=React.useState<Profile>({});
  const [device,setDevice]=React.useState("");
  React.useEffect(()=>{
    const d = localStorage.getItem("device-id") || ("dev-"+Math.random().toString(36).slice(2,10));
    localStorage.setItem("device-id", d); setDevice(d);
    load();
  },[]);
  function load(){ fetch("/api/user/profile",{cache:"no-store"}).then(r=>r.json()).then(j=>setP(j.profile||{})); }
  async function follow(target:string){
    const r=await fetch("/api/user/follow",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({target})});
    if((await r.json())?.ok){
      // reward +1 for follow (idempotent per target)
      try{ await fetch("/api/zen/ledger",{method:"POST",headers:{"Content-Type":"application/json","x-device-id":device},body:JSON.stringify({action:"earn",amount:1,reason:"follow",opId:"follow_"+target})}); }catch{}
      load();
    }
  }
  async function mintInvite(){
    const r=await fetch("/api/user/invite/mint",{method:"POST"}); 
    if((await r.json())?.ok){ alert("Invite minted!"); load(); }
  }
  return (
    <main style={{padding:16,color:"#e5e7eb",background:"#0a0a0a",minHeight:"100vh"}}>
      <h1 style={{fontWeight:900,fontSize:22,marginBottom:12}}>Your Profile</h1>
      <div style={{display:"flex",gap:12}}>
        <img src={p.avatar||"https://i.pravatar.cc/80"} width={80} height={80} style={{borderRadius:"50%",border:"1px solid #26272b"}}/>
        <div>
          <div style={{fontWeight:800,fontSize:18}}>@{p.username||"anon"}</div>
          <div style={{opacity:.8,marginTop:4}}>{p.bio||"—"}</div>
          <div style={{marginTop:6,display:"flex",gap:12,opacity:.8,fontSize:12}}>
            <div>Followers: {p.followers||0}</div>
            <div>Following: {(p.following||[]).length}</div>
          </div>
          <div style={{marginTop:8,display:"flex",gap:8}}>
            <a href="/u/edit" style={{background:"#4f46e5",color:"#fff",padding:"6px 10px",borderRadius:8}}>Edit</a>
            <button onClick={mintInvite} style={{background:"#22c55e",color:"#fff",padding:"6px 10px",borderRadius:8}}>Mint Invite</button>
            <button onClick={()=>follow("seed1")} style={{background:"#3f3f46",color:"#fff",padding:"6px 10px",borderRadius:8}}>Follow @seed1</button>
          </div>
        </div>
      </div>
      <div style={{marginTop:16}}>
        <div style={{opacity:.8,fontSize:13,marginBottom:8}}>Your featured videos:</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {(p.featured||[]).length===0 && <div style={{opacity:.6}}>None yet. Go to <a href="/videos" style={{color:"#60a5fa"}}>Videos</a> to feature one.</div>}
          {(p.featured||[]).map(id=><div key={id} style={{background:"#111214",border:"1px solid #27272a",padding:"8px 10px",borderRadius:8}}>{id}</div>)}
        </div>
      </div>
    </main>
  );
}
