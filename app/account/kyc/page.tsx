"use client";
import { useState } from "react";
const BASE = "";

export default function KycPage(){
  const [ownerId, setOwner] = useState("OWNER_A");
  const [req, setReq] = useState<any>(null);
  const [msg, setMsg] = useState("");

  async function create(e:any){
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload: any = Object.fromEntries(fd.entries());
    payload.ownerId = ownerId;
    payload.consent = !!payload.consent;
    const r = await fetch(BASE+"/api/kyc/request",{ method:"POST", headers:{ "content-type":"application/json" }, body: JSON.stringify(payload) }).then(r=>r.json());
    setReq(r.request || null); setMsg(r.ok ? "Request ready" : r.error || "Error");
  }
  async function upload(docType:string, file:File|undefined|null){
    if (!req?.id || !file) return;
    const b64 = await file.arrayBuffer().then(b=> btoa(String.fromCharCode(...new Uint8Array(b as ArrayBuffer))));
    const r = await fetch(BASE+"/api/kyc/upload",{ method:"POST", headers:{ "content-type":"application/json" }, body: JSON.stringify({
      requestId:req.id, docType, mimeType:file.type, filename:file.name, dataBase64:b64
    })}).then(r=>r.json());
    setMsg(r.ok ? "Uploaded "+docType : r.error || "Upload failed");
  }
  async function refresh(){
    const r = await fetch(BASE+"/api/kyc/status?ownerId="+ownerId).then(r=>r.json());
    setReq(r.request || null);
  }

  return (
    <div style={{maxWidth:720, margin:"24px auto", padding:"0 16px"}}>
      <h1 style={{fontSize:24, fontWeight:700}}>KYC Verification</h1>
      <label style={{display:"block", marginTop:10}}>Owner ID</label>
      <input value={ownerId} onChange={(e)=>setOwner(e.target.value)} style={{width:"100%", padding:8, border:"1px solid #ddd", borderRadius:6}}/>
      <form onSubmit={create} style={{marginTop:12}}>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10}}>
          <div><label>Full name</label><input name="fullName" required style={{width:"100%", padding:8, border:"1px solid #ddd", borderRadius:6}}/></div>
          <div><label>DOB (ISO)</label><input name="dob" placeholder="1990-01-01" style={{width:"100%", padding:8, border:"1px solid #ddd", borderRadius:6}}/></div>
          <div><label>ID type</label><input name="idType" placeholder="PASSPORT" style={{width:"100%", padding:8, border:"1px solid #ddd", borderRadius:6}}/></div>
          <div><label>ID number</label><input name="idNumber" style={{width:"100%", padding:8, border:"1px solid #ddd", borderRadius:6}}/></div>
        </div>
        <label style={{display:"flex", alignItems:"center", gap:8, marginTop:8}}>
          <input type="checkbox" name="consent"/> I consent (demo)
        </label>
        <button type="submit" style={{marginTop:8, padding:"8px 12px", border:"1px solid #ddd", borderRadius:8}}>Create / Reuse</button>
        <button type="button" onClick={refresh} style={{marginTop:8, marginLeft:8, padding:"8px 12px", border:"1px solid #ddd", borderRadius:8}}>Refresh</button>
      </form>

      {req && (
        <div style={{marginTop:16, padding:12, border:"1px solid #eee", borderRadius:8}}>
          <div><b>Request:</b> <code>{req.id}</code> · <b>Status:</b> {req.status}</div>
          <div style={{display:"flex", gap:12, marginTop:10}}>
            <label style={{border:"1px dashed #ccc", padding:"8px 10px", borderRadius:8, cursor:"pointer"}}>Front
              <input type="file" accept="image/*" onChange={(e)=>upload("FRONT", e.target.files?.[0])}/>
            </label>
            <label style={{border:"1px dashed #ccc", padding:"8px 10px", borderRadius:8, cursor:"pointer"}}>Back
              <input type="file" accept="image/*" onChange={(e)=>upload("BACK", e.target.files?.[0])}/>
            </label>
            <label style={{border:"1px dashed #ccc", padding:"8px 10px", borderRadius:8, cursor:"pointer"}}>Selfie
              <input type="file" accept="image/*" onChange={(e)=>upload("SELFIE", e.target.files?.[0])}/>
            </label>
          </div>
        </div>
      )}
      {msg && <div style={{marginTop:10, color:"#0a0"}}>{msg}</div>}
    </div>
  );
}
