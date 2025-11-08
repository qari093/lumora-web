"use client";
import React, { useEffect, useRef, useState } from "react";

type RewardEvent = {
  ts: number;
  kind: string; // e.g., "watch","like","share","purchaseIntent"
  ms?: number;
};

const KEY = "offlineRewards:v1";
const MAX_BUFFER = 500;

function readQ(): RewardEvent[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
function writeQ(list: RewardEvent[]) {
  try { localStorage.setItem(KEY, JSON.stringify(list.slice(-MAX_BUFFER))); } catch {}
}

function enqueue(ev: RewardEvent) {
  const list = readQ();
  list.push(ev);
  writeQ(list);
}

async function flushIfOnline(): Promise<{ ok: boolean; sent: number; earned?: number }>{
  if (!navigator.onLine) return { ok:false, sent:0 };
  const list = readQ();
  if (!list.length) return { ok:true, sent:0 };
  try{
    const res = await fetch("/api/offline/reward-sync", {
      method:"POST",
      headers: { "content-type":"application/json" },
      body: JSON.stringify({ events:list })
    });
    const out = await res.json().catch(()=>({ ok:false }));
    if (out?.ok) {
      writeQ([]); // clear on success
      return { ok:true, sent:list.length, earned: out.earned };
    }
  }catch{}
  return { ok:false, sent:0 };
}

export default function OfflineRewardTracker(){
  const [count, setCount] = useState<number>(0);
  const [lastEarn, setLastEarn] = useState<number|undefined>(undefined);
  const tRef = useRef<number|undefined>(undefined);

  useEffect(() => {
    // initial hydrating count
    setCount(readQ().length);

    // Custom event hook: window.dispatchEvent(new CustomEvent('lumora:offline-reward',{detail:{kind:'watch',ms:120}}))
    const onReward = (e: Event) => {
      const d = (e as CustomEvent).detail || {};
      const ev: RewardEvent = { ts: Date.now(), kind: String(d.kind || "watch"), ms: typeof d.ms==="number" ? d.ms : undefined };
      enqueue(ev);
      setCount(readQ().length);
    };
    window.addEventListener("lumora:offline-reward", onReward as any);

    // Auto-flush on back-online or every 20s while online
    const tryFlush = async () => {
      const r = await flushIfOnline();
      if (r.ok) {
        setCount(readQ().length);
        if (typeof r.earned === "number") setLastEarn(r.earned);
      }
    };
    const online = () => tryFlush();
    window.addEventListener("online", online);

    // interval ticker
    tRef.current = window.setInterval(tryFlush, 20000) as unknown as number;

    return () => {
      window.removeEventListener("lumora:offline-reward", onReward as any);
      window.removeEventListener("online", online);
      if (tRef.current) window.clearInterval(tRef.current);
    };
  }, []);

  const chipStyle: React.CSSProperties = {
    position:"fixed", bottom:152, right:14, zIndex: 9996,
    background:"rgba(28,28,40,.75)", color:"#fff",
    padding:"8px 12px", borderRadius:10, font:"600 12px/1.2 system-ui",
    boxShadow:"0 8px 22px rgba(0,0,0,.35)", backdropFilter:"blur(6px)", display:"flex", gap:8, alignItems:"center"
  };

  const btn: React.CSSProperties = { padding:"4px 8px", borderRadius:8, border:"1px solid #667", background:"transparent", color:"#fff", cursor:"pointer" };

  const simulate = () => {
    window.dispatchEvent(new CustomEvent("lumora:offline-reward",{ detail:{ kind:"watch", ms: 90 } }));
  };

  const flush = async () => {
    const r = await flushIfOnline();
    setCount(readQ().length);
    if (typeof r.earned === "number") setLastEarn(r.earned);
  };

  return (
    <div style={chipStyle} title="Offline Reward Tracker">
      <span>Rewards queued: <b>{count}</b></span>
      {typeof lastEarn === "number" ? <span>• earned: +{lastEarn} 🔆</span> : null}
      <button style={btn} onClick={simulate}>Sim</button>
      <button style={{...btn, borderColor:"transparent", background:"#0b8"}} onClick={flush}>Sync</button>
    </div>
  );
}
