"use client";
import { useEffect, useState } from "react";

type Entry = {
  id: string;
  title: string | null;
  text: string;
  mood: string | null;
  tags: any;
  score: number | null;
  createdAt: string;
};

export default function LumaReflectionPage() {
  async function del(id: string) {
    if (!id) return;
    try {
      await fetch("/api/lumaspace/reflection", {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: "demo@lumora.local", id })
      });
      setItems((prev: any[]) => prev.filter((e: any) => e.id !== id));
    } catch {}
  }
  const [items, setItems] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // composer state
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [mood, setMood] = useState("");
  const [tags, setTags] = useState("dev, focus");
  const [score, setScore] = useState<string>("0.7");
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/lumaspace/reflection?email=demo@lumora.local&take=50", { cache: "no-store" });
      const j = await res.json();
      if (!j.ok) throw new Error(j.error || "failed");
      setItems(j.entries || []);
    } catch (e: any) {
      setErr(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function submitReflection(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() && !title.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/lumaspace/reflection", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: "demo@lumora.local",
          title: title.trim() || null,
          text: text.trim(),
          mood: mood.trim() || null,
          tags: tags.split(",").map(s => s.trim()).filter(Boolean),
          score: score ? Number(score) : null,
        }),
      });
      const j = await res.json();
      if (!j.ok) throw new Error(j.error || "failed");
      // optimistic prepend
      setItems((prev) => [j.entry, ...prev]);
      setTitle(""); setText(""); setMood(""); setTags(""); setScore("");
    } catch (e: any) {
      alert("Submit failed: " + (e?.message || String(e)));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main style={{ padding: 20, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif" }}>
      <h1 style={{ marginBottom: 12 }}>LumaSpace — Reflections</h1>

      {/* Composer */}
      <form onSubmit={submitReflection} style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12, marginBottom: 16, background: "rgba(255,255,255,.7)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 160px 160px 120px", gap: 8, marginBottom: 8 }}>
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title (optional)" style={inputStyle}/>
          <input value={mood} onChange={e=>setMood(e.target.value)} placeholder="Mood e.g. calm" style={inputStyle}/>
          <input value={score} onChange={e=>setScore(e.target.value)} placeholder="Score e.g. 0.7" style={inputStyle}/>
          <button disabled={submitting} type="submit" style={btnStyle}>{submitting ? "Saving…" : "Save"}</button>
        </div>
        <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Write a short reflection…" rows={3} style={{...inputStyle, width:"100%", resize:"vertical"}} />
        <div style={{ display:"flex", gap:8, alignItems:"center", marginTop:8 }}>
          <input value={tags} onChange={e=>setTags(e.target.value)} placeholder="tags, comma,separated" style={{...inputStyle, flex:1}}/>
          <button type="button" onClick={load} style={{...btnStyle, background:"#444", borderColor:"#444"}}>Refresh</button>
        </div>
      </form>

      {loading ? (
        <p>Loading…</p>
      ) : err ? (
        <p style={{ color: "crimson" }}>Error: {err}</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {items.map((e) => (
            <li key={e.id} style={{ margin: "12px 0", padding: 12, border: "1px solid #ddd", borderRadius: 12, background:"rgba(255,255,255,.7)" }}>
              <div style={{ fontWeight: 700 }}>
                {e.title || "(untitled)"}{" "}
                <span style={{ opacity: 0.7, fontWeight: 400 }}>
                  • {new Date(e.createdAt).toLocaleString()}
                </span>
              </div>
              <div style={{ marginTop: 6 }}>{e.text}</div>
              <div style={{ marginTop: 6, opacity: 0.85 }}>
                Mood: {e.mood || "—"} • Score: {e.score ?? "—"}
              </div>
              <div style={{ marginTop: 6, display: "flex", gap: 6, flexWrap: "wrap" }}>
                {Array.isArray(e.tags)
                  ? e.tags.map((t: any, i: number) => (
                      <span key={i} style={{ padding: "2px 8px", border: "1px solid #ccc", borderRadius: 999 }}>
                        {String(t)}
                      </span>
                    ))
                  : null}
              </div>
            
              <div style={{ marginTop: 6 }}>
                <button onClick={() => del(e.id)} style={{ border: "1px solid #c33", background: "#c33", color: "#fff", borderRadius: 8, padding: "6px 10px", cursor: "pointer" }}>Delete</button>
              </div>
    </li>
          ))}
        </ul>
      )}
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  borderRadius: 8,
  padding: "8px 10px",
  background: "rgba(255,255,255,.9)"
};
const btnStyle: React.CSSProperties = {
  border: "1px solid #0b8",
  background: "#0b8",
  color: "#fff",
  fontWeight: 700 as any,
  borderRadius: 8,
  padding: "8px 12px",
  cursor: "pointer"
};
