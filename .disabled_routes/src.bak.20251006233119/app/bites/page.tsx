"use client";
import React from "react";
import { io, Socket } from "socket.io-client";

export default function BitesPage(){
  const [id,setId] = React.useState<string>("");
  const [log,setLog] = React.useState<string[]>([]);
  const sockRef = React.useRef<Socket|null>(null);

  React.useEffect(()=>{
    const s = io("/", { path: "/api/lumalink/socket", transports:["websocket","polling"] });
    sockRef.current = s;
    s.on("bites:progress", (ev:any)=>{
      if (!id || ev.id !== id) return;
      setLog(l=>[...l, JSON.stringify(ev)]);
    });
    return ()=>{ s.close(); };
  }, [id]);

  const enqueue = async ()=>{
    setLog([]);
    const r = await fetch("/api/bites/enqueue", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ input:{ kind:"demo" } }) });
    const j = await r.json();
    setId(j.id);
  };

  return (
    <div style={{ padding:20 }}>
      <h1>🎬 Bites — Fake Renderer</h1>
      <button onClick={enqueue} style={{ padding:"10px 14px", border:"1px solid #333", borderRadius:10 }}>Enqueue demo job</button>
      {id && <div style={{ marginTop:8 }}>Job: <code>{id}</code></div>}
      <pre style={{ marginTop:12, background:"#0b0f12", color:"#e5e7eb", padding:12, borderRadius:8, minHeight:120 }}>{log.join("\n")||"—"}</pre>
      <div style={{ marginTop:8, opacity:.8 }}>یہ ڈیمو in-memory پروگریس دکھاتا ہے — پروڈکشن میں BullMQ/Redis لگائیں۔</div>
    </div>
  );
}
