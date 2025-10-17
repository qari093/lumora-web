"use client";
import React from "react";
export default function Consent(){
  const [ok,setOk]=React.useState(false);
  const accept = async ()=>{
    const r = await fetch("/api/consent",{ method:"POST" });
    if(r.ok) window.location.href = "/upload";
  };
  return <div style={{padding:20}}>
    <h1>Uploader Consent</h1>
    <p>Please confirm you have the rights and consent to upload/process this media, and that it follows our <a href="/legal/community">Guidelines</a>, <a href="/legal/tos">TOS</a>, and <a href="/legal/privacy">Privacy</a>.</p>
    <label style={{display:"flex",gap:8,alignItems:"center",marginTop:10}}>
      <input type="checkbox" checked={ok} onChange={e=>setOk(e.target.checked)} />
      <span>I confirm I have rights & consent for the content I upload.</span>
    </label>
    <button disabled={!ok} onClick={accept} style={{marginTop:12,padding:"10px 14px",border:"1px solid #333",borderRadius:10,cursor: ok?"pointer":"not-allowed"}}>
      Accept & Continue
    </button>
  </div>;
}
