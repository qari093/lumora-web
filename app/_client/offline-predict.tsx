"use client";
import React, { useEffect, useRef, useState } from "react";

type PredictItem = { id: string; emotion: string; score: number; duration: number; ts: number };

const box = (active: boolean) => ({
  position: "fixed" as const,
  bottom: 240,
  right: 14,
  zIndex: 9994,
  background: active ? "rgba(20,140,255,0.78)" : "rgba(30,30,40,0.72)",
  color: "#fff",
  padding: "8px 10px",
  borderRadius: 10,
  font: "600 12px/1.2 system-ui",
  boxShadow: "0 6px 22px rgba(0,0,0,.35)",
  backdropFilter: "blur(6px)",
  minWidth: 210
});

const btn = {
  border: "1px solid rgba(255,255,255,.3)",
  background: "transparent",
  color: "#fff",
  borderRadius: 8,
  padding: "4px 8px",
  cursor: "pointer",
  fontWeight: 700 as const
};

function getQ(): PredictItem[] {
  try {
    const raw = localStorage.getItem("predict:queue");
    return raw ? (JSON.parse(raw) as PredictItem[]) : [];
  } catch { return []; }
}
function setQ(v: PredictItem[]) {
  localStorage.setItem("predict:queue", JSON.stringify(v));
}

export default function OfflinePredict() {
  const [busy, setBusy] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const [mood, setMood] = useState<string>("neutral");
  const [seed, setSeed] = useState<string>(()=>String(Date.now()));
  const [last, setLast] = useState<string>("idle");
  const timer = useRef<number | null>(null);

  useEffect(() => {
    setCount(getQ().length);
    const id = window.setInterval(() => setCount(getQ().length), 1500);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const onHint = (e: any) => {
      const m = typeof e?.detail?.mood === "string" ? e.detail.mood : null;
      if (m) setMood(m);
    };
    window.addEventListener("lumora:emotion-hint", onHint as any);
    return () => window.removeEventListener("lumora:emotion-hint", onHint as any);
  }, []);

  const predict = async () => {
    if (busy) return;
    setBusy("Predicting…");
    try {
      const res = await fetch("/api/offline/predict", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mood, seed, limit: 8 })
      });
      const j = await res.json();
      if (j?.ok && Array.isArray(j.items)) {
        const q = getQ();
        const merged = [...q, ...j.items];
        setQ(merged);
        setCount(merged.length);
        setLast(`predicted +${j.items.length} (${mood})`);
        setSeed(String(Date.now()));
      } else {
        setLast("predict error");
      }
    } catch {
      setLast("predict error");
    } finally {
      setBusy(null);
    }
  };

  const merge = async () => {
    if (busy) return;
    const q = getQ();
    if (!q.length) { setLast("nothing to merge"); return; }
    setBusy("Merging…");
    try {
      const res = await fetch("/api/offline/predict", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mood, seed: "merge", queued: q, limit: 0 })
      });
      const j = await res.json();
      if (j?.ok) {
        setQ([]);
        setCount(0);
        setLast(`merged ${j.accepted} items`);
      } else {
        setLast("merge error");
      }
    } catch {
      setLast("merge error");
    } finally {
      setBusy(null);
    }
  };

  useEffect(() => {
    const on = () => {
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => {
        const auto = getQ();
        if (auto.length) merge();
      }, 1200);
    };
    window.addEventListener("online", on);
    return () => { if (timer.current) window.clearTimeout(timer.current); window.removeEventListener("online", on); };
  }, []);

  return (
    <div style={box(true)} title="Offline Predictive Feed">
      <div style={{ fontWeight: 800, marginBottom: 4 }}>Predictive Feed</div>
      <div style={{ opacity: .95 }}>Mood: <b>{mood}</b></div>
      <div style={{ opacity: .95 }}>Cached: <b>{count}</b></div>
      <div style={{ opacity: .8, marginTop: 4 }}>State: {last}</div>
      <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
        <button style={btn as any} onClick={predict}>{busy ?? "Predict"}</button>
        <button style={{ ...btn, borderColor: "transparent", background: "#0b8" }} onClick={merge}>Merge</button>
      </div>
    </div>
  );
}
