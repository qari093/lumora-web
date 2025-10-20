"use client";
import React from "react";
export default function UploadPage(){
  const [file,setFile]=React.useState<File|null>(null);
  const [msg,setMsg]=React.useState<string|null>(null);
  function onChange(e:React.ChangeEvent<HTMLInputElement>){ setFile(e.target.files?.[0]??null); }
  async function onSubmit(e:React.FormEvent){ e.preventDefault(); if(!file){ setMsg("Please choose a file first."); return; } setMsg(`Selected: ${file.name} (${Math.round(file.size/1024)} KB)`); }
  return (
    <main style={{maxWidth:720,margin:"40px auto",padding:16}}>
      <h1>Upload a Video</h1>
      <p>Select a short clip (≤ 3 minutes).</p>
      <form onSubmit={onSubmit} style={{display:"grid",gap:12}}>
        <input type="file" accept="video/*" onChange={onChange}/>
        <button type="submit" style={{padding:"8px 12px",border:"1px solid #222",borderRadius:6}}>Simulate Upload</button>
      </form>
      {msg && <p style={{color:"green"}}>{msg}</p>}
    </main>
  );
}
