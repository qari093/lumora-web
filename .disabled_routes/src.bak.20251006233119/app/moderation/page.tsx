"use client";
import React from "react";

type Item = {
  id: string;
  kind: "TEXT" | "IMAGE";
  text?: string | null;
  objectKey?: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  reason?: string | null;
  flags?: any;
};

export default function ModerationPage() {
  const [tab, setTab] = React.useState<"PENDING"|"APPROVED"|"REJECTED">("PENDING");
  const [items, setItems] = React.useState<Item[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string|null>(null);

  const fetchItems = async (status: typeof tab) => {
    setLoading(true); setError(null);
    try {
      const r = await fetch(\`/api/moderation/list?status=\${status}\`);
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "fetch_failed");
      setItems(data.items || []);
    } catch (e:any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchItems(tab);
  }, [tab]);

  const act = async (id: string, action: "approve"|"reject") => {
    const reason = action === "reject" ? window.prompt("Reason (optional)") || "" : "";
    const r = await fetch("/api/moderation/action", {
      method: "POST", headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ id, action, reason }),
    });
    const data = await r.json();
    if (!r.ok) { alert(data.error || "action_failed"); return; }
    setItems((prev)=>prev.filter(i=>i.id!==id));
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🛡️ Moderation Queue (MVP)</h1>

      <div style={{ display:"flex", gap:8, marginBottom: 12 }}>
        {(["PENDING","APPROVED","REJECTED"] as const).map(s=>(
          <button key={s} onClick={()=>setTab(s)} style={btn(s===tab)}>{s}</button>
        ))}
        <button onClick={()=>fetchItems(tab)} style={btn(true)}>Refresh</button>
      </div>

      {loading && <div>Loading…</div>}
      {error && <div style={{ color:"#ef4444" }}>{error}</div>}

      <div style={{ display:"grid", gap:12 }}>
        {items.map(it=>(
          <div key={it.id} style={{ border:"1px solid #333", borderRadius:10, padding:12, background:"#0b0f12", color:"#e5e7eb" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <b>{it.kind}</b> — {new Date(it.createdAt).toLocaleString()}
              </div>
              <div style={{ display:"flex", gap:8 }}>
                {tab==="PENDING" && (
                  <>
                    <button onClick={()=>act(it.id,"approve")} style={btn(true)}>Approve</button>
                    <button onClick={()=>act(it.id,"reject")} style={btn(true)}>Reject</button>
                  </>
                )}
              </div>
            </div>
            <div style={{ marginTop:8 }}>
              {it.kind==="TEXT" && <div><code>{it.text}</code></div>}
              {it.kind==="IMAGE" && it.objectKey && (
                <div style={{ marginTop:8 }}>
                  <img alt="preview" src={`/api/storage/proxy?key=${encodeURIComponent(it.objectKey)}`} style={{ maxWidth:360, borderRadius:8 }} />
                  <div style={{ opacity:.75, fontSize:12 }}>key: {it.objectKey}</div>
                </div>
              )}
              {it.flags && <pre style={{ marginTop:8, background:"#111827", padding:8, borderRadius:8 }}>{JSON.stringify(it.flags, null, 2)}</pre>}
              {it.reason && <div style={{ marginTop:6, color:"#fca5a5" }}>Reason: {it.reason}</div>}
            </div>
          </div>
        ))}
        {!loading && items.length===0 && <div>No items.</div>}
      </div>
    </div>
  );
}

function btn(active:boolean): React.CSSProperties {
  return { padding:"8px 12px", borderRadius:10, border:"1px solid #333", background: active ? "linear-gradient(180deg,#22c55e,#16a34a)" : "#111827", color: active ? "#0b0f12" : "#e5e7eb", fontWeight:800, cursor:"pointer" };
}
