"use client";
import React,{useEffect,useState} from "react";
export default function AdaptiveCachePruner(){
  const [info,setInfo]=useState({quota:0,usage:0});
  async function refresh(){
    try{
      if(navigator.storage&&navigator.storage.estimate){
        const e=await navigator.storage.estimate();
        setInfo({quota:e.quota||0,usage:e.usage||0});
      }
    }catch{}
  }
  async function prune(){
    try{
      if("caches" in self){
        const keys=await caches.keys();
        for(const k of keys){ await caches.delete(k); }
      }
      await refresh();
      if("serviceWorker" in navigator && navigator.serviceWorker.controller){
        navigator.serviceWorker.controller.postMessage({type:"PRUNE_HINT"});
      }
    }catch{}
  }
  useEffect(()=>{ refresh(); const id=setInterval(refresh,5000); return ()=>clearInterval(id); },[]);
  const pct=info.quota?Math.round(100*info.usage/info.quota):0;
  return (
    <div style={{position:"fixed",left:12,bottom:12,zIndex:2147483000,background:"rgba(15,15,20,.72)",backdropFilter:"blur(10px)",padding:"10px 12px",borderRadius:12,font:"12px system-ui",color:"#fff",display:"flex",gap:8,alignItems:"center"}}>
      <span>Cache {pct}%</span>
      <button onClick={refresh} style={{padding:"4px 8px",border:"1px solid #777",background:"transparent",color:"#fff",borderRadius:8,cursor:"pointer"}}>Refresh</button>
      <button onClick={prune} style={{padding:"4px 8px",border:"1px solid #777",background:"transparent",color:"#fff",borderRadius:8,cursor:"pointer"}}>Prune</button>
    </div>
  );
}
