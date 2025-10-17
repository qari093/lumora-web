"use client";
import React from "react";
import Link from "next/link";

type Item = {
  id: string;
  author: string;
  handle: string;
  text: string;
  likes: number;
  comments: number;
  shares: number;
  video: string;
  thumb?: string;
};

type FeedResp = { ok: boolean; items: Item[]; nextCursor: string|null; role?: string|null; };

export default function FYP() {
  const [items, setItems] = React.useState<Item[]>([]);
  const [nextCursor, setNextCursor] = React.useState<string|null>(null);
  const [role, setRole] = React.useState<string|null>(null);
  const [liked, setLiked] = React.useState<Record<string, boolean>>({});
  const [draft, setDraft] = React.useState<string>("");
  const containerRef = React.useRef<HTMLDivElement>(null);
  const playersRef = React.useRef<Record<string, HTMLVideoElement|null>>({});
  const [active, setActive] = React.useState(0);
  const loadingRef = React.useRef(false);

  // initial fetch
  React.useEffect(() => { void fetchMore(null); }, []);

  async function fetchMore(cursor: string|null) {
    if (loadingRef.current) return;
    loadingRef.current = true;
    try {
      const url = "/api/fyp" + (cursor ? ("?cursor=" + encodeURIComponent(cursor)) : "");
      const r = await fetch(url);
      const j: FeedResp = await r.json();
      if (j.ok) {
        setItems(prev => [...prev, ...j.items]);
        setNextCursor(j.nextCursor);
        setRole((j as any).role || null);
      }
    } finally {
      loadingRef.current = false;
    }
  }

  // observe items for active index and infinite scroll
  React.useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll("[data-fyp-item]")) as HTMLElement[];
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        const idx = parseInt(e.target.getAttribute("data-idx") || "0", 10);
        if (e.isIntersecting && e.intersectionRatio > 0.6) {
          setActive(idx);
          const last = idx >= items.length - 2;
          if (last && nextCursor) void fetchMore(nextCursor);
          // play/pause logic
          playOnly(idx);
        }
      });
    }, { root, threshold: [0.6] });

    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [items.length, nextCursor]);

  function registerPlayer(id: string, el: HTMLVideoElement|null) {
    playersRef.current[id] = el;
  }
  function playOnly(index: number) {
    for (let i=0;i<items.length;i++) {
      const it = items[i];
      const el = playersRef.current[it.id];
      if (!el) continue;
      if (i===index) { el.muted = true; el.loop = true; el.play().catch(()=>{}); }
      else { el.pause(); }
    }
  }

  async function like(id: string) {
    if (!role) {
      alert("Please sign in to like.");
      return;
    }
    const r = await fetch("/api/fyp/like", { method:"POST", headers:{ "content-type":"application/json" }, body: JSON.stringify({ id }) });
    if (r.ok) {
      const j = await r.json();
      setLiked(m => ({ ...m, [id]: true }));
      setItems(arr => arr.map(a => a.id===id ? { ...a, likes: j.likes } : a));
    }
  }

  async function comment(id: string, text: string) {
    if (!role) {
      alert("Please sign in to comment.");
      return;
    }
    const r = await fetch("/api/fyp/comment", { method:"POST", headers:{ "content-type":"application/json" }, body: JSON.stringify({ id, text }) });
    if (r.ok) {
      const j = await r.json();
      setItems(arr => arr.map(a => a.id===id ? { ...a, comments: j.comments } : a));
      setDraft("");
    }
  }

  function snapTo(idx: number) {
    const el = containerRef.current?.querySelector("[data-idx=\"" + idx + "\"]") as HTMLElement | null;
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // keyboard: J/K next/prev, L like
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "j" || e.key === "J") { e.preventDefault(); snapTo(active + 1); }
      if (e.key === "k" || e.key === "K") { e.preventDefault(); snapTo(active - 1); }
      if (e.key === "l" || e.key === "L") { e.preventDefault(); const it = items[active]; if (it) void like(it.id); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, items, role]);

  function Rail({ it }: { it: Item }) {
    const isLiked = !!liked[it.id];
    const railBtn: React.CSSProperties = {
      width:56, height:56, borderRadius:999,
      border:"1px solid rgba(255,255,255,0.15)", display:"flex",
      alignItems:"center", justifyContent:"center",
      background:"rgba(255,255,255,0.06)", color:"#fff",
      fontWeight:900, cursor:"pointer"
    };
    const badge: React.CSSProperties = { fontSize:12, opacity:.85, textAlign:"center", marginTop:6 };
    return (
      <div style={{ position:"absolute", right:12, top:"46%", transform:"translateY(-50%)", display:"flex", flexDirection:"column", gap:10 }}>
        <button onClick={()=>void like(it.id)} style={railBtn} aria-label="Like">{isLiked ? "💛" : "🤍"}</button>
        <a href="/lumalink/chat" style={{...railBtn, textDecoration:"none"}} aria-label="Comment">💬</a>
        <button style={railBtn} aria-label="Share" onClick={()=>navigator.clipboard?.writeText(location.origin + "/fyp#"+it.id).catch(()=>{})}>🔗</button>
        <button style={railBtn} aria-label="Save">💾</button>
        <div style={badge}>{it.likes} • {it.comments} • {it.shares}</div>
      </div>
    );
  }

  function Card({ it, idx }: { it: Item; idx: number }) {
    const isLiked = !!liked[it.id];
    const chip: React.CSSProperties = {
      padding:"6px 10px", borderRadius:999,
      border:"1px solid rgba(255,255,255,0.20)",
      background: isLiked ? "linear-gradient(180deg,#fbd34d,#d4a017)" : "rgba(255,255,255,0.06)",
      color: isLiked ? "#111" : "#fff",
      fontWeight:800, cursor:"pointer", textDecoration:"none"
    };
    return (
      <section
        data-fyp-item
        data-idx={idx}
        id={it.id}
        onDoubleClick={()=>void like(it.id)}
        style={{ scrollSnapAlign:"start", height:"100dvh", position:"relative", color:"#fff" }}
      >
        <video
          ref={(el)=>registerPlayer(it.id, el)}
          src={it.video}
          poster={it.thumb}
          playsInline
          autoPlay
          muted
          loop
          style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", background:"#000" }}
        />
        <div style={{
          position:"absolute", left:0, bottom:0, right:0, padding:16, margin:16, maxWidth:560,
          borderRadius:16, background:"rgba(0,0,0,0.35)", border:"1px solid rgba(255,255,255,0.15)",
          backdropFilter:"blur(6px)"
        }}>
          <div style={{ display:"flex", gap:10, alignItems:"baseline", marginBottom:6 }}>
            <div style={{ width:28, height:28, borderRadius:999, background:"rgba(255,255,255,0.2)", display:"grid", placeItems:"center", fontWeight:900 }}>
              {it.author.slice(0,1).toUpperCase()}
            </div>
            <strong>{it.author}</strong>
            <span style={{ opacity:.75, fontSize:13 }}>{it.handle}</span>
          </div>
          <div style={{ whiteSpace:"pre-wrap", lineHeight:1.3, textShadow:"0 1px 2px rgba(0,0,0,.7)" }}>{it.text}</div>

          <div style={{ marginTop:8, display:"flex", gap:10, alignItems:"center" }}>
            <button onClick={()=>void like(it.id)} style={chip}>{isLiked ? "♥️ Liked" : "♡ Like"}</button>
            <a href="/lumalink/chat" style={chip}>💬 Comment</a>
            <button onClick={()=>navigator.clipboard?.writeText(location.origin + "/fyp#"+it.id).catch(()=>{})} style={chip}>🔗 Share</button>
            <span style={{fontSize:12, opacity:.8}}>{it.likes} likes • {it.comments} comments • {it.shares} shares</span>
          </div>

          {/* Inline quick comment (posts to backend) */}
          <div style={{ marginTop:10, display:"flex", gap:8 }}>
            <input
              value={draft}
              onChange={(e)=>setDraft(e.target.value)}
              placeholder={role ? "Write a comment…" : "Sign in to comment"}
              disabled={!role}
              style={{ flex:1, padding:"10px 12px", borderRadius:12, border:"1px solid rgba(255,255,255,.15)", background:"rgba(255,255,255,.06)", color:"#fff" }}
            />
            <button onClick={()=>role && draft.trim() && comment(it.id, draft.trim())}
              disabled={!role || !draft.trim()}
              style={{ padding:"10px 14px", borderRadius:12, border:"1px solid rgba(255,255,255,.2)", background:"linear-gradient(180deg,#fbd34d,#d4a017)", color:"#111", fontWeight:900, cursor: role && draft.trim() ? "pointer":"not-allowed" }}>
              Send
            </button>
          </div>
        </div>

        <Rail it={it} />
      </section>
    );
  }

  return (
    <div style={{ minHeight:"100dvh", background:"#0b0f12", color:"#fff" }}>
      {/* Top bar */}
      <div style={{ position:"sticky", top:0, zIndex:10, display:"flex", alignItems:"center", justifyContent:"space-between",
                    padding:"10px 16px", borderBottom:"1px solid rgba(255,255,255,0.10)", background:"rgba(11,15,18,.9)", backdropFilter:"blur(6px)" }}>
        <div style={{ display:"flex", gap:10 }}>
          <strong>For You</strong>
          <span style={{ opacity:.7 }}>• Following</span>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <Link href="/lumalink" style={pill(true)}>🪄 LumaLink</Link>
          <Link href="/creator" style={pill(false)}>Creator</Link>
        </div>
      </div>

      {/* Feed container */}
      <div ref={containerRef} style={{ height:"calc(100dvh - 52px)", overflowY:"auto", scrollSnapType:"y mandatory", scrollBehavior:"smooth", background:"#0b0f12" }}>
        {items.map((it, idx)=> <Card key={it.id + "-" + idx} it={it} idx={idx} />)}
        {nextCursor ? (
          <div style={{ height:120, display:"grid", placeItems:"center", opacity:.7 }}>Loading more…</div>
        ) : (
          <div style={{ height:120, display:"grid", placeItems:"center", opacity:.7 }}>• End of feed •</div>
        )}
      </div>
    </div>
  );
}

/** UI helpers */
function pill(accent:boolean): React.CSSProperties {
  return {
    padding:"8px 12px", borderRadius:999,
    border:"1px solid rgba(255,255,255,0.15)",
    background: accent ? "linear-gradient(180deg,#fbd34d,#d4a017)" : "rgba(255,255,255,0.06)",
    color: accent ? "#111" : "#fff",
    textDecoration:"none", fontWeight:900
  };
}
