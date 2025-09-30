"use client";
import React from "react";
const SAMPLES = [
  { label: "DamagedHelmet", url: "https://threejs.org/examples/models/gltf/DamagedHelmet/glTF-Binary/DamagedHelmet.glb" },
  { label: "Flamingo (anim)", url: "https://threejs.org/examples/models/gltf/Flamingo.glb" },
];
export default function SampleBar({ onPick }: { onPick: (url: string)=>void }) {
  return (
    <div style={{display:"flex", gap:8, flexWrap:"wrap", margin:"8px 0 14px"}}>
      {SAMPLES.map(s => (
        <button key={s.label}
          onClick={()=>onPick(s.url)}
          style={{background:"#1f2937", color:"#fff", border:"1px solid #374151", padding:"8px 10px", borderRadius:8, cursor:"pointer"}}>
          Load Sample: {s.label}
        </button>
      ))}
      <button onClick={()=>onPick("")}
        style={{background:"#374151", color:"#fff", border:"1px solid #4b5563", padding:"8px 10px", borderRadius:8, cursor:"pointer"}}>
        Clear
      </button>
    </div>
  );
}
