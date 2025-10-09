import { useEffect, useState } from "react";
export default function Live(){
  const [events,setEvents]=useState<any[]>([]);
  useEffect(()=>{
    const ev = new EventSource("/api/nexa/events");
    const push=(type:string)=>(e:MessageEvent)=> setEvents(prev=>[{ at:new Date().toLocaleTimeString(), type, data: JSON.parse(e.data) }, ...prev].slice(0,50));
    ["ready","plan:start","plan:complete","xp:gain","xp:levelup","hydrate:add","breath:done","badge:new","weekly:reflect"].forEach(evt=>{
      ev.addEventListener(evt, push(evt));
    });
    return ()=>ev.close();
  },[]);
  return (
    <div style={{ padding:20, color:"#e5e7eb", background:"#0b0f12", minHeight:"100vh" }}>
      <h1>📡 NEXA Live Feed</h1>
      <ul style={{ listStyle:"none", padding:0 }}>
        {events.map((e,i)=>(
          <li key={i} style={{ margin:"8px 0", border:"1px solid #222", borderRadius:10, padding:10 }}>
            <div style={{ fontSize:12, opacity:.7 }}>{e.at}</div>
            <div><b>{e.type}</b></div>
            <pre style={{ whiteSpace:"pre-wrap" }}>{JSON.stringify(e.data,null,2)}</pre>
          </li>
        ))}
      </ul>
    </div>
  );
}
