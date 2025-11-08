"use client";
import { useEffect, useRef, useState } from "react";

type Metric = {
  t: number;
  type: "impression"|"click"|"geo-reactivate"|"heartbeat";
  adId?: string | null;
  videoId?: string | null;
  extra?: any;
};

const KEY = "lumora_metrics_queue_v1";

function loadQ(): Metric[] {
  try { const s = localStorage.getItem(KEY); return s ? JSON.parse(s) : []; }
  catch { return []; }
}
function saveQ(q: Metric[]) {
  try { localStorage.setItem(KEY, JSON.stringify(q)); } catch {}
}

async function flushOnce(): Promise<number> {
  const q = loadQ();
  if (!q.length) return 0;
  try {
    const res = await fetch("/api/metrics/batch", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ items: q }),
      keepalive: true,
    });
    if (!res.ok) throw new Error(String(res.status));
    saveQ([]);
    return q.length;
  } catch {
    return 0;
  }
}

export function enqueue(m: Metric) {
  const q = loadQ();
  q.push(m);
  saveQ(q);
}

declare global {
  interface Window { lumoraMetrics?: { enqueue: typeof enqueue } }
}

export default function MetricsQueue() {
  const [queued, setQueued] = useState(loadQ().length);
  const ticking = useRef(false);

  useEffect(() => {
    window.lumoraMetrics = { enqueue };
  }, []);

  useEffect(() => {
    const onImpression = (e: any) => { enqueue({ t: Date.now(), type: "impression", adId: e?.detail?.adId ?? null, extra: e?.detail ?? null }); setQueued(loadQ().length); };
    const onClick = (e: any) => { enqueue({ t: Date.now(), type: "click", adId: e?.detail?.adId ?? null, extra: e?.detail ?? null }); setQueued(loadQ().length); };
    const onGeo = (e: any) => { enqueue({ t: Date.now(), type: "geo-reactivate", extra: { distanceKm: e?.detail } }); setQueued(loadQ().length); };
    document.addEventListener("ad:impression", onImpression);
    document.addEventListener("ad:click", onClick);
    document.addEventListener("geo:reactivate", onGeo);
    return () => {
      document.removeEventListener("ad:impression", onImpression);
      document.removeEventListener("ad:click", onClick);
      document.removeEventListener("geo:reactivate", onGeo);
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      enqueue({ t: Date.now(), type: "heartbeat" });
      setQueued(loadQ().length);
    }, 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const tryFlush = async () => {
      if (ticking.current) return;
      if (!navigator.onLine) return;
      ticking.current = true;
      const n = await flushOnce();
      if (n > 0) setQueued(loadQ().length);
      ticking.current = false;
    };
    const online = () => { tryFlush(); };
    window.addEventListener("online", online);
    const id = setInterval(tryFlush, 20000);
    return () => { window.removeEventListener("online", online); clearInterval(id); };
  }, []);

  return (
    <div style={{
      position:"fixed", bottom:180, right:14, zIndex:9996,
      background:"rgba(30,30,40,0.7)", color:"#fff", padding:"6px 10px",
      borderRadius:10, font:"600 12px/1.2 system-ui"
    }}>
      Metrics queued: {queued}
      <button
        onClick={async ()=>{ const n = await flushOnce(); setQueued(loadQ().length); alert(`flushed ${n}`); }}
        style={{marginLeft:8, background:"#09f", color:"#fff", border:"none", borderRadius:8, padding:"4px 8px", cursor:"pointer"}}
      >
        Flush
      </button>
    </div>
  );
}
