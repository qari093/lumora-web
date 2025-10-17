"use client";
import React, { useEffect, useState } from "react";
type Reminder = { id:string; title:string; whenISO:string; repeat?:"NONE"|"DAILY"|"WEEKLY"|"MONTHLY"; enabled:boolean; createdAt:string };

export default function RemindersPage(){
  const [items,setItems]=useState<Reminder[]>([]);
  const [title,setTitle]=useState(""); const [when,setWhen]=useState("");
  const [repeat,setRepeat]=useState<"NONE"|"DAILY"|"WEEKLY"|"MONTHLY">("NONE");
  const [notifOk,setNotifOk]=useState(false);

  async function load(){ const r=await fetch("/api/lumen/reminders",{cache:"no-store"}); const j=await r.json(); setItems(j.items||[]); }
  useEffect(()=>{ load(); },[]);

  async function add(){
    if(!title || !when) return alert("Enter title and time");
    const whenISO = new Date(when).toISOString();
    const r=await fetch("/api/lumen/reminders",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title,whenISO,repeat})});
    if(!r.ok) return alert("Failed");
    setTitle(""); setWhen(""); setRepeat("NONE"); load();
  }
  async function del(id:string){ await fetch(`/api/lumen/reminders?id=${id}`,{method:"DELETE"}); load(); }
  async function toggle(id:string,en:boolean){ await fetch(`/api/lumen/reminders?id=${id}&enabled=${en}`,{method:"PUT"}); load(); }
  async function enableNotif(){ try{ const p=await Notification.requestPermission(); setNotifOk(p==="granted"); }catch{} }

  return (
    <main style={{fontFamily:"ui-sans-serif,system-ui",color:"#e5e7eb",background:"#0a0a0a",minHeight:"100vh",padding:16}}>
      <header style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{fontWeight:900,fontSize:20}}>Lumen · Reminders</div>
        <nav style={{display:"flex",gap:10}}>
          <a href="/lumen" style={{color:"#8b5cf6"}}>Home</a>
          <a href="/api/lumen/ical" target="_blank" style={{color:"#8b5cf6"}}>Subscribe iCal</a>
        </nav>
      </header>

      <section style={{background:"#18181b",border:"1px solid #27272a",borderRadius:16,padding:16,marginBottom:12}}>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" style={{padding:"8px 10px",borderRadius:8,background:"#0a0a0a",border:"1px solid #27272a",color:"#fff"}} />
          <input type="datetime-local" value={when} onChange={e=>setWhen(e.target.value)} style={{padding:"8px 10px",borderRadius:8,background:"#0a0a0a",border:"1px solid #27272a",color:"#fff"}} />
          <select value={repeat} onChange={e=>setRepeat(e.target.value as any)} style={{padding:"8px 10px",borderRadius:8,background:"#0a0a0a",border:"1px solid #27272a",color:"#fff"}}>
            <option value="NONE">No repeat</option>
            <option value="DAILY">Daily</option>
            <option value="WEEKLY">Weekly</option>
            <option value="MONTHLY">Monthly</option>
          </select>
          <button onClick={add} style={{padding:"8px 12px",borderRadius:8,background:"#4f46e5",color:"#fff"}}>Add</button>
          <button onClick={enableNotif} style={{padding:"8px 12px",borderRadius:8,background:"#3f3f46",color:"#fff"}}>{notifOk?"Notifications ✓":"Enable Notifications"}</button>
        </div>
        <p style={{opacity:.7,fontSize:13,marginTop:8}}>Tip: subscribe the iCal feed to get system-level alerts even when this tab is closed.</p>
      </section>

      <section style={{display:"grid",gap:10}}>
        {items.map(r=>(
          <div key={r.id} style={{background:"#18181b",border:"1px solid #27272a",borderRadius:12,padding:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,flexWrap:"wrap"}}>
              <div>
                <div style={{fontWeight:700}}>{r.title}</div>
                <div style={{opacity:.8,fontSize:13}}>{new Date(r.whenISO).toLocaleString()} {r.repeat&&r.repeat!=="NONE" ? `• ${r.repeat}`:""}</div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>toggle(r.id,!r.enabled)} style={{padding:"6px 10px",borderRadius:8,background:r.enabled?"#0ea5e9":"#3f3f46",color:"#fff"}}>{r.enabled?"Enabled":"Disabled"}</button>
                <button onClick={()=>del(r.id)} style={{padding:"6px 10px",borderRadius:8,background:"#ef4444",color:"#fff"}}>Delete</button>
              </div>
            </div>
          </div>
        ))}
        {items.length===0 && <div style={{opacity:.7}}>No reminders yet.</div>}
      </section>
    </main>
  );
}
