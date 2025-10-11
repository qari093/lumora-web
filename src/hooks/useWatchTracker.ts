import { useEffect, useRef } from "react";
import { tryFetch } from "@/lib/backoff";

type Opt = {
  videoRef: React.RefObject<HTMLVideoElement>;
  videoId: string;
  bearer?: string | null;
  onUnitsSent?: (units:number)=>void;
};

export function useWatchTracker({ videoRef, videoId, bearer, onUnitsSent }: Opt){
  const accMs = useRef(0);
  const last = useRef<number | null>(null);
  const bucketMs = useRef(0);
  const flushing = useRef(false);

  useEffect(()=>{
    const v = videoRef.current; if(!v) return;

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
            const r = await tryFetch("/api/energy/watch", {
              method:"POST",
              headers:{ "content-type":"application/json", "authorization":`Bearer ${bearer}` },
              body: JSON.stringify({ videoId, units })
            });
            if(r.ok){ onUnitsSent?.(units); }
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
      clearInterval(tickInt); clearInterval(flushInt);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("ended", onEnded);
      if(accMs.current>0) void flush();
    };
  }, [videoRef, videoId, bearer, onUnitsSent]);
}
