"use client";
import React from "react";

type State = {
  title: string;
  objective: "AWARENESS" | "TRAFFIC" | "CONVERSIONS" | "VISITS";
  creativeType: "IMAGE" | "VIDEO";
  creativeUrl: string;
  landingUrl: string;
  dailyBudgetEuros: string;
  totalBudgetEuros: string;
  radiusKm: string;
  centerLat: string;
  centerLon: string;
  startAt: string;
  endAt: string;
  saving: boolean;
  result?: string;
  error?: string;
};

const label: React.CSSProperties = { fontWeight: 700, fontSize: 13, marginBottom: 6 };
const input: React.CSSProperties = { width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #333", background: "#0b0f12", color: "#e5e7eb" };
const row: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 };

export default function CampaignForm() {
  const [s, set] = React.useState<State>({
    title: "",
    objective: "AWARENESS",
    creativeType: "IMAGE",
    creativeUrl: "",
    landingUrl: "",
    dailyBudgetEuros: "10",
    totalBudgetEuros: "100",
    radiusKm: "50",
    centerLat: "",
    centerLon: "",
    startAt: "",
    endAt: "",
    saving: false,
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    set(v => ({ ...v, saving: true, error: undefined, result: undefined }));
    try {
      const res = await fetch("/api/ads/campaigns", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: s.title,
          objective: s.objective,
          creativeType: s.creativeType,
          creativeUrl: s.creativeUrl,
          landingUrl: s.landingUrl || null,
          dailyBudgetEuros: Number(s.dailyBudgetEuros),
          totalBudgetEuros: Number(s.totalBudgetEuros),
          radiusKm: Number(s.radiusKm),
          centerLat: s.centerLat ? Number(s.centerLat) : null,
          centerLon: s.centerLon ? Number(s.centerLon) : null,
          startAt: s.startAt || null,
          endAt: s.endAt || null,
        })
      });
      const j = await res.json();
      if (!res.ok || !j?.ok) throw new Error(j?.error || "Failed to create");
      set(v => ({ ...v, saving: false, result:  }));
    } catch (err: any) {
      set(v => ({ ...v, saving: false, error: err?.message || String(err) }));
    }
  }

  const card: React.CSSProperties = { background: "#0f172a", color: "#e5e7eb", border: "1px solid #1f2937", padding: 16, borderRadius: 12 };

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 14 }}>
      <div style={card}>
        <div style={{ ...label, marginBottom: 10, fontSize: 14 }}>Campaign Basics</div>
        <div style={{ ...row }}>
          <div>
            <div style={label}>Title *</div>
            <input style={input} value={s.title} onChange={e=>set({...s, title:e.target.value})} placeholder="Local Launch — Downtown Radius" />
          </div>
          <div>
            <div style={label}>Objective</div>
            <select style={input as any} value={s.objective} onChange={e=>set({...s, objective:e.target.value as any})}>
              <option value="AWARENESS">Awareness</option>
              <option value="TRAFFIC">Traffic</option>
              <option value="CONVERSIONS">Conversions</option>
              <option value="VISITS">Local Visits</option>
            </select>
          </div>
        </div>
        <div style={{ ...row, marginTop: 12 }}>
          <div>
            <div style={label}>Creative Type</div>
            <select style={input as any} value={s.creativeType} onChange={e=>set({...s, creativeType:e.target.value as any})}>
              <option value="IMAGE">Image</option>
              <option value="VIDEO">Video</option>
            </select>
          </div>
          <div>
            <div style={label}>Creative URL *</div>
            <input style={input} value={s.creativeUrl} onChange={e=>set({...s, creativeUrl:e.target.value})} placeholder="https://cdn.../banner.jpg or .mp4" />
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <div style={label}>Landing URL (optional)</div>
          <input style={input} value={s.landingUrl} onChange={e=>set({...s, landingUrl:e.target.value})} placeholder="https://example.com" />
        </div>
      </div>

      <div style={card}>
        <div style={{ ...label, marginBottom: 10, fontSize: 14 }}>Budget & Geo</div>
        <div style={row}>
          <div>
            <div style={label}>Daily Budget (€)</div>
            <input style={input} type="number" min={1} value={s.dailyBudgetEuros} onChange={e=>set({...s, dailyBudgetEuros:e.target.value})}/>
          </div>
          <div>
            <div style={label}>Total Budget (€)</div>
            <input style={input} type="number" min={1} value={s.totalBudgetEuros} onChange={e=>set({...s, totalBudgetEuros:e.target.value})}/>
          </div>
        </div>
        <div style={{ ...row, marginTop: 12 }}>
          <div>
            <div style={label}>Radius (km)</div>
            <input style={input} type="number" min={1} value={s.radiusKm} onChange={e=>set({...s, radiusKm:e.target.value})}/>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div>
              <div style={label}>Center Lat</div>
              <input style={input} value={s.centerLat} onChange={e=>set({...s, centerLat:e.target.value})} placeholder="52.5200"/>
            </div>
            <div>
              <div style={label}>Center Lon</div>
              <input style={input} value={s.centerLon} onChange={e=>set({...s, centerLon:e.target.value})} placeholder="13.4050"/>
            </div>
          </div>
        </div>
      </div>

      <div style={card}>
        <div style={{ ...label, marginBottom: 10, fontSize: 14 }}>Schedule</div>
        <div style={row}>
          <div>
            <div style={label}>Start</div>
            <input style={input} type="datetime-local" value={s.startAt} onChange={e=>set({...s, startAt:e.target.value})}/>
          </div>
          <div>
            <div style={label}>End</div>
            <input style={input} type="datetime-local" value={s.endAt} onChange={e=>set({...s, endAt:e.target.value})}/>
          </div>
        </div>
      </div>

      <div style={{ display:"flex", gap:10, alignItems:"center" }}>
        <button disabled={s.saving} type="submit" style={{ padding:"10px 14px", borderRadius:10, border:"1px solid #16a34a", background:"#22c55e", color:"#0b0f12", fontWeight:800, cursor:"pointer" }}>
          {s.saving ? "Saving..." : "Create Campaign"}
        </button>
        {s.result && <span style={{ color:"#22c55e", fontWeight:700 }}>{s.result}</span>}
        {s.error && <span style={{ color:"#f87171", fontWeight:700 }}>❌ {s.error}</span>}
      </div>
    </form>
  );
}
