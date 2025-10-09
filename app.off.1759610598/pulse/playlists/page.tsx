"use client";
import React,{useEffect,useState} from "react";
import Link from "next/link";

export default function Playlists(){
  const [pls,setPls]=useState<any[]>([]);
  const [newName,setNewName]=useState("");

  async function load(){
    const r=await fetch("/api/playlists",{cache:"no-store"}); const j=await r.json();
    setPls(Array.isArray(j)?j:[]);
  }
  useEffect(()=>{load();},[]);

  async function create(){
    const r=await fetch("/api/playlists",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:newName||"Untitled"})});
    if(r.ok){ setNewName(""); load(); }
  }
  async function rename(id:string){
    const nn=prompt("New name?");
    if(!nn) return;
    await fetch("/api/playlists/"+id,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:nn})});
    load();
  }
  async function del(id:string){
    await fetch("/api/playlists/"+id,{method:"DELETE"});
    load();
  }

  return (
    <section>
      <h1 style={{fontSize:24,fontWeight:800,marginBottom:12}}>Playlists</h1>
      <div style={{marginBottom:16}}>
        <input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="New playlist name"
          style={{padding:"8px 12px",borderRadius:8,background:"#0a0a0a",border:"1px solid #27272a",color:"#e5e7eb"}}/>
        <button onClick={create} style={{marginLeft:10,background:"#4f46e5",color:"#fff",padding:"8px 12px",borderRadius:8}}>Create</button>
      </div>
      <div style={{display:"grid",gap:10}}>
        {pls.map(pl=>(
          <div key={pl.id} style={{background:"#18181b",padding:12,borderRadius:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{display:"flex",flexDirection:"column"}}>
              <span style={{fontWeight:600}}>{pl.name}</span>
              <Link href={`/pulse/playlists/${pl.id}`} style={{fontSize:13,opacity:.85,marginTop:4}}>Open →</Link>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>rename(pl.id)} style={{background:"#3f3f46",color:"#fff",padding:"6px 10px",borderRadius:6}}>Rename</button>
              <button onClick={()=>del(pl.id)} style={{background:"#ef4444",color:"#fff",padding:"6px 10px",borderRadius:6}}>Delete</button>
            </div>
          </div>
        ))}
        {pls.length===0 && <div style={{opacity:.75}}>No playlists yet. Create one above.</div>}
      </div>
    </section>
  );
}
