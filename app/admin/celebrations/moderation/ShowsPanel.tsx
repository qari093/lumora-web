
function openShowsCsv(slug: string){
  try{
    const u = `/api/celebrations/${slug}/shows/csv`;
    if (typeof window !== "undefined") window.open(u, "_blank");
  }catch{}
}

"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Show = {
  id: string;
  title: string;
  description?: string | null;
  startAt: string;
  endAt: string;
  visibility: "PUBLIC" | "UNLISTED" | "PRIVATE";
  guests?: { id:string; name:string; avatarUrl?:string|null; role?:string|null }[];
};

function isoLocal(dt: string) {
  const d = new Date(dt);
  const pad = (n:number)=>String(n).padStart(2,"0");
  const y=d.getFullYear(), m=pad(d.getMonth()+1), da=pad(d.getDate()),
        hh=pad(d.getHours()), mm=pad(d.getMinutes());
  return `${y}-${m}-${da}T${hh}:${mm}`;
}

const btn = {
  padding:"8px 12px",
  borderRadius:10,
  border:"1px solid rgba(255,255,255,.2)",
  background:"rgba(255,255,255,.06)",
  fontWeight:800,
  cursor:"pointer"
} as const;

export default function ShowsPanel({ slug, apiBase }:{ slug:string; apiBase:string }) {
  const router = useRouter();
  const [shows, setShows] = useState<Show[]>([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(45);
  const [editingId, setEditingId] = useState<string|null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editDuration, setEditDuration] = useState(45);
  const [loading, setLoading] = useState(false);
  const base = apiBase || `/api/celebrations/${slug}/shows`;

  async function refresh() {
    const r = await fetch(base, { cache:"no-store" });
    const j = await r.json();
    if (j?.ok) setShows(j.shows);
  }

  useEffect(() => { refresh(); }, []);

  function combineISO(d:string, t:string) {
    if (!d || !t) return null;
    const iso = `${d}T${t}:00`;
    const utc = new Date(iso);
    if (isNaN(utc.getTime())) return null;
    return utc.toISOString();
  }

  async function createShow() {
    const startsAt = combineISO(date, time);
    if (!title.trim() || !startsAt) { alert("Title, date, time required"); return; }
    setLoading(true);
    try {
      const r = await fetch(base, {
        method:"POST",
        headers:{ "content-type":"application/json" },
        body: JSON.stringify({ title: title.trim(), startsAt, durationMin: duration })
      });
      const j = await r.json();
      if (!r.ok) { alert(j?.message || j?.error || "Create failed"); return; }
      setTitle(""); setDate(""); setTime("");
      await refresh();
    } finally { setLoading(false); }
  }

  async function removeShow(id:string) {
    if (!confirm("Delete this show?")) return;
    setLoading(true);
    try {
      const r = await fetch(`${base}/${id}`, { method:"DELETE" });
      const j = await r.json();
      if (!r.ok) { alert(j?.message || j?.error || "Delete failed"); return; }
      await refresh();
    } finally { setLoading(false); }
  }

  function beginEdit(sh: Show) {
    setEditingId(sh.id);
    setEditTitle(sh.title);
    const local = isoLocal(sh.startAt); // yyyy-MM-ddTHH:mm
    setEditDate(local.slice(0,10));
    setEditTime(local.slice(11,16));
    const dur = Math.max(1, Math.round((new Date(sh.endAt).getTime()-new Date(sh.startAt).getTime())/60000));
    setEditDuration(dur);
  }

  async function saveEdit(id:string) {
    const startsAt = combineISO(editDate, editTime);
    if (!editTitle.trim() || !startsAt) { alert("Title, date, time required"); return; }
    setLoading(true);
    try {
      const r = await fetch(`${base}/${id}`, {
        method:"PATCH",
        headers:{ "content-type":"application/json" },
        body: JSON.stringify({ title: editTitle.trim(), startsAt, durationMin: editDuration })
      });
      const j = await r.json();
      if (!r.ok) { alert(j?.message || j?.error || "Update failed"); return; }
      setEditingId(null);
      await refresh();
    } finally { setLoading(false); }
  }

  const formRow = { display:"grid", gridTemplateColumns:"180px 1fr 1fr 130px auto", gap:10, alignItems:"center" } as const;

  return (
    <section style={{marginTop:16}}>
      <div style={{display:"inline-flex",gap:8,marginTop:8}}>
        <button data-cy="export-shows-csv" onClick={() => openShowsCsv(slug)}
          style={{padding:"8px 12px",borderRadius:10,border:"1px solid rgba(255,255,255,.2)",background:"rgba(255,255,255,.06)",fontWeight:800,cursor:"pointer"}}
          title="Download CSV of all shows">
          Export Shows CSV
        </button>
      </div>
      <h3 style={{fontSize:16, opacity:.9}}>Shows — schedule</h3>

      {/* Create */}
      <div style={{...formRow, marginTop:10}}>
        <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} />
        <input type="time" value={time} onChange={e=>setTime(e.target.value)} />
        <input type="number" min={1} value={duration} onChange={e=>setDuration(parseInt(e.target.value||"0",10)||45)} />
        <button disabled={loading} onClick={createShow} style={btn}>Add</button>
      </div>

      {/* List */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,minmax(0,1fr))", gap:12, marginTop:12 }}>
        {shows.map(sh => (
          <div key={sh.id} style={{ padding:12, border:"1px solid rgba(255,255,255,.12)", borderRadius:12, background:"rgba(255,255,255,.04)" }}>
            {editingId === sh.id ? (
              <>
                <div style={{...formRow, marginTop:6}}>
                  <input value={editTitle} onChange={e=>setEditTitle(e.target.value)} />
                  <input type="date" value={editDate} onChange={e=>setEditDate(e.target.value)} />
                  <input type="time" value={editTime} onChange={e=>setEditTime(e.target.value)} />
                  <input type="number" min={1} value={editDuration} onChange={e=>setEditDuration(parseInt(e.target.value||"0",10)||45)} />
                  <div style={{display:"flex", gap:8}}>
                    <button disabled={loading} onClick={()=>saveEdit(sh.id)} style={btn}>Save</button>
                    <button onClick={()=>setEditingId(null)} style={btn}>Cancel</button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div style={{ fontWeight:800 }}>{sh.title}</div>
                <div style={{ marginTop:6, fontSize:13, opacity:.9 }}>
                  {new Date(sh.startAt).toLocaleString()} → {new Date(sh.endAt).toLocaleTimeString()}
                </div>
                {!!(sh.guests && sh.guests.length) && (
                  <div style={{ marginTop:6, fontSize:12, opacity:.85 }}>
                    Guests: {sh.guests.map(g => g.name).join(", ")}
                  </div>
                )}
                <div style={{ marginTop:10, display:"flex", gap:8 }}>
                  <button onClick={()=>beginEdit(sh)} style={btn}>Edit</button>
                  <button onClick={()=>removeShow(sh.id)} style={btn}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
