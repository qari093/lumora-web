"use client";
import React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function CampaignEditPage(){
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [s, set] = React.useState<any>({ loading:true, error:"" });

  React.useEffect(()=>{
    (async ()=>{
      const res = await fetch(, { cache:"no-store" });
      const j = await res.json();
      if(j?.ok){
        const c = j.campaign;
        set({
          loading:false, error:"",
          title:c.title, objective:c.objective, status:c.status, creativeType:c.creativeType,
          creativeUrl:c.creativeUrl, landingUrl:c.landingUrl||"",
          dailyBudgetEuros: (c.dailyBudgetCents/100).toString(),
          totalBudgetEuros: (c.totalBudgetCents/100).toString(),
          radiusKm: String(c.radiusKm),
          centerLat: c.centerLat!=null? String(c.centerLat):"",
          centerLon: c.centerLon!=null? String(c.centerLon):"",
          startAt: c.startAt ? new Date(c.startAt).toISOString().slice(0,16) : "",
          endAt: c.endAt ? new Date(c.endAt).toISOString().slice(0,16) : "",
        });
      } else set({ loading:false, error: j?.error || "Failed" });
    })();
  },[id]);

  async function save(e:React.FormEvent){
    e.preventDefault();
    const body = {
      title: s.title,
      objective: s.objective,
      status: s.status,
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
    };
    const res = await fetch(, { method:"PATCH", headers:{ "content-type":"application/json" }, body: JSON.stringify(body) });
    const j = await res.json();
    if(j?.ok) router.push();
    else alert(j?.error || "Failed");
  }

  if(s.loading) return <main style={{ padding:20, color:"#9ca3af" }}>Loading...</main>;
  if(s.error) return <main style={{ padding:20 }}>❌ {s.error}</main>;

  const input: React.CSSProperties = { width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #333", background: "#0b0f12", color: "#e5e7eb" };
  const row: React.CSSProperties = { display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 };
  const label: React.CSSProperties = { fontWeight:700, fontSize:13, marginBottom:6 };

  return (
    <main style={{ padding:20, maxWidth:920, margin:"0 auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <h1 style={{ margin:0 }}>✏️ Edit Campaign</h1>
        <Link href={} style={{ padding:"8px 12px", border:"1px solid #3b82f6", color:"#3b82f6", borderRadius:8, textDecoration:"none" }}>Back</Link>
      </div>

      <form onSubmit={save} style={{ display:"grid", gap:14, marginTop:14 }}>
        <div>
          <div style={label}>Title</div>
          <input style={input} value={s.title} onChange={e=>set({...s, title:e.target.value})} />
        </div>

        <div style={row}>
          <div>
            <div style={label}>Objective</div>
            <select style={input as any} value={s.objective} onChange={e=>set({...s, objective:e.target.value})}>
              <option value="AWARENESS">Awareness</option>
              <option value="TRAFFIC">Traffic</option>
              <option value="CONVERSIONS">Conversions</option>
              <option value="VISITS">Local Visits</option>
            </select>
          </div>
          <div>
            <div style={label}>Status</div>
            <select style={input as any} value={s.status} onChange={e=>set({...s, status:e.target.value})}>
              <option value="DRAFT">Draft</option>
              <option value="ACTIVE">Active</option>
              <option value="PAUSED">Paused</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>

        <div style={row}>
          <div>
            <div style={label}>Creative Type</div>
            <select style={input as any} value={s.creativeType} onChange={e=>set({...s, creativeType:e.target.value})}>
              <option value="IMAGE">Image</option>
              <option value="VIDEO">Video</option>
            </select>
          </div>
          <div>
            <div style={label}>Creative URL</div>
            <input style={input} value={s.creativeUrl} onChange={e=>set({...s, creativeUrl:e.target.value})} />
          </div>
        </div>

        <div>
          <div style={label}>Landing URL</div>
          <input style={input} value={s.landingUrl} onChange={e=>set({...s, landingUrl:e.target.value})} />
        </div>

        <div style={row}>
          <div>
            <div style={label}>Daily Budget (€)</div>
            <input style={input} type="number" value={s.dailyBudgetEuros} onChange={e=>set({...s, dailyBudgetEuros:e.target.value})} />
          </div>
          <div>
            <div style={label}>Total Budget (€)</div>
            <input style={input} type="number" value={s.totalBudgetEuros} onChange={e=>set({...s, totalBudgetEuros:e.target.value})} />
          </div>
        </div>

        <div style={row}>
          <div>
            <div style={label}>Radius (km)</div>
            <input style={input} type="number" value={s.radiusKm} onChange={e=>set({...s, radiusKm:e.target.value})} />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div>
              <div style={label}>Center Lat</div>
              <input style={input} value={s.centerLat} onChange={e=>set({...s, centerLat:e.target.value})} />
            </div>
            <div>
              <div style={label}>Center Lon</div>
              <input style={input} value={s.centerLon} onChange={e=>set({...s, centerLon:e.target.value})} />
            </div>
          </div>
        </div>

        <div style={row}>
          <div>
            <div style={label}>Start</div>
            <input style={input} type="datetime-local" value={s.startAt} onChange={e=>set({...s, startAt:e.target.value})} />
          </div>
          <div>
            <div style={label}>End</div>
            <input style={input} type="datetime-local" value={s.endAt} onChange={e=>set({...s, endAt:e.target.value})} />
          </div>
        </div>

        <div>
          <button type="submit" style={{ padding:"10px 14px", borderRadius:10, border:"1px solid #fbbf24", background:"#fbbf24", color:"#0b0f12", fontWeight:800, cursor:"pointer" }}>
            Save Changes
          </button>
        </div>
      </form>
    </main>
  );
}
