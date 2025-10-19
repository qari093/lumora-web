"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Overview = {
  ok: boolean;
  windowMinutes: number;
  wallets: { count:number; totalCents:number };
  campaigns: number;
  kycPending: number;
  activity: { eventsLastHr:number; convLastHr:number; fraudLastHr:number };
};

const money = (c:number)=> "€"+(c/100).toFixed(2);

export default function AdminHome(){
  const [o, setO] = useState<Overview|null>(null);
  const [msg, setMsg] = useState("");
  const token = typeof window !== "undefined" ? (localStorage.getItem("adminToken") || "dev-admin-token") : "dev-admin-token";

  async function load(){
    setMsg("Loading...");
    try{
      const ov = await fetch("/api/admin/overview",{ headers:{ "x-admin-token": token }}).then(r=>r.json());
      if (ov?.ok) { setO(ov); setMsg(""); }
      else setMsg(ov?.error || "Failed");
    }catch(e:any){ setMsg(String(e?.message||e)); }
  }
  async function health(){
    setMsg("Pinging DB...");
    const r = await fetch("/api/admin/health",{ headers:{ "x-admin-token": token }}).then(r=>r.json());
    setMsg(r?.ok ? "DB OK" : (r?.error || "Health failed"));
  }

  useEffect(()=>{ load(); }, []);

  return (
    <div style={{maxWidth:1100, margin:"24px auto", padding:"0 16px", fontFamily:"ui-sans-serif, system-ui"}}>
      <h1 style={{fontSize:26, fontWeight:700}}>Admin Panel</h1>
      <p style={{color:"#666"}}>Use <code>localStorage.adminToken</code> to set admin token. Default is <code>dev-admin-token</code>.</p>
      <div style={{display:"flex", gap:8, margin:"8px 0"}}>
        <button onClick={load} style={btn}>Reload</button>
        <button onClick={health} style={btn}>Health Check</button>
        <Link href="/admin/kyc" style={{...btn, textDecoration:"none"}}>KYC Queue</Link>
        <Link href="/brand/insights" style={{...btn, textDecoration:"none"}}>Brand Insights</Link>
        <Link href="/vendor" style={{...btn, textDecoration:"none"}}>Vendor</Link>
        <Link href="/brand/eco" style={{...btn, textDecoration:"none"}}>Eco</Link>
      </div>
      {msg && <div style={{margin:"8px 0", color:"#0a0"}}>{msg}</div>}

      {o && (
        <>
          <div style={{display:"grid", gridTemplateColumns:"repeat(6, 1fr)", gap:12, marginTop:12}}>
            <div style={card}><div style={label}>Wallets</div><div style={val}>{o.wallets.count}</div></div>
            <div style={card}><div style={label}>Total Balance</div><div style={val}>{money(o.wallets.totalCents)}</div></div>
            <div style={card}><div style={label}>Campaigns</div><div style={val}>{o.campaigns}</div></div>
            <div style={card}><div style={label}>KYC Pending</div><div style={val}>{o.kycPending}</div></div>
            <div style={card}><div style={label}>Events (1h)</div><div style={val}>{o.activity.eventsLastHr}</div></div>
            <div style={card}><div style={label}>Conversions (1h)</div><div style={val}>{o.activity.convLastHr}</div></div>
          </div>

          <div style={{...card, marginTop:16}}>
            <div style={{fontSize:14, color:"#666", marginBottom:6}}>Fraud (1h)</div>
            <div style={{fontSize:22, fontWeight:700}}>{o.activity.fraudLastHr}</div>
          </div>
        </>
      )}
    </div>
  );
}

const card: React.CSSProperties = { background:"#fff", border:"1px solid #eee", borderRadius:10, padding:"12px 14px" };
const label: React.CSSProperties = { fontSize:12, textTransform:"uppercase", letterSpacing:".06em", color:"#666" };
const val: React.CSSProperties = { fontSize:22, fontWeight:700, marginTop:4 };
const btn: React.CSSProperties = { padding:"8px 12px", border:"1px solid #ddd", borderRadius:8, background:"#fff", cursor:"pointer", color:"inherit" };
