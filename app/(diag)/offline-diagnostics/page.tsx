"use client";
import React, { useEffect, useState } from "react";

type Metrics = {
  online: boolean;
  sw: string;
  storageUsed: number | null;
  storageQuota: number | null;
  localBytes: number;
  localKeys: number;
  queues: { metrics: number; orders: number };
  caches: string[];
  conn?: { downlink?: number; rtt?: number; effectiveType?: string; saveData?: boolean };
  ua: string;
  time: string;
};

function prettyBytes(b?: number | null) {
  if (b == null) return "—";
  const u = ["B","KB","MB","GB","TB"];
  let i = 0, v = b;
  while (v >= 1024 && i < u.length-1) { v /= 1024; i++; }
  return `${v.toFixed(1)} ${u[i]}`;
}

export default function OfflineDiagnostics() {
  const [m,setM] = useState<Metrics | null>(null);
  const [busy,setBusy] = useState<string | null>(null);

  async function collect(): Promise<Metrics> {
    // Online / Conn
    const online = typeof navigator !== "undefined" ? navigator.onLine : false;
    const anyNav: any = navigator;
    const conn = anyNav?.connection ? {
      downlink: anyNav.connection.downlink,
      rtt: anyNav.connection.rtt,
      effectiveType: anyNav.connection.effectiveType,
      saveData: anyNav.connection.saveData,
    } : undefined;

    // Service Worker state
    let sw = "none";
    try {
      const reg = await navigator.serviceWorker?.getRegistration();
      if (reg?.active) sw = "active";
      else if (reg?.installing) sw = "installing";
      else if (reg?.waiting) sw = "waiting";
      else sw = "registered-none";
    } catch { sw = "error"; }

    // Storage estimate
    let storageUsed: number | null = null, storageQuota: number | null = null;
    try {
      const est = await (navigator as any).storage?.estimate?.();
      storageUsed = est?.usage ?? null;
      storageQuota = est?.quota ?? null;
    } catch {}

    // LocalStorage stats + known queues
    let localBytes = 0, localKeys = 0, qMetrics = 0, qOrders = 0;
    try {
      localKeys = localStorage.length;
      for (let i=0;i<localStorage.length;i++){
        const k = localStorage.key(i) as string;
        const v = localStorage.getItem(k) || "";
        localBytes += k.length + v.length;
        if (k.startsWith("metrics:queue:")) {
          try { qMetrics += JSON.parse(v)?.length ?? 1; } catch { qMetrics++; }
        }
        if (k.startsWith("order:queued:") || k.startsWith("orderhash:")) qOrders++;
      }
    } catch {}

    // Cache Storage names
    let cachesList: string[] = [];
    try {
      if ("caches" in window) {
        // @ts-ignore
        cachesList = await caches.keys();
      }
    } catch {}

    return {
      online,
      sw,
      storageUsed,
      storageQuota,
      localBytes,
      localKeys,
      queues: { metrics: qMetrics, orders: qOrders },
      caches: cachesList,
      conn,
      ua: typeof navigator !== "undefined" ? navigator.userAgent : "server",
      time: new Date().toLocaleString(),
    };
  }

  async function refresh() {
    setBusy("Refreshing…");
    try {
      setM(await collect());
    } finally {
      setBusy(null);
    }
  }

  async function flushMetrics() {
    setBusy("Flushing metrics…");
    try {
      (window as any).__lumora_metrics_flush?.();
      window.dispatchEvent(new CustomEvent("lumora:metrics:flush"));
      setTimeout(refresh, 400);
    } finally { setBusy(null); }
  }

  async function retryOrders() {
    setBusy("Retrying orders…");
    try {
      window.dispatchEvent(new CustomEvent("lumora:orders:retry"));
      setTimeout(refresh, 600);
    } finally { setBusy(null); }
  }

  async function clearCaches() {
    setBusy("Clearing caches…");
    try {
      if ("caches" in window) {
        // @ts-ignore
        const keys: string[] = await caches.keys();
        for (const k of keys) { try { /* @ts-ignore */ await caches.delete(k); } catch {} }
      }
      setTimeout(refresh, 600);
    } finally { setBusy(null); }
  }

  async function clearLocal() {
    setBusy("Clearing localStorage (safe prefixes)…");
    try {
      const keep = new Set<string>(["zen:settings"]);
      const toDel: string[] = [];
      for (let i=0;i<localStorage.length;i++){
        const k = localStorage.key(i) as string;
        if (keep.has(k)) continue;
        if (k.startsWith("metrics:") || k.startsWith("order:") || k.startsWith("orderhash:") || k.startsWith("lumora:")) {
          toDel.push(k);
        }
      }
      toDel.forEach(k => { try { localStorage.removeItem(k); } catch {} });
      setTimeout(refresh, 300);
    } finally { setBusy(null); }
  }

  async function checkForSwUpdate() {
    setBusy("Checking SW update…");
    try {
      const reg = await navigator.serviceWorker?.getRegistration();
      await reg?.update();
      setTimeout(refresh, 600);
    } finally { setBusy(null); }
  }

  useEffect(() => { refresh(); }, []);

  const card: React.CSSProperties = {
    maxWidth: 980, margin: "40px auto", padding: "20px 24px",
    background: "rgba(15,15,20,.85)", color:"#fff", borderRadius: 14,
    boxShadow: "0 10px 30px rgba(0,0,0,.45)", backdropFilter: "blur(10px)",
    fontFamily: "ui-sans-serif, system-ui",
  };
  const pill: React.CSSProperties = {
    display:"inline-block", padding:"6px 10px", borderRadius:999,
    background:"rgba(255,255,255,.08)", marginRight:8, marginBottom:8, fontSize:12
  };
  const btn: React.CSSProperties = {
    padding:"8px 12px", borderRadius:10, border:"1px solid rgba(255,255,255,.25)",
    background:"transparent", color:"#fff", cursor:"pointer", marginRight:8, marginTop:8
  };

  return (
    <main style={{minHeight:"100vh", background:"#0a0a0f", padding:"30px 16px"}}>
      <div style={card}>
        <h1 style={{margin:"0 0 8px 0"}}>Offline Diagnostics Dashboard</h1>
        <div style={{opacity:.7, marginBottom:16}}>Snapshot: {m?.time ?? "…"}</div>

        <div style={{marginBottom:12}}>
          <span style={pill}>Online: <b>{m?.online ? "yes" : "no"}</b></span>
          <span style={pill}>SW: <b>{m?.sw ?? "…"}</b></span>
          <span style={pill}>Conn: <b>{m?.conn?.effectiveType ?? "n/a"}</b></span>
          <span style={pill}>Downlink: <b>{m?.conn?.downlink ?? "?"} Mbps</b></span>
          <span style={pill}>RTT: <b>{m?.conn?.rtt ?? "?"} ms</b></span>
        </div>

        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:18}}>
          <div style={{background:"rgba(255,255,255,.05)", borderRadius:12, padding:14}}>
            <h3 style={{marginTop:0}}>Storage</h3>
            <div>Quota: <b>{prettyBytes(m?.storageQuota)}</b></div>
            <div>Used: <b>{prettyBytes(m?.storageUsed)}</b></div>
            <div>localStorage: <b>{prettyBytes(m?.localBytes)}</b> in <b>{m?.localKeys ?? 0}</b> keys</div>
            <div style={{marginTop:10}}>
              <button style={btn} onClick={clearLocal}>Clear Local (safe)</button>
              <button style={btn} onClick={clearCaches}>Clear Caches</button>
            </div>
          </div>

          <div style={{background:"rgba(255,255,255,.05)", borderRadius:12, padding:14}}>
            <h3 style={{marginTop:0}}>Queues</h3>
            <div>Metrics queued: <b>{m?.queues.metrics ?? 0}</b></div>
            <div>Orders queued: <b>{m?.queues.orders ?? 0}</b></div>
            <div style={{marginTop:10}}>
              <button style={btn} onClick={flushMetrics}>Flush Metrics</button>
              <button style={btn} onClick={retryOrders}>Retry Orders</button>
              <button style={btn} onClick={checkForSwUpdate}>Check SW Update</button>
            </div>
          </div>
        </div>

        <div style={{marginTop:14}}>
          <h3 style={{marginTop:0}}>Caches</h3>
          <div>
            {(m?.caches ?? []).length === 0 ? <div style={{opacity:.7}}>No CacheStorage entries.</div> :
              <ul>
                {m?.caches.map((c) => <li key={c}><code>{c}</code></li>)}
              </ul>}
          </div>
        </div>

        <div style={{marginTop:14}}>
          <h3 style={{marginTop:0}}>Environment</h3>
          <div style={{opacity:.85, wordBreak:"break-all"}}>{m?.ua}</div>
        </div>

        <div style={{marginTop:18, opacity:.9}}>
          <button style={{...btn, borderColor:"transparent", background:"#0b8"}} onClick={refresh}>
            {busy ?? "Refresh"}
          </button>
        </div>
      </div>
    </main>
  );
}
