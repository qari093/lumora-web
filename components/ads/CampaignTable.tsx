"use client";
import React from "react";
import Link from "next/link";

type Campaign = {
  id: string;
  title: string;
  objective: "AWARENESS"|"TRAFFIC"|"CONVERSIONS"|"VISITS";
  status: "DRAFT"|"ACTIVE"|"PAUSED"|"ARCHIVED";
  creativeType: "IMAGE"|"VIDEO";
  dailyBudgetCents: number;
  totalBudgetCents: number;
  radiusKm: number;
  createdAt: string;
};

function euros(cents:number){ return ; }

export default function CampaignTable(){
  const [items, setItems] = React.useState<Campaign[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState("");

  async function load(){
    setLoading(true);
    const params = new URLSearchParams();
    if(q.trim()) params.set("q", q.trim());
    if(status) params.set("status", status);
    const res = await fetch(, { cache:"no-store" });
    const j = await res.json();
    setItems(j?.items || []);
    setLoading(false);
  }
  React.useEffect(()=>{ load(); },[]);

  async function archive(id:string){
    if(!confirm("Archive this campaign?")) return;
    const res = await fetch(, { method:"DELETE" });
    const j = await res.json();
    if(j?.ok) setItems(prev => prev.map(c => c.id===id? { ...c, status:"ARCHIVED" } : c));
    else alert(j?.error || "Failed");
  }

  return (
    <div style={{ display:"grid", gap:12 }}>
      <div style={{ display:"flex", gap:8 }}>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search title..."
               style={{ flex:1, padding:"10px 12px", borderRadius:8, border:"1px solid #333", background:"#0b0f12", color:"#e5e7eb" }} />
        <select value={status} onChange={e=>setStatus(e.target.value)} style={{ padding:"10px 12px", borderRadius:8, border:"1px solid #333", background:"#0b0f12", color:"#e5e7eb" }}>
          <option value="">All</option>
          <option value="DRAFT">Draft</option>
          <option value="ACTIVE">Active</option>
          <option value="PAUSED">Paused</option>
          <option value="ARCHIVED">Archived</option>
        </select>
        <button onClick={load} style={{ padding:"10px 14px", borderRadius:10, border:"1px solid #2563eb", background:"#3b82f6", color:"#0b0f12", fontWeight:800, cursor:"pointer" }}>Refresh</button>
        <Link href="/ads/new" style={{ padding:"10px 14px", borderRadius:10, border:"1px solid #16a34a", background:"#22c55e", color:"#0b0f12", fontWeight:800, textDecoration:"none" }}>+ New</Link>
      </div>

      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:"#111827", color:"#e5e7eb" }}>
              <th style={{ textAlign:"left", padding:10, borderBottom:"1px solid #333" }}>Title</th>
              <th style={{ textAlign:"left", padding:10, borderBottom:"1px solid #333" }}>Objective</th>
              <th style={{ textAlign:"left", padding:10, borderBottom:"1px solid #333" }}>Status</th>
              <th style={{ textAlign:"left", padding:10, borderBottom:"1px solid #333" }}>Daily</th>
              <th style={{ textAlign:"left", padding:10, borderBottom:"1px solid #333" }}>Total</th>
              <th style={{ textAlign:"left", padding:10, borderBottom:"1px solid #333" }}>Radius</th>
              <th style={{ textAlign:"left", padding:10, borderBottom:"1px solid #333" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ padding:14, color:"#9ca3af" }}>Loading...</td></tr>
            ) : items.length ? items.map(c=>(
              <tr key={c.id} style={{ borderBottom:"1px solid #222" }}>
                <td style={{ padding:10 }}><Link href={} style={{ color:"#93c5fd", textDecoration:"none" }}>{c.title}</Link></td>
                <td style={{ padding:10 }}>{c.objective}</td>
                <td style={{ padding:10 }}>{c.status}</td>
                <td style={{ padding:10 }}>{euros(c.dailyBudgetCents)}</td>
                <td style={{ padding:10 }}>{euros(c.totalBudgetCents)}</td>
                <td style={{ padding:10 }}>{c.radiusKm} km</td>
                <td style={{ padding:10, display:"flex", gap:8 }}>
                  <Link href={} style={{ padding:"6px 10px", border:"1px solid #fbbf24", borderRadius:8, color:"#fbbf24", textDecoration:"none" }}>Edit</Link>
                  <button onClick={()=>archive(c.id)} style={{ padding:"6px 10px", border:"1px solid #f87171", background:"transparent", color:"#f87171", borderRadius:8, cursor:"pointer" }}>
                    Archive
                  </button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={7} style={{ padding:14, color:"#9ca3af" }}>No campaigns yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
