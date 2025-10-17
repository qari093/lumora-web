"use client";
import React, { useEffect, useState } from "react";

export default function PrivacyDash(){
  const [userId,setUserId] = useState("demo-user-1");
  const [consent,setConsent] = useState<any>(null);
  const [policy,setPolicy] = useState<any>(null);
  const [msg,setMsg] = useState("");

  async function load(){
    const c = await fetch(,{cache:"no-store"}).then(r=>r.json());
    const p = await fetch("/api/privacy/policy",{cache:"no-store"}).then(r=>r.json());
    setConsent(c); setPolicy(p);
  }
  async function save(){
    setMsg("Saving…");
    await fetch("/api/privacy/consent",{ method:"POST", headers:{ "content-type":"application/json" }, body: JSON.stringify({
      userId,
      emotionProcessing: !!consent?.consent?.emotionProcessing,
      marketing: !!consent?.consent?.marketing
    })});
    await load();
    setMsg("Saved"); setTimeout(()=>setMsg(""),700);
  }
  async function doExport(){
    setMsg("Exporting…");
    const r = await fetch("/api/privacy/export",{ method:"POST", headers:{ "content-type":"application/json" }, body: JSON.stringify({ userId })}).then(r=>r.json());
    setMsg("Export ready (encrypted)"); console.log(r);
  }
  async function doDelete(){
    if(!confirm("This will delete personal data (reversible only by backups). Continue?")) return;
    setMsg("Deleting…");
    await fetch("/api/privacy/delete",{ method:"POST", headers:{ "content-type":"application/json" }, body: JSON.stringify({ userId })});
    await load(); setMsg("Deleted");
  }

  useEffect(()=>{ load(); },[]);

  const c = consent?.consent || { emotionProcessing:false, marketing:false };

  return (
    <div style={{ padding:20 }}>
      <h1>🛡️ Privacy Trust Shield</h1>
      <div style={{ display:"flex", gap:8, margin:"8px 0" }}>
        <input value={userId} onChange={e=>setUserId(e.target.value)} style={{ padding:8, borderRadius:8, border:"1px solid #333", background:"#0b0f12", color:"#e5e7eb" }}/>
        <button onClick={load} style={btn(false)}>Refresh</button>
        <span style={{ opacity:.8 }}>{msg}</span>
      </div>

      <div style={card()}>
        <h3>Consent</h3>
        <label><input type="checkbox" checked={!!c.emotionProcessing} onChange={e=>setConsent({ consent:{...c, emotionProcessing:e.target.checked}})}/> Emotion processing (optional)</label><br/>
        <label><input type="checkbox" checked={!!c.marketing} onChange={e=>setConsent({ consent:{...c, marketing:e.target.checked}})}/> Marketing emails</label><br/>
        <button onClick={save} style={btn(true)}>Save</button>
      </div>

      <div style={card()}>
        <h3>Data Controls</h3>
        <button onClick={doExport} style={btn(true)}>Request Export (Encrypted)</button>
        <button onClick={doDelete} style={btn(false)}>Delete / Redact</button>
      </div>

      <div style={card()}>
        <h3>Transparency</h3>
        <pre style={{ background:"#0b0f12", color:"#e5e7eb", padding:12, borderRadius:8, overflowX:"auto" }}>{JSON.stringify(policy,null,2)}</pre>
      </div>
    </div>
  );
}
function btn(primary:boolean):React.CSSProperties{ return { padding:"8px 12px", borderRadius:8, fontWeight:800, cursor:"pointer", border:"1px solid #333", background: primary ? "linear-gradient(180deg,#22c55e,#16a34a)" : "#111827", color: primary ? "#0b0f12" : "#e5e7eb" }; }
function card():React.CSSProperties{ return { border:"1px solid #222", borderRadius:10, padding:14, margin:"12px 0" }; }
\TSX

# 5) Restart & smoke (no jq)
pkill -f "next dev" >/dev/null 2>&1 || true
rm -rf .next >/dev/null 2>&1 || true
( [ -x ./node_modules/.bin/next ] && ./node_modules/.bin/next dev || npx next dev ) >/tmp/next-dev.out 2>&1 & disown

for i in {1..20}; do sleep 1; if curl -sS http://127.0.0.1:3000/api/privacy/policy >/dev/null 2>&1; then break; fi; done

echo "— tail next —"; tail -n 20 /tmp/next-dev.out || true
echo; echo "— GET /api/privacy/policy —"; curl -sS http://127.0.0.1:3000/api/privacy/policy; echo
echo; echo "— INIT consent —"; curl -sS "http://127.0.0.1:3000/api/privacy/consent?userId=demo-user-1"; echo
echo; echo "— UPDATE consent —"; curl -sS -X POST http://127.0.0.1:3000/api/privacy/consent -H "content-type: application/json" -d "{\"userId\":\"demo-user-1\",\"emotionProcessing\":true,\"marketing\":false}"; echo
echo; echo "— EXPORT data —"; curl -sS -X POST http://127.0.0.1:3000/api/privacy/export -H "content-type: application/json" -d "{\"userId\":\"demo-user-1\"}" | head -c 300; echo
echo; echo "— DELETE data —"; curl -sS -X POST http://127.0.0.1:3000/api/privacy/delete -H "content-type: application/json" -d "{\"userId\":\"demo-user-1\"}"; echo
echo; echo "➡ Dashboard: http://localhost:3000/dash/privacy"
