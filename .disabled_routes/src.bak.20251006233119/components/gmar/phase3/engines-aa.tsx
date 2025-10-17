"use client";
import React, { useEffect, useState } from "react";

/** Minimal shared types for engines */
export type Settings = { difficulty: "easy" | "normal" | "hard"; sfx?: boolean; haptics?: boolean; leftHanded?: boolean };
export type Inventory = { coins: number; items: { id: string; qty: number }[] };
export type EP = {
  paused?: boolean;
  onScore: (n: number) => void;
  onCoin?: (n: number) => void;
  settings: Settings;
  inventory: Inventory;
};

/** LocalStorage helpers (self-contained) */
const COIN_KEY = "gmar.wallet.coins";
function loadCoins(): number {
  try { const n = Number(JSON.parse(localStorage.getItem(COIN_KEY) || "0")); return Number.isFinite(n) ? n : 0; } catch { return 0; }
}
function saveCoins(n: number) { try { localStorage.setItem(COIN_KEY, JSON.stringify(Math.max(0, n))); } catch {} }
function addCoins(n: number) { const cur = loadCoins() + n; saveCoins(cur); return cur; }

/** Difficulty scale */
const diffTick = (d: Settings["difficulty"]) => (d === "easy" ? 1 : d === "normal" ? 2 : 3);

/* ───────────────── Zen Fortress — Tower Defense (stub) ───────────────── */
export function ZenFortress(p: EP) {
  const [wave, setWave] = useState(1);
  const [kills, setKills] = useState(0);
  useEffect(() => {
    if (p.paused) return;
    const id = setInterval(() => {
      const inc = Math.floor(Math.random() * (1 + diffTick(p.settings.difficulty)));
      setKills(k => k + inc);
      if (Math.random() < 0.22) { setWave(w => w + 1); addCoins(1); p.onCoin?.(1); }
      p.onScore(wave * 10 + kills);
    }, 1500);
    return () => clearInterval(id);
  }, [p.paused, p.settings.difficulty, kills, wave]);
  return (
    <div style={{ padding: 16, textAlign: "center" }}>
      <h2>Zen Fortress 🏰</h2>
      <div>Wave <b>{wave}</b> · Kills <b>{kills}</b></div>
      <div style={{ opacity: .7, fontSize: 12, marginTop: 6 }}>Stub: waves progress automatically; coins on wave clear.</div>
    </div>
  );
}

/* ──────────────── Zen Rogue Legacy — Rogue/Survival (stub) ──────────────── */
export function ZenRogue(p: EP) {
  const [floor, setFloor] = useState(1);
  const [loot, setLoot] = useState(0);
  useEffect(() => {
    if (p.paused) return;
    const id = setInterval(() => {
      setFloor(f => f + 1);
      setLoot(l => l + Math.floor(Math.random() * (1 + diffTick(p.settings.difficulty))));
      p.onScore(floor * 5 + loot);
      if ((loot + 1) % 4 === 0) { addCoins(1); p.onCoin?.(1); }
    }, 2000);
    return () => clearInterval(id);
  }, [p.paused, p.settings.difficulty, floor, loot]);
  return (
    <div style={{ padding: 16, textAlign: "center" }}>
      <h2>Zen Rogue Legacy ⚔️</h2>
      <div>Floor <b>{floor}</b> · Loot <b>{loot}</b></div>
      <div style={{ opacity: .7, fontSize: 12, marginTop: 6 }}>Stub: endless dungeon loop; coins every few loot ticks.</div>
    </div>
  );
}

/* ─────────────────────── Zen War Nexus — MOBA (stub) ────────────────────── */
export function ZenWarNexus(p: EP) {
  const [t, setT] = useState(0);
  const [kills, setKills] = useState(0);
  useEffect(() => {
    if (p.paused) return;
    const id = setInterval(() => {
      setT(x => x + 1);
      if (Math.random() < 0.4) { setKills(k => k + 1); p.onScore(kills + t); }
      if (t > 0 && t % 60 === 0) { addCoins(1); p.onCoin?.(1); }
    }, 1000);
    return () => clearInterval(id);
  }, [p.paused, t, kills, p.settings.difficulty]);
  return (
    <div style={{ padding: 16, textAlign: "center" }}>
      <h2>Zen War Nexus ⚔️</h2>
      <div>Match Time <b>{t}s</b> · Kills <b>{kills}</b></div>
      <div style={{ opacity: .7, fontSize: 12, marginTop: 6 }}>Stub: evolving match timer; coins on time milestones.</div>
    </div>
  );
}
