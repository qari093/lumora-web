"use client";
import React, { useEffect, useRef, useState } from "react";

type RepairEvent = {
  ts: number;
  kind: "error" | "rejection" | "manual";
  message: string;
  healed?: boolean;
  attempt?: number;
};

const KEY = "aiFaultHealer:v1";
const MAX_WINDOW = 300000; // 5 min
const THRESHOLD = 3;       // 3 errors in window triggers heal
const COOLDOWN = 60000;    // 60s between heals

function now(){ return Date.now(); }

function readLog(): RepairEvent[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
function writeLog(items: RepairEvent[]) {
  try { localStorage.setItem(KEY, JSON.stringify(items.slice(-100))); } catch {}
}
function withinWindow(items: RepairEvent[], ms:number) {
  const t = now() - ms; return items.filter(x => x.ts >= t);
}

async function softHeal() {
  try {
    Object.keys(localStorage).forEach(k => {
      if (k.startsWith("mq:") || k.startsWith("stash:") || k.startsWith("orderhash:") || k.startsWith("statecapsule:tmp")) {
        localStorage.removeItem(k);
      }
    });
  } catch {}
  try {
    if ("caches" in window) {
      const names = await caches.keys();
      for (const n of names) {
        if (n.includes("lumora") || n.includes("offline") || n.includes("fyp") || n.includes("ads")) {
          await caches.delete(n);
        }
      }
    }
  } catch {}
}

async function hardHeal() {
  await softHeal();
  try {
    if ("serviceWorker" in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      for (const reg of regs) { await reg.unregister(); }
      setTimeout(() => location.reload(), 1200);
    }
  } catch {
    setTimeout(() => location.reload(), 1200);
  }
}

export default function AIFaultHealer(){
  const [status, setStatus] = useState<"idle"|"watching"|"cooldown"|"healed">("watching");
  const lastHealRef = useRef(0);
  const attemptsRef = useRef(0);

  useEffect(() => {
    function record(kind:"error"|"rejection", message:string){
      const items = readLog();
      items.push({ ts: now(), kind, message });
      writeLog(items);
      const recent = withinWindow(items, MAX_WINDOW);
      const errCount = recent.filter(x => x.kind === "error" || x.kind === "rejection").length;

      if (errCount >= THRESHOLD && now() - lastHealRef.current > COOLDOWN){
        attemptsRef.current += 1;
        setStatus("cooldown");
        softHeal().then(async () => {
          const ev:RepairEvent = { ts: now(), kind:"manual", message:"softHeal", healed:true, attempt: attemptsRef.current };
          const log = readLog(); log.push(ev); writeLog(log);
          try {
            await fetch("/api/offline/repair-log", { method:"POST", headers:{ "content-type":"application/json" }, body: JSON.stringify({ event: ev }) });
          } catch {}
          lastHealRef.current = now();
          setStatus("healed");
          if (attemptsRef.current >= 2){
            hardHeal();
          } else {
            setTimeout(() => setStatus("watching"), 3000);
          }
        });
      }
    }

    const onError = (e: ErrorEvent) => record("error", String(e?.message || "error"));
    const onRej = (e: PromiseRejectionEvent) => record("rejection", String((e as any)?.reason || "rejection"));

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRej);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRej);
    };
  }, []);

  return (
    <div style={{
      position:"fixed", right:14, bottom:60, zIndex: 9995,
      background: status==="cooldown" ? "rgba(255,120,0,.85)" : status==="healed" ? "rgba(20,160,80,.85)" : "rgba(30,30,40,.75)",
      color:"#fff", padding:"6px 10px", borderRadius:10, font:"600 12px/1.2 system-ui",
      boxShadow:"0 6px 18px rgba(0,0,0,.35)", backdropFilter:"blur(6px)"
    }} title="AI Fault Healer">
      Healer: {status}
    </div>
  );
}
