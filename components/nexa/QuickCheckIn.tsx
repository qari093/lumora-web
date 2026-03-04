"use client";

import React, { useEffect, useMemo, useState } from "react";

type Mood = "calm" | "focus" | "tired" | "energized" | "stressed";

const MOODS: { key: Mood; label: string }[] = [
  { key: "calm", label: "Calm" },
  { key: "focus", label: "Focus" },
  { key: "tired", label: "Tired" },
  { key: "energized", label: "Energized" },
  { key: "stressed", label: "Stressed" },
];

function dayKeyUTC(d = new Date()) {
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

type CheckIn = { day: string; mood: Mood; note?: string; ts: number };

function safeJsonParse<T>(s: string | null): T | null {
  if (!s) return null;
  try {
    return JSON.parse(s) as T;
  } catch {
    return null;
  }
}

export default function QuickCheckIn() {
  const today = useMemo(() => dayKeyUTC(), []);
  const [selected, setSelected] = useState<Mood>("calm");
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState<CheckIn | null>(null);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    try {
      const last = safeJsonParse<CheckIn>(localStorage.getItem("LUMORA_NEXA_LAST_CHECKIN"));
      if (last?.day) setSaved(last);
      const s = parseInt(localStorage.getItem("LUMORA_NEXA_STREAK") || "0", 10);
      setStreak(Number.isFinite(s) ? Math.max(0, s) : 0);
    } catch {}
  }, []);

  const computeNextStreak = () => {
    try {
      const last = safeJsonParse<CheckIn>(localStorage.getItem("LUMORA_NEXA_LAST_CHECKIN"));
      const lastDay = last?.day || "";
      if (!lastDay) return 1;
      if (lastDay === today) return parseInt(localStorage.getItem("LUMORA_NEXA_STREAK") || "0", 10) || 0;

      const lastDate = new Date(`${lastDay}T00:00:00Z`);
      const todayDate = new Date(`${today}T00:00:00Z`);
      const diffDays = Math.round((todayDate.getTime() - lastDate.getTime()) / (24 * 3600 * 1000));
      const current = parseInt(localStorage.getItem("LUMORA_NEXA_STREAK") || "0", 10) || 0;

      if (diffDays === 1) return current + 1;
      return 1;
    } catch {
      return 1;
    }
  };

  const save = () => {
    const entry: CheckIn = { day: today, mood: selected, note: note.trim().slice(0, 140) || undefined, ts: Date.now() };
    try {
      localStorage.setItem("LUMORA_NEXA_LAST_CHECKIN", JSON.stringify(entry));
      const ns = computeNextStreak();
      localStorage.setItem("LUMORA_NEXA_STREAK", String(ns));
      setStreak(ns);
      setSaved(entry);
    } catch {
      setSaved(entry);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold">Quick Check-in</div>
          <div className="text-xs opacity-70">One tap. Saves locally. Makes NEXA feel real immediately.</div>
        </div>
        <div className="text-right text-xs opacity-70">
          <div data-testid="nexa-checkin-day">{today}</div>
          <div>
            streak <span data-testid="nexa-streak" className="font-semibold">{streak}</span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {MOODS.map((m) => (
          <button
            key={m.key}
            type="button"
            data-testid={`nexa-mood-${m.key}`}
            onClick={() => setSelected(m.key)}
            className={`rounded-xl px-3 py-2 text-sm transition active:scale-[0.99] ${
              selected === m.key ? "bg-white/15 border border-white/20" : "bg-white/5 border border-white/10 hover:bg-white/10"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="mt-3">
        <label className="block text-xs opacity-70">Note (optional)</label>
        <input
          data-testid="nexa-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="1 sentence…"
          className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
          maxLength={140}
        />
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          data-testid="nexa-save"
          onClick={save}
          className="rounded-xl bg-white/10 px-3 py-2 text-sm hover:bg-white/15 active:scale-[0.99]"
        >
          Save check-in
        </button>
        {saved?.day === today && (
          <div data-testid="nexa-saved" className="text-xs opacity-70">
            saved: <span className="font-medium">{saved.mood}</span>{saved.note ? ` • ${saved.note}` : ""}
          </div>
        )}
      </div>

      <div id="LUMORA_NEXA_USABLE_SURFACE" style={{ display: "none" }}>alive</div>
    </div>
  );
}
