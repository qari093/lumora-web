"use client";
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
type Track = { id:string; title:string; artist?:string; url:string };
type Ctx = { queue:Track[]; current?:Track; playing:boolean; playNow:(t:Track)=>void; enqueue:(t:Track)=>void; next:()=>void; prev:()=>void; pause:()=>void; resume:()=>void; };
const C = createContext<Ctx|null>(null);
export function usePulsePlayer(){ const c=useContext(C); if(!c) throw new Error("Player not mounted"); return c; }
export default function PlayerDock({children}:{children:React.ReactNode}){
  const [q,setQ]=useState<Track[]>([]); const [i,setI]=useState(-1); const [p,setP]=useState(false); const a=useRef<HTMLAudioElement|null>(null);
  const cur = useMemo(()=> q[i], [q,i]);
  function playNow(t:Track){ setQ(x=>[t,...x.filter(v=>v.id!==t.id)]); setI(0); setP(true); }
  function enqueue(t:Track){ setQ(x=>[...x,t]); if(i<0){ setI(0); setP(true);} }
  function next(){ if(!q.length) return; setI(v=>(v+1)%q.length); setP(true); }
  function prev(){ if(!q.length) return; setI(v=>(v-1+q.length)%q.length); setP(true); }
  function pause(){ a.current?.pause(); setP(false); }
  function resume(){ a.current?.play().catch(()=>{}); setP(true); }
  useEffect(()=>{ if(!a.current||!cur) return; a.current.src=cur.url; a.current.load(); if(p) a.current.play().catch(()=>{}); },[cur?.url]);
  useEffect(()=>{ if(!a.current) return; if(p){ a.current.play().catch(()=>{});} else { a.current.pause(); } },[p]);
  return (
    <C.Provider value={{queue:q,current:cur,playing:p,playNow,enqueue,next,prev,pause,resume}}>
      {children}
      <div style={{position:"fixed",left:0,right:0,bottom:0,background:"#0f0f12",borderTop:"1px solid #27272a",padding:"10px 14px",display:"flex",alignItems:"center",gap:12}}>
        <div style={{flex:1,overflow:"hidden"}}>
          <div style={{fontWeight:600,whiteSpace:"nowrap",textOverflow:"ellipsis",overflow:"hidden"}}>{cur?.title ?? "Nothing playing"}</div>
          <div style={{opacity:.8,fontSize:12}}>{cur?.artist ?? "Queue a song to start"}</div>
        </div>
        <audio ref={a} onEnded={next} style={{display:"none"}} />
        <button onClick={prev} style={{background:"#3f3f46",color:"#fff",borderRadius:8,padding:"8px 10px"}}>⏮</button>
        {p ? <button onClick={pause} style={{background:"#4f46e5",color:"#fff",borderRadius:8,padding:"8px 10px"}}>⏸</button>
            : <button onClick={resume} style={{background:"#4f46e5",color:"#fff",borderRadius:8,padding:"8px 10px"}}>▶️</button>}
        <button onClick={next} style={{background:"#3f3f46",color:"#fff",borderRadius:8,padding:"8px 10px"}}>⏭</button>
      </div>
    </C.Provider>
  );
}
