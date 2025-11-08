"use client";
import React, { useEffect, useRef, useState } from "react";

const box = {
  position: "fixed" as const,
  bottom: 320,
  left: 12,
  zIndex: 2147483000,
  background: "rgba(18,18,26,.78)",
  backdropFilter: "blur(10px)",
  color: "#fff",
  padding: "10px 12px",
  borderRadius: 12,
  font: "12px system-ui",
  boxShadow: "0 6px 22px rgba(0,0,0,.35)",
  minWidth: 220,
};

const btn = {
  border: "1px solid #777",
  background: "transparent",
  color: "#fff",
  borderRadius: 8,
  padding: "4px 8px",
  cursor: "pointer",
  fontWeight: 700 as const,
};

function idle(fn: () => void) {
  const anyWindow: any = window as any;
  if (typeof anyWindow.requestIdleCallback === "function") {
    anyWindow.requestIdleCallback(() => fn(), { timeout: 2500 });
  } else {
    setTimeout(fn, 500);
  }
}

async function ping(ran: string[]) {
  try {
    await fetch("/api/offline/auto-recover", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ts: Date.now(), note: "auto", ran }),
    });
  } catch {}
}

function fire(name: string, detail?: any) {
  try {
    const evt = detail ? new CustomEvent(name, { detail }) : new Event(name);
    window.dispatchEvent(evt);
    return true;
  } catch { return false; }
}

async function pruneCachesSoft(limit = 80) {
  try {
    if (!("storage" in navigator && "estimate" in navigator.storage)) return false;
    const est = await navigator.storage.estimate();
    const usedMB = (est.usage || 0) / (1024 * 1024);
    const quotaMB = (est.quota || 1) / (1024 * 1024);
    const pct = quotaMB ? (usedMB / quotaMB) * 100 : 0;
    if (pct < limit) return false;
    if (!("caches" in window)) return false;
    const names = await caches.keys();
    for (const n of names) {
      const c = await caches.open(n);
      const keys = await c.keys();
      const keep = Math.ceil(keys.length * 0.7);
      for (let i = keep; i < keys.length; i++) { await c.delete(keys[i].url); }
    }
    return true;
  } catch { return false; }
}

export default function AutoRecovery() {
  const [auto, setAuto] = useState(false);
  const [last, setLast] = useState<string>("idle");
  const [runs, setRuns] = useState<number>(0);
  const [queued, setQueued] = useState<number>(0);
  const tick = useRef<number | null>(null);

  const readQueues = () => {
    try {
      const keys = Object.keys(localStorage);
      const lanes = ["metrics:", "batch:", "predict:", "delta:", "offline:rewards"];
      let total = 0;
      for (const lane of lanes) {
        const k = lane === "offline:rewards" ? "offline:rewards" : keys.find(x => x.startsWith(lane));
        if (!k) continue;
        try {
          const v = localStorage.getItem(k)!;
          const parsed = JSON.parse(v);
          if (Array.isArray(parsed)) total += parsed.length;
          else if (parsed && typeof parsed === "object" && Array.isArray((parsed as any).items)) total += (parsed as any).items.length;
          else if (typeof (parsed as any)?.length === "number") total += (parsed as any).length;
          else total += 1;
        } catch { total += 1; }
      }
      setQueued(total);
    } catch { setQueued(0); }
  };

  const runOnce = async (why: string) => {
    setLast("running");
    const ran: string[] = [];
    await new Promise<void>(res => idle(res));

    if (fire("lumora:metrics-flush")) ran.push("metrics-flush");
    if (fire("lumora:batch-send")) ran.push("batch-send");
    if (fire("lumora:delta-sync")) ran.push("delta-sync");
    if (await pruneCachesSoft(82)) ran.push("prune-soft");
    if (fire("lumora:heal", { reason: "auto" })) ran.push("heal");

    setRuns(v => v + 1);
    setLast(`${why} ok`);
    readQueues();
    ping(ran);
  };

  const toggleAuto = () => {
    setAuto(v => !v);
  };

  useEffect(() => {
    readQueues();
    if (auto) {
      if (tick.current) window.clearInterval(tick.current);
      runOnce("start");
      tick.current = window.setInterval(() => runOnce("interval"), 20000);
    } else {
      if (tick.current) window.clearInterval(tick.current);
      tick.current = null;
    }
    return () => { if (tick.current) window.clearInterval(tick.current); };
  }, [auto]);

  useEffect(() => {
    const vis = () => { if (!document.hidden && auto) runOnce("visible"); };
    const online = () => { if (auto) runOnce("online"); };
    document.addEventListener("visibilitychange", vis);
    window.addEventListener("online", online);
    return () => {
      document.removeEventListener("visibilitychange", vis);
      window.removeEventListener("online", online);
    };
  }, [auto]);

  return (
    <div style={box} title="Auto-Recovery Scheduler">
      <div style={{ fontWeight: 800, marginBottom: 6 }}>Auto-Recovery</div>
      <div>Mode: <b>{auto ? "auto" : "manual"}</b></div>
      <div>Queued: <b>{queued}</b></div>
      <div>Status: <b>{last}</b></div>
      <div>Runs: <b>{runs}</b></div>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button style={btn as any} onClick={() => runOnce("manual")}>Run</button>
        <button style={{ ...btn, borderColor: "transparent", background: auto ? "#c55" : "#0b8" }} onClick={toggleAuto}>
          {auto ? "Stop" : "Auto"}
        </button>
      </div>
    </div>
  );
}
