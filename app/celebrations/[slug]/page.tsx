"use client";

import React, { useEffect, useMemo, useState, useTransition } from "react";

type Summary = {
  ok: boolean;
  celebration: { id: string; slug: string; status: string; startAt: string | null; createdAt?: string | null };
  participants: number;
  reactions: { kind: string; count: number }[];
  rewards: { type: string; count: number }[];
};

export default function CelebrationPage({ params }: { params: { slug: string } }) {
  // ✅ keep params access simple and valid (no double signatures, no React.use())
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const [data, setData]   = useState<Summary | null>(null);
  const [btnColor,setBtnColor]=useState("linear-gradient(90deg,#9f7aea,#ed64a6)");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // ✅ use a RELATIVE url so it works in dev/prod without window.origin
  const url = useMemo(() => `/api/celebrations/${encodeURIComponent(slug)}/summary`, [slug]);

  async function load() {
    try {
      setError(null);
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const j = (await res.json()) as Summary;
      setData(j);
    } catch (e: any) {
      setError(String(e?.message || e));
      setData(null);
    }
  }

  useEffect(() => { load(); }, [url]);

  function refresh() {
    startTransition(load);
  }

  async function postAction(action: "join" | "react" | "reward") {
    try {
      const res = await fetch(`/api/celebrations/${encodeURIComponent(slug)}/demo`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-user-id": "DEMO_USER_ID" },
        body: JSON.stringify({ action })
      });
      if (!res.ok) throw new Error(`action ${action} failed (${res.status})`);
      refresh();
    } catch (e) {
      console.warn(e);
    }
  }

  return (
    <main style={{
      fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial',
      color: '#fff',
      background: 'radial-gradient(1200px 500px at 70% 10%, rgba(0,140,255,.10), transparent), #0a0b10',
      minHeight: '100vh',
      padding: 20
    }}>
      <div style={{ maxWidth: 860, margin: "40px auto 100px auto" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: .3, margin: 0 }}>Celebration</h1>
          <code style={{
            opacity: .8, fontSize: 13, padding: "4px 8px", borderRadius: 8,
            background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)"
          }}>{slug}</code>
        </div>

        <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <button onClick={refresh} disabled={pending} style={btn()}>{pending ? "Refreshing…" : "Refresh"}</button>
          <a href={url} target="_blank" style={{ ...btn(), textDecoration: "none" }}>Raw JSON</a>
          <span style={{ opacity:.7, fontSize:12 }}>URL: {url}</span>
        </div>

        {!data && !error && <div style={{ marginTop: 24, opacity: .8 }}>Loading summary…</div>}
        {error && (
          <div style={{ marginTop: 24, ...card(), borderColor:"#f55" }}>
            <div style={h()}>Fetch Error</div>
            <div style={{opacity:.9, marginBottom:8}}>{error}</div>
            <div style={{ fontFamily:"monospace", fontSize:12, opacity:.8, wordBreak:"break-all" }}>{url}</div>
          </div>
        )}

        {data && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 20 }}>
              <div style={card()}>
                <div style={h()}>Status</div>
                <div>State: <b>{data.celebration.status}</b></div>
                <div style={{ opacity: .8 }}>
                  Start: {data.celebration.startAt ? new Date(data.celebration.startAt).toLocaleString() : "—"}
                </div>
              </div>

              <div style={card()}>
                <div style={h()}>Participants</div>
                <div style={{ fontSize: 22, fontWeight: 800 }}>{data.participants}</div>
              </div>

              <div style={card()}>
                <div style={h()}>Reactions</div>
                {data.reactions.length === 0 && <div style={{ opacity: .7 }}>—</div>}
                {data.reactions.map((r, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>{r.kind}</span><b>{r.count}</b>
                  </div>
                ))}
              </div>

              <div style={card()}>
                <div style={h()}>Rewards</div>
                {data.rewards.length === 0 && <div style={{ opacity: .7 }}>—</div>}
                {data.rewards.map((r, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>{r.type}</span><b>{r.count}</b>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ ...card(), marginTop: 12 }}>
              <div style={h()}>Actions</div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>

                <button onClick={()=>postAction("join")}   style={btn()} disabled={data?.celebration.status!=="LIVE"}>Join</button>
                <button onClick={()=>postAction("react")}  style={btn()} disabled={data?.celebration.status!=="LIVE"}>React</button>
                <button onClick={()=>postAction("reward")} style={btn()} disabled={data?.celebration.status!=="LIVE"}>Reward</button>
                <button onClick={async()=>{
                  await fetch(`/api/celebrations/${encodeURIComponent(params.slug)}/end`,{method:"POST"});
                  refresh();
                }} style={btn()}>End</button>
                <button onClick={async()=>{
                  await fetch(`/api/celebrations/${encodeURIComponent(params.slug)}/reset`,{method:"POST"});
                  refresh();
                }} style={btn()}>Reset</button>
                <button onClick={()=>postAction("join")}   style={btn()}>Join</button>
                <button onClick={()=>postAction("react")}  style={btn()}>React</button>
                <button onClick={()=>postAction("reward")} style={btn()}>Reward</button>
              </div>
            </div>
          </>
        )}
      </div>
      <section style={{marginTop:40,padding:20,background:"rgba(255,255,255,0.05)",borderRadius:12}}>
        <h2>Summary Panel</h2>
        <p>Status: {data?.celebration?.status}</p>
        <p>Participants: {data?.participants ?? 0}</p>
        <p>Reactions: {data?.reactions?.[0]?.count ?? 0}</p>
        <p>Rewards: {data?.rewards?.[0]?.count ?? 0}</p>
        <button
        onClick={async()=>{
          try{
            const res=await fetch(`/api/celebrations/${slug}/summary`);
            const j=await res.json();
            if(j.ok) setData(j);
          }catch(e){console.warn("manual refresh failed",e);}
        }}
        className="manual-refresh"
        style={{
          marginTop:12,
          padding:"8px 16px",
          borderRadius:8,
          border:"none",
          background: btnColor,
          color:"#fff",
          fontWeight:600,
          cursor:"pointer",
          boxShadow:"0 0 20px rgba(160,100,255,0.4)",
          transition:"all .25s ease"
        }}
        onMouseEnter={e=>e.currentTarget.style.transform="scale(1.05)"}
        onMouseLeave={e=>e.currentTarget.style.transform="scale(1.0)"}
      >
        🔄 Manual Refresh
      </button>
    </section>
      <div style={{marginTop:12}}>
        <a
          href={`/api/celebrations/${slug}/export`}
          style={{
            display:"inline-block",
            padding:"10px 14px",
            borderRadius:8,
            background:"linear-gradient(90deg,#14b8a6,#22d3ee)",
            color:"#001014",
            fontWeight:700,
            textDecoration:"none",
            boxShadow:"0 0 18px rgba(34,211,238,.35)"
          }}
        >⬇️ Export CSV</a>
      </div>

  </main>
  );
}

function btn(){
  return { padding:"8px 12px", borderRadius:10, border:"1px solid #667", background:"transparent", cursor:"pointer", fontWeight:700 } as const;
}
function card(){
  return { border:"1px solid rgba(120,120,140,.35)", borderRadius:12, padding:14, background:"rgba(18,18,26,.55)", backdropFilter:"blur(6px)" } as const;
}
function h(){ return { fontWeight:800, marginBottom:8, opacity:.9 } as const; }
