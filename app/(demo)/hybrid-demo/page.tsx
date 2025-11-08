"use client";

import React from "react";

type CreditsRes = { ok:boolean; user:string; credits:number } | { ok:false; error:string };

export default function HybridDashboard() {
  const USER = "demo";

  const [credits, setCredits] = React.useState<number>(0);
  const [loading, setLoading] = React.useState(true);

  const [claiming, setClaiming] = React.useState(false);
  const [nextAt, setNextAt] = React.useState<number | null>(null);
  const [remainLabel, setRemainLabel] = React.useState<string>("Claim +5");

  const [emojiText, setEmojiText] = React.useState("neon bolt");
  const [emojiUrl, setEmojiUrl] = React.useState<string | null>(null);

  const [avatarText, setAvatarText] = React.useState("Waqar Ahmad");
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);

  const fileRef = React.useRef<HTMLInputElement>(null);
  const [p2aBusy, setP2aBusy] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const r = await fetch(`/api/hybrid/credits?user=${encodeURIComponent(USER)}`);
      const j = await r.json() as CreditsRes;
      if ((j as any)?.ok) setCredits((j as any).credits);
      setLoading(false);
    })();
  }, []);

  React.useEffect(() => {
    const id = setInterval(() => {
      if (!nextAt) { setRemainLabel("Claim +5"); return; }
      const ms = nextAt - Date.now();
      if (ms <= 0) { setNextAt(null); setRemainLabel("Claim +5"); }
      else { setRemainLabel(`Retry in ${Math.ceil(ms/1000)}s`); }
    }, 250);
    return () => clearInterval(id);
  }, [nextAt]);

  async function refreshCredits() {
    const r = await fetch(`/api/hybrid/credits?user=${encodeURIComponent(USER)}`);
    const j = await r.json();
    if (j?.ok) setCredits(j.credits);
  }

  async function claimDaily() {
    setClaiming(true);
    try {
      const r = await fetch("/api/hybrid/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ user: USER }),
      });
      const j = await r.json();
      if (r.status === 429) {
        const next = Number(j?.nextAt || Date.now() + (Number(j?.retrySec || 60) * 1000));
        setNextAt(next);
      } else if (j?.ok) {
        setCredits(j.credits.credits ?? j.credits);
        setNextAt(j.nextAt || null);
      } else {
        alert(j?.error || "Claim failed");
      }
    } catch (e:any) {
      alert(String(e?.message || e));
    } finally {
      setClaiming(false);
    }
  }

  async function doEmoji() {
    const r = await fetch("/api/hybrid/generate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ type: "emoji", text: emojiText, provider: "local", user: USER }),
    });
    const j = await r.json();
    if (j?.ok) { setEmojiUrl(j.url); refreshCredits(); }
    else alert(j?.error || "Emoji generate failed");
  }

  async function doAvatar() {
    const r = await fetch("/api/hybrid/generate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ type: "avatar", text: avatarText, provider: "local", user: USER }),
    });
    const j = await r.json();
    if (j?.ok) { setAvatarUrl(j.url); refreshCredits(); }
    else alert(j?.error || "Avatar generate failed");
  }

  async function doP2A() {
    if (!fileRef.current?.files?.[0]) return;
    setP2aBusy(true);
    try {
      const fd = new FormData();
      fd.append("user", USER);
      fd.append("photo", fileRef.current.files[0]);
      const r = await fetch("/api/hybrid/p2a", { method: "POST", body: fd });
      const j = await r.json();
      if (j?.ok) setAvatarUrl(j.avatarUrl);
      else alert(j?.error || "Upload failed");
    } finally {
      setP2aBusy(false);
      refreshCredits();
    }
  }

  const card: React.CSSProperties = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 16,
    padding: 16,
    width: "100%",
    maxWidth: 520,
  };
  const btn: React.CSSProperties = {
    padding: "10px 16px",
    borderRadius: 10,
    fontWeight: 800,
    cursor: "pointer",
    border: "1px solid rgba(255,255,255,0.18)",
    background: "linear-gradient(180deg, #fff, #eee)",
    color: "#111",
  };
  const wrap: React.CSSProperties = {
    minHeight: "100vh",
    padding: 24,
    display: "grid",
    gap: 20,
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    alignItems: "start",
    fontFamily: "ui-sans-serif, system-ui",
  };

  return (
    <main style={wrap}>
      <section style={card}>
        <h2 style={{margin:"0 0 8px 0"}}>Hybrid Credits</h2>
        <div style={{opacity:.8, marginBottom:12}}>User: <b>{USER}</b></div>
        <div style={{fontSize:40, fontWeight:900, marginBottom:12}}>
          {loading ? "…" : credits}
          <span style={{fontSize:16, fontWeight:700, opacity:.7, marginLeft:8}}>credits</span>
        </div>
        <button onClick={claimDaily} disabled={claiming || !!nextAt} style={btn}>
          {claiming ? "Claiming…" : remainLabel}
        </button>
      </section>

      <section style={card}>
        <h2 style={{margin:"0 0 8px 0"}}>Emoji Generator</h2>
        <input value={emojiText} onChange={e=>setEmojiText(e.target.value)} placeholder="emoji or text"
               style={{width:"100%",padding:"10px 12px",borderRadius:10,marginBottom:12,border:"1px solid rgba(0,0,0,.15)"}} />
        <button onClick={doEmoji} style={btn}>Generate Emoji (spend 1)</button>
        <div style={{marginTop:12}}>
          {emojiUrl ? <img src={emojiUrl} alt="emoji" style={{width:160,height:160}}/> : <div style={{width:160,height:160,background:"#eee"}}/>}
        </div>
      </section>

      <section style={card}>
        <h2 style={{margin:"0 0 8px 0"}}>Avatar Generator</h2>
        <input value={avatarText} onChange={e=>setAvatarText(e.target.value)} placeholder="name or emoji"
               style={{width:"100%",padding:"10px 12px",borderRadius:10,marginBottom:12,border:"1px solid rgba(0,0,0,.15)"}} />
        <button onClick={doAvatar} style={btn}>Generate Avatar (spend 1)</button>
        <div style={{marginTop:12}}>
          {avatarUrl ? <img src={avatarUrl} alt="avatar" style={{width:160,height:160,borderRadius:16}}/> : <div style={{width:160,height:160,background:"#eee",borderRadius:16}}/>}
        </div>
      </section>

      <section style={card}>
        <h2 style={{margin:"0 0 8px 0"}}>Pic → Avatar</h2>
        <input type="file" accept="image/*" ref={fileRef} />
        <div style={{marginTop:12, display:"flex", gap:12}}>
          <button onClick={doP2A} disabled={p2aBusy || !fileRef.current?.files?.[0]} style={btn}>
            {p2aBusy ? "Uploading…" : "Transform (spend 1)"}
          </button>
          <button onClick={refreshCredits} style={btn}>Refresh Credits</button>
        </div>
      </section>
    </main>
  );
}
