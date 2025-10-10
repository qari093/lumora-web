"use client";
import React from "react";
export default function RoleBar(){
  const [me, setMe] = React.useState<{name:string; role:string}>({name:"Guest", role:"guest"});
  React.useEffect(()=>{
    const m = document.cookie.split("; ").reduce<Record<string,string>>((a,c)=>{
      const i=c.indexOf("="); if(i>0){ a[c.slice(0,i)]=decodeURIComponent(c.slice(i+1)); } return a;
    },{});
    setMe({ name: m.name || "Guest", role: m.role || "guest" });
  },[]);
  async function setRole(role:string){
    await fetch("/api/auth/set-role",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({role})});
    location.reload();
  }
  async function logout(){
    await fetch("/api/auth/logout",{method:"POST"}); location.href="/";
  }
  const roles=["admin","moderator","creator","advertiser","user","guest"];
  return (
    <div style={{display:"flex",gap:8,alignItems:"center",padding:"8px 12px",borderBottom:"1px solid #222",background:"#0b0f12",color:"#e5e7eb"}}>
      <strong>{me.name} ({me.role})</strong>
      <span style={{marginLeft:"auto"}} />
      {roles.map(r=><button key={r} onClick={()=>setRole(r)} style={{padding:"6px 10px",border:"1px solid #333",borderRadius:8,background:"#111827",color:"#e5e7eb",cursor:"pointer"}}>{r}</button>)}
      <button onClick={logout} style={{padding:"6px 10px",border:"1px solid #933",borderRadius:8,background:"#1a0f0f",color:"#ffe5e5",cursor:"pointer"}}>Logout</button>
    </div>
  );
}
