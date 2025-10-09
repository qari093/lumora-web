"use client";
import React from "react";
type Video = { id:string; title:string; url:string; createdAt:number; username?:string; device?:string };
export default function VideosPage(){
  const [items,setItems]=React.useState<Video[]>([]);
  const [title,setTitle]=React.useState(""); const [url,setUrl]=React.useState("");
  const [device,setDevice]=React.useState("");
  React.useEffect(()=>{ 
    const d = localStorage.getItem("device-id") || ("dev-"+Math.random().toString(36).slice(2,10));
    localStorage.setItem("device-id", d); setDevice(d);
    load();
  },[]);
  function load(){ fetch("/api/videos",{cache:"no-store"}).then(r=>r.json()).then(j=>setItems(j.items||[])); }
  async function add(){
    const r=await fetch("/api/user/video/add",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title,url})});
    const j=await r.json(); if(j?.ok){
      // Reward: first upload +5 (idempotency per action key)
      try{ await fetch("/api/zen/ledger",{method:"POST",headers:{"Content-Type":"application/json","x-device-id":device},body:JSON.stringify({action:"earn",amount:5,reason:"first_upload",opId:"first_upload"})}); }catch{}
      setTitle(""); setUrl(""); load();
    }
  }
  async function like(id:string){
    const r=await fetch("/api/videos/like",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({videoId:id})});
    if((await r.json())?.ok){
      // Reward like-giver +1 coin (opId per video)
      try{ await fetch("/api/zen/ledger",{method:"POST",headers:{"Content-Type":"application/json","x-device-id":device},body:JSON.stringify({action:"earn",amount:1,reason:"like",opId:"like_"+id})}); }catch{}
      load();
    }
  }
  async function feature(id:string){
    const r=await fetch("/api/user/video/feature",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id})});
    if((await r.json())?.ok) alert("Featured!");
  }
  return (
    <main style={{padding:16,color:"#e5e7eb",background:"#0a0a0a",minHeight:"100vh"}}>
      <h1 style={{fontWeight:900,fontSize:22,marginBottom:12}}>Lumora Videos</h1>
      <div style={{display:"flex",gap:8,marginBottom:12}}>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" style={{padding:"8px 10px",borderRadius:8,background:"#111214",color:"#fff",border:"1px solid #26272b",width:220}}/>
        <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="YouTube/Vimeo/MP4 URL" style={{padding:"8px 10px",borderRadius:8,background:"#111214",color:"#fff",border:"1px solid #26272b",flex:1}}/>
        <button onClick={add} disabled={!title||!url} style={{background:"#22c55e",color:"#fff",padding:"6px 10px",borderRadius:8}}>Add Video</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:12}}>
        {items.map(v=>(
          <div key={v.id} style={{background:"#111214", border:"1px solid #26272b", borderRadius:12, padding:10}}>
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <div style={{fontWeight:700}}>{v.title}</div>
              <div style={{opacity:.7,fontSize:12}}>@{v.username||"anon"}</div>
            </div>
            <div style={{fontSize:12,opacity:.7,marginTop:4}}>{new Date(v.createdAt).toLocaleString()}</div>
            <div style={{marginTop:8}}>
              {v.url.includes("youtube.com")||v.url.includes("youtu.be") ? (
                <a href={v.url} target="_blank" style={{color:"#60a5fa"}}>Watch on YouTube</a>
              ) : v.url.includes("vimeo.com") ? (
                <a href={v.url} target="_blank" style={{color:"#60a5fa"}}>Watch on Vimeo</a>
              ) : (
                <video src={v.url} controls style={{width:"100%",borderRadius:6}}/>
              )}
            </div>
            <div style={{display:"flex",gap:8,marginTop:8}}>
              <button onClick={()=>like(v.id)} style={{background:"#3f3f46",color:"#fff",padding:"6px 10px",borderRadius:8}}>Like</button>
              <button onClick={()=>feature(v.id)} style={{background:"#4f46e5",color:"#fff",padding:"6px 10px",borderRadius:8}}>Feature on my page</button>
              <a href={"/p/"+(v.username||"seed1")+"?video="+v.id} target="_blank" style={{background:"#0ea5e9",color:"#fff",padding:"6px 10px",borderRadius:8}}>Share</a>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
