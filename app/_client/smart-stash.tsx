"use client";
import { useEffect, useState } from "react";

const MAX_VIDEO_CACHE_MB = 500;   // hard limit for video cache
const MAX_AD_CACHE_MB = 50;       // hard limit for ad cache
const CHECK_INTERVAL_MS = 10_000; // every 10s

export default function SmartStashManager() {
  const [usage, setUsage] = useState<{ used: number; quota: number }>({ used: 0, quota: 0 });
  const [alert, setAlert] = useState<string>("");

  async function estimateStorage() {
    if (navigator.storage && navigator.storage.estimate) {
      const e = await navigator.storage.estimate();
      const used = e.usage ?? 0;
      const quota = e.quota ?? 0;
      setUsage({ used, quota });
      const usedMB = used / (1024 * 1024);
      const quotaMB = quota / (1024 * 1024);
      const pct = (usedMB / quotaMB) * 100;
      if (pct > 90) setAlert("⚠ Storage nearly full, auto-purging...");
      else if (pct > 75) setAlert("🟡 Storage high — trimming soon");
      else setAlert("");
    }
  }

  async function purgeStash() {
    const cachesToTrim = ["videos", "echo-ads-v0.2"];
    for (const key of cachesToTrim) {
      const c = await caches.open(key).catch(() => null);
      if (!c) continue;
      const keys = await c.keys();
      const trimCount = Math.ceil(keys.length / 2);
      for (let i = 0; i < trimCount; i++) await c.delete(keys[i]);
      console.log("💾 Purged", trimCount, "entries from", key);
    }
    setAlert("🧹 Auto-purge done");
    await estimateStorage();
  }

  useEffect(() => {
    estimateStorage();
    const t = setInterval(estimateStorage, CHECK_INTERVAL_MS);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (alert.startsWith("⚠")) purgeStash();
  }, [alert]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 150,
        right: 14,
        zIndex: 9996,
        background: "rgba(18,18,26,0.75)",
        color: "#fff",
        borderRadius: 10,
        padding: "8px 12px",
        font: "600 12px/1.2 system-ui",
        maxWidth: 260,
      }}
    >
      <div>Smart Stash</div>
      <div style={{ fontWeight: 400, opacity: 0.85 }}>
        Used: {(usage.used / 1048576).toFixed(1)} MB /{" "}
        {(usage.quota / 1048576).toFixed(1)} MB
      </div>
      {alert && (
        <div style={{ marginTop: 6, color: alert.startsWith("⚠") ? "#f66" : "#ffb347" }}>
          {alert}
        </div>
      )}
      <button
        onClick={purgeStash}
        style={{
          marginTop: 8,
          background: "#0b8",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "4px 8px",
          cursor: "pointer",
        }}
      >
        Manual Purge
      </button>
    </div>
  );
}
