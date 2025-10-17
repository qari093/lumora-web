"use client";
import React from "react";

export default function GlbUpload({ onChange }: { onChange: (url?: string)=>void }) {
  const [url, setUrl] = React.useState<string>("");

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      const obj = URL.createObjectURL(f);
      onChange(obj);
    }
  };

  return (
    <div style={{
      display:"flex", gap:8, flexWrap:"wrap", alignItems:"center",
      background:"#121212", border:"1px solid #2a2a2a", padding:10, borderRadius:8, margin:"8px 0 14px"
    }}>
      <input
        type="file" accept=".glb,.gltf,model/gltf-binary"
        onChange={onFile}
        style={{color:"#fff"}}
        title="Choose .glb file"
      />
      <input
        placeholder="Paste GLB URL…"
        value={url}
        onChange={(e)=>setUrl(e.target.value)}
        onKeyDown={(e)=>{ if(e.key==="Enter"){ onChange(url||undefined); } }}
        style={{flex:"1 1 280px", background:"#0f0f10", color:"#fff", border:"1px solid #2a2a2a", borderRadius:8, padding:"8px 10px"}}
      />
      <button onClick={()=>onChange(url||undefined)}
        style={{background:"#1f2937", color:"#fff", border:"1px solid #374151", padding:"8px 12px", borderRadius:8, cursor:"pointer"}}>
        Use URL
      </button>
      <button onClick={()=>{ setUrl(""); onChange(undefined); }}
        style={{background:"#374151", color:"#fff", border:"1px solid #4b5563", padding:"8px 12px", borderRadius:8, cursor:"pointer"}}>
        Clear
      </button>
    </div>
  );
}
