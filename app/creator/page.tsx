"use client";
import React from "react";

export default function CreatorApply() {
  const [name, setName] = React.useState("");
  const [handle, setHandle] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [bio, setBio] = React.useState("");
  const [status, setStatus] = React.useState<null | {ok:boolean; msg:string}>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ ok: true, msg: "Submitting…" });
    try {
      const res = await fetch("/api/creator/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, handle, category, bio }),
      });
      const j = await res.json();
      if (!res.ok || !j?.ok) throw new Error(j?.error || "submit_failed");
      setStatus({ ok: true, msg: "✅ Application received!" });
      setName(""); setHandle(""); setCategory(""); setBio("");
    } catch (err: any) {
      setStatus({ ok: false, msg: "❌ " + (err?.message || "submit_failed") });
    }
  }

  return (
    <main style={{maxWidth:680, margin:"40px auto", padding:16, color:"#eee", fontFamily:"ui-sans-serif,system-ui"}}>
      <h1 style={{marginBottom:6}}>Creator Application</h1>
      <p style={{opacity:.8, marginBottom:16}}>This saves locally in development.</p>

      <form onSubmit={submit} style={{display:"grid", gap:12}}>
        <input required placeholder="Name" value={name} onChange={e=>setName(e.target.value)}
          style={{padding:10,borderRadius:8,border:"1px solid #333",background:"#111",color:"#eee"}}/>
        <input required placeholder="Handle (e.g. @yourname)" value={handle} onChange={e=>setHandle(e.target.value)}
          style={{padding:10,borderRadius:8,border:"1px solid #333",background:"#111",color:"#eee"}}/>
        <input required placeholder="Category (e.g. Music, Art, Comedy)" value={category} onChange={e=>setCategory(e.target.value)}
          style={{padding:10,borderRadius:8,border:"1px solid #333",background:"#111",color:"#eee"}}/>
        <textarea placeholder="Short bio (optional)" rows={4} value={bio} onChange={e=>setBio(e.target.value)}
          style={{padding:10,borderRadius:8,border:"1px solid #333",background:"#111",color:"#eee"}}/>
        <button type="submit" style={{padding:"10px 14px",borderRadius:8,border:"1px solid #444",background:"linear-gradient(180deg,#2a2a2a,#1a1a1a)",color:"#fff",cursor:"pointer"}}>Submit</button>
      </form>

      {status && (
        <div style={{
          marginTop:14,padding:"10px 12px",borderRadius:8,
          border:"1px solid " + (status.ok ? "#1b5e20" : "#8b0000"),
          background: status.ok ? "#0c1f0c" : "#200c0c",
          color: status.ok ? "#9cff9c" : "#ff9c9c"
        }}>
          {status.msg}
        </div>
      )}

      <p style={{marginTop:16,opacity:.8}}>Review at <code style={{background:"#111",padding:"2px 6px",borderRadius:6}}>/creator/review</code>.</p>
    </main>
  );
}
