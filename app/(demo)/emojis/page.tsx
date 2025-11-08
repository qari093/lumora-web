"use client";

import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import ids from "./ids.json";

/**
 * Lumora Holo Emoji Playground — Ultra Neon + Parallax + Chain Reaction
 */
export default function Page(){
  const [actionClass, setActionClass] = useState("act-breathe act-rainbow");
  const [intensity, setIntensity] = useState(1.0);
  const gridRef = useRef<HTMLDivElement|null>(null);
  const raf = useRef<number>();

  /* Default actions per emoji ID */
  const defaultActions = useMemo(() => new Map<string,string>([
    ["emo-light","act-flare act-pulse"],
    ["emo-live","act-rotate"],
    ["emo-link","act-bounce"],
    ["emo-echo","act-float"],
    ["emo-joy","act-bloom act-pulse"],
    ["emo-calm","act-breathe"],
    ["emo-quantum","act-rainbow act-rotate"],
    ["emo-coin","act-bounce"],
  ]),[]);

  /* Accent color from ID */
  const accentFor = (id:string)=>{
    let h=0;for(let i=0;i<id.length;i++) h=(h*31+id.charCodeAt(i))>>>0;
    return `oklch(0.78 0.21 ${h%360})`;
  };

  /* Screen flash for Light emoji */
  const flashLight = ()=>{
    const el=document.getElementById("light-flash")||document.getElementById("lumora-light");
    if(!el)return;
    el.classList.remove("on");void el.offsetWidth;el.classList.add("on");
    setTimeout(()=>el.classList.remove("on"),1200);
  };

  /* Chain pulse neighbors */
  const chainPulse=(index:number)=>{
    const grid=gridRef.current;if(!grid)return;
    const tiles=Array.from(grid.querySelectorAll<HTMLButtonElement>(".emoji-tile"));
    const burst=(i:number,d:number)=>{
      const t=tiles[i];if(!t)return;
      setTimeout(()=>{t.classList.add("chain");
        setTimeout(()=>t.classList.remove("chain"),320);},d);
    };
    [0,1,2].forEach(n=>{
      burst(index-n,70*n);
      burst(index+n,70*n);
    });
  };

  /* Click handler */
  const onEmojiClick=useCallback((id:string,idx:number)=>{
    const cls=defaultActions.get(id)??"act-breathe";
    setActionClass(cls);chainPulse(idx);
    if(id==="emo-light")flashLight();
  },[defaultActions]);

  /* Parallax tilt */
  useEffect(()=>{
    const wrap=gridRef.current?.closest<HTMLElement>(".emoji-card")??gridRef.current;
    if(!wrap)return;
    const onMove=(e:PointerEvent)=>{
      const r=wrap.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width, y=(e.clientY-r.top)/r.height;
      const tx=(x-.5)*8, ty=(.5-y)*8;
      cancelAnimationFrame(raf.current);
      raf.current=requestAnimationFrame(()=>{
        wrap.style.setProperty("--tiltX",`${tx}deg`);
        wrap.style.setProperty("--tiltY",`${ty}deg`);
      });
    };
    const onLeave=()=>{
      cancelAnimationFrame(raf.current);
      wrap.style.setProperty("--tiltX","0deg");
      wrap.style.setProperty("--tiltY","0deg");
    };
    wrap.addEventListener("pointermove",onMove);
    wrap.addEventListener("pointerleave",onLeave);
    return ()=>{wrap.removeEventListener("pointermove",onMove);
                wrap.removeEventListener("pointerleave",onLeave);};
  },[]);

  /* Sync intensity to CSS var */
  useEffect(()=>{
    document.documentElement.style.setProperty("--intensity",String(intensity));
  },[intensity]);

  /* Render grid */
  return(
    <main className={`emoji-wrap ${actionClass}`} style={{"--intensity":intensity}as any}>
      <div className="emoji-card" style={{
        maxWidth:1120,margin:"32px auto",padding:"18px 22px 26px",
        borderRadius:18,background:"rgba(255,255,255,.55)",
        boxShadow:"0 18px 60px rgba(0,0,0,.18)",backdropFilter:"blur(10px)"
      }}>
        <div style={{textAlign:"center",margin:"0 0 10px"}}>
          <h1 style={{margin:0,fontWeight:800}}>Lumora — Holographic Emojis</h1>
          <p style={{opacity:.7,margin:"6px 0 12px"}}>
            Click an emoji to change the action. Parallax reacts to your pointer.
          </p>
          <div className="action-pill">
            <span>Current</span><code>{actionClass}</code>
            <span style={{marginLeft:10}}>Intensity</span>
            <input type="range" min={0.75} max={1.35} step={0.01}
              value={intensity}
              onChange={e=>setIntensity(parseFloat(e.currentTarget.value))}
              style={{width:160}} aria-label="Intensity"/>
          </div>
        </div>

        <div ref={gridRef} className="emoji-grid" style={{marginTop:18}}>
          {ids.map((id,idx)=>(
            <button key={id} className="emoji-tile"
              onClick={()=>onEmojiClick(id,idx)}
              aria-label={id}
              style={{
                cursor:"pointer",background:"transparent",border:"none",padding:0,
                ["--ico-accent"as any]:accentFor(id),
              }}>
              <div className="emoji" style={{width:84,height:84}}>
                <svg viewBox="0 0 64 64" width="64" height="64" aria-hidden="true">
                  <use href={`/sprite.svg#${id}`} />
                </svg>
              </div>
              <div className="emoji-label" style={{marginTop:6}}>{id}</div>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}