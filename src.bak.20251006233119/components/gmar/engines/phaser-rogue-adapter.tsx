"use client";
import React, { useEffect, useRef, useState } from "react";
import type { ReactEngine, EngineProps } from "../../../lib/hub/sdk";

const PhaserRogueAdapter: ReactEngine = ({ paused, settings, emit }: EngineProps) => {
  const [score,setScore]=useState(0);
  const ref = useRef<number|undefined>(undefined);
  useEffect(()=>{
    if (paused) { if (ref.current) cancelAnimationFrame(ref.current); ref.current=undefined; return; }
    const tick = ()=> {
      setScore(s=>{
        const inc = settings.difficulty==="easy"?1:settings.difficulty==="normal"?2:3;
        const nx = s+inc;
        emit({type:"score", value:nx});
        if (nx%40===0) emit({type:"coins", delta:1});
        return nx;
      });
      ref.current = requestAnimationFrame(tick);
    };
    ref.current = requestAnimationFrame(tick);
    return ()=>{ if(ref.current) cancelAnimationFrame(ref.current); ref.current=undefined; };
  },[paused,settings.difficulty,emit]);
  return <div style={{padding:16,border:"1px dashed #334155",borderRadius:12,textAlign:"center"}}>
    <div style={{fontWeight:700}}>Zen Rogue Legacy (Phaser stub)</div>
    <div style={{opacity:.75,fontSize:13}}>Simulated loop. Score: {score}</div>
  </div>;
};
export default PhaserRogueAdapter;
