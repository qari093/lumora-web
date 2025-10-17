import React from "react";
import SearchBar from "../src/components/lumasearch/SearchBar";
import type { LumaResult } from "../src/types/lumasearch";
import { Img, videoThumb, webFavicon, domainOf } from "../src/components/lumasearch/Thumb";
import Toast from "../src/components/lumasearch/Toast";

type Clip = { id:string; title:string; by:string };
const BASE: Clip[] = [
  { id:"a1", title:"Welcome to Lumora", by:"Team" },
  { id:"a2", title:"Neon Runner — pro dodge", by:"ArcadePro" },
  { id:"a3", title:"ASMR Focus — 20 min", by:"CalmLab" },
];
type Tab = "videos"|"creators"|"web";

export default function FYPPage(){
  const [query,setQuery]=React.useState("");
  const [results,setResults]=React.useState<LumaResult[]|null>(null);
  const [tab,setTab]=React.useState<Tab>("videos");
  const [loading,setLoading]=React.useState(false);
  const [toast,setToast]=React.useState<string|null>(null);
  const [showSkeleton,setShowSkeleton]=React.useState(false);

  // only show skeleton if loading lasts > 200ms to prevent flicker
  React.useEffect(()=>{
    if(!loading){ setShowSkeleton(false); return; }
    const t = setTimeout(()=>setShowSkeleton(true), 200);
    return ()=>clearTimeout(t);
  },[loading]);

  const grouped = React.useMemo(()=>{
    const g = { videos: [] as any[], creators: [] as any[], web: [] as any[] };
    (results||[]).forEach(r=>{
      if(r.kind==="video") g.videos.push(r);
      else if(r.kind==="creator") g.creators.push(r);
      else if(r.kind==="web") g.web.push(r);
    });
    return g;
  },[results]);

  const feedList = React.useMemo(()=>{
    if(!results) return BASE;
    const vids = grouped.videos;
    return vids.length ? vids.map((v:any)=>({ id:v.id, title:v.title, by:v.by||"Creator"})) : BASE;
  },[results,grouped]);

  function jumpTo(v:any){
    const u = new URL(window.location.href);
    u.pathname = "/watch/"+String(v.id);
    if(typeof v.t === "number") u.searchParams.set("t", String(v.t));
    window.location.href = u.toString();
  }

  return (
    <main style={{ minHeight:"100vh", background:"#0a0c10", color:"#e5e7eb" }}>
      <div style={{ position:"sticky", top:0, zIndex:50 }}>
        <SearchBar
          onResults={(q, r)=>{ setQuery(q); setResults(r as LumaResult[]); }}
          onCancel={()=>{ setQuery(""); setResults(null); }}
          onLoading={(b)=>setLoading(b)}
          onError={(m)=>setToast(m)}
        />
      </div>

      <div style={{ padding:16, opacity: results ? 0.96 : 1, transition:"opacity .2s ease" }}>
        {query ? (
          <>
            <div style={{ display:"flex", gap:8, margin:"6px 0 12px" }}>
              {(["videos","creators","web"] as Tab[]).map(t=>(
                <button key={t} onClick={()=>setTab(t)}
                  style={{ padding:"6px 10px", borderRadius:999,
                    border: tab===t ? "1px solid #22c55e" : "1px solid #333",
                    background: tab===t ? "linear-gradient(180deg,#22c55e,#16a34a)" : "#0f1319",
                    color: tab===t ? "#0b0f12" : "#d1d5db", fontWeight:800, cursor:"pointer" }}>
                  {t[0].toUpperCase()+t.slice(1)} ({(grouped as any)[t].length})
                </button>
              ))}
              <div style={{ marginLeft:"auto", color:"#9ca3af" }}>{loading?"Searching…":"Showing:"} <b>{query}</b></div>
            </div>

            {showSkeleton ? <Skeleton kind={tab}/> : (
              <>
                {tab==="videos" && (
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:12 }}>
                    {grouped.videos.length ? grouped.videos.map((v:any)=>(
                      <div key={v.id} onClick={()=>jumpTo(v)} style={{ border:"1px solid #222", borderRadius:12, background:"#0f1319", cursor:"pointer", overflow:"hidden" }}>
                        <Img src={videoThumb(String(v.id))} alt={v.title||"video"} />
                        <div style={{ padding:12 }}>
                          <div style={{ fontWeight:800, lineHeight:1.25 }}>{v.title}</div>
                          <div style={{ opacity:.8, fontSize:13, marginTop:4 }}>by {v.by||"Creator"} {v.t!=null && <span>· jump {v.t}s</span>}</div>
                        </div>
                      </div>
                    )) : <Empty msg="No video results." />}
                  </div>
                )}

                {tab==="creators" && (
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:12 }}>
                    {grouped.creators.length ? grouped.creators.map((c:any)=>(
                      <div key={c.id} style={{ border:"1px solid #222", borderRadius:12, padding:14, background:"#0f1319", display:"flex", alignItems:"center", gap:12 }}>
                        <img src={`https://picsum.photos/seed/${encodeURIComponent(c.id)}/80/80`} alt={c.name} width={48} height={48} style={{borderRadius:"50%", flex:"0 0 48px"}} />
                        <div>
                          <div style={{ fontWeight:800 }}>{c.name}</div>
                          <div style={{ opacity:.8, fontSize:13 }}>{(c.followers||0).toLocaleString()} followers</div>
                        </div>
                      </div>
                    )) : <Empty msg="No creators found." />}
                  </div>
                )}

                {tab==="web" && (
                  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                    {grouped.web.length ? grouped.web.map((w:any)=>(
                      <a key={w.url} href={w.url} target="_blank" rel="noreferrer"
                        style={{ border:"1px solid #222", borderRadius:12, padding:12, background:"#0f1319", textDecoration:"none", color:"#e5e7eb", display:"grid", gridTemplateColumns:"48px 1fr", gap:12, alignItems:"center" }}>
                        <img src={webFavicon(String(w.site||domainOf(String(w.url))))} alt="icon" width={28} height={28} style={{borderRadius:6}} />
                        <div>
                          <div style={{ fontWeight:800 }}>{w.title}</div>
                          <div style={{ opacity:.75, fontSize:13 }}>{w.site || domainOf(String(w.url))}</div>
                        </div>
                      </a>
                    )) : <Empty msg="No web results." />}
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:12 }}>
            {feedList.map(c=>(
              <div key={c.id} style={{ border:"1px solid #222", borderRadius:12, background:"#0f1319", overflow:"hidden" }}>
                <Img src={videoThumb(c.id)} alt={c.title} />
                <div style={{ padding:12 }}>
                  <div style={{ fontWeight:800 }}>{c.title}</div>
                  <div style={{ opacity:.8, fontSize:13 }}>by {c.by}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Toast msg={toast} onClose={()=>setToast(null)} />
    </main>
  );
}

function Skeleton({kind}:{kind:"videos"|"creators"|"web"}){
  if(kind==="web"){
    return (<div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      {Array.from({length:5}).map((_,i)=>(
        <div key={i} style={{ border:"1px solid #222", borderRadius:12, padding:12, background:"#0f1319", height:64, opacity:.7 }}>
          <div style={{ width:"100%", height:"100%", background:"linear-gradient(90deg,#0f1319,#151a22,#0f1319)", backgroundSize:"200% 100%", animation:"sh 1.1s infinite" }} />
        </div>
      ))}
      <style jsx>{\`
        @keyframes sh { 0%{background-position:0% 0} 100%{background-position:-200% 0} }
      \`}</style>
    </div>);
  }
  const cols = kind==="videos" ? "repeat(auto-fill,minmax(280px,1fr))" : "repeat(auto-fill,minmax(220px,1fr))";
  return (<div style={{ display:"grid", gridTemplateColumns:cols, gap:12 }}>
    {Array.from({length:6}).map((_,i)=>(
      <div key={i} style={{ border:"1px solid #222", borderRadius:12, background:"#0f1319", overflow:"hidden" }}>
        <div style={{ width:"100%", aspectRatio:"16/9", background:"#0b0f12" }}>
          <div style={{ width:"100%", height:"100%", background:"linear-gradient(90deg,#0f1319,#151a22,#0f1319)", backgroundSize:"200% 100%", animation:"sh 1.1s infinite" }} />
        </div>
        <div style={{ padding:12 }}>
          <div style={{ height:16, width:"70%", background:"#151a22", borderRadius:6, marginBottom:8 }} />
          <div style={{ height:12, width:"40%", background:"#141922", borderRadius:6 }} />
        </div>
      </div>
    ))}
    <style jsx>{\`
      @keyframes sh { 0%{background-position:0% 0} 100%{background-position:-200% 0} }
    \`}</style>
  </div>);
}

function Empty({msg}:{msg:string}){
  return <div style={{ padding:"18px 12px", border:"1px dashed #333", borderRadius:10, color:"#9ca3af" }}>{msg}</div>;
}
