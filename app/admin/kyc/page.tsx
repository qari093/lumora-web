"use client";
import { useEffect, useState } from "react";
const BASE = "";
export default function AdminKyc(){
  const [rows, setRows] = useState<any[]>([]);
  const [msg, setMsg] = useState("");
  const token = typeof window !== "undefined" ? (localStorage.getItem("adminToken") || "dev-admin-token") : "dev-admin-token";

  async function load(){
    const r = await fetch(BASE+"/api/admin/kyc/pending",{ headers:{ "x-admin-token": token } }).then(r=>r.json());
    if (r?.ok) setRows(r.pending); else setMsg(r?.error||"Failed");
  }
  useEffect(()=>{ load(); }, []);

  async function decide(id:string, decision:"APPROVED"|"REJECTED"){
    const reason = decision==="REJECTED" ? prompt("Reason?") || "" : "";
    const r = await fetch(BASE+"/api/admin/kyc/decision",{
      method:"POST",
      headers:{ "content-type":"application/json", "x-admin-token": token },
      body: JSON.stringify({ requestId:id, decision, reason, adminUser:"admin@local" })
    }).then(r=>r.json());
    setMsg(r?.ok ? "Saved "+decision : (r?.error||"Failed"));
    await load();
  }

  return (
    <div style={{maxWidth:1000, margin:"24px auto", padding:"0 16px"}}>
      <h1 style={{fontSize:26, fontWeight:700}}>Admin · KYC Queue</h1>
      {msg && <div style={{margin:"8px 0", color:"#0a0"}}>{msg}</div>}
      <table style={{width:"100%", borderCollapse:"collapse"}}>
        <thead><tr>
          <th style={th}>Request</th><th style={th}>Owner</th><th style={th}>Name</th><th style={th}>Docs</th><th style={th}>Created</th><th style={th}></th>
        </tr></thead>
        <tbody>
          {rows.map(r=>(
            <tr key={r.id}>
              <td style={td}><code>{r.id}</code></td>
              <td style={td}><code>{r.ownerId}</code></td>
              <td style={td}>{r.fullName || "—"}</td>
              <td style={td}>{r.documents?.length || 0}</td>
              <td style={td}>{new Date(r.createdAt).toLocaleString()}</td>
              <td style={{...td, textAlign:"right"}}>
                <button onClick={()=>decide(r.id,"APPROVED")} style={btn}>Approve</button>
                <button onClick={()=>decide(r.id,"REJECTED")} style={{...btn, marginLeft:8}}>Reject</button>
              </td>
            </tr>
          ))}
          {!rows.length && <tr><td style={{...td, padding:"16px"}} colSpan={6}>No pending requests.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
const th: React.CSSProperties = { textAlign:"left", padding:"10px 8px", borderBottom:"1px solid #eee", fontSize:13, color:"#666" };
const td: React.CSSProperties = { padding:"8px", borderBottom:"1px dashed #eee", fontSize:14 };
const btn: React.CSSProperties = { padding:"6px 10px", borderRadius:8, border:"1px solid #ddd", background:"#fff", cursor:"pointer" };
