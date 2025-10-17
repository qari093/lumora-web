"use client";
import React from "react";
import { getCache, setCache } from "./Cache";

type Props = {
  onResults: (q: string, results: any[]) => void;
  onCancel: () => void;
  onLoading: (b: boolean) => void;
  onError?: (msg: string) => void;
};

type Recent = string[];

function useDebouncedCallback<T extends (...a:any[])=>void>(fn:T, delay=350){
  const t = React.useRef<number|undefined>(undefined);
  return React.useCallback((...args:Parameters<T>)=>{
    if(t.current) clearTimeout(t.current);
    // @ts-ignore
    t.current = window.setTimeout(()=>fn(...args), delay);
  },[fn,delay]);
}

export default function SearchBar({ onResults, onCancel, onLoading, onError }: Props) {
  const [q, setQ] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const [recent, setRecent] = React.useState<Recent>([]);

  // load recent on mount
  React.useEffect(()=>{
    try{
      const raw = localStorage.getItem("luma_recent");
      if(raw) setRecent(JSON.parse(raw));
    }catch{}
  },[]);

  function saveRecent(term:string){
    if(!term.trim()) return;
    const next = [term, ...recent.filter(r=>r!==term)].slice(0,8);
    setRecent(next);
    try{ localStorage.setItem("luma_recent", JSON.stringify(next)); }catch{}
  }

  async function fetchUpstream(qv: string){
    const r = await fetch(`/api/lumasearch?q=${encodeURIComponent(qv)}`, { cache: "no-store" });
    if(!r.ok) throw new Error(`HTTP ${r.status}`);
    const j = await r.json();
    const results = j.results || [];
    setCache(qv, results);
    return results;
  }

  // main runner with cache + background revalidate
  async function runNow(qv: string) {
    if (!qv.trim()) return;
    saveRecent(qv);

    const fromCache = getCache(qv);
    let shownFromCache = false;

    if (fromCache) {
      onResults(qv, fromCache.data);
      shownFromCache = true;
    }

    const start = Date.now();
    setLoading(true); onLoading(true);

    try {
      const fresh = await fetchUpstream(qv);

      // Avoid flashing on very-fast results if cache was just shown
      if (shownFromCache && JSON.stringify(fresh) === JSON.stringify(fromCache?.data)) {
        // identical; do nothing
      } else {
        onResults(qv, fresh);
      }
    } catch (e:any) {
      console.error("lumasearch error", e);
      if(!shownFromCache) onResults(qv, []); // empty if no cache
      onError?.("Search failed. Check your network or endpoint.");
    } finally {
      setLoading(false); onLoading(false);
      const dt = Date.now()-start;
      // optional: small UX metric
      (window as any).__luma_last_search_ms = dt;
    }
  }

  const runDebounced = useDebouncedCallback((val:string)=>runNow(val), 350);

  // keyboard shortcuts: Cmd/Ctrl+K or "/" focuses; ESC clears/cancels
  const inputRef = React.useRef<HTMLInputElement|null>(null);
  React.useEffect(()=>{
    function onKey(e: KeyboardEvent){
      const metaK = (e.key.toLowerCase()==="k") && (e.metaKey || e.ctrlKey);
      if(metaK || e.key==="/"){
        e.preventDefault();
        inputRef.current?.focus();
      }
      if(e.key==="Escape"){
        setQ("");
        onCancel();
        inputRef.current?.blur();
      }
    }
    window.addEventListener("keydown", onKey);
    return ()=> window.removeEventListener("keydown", onKey);
  },[onCancel]);

  return (
    <div style={{
      position:"sticky", top:0, zIndex:50, padding:"10px 12px",
      backdropFilter:"blur(8px)", background:"rgba(10,12,16,0.55)", borderBottom:"1px solid #222"
    }}>
      <div style={{
        display:"flex", alignItems:"center", gap:8, padding:"10px 12px",
        borderRadius:12, border: focused ? "1px solid #22c55e" : "1px solid #333",
        background:"#0b0f12"
      }}>
        <span aria-hidden>🔎</span>
        <input
          ref={inputRef}
          value={q}
          onChange={(e)=>{
            const v = e.target.value;
            setQ(v);
            if(v.trim()){ runDebounced(v); }
          }}
          onFocus={()=>setFocused(true)}
          onBlur={()=>setFocused(false)}
          onKeyDown={(e)=>{ if(e.key==="Enter") runNow(q); }}
          placeholder="Search moments, creators, web…  (⌘K)"
          style={{
            flex:1, background:"transparent", border:"none", outline:"none",
            color:"#e5e7eb", fontSize:16
          }}
        />
        {q && (
          <button
            onClick={()=>{ setQ(""); onCancel(); }}
            title="ESC"
            style={{ background:"transparent", border:"1px solid #444", color:"#bbb",
                     padding:"6px 10px", borderRadius:8, cursor:"pointer" }}>
            Cancel
          </button>
        )}
        <button
          onClick={()=>runNow(q)}
          disabled={loading}
          style={{
            background: loading ? "#1f2937" : "linear-gradient(180deg,#22c55e,#16a34a)",
            border:"none", color: loading ? "#9ca3af" : "#0b0f12",
            padding:"8px 12px", borderRadius:10, fontWeight:800, cursor:"pointer"
          }}>
          {loading ? "Searching…" : "Search"}
        </button>
      </div>

      {/* recent searches */}
      {recent.length>0 && !q && (
        <div style={{display:"flex", gap:8, padding:"8px 4px 0 4px", flexWrap:"wrap"}}>
          {recent.map((r)=>(<button key={r}
            onClick={()=>{ setQ(r); runNow(r); }}
            style={{border:"1px solid #2b2f36", background:"#0f1319", color:"#cbd5e1",
                    borderRadius:999, padding:"6px 10px", cursor:"pointer"}}>{r}</button>))}
          <button onClick={()=>{ setRecent([]); try{localStorage.removeItem("luma_recent");}catch{}; }}
            style={{marginLeft:"auto", border:"1px solid #2b2f36", background:"transparent", color:"#9ca3af",
                    borderRadius:999, padding:"6px 10px", cursor:"pointer"}}>Clear</button>
        </div>
      )}
    </div>
  );
}
