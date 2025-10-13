"use client";
import React from "react";

type CreatorApp = {
  id: string;
  name: string;
  handle: string;
  category: string;
  bio?: string;
  ts: string;
  status: "new" | "review" | "approved" | "rejected";
};

export default function CreatorReview() {
  const [rows, setRows] = React.useState<CreatorApp[]>([]);
  const [limit, setLimit] = React.useState(10);
  const [log, setLog] = React.useState("");

  async function load() {
    setLog("Loading…");
    try {
      const res = await fetch(`/api/creator/list?limit=${limit}`, { cache: "no-store" });
      const j = await res.json();
      setRows(j.rows || []);
      setLog(JSON.stringify(j, null, 2));
    } catch (e: any) {
      setLog(`Error: ${e?.message || "unknown_error"}`);
    }
  }
  React.useEffect(() => { load(); }, []);

  const chip = (s: CreatorApp["status"]) => {
    const c = ({new:"#1e88e5", review:"#fbc02d", approved:"#43a047", rejected:"#e53935"} as any)[s] || "#555";
    return <span style={{background:c,padding:"2px 8px",borderRadius:999,color:"#fff",fontSize:12}}>{s}</span>;
  };

  async function setStatus(id: string, status: CreatorApp["status"]) {
    try {
      const res = await fetch("/api/creator/update", {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ id, status }),
      });
      const j = await res.json();
      if (!res.ok || !j?.ok) throw new Error(j?.error || "update_failed");
      // refresh list
      await load();
    } catch (e: any) {
      alert("Update failed: " + (e?.message || "unknown_error"));
    }
  }

  return (
    <main style={{maxWidth:900, margin:"40px auto", padding:16, color:"#eee", fontFamily:"ui-sans-serif,system-ui"}}>
      <h1 style={{marginBottom:8}}>Creator Applications (Saved)</h1>
      <p style={{opacity:.8, marginBottom:16}}>Manage statuses. Data source: <code style={{background:"#111",padding:"2px 6px",borderRadius:6}}>data/creator.json</code></p>

      <div style={{display:"flex", gap:12, alignItems:"center", marginBottom:12}}>
        <label style={{fontSize:14, opacity:.9}}>Limit:</label>
        <input type="number" min={1} max={50} value={limit}
          onChange={e=>setLimit(parseInt(e.target.value||"10"))}
          style={{width:80,padding:8,borderRadius:6,border:"1px solid #333",background:"#111",color:"#eee"}}/>
        <button onClick={load} style={{padding:"8px 12px",borderRadius:8,border:"1px solid #444",background:"linear-gradient(180deg,#2a2a2a,#1a1a1a)",color:"#fff",cursor:"pointer"}}>Refresh</button>
      </div>

      <div style={{display:"grid", gap:10}}>
        {rows.map(r=>(
          <div key={r.id} style={{border:"1px solid #333",borderRadius:8,padding:12,background:"#121212"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <div style={{fontWeight:600,fontSize:16}}>{r.name} <span style={{opacity:.8,fontWeight:400}}>{r.handle}</span></div>
              {chip(r.status)}
            </div>
            <div style={{opacity:.85, fontSize:14, marginBottom:6}}>
              <b>Category:</b> {r.category} &nbsp;•&nbsp; <b>Applied:</b> {new Date(r.ts).toLocaleString()}
            </div>
            {r.bio && <div style={{opacity:.9, fontSize:14, marginBottom:10}}>{r.bio}</div>}

            <div style={{display:"flex", gap:8}}>
              <button onClick={()=>setStatus(r.id, "review")}
                style={{padding:"6px 10px",borderRadius:6,border:"1px solid #555",background:"#222",color:"#eee",cursor:"pointer"}}>Mark Review</button>
              <button onClick={()=>setStatus(r.id, "approved")}
                style={{padding:"6px 10px",borderRadius:6,border:"1px solid #2e7d32",background:"#1b5e20",color:"#fff",cursor:"pointer"}}>Approve</button>
              <button onClick={()=>setStatus(r.id, "rejected")}
                style={{padding:"6px 10px",borderRadius:6,border:"1px solid #8b0000",background:"#5a0c0c",color:"#fff",cursor:"pointer"}}>Reject</button>
            </div>
          </div>
        ))}
        {rows.length === 0 && <div style={{opacity:.7}}>No applications yet.</div>}
      </div>

      <h3 style={{marginTop:20}}>Raw</h3>
      <pre style={{whiteSpace:"pre-wrap",background:"#0b0b0b",color:"#0f0",padding:12,borderRadius:8,minHeight:80}}>{log}</pre>
    </main>
  );
}
