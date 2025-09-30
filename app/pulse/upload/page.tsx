"use client";
import React,{useState} from "react";

export default function Upload(){
  const [file,setFile]=useState<File|null>(null);
  const [status,setStatus]=useState<string>("");

  async function upload(){
    if(!file) return;
    setStatus("Preparing…");
    try{
      // Prefer S3 signed URL if envs present
      const s3Enabled = !!process.env.NEXT_PUBLIC_S3_ENABLED;
      if (s3Enabled){
        const key = "tracks/"+Date.now()+"-"+file.name.replace(/[^a-z0-9_.-]/gi,"_");
        const r = await fetch("/api/upload/sign",{ method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ key, contentType:file.type||"audio/mpeg" }) });
        const j = await r.json();
        if(!j.url) throw new Error("sign failed");
        setStatus("Uploading to S3…");
        await fetch(j.url, { method:"PUT", headers:{ "Content-Type": file.type||"application/octet-stream" }, body: file });
        setStatus("Uploaded ✓  URL will be: s3://"+j.bucket+"/"+j.key);
      } else {
        // Local fallback (saves under /public/uploads)
        const fd = new FormData(); fd.append("file", file);
        setStatus("Uploading locally…");
        const r = await fetch("/api/upload/local", { method:"POST", body: fd });
        const j = await r.json();
        if(!j.ok) throw new Error("upload failed");
        setStatus("Uploaded ✓  URL: "+j.url);
      }
    }catch(e:any){
      setStatus("Error: "+(e?.message||"upload failed"));
    }
  }

  return (
    <main style={{maxWidth:700,margin:"0 auto",padding:"16px"}}>
      <h1 style={{fontSize:24,fontWeight:800,marginBottom:12}}>Upload a Track</h1>
      <div style={{background:"#18181b",border:"1px solid #27272a",padding:16,borderRadius:12}}>
        <input type="file" accept="audio/*" onChange={e=>setFile(e.target.files?.[0]||null)} />
        <button disabled={!file} onClick={upload} style={{marginLeft:10,background:"#4f46e5",color:"#fff",padding:"8px 12px",borderRadius:8,opacity:file?1:.6}}>Upload</button>
        <div style={{marginTop:10,opacity:.8,fontSize:13}}>{status}</div>
        <div style={{marginTop:10,opacity:.8,fontSize:13}}>Tip: after upload, add the URL to your manifest or a playlist item to make it discoverable.</div>
      </div>
    </main>
  );
}
