"use client";
import React from "react";
export default function FullscreenButton({ targetId }:{ targetId:string }){
  function go(){
    const el=document.getElementById(targetId);
    if(el && (el as any).requestFullscreen){ (el as any).requestFullscreen(); }
  }
  return <button onClick={go} style={{background:"#3f3f46",color:"#fff",padding:"6px 10px",borderRadius:8}}>Fullscreen</button>;
}
