import { useEffect, useRef } from "react";
import { tryFetch } from "@/lib/backoff";

type Opt = {
  videoRef: React.RefObject<HTMLVideoElement>;
  videoId: string;
  bearer?: string | null;
};

export function useWatchTracker({ videoRef, videoId, bearer }: Opt){
  const accMs = useRef(0);
  const last = useRef<number | null>(null);
  const bucketMs = useRef(0);
  const flushing = useRef(false);
  const visible = useRef(0);
  const focused = useRef(true);
  const holder = useRef<HTMLDivElement | null>(null);

  useEffect(()=>{
    focused.current = document.hasFocus();
    const onFocus = ()=>{ focused.current = true; };
    const onBlur  = ()=>{ focused.current = false; };
    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onBlur);
    return ()=>{ window.removeEventListener("focus", onFocus); window.removeEventListener("blur", onBlur); };
  }, []);

  useEffect(()=>{
    const v = videoRef.current; if(!v) return;
    // track visibility of the video element
    const io = new IntersectionObserver((ents)=>{
      for(const e of ents){ if(e.target === v){ visible.current = e.intersectionRatio; } }
    }, { threshold: [0,0.25,0.5,0.6,0.75,1] });
    io.observe(v);

    const tick = () => {
      const now = performance.now();
      if(last.current!=null) accMs.current += now - last.current;
      last.current = now;
    };

    async function flush(){
      if(flushing.current) return;
      flushing.current = true;
      try{
        const ms = Math.round(accMs.current); accMs.current = 0;
        if(ms>0 && bearer){
          bucketMs.current += ms;
          let units = 0;
          while(bucketMs.current >= 3000){ bucketMs.current -= 3000; units++; }
          if(units>0){
            await tryFetch("/api/energy/watch", {
              method:"POST",
              headers:{ "content-type":"application/json", "authorization":`Bearer ${bearer}` },
              body: JSON.stringify({ videoId, units, visible: visible.current, focus: focused.current })
            }, 3);
          }
        }
      }finally{ flushing.current = false; }
    }

    const tickInt = setInterval(tick, 250);
    const flushInt = setInterval(()=>void flush(), 900);

    const onPlay = () => { last.current = performance.now(); };
    const onPause = () => { last.current = null; };
    const onEnded = () => { last.current = null; void flush(); };

    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("ended", onEnded);

    return ()=>{
      io.disconnect();
      clearInterval(tickInt); clearInterval(flushInt);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("ended", onEnded);
      if(accMs.current>0) void flush();
    };
  }, [videoRef, videoId, bearer]);
}
