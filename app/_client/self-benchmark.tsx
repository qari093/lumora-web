"use client";
import React, { useEffect, useRef, useState } from "react";

const box = {
  position: "fixed" as const,
  bottom: 280,
  left: 12,
  zIndex: 2147483000,
  background: "rgba(15,15,22,.78)",
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

async function calcCompressionRatio(): Promise<number | null> {
  try {
    // Prefer native CompressionStream if present
    const sample = new TextEncoder().encode(JSON.stringify({
      t: Date.now(),
      arr: Array.from({ length: 400 }, (_, i) => i % 9 ? "x" : "xxxxxxxx"),
    }));
    if (typeof (globalThis as any).CompressionStream !== "undefined") {
      const cs = new (globalThis as any).CompressionStream("gzip");
      const s = new Blob([sample]).stream().pipeThrough(cs);
      const out = await new Response(s).arrayBuffer();
      return (out.byteLength / sample.byteLength);
    } else {
      // Fallback: naive run-length like estimate
      let runs = 1;
      for (let i = 1; i < sample.length; i++) if (sample[i] !== sample[i - 1]) runs++;
      const estCompressed = runs * 2;
      return estCompressed / sample.length;
    }
  } catch {
    return null;
  }
}

async function countCacheEntries(): Promise<number> {
  try {
    if (!("caches" in globalThis)) return 0;
    const names = await caches.keys();
    let total = 0;
    for (const n of names) {
      const c = await caches.open(n);
      const keys = await c.keys();
      total += keys.length;
    }
    return total;
  } catch {
    return 0;
  }
}

function readQueueLens(): Record<string, number> {
  try {
    const keys = Object.keys(localStorage);
    const lanes = ["metrics:", "batch:", "predict:", "delta:", "offline:rewards"];
    const out: Record<string, number> = {};
    for (const lane of lanes) {
      const k = lane === "offline:rewards" ? "offline:rewards" : keys.find(x => x.startsWith(lane));
      if (!k) { out[lane] = 0; continue; }
      try {
        const v = localStorage.getItem(k)!;
        const parsed = JSON.parse(v);
        if (Array.isArray(parsed)) out[lane] = parsed.length;
        else if (parsed && typeof parsed === "object" && Array.isArray((parsed as any).items)) out[lane] = (parsed as any).items.length;
        else out[lane] = typeof parsed?.length === "number" ? parsed.length : 1;
      } catch { out[lane] = 1; }
    }
    return out;
  } catch {
    return {};
  }
}

export default function SelfBenchmark() {
  const [busy, setBusy] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [cacheEntries, setCacheEntries] = useState<number>(0);
  const [ratio, setRatio] = useState<number | null>(null);
  const [advice, setAdvice] = useState<string>("Idle");
  const autoRef = useRef<boolean>(false);
  const tickRef = useRef<number | null>(null);

  const run = async () => {
    if (busy) return;
    setBusy("Running…");
    try {
      const t0 = performance.now();
      // Lightweight ping by hitting benchmark endpoint with empty payload
      await fetch("/api/offline/benchmark", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ts: Date.now(), results: {} }) });
      const t1 = performance.now();
      const lat = Math.round(t1 - t0);
      setLatency(lat);

      const ce = await countCacheEntries();
      setCacheEntries(ce);

      const rr = await calcCompressionRatio();
      setRatio(rr);

      const queues = readQueueLens();

      const payload = {
        ts: Date.now(),
        results: {
          latency_ms: lat,
          cache_entries: ce,
          compress_ratio: rr ?? null,
          queues,
          user_agent: navigator.userAgent,
        },
      };

      const res = await fetch("/api/offline/benchmark", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await res.json();
      if (j?.ok) {
        setScore(j.score ?? null);
        setAdvice(String(j.advice || "OK"));
      } else {
        setAdvice("Server rejected");
      }
    } catch {
      setAdvice("Error");
    } finally {
      setBusy(null);
    }
  };

  const toggleAuto = () => {
    autoRef.current = !autoRef.current;
    if (tickRef.current) window.clearInterval(tickRef.current);
    if (autoRef.current) {
      run();
      tickRef.current = window.setInterval(run, 15000);
    }
  };

  useEffect(() => {
    return () => { if (tickRef.current) window.clearInterval(tickRef.current); };
  }, []);

  return (
    <div style={box} title="Self-Benchmark Layer">
      <div style={{ fontWeight: 800, marginBottom: 6 }}>Offline Self-Benchmark</div>
      <div>Score: <b>{score ?? "—"}</b></div>
      <div>Latency: <b>{latency != null ? `${latency} ms` : "—"}</b></div>
      <div>Caches: <b>{cacheEntries}</b></div>
      <div>Compress: <b>{ratio != null ? `${Math.round(ratio * 100)}%` : "—"}</b></div>
      <div style={{ opacity: .85, marginTop: 6 }}>{advice}</div>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button style={btn as any} onClick={run}>{busy ?? "Run"}</button>
        <button style={{ ...btn, borderColor: "transparent", background: "#0b8" }} onClick={toggleAuto}>Auto</button>
      </div>
    </div>
  );
}
