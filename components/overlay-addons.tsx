// components/overlay-addons.tsx
"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";

type Action = { id:string; label:string; href?:string; onClick?:()=>void; };

export default function OverlayAddons({ onAction }:{ onAction?:(id:string)=>void }) {
  const router = useRouter();
  const pathname = usePathname();
  const [online, setOnline] = React.useState(true);
  const [panel, setPanel]   = React.useState<string | null>(null);

  React.useEffect(() => {
    setOnline(typeof navigator !== "undefined" ? navigator.onLine : true);
    const on = () => setOnline(true), off = () => setOnline(false);
    addEventListener("online", on); addEventListener("offline", off);
    return () => { removeEventListener("online", on); removeEventListener("offline", off); };
  }, []);

  const ctxByRoute: Record<string, Action[]> = {
    "/wallet": [{ id:"pay",label:"Pay"},{ id:"scan",label:"Scan"},{ id:"topup",label:"Top up"}],
    "/lumen":  [{ id:"prompt",label:"New Prompt"},{ id:"history",label:"History"},{ id:"pin",label:"Pin to Home"}],
    "/shop":   [{ id:"cart",label:"Cart"},{ id:"orders",label:"Orders"},{ id:"offers",label:"Offers"}]
  };
  const activeCtx = Object.keys(ctxByRoute).find(k => pathname?.startsWith(k));
  const actions = activeCtx ? ctxByRoute[activeCtx] : [
    { id:"search", label:"Search", href:"/nexa" },
    { id:"share",  label:"Share" },
    { id:"music",  label:"Music", href:"/music" }
  ];

  const run = (a: Action) => {
    if (a.href) router.push(a.href);
    if (a.onClick) a.onClick();
    onAction?.(a.id);
    setPanel(null);
  };

  return (
    <div className="addons">
      {/* Online/Offline chip */}
      <div className="net" data-online={online ? "1" : "0"} role="status" aria-live="polite">
        <span className="dot" /> {online ? "Online" : "Offline"}
      </div>

      {/* Bonus Ring */}
      <div className="ring">
        {[
          { id:"scan",label:"Scan",href:"/wallet" },
          { id:"pay",label:"Pay",href:"/wallet" },
          { id:"search",label:"Search",href:"/nexa" },
          { id:"share",label:"Share" },
          { id:"music",label:"Music",href:"/music" },
          { id:"trend",label:"Trending",href:"/trending" },
          { id:"me",label:"Me",href:"/profile" },
          { id:"prefs",label:"Prefs",href:"/settings" }
        ].map((b,i)=>(
          <button key={b.id} className="ring-btn" style={{"--i": String(i)} as React.CSSProperties} onClick={()=>run(b)}>
            <span>{b.label}</span>
          </button>
        ))}
      </div>

      {/* Context panel */}
      <div className="panel">
        <button className="panel-toggle" onClick={()=>setPanel(p=>p?null:(activeCtx||"home"))}>
          {panel ? "Close" : "Quick actions"}
        </button>
        {panel && (
          <div className="panel-body">
            {(ctxByRoute[activeCtx||""] ?? actions).map(a => (
              <button key={a.id} className="chip" onClick={()=>run(a)}>{a.label}</button>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .addons{ position:relative; display:grid; gap:10px; }
        .net{ justify-self:end; display:inline-flex; align-items:center; gap:8px; padding:8px 12px;
              border-radius:999px; font-size:12px; background:rgba(255,255,255,.55);
              box-shadow:inset 0 0 0 1px rgba(255,255,255,.65); backdrop-filter:blur(8px); }
        .net .dot{ width:8px; height:8px; border-radius:50%; background:#19c37d; box-shadow:0 0 0 2px rgba(255,255,255,.9); }
        .net[data-online="0"] .dot{ background:#ff4d4f; }
        :global(html.dark) .net{ background:rgba(32,32,38,.6); box-shadow:inset 0 0 0 1px rgba(255,255,255,.12); }

        .ring{ position:relative; width:min(88vw,560px); height:min(88vw,560px); margin:8px auto 0; }
        .ring-btn{ position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
          width:88px; height:88px; border-radius:20px; border:0; cursor:pointer; font-weight:800;
          background:rgba(255,255,255,.55); box-shadow:inset 0 0 0 1px rgba(255,255,255,.65), 0 10px 28px rgba(0,0,0,.08); }
        .ring-btn:hover{ transform:translate(-50%,-50%) scale(1.04); background:rgba(255,255,255,.75); }
        :global(html.dark) .ring-btn{ background:rgba(38,38,46,.6); box-shadow:inset 0 0 0 1px rgba(255,255,255,.1), 0 10px 28px rgba(0,0,0,.45); color:#eaeaf0; }
        /* radial positions (8 buttons) */
        .ring-btn{ --r:200px; transform: translate(-50%,-50%) rotate(calc(var(--i)*45deg)) translateY(calc(-1*var(--r))) rotate(calc(-1*var(--i)*45deg)); }

        .panel{ display:grid; gap:8px; justify-items:end; }
        .panel-toggle{ padding:10px 12px; border-radius:12px; border:0; font-weight:800; cursor:pointer;
          background:rgba(255,255,255,.6); box-shadow:inset 0 0 0 1px rgba(255,255,255,.65); }
        :global(html.dark) .panel-toggle{ background:rgba(38,38,46,.6); box-shadow:inset 0 0 0 1px rgba(255,255,255,.1); color:#eaeaf0; }
        .panel-body{ display:flex; flex-wrap:wrap; gap:8px; max-width:min(90vw,620px); }
        .chip{ border:0; padding:10px 12px; border-radius:12px; font-weight:800; cursor:pointer;
               background:rgba(255,255,255,.6); box-shadow:inset 0 0 0 1px rgba(255,255,255,.65); }
        .chip:hover{ background:rgba(255,255,255,.8); }
      `}</style>
    </div>
  );
}
