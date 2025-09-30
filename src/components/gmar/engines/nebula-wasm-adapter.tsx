"use client";
import React, { useEffect, useRef, useState } from "react";
import type { ReactEngine, EngineProps } from "../../../lib/hub/sdk";

declare global { interface Window { createNebulaModule?: (cfg?:any)=>Promise<any>; } }

const NebulaWasmAdapter: ReactEngine = ({ paused, emit }: EngineProps) => {
  const canvasRef = useRef<HTMLCanvasElement|null>(null);
  const [status,setStatus]=useState<"loading"|"ready"|"missing"|"error">("loading");
  const modRef = useRef<any>(null);

  useEffect(()=>{
    let cancelled=false;
    (async()=>{
      try{
        // Expect /nebula/nebula.js (Emscripten glue) to set window.createNebulaModule
        await import(/* @vite-ignore */ "/nebula/nebula.js");
        if (!window.createNebulaModule) { setStatus("missing"); return; }
        const module = await window.createNebulaModule({
          canvas: canvasRef.current,
          onRuntimeInitialized(){
            /* no-op */
          },
          print: (...a:any[])=>{/* console.log("[Nebula]", ...a) */},
          printErr: (...a:any[])=>{ console.warn("[Nebula-err]", ...a); },
        });
        if (cancelled) return;
        modRef.current = module;
        setStatus("ready");
      }catch(e){
        console.warn(e);
        setStatus("missing");
      }
    })();
    return ()=>{ cancelled=true; try{ modRef.current?._neb_shutdown?.(); }catch{} };
  },[]);

  useEffect(()=>{
    try{
      if (paused) modRef.current?._neb_pause?.(1);
      else modRef.current?._neb_pause?.(0);
    }catch{}
  },[paused]);

  // demo: forward a small score pulse every few sec to prove hub wiring
  useEffect(()=>{
    if (status!=="ready") return;
    const t = setInterval(()=>emit({type:"score", value: Math.floor(Math.random()*100)}), 3000);
    return ()=>clearInterval(t);
  },[status,emit]);

  if (status==="missing") {
    return <div style={{padding:16,border:"1px dashed #4b5563",borderRadius:12}}>
      <b>Nebula WASM not found</b>
      <div style={{opacity:.75,fontSize:13,marginTop:6}}>
        Put your Emscripten build at <code>public/nebula/nebula.js</code> and <code>public/nebula/nebula.wasm</code>.
      </div>
    </div>;
  }
  return <div style={{border:"1px solid #1f2937",borderRadius:12,overflow:"hidden"}}>
    <div style={{padding:"6px 10px",opacity:.75,fontSize:12}}>Nebula (WASM) — {status}</div>
    <canvas ref={canvasRef} width={960} height={540} style={{width:"100%",display:"block",background:"#000"}} />
  </div>;
};
export default NebulaWasmAdapter;
