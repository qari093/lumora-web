"use client";
import Link from "next/link";
import { useState } from "react";

export default function LiveHome(){
  const [room, setRoom] = useState("zen-fortress");
  const [name, setName] = useState("Host");

  return (
    <div style={{padding:20,color:"#e5e7eb",background:"#020617",minHeight:"100vh"}}>
      <h1 style={{fontWeight:800,fontSize:20,marginBottom:12}}>Go Live (Voice/Video/Chat)</h1>
      <div style={{display:"grid",gap:10,maxWidth:440}}>
        <label>Room ID
          <input value={room} onChange={e=>setRoom(e.target.value)}
            style={{marginTop:6,width:"100%",border:"1px solid #1f2937",borderRadius:8,background:"#0b1220",color:"#e5e7eb",padding:"8px 10px"}}/>
        </label>
        <label>Your Name
          <input value={name} onChange={e=>setName(e.target.value)}
            style={{marginTop:6,width:"100%",border:"1px solid #1f2937",borderRadius:8,background:"#0b1220",color:"#e5e7eb",padding:"8px 10px"}}/>
        </label>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <Link href={`/live/${encodeURIComponent(room)}?name=${encodeURIComponent(name)}&role=host`}
            style={{padding:"8px 12px",border:"1px solid #1f2937",borderRadius:8,background:"#0f172a",color:"#e5e7eb"}}>Start as Host</Link>
          <Link href={`/live/${encodeURIComponent(room)}?name=Viewer&role=viewer`}
            style={{padding:"8px 12px",border:"1px solid #1f2937",borderRadius:8,background:"#0f172a",color:"#e5e7eb"}}>Open Viewer</Link>
        </div>
        <div style={{opacity:.7,fontSize:12}}>
          Share viewer link format: <code>/live/[room]?name=Viewer&role=viewer</code>
        </div>
        <div style={{marginTop:10,display:"grid",gap:6}}>
          <Link href="/live/zen-fortress?name=Host&role=host" style={{color:"#93c5fd",textDecoration:"underline"}}>Zen Fortress — Go Live</Link>
          <Link href="/live/zen-rogue?name=Host&role=host" style={{color:"#93c5fd",textDecoration:"underline"}}>Zen Rogue — Go Live</Link>
          <Link href="/live/zen-moba?name=Host&role=host" style={{color:"#93c5fd",textDecoration:"underline"}}>Zen War Nexus — Go Live</Link>
        </div>
      </div>
    </div>
  );
}
